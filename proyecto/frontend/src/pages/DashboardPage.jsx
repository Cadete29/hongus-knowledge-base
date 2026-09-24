import { useEffect, useState } from 'react'
import DashboardShell from '../components/dashboard/DashboardShell'
import SummaryCard from '../components/dashboard/SummaryCard'
import styles from '../components/dashboard/Dashboard.module.css'
import { api } from '../lib/api'

const workspaceCopy = {
  mentor: {
    status: 'Mentor · Incorporación pendiente',
    title: 'Comparte lo que sabes. Multiplica posibilidades.',
    cards: [
      ['Solicitudes', '0', 'Aún no tienes solicitudes'],
      ['Próximas sesiones', '0', 'Sin sesiones programadas'],
      ['Personas acompañadas', '0', 'Tu actividad aparecerá aquí'],
    ],
    next: 'Completa tu perfil profesional',
    nextText:
      'Agrega tu experiencia, áreas de acompañamiento y disponibilidad para enviar tu incorporación a revisión.',
    note: 'Elegir el perfil de mentor no activa automáticamente las funciones de acompañamiento.',
    activity: 'Prepara tu primera mentoría',
  },
  organization: {
    status: 'Organización · Incorporación pendiente',
    title: 'Conecta oportunidades con talento',
    cards: [
      ['Convocatorias activas', '0', 'Aún no has publicado'],
      ['Candidaturas', '0', 'Sin candidaturas nuevas'],
      ['Proyectos', '0', 'Tu actividad aparecerá aquí'],
    ],
    next: 'Dale identidad a tu organización',
    nextText:
      'Agrega los datos de tu empresa o institución y completa su incorporación antes de gestionar oportunidades.',
    note: 'La incorporación de tu organización requiere revisión.',
    activity: 'Aquí comenzará tu próxima convocatoria',
  },
}

export default function DashboardPage() {
  const [data, setData] = useState(null),
    [error, setError] = useState('')
  useEffect(() => {
    api('/onboarding')
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])
  async function logout() {
    await api('/sessions/current', { method: 'DELETE' })
    location.href = '/'
  }
  const type = data?.account.accountType
  const workspace = ['company', 'institution'].includes(type)
    ? 'organization'
    : type === 'mentor'
      ? 'mentor'
      : 'talent'
  const copy = workspaceCopy[workspace]
  if (copy)
    return (
      <DashboardShell onLogout={logout} workspace={workspace}>
        <p className={styles.status}>{copy.status}</p>
        <h1 className={styles.title}>{copy.title}</h1>
        {error ? (
          <p>
            {error} <a href="/iniciar-sesion">Iniciar sesión</a>
          </p>
        ) : (
          <>
            <div className={styles.summaries}>
              {copy.cards.map((card) => (
                <SummaryCard key={card[0]} label={card[0]} value={card[1]} detail={card[2]} />
              ))}
            </div>
            <section className={styles.next}>
              <h2>{copy.next}</h2>
              <p>{copy.nextText}</p>
              <a className={styles.primary} href="#">
                {workspace === 'mentor' ? 'Completar perfil profesional' : 'Completar organización'}
              </a>
            </section>
            <p className={styles.note}>{copy.note}</p>
            <section className={styles.activity}>
              <h2>{copy.activity}</h2>
              <p>Organiza la información necesaria para continuar con tu incorporación.</p>
              <a className={styles.secondary} href="#">
                Ver próximos pasos
              </a>
            </section>
          </>
        )}
      </DashboardShell>
    )

  const sub = data?.subscription,
    professional = sub?.plan === 'professional',
    plan = sub ? (professional ? 'Inicio Profesional' : 'Estudiante') : 'Gratis',
    mentoring = sub ? sub.mentoringAllowance - sub.mentoringUsed : 0
  return (
    <DashboardShell onLogout={logout}>
      <p className={styles.status}>Cuenta activa · Plan {plan}</p>
      <h1 className={styles.title}>Tu siguiente paso empieza hoy</h1>
      {error ? (
        <p>
          {error} <a href="/iniciar-sesion">Iniciar sesión</a>
        </p>
      ) : (
        <>
          <div className={styles.summaries}>
            <SummaryCard
              label="Postulaciones a empleos"
              value={sub ? 'Ilimitadas' : '3'}
              detail={sub ? 'Durante tu periodo activo' : 'Disponibles este mes'}
            />
            <SummaryCard
              label="Mis postulaciones"
              value="0"
              detail="Aún no has enviado candidaturas"
            />
            <SummaryCard
              label="Mentorías disponibles"
              value={mentoring}
              detail={sub ? 'Se usan dentro del periodo actual' : 'Disponibles con un plan'}
            />
          </div>
          <section className={styles.next}>
            <h2>Haz que tu perfil hable de ti</h2>
            <p>
              Agrega tus intereses, habilidades y experiencia. Así tendrás un punto de partida para
              explorar oportunidades.
            </p>
            <a className={styles.primary} href="#">
              Completar mi perfil
            </a>
          </section>
          <p className={styles.note}>
            {sub
              ? 'Tu plan incluye convocatorias, proyectos, perfil, contactos, CV con IA y Hongus Verify. Las mentorías del periodo no se acumulan.'
              : type === 'student'
                ? 'Tu acreditación está en revisión. Mientras tanto conservas el plan Gratis con 3 postulaciones al mes.'
                : 'Puedes continuar gratis o revisar los planes disponibles.'}
          </p>
          <section className={styles.activity}>
            <h2>Tu próxima oportunidad aún está por descubrir</h2>
            <p>Explora convocatorias y guarda las que conecten con tus intereses.</p>
            <a className={styles.secondary} href={sub ? '#' : '/planes'}>
              {sub ? 'Explorar oportunidades' : 'Conocer planes'}
            </a>
          </section>
        </>
      )}
    </DashboardShell>
  )
}
