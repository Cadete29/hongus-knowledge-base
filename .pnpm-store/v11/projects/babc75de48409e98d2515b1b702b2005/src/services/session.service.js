import { randomUUID, timingSafeEqual } from 'node:crypto'
import { config } from '../config/env.js'
import { pool, transaction } from '../config/db.js'
import { opaqueToken, tokenHash } from '../utils/security.js'

const sessionName = config.production ? '__Host-hongus_session' : 'hongus_session'
const csrfName = config.production ? '__Host-hongus_csrf' : 'hongus_csrf'
const cookieOptions = { secure: config.production, sameSite: 'lax', path: '/' }
const sevenDays = 7 * 24 * 60 * 60 * 1000

function cookie(req, name) {
  const part = req
    .get('cookie')
    ?.split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${name}=`))
  return part?.slice(name.length + 1) || null
}

export function sessionToken(req) {
  return cookie(req, sessionName)
}
export function csrfValid(req, session) {
  const fromHeader = req.get('x-csrf-token')
  const fromCookie = cookie(req, csrfName)
  if (!session?.csrf_hash || !fromHeader || !fromCookie || fromHeader !== fromCookie) return false
  const actual = Buffer.from(tokenHash(fromHeader), 'hex')
  const expected = Buffer.from(session.csrf_hash, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export function setSessionCookies(res, session) {
  res.cookie(sessionName, session.token, { ...cookieOptions, httpOnly: true, maxAge: sevenDays })
  res.cookie(csrfName, session.csrf, { ...cookieOptions, httpOnly: false, maxAge: sevenDays })
}

export function clearSessionCookies(res) {
  res.clearCookie(sessionName, { ...cookieOptions, httpOnly: true })
  res.clearCookie(csrfName, { ...cookieOptions, httpOnly: false })
}

export async function createSession(db, accountId, req, familyId = null) {
  const id = randomUUID(),
    token = opaqueToken(),
    csrf = opaqueToken()
  await db.query(
    "INSERT INTO sessions(id,account_id,token_hash,csrf_hash,family_id,ip_address,user_agent,expires_at) VALUES($1,$2,$3,$4,$5,$6,$7,now()+interval '7 days')",
    [
      id,
      accountId,
      tokenHash(token),
      tokenHash(csrf),
      familyId || id,
      req.ip || null,
      req.get('user-agent')?.slice(0, 512) || null,
    ],
  )
  return { id, token, csrf }
}

export async function findActiveSession(req) {
  const token = sessionToken(req)
  if (!token) return null
  const { rows } = await pool.query(
    'SELECT s.*,a.name,a.email,a.account_type,a.email_verified_at FROM sessions s JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=$1 AND s.revoked_at IS NULL AND s.expires_at>now()',
    [tokenHash(token)],
  )
  return rows[0] || null
}

export async function rotateSession(req) {
  const token = sessionToken(req)
  if (!token) return { error: 'UNAUTHENTICATED' }
  return transaction(async (client) => {
    const { rows } = await client.query('SELECT * FROM sessions WHERE token_hash=$1 FOR UPDATE', [
      tokenHash(token),
    ])
    const old = rows[0]
    if (!old || !csrfValid(req, old)) return { error: 'UNAUTHENTICATED' }
    if (old.revoked_reason === 'rotated') {
      await client.query(
        "UPDATE sessions SET revoked_at=COALESCE(revoked_at,now()),revoked_reason='replay' WHERE family_id=$1 AND revoked_at IS NULL",
        [old.family_id],
      )
      return { error: 'SESSION_REPLAY' }
    }
    if (old.revoked_at || new Date(old.expires_at) <= new Date())
      return { error: 'UNAUTHENTICATED' }
    const session = await createSession(client, old.account_id, req, old.family_id)
    await client.query(
      "UPDATE sessions SET revoked_at=now(),revoked_reason='rotated',replaced_by_id=$1 WHERE id=$2",
      [session.id, old.id],
    )
    return { session }
  })
}
