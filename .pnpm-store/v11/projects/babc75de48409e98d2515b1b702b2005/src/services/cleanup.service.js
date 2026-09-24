import { transaction } from '../config/db.js'

export async function cleanupExpiredAuthData() {
  await transaction(async (client) => {
    await client.query(
      "DELETE FROM auth_tokens WHERE (consumed_at IS NOT NULL OR expires_at<now()) AND expires_at<now()-interval '7 days'",
    )
    await client.query(
      "DELETE FROM sessions WHERE (revoked_at IS NOT NULL OR expires_at<now()) AND expires_at<now()-interval '30 days'",
    )
    await client.query(
      "DELETE FROM auth_rate_limits WHERE window_started_at<now()-interval '1 day'",
    )
    await client.query("DELETE FROM mfa_challenges WHERE expires_at<now()-interval '7 days'")
    await client.query(
      `DELETE FROM accounts
       WHERE email_verified_at IS NULL
         AND onboarding_completed_at IS NULL
         AND created_at < now() - interval '7 days'`,
    )
    await client.query(
      "DELETE FROM pending_onboarding WHERE (consumed_at IS NOT NULL OR expires_at<now()) AND created_at<now()-interval '7 days'",
    )
    await client.query(
      `DELETE FROM email_outbox
       WHERE (sent_at IS NOT NULL AND sent_at < now() - interval '30 days')
          OR (
            sent_at IS NULL
            AND (
              (kind = 'confirm' AND created_at < now() - interval '24 hours')
              OR (kind = 'reset' AND created_at < now() - interval '30 minutes')
              OR (kind = 'welcome' AND created_at < now() - interval '7 days')
            )
          )`,
    )
  })
}
