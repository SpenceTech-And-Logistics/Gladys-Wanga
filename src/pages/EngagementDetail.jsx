import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Lightbox from '../components/Lightbox.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { EditLink } from '../components/AdminBar.jsx'
import ShareWhatsApp from '../components/ShareWhatsApp.jsx'
import { formatDate } from '../lib/media.js'
import { useContent } from '../lib/useContent.js'
import NotFound from './NotFound.jsx'

export default function EngagementDetail() {
  const { id } = useParams()
  const { engagements } = useContent()
  const [open, setOpen] = useState(-1)
  const item = engagements.find((p) => p.id === id)
  const photos = (item?.photos || []).map((src) => ({ src, title: item?.title }))
  const move = (d) => setOpen((i) => (i < 0 ? i : (i + d + photos.length) % photos.length))
  const close = () => setOpen(-1)

  if (!item) return <NotFound />
  const facts = [
    ['Category', item.category],
    ['Date', formatDate(item.date)],
    ['Where', item.venue],
  ].filter(([, v]) => v)

  return (
    <>
      <section className="wrap page-head">
        <Link to="/engagements" className="link-arrow rise" style={{ '--d': '0ms' }}>← All engagements</Link>
        <h1 className="rise" style={{ '--d': '80ms', marginTop: 20 }}>{item.title}</h1>
        {item.description && <p className="lead rise" style={{ '--d': '160ms' }}>{item.description}</p>}
        <div className="detail-actions rise" style={{ '--d': '220ms' }}>
          <ShareWhatsApp title={item.title} path={`/engagements/${item.id}`} />
          <EditLink coll="engagements" id={item.id} label="Edit in dashboard" />
        </div>
      </section>
      <section className="wrap section-tight">
        <Reveal className="glance">
          {facts.map(([k, v]) => <div key={k}><small>{k}</small><b>{v}</b></div>)}
        </Reveal>
      </section>
      {photos.length > 0 && (
        <section className="wrap section-tight">
          <div className="mosaic">
            {photos.map((p, i) => (
              <Reveal key={i} delay={(i % 3) * 90}>
                <button type="button" className="tileimg" onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} of ${photos.length}`}>
                  <img src={p.src} alt={`${item.title}, photo ${i + 1}`} loading="lazy" />
                </button>
              </Reveal>
            ))}
          </div>
        </section>
      )}
      {open >= 0 && <Lightbox items={photos} index={open} onClose={close} onMove={move} />}
    </>
  )
}
