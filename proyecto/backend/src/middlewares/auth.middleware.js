import { config } from '../config/env.js'
import { csrfValid, findActiveSession } from '../services/session.service.js'

export function requestGuard(req, res, next) {
  res.set('Cache-Control', 'no-store')
  res.set('X-Content-Type-Options', 'nosniff')
  res.set('Referrer-Policy', 'no-referrer')
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    if (req.get('origin') !== config.appOrigin)
      return res
        .status(403)
        .json({ error: { code: 'ORIGIN_FORBIDDEN', message: 'Origen no permitido' } })
    if (req.method !== 'DELETE' && !req.is('application/json'))
      return res.status(415).json({ error: { code: 'JSON_REQUIRED', message: 'Se requiere JSON' } })
  }
  next()
}

export function errorHandler(err, _req, res, _next) {
  console.error(err)
  if (!res.headersSent)
    res
      .status(500)
      .json({ error: { code: 'INTERNAL_ERROR', message: 'Ocurrió un error. Intenta de nuevo.' } })
}

export async function requireSession(req, res, next) {
  try {
    const session = await findActiveSession(req)
    if (!session)
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Inicia sesión' } })
    if (!['GET', 'HEAD'].includes(req.method) && !csrfValid(req, session))
      return res
        .status(403)
        .json({ error: { code: 'CSRF_INVALID', message: 'Solicitud no autorizada' } })
    req.session = session
    next()
  } catch (error) {
    next(error)
  }
}
