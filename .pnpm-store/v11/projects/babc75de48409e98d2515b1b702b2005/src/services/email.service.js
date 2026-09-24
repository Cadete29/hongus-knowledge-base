import nodemailer from 'nodemailer'
import { randomUUID } from 'node:crypto'
import { config } from '../config/env.js'
import { pool } from '../config/db.js'

const transport =
  config.mailMode === 'smtp'
    ? nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        requireTLS: !config.smtp.secure,
        auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.password } : undefined,
        disableFileAccess: true,
        disableUrlAccess: true,
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 20_000,
      })
    : null

export async function verifySmtpConnection() {
  if (!transport) throw new Error('Activa MAIL_MODE=smtp antes de verificar SMTP')
  await transport.verify()
}

const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
  )

export function renderEmail(kind, name, link) {
  const firstName = escape(name.trim().split(/\s+/)[0])
  const content = {
    confirm: {
      subject: 'Confirma tu correo en Hongus',
      eyebrow: 'UN PASO PARA COMENZAR',
      title: `Hola, ${firstName}. Confirma tu correo.`,
      body: 'Verifica tu dirección para activar tu cuenta y comenzar a explorar Hongus.',
      button: 'Confirmar mi correo',
      note: 'Este enlace vence en 24 horas.',
    },
    reset: {
      subject: 'Restablece tu contraseña de Hongus',
      eyebrow: 'SEGURIDAD DE TU CUENTA',
      title: `Hola, ${firstName}. Recupera tu acceso.`,
      body: 'Recibimos una solicitud para cambiar tu contraseña. Si fuiste tú, utiliza el enlace seguro.',
      button: 'Restablecer contraseña',
      note: 'Este enlace vence en 30 minutos. Si no lo solicitaste, ignora este correo.',
    },
    welcome: {
      subject: 'Bienvenido a Hongus',
      eyebrow: 'TU CAMINO COMIENZA AQUÍ',
      title: `¡Bienvenido a Hongus, ${firstName}!`,
      body: 'Tu correo ya está confirmado. Entra a tu cuenta para explorar lo que la comunidad tiene para ti.',
      button: 'Entrar a Hongus',
      note: 'Construye experiencia. Cultiva futuro.',
    },
  }[kind]
  if (!content) throw new Error('Plantilla inválida')
  const safeLink = escape(link)
  const html = `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
      </head>
      <body style="margin:0;background:#f5f8f2;color:#102a22;font-family:Arial,Helvetica,sans-serif">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
          style="background:#f5f8f2;padding:32px 16px">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                style="max-width:600px;background:#ffffff;border-radius:24px;overflow:hidden">
                <tr>
                  <td style="background:#145c43;padding:32px 40px;color:#ffffff;font-size:28px;font-weight:700">
                    hongus<span style="color:#d5f67a">.</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px">
                    <p style="margin:0 0 16px;color:#145c43;font-size:12px;font-weight:700;letter-spacing:2px">
                      ${content.eyebrow}
                    </p>
                    <h1 style="margin:0 0 20px;font-size:30px;line-height:1.2">
                      ${content.title}
                    </h1>
                    <p style="font-size:16px;line-height:1.6">${content.body}</p>
                    <p style="margin:32px 0">
                      <a href="${safeLink}"
                        style="background:#145c43;color:#ffffff;padding:16px 24px;border-radius:28px;text-decoration:none;font-weight:700;display:inline-block">
                        ${content.button}
                      </a>
                    </p>
                    <p style="font-size:14px;color:#50645a;line-height:1.5">${content.note}</p>
                    <p style="font-size:13px;color:#50645a;overflow-wrap:anywhere">
                      Si el botón no funciona, copia este enlace:<br>
                      <a href="${safeLink}" style="color:#145c43">${safeLink}</a>
                    </p>
                  </td>
                </tr>
              </table>
              <p style="font-size:12px;color:#50645a;margin:24px 0">
                Hongus · Talento que crece
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
  const text = `${content.title}\n\n${content.body}\n\n${content.button}: ${link}\n\n${content.note}\n\nHongus · Talento que crece`
  return { subject: content.subject, html, text }
}

export async function queueEmail(client, accountId, recipient, kind, name, link) {
  const email = renderEmail(kind, name, link)
  await client.query(
    'INSERT INTO email_outbox (id, account_id, kind, recipient, subject, html, text_body) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [randomUUID(), accountId, kind, recipient, email.subject, email.html, email.text],
  )
}

export async function deliverPending() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `DELETE FROM email_outbox
       WHERE sent_at IS NULL
         AND (
           (kind = 'confirm' AND created_at < now() - interval '24 hours')
           OR (kind = 'reset' AND created_at < now() - interval '30 minutes')
           OR (kind = 'welcome' AND created_at < now() - interval '7 days')
         )`,
    )
    const { rows } = await client.query(
      'SELECT * FROM email_outbox WHERE sent_at IS NULL AND next_attempt_at <= now() ORDER BY created_at LIMIT 10 FOR UPDATE SKIP LOCKED',
    )
    for (const row of rows) {
      try {
        if (transport)
          await transport.sendMail({
            from: config.mailFrom,
            to: row.recipient,
            subject: row.subject,
            html: row.html,
            text: row.text_body,
          })
        else console.info(`[MAIL_MODE=log] ${row.kind} a ${row.recipient}: ${row.text_body}`)
        await client.query(
          "UPDATE email_outbox SET sent_at=now(), attempts=attempts+1, html='', text_body='' WHERE id=$1",
          [row.id],
        )
      } catch (error) {
        console.error(`No se pudo enviar correo ${row.id}:`, error)
        await client.query(
          `UPDATE email_outbox
           SET attempts = attempts + 1,
               next_attempt_at = now()
                 + LEAST(3600, POWER(2, LEAST(attempts, 10)) * 30) * interval '1 second'
           WHERE id = $1`,
          [row.id],
        )
      }
    }
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
