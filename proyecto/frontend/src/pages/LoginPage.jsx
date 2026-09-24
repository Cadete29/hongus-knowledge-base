import { useState } from 'react'
import AuthShell from '../components/auth/AuthShell'
import styles from '../components/auth/AuthForm.module.css'
import { post } from '../lib/api'

export default function LoginPage() {
  const [error, setError] = useState(''),
    [busy, setBusy] = useState(false)
  const [mfaToken, setMfaToken] = useState('')
  const goToWorkspace = (accountType) => {
    const workspace = ['company', 'institution'].includes(accountType)
      ? 'organization'
      : accountType === 'mentor'
        ? 'mentor'
        : 'talent'
    window.location.href = `/dashboard?workspace=${workspace}`
  }
  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      if (mfaToken) {
        const result = await post('/sessions/mfa', {
          mfaToken,
          code: form.get('code')?.toString().trim().toUpperCase(),
        })
        goToWorkspace(result.account.accountType)
      } else {
        const result = await post('/sessions', {
          email: form.get('email'),
          password: form.get('password'),
        })
        if (result.mfaRequired) {
          setMfaToken(result.mfaToken)
          setBusy(false)
        } else goToWorkspace(result.account.accountType)
      }
    } catch (problem) {
      setError(problem.message)
      setBusy(false)
    }
  }
  return (
    <AuthShell
      backHref="/"
      title={
        <>
          Qué gusto verte
          <br />
          de nuevo.
        </>
      }
      intro="Inicia sesión para continuar cultivando tu futuro."
      footer={
        <>
          ¿Aún no tienes cuenta? <a href="/registro">Regístrate</a>
        </>
      }
    >
      <form className={styles.form} onSubmit={submit}>
        {mfaToken ? (
          <>
            <p className={styles.message}>
              Escribe el código de tu aplicación de autenticación o un código de recuperación.
            </p>
            <label className={styles.field}>
              Código de seguridad
              <input
                name="code"
                type="text"
                autoComplete="one-time-code"
                inputMode="text"
                required
              />
            </label>
          </>
        ) : (
          <>
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
            <label className={styles.field}>
              Contraseña
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                required
              />
            </label>
          </>
        )}
        {error && (
          <p role="alert" className={`${styles.message} ${styles.error}`}>
            {error}
          </p>
        )}
        {!mfaToken && (
          <a className={styles.link} href="/recuperar-contrasena">
            ¿Olvidaste tu contraseña?
          </a>
        )}
        <button className={styles.button} disabled={busy}>
          {busy ? 'Entrando…' : mfaToken ? 'Verificar código' : 'Iniciar sesión'}
        </button>
      </form>
      {error.includes('Confirma tu correo') && (
        <a className={styles.link} href="/reenviar-confirmacion">
          Reenviar confirmación
        </a>
      )}
    </AuthShell>
  )
}
