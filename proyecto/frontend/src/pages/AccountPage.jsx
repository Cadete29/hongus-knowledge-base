import { useEffect, useState } from 'react'
import AuthShell from '../components/auth/AuthShell'
import styles from '../components/auth/AuthForm.module.css'
import { api, post } from '../lib/api'

export default function AccountPage() {
  const [account, setAccount] = useState(null)
  const [error, setError] = useState('')
  const [mfa, setMfa] = useState(null)
  const [setup, setSetup] = useState(null)
  const [recoveryCodes, setRecoveryCodes] = useState([])
  const [sessions, setSessions] = useState([])
  const [notice, setNotice] = useState('')

  async function loadSecurity() {
    const [status, list] = await Promise.all([api('/mfa/status'), api('/sessions')])
    setMfa(status)
    setSessions(list.sessions)
  }

  useEffect(() => {
    api('/sessions/current')
      .then(async (data) => {
        setAccount(data.account)
        await loadSecurity()
      })
      .catch((problem) => setError(problem.message))
  }, [])

  async function logout() {
    try {
      await api('/sessions/current', { method: 'DELETE' })
      window.location.href = '/'
    } catch (problem) {
      setError(problem.message)
    }
  }

  async function run(action) {
    setNotice('')
    setError('')
    try {
      await action()
    } catch (problem) {
      setError(problem.message)
    }
  }

  async function submitCode(event, path) {
    event.preventDefault()
    const code = new FormData(event.currentTarget).get('code')?.toString().trim().toUpperCase()
    await run(async () => {
      const result = await post(path, { code })
      if (result.recoveryCodes) setRecoveryCodes(result.recoveryCodes)
      setSetup(null)
      setNotice(
        path.endsWith('/enable')
          ? 'Verificación en dos pasos activada.'
          : 'Verificación en dos pasos desactivada.',
      )
      await loadSecurity()
    })
  }

  return (
    <AuthShell
      eyebrow="MI ESPACIO"
      title={account ? `Hola, ${account.name.split(' ')[0]}.` : 'Tu cuenta Hongus'}
      intro="Tu espacio para crecer comienza aquí."
    >
      {account ? (
        <>
          <p className={styles.message}>Sesión activa: {account.email}</p>
          <p>Tipo de cuenta: {account.accountType}</p>
          <button className={styles.button} onClick={logout}>
            Cerrar sesión
          </button>

          <h2>Seguridad de la cuenta</h2>
          <p>Verificación en dos pasos: {mfa?.enabled ? 'activada' : 'desactivada'}</p>
          {!mfa?.enabled && !setup && (
            <button
              className={styles.button}
              onClick={() => run(async () => setSetup(await post('/mfa/setup', {})))}
            >
              Configurar verificación
            </button>
          )}
          {setup && (
            <>
              <p>Agrega este código a tu aplicación de autenticación:</p>
              <p className={styles.message}>
                <code>{setup.secret}</code>
              </p>
              <p>
                También puedes abrir el enlace de configuración en tu dispositivo:{' '}
                <a href={setup.provisioningUri}>Configurar autenticador</a>
              </p>
              <form className={styles.form} onSubmit={(event) => submitCode(event, '/mfa/enable')}>
                <label className={styles.field}>
                  Código de seis dígitos
                  <input name="code" inputMode="numeric" autoComplete="one-time-code" required />
                </label>
                <button className={styles.button}>Activar verificación</button>
              </form>
            </>
          )}
          {mfa?.enabled && (
            <form className={styles.form} onSubmit={(event) => submitCode(event, '/mfa/disable')}>
              <label className={styles.field}>
                Código para desactivar
                <input name="code" autoComplete="one-time-code" required />
              </label>
              <button className={styles.button}>Desactivar verificación</button>
            </form>
          )}
          {recoveryCodes.length > 0 && (
            <section aria-label="Códigos de recuperación">
              <p>
                Guarda estos códigos en un lugar seguro. Cada uno funciona una sola vez y no volverá
                a mostrarse.
              </p>
              <ul>
                {recoveryCodes.map((code) => (
                  <li key={code}>
                    <code>{code}</code>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <h2>Sesiones activas</h2>
          <ul>
            {sessions.map((session) => (
              <li key={session.id}>
                {session.current ? 'Este dispositivo' : session.userAgent || 'Otro dispositivo'}
                {' · '}
                {new Date(session.createdAt).toLocaleString('es-MX')}
                {!session.current && (
                  <button
                    onClick={() =>
                      run(async () => {
                        await api(`/sessions/${session.id}`, { method: 'DELETE' })
                        await loadSecurity()
                      })
                    }
                  >
                    Cerrar
                  </button>
                )}
              </li>
            ))}
          </ul>
          <button
            className={styles.button}
            onClick={() =>
              run(async () => {
                await post('/sessions/logout-all', {})
                window.location.href = '/'
              })
            }
          >
            Cerrar todas las sesiones
          </button>
          {notice && (
            <p role="status" className={styles.message}>
              {notice}
            </p>
          )}
        </>
      ) : (
        <p role="status" className={styles.message}>
          {error || 'Cargando tu cuenta…'}
        </p>
      )}
      {error && (
        <p role="alert" className={`${styles.message} ${styles.error}`}>
          {error} <a href="/iniciar-sesion">Iniciar sesión</a>
        </p>
      )}
    </AuthShell>
  )
}
