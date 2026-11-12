import { useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getDb } from '../../lib/firebase.js'
import { resizeImage } from '../../lib/media.js'
import { useContent } from '../../lib/useContent.js'
import { cleanChatExport, parseNote } from '../../lib/whatsapp.js'
import { Field } from './Fields.jsx'
import { eventsConfig, pressConfig, projectsConfig } from './sections.js'
import { addToList, fitPhotos } from './store.js'

const TARGETS = {
  projects: { config: projectsConfig, label: 'Project', max: 6 },
  events: { config: eventsConfig, label: 'Event', max: 6 },
  press: { config: pressConfig, label: 'News story', max: 1 },
}
const IMAGE = /\.(jpe?g|png|webp|heic|gif)$/i
const VIDEO = /\.(mp4|mov|3gp|avi|mkv|webm)$/i
const TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' }

/** "WhatsApp Image 2026-11-10 at 12.36.09 PM.jpeg" → "2026-11-10" */
const dateFromName = (name) => (name.match(/(20\d{2})[-_]?(\d{2})[-_]?(\d{2})/) || []).slice(1, 4).join('-')

export default function WhatsAppImport() {
  const { lists, refresh } = useContent()
  const [params] = useSearchParams()
  const [to, setTo] = useState(TARGETS[params.get('to')] ? params.get('to') : 'projects')
  const target = TARGETS[to]
  const [note, setNote] = useState('')
  const [photos, setPhotos] = useState([]) // { src, name, date, on }
  const [skipped, setSkipped] = useState([])
  const [form, setForm] = useState({ ...projectsConfig.empty })
  const [touched, setTouched] = useState(false)
  const [toGallery, setToGallery] = useState(true)
  const [reading, setReading] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const [saved, setSaved] = useState(null)
  const fileRef = useRef(null)

  const fields = useMemo(
    () => target.config.fields.filter((f) => !['photos', 'image'].includes(f.key)).map((f) => (f.listKey ? { ...f, options: lists[f.listKey] || [] } : f)),
    [target, lists],
  )

  /** Fill the form from the note and the photo dates, unless the user has started editing it. */
  function draft(text, pics, key = to) {
    const p = parseNote(text)
    const firstDate = pics.map((x) => x.date).filter(Boolean).sort()[0] || ''
    const base = { ...TARGETS[key].config.empty }
    if (key === 'projects')
      return { ...base, title: p.title, ward: p.ward, sector: lists.projectSectors.includes(p.sector) ? p.sector : base.sector, stage: p.stage, year: firstDate.slice(0, 4) || base.year, description: p.description }
    if (key === 'events') return { ...base, title: p.title, date: firstDate, venue: p.ward ? `${p.ward} Ward` : '', description: p.description }
    return { ...base, title: p.title, date: firstDate || new Date().toISOString().slice(0, 10), outlet: 'Office of the Governor', category: lists.newsCategories.includes('Statements') ? 'Statements' : base.category, summary: p.description }
  }

  const refill = (text, pics, key) => !touched && setForm(draft(text, pics, key))

  async function addFiles(fileList) {
    setMsg(null)
    const files = [...fileList]
    const pics = []
    const skip = []
    let chat = ''
    try {
      for (const f of files) {
        if (/\.zip$/i.test(f.name) || f.type === 'application/zip') {
          setReading(`Opening ${f.name}…`)
          const { unzip } = await import('fflate')
          const entries = await new Promise((res, rej) => f.arrayBuffer().then((buf) => unzip(new Uint8Array(buf), (e, out) => (e ? rej(e) : res(out))), rej))
          for (const [path, data] of Object.entries(entries)) {
            const name = path.split('/').pop()
            if (!name || path.startsWith('__MACOSX') || name.startsWith('.')) continue
            if (IMAGE.test(name)) pics.push(new File([data], name, { type: TYPES[name.split('.').pop().toLowerCase()] || 'image/jpeg' }))
            else if (VIDEO.test(name)) skip.push(name)
            else if (/\.txt$/i.test(name)) chat = cleanChatExport(new TextDecoder().decode(data))
          }
        } else if (f.type.startsWith('image/') || IMAGE.test(f.name)) pics.push(f)
        else if (f.type.startsWith('video/') || VIDEO.test(f.name)) skip.push(f.name)
        else if (/\.txt$/i.test(f.name)) chat = cleanChatExport(await f.text())
      }
      const ready = []
      for (let i = 0; i < pics.length; i++) {
        setReading(`Preparing photo ${i + 1} of ${pics.length}…`)
        try {
          ready.push({ src: await resizeImage(pics[i], 1000, 0.72), name: pics[i].name, date: dateFromName(pics[i].name), on: true })
        } catch {
          skip.push(pics[i].name)
        }
      }
      ready.sort((a, b) => a.name.localeCompare(b.name))
      const nextPhotos = [...photos, ...ready]
      const nextNote = !note && chat ? chat : note
      setPhotos(nextPhotos)
      setSkipped((s) => [...s, ...skip])
      if (nextNote !== note) setNote(nextNote)
      refill(nextNote, nextPhotos)
    } catch (e) {
      setMsg({ bad: true, text: `Could not read that file: ${e.message}` })
    }
    setReading('')
  }

  const chosen = photos.filter((p) => p.on)
  const makeCover = (i) => setPhotos((list) => [list[i], ...list.filter((_, j) => j !== i)])
  const toggle = (i) => setPhotos((list) => list.map((p, j) => (j === i ? { ...p, on: !p.on } : p)))

  async function save() {
    setBusy(true)
    setMsg(null)
    try {
      if (!String(form.title || '').trim()) throw new Error('Give it a title first.')
      const { fs, db } = await getDb()
      const srcs = chosen.map((p) => p.src)
      let doc
      let extra
      if (to === 'press') {
        doc = { ...form, image: srcs[0] || '' }
        extra = srcs.slice(1)
      } else {
        const fitted = fitPhotos({ ...form, photos: srcs.slice(0, target.max) })
        doc = fitted.doc
        extra = [...fitted.overflow, ...srcs.slice(target.max)]
      }
      const ref = await fs.addDoc(fs.collection(db, to), { ...doc, source: 'whatsapp', createdAt: fs.serverTimestamp() })
      let galleryCount = 0
      if (toGallery && extra.length) {
        const category = to === 'events' ? 'Events' : to === 'projects' ? 'Projects' : lists.galleryCategories[0]
        for (const src of extra) {
          await fs.addDoc(fs.collection(db, 'gallery'), { type: 'photo', title: doc.title, category, src, url: '', status: 'published', createdAt: fs.serverTimestamp() })
          galleryCount++
        }
        await addToList('galleryCategories', category, lists.galleryCategories)
      }
      for (const f of fields) if (f.type === 'combo' && f.allowNew !== false && doc[f.key]) await addToList(f.listKey, doc[f.key], f.options)
      refresh()
      setSaved({ id: ref.id, title: doc.title, galleryCount, dropped: toGallery ? 0 : extra.length })
    } catch (e) {
      setMsg({ bad: true, text: /permission/i.test(e.code || e.message) ? 'Firebase refused the save. Publish the latest security rules (firestore.rules) in the Firebase console, then try again.' : e.message })
    }
    setBusy(false)
  }

  function reset() {
    setNote('')
    setPhotos([])
    setSkipped([])
    setTouched(false)
    setSaved(null)
    setForm({ ...target.config.empty })
  }

  if (saved) {
    const view = to === 'press' ? '/news' : `/${to}/${saved.id}`
    return (
      <>
        <div className="adm-top"><div><h1>Import from WhatsApp</h1></div></div>
        <div className="adm-panel">
          <h2>“{saved.title}” is saved</h2>
          <p className="adm-meta">
            {form.status === 'draft' ? 'It is saved as a draft and hidden until you publish it.' : 'It is live on the site.'}
            {saved.galleryCount ? ` ${saved.galleryCount} extra photo${saved.galleryCount === 1 ? ' was' : 's were'} added to the Gallery.` : ''}
          </p>
          <div className="adm-actions">
            <button type="button" className="adm-btn" onClick={reset}>Import another</button>
            {form.status !== 'draft' && <Link className="adm-btn ghost" to={view} target="_blank">View on the site ↗</Link>}
            <Link className="adm-btn ghost" to={`/admin/${to === 'press' ? 'news' : to}`}>Open {target.config.title}</Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Import from WhatsApp</h1>
          <p>Drop in the zip (or the photos) the team sent on WhatsApp and paste their message. The form fills itself in; check it, pick the cover photo and save.</p>
        </div>
      </div>

      <div className="adm-panel">
        <div className="adm-seg" role="radiogroup" aria-label="Save as">
          {Object.entries(TARGETS).map(([k, t]) => (
            <button key={k} type="button" role="radio" aria-checked={to === k} onClick={() => { setTo(k); setTouched(false); setForm(draft(note, photos, k)) }}>
              {t.label}
            </button>
          ))}
        </div>

        <label
          className="adm-dropzone big"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            addFiles(e.dataTransfer.files)
          }}
        >
          <input ref={fileRef} type="file" multiple hidden accept=".zip,application/zip,image/*,.txt,video/*" onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
          <b>{reading || 'Drop the WhatsApp zip or photos here, or click to choose'}</b>
          <span>Zips from “Export chat” work too: the photos and the message are read from it. Videos are not uploaded; add a YouTube or Facebook link instead.</span>
        </label>

        <div className="adm-field wide">
          <span className="adm-label">The team’s message</span>
          <textarea
            rows={6}
            value={note}
            placeholder={'-Rangwe market shed…\n-works done…roofing n floor slab…\n-ward…Kagan ward…'}
            onChange={(e) => {
              setNote(e.target.value)
              refill(e.target.value, photos)
            }}
          />
          <small>Paste it as it came. Lines like “ward…”, “stretch of…” and “works done…” are picked up automatically.{touched && <> <button type="button" className="adm-link" onClick={() => { setTouched(false); setForm(draft(note, photos)) }}>Refill the form from the message</button></>}</small>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="adm-panel">
          <div className="adm-meter-head">
            <h2>Photos</h2>
            <span>{chosen.length} of {photos.length} chosen · the first is the cover{to !== 'press' && chosen.length > target.max ? ` · ${target.max} go on the ${target.label.toLowerCase()}, the rest to the Gallery` : ''}</span>
          </div>
          <div className="adm-pick">
            {photos.map((p, i) => (
              <figure key={p.name + i} className={`${p.on ? 'on' : ''} ${i === 0 ? 'cover' : ''}`}>
                <button type="button" className="adm-pick-img" onClick={() => toggle(i)} aria-pressed={p.on} aria-label={`${p.on ? 'Leave out' : 'Use'} ${p.name}`}>
                  <img src={p.src} alt="" />
                  <span className="tick" aria-hidden="true">{p.on ? '✓' : ''}</span>
                </button>
                {i === 0 ? <figcaption>Cover</figcaption> : <button type="button" className="adm-link" onClick={() => makeCover(i)}>Make cover</button>}
              </figure>
            ))}
          </div>
          <label className="adm-check-inline">
            <input type="checkbox" checked={toGallery} onChange={(e) => setToGallery(e.target.checked)} /> Put photos that don’t fit on the {target.label.toLowerCase()} into the Gallery
          </label>
          {skipped.length > 0 && <p className="adm-meta">Not uploaded: {skipped.join(', ')}.</p>}
        </div>
      )}

      <div className="adm-panel">
        <h2>{target.label} details</h2>
        <div className="adm-grid">
          {fields.map((f) => (
            <Field
              key={f.key}
              def={f}
              value={form[f.key]}
              onChange={(v) => {
                setTouched(true)
                setForm((cur) => ({ ...cur, [f.key]: v }))
              }}
            />
          ))}
        </div>
        {msg && <p className={msg.bad ? 'adm-alert' : 'adm-ok'} role="status">{msg.text}</p>}
        <div className="adm-actions">
          <button type="button" className="adm-btn" onClick={save} disabled={busy || !!reading}>{busy ? 'Saving…' : `Save ${target.label.toLowerCase()}`}</button>
          <button type="button" className="adm-btn ghost" onClick={reset} disabled={busy}>Start again</button>
        </div>
      </div>
    </>
  )
}
