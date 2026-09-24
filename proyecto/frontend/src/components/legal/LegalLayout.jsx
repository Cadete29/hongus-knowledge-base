import legal from '../../../../shared/legal-documents.json'
import styles from './LegalLayout.module.css'

export default function LegalLayout({ document }) {
  const current = legal[document]
  const other =
    document === 'terms'
      ? { href: '/aviso-de-privacidad', label: 'Aviso de Privacidad' }
      : { href: '/terminos-y-condiciones', label: 'Términos y condiciones' }
  const date = new Date(`${legal.updatedAt}T12:00:00Z`).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="/">
          hongus<span>.</span>
        </a>
        <nav aria-label="Navegación legal">
          <a href="/">Inicio</a>
          <a href={other.href}>{other.label}</a>
        </nav>
      </header>
      <main className={styles.main}>
        <p className={styles.eyebrow}>INFORMACIÓN LEGAL · HONGUS</p>
        <h1>{current.title}</h1>
        <p className={styles.meta}>
          Versión {current.version} · Última actualización: {date}
        </p>
        <p className={styles.intro}>{current.intro}</p>
        <nav className={styles.index} aria-label="Contenido de este documento">
          <strong>En este documento</strong>
          <ol>
            {current.sections.map((section, index) => (
              <li key={section.heading}>
                <a href={`#seccion-${index + 1}`}>{section.heading}</a>
              </li>
            ))}
          </ol>
        </nav>
        <article className={styles.article}>
          {current.sections.map((section, index) => (
            <section id={`seccion-${index + 1}`} key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
        <aside className={styles.contact}>
          <h2>¿Tienes alguna duda?</h2>
          <p>
            Escríbenos a <a href={`mailto:${legal.contact}`}>{legal.contact}</a>.
          </p>
        </aside>
      </main>
      <footer className={styles.footer}>
        <span>© 2026 Hongus</span>
        <a href={other.href}>{other.label}</a>
        <a href="/">Volver al inicio</a>
      </footer>
    </div>
  )
}
