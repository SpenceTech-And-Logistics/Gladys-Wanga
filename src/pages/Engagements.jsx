import { useState } from 'react'
import { Link } from 'react-router-dom'
import Empty from '../components/Empty.jsx'
import PageHead from '../components/PageHead.jsx'
import Placeholder from '../components/Placeholder.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { formatDate } from '../lib/media.js'
import { useContent } from '../lib/useContent.js'

export default function Engagements() {
  const { engagements } = useContent()
  const [cat, setCat] = useState('All')
  const cats = ['All', ...new Set(engagements.map((p) => p.category).filter(Boolean))]
  const shown = cat === 'All' ? engagements : engagements.filter((p) => p.category === cat)

  return (
    <>
      <PageHead
        eyebrow="Engagements"
        title="The Governor at work"
        lead="Milestones from county leadership, Parliament, party and campaigns."
      />
      <section className="wrap section-tight">
        {engagements.length === 0 ? (
          <Empty
            title="Engagements are on the way"
            text="The office is preparing the list of the Governor’s engagements. They will appear here, with photos, as soon as they are published."
            cta={{ to: '/contact', label: 'Write to the office' }}
          />
        ) : (
          <>
            <div className="chips" role="group" aria-label="Filter engagements" style={{ marginBottom: 28 }}>
              {cats.map((c) => (
                <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
            <div className="grid grid-3">
              {shown.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 100}>
                  <Link to={`/engagements/${p.id}`} className="card card-link">
                    <div className="card-img">{p.photos?.[0] ? <img src={p.photos[0]} alt={p.title} loading="lazy" /> : <Placeholder />}</div>
                    <div className="card-body">
                      <span className="tag">{p.category}</span>
                      <h3>{p.title}</h3>
                      {p.description && <p>{p.description.length > 120 ? `${p.description.slice(0, 117)}…` : p.description}</p>}
                      <span className="meta">{[p.venue, formatDate(p.date)].filter(Boolean).join(' · ')}</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}
