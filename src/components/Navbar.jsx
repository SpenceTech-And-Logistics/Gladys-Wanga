import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Crest from './Crest.jsx'
import { useScroll } from '../lib/hooks.js'

const links = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/delivery', 'The Office'],
  ['/county', 'The County'],
  ['/projects', 'Projects'],
  ['/events', 'Events'],
  ['/news', 'News'],
  ['/gallery', 'Gallery'],
  ['/contact', 'Contact'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  useScroll((y) => setScrolled(y > 24))
  const close = () => setOpen(false)

  // Close the phone menu when the page changes (including the browser's back button).
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }

  // While the menu is open: Escape closes it and the page behind does not scroll.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
        <div className="wrap site-header-in">
          <Link to="/" className="brand" onClick={close} aria-label="Gladys Wanga, home">
            <Crest size={44} />
            <span className="brand-name">
              Gladys Wanga
              <br />
              <small>Governor, Homa Bay County</small>
            </span>
          </Link>
          <nav className="nav" id="main-nav" aria-label="Main">
            {links.map(([to, label], i) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={close} style={{ '--i': i }}>
                {label}
              </NavLink>
            ))}
            <Link to="/contact" className="btn btn-solid nav-menu-cta" onClick={close} style={{ '--i': links.length }}>
              Get in touch
            </Link>
          </nav>
          <Link to="/contact" className="btn btn-solid nav-cta" onClick={close}>
            Get in touch
          </Link>
          <button
            type="button"
            className="burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      <div className={`nav-backdrop ${open ? 'is-open' : ''}`} onClick={close} aria-hidden="true" />
    </>
  )
}
