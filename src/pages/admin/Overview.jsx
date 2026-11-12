import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { defaults } from '../../data/content.js'
import { getDb } from '../../lib/firebase.js'

const when = (ts) => {
  const d = ts?.toDate ? ts.toDate() : null
  if (!d) return ''
  const mins = Math.round((Date.now() - d.getTime()) / 60000)
  if (mins < 2) return 'just now'
  if (mins < 60) return `${mins} minutes ago`
  if (mins < 60 * 24) return `${Math.round(mins / 60)} hours ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const COLLS = ['engagements', 'press', 'positions', 'gallery', 'messages', 'projects', 'events']

/** The dashboard's home screen: counts, what needs attention, and the latest messages and changes. */
export default function Overview({ user, onCount }) {
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const { fs, db } = await getDb()
        const read = async (c) => (await fs.getDocs(fs.collection(db, c))).docs.map((d) => ({ id: d.id, ...d.data() }))
        const safe = (c) => read(c).catch(() => [])
        const [engagements, press, positions, gallery, messages, projects, events, site] = await Promise.all([...COLLS.map(safe), read('site')])
        const docs = Object.fromEntries(site.map((d) => [d.id, d]))
        if (!alive) return
        setData({ engagements, press, positions, gallery, messages, projects, events, docs })
        onCount?.(messages.filter((m) => !m.read).length)
      } catch (e) {
        if (alive) setErr(e.message)
      }
    })()
    return () => {
      alive = false
    }
  }, [onCount])

  if (err) return <p className="adm-alert">Could not load the overview: {err}</p>
  if (!data) return <p>Loading…</p>

  const { engagements, press, positions, gallery, messages, projects, events, docs } = data
  const profile = { ...defaults.profile, ...(docs.profile || {}) }
  const contact = { ...defaults.contact, ...(docs.contact || {}) }
  const delivery = { ...defaults.delivery, ...(docs.delivery || {}) }
  const pub = (a) => a.filter((i) => i.status !== 'draft').length
  const drafts = (a) => a.filter((i) => i.status === 'draft').length
  const unread = messages.filter((m) => !m.read)
  const photoCount = [...engagements, ...projects, ...events].reduce((n, e) => n + (e.photos || []).length, 0) + gallery.filter((g) => g.type !== 'video').length
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = events.filter((e) => e.status !== 'draft' && String(e.date || '') >= today).length
  const ongoing = projects.filter((p) => p.stage === 'Ongoing').length
  const saved = press.length + engagements.length + positions.length + gallery.length > 0
  // Until the office saves something, the built-in content (which includes one hidden draft) is what is live.
  const draftsTotal = saved
    ? drafts(press) + drafts(engagements) + drafts(positions) + drafts(gallery)
    : defaults.press.filter((p) => p.status === 'draft').length

  const tiles = [
    { to: '/admin/projects', n: pub(projects), label: 'Projects on the site', sub: ongoing ? `${ongoing} ongoing` : drafts(projects) ? `${drafts(projects)} draft${drafts(projects) > 1 ? 's' : ''}` : '' },
    { to: '/admin/events', n: pub(events), label: 'Events', sub: `${upcoming} upcoming` },
    { to: '/admin/news', n: press.length ? pub(press) : defaults.press.filter((p) => p.status !== 'draft').length, label: 'News stories on the site', sub: draftsTotal ? `${draftsTotal} draft${draftsTotal > 1 ? 's' : ''} waiting` : '' },
    { to: '/admin/engagements', n: engagements.length ? pub(engagements) : defaults.engagements.length, label: 'Engagements', sub: `${photoCount} photo${photoCount === 1 ? '' : 's'} in the gallery` },
    { to: '/admin/messages', n: unread.length, label: 'Unread messages', sub: `${messages.length} received in total`, hot: unread.length > 0 },
  ]

  const seatsNamed = delivery.exec.filter((m) => m.name).length
  const checks = [
    { ok: Boolean(profile.photo), text: 'Add the Governor’s official portrait (the Kenya coat of arms shows until then)', to: '/admin/profile' },
    { ok: Boolean(contact.email), text: 'Add the office email address', to: '/admin/contact' },
    { ok: Boolean(contact.phone), text: 'Add the office phone number', to: '/admin/contact' },
    { ok: (profile.education || []).length > 0, text: 'Review education and qualifications', to: '/admin/profile' },
    { ok: seatsNamed >= delivery.exec.length, text: `Name the county executive members (${seatsNamed} of ${delivery.exec.length} named)`, to: '/admin/office' },
    { ok: projects.length > 0, text: 'Add the first project (try “Import from WhatsApp”)', to: '/admin/whatsapp' },
    { ok: events.length > 0, text: 'List an upcoming or recent event', to: '/admin/events' },
    { ok: photoCount > 0, text: 'Upload photos for projects, events or the gallery', to: '/admin/gallery' },
    { ok: draftsTotal === 0, text: draftsTotal ? `Review and publish the ${draftsTotal} draft${draftsTotal > 1 ? 's' : ''} waiting` : 'No drafts waiting', to: '/admin/news' },
  ]
  const done = checks.filter((c) => c.ok).length

  const recent = [
    ...projects.map((i) => ({ ...i, kind: 'Project', to: `/admin/projects?edit=${i.id}`, t: i.title })),
    ...events.map((i) => ({ ...i, kind: 'Event', to: `/admin/events?edit=${i.id}`, t: i.title })),
    ...press.map((i) => ({ ...i, kind: 'News', to: '/admin/news', t: i.title })),
    ...engagements.map((i) => ({ ...i, kind: 'Engagement', to: '/admin/engagements', t: i.title })),
    ...positions.map((i) => ({ ...i, kind: 'Position', to: '/admin/positions', t: i.title })),
    ...gallery.map((i) => ({ ...i, kind: 'Gallery', to: '/admin/gallery', t: i.title || 'Gallery item' })),
  ]
    .filter((i) => i.createdAt?.seconds)
    .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
    .slice(0, 6)

  const latestMsgs = [...messages].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 4)

  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Overview</h1>
          <p>Signed in as {user?.email}. Everything saved here appears on the public site straight away.</p>
        </div>
        <div className="adm-actions">
          <Link to="/admin/whatsapp" className="adm-btn">Import from WhatsApp</Link>
          <Link to="/admin/projects?new=1" className="adm-btn ghost">Add a project</Link>
          <Link to="/admin/events?new=1" className="adm-btn ghost">Add an event</Link>
          <Link to="/admin/news?new=1" className="adm-btn ghost">Add a news story</Link>
        </div>
      </div>

      <div className="adm-tiles">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to} className={`adm-tile ${t.hot ? 'hot' : ''}`}>
            <b>{t.n}</b>
            <span>{t.label}</span>
            {t.sub && <small>{t.sub}</small>}
          </Link>
        ))}
      </div>

      <div className="adm-two">
        <section className="adm-panel">
          <div className="adm-meter-head">
            <h2>Site checklist</h2>
            <span>{done} of {checks.length} done</span>
          </div>
          <div className="adm-meter" role="progressbar" aria-valuemin={0} aria-valuemax={checks.length} aria-valuenow={done}><i style={{ width: `${(done / checks.length) * 100}%` }} /></div>
          <ul className="adm-check">
            {checks.map((c) => (
              <li key={c.text} className={c.ok ? 'ok' : ''}>
                <span aria-hidden="true">{c.ok ? '✓' : ''}</span>
                {c.ok ? <s>{c.text}</s> : <Link to={c.to}>{c.text}</Link>}
              </li>
            ))}
          </ul>
        </section>

        <section className="adm-panel">
          <div className="adm-meter-head">
            <h2>Latest messages</h2>
            <Link to="/admin/messages" className="adm-link">Open inbox</Link>
          </div>
          {latestMsgs.length === 0 ? (
            <p className="adm-meta">No messages yet. Visitors reach the office through the contact form.</p>
          ) : (
            <ul className="adm-feed">
              {latestMsgs.map((m) => (
                <li key={m.id} className={m.read ? '' : 'unread'}>
                  <strong>{m.name}</strong>
                  <span>{m.topic} · {when(m.createdAt)}</span>
                  <p>{(m.message || '').length > 110 ? `${m.message.slice(0, 107)}…` : m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="adm-panel">
        <div className="adm-meter-head"><h2>Recently added</h2></div>
        {recent.length === 0 ? (
          <p className="adm-meta">Nothing added from the dashboard yet. The site is showing its built-in content, which you can replace section by section.</p>
        ) : (
          <ul className="adm-feed flat">
            {recent.map((r) => (
              <li key={`${r.kind}-${r.id}`}>
                <em>{r.kind}</em>
                <Link to={r.to}>{r.t}</Link>
                <span>{r.status === 'draft' ? 'Draft · ' : ''}{when(r.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
