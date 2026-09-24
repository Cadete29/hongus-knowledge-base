import { questions } from './content'
import layout from './Layout.module.css'
import styles from './Faq.module.css'

export default function Faq() {
  return (
    <section className={styles.faq} aria-labelledby="faq-heading">
      <div className={layout.container}>
        <p className={layout.eyebrow}>ANTES DE DAR EL SIGUIENTE PASO</p>
        <h2 id="faq-heading">Quizá te lo estás preguntando.</h2>
        <div className={styles.items}>
          {questions.map(([question, answer]) => (
            <div className={styles.item} key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
