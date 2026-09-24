import styles from './Dashboard.module.css'
export default function SummaryCard({ label, value, detail }) {
  return (
    <article className={styles.summary}>
      <strong>{label}</strong>
      <b>{value}</b>
      <span>{detail}</span>
    </article>
  )
}
