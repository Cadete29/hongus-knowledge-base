import symbol from '../../assets/figma/hongus-symbol.svg'
import { ActionButtons } from './ActionButtons'
import layout from './Layout.module.css'
import styles from './Hero.module.css'

export default function Hero({ onAction }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={`${layout.container} ${styles.inner}`}>
        <p className={layout.eyebrow}>TALENTO QUE CRECE. UN FUTURO MÁS VERDE.</p>
        <img
          className={styles.symbol}
          src={symbol}
          width="200"
          height="200"
          alt="Símbolo de Hongus"
        />
        <h1 id="hero-heading">
          Construye experiencia.
          <br />
          Cultiva futuro.
        </h1>
        <p className={styles.intro}>
          Un espacio para conectar tu talento con oportunidades, formación y personas que te ayudan
          a dar el siguiente paso.
        </p>
        <ActionButtons onAction={onAction} />
        <p className={styles.closing}>
          Únete a Hongus y crece con una comunidad que cree en tu talento.
        </p>
      </div>
    </section>
  )
}
