import { incrementRateLimit } from '../models/auth.model.js'
import { tokenHash } from '../utils/security.js'

export async function throttle(req, key, limit = 5) {
  const count = await incrementRateLimit(tokenHash(`${key}:${req.ip}`))
  return count <= limit
}
