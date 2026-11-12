import { Link } from 'react-router-dom'
import Crest from '../components/Crest.jsx'
import PageHead from '../components/PageHead.jsx'
import { Reveal } from '../components/Reveal.jsx'
import Tilt from '../components/Tilt.jsx'
import { useContent } from '../lib/useContent.js'

export default function County() {
  const { county: c } = useContent()
  return (
    <>
      <PageHead eyebrow="The county" title="Homa Bay County" lead={c.intro} />

      <section className="wrap section-tight">
        <div className="split">
          <Reveal variant="left" className="crest-stage">
            <Tilt max={12}><Crest size={260} className="crest-lg" /></Tilt>
            <span className="crest-cap">Coat of arms of Homa Bay County</span>
          </Reveal>
          <Reveal variant="right">
            <dl className="facts">
              {c.facts.map((f) => (
                <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="wrap section">
        <Reveal><span className="eyebrow">Sub-counties</span><h2 className="title" style={{ marginBottom: 28 }}>Eight places, one county</h2></Reveal>
        <div className="grid grid-4">
          {c.subcounties.map((s, i) => (
            <Reveal key={s} className="card wave-card" delay={i * 70}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s}</h3>
            </Reveal>
          ))}
        </div>
        {c.note && <p className="note">{c.note}</p>}
      </section>

      <section className="wrap section-tight">
        <Reveal className="cta">
          <div><h2>Write to the Governor’s office</h2><p>Petitions, invitations and questions about county services.</p></div>
          <Link to="/contact" className="btn btn-light">Get in touch</Link>
        </Reveal>
      </section>
    </>
  )
}
