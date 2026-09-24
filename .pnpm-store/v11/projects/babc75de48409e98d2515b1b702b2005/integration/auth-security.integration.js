import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { test } from 'node:test'
import app from '../src/app.js'
import { config } from '../src/config/env.js'
import { legalEvidence } from '../src/config/legal.js'
import { pool } from '../src/config/db.js'
import { hashPassword } from '../src/utils/security.js'

test('sesiones, CSRF, rotación, reutilización y MFA', async () => {
  const accountId = randomUUID()
  const email = `security-${accountId}@example.test`
  const legalEmail = `legal-${accountId}@example.test`
  const password = 'SecureTestPassword123!'
  const server = app.listen(0)
  const base = `http://127.0.0.1:${server.address().port}/api/v1`

  async function request(path, method = 'GET', body, cookies = {}, csrf) {
    const response = await fetch(`${base}${path}`, {
      method,
      headers: {
        ...(method !== 'GET'
          ? { Origin: config.appOrigin, 'Content-Type': 'application/json' }
          : {}),
        ...(Object.keys(cookies).length
          ? {
              Cookie: Object.entries(cookies)
                .map(([name, value]) => `${name}=${value}`)
                .join('; '),
            }
          : {}),
        ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })
    const nextCookies = { ...cookies }
    for (const setCookie of response.headers.getSetCookie()) {
      const [name, value] = setCookie.split(';')[0].split('=')
      nextCookies[name] = value
    }
    return {
      status: response.status,
      data: response.status === 204 ? null : await response.json(),
      cookies: nextCookies,
    }
  }

  try {
    const registration = {
      name: 'Legal Test',
      email: legalEmail,
      password,
      birthDate: '2000-01-01',
      accountType: 'student',
      consentAccepted: true,
    }
    assert.equal(
      (await request('/accounts', 'POST', { ...registration, consentAccepted: false })).status,
      400,
    )
    const registered = await request('/accounts', 'POST', registration)
    assert.equal(registered.status, 201)
    assert.equal(registered.data.status, 'onboarding')
    assert.match(registered.data.onboardingToken, /^[A-Za-z0-9_-]{43}$/)
    const { rows: beforeOnboardingMail } = await pool.query(
      'SELECT id FROM email_outbox WHERE account_id=(SELECT id FROM accounts WHERE email=$1)',
      [legalEmail],
    )
    assert.equal(beforeOnboardingMail.length, 0)
    assert.equal((await request('/sessions', 'POST', { email: legalEmail, password })).status, 403)
    const onboarding = await request('/accounts/onboarding', 'POST', {
      onboardingToken: registered.data.onboardingToken,
      intendedPlan: 'student',
      accreditation: {
        institution: 'Universidad de prueba',
        academicLevel: 'Universidad',
        evidenceName: 'constancia.pdf',
      },
    })
    assert.equal(onboarding.status, 200)
    assert.equal((await request('/sessions', 'POST', { email: legalEmail, password })).status, 403)
    assert.equal(
      (await request('/email-confirmations', 'POST', { token: 'A'.repeat(43) })).status,
      400,
    )
    const { rows: legalRows } = await pool.query(
      'SELECT terms_version,terms_sha256,privacy_version,privacy_sha256 FROM accounts WHERE email=$1',
      [legalEmail],
    )
    assert.equal(legalRows[0].terms_version, legalEvidence.termsVersion)
    assert.equal(legalRows[0].terms_sha256, legalEvidence.termsHash)
    assert.equal(legalRows[0].privacy_version, legalEvidence.privacyVersion)
    assert.equal(legalRows[0].privacy_sha256, legalEvidence.privacyHash)

    await pool.query(
      "INSERT INTO accounts(id,name,email,password_hash,birth_date,account_type,email_verified_at) VALUES($1,'Security Test',$2,$3,'2000-01-01','student',now())",
      [accountId, email, await hashPassword(password)],
    )
    let login = await request('/sessions', 'POST', { email, password })
    assert.equal(login.status, 200)
    const csrfName = config.production ? '__Host-hongus_csrf' : 'hongus_csrf'
    const csrf = login.cookies[csrfName]
    assert.ok(csrf)
    assert.equal(
      (await request('/sessions/current', 'DELETE', undefined, login.cookies)).status,
      403,
    )
    assert.equal((await request('/sessions/current', 'GET', undefined, login.cookies)).status, 200)

    const oldCookies = { ...login.cookies }
    const refreshed = await request('/sessions/refresh', 'POST', {}, login.cookies, csrf)
    assert.equal(refreshed.status, 200)
    assert.notDeepEqual(refreshed.cookies, oldCookies)
    assert.equal((await request('/sessions/current', 'GET', undefined, oldCookies)).status, 401)
    assert.equal((await request('/sessions/refresh', 'POST', {}, oldCookies, csrf)).status, 403)
    assert.equal(
      (await request('/sessions/current', 'GET', undefined, refreshed.cookies)).status,
      401,
    )

    login = await request('/sessions', 'POST', { email, password })
    assert.equal(login.status, 200)
    const setup = await request('/mfa/setup', 'POST', {}, login.cookies, login.cookies[csrfName])
    assert.equal(setup.status, 200)
    assert.match(setup.data.secret, /^[A-Z2-7]+$/)
    assert.match(setup.data.provisioningUri, /^otpauth:\/\/totp\//)
    const secret = setup.data.secret
    const { createHmac } = await import('node:crypto')
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    let bits = 0,
      value = 0
    const bytes = []
    for (const char of secret) {
      value = (value << 5) | alphabet.indexOf(char)
      bits += 5
      if (bits >= 8) bytes.push((value >>> (bits -= 8)) & 255)
    }
    const counter = Buffer.alloc(8)
    counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30_000)))
    const digest = createHmac('sha1', Buffer.from(bytes)).update(counter).digest()
    const offset = digest[digest.length - 1] & 15
    const code = ((digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000)
      .toString()
      .padStart(6, '0')
    const enabled = await request(
      '/mfa/enable',
      'POST',
      { code },
      login.cookies,
      login.cookies[csrfName],
    )
    assert.equal(enabled.status, 200)
    assert.equal(enabled.data.recoveryCodes.length, 8)
    assert.equal(
      (
        await request(
          '/sessions/current',
          'DELETE',
          undefined,
          login.cookies,
          login.cookies[csrfName],
        )
      ).status,
      204,
    )

    const challenge = await request('/sessions', 'POST', { email, password })
    assert.equal(challenge.data.mfaRequired, true)
    assert.equal(
      (
        await request('/sessions/mfa', 'POST', {
          mfaToken: challenge.data.mfaToken,
          code: '000000',
        })
      ).status,
      401,
    )
    const completed = await request('/sessions/mfa', 'POST', {
      mfaToken: challenge.data.mfaToken,
      code: enabled.data.recoveryCodes[0],
    })
    assert.equal(completed.status, 200)
    assert.equal(
      (await request('/sessions/current', 'GET', undefined, completed.cookies)).status,
      200,
    )
  } finally {
    await pool.query('DELETE FROM accounts WHERE email=$1', [legalEmail])
    await pool.query('DELETE FROM accounts WHERE id=$1', [accountId])
    await new Promise((resolve) => server.close(resolve))
    await pool.end()
  }
})
