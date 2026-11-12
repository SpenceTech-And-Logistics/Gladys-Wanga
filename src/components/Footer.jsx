import { Link } from 'react-router-dom'
import Crest from './Crest.jsx'
import { WaIcon } from './ShareWhatsApp.jsx'
import { waNumber } from '../lib/media.js'
import { useContent } from '../lib/useContent.js'

export default function Footer() {
  const { contact } = useContent()
  const socials = (contact.social || []).filter((l) => l.url)
  const wa = waNumber(contact.whatsapp)
  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div>
          <div className="brand brand-light">
            <Crest size={48} />
            <span className="brand-name">
              Gladys Wanga
              <br />
              <small>Governor, Homa Bay County</small>
            </span>
          </div>
          <p className="footer-blurb">Governor of Homa Bay County.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/about">About</Link>
          <Link to="/delivery">The Office</Link>
          <Link to="/county">The County</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/events">Events</Link>
          <Link to="/about#positions">Positions</Link>
          <Link to="/news">News</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="footer-contact">
          <span>{contact.assembly}</span>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {wa && (
            <a className="footer-wa" href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
              <WaIcon size={16} /> WhatsApp the office
            </a>
          )}
          {socials.length > 0 && (
            <span className="footer-social">
              {socials.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label || l.url}</a>)}
            </span>
          )}
        </div>
      </div>
      <div className="footer-bar">
        <div className="wrap footer-bar-in">
          <span>© Gladys Wanga, Governor of Homa Bay County</span>
          <span className="footer-bar-end">
            <span>Built by SpenceTec and Logistics Limited</span>
            <Link to="/admin" className="footer-admin">Office sign in</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
