import { createCipheriv, createDecipheriv, createHmac, randomBytes } from 'node:crypto'
import { pool, transaction } from '../config/db.js'
import { config } from '../config/env.js'
import { createSession } from './session.service.js'
import { opaqueToken, tokenHash } from '../utils/security.js'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const key = config.mfaEncryptionKey ? Buffer.from(config.mfaEncryptionKey, 'base64url') : null
if (key && key.length !== 32) throw new Error('MFA_ENCRYPTION_KEY debe contener 32 bytes')

function base32(bytes) {
  let bits = 0,
    value = 0,
    result = ''
  for (const byte of bytes) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      result += alphabet[(value >>> (bits -= 5)) & 31]
    }
  }
  if (bits) result += alphabet[(value << (5 - bits)) & 31]
  return result
}

function fromBase32(value) {
  let bits = 0,
    buffer = 0
  const bytes = []
  for (const char of value) {
    const index = alphabet.indexOf(char)
    if (index < 0) throw new Error('Secreto MFA inválido')
    buffer = (buffer << 5) | index
    bits += 5
    if (bits >= 8) {
      bytes.push((buffer >>> (bits -= 8)) & 255)
    }
  }
  return Buffer.from(bytes)
}

function encrypt(secret) {
  if (!key) throw new Error('Configura MFA_ENCRYPTION_KEY para usar MFA')
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()])
  return `${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${ciphertext.toString('base64url')}`
}

function decrypt(value) {
  if (!key) throw new Error('Configura MFA_ENCRYPTION_KEY para usar MFA')
  const [iv, tag, ciphertext] = value.split('.').map((part) => Buffer.from(part, 'base64url'))
  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
}

function totp(secret, counter) {
  const message = Buffer.alloc(8)
  message.writeBigUInt64BE(BigInt(counter))
  const digest = createHmac('sha1', fromBase32(secret)).update(message).digest()
  const offset = digest[digest.length - 1] & 15
  return ((digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).toString().padStart(6, '0')
}

function matchingCounter(secret, code, lastCounter = -1) {
  if (!/^\d{6}$/.test(code)) return null
  const current = Math.floor(Date.now() / 30_000)
  for (const counter of [current - 1, current, current + 1]) {
    if (counter > Number(lastCounter ?? -1) && totp(secret, counter) === code) return counter
  }
  return null
}

export async function mfaStatus(accountId) {
  const { rows } = await pool.query(
    'SELECT mfa_enabled_at,mfa_secret_ciphertext FROM accounts WHERE id=$1',
    [accountId],
  )
  return {
    enabled: Boolean(rows[0]?.mfa_enabled_at),
    setupPending: Boolean(rows[0]?.mfa_secret_ciphertext && !rows[0]?.mfa_enabled_at),
  }
}

export async function beginMfaSetup(accountId) {
  if (!key) throw new Error('Configura MFA_ENCRYPTION_KEY para usar MFA')
  const { rows } = await pool.query('SELECT email,mfa_enabled_at FROM accounts WHERE id=$1', [
    accountId,
  ])
  if (!rows[0] || rows[0].mfa_enabled_at) return null
  const secret = base32(randomBytes(20))
  await pool.query(
    'UPDATE accounts SET mfa_secret_ciphertext=$1,mfa_last_counter=NULL WHERE id=$2',
    [encrypt(secret), accountId],
  )
  const provisioningUri = `otpauth://totp/${encodeURIComponent(`Hongus:${rows[0].email}`)}?secret=${secret}&issuer=Hongus&algorithm=SHA1&digits=6&period=30`
  return { secret, provisioningUri }
}

async function consumeFactor(client, account, code) {
  if (typeof code !== 'string' || !account.mfa_secret_ciphertext) return false
  const counter = matchingCounter(
    decrypt(account.mfa_secret_ciphertext),
    code,
    account.mfa_last_counter,
  )
  if (counter !== null) {
    await client.query('UPDATE accounts SET mfa_last_counter=$1 WHERE id=$2', [counter, account.id])
    return true
  }
  if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) return false
  const { rowCount } = await client.query(
    'UPDATE mfa_recovery_codes SET used_at=now() WHERE account_id=$1 AND code_hash=$2 AND used_at IS NULL',
    [account.id, tokenHash(code)],
  )
  return rowCount === 1
}

export async function enableMfa(accountId, code) {
  return transaction(async (client) => {
    const { rows } = await client.query('SELECT * FROM accounts WHERE id=$1 FOR UPDATE', [
      accountId,
    ])
    const account = rows[0]
    if (!account?.mfa_secret_ciphertext || account.mfa_enabled_at) return null
    const counter = matchingCounter(decrypt(account.mfa_secret_ciphertext), code)
    if (counter === null) return null
    const recoveryCodes = Array.from(
      { length: 8 },
      () =>
        `${base32(randomBytes(3)).slice(0, 4)}-${base32(randomBytes(3)).slice(0, 4)}-${base32(randomBytes(3)).slice(0, 4)}`,
    )
    await client.query('UPDATE accounts SET mfa_enabled_at=now(),mfa_last_counter=$1 WHERE id=$2', [
      counter,
      accountId,
    ])
    await client.query('DELETE FROM mfa_recovery_codes WHERE account_id=$1', [accountId])
    for (const recovery of recoveryCodes)
      await client.query('INSERT INTO mfa_recovery_codes(account_id,code_hash) VALUES($1,$2)', [
        accountId,
        tokenHash(recovery),
      ])
    return recoveryCodes
  })
}

export async function disableMfa(accountId, code) {
  return transaction(async (client) => {
    const { rows } = await client.query('SELECT * FROM accounts WHERE id=$1 FOR UPDATE', [
      accountId,
    ])
    const account = rows[0]
    if (!account?.mfa_enabled_at || !(await consumeFactor(client, account, code))) return false
    await client.query(
      'UPDATE accounts SET mfa_enabled_at=NULL,mfa_secret_ciphertext=NULL,mfa_last_counter=NULL WHERE id=$1',
      [accountId],
    )
    await client.query('DELETE FROM mfa_recovery_codes WHERE account_id=$1', [accountId])
    return true
  })
}

export async function createMfaChallenge(accountId) {
  const token = opaqueToken()
  await pool.query(
    "INSERT INTO mfa_challenges(token_hash,account_id,expires_at) VALUES($1,$2,now()+interval '5 minutes')",
    [tokenHash(token), accountId],
  )
  return token
}

export async function completeMfaChallenge(token, code, req) {
  return transaction(async (client) => {
    const { rows: challenges } = await client.query(
      'SELECT * FROM mfa_challenges WHERE token_hash=$1 AND consumed_at IS NULL AND expires_at>now() FOR UPDATE',
      [tokenHash(token)],
    )
    if (!challenges.length) return null
    const { rows: accounts } = await client.query('SELECT * FROM accounts WHERE id=$1 FOR UPDATE', [
      challenges[0].account_id,
    ])
    const account = accounts[0]
    if (
      !account?.mfa_enabled_at ||
      !account.email_verified_at ||
      !(await consumeFactor(client, account, code))
    )
      return null
    await client.query('UPDATE mfa_challenges SET consumed_at=now() WHERE token_hash=$1', [
      tokenHash(token),
    ])
    return { account, session: await createSession(client, account.id, req) }
  })
}
