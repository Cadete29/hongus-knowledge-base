import { useEffect, useRef, useState } from 'react'
import { ActionButtons, JoinButton } from './ActionButtons'
import { navigation, navigationPanels } from './content'
import layout from './Layout.module.css'
import styles from './Header.module.css'

function InfoPanel({ id, onClose }) {
  const { eyebrow, title, paragraphs, groups } = navigationPanels[id]
  return (
    <div className={styles.infoPanel} id={`panel-${id}`}>
      <button className={styles.panelClose} type="button" onClick={onClose}>
        Cerrar <span aria-hidden="true">×</span>
      </button>
      <p className={layout.eyebrow}>{eyebrow}</p>
      <h2>{title}</h2>
      {paragraphs?.map((text) => (
        <p key={text}>{text}</p>
      ))}
      {groups?.map(([heading, text]) => (
        <div className={styles.panelGroup} key={heading}>
          <h3>{heading}</h3>
          <p>{text}</p>
        </div>
      ))}
    </div>
  )
}

export default function Header({ onAction }) {
  const [activePanel, setActivePanel] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)
  const menuButtonRef = useRef(null)

  useEffect(() => {
    function handleEscape(event) {
      if (event.key !== 'Escape') return
      if (menuOpen) {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
      if (activePanel) {
        setActivePanel(null)
        const trigger = navRef.current?.querySelector(`[aria-controls="panel-${activePanel}"]`)
        const focusTarget = trigger || menuButtonRef.current
        focusTarget?.focus()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [activePanel, menuOpen])

  function handleAction(name) {
    setMenuOpen(false)
    setActivePanel(null)
    onAction(name)
  }

  return (
    <header className={styles.header}>
      <div className={styles.island} ref={navRef}>
        <a className={styles.brand} href="#inicio" aria-label="Hongus, ir al inicio">
          hongus
        </a>
        <nav className={styles.desktopNav} aria-label="Navegación principal">
          {navigation.map(({ label, id }) => (
            <button
              key={id}
              type="button"
              aria-expanded={activePanel === id}
              aria-controls={`panel-${id}`}
              onClick={() => setActivePanel((current) => (current === id ? null : id))}
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          className={styles.menuButton}
          ref={menuButtonRef}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => {
            setMenuOpen((open) => !open)
            setActivePanel(null)
          }}
        >
          Menú
        </button>
        <JoinButton onAction={handleAction} />
        {activePanel && <InfoPanel id={activePanel} onClose={() => setActivePanel(null)} />}
      </div>
      {menuOpen && (
        <nav className={styles.mobileMenu} id="mobile-menu" aria-label="Navegación móvil">
          <button
            className={styles.mobileClose}
            type="button"
            onClick={() => {
              setMenuOpen(false)
              menuButtonRef.current?.focus()
            }}
          >
            Cerrar <span aria-hidden="true">×</span>
          </button>
          {navigation.map(({ label, id }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActivePanel(id)
                setMenuOpen(false)
              }}
            >
              {label}
            </button>
          ))}
          <ActionButtons onAction={handleAction} />
        </nav>
      )}
    </header>
  )
}
