import 'dotenv/config'

export const config = {
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL,
  databaseSsl: process.env.DATABASE_SSL === 'true',
  appOrigin: process.env.APP_ORIGIN || 'http://localhost:5173',
  production: process.env.NODE_ENV === 'production',
  trustProxy: process.env.TRUST_PROXY === 'true',
  mfaEncryptionKey: process.env.MFA_ENCRYPTION_KEY,
  mailMode: process.env.MAIL_MODE || 'log',
  mailFrom: process.env.MAIL_FROM || 'Hongus <no-reply@hongus.local>',
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },
}

if (!config.databaseUrl) throw new Error('DATABASE_URL es obligatorio')
if (config.production && !config.appOrigin.startsWith('https://'))
  throw new Error('APP_ORIGIN debe usar HTTPS en producción')
if (!['log', 'smtp'].includes(config.mailMode)) throw new Error('MAIL_MODE inválido')
if (config.production && config.mailMode !== 'smtp')
  throw new Error('SMTP es obligatorio en producción')
if (
  config.production &&
  (!config.mfaEncryptionKey || Buffer.from(config.mfaEncryptionKey, 'base64url').length !== 32)
)
  throw new Error('MFA_ENCRYPTION_KEY de 32 bytes es obligatoria en producción')
if (config.mailMode === 'smtp' && !config.smtp.host) throw new Error('SMTP_HOST es obligatorio')
