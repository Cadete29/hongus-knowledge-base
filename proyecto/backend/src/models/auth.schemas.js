import { z } from 'zod'
import { isAdult } from '../utils/security.js'

const email = z.string().trim().toLowerCase().pipe(z.email().max(254))
const token = z.string().regex(/^[A-Za-z0-9_-]{43}$/)
const password = z.string().min(12).max(128)

export const registerSchema = z.strictObject({
  name: z.string().trim().min(2).max(120),
  email,
  password,
  birthDate: z.iso.date().refine(isAdult),
  accountType: z.enum(['student', 'graduate', 'mentor', 'company', 'institution']),
  consentAccepted: z.literal(true),
})
export const emailSchema = z.strictObject({ email })
export const loginSchema = z.strictObject({ email, password: z.string().min(1) })
export const tokenSchema = z.strictObject({ token })
export const resetSchema = z.strictObject({ token, password })
export const mfaChallengeSchema = z.strictObject({
  mfaToken: token,
  code: z.string().regex(/^(?:\d{6}|[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4})$/),
})
export const mfaCodeSchema = z.strictObject({
  code: z.string().regex(/^(?:\d{6}|[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4})$/),
})
export const onboardingSchema = z.strictObject({
  onboardingToken: token,
  intendedPlan: z.enum(['free', 'student', 'professional']),
  accreditation: z
    .strictObject({
      institution: z.string().trim().min(2).max(160),
      academicLevel: z.string().trim().min(2).max(80),
      evidenceName: z.string().trim().min(1).max(255),
    })
    .optional(),
})
