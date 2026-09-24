import { verifySmtpConnection } from '../services/email.service.js'

try {
  await verifySmtpConnection()
  console.log('SMTP: conexión, TLS y autenticación correctos. No se envió ningún correo.')
} catch (error) {
  console.error(`SMTP: ${error.code || 'ERROR'}: ${error.message}`)
  process.exitCode = 1
}
