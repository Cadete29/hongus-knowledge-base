import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ConfirmEmailPage from './pages/ConfirmEmailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import AccountPage from './pages/AccountPage'
import ResendConfirmationPage from './pages/ResendConfirmationPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import PlansPage from './pages/PlansPage'
import CheckoutPage from './pages/CheckoutPage'
import SubscriptionActivePage from './pages/SubscriptionActivePage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  const pages = {
    '/': LandingPage,
    '/registro': RegisterPage,
    '/iniciar-sesion': LoginPage,
    '/confirmar-correo': ConfirmEmailPage,
    '/reenviar-confirmacion': ResendConfirmationPage,
    '/recuperar-contrasena': ForgotPasswordPage,
    '/restablecer-contrasena': ResetPasswordPage,
    '/mi-cuenta': AccountPage,
    '/terminos-y-condiciones': TermsPage,
    '/aviso-de-privacidad': PrivacyPage,
    '/planes': PlansPage,
    '/revisar-suscripcion': CheckoutPage,
    '/suscripcion-activa': SubscriptionActivePage,
    '/dashboard': DashboardPage,
  }
  const Page = pages[window.location.pathname] || LandingPage
  return <Page />
}
