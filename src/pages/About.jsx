import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import Portrait from '../components/Portrait.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { useContent } from '../lib/useContent.js'

export default function About() {
  const { profile } = useContent()
  return (
    <>
      <PageHead eyebrow="About" title={profile.title} lead={`${profile.name}, ${profile.officialName} in public records.`} />

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
          {profile.timeline.map((t) => (
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
          {profile.education.map((e, i) => (
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

      <section className="wrap section-tight">
        <div className="grid grid-2">
          <Reveal>
            <Link to="/positions" className="card card-more">
              <span className="eyebrow">Positions</span>
              <h3>Offices, committees and party roles</h3>
              <span className="link-arrow">See all positions <span>→</span></span>
            </Link>
          </Reveal>
          <Reveal delay={90}>
            <Link to="/engagements" className="card card-more">
              <span className="eyebrow">Engagements</span>
              <h3>Milestones from county leadership, Parliament and campaigns</h3>
              <span className="link-arrow">See all engagements <span>→</span></span>
            </Link>
          </Reveal>
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
