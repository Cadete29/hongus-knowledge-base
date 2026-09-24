import express from 'express'
import helmet from 'helmet'
import { config } from './config/env.js'
import authRoutes from './routes/auth.routes.js'
import subscriptionRoutes from './routes/subscription.routes.js'
import { errorHandler, requestGuard } from './middlewares/auth.middleware.js'

const app = express()
if (config.trustProxy) app.set('trust proxy', 1)
app.disable('x-powered-by')
app.use(helmet())
app.use(express.json({ limit: '16kb' }))
app.use(requestGuard)
app.get('/', (_req, res) =>
  res.json({
    name: 'Hongus API',
    status: 'ok',
    version: 'v1',
    health: '/api/v1/health',
  }),
)
app.use('/api/v1', authRoutes)
app.use('/api/v1', subscriptionRoutes)
app.use((req, res) =>
  res
    .status(404)
    .json({ error: { code: 'NOT_FOUND', message: `No existe ${req.method} ${req.path}` } }),
)
app.use(errorHandler)

export default app
