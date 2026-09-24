import { useState } from 'react'
import AuthShell from '../components/auth/AuthShell'
import styles from '../components/subscription/Subscription.module.css'
import { post } from '../lib/api'

const details = {
  professional: {
    label: 'Inicio Profesional',
    price: '$200 MXN por mes',
    description:
      'Incluye postulaciones ilimitadas, convocatorias y proyectos, versiones de CV para vacantes y 4 mentorías individuales por periodo.',
  },
  student: {
    label: 'Estudiante',
    price: '$50 MXN por mes',
    description:
      'Incluye postulaciones ilimitadas, convocatorias y proyectos, un CV principal editable y 1 mentoría individual por periodo.',
  },
}
export default function CheckoutPage() {
  const plan = new URLSearchParams(location.search).get('plan'),
    info = details[plan] || details.professional
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [order, setOrder] = useState(null)
  async function continuePayment() {
    setBusy(true)
    setError('')
    try {
      const created = await post('/subscription-orders', {
        plan,
        idempotencyKey: crypto.randomUUID().replaceAll('-', ''),
      })
      setOrder(created)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }
  async function confirm() {
    setBusy(true)
    setError('')
    try {
      await post(`/subscription-orders/${order.order.id}/simulate-confirmation`, {})
      location.href = '/suscripcion-activa'
    } catch (e) {
      setError(e.message)
      setBusy(false)
    }
  }
  return (
    <AuthShell
      eyebrow={order ? 'PAGO DE DESARROLLO' : 'REVISAR SUSCRIPCIÓN · ' + info.label.toUpperCase()}
      title={order ? 'Checkout simulado' : 'Revisa tu elección.'}
      intro={
        order
          ? 'Este entorno permite validar el recorrido sin realizar un cargo real.'
          : plan === 'student'
            ? 'Tu acreditación está aprobada. Elegir un plan todavía no realiza ningún cargo.'
            : 'No necesitas acreditar estudios para este plan. Elegirlo todavía no realiza ningún cargo.'
      }
    >
      <div className={styles.summary}>
        <p>
          <strong>{info.label}</strong>
          <br />
          {info.price}
        </p>
        <p>{info.description}</p>
        <p>
          {order
            ? 'Importe final: ' +
              (order.order.amountCents / 100).toLocaleString('es-MX', {
                style: 'currency',
                currency: 'MXN',
              })
            : 'Al continuar podrás revisar el importe final y las condiciones antes de confirmar el pago.'}
        </p>
        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={order ? confirm : continuePayment}
            disabled={busy}
          >
            {busy ? 'Procesando…' : order ? 'Simular pago confirmado' : 'Continuar al pago'}
          </button>
          <a className={styles.secondaryButton} href="/planes">
            Volver a elegir
          </a>
          <a className={styles.secondaryButton} href="/dashboard">
            Continuar gratis
          </a>
        </div>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
      </div>
    </AuthShell>
  )
}
