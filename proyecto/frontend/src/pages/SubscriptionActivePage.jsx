import { useEffect, useState } from 'react'
import AuthShell from '../components/auth/AuthShell'
import styles from '../components/subscription/Subscription.module.css'
import { api } from '../lib/api'
export default function SubscriptionActivePage() {
  const [sub, setSub] = useState(null),
    [error, setError] = useState('')
  useEffect(() => {
    api('/onboarding')
      .then((r) => (r.subscription ? setSub(r.subscription) : (location.href = '/planes')))
      .catch((e) => setError(e.message))
  }, [])
  const professional = sub?.plan === 'professional'
  return (
    <AuthShell
      eyebrow="MI SUSCRIPCIÓN · ACTIVA"
      title={
        sub
          ? `Tu plan ${professional ? 'Inicio Profesional' : 'Estudiante'} está activo.`
          : 'Comprobando tu suscripción…'
      }
      intro={
        professional
          ? 'Conecta tus capacidades con nuevas oportunidades.'
          : 'Sigue aprendiendo y construyendo experiencia.'
      }
    >
      <div className={styles.summary}>
        {sub && (
          <>
            <p>
              {professional ? 'Inicio Profesional · $200 MXN / mes' : 'Estudiante · $50 MXN / mes'}
              <br />
              Periodo: {new Date(sub.startsAt).toLocaleDateString('es-MX')} –{' '}
              {new Date(sub.endsAt).toLocaleDateString('es-MX')}
            </p>
            <p>
              Mentorías del periodo: {sub.mentoringAllowance - sub.mentoringUsed} disponibles
              <br />
              Postulaciones a empleos: ilimitadas
              <br />
              Convocatorias, proyectos, perfil, contactos, CV y Hongus Verify incluidos.
            </p>
            <a className={styles.primaryButton} href="/dashboard">
              Ir a mi espacio
            </a>
            <a className={styles.secondaryButton} href="/mi-cuenta">
              Gestionar cuenta
            </a>
            <p className={styles.finePrint}>Las mentorías del periodo no se acumulan.</p>
          </>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </AuthShell>
  )
}
