import styles from './Subscription.module.css'

export default function PlanCard({ name, price, children, action, onChoose, featured = false }) {
  return (
    <article className={`${styles.planCard} ${featured ? styles.featured : ''}`}>
      <h2>{name}</h2>
      <p className={styles.price}>{price}</p>
      <div className={styles.benefits}>{children}</div>
      <button className={styles.primaryButton} type="button" onClick={onChoose}>
        {action}
      </button>
    </article>
  )
}
