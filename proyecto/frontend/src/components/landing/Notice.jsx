import styles from './Notice.module.css'

export default function Notice({ message, onClose }) {
  if (!message) return null
  return (
    <div className={styles.notice} role="status">
      <span>{message}</span>
      <button type="button" aria-label="Cerrar aviso" onClick={onClose}>
        ×
      </button>
    </div>
  )
}
