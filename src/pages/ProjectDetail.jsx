import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EditLink } from '../components/AdminBar.jsx'
import Lightbox from '../components/Lightbox.jsx'
import Placeholder from '../components/Placeholder.jsx'
import { Reveal } from '../components/Reveal.jsx'
import ShareWhatsApp from '../components/ShareWhatsApp.jsx'
import { videoInfo } from '../lib/media.js'
import { useContent } from '../lib/useContent.js'
import NotFound from './NotFound.jsx'
import { StageBadge } from './Projects.jsx'

/** Shared layout for a project or an event: facts, story, photos, video, share and edit. */
export function ItemDetail({ item, coll, back, facts, eyebrow }) {
  const [open, setOpen] = useState(-1)
  const photos = (item.photos || []).map((src) => ({ src, title: item.title }))
  const move = (d) => setOpen((i) => (i < 0 ? i : (i + d + photos.length) % photos.length))
  const close = () => setOpen(-1)
  const video = item.video ? videoInfo(item.video) : null
  const shownFacts = facts.filter(([, v]) => v)

  return (
    <>
      <section className="wrap page-head">
        <Link to={back[0]} className="link-arrow rise" style={{ '--d': '0ms' }}>← {back[1]}</Link>
        <div className="detail-eyebrow rise" style={{ '--d': '60ms' }}>
          {eyebrow && <span className="tag">{eyebrow}</span>}
          <StageBadge stage={item.stage} />
        </div>
        <h1 className="rise" style={{ '--d': '100ms', marginTop: 14 }}>{item.title}</h1>
        <div className="detail-actions rise" style={{ '--d': '160ms' }}>
          <ShareWhatsApp title={item.title} path={`/${coll}/${item.id}`} />
          <EditLink coll={item.legacy ? 'database' : coll} id={item.id} label="Edit in dashboard" />
        </div>
      </section>

      {shownFacts.length > 0 && (
        <section className="wrap section-tight">
          <Reveal className="glance">
            {shownFacts.map(([k, v]) => <div key={k}><small>{k}</small><b>{v}</b></div>)}
          </Reveal>
        </section>
      )}

      <section className="wrap section-tight detail-grid">
        <Reveal className="detail-cover">
          {photos[0] ? (
            <button type="button" className="tileimg" onClick={() => setOpen(0)} aria-label="Open the photos">
              <img src={photos[0].src} alt={item.title} />
            </button>
          ) : (
            <Placeholder label="Photos to be added" />
          )}
        </Reveal>
        <Reveal className="detail-text" delay={90}>
          {String(item.description || '')
            .split(/\n{2,}|\n/)
            .filter(Boolean)
            .map((para, i) => <p key={i}>{para}</p>)}
          {video?.embed && (
            <div className="video-frame">
              <iframe src={video.embed} title={`${item.title}, video`} allow="encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
            </div>
          )}
          {item.video && !video?.embed && <a href={item.video} target="_blank" rel="noreferrer" className="link-arrow">Watch the video <span>→</span></a>}
        </Reveal>
      </section>

      {photos.length > 1 && (
        <section className="wrap section-tight">
          <div className="mosaic">
            {photos.slice(1).map((p, i) => (
              <Reveal key={i} delay={(i % 3) * 90}>
                <button type="button" className="tileimg" onClick={() => setOpen(i + 1)} aria-label={`Open photo ${i + 2} of ${photos.length}`}>
                  <img src={p.src} alt={`${item.title}, photo ${i + 2}`} loading="lazy" />
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

export default function ProjectDetail() {
  const { id } = useParams()
  const { projects } = useContent()
  const item = projects.find((p) => p.id === id)
  if (!item) return <NotFound />
  return (
    <ItemDetail
      item={item}
      coll="projects"
      back={['/projects', 'All projects']}
      eyebrow={item.sector}
      facts={[
        ['Funded by', item.fund],
        ['Sector', item.sector],
        ['Status', item.stage],
        ['Ward', item.ward],
        ['Sub-county', item.subcounty],
        ['Year', item.year],
      ]}
    />
  )
}
