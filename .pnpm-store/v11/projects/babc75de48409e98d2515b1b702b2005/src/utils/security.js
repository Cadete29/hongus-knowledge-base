import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import argon2 from 'argon2'

const scrypt = promisify(scryptCallback)
const scryptOptions = { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 }

export function opaqueToken() {
  return randomBytes(32).toString('base64url')
}
export function tokenHash(value) {
  return createHash('sha256').update(value).digest('hex')
}
export async function hashPassword(password) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65_536,
    timeCost: 3,
    parallelism: 1,
  })
}
export async function verifyPassword(password, stored) {
  if (stored?.startsWith('$argon2id$')) return argon2.verify(stored, password)
  if (typeof stored !== 'string') return false
  const parts = stored.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false
  const [, n, r, p, salt, hex] = parts
  const expected = Buffer.from(hex, 'hex')
  if (expected.length !== 64) return false
  const actual = await scrypt(password, salt, 64, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: 32 * 1024 * 1024,
  })
  return timingSafeEqual(actual, expected)
}
export function passwordNeedsRehash(stored) {
  return typeof stored === 'string' && stored.startsWith('scrypt$')
}
export function isAdult(dateString, today = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  )
    return false
  const threshold = new Date(
    Date.UTC(today.getUTCFullYear() - 18, today.getUTCMonth(), today.getUTCDate()),
  )
  return date <= threshold
}
export const accountTypes = new Set(['student', 'graduate', 'mentor', 'company', 'institution'])
export function validEmail(email) {
  return (
    typeof email === 'string' && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  )
}
