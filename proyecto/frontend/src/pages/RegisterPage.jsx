import { useState } from 'react'
import AuthShell from '../components/auth/AuthShell'
import styles from '../components/auth/AuthForm.module.css'
import { post } from '../lib/api'
import legal from '../../../shared/legal-documents.json'

const types = [
  ['student', 'Soy estudiante', 'Estudiante'],
  ['graduate', 'Soy egresado o profesional sin experiencia', 'Egresado o profesional'],
  ['mentor', 'Quiero ser mentor o guía', 'Mentor o guía'],
  ['company', 'Represento a una empresa', 'Empresa'],
  ['institution', 'Represento a una universidad o institución', 'Universidad o institución'],
]

function isAdult(value) {
  const birth = new Date(`${value}T00:00:00Z`),
    today = new Date()
  const limit = new Date(
    Date.UTC(today.getUTCFullYear() - 18, today.getUTCMonth(), today.getUTCDate()),
  )
  return !Number.isNaN(birth.getTime()) && birth <= limit
}

export default function RegisterPage() {
  const [type, setType] = useState(''),
    [step, setStep] = useState('type'),
    [status, setStatus] = useState(''),
    [busy, setBusy] = useState(false)
  const [email, setEmail] = useState(''),
    [onboardingToken, setOnboardingToken] = useState(''),
    [accreditation, setAccreditation] = useState(null)

  async function createAccount(event) {
    event.preventDefault()
    setStatus('')
    const form = new FormData(event.currentTarget),
      birthDate = String(form.get('birthDate'))
    if (!isAdult(birthDate)) {
      setStep('age')
      return
    }
    setBusy(true)
    try {
      const result = await post('/accounts', {
        accountType: type,
        name: form.get('name'),
        email: form.get('email'),
        password: form.get('password'),
        birthDate,
        consentAccepted: form.get('consent') === 'on',
      })
      setEmail(String(form.get('email')))
      setOnboardingToken(result.onboardingToken)
      if (type === 'student') setStep('studentVerification')
      else if (type === 'graduate') setStep('plan')
      else await finish(result.onboardingToken, 'free')
    } catch (error) {
      setStatus(error.message)
    } finally {
      setBusy(false)
    }
  }

  async function finish(token, intendedPlan, studentData = accreditation) {
    setBusy(true)
    setStatus('')
    try {
      await post('/accounts/onboarding', {
        onboardingToken: token || onboardingToken,
        intendedPlan,
        ...(studentData ? { accreditation: studentData } : {}),
      })
      setStep('pending')
    } catch (error) {
      setStatus(error.message)
    } finally {
      setBusy(false)
    }
  }

  function saveAccreditation(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget),
      file = form.get('evidence')
    setAccreditation({
      institution: String(form.get('institution')),
      academicLevel: String(form.get('academicLevel')),
      evidenceName: file?.name || '',
    })
    setStep('studentPlan')
  }

  async function resend() {
    setBusy(true)
    setStatus('')
    try {
      await post('/email-confirmations/resend', { email })
      setStatus('Te enviamos un nuevo enlace. Revisa también la carpeta de spam.')
    } catch (error) {
      setStatus(error.message)
    } finally {
      setBusy(false)
    }
  }

  if (step === 'type')
    return (
      <AuthShell
        backHref="/"
        title="¿Cómo quieres participar?"
        intro="Elige tu punto de partida. Puedes corregirlo antes de crear tu cuenta."
        footer={
          <>
            ¿Ya tienes cuenta? <a href="/iniciar-sesion">Iniciar sesión</a>
          </>
        }
      >
        <div className={styles.choiceList}>
          {types.map(([value, label]) => (
            <button
              className={styles.choice}
              type="button"
              key={value}
              onClick={() => {
                setType(value)
                setStep('details')
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </AuthShell>
    )

  if (step === 'studentVerification')
    return (
      <AuthShell
        eyebrow="ESTUDIANTE · VERIFICACIÓN"
        title="Acredita tus estudios."
        intro="Comparte los datos de tus estudios. Tu cuenta gratuita estará disponible después de confirmar tu correo."
      >
        <form className={styles.form} onSubmit={saveAccreditation}>
          <label className={styles.field}>
            Institución
            <input name="institution" required maxLength="160" />
          </label>
          <label className={styles.field}>
            Nivel académico
            <select name="academicLevel" required>
              <option value="">Selecciona una opción</option>
              <option>Preparatoria</option>
              <option>Universidad</option>
              <option>Posgrado</option>
            </select>
          </label>
          <label className={styles.field}>
            Constancia o credencial
            <input name="evidence" type="file" accept=".pdf,.png,.jpg,.jpeg" required />
          </label>
          <p className={styles.hint}>
            En el prototipo local se registra la referencia del archivo. El almacenamiento privado
            se conectará antes de producción.
          </p>
          <button className={styles.button}>Continuar a planes</button>
        </form>
      </AuthShell>
    )

  if (step === 'studentPlan')
    return (
      <AuthShell
        eyebrow="ESTUDIANTE · PLAN"
        title="Empieza gratis mientras revisamos tus estudios."
        intro="El cobro del plan Estudiante solo se habilitará cuando la acreditación sea aprobada."
      >
        <div className={styles.choiceList}>
          <button className={styles.choice} onClick={() => finish('', 'free')}>
            Continuar con Gratis · $0 MXN
          </button>
          <button className={styles.choice} onClick={() => finish('', 'student')}>
            Solicitar Estudiante · $50 MXN/mes al aprobarse
          </button>
        </div>
        {status && <p className={`${styles.message} ${styles.error}`}>{status}</p>}
      </AuthShell>
    )

  if (step === 'plan')
    return (
      <AuthShell
        eyebrow="EGRESADO / PROFESIONAL · PLAN"
        title="Elige cómo quieres empezar."
        intro="La elección no realiza ningún cargo. Primero confirmarás tu correo."
      >
        <div className={styles.choiceList}>
          <button className={styles.choice} onClick={() => finish('', 'free')}>
            Gratis · $0 MXN
          </button>
          <button className={styles.choice} onClick={() => finish('', 'professional')}>
            Inicio Profesional · $200 MXN/mes
          </button>
        </div>
        {status && <p className={`${styles.message} ${styles.error}`}>{status}</p>}
      </AuthShell>
    )

  if (step === 'pending')
    return (
      <AuthShell
        eyebrow="CONFIRMA TU CORREO"
        title="Revisa tu bandeja de entrada"
        intro="Enviamos un enlace de un solo uso. Tu acceso se habilitará exclusivamente al abrir el botón del correo."
      >
        <button className={styles.button} type="button" onClick={resend} disabled={busy}>
          {busy ? 'Enviando…' : 'Reenviar enlace'}
        </button>
        {status && (
          <p role="status" className={styles.message}>
            {status}
          </p>
        )}
        <a className={styles.secondary} href="/">
          Volver a Hongus
        </a>
      </AuthShell>
    )

  if (step === 'age')
    return (
      <AuthShell
        eyebrow="REGISTRO · REQUISITO DE EDAD"
        title="Hongus es para mayores de 18 años."
        intro="No podemos continuar con la fecha que ingresaste."
      >
        <button className={styles.button} onClick={() => setStep('details')}>
          Corregir fecha de nacimiento
        </button>
      </AuthShell>
    )

  return (
    <AuthShell
      compact
      backAction={() => setStep('type')}
      backLabel="Cambiar cómo participo"
      title={types.find(([value]) => value === type)?.[2] || 'Crea tu cuenta'}
      intro="Crea tu cuenta en Hongus"
      footer={
        <>
          ¿Ya tienes cuenta? <a href="/iniciar-sesion">Iniciar sesión</a>
        </>
      }
    >
      <form className={`${styles.form} ${styles.compactForm}`} onSubmit={createAccount}>
        <label className={styles.field}>
          Nombre completo
          <input name="name" autoComplete="name" minLength="2" maxLength="120" required />
        </label>
        <label className={styles.field}>
          Correo electrónico
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className={styles.field}>
          Contraseña
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength="12"
            maxLength="128"
            required
          />
        </label>
        <label className={styles.field}>
          Fecha de nacimiento
          <input name="birthDate" type="date" required />
        </label>
        <p className={styles.hint}>Hongus es para personas de 18 años en adelante.</p>
        <p className={styles.hint}>
          {legal.responsible}, domicilio {legal.address}, tratará tus datos para crear y proteger tu
          acceso. Consulta el{' '}
          <a href="/aviso-de-privacidad" target="_blank" rel="noreferrer">
            Aviso de Privacidad Integral
          </a>
          .
        </p>
        <label className={styles.consent}>
          <input name="consent" type="checkbox" required />
          <span>
            Acepto los{' '}
            <a href="/terminos-y-condiciones" target="_blank" rel="noreferrer">
              Términos y condiciones
            </a>{' '}
            y he leído el Aviso de Privacidad.
          </span>
        </label>
        <button className={styles.button} disabled={busy}>
          {busy ? 'Creando cuenta…' : 'Crear mi cuenta'}
        </button>
      </form>
      {status && (
        <p role="alert" className={`${styles.message} ${styles.error}`}>
          {status}
        </p>
      )}
    </AuthShell>
  )
}
