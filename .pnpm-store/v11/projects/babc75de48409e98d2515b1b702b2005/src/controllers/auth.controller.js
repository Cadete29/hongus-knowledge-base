import { randomUUID } from 'node:crypto'
import { config } from '../config/env.js'
import { legalEvidence } from '../config/legal.js'
import { pool, transaction } from '../config/db.js'
import { deliverPending, queueEmail } from '../services/email.service.js'
import { throttle } from '../services/auth.service.js'
import {
  clearSessionCookies,
  createSession as storeSession,
  csrfValid,
  findActiveSession,
  rotateSession,
  sessionToken,
  setSessionCookies,
} from '../services/session.service.js'
import {
  beginMfaSetup,
  completeMfaChallenge,
  createMfaChallenge,
  disableMfa,
  enableMfa,
  mfaStatus,
} from '../services/mfa.service.js'
import {
  accountTypes,
  hashPassword,
  isAdult,
  opaqueToken,
  passwordNeedsRehash,
  tokenHash,
  validEmail,
  verifyPassword,
} from '../utils/security.js'

const error = (res, status, code, message) => res.status(status).json({ error: { code, message } })
const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '')
const publicAccount = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  accountType: row.account_type,
  emailVerified: Boolean(row.email_verified_at),
})
export const health = async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok' })
  } catch {
    error(res, 503, 'DATABASE_UNAVAILABLE', 'Base de datos no disponible')
  }
}

export const register = async (req, res, next) => {
  try {
    const { name, password, birthDate, accountType } = req.body || {}
    const email = normalizeEmail(req.body?.email)
    if (!(await throttle(req, `register:${email}`, 5)))
      return error(res, 429, 'RATE_LIMITED', 'Intenta más tarde')
    if (
      typeof name !== 'string' ||
      name.trim().length < 2 ||
      name.trim().length > 120 ||
      !validEmail(email) ||
      typeof password !== 'string' ||
      password.length < 12 ||
      password.length > 128 ||
      !isAdult(birthDate) ||
      !accountTypes.has(accountType)
    )
      return error(
        res,
        400,
        'INVALID_INPUT',
        'Revisa nombre, correo, contraseña, fecha de nacimiento y tipo de cuenta',
      )
    const passwordHash = await hashPassword(password)
    const accountId = randomUUID(),
      onboardingToken = opaqueToken()
    try {
      await transaction(async (client) => {
        await client.query(
          `INSERT INTO accounts (
             id,
             name,
             email,
             password_hash,
             birth_date,
             account_type,
             terms_accepted_at,
             privacy_acknowledged_at,
             terms_version,
             terms_sha256,
             privacy_version,
             privacy_sha256
           )
           VALUES ($1, $2, $3, $4, $5, $6, now(), now(), $7, $8, $9, $10)`,
          [
            accountId,
            name.trim(),
            email,
            passwordHash,
            birthDate,
            accountType,
            legalEvidence.termsVersion,
            legalEvidence.termsHash,
            legalEvidence.privacyVersion,
            legalEvidence.privacyHash,
          ],
        )
        await client.query(
          "INSERT INTO pending_onboarding(token_hash,account_id,expires_at) VALUES($1,$2,now()+interval '30 minutes')",
          [tokenHash(onboardingToken), accountId],
        )
      })
    } catch (e) {
      if (e.code === '23505')
        return error(res, 409, 'EMAIL_EXISTS', 'Ya existe una cuenta con este correo')
      throw e
    }
    res.status(201).json({ status: 'onboarding', onboardingToken })
  } catch (e) {
    next(e)
  }
}

export const completeOnboarding = async (req, res, next) => {
  try {
    const { onboardingToken, intendedPlan, accreditation } = req.body
    const result = await transaction(async (client) => {
      const { rows } = await client.query(
        'SELECT a.* FROM pending_onboarding p JOIN accounts a ON a.id=p.account_id WHERE p.token_hash=$1 AND p.consumed_at IS NULL AND p.expires_at>now() FOR UPDATE OF p',
        [tokenHash(onboardingToken)],
      )
      const account = rows[0]
      if (!account) return null
      if (account.account_type === 'graduate' && !['free', 'professional'].includes(intendedPlan))
        return { invalid: true }
      if (account.account_type === 'student' && !['free', 'student'].includes(intendedPlan))
        return { invalid: true }
      if (!['student', 'graduate'].includes(account.account_type) && intendedPlan !== 'free')
        return { invalid: true }
      if (account.account_type === 'student' && !accreditation)
        return { accreditationRequired: true }
      if (accreditation) {
        if (account.account_type !== 'student') return { invalid: true }
        await client.query(
          "INSERT INTO academic_accreditations(id,account_id,status,institution,academic_level,evidence_name) VALUES($1,$2,'pending',$3,$4,$5)",
          [
            randomUUID(),
            account.id,
            accreditation.institution,
            accreditation.academicLevel,
            accreditation.evidenceName,
          ],
        )
      }
      const confirmationToken = opaqueToken()
      await client.query(
        'UPDATE accounts SET intended_plan=$1,onboarding_completed_at=now(),updated_at=now() WHERE id=$2',
        [intendedPlan, account.id],
      )
      await client.query('UPDATE pending_onboarding SET consumed_at=now() WHERE token_hash=$1', [
        tokenHash(onboardingToken),
      ])
      await client.query(
        "INSERT INTO auth_tokens(id,account_id,purpose,token_hash,expires_at) VALUES($1,$2,'confirm',$3,now()+interval '24 hours')",
        [randomUUID(), account.id, tokenHash(confirmationToken)],
      )
      await queueEmail(
        client,
        account.id,
        account.email,
        'confirm',
        account.name,
        `${config.appOrigin}/confirmar-correo?token=${confirmationToken}`,
      )
      return { accountType: account.account_type }
    })
    if (!result)
      return error(
        res,
        400,
        'INVALID_ONBOARDING_TOKEN',
        'El proceso de registro venció. Vuelve a comenzar',
      )
    if (result.invalid)
      return error(res, 400, 'INVALID_PLAN', 'El plan no corresponde al tipo de cuenta')
    if (result.accreditationRequired)
      return error(
        res,
        400,
        'ACCREDITATION_REQUIRED',
        'Completa los datos de verificación estudiantil',
      )
    res.json({ status: 'pending_confirmation', accountType: result.accountType })
    void deliverPending().catch(console.error)
  } catch (e) {
    next(e)
  }
}

export const confirmEmail = async (req, res, next) => {
  try {
    const token = req.body?.token
    if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token))
      return error(res, 400, 'INVALID_TOKEN', 'Enlace inválido')
    const confirmed = await transaction(async (client) => {
      const { rows } = await client.query(
        "SELECT a.* FROM auth_tokens t JOIN accounts a ON a.id=t.account_id WHERE t.token_hash=$1 AND t.purpose='confirm' AND t.consumed_at IS NULL AND t.expires_at>now() FOR UPDATE OF t",
        [tokenHash(token)],
      )
      if (!rows.length) return null
      const row = rows[0]
      await client.query(
        'UPDATE accounts SET email_verified_at=COALESCE(email_verified_at,now()),updated_at=now() WHERE id=$1',
        [row.id],
      )
      await client.query('UPDATE auth_tokens SET consumed_at=now() WHERE token_hash=$1', [
        tokenHash(token),
      ])
      const session = await storeSession(client, row.id, req)
      await queueEmail(
        client,
        row.id,
        row.email,
        'welcome',
        row.name,
        `${config.appOrigin}/iniciar-sesion`,
      )
      return { account: row, session }
    })
    if (!confirmed) return error(res, 400, 'INVALID_TOKEN', 'El enlace venció o ya fue utilizado')
    setSessionCookies(res, confirmed.session)
    const account = publicAccount(confirmed.account)
    const workspace = ['company', 'institution'].includes(account.accountType)
      ? 'organization'
      : account.accountType === 'mentor'
        ? 'mentor'
        : 'talent'
    res.json({ status: 'confirmed', account, workspace })
    void deliverPending().catch(console.error)
  } catch (e) {
    next(e)
  }
}

export const resendConfirmation = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email)
    if (!(await throttle(req, `resend:${email}`, 5)))
      return error(res, 429, 'RATE_LIMITED', 'Intenta más tarde')
    if (!validEmail(email)) return error(res, 400, 'INVALID_INPUT', 'Correo inválido')
    const { rows } = await pool.query(
      'SELECT * FROM accounts WHERE email=$1 AND email_verified_at IS NULL AND onboarding_completed_at IS NOT NULL',
      [email],
    )
    if (rows.length) {
      const account = rows[0],
        token = opaqueToken()
      await transaction(async (client) => {
        await client.query(
          "UPDATE auth_tokens SET consumed_at=now() WHERE account_id=$1 AND purpose='confirm' AND consumed_at IS NULL",
          [account.id],
        )
        await client.query(
          "DELETE FROM email_outbox WHERE account_id=$1 AND kind='confirm' AND sent_at IS NULL",
          [account.id],
        )
        await client.query(
          "INSERT INTO auth_tokens(id,account_id,purpose,token_hash,expires_at) VALUES($1,$2,'confirm',$3,now()+interval '24 hours')",
          [randomUUID(), account.id, tokenHash(token)],
        )
        await queueEmail(
          client,
          account.id,
          email,
          'confirm',
          account.name,
          `${config.appOrigin}/confirmar-correo?token=${token}`,
        )
      })
      void deliverPending().catch(console.error)
    }
    res.json({ status: 'accepted' })
  } catch (e) {
    next(e)
  }
}

export const createSession = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email),
      password = req.body?.password
    if (!(await throttle(req, `login:${email}`, 10)))
      return error(res, 429, 'RATE_LIMITED', 'Intenta más tarde')
    if (!validEmail(email) || typeof password !== 'string')
      return error(res, 400, 'INVALID_INPUT', 'Correo o contraseña inválidos')
    const { rows } = await pool.query('SELECT * FROM accounts WHERE email=$1', [email])
    const account = rows[0]
    if (!account || !(await verifyPassword(password, account.password_hash)))
      return error(res, 401, 'INVALID_CREDENTIALS', 'Correo o contraseña incorrectos')
    if (!account.email_verified_at)
      return error(res, 403, 'EMAIL_NOT_CONFIRMED', 'Confirma tu correo antes de entrar')
    if (passwordNeedsRehash(account.password_hash)) {
      await pool.query('UPDATE accounts SET password_hash=$1,updated_at=now() WHERE id=$2', [
        await hashPassword(password),
        account.id,
      ])
    }
    if (account.mfa_enabled_at)
      return res.json({ mfaRequired: true, mfaToken: await createMfaChallenge(account.id) })
    const session = await storeSession(pool, account.id, req)
    setSessionCookies(res, session)
    res.json({ account: publicAccount(account) })
  } catch (e) {
    next(e)
  }
}

export const currentSession = async (req, res, next) => {
  try {
    const session = await findActiveSession(req)
    if (!session) return error(res, 401, 'UNAUTHENTICATED', 'Inicia sesión')
    res.json({ account: publicAccount(session) })
  } catch (e) {
    next(e)
  }
}
export const deleteSession = async (req, res, next) => {
  try {
    const session = await findActiveSession(req)
    if (session && !csrfValid(req, session))
      return error(res, 403, 'CSRF_INVALID', 'Solicitud no autorizada')
    const token = sessionToken(req)
    if (token)
      await pool.query('UPDATE sessions SET revoked_at=now() WHERE token_hash=$1', [
        tokenHash(token),
      ])
    clearSessionCookies(res)
    res.status(204).end()
  } catch (e) {
    next(e)
  }
}

export const refreshSession = async (req, res, next) => {
  try {
    const result = await rotateSession(req)
    if (result.error) {
      clearSessionCookies(res)
      return error(
        res,
        result.error === 'SESSION_REPLAY' ? 403 : 401,
        result.error,
        'Inicia sesión de nuevo',
      )
    }
    setSessionCookies(res, result.session)
    res.json({ status: 'refreshed' })
  } catch (e) {
    next(e)
  }
}

export const completeMfaLogin = async (req, res, next) => {
  try {
    if (!(await throttle(req, `mfa:${tokenHash(req.body.mfaToken)}`, 5)))
      return error(res, 429, 'RATE_LIMITED', 'Intenta más tarde')
    const result = await completeMfaChallenge(req.body.mfaToken, req.body.code, req)
    if (!result) return error(res, 401, 'MFA_INVALID', 'Código inválido o vencido')
    setSessionCookies(res, result.session)
    res.json({ account: publicAccount(result.account) })
  } catch (e) {
    next(e)
  }
}

export const getMfaStatus = async (req, res, next) => {
  try {
    res.json(await mfaStatus(req.session.account_id))
  } catch (e) {
    next(e)
  }
}

export const startMfaSetup = async (req, res, next) => {
  try {
    const setup = await beginMfaSetup(req.session.account_id)
    if (!setup) return error(res, 409, 'MFA_ALREADY_ENABLED', 'La verificación ya está activada')
    res.json(setup)
  } catch (e) {
    next(e)
  }
}

export const activateMfa = async (req, res, next) => {
  try {
    if (!(await throttle(req, `mfa-enable:${req.session.account_id}`, 5)))
      return error(res, 429, 'RATE_LIMITED', 'Intenta más tarde')
    const recoveryCodes = await enableMfa(req.session.account_id, req.body.code)
    if (!recoveryCodes) return error(res, 400, 'MFA_INVALID', 'Código inválido')
    res.json({ enabled: true, recoveryCodes })
  } catch (e) {
    next(e)
  }
}

export const deactivateMfa = async (req, res, next) => {
  try {
    if (!(await throttle(req, `mfa-disable:${req.session.account_id}`, 5)))
      return error(res, 429, 'RATE_LIMITED', 'Intenta más tarde')
    if (!(await disableMfa(req.session.account_id, req.body.code)))
      return error(res, 400, 'MFA_INVALID', 'Código inválido')
    res.json({ enabled: false })
  } catch (e) {
    next(e)
  }
}

export const listSessions = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id,created_at,expires_at,ip_address,user_agent FROM sessions WHERE account_id=$1 AND revoked_at IS NULL AND expires_at>now() ORDER BY created_at DESC',
      [req.session.account_id],
    )
    res.json({
      sessions: rows.map((row) => ({
        id: row.id,
        createdAt: row.created_at,
        expiresAt: row.expires_at,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        current: row.id === req.session.id,
      })),
    })
  } catch (e) {
    next(e)
  }
}

export const revokeSession = async (req, res, next) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.sessionId))
      return error(res, 400, 'INVALID_INPUT', 'Sesión inválida')
    const { rowCount } = await pool.query(
      "UPDATE sessions SET revoked_at=now(),revoked_reason='user' WHERE id=$1 AND account_id=$2 AND revoked_at IS NULL",
      [req.params.sessionId, req.session.account_id],
    )
    if (!rowCount) return error(res, 404, 'SESSION_NOT_FOUND', 'Sesión no encontrada')
    if (req.params.sessionId === req.session.id) clearSessionCookies(res)
    res.status(204).end()
  } catch (e) {
    next(e)
  }
}

export const logoutAll = async (req, res, next) => {
  try {
    await pool.query(
      "UPDATE sessions SET revoked_at=now(),revoked_reason='logout_all' WHERE account_id=$1 AND revoked_at IS NULL",
      [req.session.account_id],
    )
    clearSessionCookies(res)
    res.status(204).end()
  } catch (e) {
    next(e)
  }
}

export const requestPasswordReset = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email)
    if (!(await throttle(req, `reset:${email}`, 5)))
      return error(res, 429, 'RATE_LIMITED', 'Intenta más tarde')
    if (!validEmail(email)) return error(res, 400, 'INVALID_INPUT', 'Correo inválido')
    const { rows } = await pool.query(
      'SELECT * FROM accounts WHERE email=$1 AND email_verified_at IS NOT NULL',
      [email],
    )
    if (rows.length) {
      const token = opaqueToken(),
        account = rows[0]
      await transaction(async (client) => {
        await client.query(
          "UPDATE auth_tokens SET consumed_at=now() WHERE account_id=$1 AND purpose='reset' AND consumed_at IS NULL",
          [account.id],
        )
        await client.query(
          "DELETE FROM email_outbox WHERE account_id=$1 AND kind='reset' AND sent_at IS NULL",
          [account.id],
        )
        await client.query(
          "INSERT INTO auth_tokens(id,account_id,purpose,token_hash,expires_at) VALUES($1,$2,'reset',$3,now()+interval '30 minutes')",
          [randomUUID(), account.id, tokenHash(token)],
        )
        await queueEmail(
          client,
          account.id,
          email,
          'reset',
          account.name,
          `${config.appOrigin}/restablecer-contrasena?token=${token}`,
        )
      })
      void deliverPending().catch(console.error)
    }
    res.json({ status: 'accepted' })
  } catch (e) {
    next(e)
  }
}

export const completePasswordReset = async (req, res, next) => {
  try {
    const { token, password } = req.body || {}
    if (
      typeof token !== 'string' ||
      !/^[A-Za-z0-9_-]{43}$/.test(token) ||
      typeof password !== 'string' ||
      password.length < 12 ||
      password.length > 128
    )
      return error(res, 400, 'INVALID_INPUT', 'Enlace o contraseña inválidos')
    const passwordHash = await hashPassword(password)
    const changed = await transaction(async (client) => {
      const { rows } = await client.query(
        "SELECT account_id FROM auth_tokens WHERE token_hash=$1 AND purpose='reset' AND consumed_at IS NULL AND expires_at>now() FOR UPDATE",
        [tokenHash(token)],
      )
      if (!rows.length) return false
      const accountId = rows[0].account_id
      await client.query('UPDATE accounts SET password_hash=$1,updated_at=now() WHERE id=$2', [
        passwordHash,
        accountId,
      ])
      await client.query('UPDATE auth_tokens SET consumed_at=now() WHERE token_hash=$1', [
        tokenHash(token),
      ])
      await client.query(
        'UPDATE sessions SET revoked_at=now() WHERE account_id=$1 AND revoked_at IS NULL',
        [accountId],
      )
      await client.query(
        'UPDATE mfa_challenges SET consumed_at=now() WHERE account_id=$1 AND consumed_at IS NULL',
        [accountId],
      )
      return true
    })
    if (!changed) return error(res, 400, 'INVALID_TOKEN', 'El enlace venció o ya fue utilizado')
    res.json({ status: 'password_changed' })
  } catch (e) {
    next(e)
  }
}
