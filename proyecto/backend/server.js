import app from './src/app.js'
import { config } from './src/config/env.js'
import { pool } from './src/config/db.js'
import { deliverPending } from './src/services/email.service.js'
import { cleanupExpiredAuthData } from './src/services/cleanup.service.js'

const server = app.listen(config.port, () => console.info(`Hongus API en puerto ${config.port}`))
const interval = setInterval(() => {
  void deliverPending().catch(console.error)
}, 30_000)
interval.unref()
const cleanupInterval = setInterval(
  () => {
    void cleanupExpiredAuthData().catch(console.error)
  },
  60 * 60 * 1000,
)
cleanupInterval.unref()
void cleanupExpiredAuthData().catch(console.error)

function stop() {
  clearInterval(interval)
  clearInterval(cleanupInterval)
  server.close(() => {
    void pool.end()
  })
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
