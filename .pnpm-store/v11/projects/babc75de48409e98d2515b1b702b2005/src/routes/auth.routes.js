import { Router } from 'express'
import * as auth from '../controllers/auth.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { requireSession } from '../middlewares/auth.middleware.js'
import {
  emailSchema,
  loginSchema,
  mfaChallengeSchema,
  mfaCodeSchema,
  onboardingSchema,
  registerSchema,
  resetSchema,
  tokenSchema,
} from '../models/auth.schemas.js'

const router = Router()
router.get('/health', auth.health)
router.post('/accounts', validate(registerSchema), auth.register)
router.post('/accounts/onboarding', validate(onboardingSchema), auth.completeOnboarding)
router.post('/email-confirmations', validate(tokenSchema), auth.confirmEmail)
router.post('/email-confirmations/resend', validate(emailSchema), auth.resendConfirmation)
router.post('/sessions', validate(loginSchema), auth.createSession)
router.post('/sessions/refresh', auth.refreshSession)
router.post('/sessions/mfa', validate(mfaChallengeSchema), auth.completeMfaLogin)
router.get('/sessions/current', auth.currentSession)
router.delete('/sessions/current', auth.deleteSession)
router.get('/sessions', requireSession, auth.listSessions)
router.delete('/sessions/:sessionId', requireSession, auth.revokeSession)
router.post('/sessions/logout-all', requireSession, auth.logoutAll)
router.get('/mfa/status', requireSession, auth.getMfaStatus)
router.post('/mfa/setup', requireSession, auth.startMfaSetup)
router.post('/mfa/enable', requireSession, validate(mfaCodeSchema), auth.activateMfa)
router.post('/mfa/disable', requireSession, validate(mfaCodeSchema), auth.deactivateMfa)
router.post('/password-resets', validate(emailSchema), auth.requestPasswordReset)
router.post('/password-resets/complete', validate(resetSchema), auth.completePasswordReset)

export default router
