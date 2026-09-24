import { z } from 'zod'

export const createOrderSchema = z.strictObject({
  plan: z.enum(['student', 'professional']),
  idempotencyKey: z
    .string()
    .min(16)
    .max(128)
    .regex(/^[A-Za-z0-9_-]+$/),
})
