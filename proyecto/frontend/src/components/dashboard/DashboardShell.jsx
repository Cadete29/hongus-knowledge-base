import { useState } from 'react'
import styles from './Dashboard.module.css'

const navigation = {
  talent: [
    'Inicio',
    'Mi perfil',
    'Oportunidades',
    'Postulaciones',
    'Formación',
    'Mentorías',
    'Hongus Verify',
    'Mi CV',
    'Mi plan',
  ],
  mentor: [
    'Inicio',
    'Perfil profesional',
    'Disponibilidad',
    'Solicitudes',
    'Mis sesiones',
    'Mensajes',
    'Configuración',
  ],
  organization: [
    'Inicio',
    'Mi organización',
    'Convocatorias',
    'Proyectos',
    'Formación',
    'Candidaturas',
    'Equipo',
  ],
}

export default function DashboardShell({ children, onLogout, workspace = 'talent' }) {
  const [open, setOpen] = useState(false)
  const items = navigation[workspace]
  return (
    <div className={styles.page}>
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <a className={styles.brand} href="/">
          hongus
        </a>
        <p className={styles.space}>
          Espacio de{' '}
          {workspace === 'organization'
            ? 'organización'
            : workspace === 'mentor'
              ? 'mentor'
              : 'talento'}
        </p>
        <nav>
          {items.map((item, index) => (
            <a
              className={index === 0 ? styles.active : ''}
              href={item === 'Mi plan' ? '/planes' : '#'}
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>
        <button className={styles.logout} onClick={onLogout}>
          Cerrar sesión
        </button>
      </aside>
      <main className={styles.workspace}>
        <header className={styles.mobileHeader}>
          <a className={styles.brand} href="/">
            hongus
          </a>
          <button onClick={() => setOpen(!open)}>{open ? 'Cerrar' : 'Menú'}</button>
        </header>
        {children}
      </main>
    </div>
  )
}
