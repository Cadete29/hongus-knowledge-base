import CardSection from '../components/landing/CardSection'
import Commitment from '../components/landing/Commitment'
import { community, possibilities, steps } from '../components/landing/content'
import Faq from '../components/landing/Faq'
import FinalCta from '../components/landing/FinalCta'
import Footer from '../components/landing/Footer'
import Header from '../components/landing/Header'
import Hero from '../components/landing/Hero'
import layout from '../components/landing/Layout.module.css'

export default function LandingPage() {
  const goToAuth = (name) => {
    window.location.href = name === 'Registro' ? '/registro' : '/iniciar-sesion'
  }

  return (
    <>
      <Header onAction={goToAuth} />
      <main id="inicio">
        <Hero onAction={goToAuth} />
        <CardSection
          id="que-es-hongus"
          headingId="possibilities-heading"
          eyebrow="UN ECOSISTEMA PARA TU SIGUIENTE PASO"
          title={
            <>
              Tu potencial merece
              <br className={layout.desktopBreak} /> un lugar para crecer.
            </>
          }
          intro="Conectamos lo que aprendes con lo que puedes lograr."
          items={possibilities}
        />
        <CardSection
          id="como-funciona"
          headingId="steps-heading"
          eyebrow="ASÍ COMIENZA TU RECORRIDO"
          title={
            <>
              Cada paso cuenta.
              <br className={layout.desktopBreak} /> Cada logro abre posibilidades.
            </>
          }
          items={steps}
          tone="mist"
          whiteCards
        />
        <Commitment />
        <CardSection
          id="nosotros"
          headingId="community-heading"
          eyebrow="CRECEMOS EN COMUNIDAD"
          title="Tu talento tiene un lugar aquí."
          intro="Diferentes puntos de partida. Un mismo deseo de avanzar."
          items={community}
        />
        <Faq />
        <FinalCta onAction={goToAuth} />
      </main>
      <Footer />
    </>
  )
}
