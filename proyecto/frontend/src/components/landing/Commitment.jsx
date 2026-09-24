import { useEffect, useRef } from 'react'
import seed from '../../assets/figma/tech-seed.svg'
import layout from './Layout.module.css'
import styles from './Commitment.module.css'

export default function Commitment() {
  const artRef = useRef(null)

  useEffect(() => {
    const art = artRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let currentOffset = 0
    let momentum = 0
    let previousTime = 0
    let previousScroll = window.scrollY

    const update = (time) => {
      frame = 0
      const elapsed = Math.min(64, previousTime ? time - previousTime : 16.67)
      previousTime = time
      const { top, height } = art.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const progress = Math.max(
        -1,
        Math.min(1, (viewportHeight / 2 - top - height / 2) / ((viewportHeight + height) / 2)),
      )
      // Fast scrolling adds a bounded impulse that settles after scrolling stops.
      const scrollDelta = window.scrollY - previousScroll
      previousScroll = window.scrollY
      momentum = Math.max(
        -height * 0.14,
        Math.min(height * 0.14, momentum * Math.exp(-elapsed / 180) + scrollDelta * 0.22),
      )
      const target = Math.max(
        -height * 0.3,
        Math.min(height * 0.3, progress * height * 0.26 + momentum),
      )
      currentOffset += (target - currentOffset) * (1 - Math.exp(-elapsed / 110))
      art.style.setProperty('--parallax-y', `${currentOffset}px`)
      if (Math.abs(target - currentOffset) > 0.1 || Math.abs(momentum) > 0.1) {
        frame = window.requestAnimationFrame(update)
      } else {
        previousTime = 0
      }
    }
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    const syncMotion = () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.cancelAnimationFrame(frame)
      frame = 0
      previousTime = 0
      previousScroll = window.scrollY
      momentum = 0
      if (reducedMotion.matches) {
        currentOffset = 0
        art.style.setProperty('--parallax-y', '0px')
        return
      }
      window.addEventListener('scroll', scheduleUpdate, { passive: true })
      window.addEventListener('resize', scheduleUpdate)
      scheduleUpdate()
    }

    syncMotion()
    reducedMotion.addEventListener('change', syncMotion)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      reducedMotion.removeEventListener('change', syncMotion)
    }
  }, [])

  return (
    <section className={styles.commitment} id="compromiso" aria-labelledby="commitment-heading">
      <div className={`${layout.container} ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={`${layout.eyebrow} ${styles.eyebrow}`}>CRECER TAMBIÉN ES CUIDAR</p>
          <h2 id="commitment-heading">
            Tu futuro y el
            <br className={layout.desktopBreak} /> del planeta pueden
            <br className={layout.desktopBreak} /> crecer juntos.
          </h2>
          <p>
            Creemos en una vida profesional que también contribuya al cuidado ambiental. Por eso, la
            empleabilidad verde está en el centro de Hongus.
          </p>
          <strong>Aprendizaje · Colaboración · Conciencia ambiental</strong>
        </div>
        <div ref={artRef} className={styles.art}>
          <img src={seed} width="216" height="216" alt="" />
        </div>
      </div>
    </section>
  )
}
