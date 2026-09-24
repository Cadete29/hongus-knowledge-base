import { ActionButtons } from './ActionButtons'
import layout from './Layout.module.css'
import styles from './FinalCta.module.css'

export default function FinalCta({ onAction }) {
  return (
    <section className={styles.cta} aria-labelledby="final-heading">
      <div className={`${layout.container} ${styles.inner}`}>
        <p className={`${layout.eyebrow} ${styles.eyebrow}`}>EL FUTURO SE CULTIVA DESDE HOY</p>
        <h2 id="final-heading">
          Tu siguiente capítulo
          <br className={layout.desktopBreak} /> puede empezar aquí.
        </h2>
        <p>Únete a Hongus. Aprende, conecta y construye tu futuro en comunidad.</p>
        <ActionButtons onAction={onAction} />
      </div>
    </section>
  )
}
