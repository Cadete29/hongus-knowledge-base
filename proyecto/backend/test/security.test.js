import test from 'node:test'
import assert from 'node:assert/strict'
import { scryptSync } from 'node:crypto'
import {
  hashPassword,
  isAdult,
  opaqueToken,
  passwordNeedsRehash,
  tokenHash,
  verifyPassword,
} from '../src/utils/security.js'
import { registerSchema } from '../src/models/auth.schemas.js'

test('contraseña: hash con sal y verificación', async () => {
  const first = await hashPassword('Una frase extensa 123!')
  const second = await hashPassword('Una frase extensa 123!')
  assert.notEqual(first, second)
  assert.ok(first.startsWith('$argon2id$'))
  assert.equal(await verifyPassword('Una frase extensa 123!', first), true)
  assert.equal(await verifyPassword('otra contraseña', first), false)
})

test('contraseñas scrypt existentes siguen funcionando y requieren actualización', async () => {
  const password = 'Una frase extensa 123!'
  const salt = '0123456789abcdef0123456789abcdef'
  const hash = `scrypt$16384$8$1$${salt}$${scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 }).toString('hex')}`
  assert.equal(await verifyPassword(password, hash), true)
  assert.equal(passwordNeedsRehash(hash), true)
  assert.equal(passwordNeedsRehash(await hashPassword(password)), false)
})

test('registro exige consentimiento explícito en el servidor', () => {
  const input = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'SecurePassword123!',
    birthDate: '2000-01-01',
    accountType: 'student',
  }
  assert.equal(registerSchema.safeParse(input).success, false)
  assert.equal(registerSchema.safeParse({ ...input, consentAccepted: true }).success, true)
})

test('tokens aleatorios y digest uniforme', () => {
  const first = opaqueToken(),
    second = opaqueToken()
  assert.equal(first.length, 43)
  assert.notEqual(first, second)
  assert.equal(tokenHash(first).length, 64)
})

test('mayoría de edad con fecha válida y límite exacto', () => {
  const today = new Date('2026-09-16T12:00:00Z')
  assert.equal(isAdult('2008-09-16', today), true)
  assert.equal(isAdult('2008-09-17', today), false)
  assert.equal(isAdult('2008-02-30', today), false)
})
