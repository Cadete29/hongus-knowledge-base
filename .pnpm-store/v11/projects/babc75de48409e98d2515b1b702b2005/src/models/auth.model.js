import { pool } from '../config/db.js'

export async function incrementRateLimit(keyHash) {
  const { rows } = await pool.query(
    `INSERT INTO auth_rate_limits (key_hash, count, window_started_at)
     VALUES ($1, 1, now())
     ON CONFLICT (key_hash) DO UPDATE
     SET count = CASE
           WHEN auth_rate_limits.window_started_at < now() - interval '15 minutes' THEN 1
           ELSE auth_rate_limits.count + 1
         END,
         window_started_at = CASE
           WHEN auth_rate_limits.window_started_at < now() - interval '15 minutes' THEN now()
           ELSE auth_rate_limits.window_started_at
         END
     RETURNING count`,
    [keyHash],
  )
  return rows[0].count
}
