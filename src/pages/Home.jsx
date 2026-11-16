import { lazy, Suspense } from 'react'
import Placeholder from '../components/Placeholder.jsx'
import { Link } from 'react-router-dom'
import { CountUp, Reveal } from '../components/Reveal.jsx'
import Crest from '../components/Crest.jsx'
import Tilt from '../components/Tilt.jsx'
import Marquee from '../components/Marquee.jsx'
import Portrait from '../components/Portrait.jsx'
import { useContent } from '../lib/useContent.js'
import { formatDate } from '../lib/media.js'

const LakeScene = lazy(() => import('../Scene3D.jsx'))

export default function Home() {
  const { profile, delivery, press, events, positions, contact } = useContent()
  const socials = (contact.social || []).filter((l) => l.url)
  const news = press.slice(0, 3)
  const stats = (delivery.stats || []).map((s) => ({ n: Number(s.value) || 0, label: s.label }))

  return (
    <>
      <section className="hero3d">
        <div className="sky" aria-hidden="true" />
        <Suspense fallback={null}><LakeScene /></Suspense>
        <div className="wrap hero">
          <div>
            <span className="eyebrow rise" style={{ '--d': '0ms' }}>Governor · Homa Bay County</span>
            <h1 className="rise" style={{ '--d': '100ms' }}>
              Gladys <em>Wanga</em>
            </h1>
            <p className="lead rise" style={{ '--d': '220ms' }}>{profile.intro}</p>
            <div className="hero-actions rise" style={{ '--d': '340ms' }}>
              <Link to="/delivery" className="btn btn-sun">The Governor’s office</Link>
              <Link to="/about" className="btn btn-ghost-light">About the Governor</Link>
            </div>
            <div className="hero-meta rise" style={{ '--d': '460ms' }}>
              <span><b>{profile.office}</b>Office</span>
              <span><b>{profile.county}</b>County</span>
              <span><b>ODM</b>Party</span>
            </div>
          </div>
          <div className="rise" style={{ '--d': '300ms' }}>
            <Portrait eager />
          </div>
        </div>
      </section>

      <Marquee items={profile.interests} />

      {stats.length > 0 && (
        <section className="stat-strip" aria-label="Key figures">
          <div className="wrap stat-strip-in">
            {stats.map((s, i) => (
              <Reveal key={s.label} className="stat" delay={i * 110}>
                <b><CountUp to={s.n} /></b>
                <span>{s.label}</span>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="wrap section">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow">The role</span>
            <h2 className="title">What the Governor does</h2>
          </div>
          <Link to="/delivery" className="link-arrow">Functions and the county executive <span>→</span></Link>
        </Reveal>
        <div className="grid grid-4">
          {profile.focus.map((f, i) => (
            <Reveal key={f.title} className="card" delay={i * 100}>
              <span className="num">0{i + 1}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap section-tight">
        <div className="split">
          <Reveal variant="left"><Portrait parallax={false} /></Reveal>
          <Reveal variant="right" className="prose">
            <span className="eyebrow">About</span>
            <h2 className="title" style={{ marginBottom: 20 }}>From student leader to Governor</h2>
            <p>{profile.bio[0]}</p>
            <p style={{ marginBottom: 24 }}>{profile.bio[1]}</p>
            <Link to="/about" className="link-arrow">Read the full profile <span>→</span></Link>
          </Reveal>
        </div>
      </section>

      <section className="wrap section-tight">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow">Positions</span>
            <h2 className="title">Where she serves</h2>
          </div>
          <Link to="/about#positions" className="link-arrow">All positions <span>→</span></Link>
        </Reveal>
        <div className="grid grid-4">
          {positions.slice(0, 4).map((p, i) => (
            <Reveal key={p.id || p.title} className="card" delay={i * 90}>
              <div className="pos-top">
                <span className="tag">{p.category}</span>
                {p.period && <span className="pos-when">{p.period}</span>}
              </div>
              <h3>{p.title}</h3>
              <p>{p.organisation}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {events.length > 0 && (
        <section className="wrap section">
          <Reveal className="section-head">
            <div>
              <span className="eyebrow">Events</span>
              <h2 className="title">The Governor at work</h2>
            </div>
            <Link to="/events" className="link-arrow">All events <span>→</span></Link>
          </Reveal>
          <div className="grid grid-3">
            {events.slice(0, 3).map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <Link to={`/events/${p.id}`} className="card card-link">
                  <div className="card-img">{p.photos?.[0] ? <img src={p.photos[0]} alt={p.title} loading="lazy" /> : <Placeholder />}</div>
                  <div className="card-body">
                    <span className="tag">{p.type}</span>
                    <h3>{p.title}</h3>
                    <span className="meta">{[p.venue, formatDate(p.date)].filter(Boolean).join(' · ')}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="wrap section">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow">News</span>
            <h2 className="title">Latest</h2>
          </div>
          <Link to="/news" className="link-arrow">All news <span>→</span></Link>
        </Reveal>
        <div className="grid grid-3">
          {news.map((n, i) => (
            <Reveal key={n.id} className="card" delay={i * 100}>
              <span className="tag">{n.category || 'News'}</span>
              <h3>{n.title}</h3>
              <span className="meta">{[n.outlet, formatDate(n.date)].filter(Boolean).join(' · ')}</span>
              {n.url && <a href={n.url} target="_blank" rel="noreferrer" className="link-arrow">Read <span>→</span></a>}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap section-tight">
        <Reveal className="county-teaser">
          <Tilt><Crest size={150} className="crest-lg" /></Tilt>
          <div>
            <span className="eyebrow">The county</span>
            <h2 className="title">Homa Bay County, on the shore of Lake Victoria</h2>
            <p>Eight sub-counties, forty wards and more than a million residents.</p>
            <Link to="/county" className="link-arrow">Explore the county <span>→</span></Link>
          </div>
        </Reveal>
      </section>

      {socials.length > 0 && (
        <section className="wrap section-tight">
          <Reveal className="follow-band">
            <h2>Follow the Governor</h2>
            <div className="chips">
              {socials.map((l) => <a key={l.url} className="chip" href={l.url} target="_blank" rel="noreferrer">{l.label || l.url}</a>)}
            </div>
          </Reveal>
        </section>
      )}

      <section className="wrap">
        <Reveal variant="scale" className="cta">
          <div>
            <h2>Have a petition, an invitation or a question for the Governor?</h2>
            <p>Write to the Governor’s office. A member of the team will respond.</p>
          </div>
          <Link to="/contact" className="btn btn-light">Get in touch</Link>
        </Reveal>
      </section>
    </>
  )
}
