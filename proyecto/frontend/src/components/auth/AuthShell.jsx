import symbol from '../../assets/figma/hongus-symbol.svg'
import styles from './AuthShell.module.css'

export default function AuthShell({
  eyebrow,
  title,
  intro,
  children,
  footer,
  backHref,
  backAction,
  backLabel,
  compact = false,
}) {
  return (
    <div className={styles.page}>
      <aside className={styles.identity} aria-label="Identidad Hongus">
        <img className={styles.symbol} src={symbol} width="176" height="176" alt="" />
        <p className={styles.identityTitle}>
          Construye experiencia.
          <br />
          Cultiva futuro.
        </p>
        <p className={styles.identityIntro}>
          Un espacio para aprender, conectar y dar el siguiente paso.
        </p>
        <p className={styles.identityClosing}>Tu talento tiene un lugar aquí.</p>
      </aside>
      <main className={styles.content}>
        <div className={`${styles.inner} ${compact ? styles.compact : ''}`}>
          <a className={styles.mobileBrand} href="/">
            hongus
          </a>
          {backHref && (
            <a className={styles.back} href={backHref}>
              ← {backLabel || 'Volver a Hongus'}
            </a>
          )}
          {backAction && (
            <button className={styles.backButton} type="button" onClick={backAction}>
              ← {backLabel}
            </button>
          )}
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          {title && <h1>{title}</h1>}
          {intro && <p className={styles.intro}>{intro}</p>}
          {children}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </main>
    </div>
  )
}
