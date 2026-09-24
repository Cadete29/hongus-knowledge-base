import { useState } from 'react'
import AuthShell from '../components/auth/AuthShell'
import styles from '../components/auth/AuthForm.module.css'
import { post } from '../lib/api'

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState(''),
    [busy, setBusy] = useState(false),
    [sent, setSent] = useState(false)
  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setStatus('')
    try {
      await post('/password-resets', { email: new FormData(event.currentTarget).get('email') })
      setSent(true)
    } catch (error) {
      setStatus(error.message)
    } finally {
      setBusy(false)
    }
  }
  if (sent)
    return (
      <AuthShell
        eyebrow="REVISA TU CORREO"
        title="El siguiente paso está en tu correo"
        intro="Si existe una cuenta asociada al correo que ingresaste, recibirás un enlace para cambiar tu contraseña. Revisa también la carpeta de spam."
      >
        <a className={styles.button} href="/iniciar-sesion">
          Volver a iniciar sesión
        </a>
        <button className={styles.textButton} type="button" onClick={() => setSent(false)}>
          Usar otro correo
        </button>
      </AuthShell>
    )
  return (
    <AuthShell
      eyebrow="RECUPERAR CONTRASEÑA"
      title="Recupera tu acceso"
      intro="Escribe el correo que usas en Hongus. Te enviaremos las instrucciones para restablecer tu contraseña."
    >
      <form className={styles.form} onSubmit={submit}>
        <label className={styles.field}>
          Correo electrónico
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nombre@correo.com"
            required
          />
        </label>
        <button className={styles.button} disabled={busy}>
          {busy ? 'Enviando…' : 'Enviar instrucciones'}
        </button>
      </form>
      {status && (
        <p role="alert" className={`${styles.message} ${styles.error}`}>
          {status}
        </p>
      )}
      <a className={styles.link} href="/iniciar-sesion">
        Volver a iniciar sesión
      </a>
    </AuthShell>
  )
}
