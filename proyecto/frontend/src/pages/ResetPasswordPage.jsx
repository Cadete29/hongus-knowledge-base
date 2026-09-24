import { useEffect, useState } from 'react'
import AuthShell from '../components/auth/AuthShell'
import styles from '../components/auth/AuthForm.module.css'
import { post } from '../lib/api'

export default function ResetPasswordPage() {
  const [token] = useState(() => new URLSearchParams(window.location.search).get('token'))
  useEffect(() => {
    if (token) window.history.replaceState({}, '', '/restablecer-contrasena')
  }, [token])
  const [status, setStatus] = useState(''),
    [busy, setBusy] = useState(false),
    [done, setDone] = useState(false)
  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setStatus('')
    const form = new FormData(event.currentTarget)
    if (form.get('password') !== form.get('confirm')) {
      setStatus('Las contraseñas no coinciden')
      setBusy(false)
      return
    }
    try {
      await post('/password-resets/complete', { token, password: form.get('password') })
      setDone(true)
    } catch (error) {
      setStatus(error.message)
    } finally {
      setBusy(false)
    }
  }
  if (done)
    return (
      <AuthShell
        eyebrow="CONTRASEÑA ACTUALIZADA"
        title="Listo para volver a crecer."
        intro="Tu contraseña se actualizó. Inicia sesión con tu nueva contraseña para continuar."
      >
        <a className={styles.button} href="/iniciar-sesion">
          Iniciar sesión
        </a>
      </AuthShell>
    )
  if (!token || status.includes('enlace'))
    return (
      <AuthShell
        eyebrow="RECUPERAR ACCESO"
        title="Este enlace ya no es válido."
        intro="Solicita nuevas instrucciones para restablecer tu contraseña de forma segura."
      >
        <a className={styles.button} href="/recuperar-contrasena">
          Solicitar nuevo enlace
        </a>
        <a className={styles.link} href="/iniciar-sesion">
          Volver a iniciar sesión
        </a>
      </AuthShell>
    )
  return (
    <AuthShell
      eyebrow="RECUPERAR ACCESO"
      title="Elige una nueva contraseña."
      intro="Usa una contraseña diferente a la anterior."
    >
      <form className={styles.form} onSubmit={submit}>
        <label className={styles.field}>
          Nueva contraseña
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Escribe tu nueva contraseña"
            minLength="12"
            maxLength="128"
            required
          />
        </label>
        <label className={styles.field}>
          Confirma tu contraseña
          <input
            name="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Vuelve a escribirla"
            minLength="12"
            maxLength="128"
            required
          />
        </label>
        <button className={styles.button} disabled={busy}>
          {busy ? 'Guardando…' : 'Guardar nueva contraseña'}
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
