import { Router } from 'express'
import * as subscription from '../controllers/subscription.controller.js'
import { requireSession } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { createOrderSchema } from '../models/subscription.schemas.js'

const router = Router()
router.get('/plans', subscription.plans)
router.get('/onboarding', requireSession, subscription.onboarding)
router.post(
  '/subscription-orders',
  requireSession,
  validate(createOrderSchema),
  subscription.createOrder,
)
router.get('/subscription-orders/:orderId', requireSession, subscription.getOrder)
router.post(
  '/subscription-orders/:orderId/simulate-confirmation',
  requireSession,
  subscription.simulateConfirmation,
)
export default router
