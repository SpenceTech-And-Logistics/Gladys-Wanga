import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EditLink } from '../components/AdminBar.jsx'
import PageHead from '../components/PageHead.jsx'
import Portrait from '../components/Portrait.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { oldestFirst } from '../lib/media.js'
import { useContent } from '../lib/useContent.js'

export default function About() {
  const { profile, positions, lists } = useContent()
  const [cat, setCat] = useState('All')
  const posCats = ['All', ...lists.positionCategories.filter((c) => positions.some((p) => p.category === c))]
  return (
    <>
      <PageHead eyebrow="About" title={profile.title} lead={`Her Excellency ${profile.officialName}${profile.honours ? `, ${profile.honours}` : ''}.`} />

      <section className="wrap section-tight">
        <div className="split">
          <Reveal variant="left"><Portrait /></Reveal>
          <Reveal variant="right" className="prose">
            {profile.bio.map((p, i) => <p key={i}>{p}</p>)}
          </Reveal>
        </div>
      </section>

      <section className="wrap section-tight">
        <Reveal className="glance">
          <div><small>Office</small><b>{profile.office}</b></div>
          <div><small>County</small><b>{profile.county}</b></div>
          <div><small>Party</small><b>{profile.party}</b></div>
          <div><small>Background</small><b>{profile.background}</b></div>
        </Reveal>
      </section>

      <section className="wrap section">
        <Reveal><span className="eyebrow">Career</span><h2 className="title" style={{ marginBottom: 32 }}>Service and milestones</h2></Reveal>
        <Reveal className="timeline">
          {oldestFirst(profile.timeline).map((t) => (
            <div className="t-item" key={t.title}>
              {t.when && <span className="t-when">{t.when}</span>}
              <h3>{t.title}</h3>
              {t.detail && <p>{t.detail}</p>}
            </div>
          ))}
        </Reveal>
      </section>

      {profile.education.length > 0 && <section className="wrap section-tight">
        <Reveal><span className="eyebrow">Education</span><h2 className="title" style={{ marginBottom: 28 }}>Qualifications</h2></Reveal>
        <div className="grid grid-3">
          {oldestFirst(profile.education).map((e, i) => (
            <Reveal key={e.title} className="card" delay={i * 90}>
              {e.when && <span className="num">{e.when}</span>}
              <h3>{e.title}</h3>
              {e.detail && <p>{e.detail}</p>}
            </Reveal>
          ))}
        </div>
      </section>}

      {profile.vision && (
        <section className="wrap section">
          <Reveal className="cta">
            <div><span className="eyebrow" style={{ color: '#e9cf94' }}>Vision</span><h2 style={{ marginTop: 12 }}>{profile.vision}</h2></div>
          </Reveal>
        </section>
      )}

      <section className="wrap section" id="positions">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow">Positions</span>
            <h2 className="title">Offices and responsibilities</h2>
          </div>
        </Reveal>
        <div className="chips" style={{ marginBottom: 28 }} role="group" aria-label="Filter positions">
          {posCats.map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="grid grid-3">
          {positions.filter((p) => cat === 'All' || p.category === cat).map((p, i) => (
            <Reveal key={p.id || p.title} className="card pos-card" delay={(i % 3) * 70}>
              <div className="pos-top">
                <span className="tag">{p.category}</span>
                {p.period && <span className="pos-when">{p.period}</span>}
              </div>
              <h3>{p.title}</h3>
              <b className="pos-org">{p.organisation}</b>
              {p.description && <p>{p.description}</p>}
              <EditLink coll="positions" id={p.id} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <Reveal className="cta">
          <div><h2>The Governor’s office</h2><p>Its constitutional basis, its functions, and the county executive.</p></div>
          <Link to="/delivery" className="btn btn-light">The Governor’s office</Link>
        </Reveal>
      </section>
    </>
  )
}
