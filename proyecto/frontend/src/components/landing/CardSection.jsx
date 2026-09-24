import layout from './Layout.module.css'
import styles from './CardSection.module.css'

export default function CardSection({
  id,
  headingId,
  eyebrow,
  title,
  intro,
  items,
  tone = 'white',
  whiteCards = false,
}) {
  return (
    <section
      className={`${styles.section} ${tone === 'mist' ? styles.mist : styles.white}`}
      id={id}
      aria-labelledby={headingId}
    >
      <div className={layout.container}>
        <p className={layout.eyebrow}>{eyebrow}</p>
        <h2 id={headingId}>{title}</h2>
        {intro && <p className={styles.intro}>{intro}</p>}
        <div className={styles.cards}>
          {items.map(([tag, cardTitle, text]) => (
            <article className={`${styles.card} ${whiteCards ? styles.whiteCard : ''}`} key={tag}>
              <p className={styles.cardTag}>{tag}</p>
              <h3>{cardTitle}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
