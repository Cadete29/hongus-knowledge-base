import { useEffect, useState } from 'react'
import AuthShell from '../components/auth/AuthShell'
import PlanCard from '../components/subscription/PlanCard'
import styles from '../components/subscription/Subscription.module.css'
import { api } from '../lib/api'

export default function PlansPage() {
  const [data, setData] = useState(null),
    [error, setError] = useState('')
  useEffect(() => {
    api('/onboarding')
      .then((result) => {
        if (result.subscription) location.href = '/suscripcion-activa'
        else setData(result)
      })
      .catch((e) => setError(e.message))
  }, [])
  const professional = data?.account.accountType === 'graduate'
  const student = data?.eligiblePlans.includes('student')
  const choose = (plan) => {
    location.href = `/revisar-suscripcion?plan=${plan}`
  }
  return (
    <AuthShell>
      <section className={styles.plans}>
        <p className={styles.eyebrow}>
          {professional ? 'EGRESADO / PROFESIONAL' : 'ESTUDIANTE'} · ELIGE TU PLAN
        </p>
        <h1>Crece a tu ritmo.</h1>
        <p>Elige lo que necesitas hoy. Continuar gratis siempre es una opción.</p>
        <div className={styles.grid}>
          <PlanCard
            name="Gratis"
            price="$0 MXN"
            action="Continuar gratis"
            onChoose={() => (location.href = '/dashboard')}
          >
            3 postulaciones a empleos al mes.{`\n\n`}No incluye convocatorias, proyectos, perfil
            público, contactos, CV con IA ni mentorías.
          </PlanCard>
          {professional && (
            <PlanCard
              featured
              name="Inicio Profesional"
              price="$200 MXN/mes"
              action="Elegir Inicio Profesional"
              onChoose={() => choose('professional')}
            >
              Postulaciones ilimitadas a empleos{`\n`}Convocatorias y proyectos{`\n`}4 mentorías
              individuales al mes{`\n`}CV principal y versiones para vacantes{`\n`}Perfil, contactos
              y Hongus Verify
            </PlanCard>
          )}
          {!professional && (
            <PlanCard
              featured
              name="Estudiante"
              price="$50 MXN/mes"
              action={student ? 'Elegir Estudiante' : 'Acreditar mis estudios'}
              onChoose={() => (student ? choose('student') : (location.href = '/dashboard'))}
            >
              Postulaciones ilimitadas{`\n`}Convocatorias y proyectos{`\n`}1 mentoría individual al
              mes{`\n`}CV principal editable{`\n`}Perfil, contactos y Hongus Verify
            </PlanCard>
          )}
        </div>
        <p className={styles.finePrint}>
          Las mentorías incluidas vencen al finalizar el periodo y no se acumulan. Contratar un plan
          no garantiza selección ni contratación.
        </p>
        {error && (
          <p role="alert" className={styles.error}>
            {error} <a href="/iniciar-sesion">Iniciar sesión</a>
          </p>
        )}
      </section>
    </AuthShell>
  )
}
