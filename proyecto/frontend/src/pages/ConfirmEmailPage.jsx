import { useEffect, useRef, useState } from 'react'
import AuthShell from '../components/auth/AuthShell'
import styles from '../components/auth/AuthForm.module.css'
import { post } from '../lib/api'

export default function ConfirmEmailPage() {
  const [token] = useState(() => new URLSearchParams(window.location.search).get('token'))
  const [status, setStatus] = useState(token ? 'loading' : 'error')
  const [message, setMessage] = useState(token ? '' : 'Falta el enlace de confirmación.')
  const [destination, setDestination] = useState('/dashboard')
  const started = useRef(false)
  useEffect(() => {
    if (started.current || !token) return
    started.current = true
    window.history.replaceState({}, '', '/confirmar-correo')
    post('/email-confirmations', { token })
      .then((result) => {
        setDestination(`/dashboard?workspace=${result.workspace}`)
        setStatus('success')
      })
      .catch((error) => {
        setMessage(error.message)
        setStatus('error')
      })
  }, [token])
  if (status === 'success')
    return (
      <AuthShell
        eyebrow="CORREO CONFIRMADO"
        title="Ya eres parte de Hongus."
        intro="Tu cuenta está activa. Entra a tu espacio y empieza a construir tu perfil."
      >
        <a className={styles.button} href={destination}>
          Ir a mi espacio
        </a>
        <p className={styles.hint}>Tu siguiente paso empieza aquí.</p>
      </AuthShell>
    )
  if (status === 'loading')
    return (
      <AuthShell
        eyebrow="CONFIRMA TU CORREO"
        title="Estamos confirmando tu correo"
        intro="Esto solo tomará un momento."
      >
        <p role="status" className={styles.hint}>
          Verificando enlace…
        </p>
      </AuthShell>
    )
  return (
    <AuthShell
      eyebrow="CONFIRMAR CORREO · ENLACE CADUCADO"
      title="Solicita un nuevo enlace."
      intro="El enlace de confirmación ya no es válido. Puedes pedir otro sin volver a crear tu cuenta."
    >
      <p role="alert" className={`${styles.message} ${styles.error}`}>
        {message}
      </p>
      <a className={styles.button} href="/reenviar-confirmacion">
        Reenviar enlace
      </a>
      <a className={styles.secondary} href="/registro">
        Corregir mi correo
      </a>
    </AuthShell>
  )
}
