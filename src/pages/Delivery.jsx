import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import { CountUp, Reveal } from '../components/Reveal.jsx'
import { useContent } from '../lib/useContent.js'

export default function Delivery() {
  const { delivery: a } = useContent()

  return (
    <>
      <PageHead
        eyebrow="The Governor’s office"
        title="Leading the county government of Homa Bay"
        lead="What the office of Governor is, what it does, and who sits on the county executive."
      />

      {(a.stats || []).length > 0 && (
        <section className="wrap section-tight">
          <div className="tiles">
            {a.stats.map((s, i) => (
              <Reveal key={s.label} className="tile" delay={i * 80}>
                <b><CountUp to={Number(s.value) || 0} /></b>
                <span>{s.label}</span>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {(a.results || []).length > 0 && (
        <section className="wrap section">
          <Reveal>
            <span className="eyebrow">Results</span>
            <h2 className="title" style={{ marginBottom: 14 }}>What the county has delivered</h2>
            {a.resultsIntro && <p className="lead" style={{ marginBottom: 32 }}>{a.resultsIntro}</p>}
          </Reveal>
          <div className="grid grid-2 results">
            {a.results.map((r, i) => (
              <Reveal key={r.title} className="card" delay={(i % 2) * 90}>
                <h3>{r.title}</h3>
                <ul className="ticks">
                  {String(r.text || '').split('\n').filter((l) => l.trim()).map((l, j) => <li key={j}>{l}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 28 }}>
            <Link to="/projects" className="link-arrow">See the projects <span>→</span></Link>
          </Reveal>
        </section>
      )}

      <section className="wrap section">
        <div className="split" style={{ alignItems: 'start' }}>
          <Reveal variant="left">
            <span className="eyebrow">The office</span>
            <h2 className="title" style={{ marginBottom: 20 }}>A constitutional office</h2>
            <p className="lead" style={{ fontSize: 17 }}>{a.basis}</p>
          </Reveal>
          <Reveal variant="right">
            <span className="eyebrow">Functions</span>
            <h2 className="title" style={{ marginBottom: 24 }}>What the Governor does</h2>
            <ol className="steps">
              {a.functions.map((f, i) => (
                <li key={i}><span>{String(i + 1).padStart(2, '0')}</span><p>{f}</p></li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="wrap section-tight">
        <Reveal><span className="eyebrow">Held by the Governor</span><h2 className="title" style={{ marginBottom: 28 }}>Offices and party roles</h2></Reveal>
        <div className="grid grid-3">
          {a.commitments.map((c, i) => (
            <Reveal key={c.name} className="card" delay={i * 90}>
              <span className="tag">{c.role}</span>
              <h3>{c.name}</h3>
              {c.note && <p>{c.note}</p>}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <Reveal>
          <span className="eyebrow">County executive</span>
          <h2 className="title" style={{ marginBottom: 16 }}>Who sits on the executive</h2>
          <p className="lead" style={{ marginBottom: 28 }}>{a.execIntro}</p>
        </Reveal>
        <Reveal className="table-wrap">
          <table>
            <thead><tr><th>Office</th><th>Name</th><th>Note</th></tr></thead>
            <tbody>
              {a.exec.map((m, i) => (
                <tr key={i}>
                  <td className="t-title">{m.role}</td>
                  <td>{m.name || <span className="muted">To be added</span>}</td>
                  <td>{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        {a.source && <p className="note">{a.source}</p>}
      </section>

      <section className="wrap section-tight">
        <Reveal className="cta">
          <div><h2>See the Governor at work</h2><p>Tours, launches and public forums, and milestones from the county, Parliament and party.</p></div>
          <Link to="/events" className="btn btn-light">Events</Link>
        </Reveal>
      </section>
    </>
  )
}
