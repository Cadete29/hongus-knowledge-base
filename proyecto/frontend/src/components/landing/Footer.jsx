import { navigation } from './content'
import layout from './Layout.module.css'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={layout.container}>
        <div className={styles.top}>
          <a className={styles.brand} href="#inicio">
            hongus
          </a>
          <nav aria-label="Navegación del pie de página">
            {navigation.map(({ label, id }) => (
              <a href={`#${id}`} key={id}>
                {label}
              </a>
            ))}
          </nav>
        </div>
        <p className={styles.motto}>Construye experiencia. Cultiva futuro.</p>
        <p className={styles.location}>
          México · Oportunidades, formación y desarrollo profesional.
        </p>
        <div className={styles.social}>
          <strong>Sigamos creciendo juntos</strong>
          <div>
            {['Facebook', 'Instagram', 'TikTok', 'YouTube', 'X'].map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
        <div className={styles.legal}>
          <span>© 2026 Hongus.</span>
          <a href="/aviso-de-privacidad">Privacidad</a>
          <a href="/terminos-y-condiciones">Términos</a>
          <a href="mailto:legalidad@hongus.com">Contacto</a>
        </div>
      </div>
    </footer>
  )
}
