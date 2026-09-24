import { useState } from 'react'
import AuthShell from '../components/auth/AuthShell'
import styles from '../components/auth/AuthForm.module.css'
import { post } from '../lib/api'

export default function ResendConfirmationPage() {
  const [status, setStatus] = useState(''),
    [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setStatus('')
    try {
      await post('/email-confirmations/resend', {
        email: new FormData(event.currentTarget).get('email'),
      })
      setStatus('Si tu cuenta está pendiente, recibirás un nuevo enlace de confirmación.')
    } catch (error) {
      setStatus(error.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <AuthShell
      eyebrow="CONFIRMACIÓN"
      title="Envía otro enlace."
      intro="Escribe el correo con el que te registraste."
      footer={<a href="/iniciar-sesion">Volver a iniciar sesión</a>}
    >
      <form className={styles.form} onSubmit={submit}>
        <label className={styles.field}>
          Correo electrónico
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <button className={styles.button} disabled={busy}>
          {busy ? 'Enviando…' : 'Enviar enlace'}
        </button>
      </form>
      {status && (
        <p role="status" className={styles.message}>
          {status}
        </p>
      )}
    </AuthShell>
  )
}
