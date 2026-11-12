import { Link, useParams, useSearchParams } from 'react-router-dom'
import { EditLink } from '../components/AdminBar.jsx'
import Empty from '../components/Empty.jsx'
import PageHead from '../components/PageHead.jsx'
import Placeholder from '../components/Placeholder.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { formatDate } from '../lib/media.js'
import { useContent } from '../lib/useContent.js'
import NotFound from './NotFound.jsx'
import { ItemDetail } from './ProjectDetail.jsx'

const today = () => new Date().toISOString().slice(0, 10)
const isUpcoming = (e) => Boolean(e.date) && e.date.length >= 10 && e.date >= today()

function EventCard({ e, i }) {
  const d = e.date ? new Date(`${e.date.slice(0, 10)}T12:00:00`) : null
  const valid = d && !Number.isNaN(d.getTime()) && e.date.length >= 10
  return (
    <Reveal delay={(i % 3) * 90} className="card-wrap">
      <Link to={`/events/${e.id}`} className="card card-link">
        <div className="card-img">
          {e.photos?.[0] ? <img src={e.photos[0]} alt={e.title} loading="lazy" /> : <Placeholder />}
          {valid && (
            <span className="date-chip" aria-hidden="true">
              <b>{d.getDate()}</b>
              {d.toLocaleDateString('en-GB', { month: 'short' })}
            </span>
          )}
        </div>
        <div className="card-body">
          <span className="tag">{e.type || 'Event'}</span>
          <h3>{e.title}</h3>
          <span className="meta">{[formatDate(e.date), e.time, e.venue].filter(Boolean).join(' · ')}</span>
        </div>
      </Link>
      <EditLink coll={e.legacy ? 'database' : 'events'} id={e.id} />
    </Reveal>
  )
}

export default function Events() {
  const { events } = useContent()
  const [params, setParams] = useSearchParams()
  const type = params.get('type') || 'All'
  const types = ['All', ...new Set(events.map((e) => e.type).filter(Boolean))]
  const shown = type === 'All' ? events : events.filter((e) => e.type === type)
  const upcoming = shown.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date))
  const past = shown.filter((e) => !isUpcoming(e))
  const years = [...new Set(past.map((e) => String(e.date || '').slice(0, 4) || 'Undated'))]

  const pick = (t) => {
    const next = new URLSearchParams(params)
    if (t === 'All') next.delete('type')
    else next.set('type', t)
    setParams(next, { replace: true })
  }

  return (
    <>
      <PageHead
        eyebrow="Events and milestones"
        title="The Governor at work"
        lead="Development tours, project launches and public forums across the county, and milestones from county leadership, Parliament and the party."
      />
      <section className="wrap section-tight">
        {events.length === 0 ? (
          <Empty
            title="Events will be listed here"
            text="Upcoming tours, launches and public forums will appear here, with photos from past events."
            cta={{ to: '/contact', label: 'Invite the Governor' }}
          />
        ) : (
          <>
            {types.length > 2 && (
              <div className="chips" role="group" aria-label="Filter events" style={{ marginBottom: 32 }}>
                {types.map((t) => <button key={t} type="button" className="chip" aria-pressed={type === t} onClick={() => pick(t)}>{t === 'All' ? 'All events' : t}</button>)}
              </div>
            )}
            <h2 className="section-label">Upcoming</h2>
            {upcoming.length ? (
              <div className="grid grid-3 grid-fill">{upcoming.map((e, i) => <EventCard key={e.id} e={e} i={i} />)}</div>
            ) : (
              <p className="muted">No upcoming events are listed right now. <Link to="/contact" className="link-arrow">Invite the Governor <span>→</span></Link></p>
            )}
            {years.map((y) => (
              <div key={y} style={{ marginTop: 56 }}>
                <h2 className="section-label">{y === 'Undated' ? 'Earlier' : y}</h2>
                <div className="grid grid-3 grid-fill">
                  {past.filter((e) => (String(e.date || '').slice(0, 4) || 'Undated') === y).map((e, i) => <EventCard key={e.id} e={e} i={i} />)}
                </div>
              </div>
            ))}
          </>
        )}
      </section>
    </>
  )
}

export function EventDetail() {
  const { id } = useParams()
  const { events } = useContent()
  const item = events.find((e) => e.id === id)
  if (!item) return <NotFound />
  return (
    <ItemDetail
      item={item}
      coll="events"
      back={['/events', 'All events']}
      eyebrow={item.type}
      facts={[
        ['Date', formatDate(item.date)],
        ['Time', item.time],
        ['Where', item.venue],
        ['Sub-county', item.subcounty],
        ['Status', isUpcoming(item) ? 'Upcoming' : ''],
      ]}
    />
  )
}
