import styles from './ActionButtons.module.css'

export function ActionButtons({ onAction }) {
  return (
    <div className={styles.actions}>
      <button
        className={`${styles.button} ${styles.primary}`}
        type="button"
        onClick={() => onAction('Registro')}
      >
        Regístrate
      </button>
      <button
        className={`${styles.button} ${styles.secondary}`}
        type="button"
        onClick={() => onAction('Inicio de sesión')}
      >
        Iniciar sesión
      </button>
    </div>
  )
}

export function JoinButton({ onAction }) {
  return (
    <button
      className={`${styles.button} ${styles.primary} ${styles.join}`}
      type="button"
      onClick={() => onAction('Registro')}
    >
      Únete
    </button>
  )
}
