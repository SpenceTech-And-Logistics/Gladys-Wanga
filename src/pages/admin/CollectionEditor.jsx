import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { builtinFor, norm, pendingBuiltins } from '../../lib/combine.js'
import { getDb } from '../../lib/firebase.js'
import { csvTemplate, readRecords, saveText } from '../../lib/importer.js'
import { useContent } from '../../lib/useContent.js'
import BulkPhotos from './BulkPhotos.jsx'
import { Field } from './Fields.jsx'
import { addToList, copyBuiltins, hideBuiltin, readHidden, unhideAll } from './store.js'

/**
 * A list of records (projects, events, news, gallery…) with add, edit, delete, filters,
 * import from CSV/JSON, and the built-in items that have not been copied into the database yet.
 *
 * Config: coll, title, blurb, noun, fields, columns, empty, importer?, seed?, filterKey?, tabKey?, tabList?, viewPath?, bulk?
 */
export default function CollectionEditor({ coll, title, blurb, noun, fields, columns, empty, importer, seed = [], filterKey, tabKey, tabList, viewPath, bulk }) {
  const { refresh, lists } = useContent()
  const [params, setParams] = useSearchParams()
  const [items, setItems] = useState(null)
  const [hidden, setHidden] = useState([])
  const [editing, setEditing] = useState(null) // null | 'new' | id
  const [form, setForm] = useState(empty)
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState('')
  const [showBulk, setShowBulk] = useState(false)
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('All')
  const [chip, setChip] = useState('All')
  const [state, setState] = useState('All')
  const fileRef = useRef(null)
  const formRef = useRef(null)

  // Combo fields get their options from the current lists (defaults plus what the office added).
  const resolved = useMemo(() => fields.map((f) => (f.listKey ? { ...f, options: lists[f.listKey] || [] } : f)), [fields, lists])

  const load = useCallback(async () => {
    const { fs, db } = await getDb()
    const snap = await fs.getDocs(fs.collection(db, coll))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
  }, [coll])

  const reload = useCallback(async () => {
    const [list, h] = await Promise.all([load(), readHidden().catch(() => ({}))])
    setItems(list)
    setHidden(h[coll] || [])
    refresh()
    return list
  }, [load, coll, refresh])

  const pending = useMemo(() => (items ? pendingBuiltins(items, seed, hidden) : []), [items, seed, hidden])

  const openForm = useCallback(
    (next, id) => {
      setForm({ ...empty, ...next })
      setEditing(id)
      setMsg(null)
      requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    },
    [empty],
  )

  const startEdit = useCallback(
    (item) => {
      const { id, ...rest } = item
      if (item.builtin) {
        // A built-in item is edited by saving a copy into the database that remembers where it came from.
        const data = { ...rest }
        delete data.builtin
        openForm({ ...data, seedId: id }, 'new')
      } else openForm(rest, id)
    },
    [openForm],
  )

  useEffect(() => {
    let alive = true
    Promise.all([load(), readHidden().catch(() => ({}))])
      .then(([list, h]) => {
        if (!alive) return
        setItems(list)
        setHidden(h[coll] || [])
      })
      .catch((e) => alive && (setItems([]), setMsg({ bad: true, text: blockedText(e) })))
    return () => {
      alive = false
    }
  }, [load, coll])

  // Deep links from the public site: ?edit=<id> opens that item, ?new=1 opens a blank form.
  useEffect(() => {
    if (!items) return
    const id = params.get('edit')
    const fresh = params.get('new')
    if (!id && !fresh) return
    const t = setTimeout(() => {
      const next = new URLSearchParams(params)
      next.delete('edit')
      next.delete('new')
      setParams(next, { replace: true })
      if (fresh) return openForm({}, 'new')
      const found = items.find((i) => i.id === id || i.seedId === id) || seed.find((b) => b.id === id)
      if (found) startEdit(seed.includes(found) ? { ...found, builtin: true } : found)
      else setMsg({ bad: true, text: 'That item was not found. It may have been deleted.' })
    }, 0)
    return () => clearTimeout(t)
  }, [items, params, setParams, seed, startEdit, openForm])

  async function rememberNewListValues(data) {
    let added = false
    for (const f of resolved) {
      if (f.type === 'combo' && f.allowNew !== false && data[f.key]) added = (await addToList(f.listKey, data[f.key], f.options)) || added
    }
    return added
  }

  async function save(e) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      const { fs, db } = await getDb()
      const { createdAt, ...data } = form
      if (!String(data.title ?? 'x').trim() && 'title' in data) throw new Error('Please give it a title.')
      if (JSON.stringify(data).length > 950000) throw new Error('Too large to save. Remove a photo or two; extra photos can go in the Gallery.')
      if (editing === 'new') await fs.addDoc(fs.collection(db, coll), { ...data, createdAt: fs.serverTimestamp() })
      else await fs.setDoc(fs.doc(db, coll, editing), { ...data, ...(createdAt ? { createdAt } : {}) })
      const grew = await rememberNewListValues(data)
      await reload()
      setEditing(null)
      setMsg({ text: `${noun} saved. ${data.status === 'draft' ? 'It stays hidden until you set it to Published.' : 'It is live on the site.'}${grew ? ' The new category was added to the list.' : ''}` })
    } catch (ex) {
      setMsg({ bad: true, text: blockedText(ex) })
    }
    setBusy(false)
  }

  async function remove(item) {
    try {
      if (item.builtin) {
        await hideBuiltin(coll, item.id)
      } else {
        const { fs, db } = await getDb()
        await fs.deleteDoc(fs.doc(db, coll, item.id))
        const origin = builtinFor(item, seed)
        if (origin) await hideBuiltin(coll, origin.id)
      }
      setConfirm('')
      await reload()
      setMsg({ text: `${noun} removed from the site.` })
    } catch (ex) {
      setMsg({ bad: true, text: blockedText(ex) })
    }
  }

  async function copyAll() {
    setBusy(true)
    try {
      await copyBuiltins(coll, pending)
      await reload()
      setMsg({ text: `Copied ${pending.length} built-in item${pending.length === 1 ? '' : 's'} into the database. You can now edit each one.` })
    } catch (ex) {
      setMsg({ bad: true, text: blockedText(ex) })
    }
    setBusy(false)
  }

  async function restore() {
    setBusy(true)
    try {
      await unhideAll(coll)
      await reload()
      setMsg({ text: 'Removed built-in items are back on the site.' })
    } catch (ex) {
      setMsg({ bad: true, text: blockedText(ex) })
    }
    setBusy(false)
  }

  async function doImport(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    setMsg(null)
    try {
      const records = await readRecords(file)
      const seen = new Set([...(items || []), ...pending].map((i) => norm(i.title)))
      const fresh = []
      let skipped = 0
      for (const r of records) {
        const doc = importer.map(r)
        const key = norm(doc.title)
        if (!key || seen.has(key)) {
          skipped++
          continue
        }
        seen.add(key)
        fresh.push(doc)
      }
      const { fs, db } = await getDb()
      for (let i = 0; i < fresh.length; i += 400) {
        const batch = fs.writeBatch(db)
        fresh.slice(i, i + 400).forEach((d) => batch.set(fs.doc(fs.collection(db, coll)), { ...d, createdAt: fs.serverTimestamp() }))
        await batch.commit()
      }
      for (const d of fresh) await rememberNewListValues(d)
      await reload()
      setMsg({ text: `Imported ${fresh.length}. Skipped ${skipped} (empty or already listed by title).` })
    } catch (ex) {
      setMsg({ bad: true, text: blockedText(ex) })
    }
    setBusy(false)
  }

  const visible = (f) => !f.showIf || f.showIf(form)

  // Everything the public site shows: saved items, then built-in items not yet saved.
  const rows = useMemo(() => [...(items || []), ...pending.map((b) => ({ ...b, builtin: true }))], [items, pending])
  const tabs = tabKey ? ['All', ...new Set([...(lists[tabList] || []), ...rows.map((r) => r[tabKey]).filter(Boolean)])] : []
  const chips = filterKey ? ['All', ...new Set(rows.filter((r) => tab === 'All' || r[tabKey] === tab).map((r) => r[filterKey]).filter(Boolean))] : []
  const shown = rows.filter(
    (r) =>
      (tab === 'All' || r[tabKey] === tab) &&
      (chip === 'All' || r[filterKey] === chip) &&
      (state === 'All' || (state === 'Draft' ? r.status === 'draft' : state === 'Built-in' ? r.builtin : r.status !== 'draft' && !r.builtin)) &&
      (!q || norm(Object.values(r).filter((v) => typeof v === 'string' && v.length < 2000).join(' ')).includes(norm(q))),
  )

  return (
    <>
      <div className="adm-top">
        <div><h1>{title}</h1><p>{blurb}</p></div>
        <div className="adm-actions">
          {importer && (
            <>
              <button type="button" className="adm-btn ghost" onClick={() => saveText(`${coll}-template.csv`, csvTemplate(importer.columns, importer.example))}>CSV template</button>
              <button type="button" className="adm-btn ghost" onClick={() => fileRef.current?.click()} disabled={busy}>Import from file</button>
              <input ref={fileRef} type="file" accept=".csv,.json,text/csv,application/json" hidden onChange={doImport} />
            </>
          )}
          {['projects', 'events', 'press'].includes(coll) && <Link to={`/admin/whatsapp?to=${coll}`} className="adm-btn ghost">From WhatsApp</Link>}
          {bulk && <button type="button" className="adm-btn ghost" onClick={() => setShowBulk((s) => !s)}>Add many photos</button>}
          <button type="button" className="adm-btn" onClick={() => openForm({}, 'new')}>Add {noun.toLowerCase()}</button>
        </div>
      </div>

      {msg && <p className={msg.bad ? 'adm-alert' : 'adm-ok'} role="status">{msg.text}</p>}

      {items && pending.length > 0 && (
        <div className="adm-banner">
          <p><b>{pending.length} built-in item{pending.length === 1 ? ' is' : 's are'} on the site but not saved in the database yet.</b> They show on the site as they are. Copy them in to edit them all, or edit or remove them one at a time below.</p>
          <button type="button" className="adm-btn" disabled={busy} onClick={copyAll}>{busy ? 'Copying…' : `Copy ${pending.length} into the database`}</button>
        </div>
      )}
      {hidden.length > 0 && (
        <p className="adm-meta">
          {hidden.length} built-in item{hidden.length === 1 ? ' was' : 's were'} removed and stay{hidden.length === 1 ? 's' : ''} off the site.{' '}
          <button type="button" className="adm-link" onClick={restore} disabled={busy}>Bring {hidden.length === 1 ? 'it' : 'them'} back</button>
        </p>
      )}

      {showBulk && <BulkPhotos onDone={async (n) => { setShowBulk(false); await reload(); setMsg({ text: `${n} photo${n === 1 ? '' : 's'} added to the Gallery.` }) }} />}

      {editing && (
        <form className="adm-panel" onSubmit={save} ref={formRef}>
          <h2>{editing === 'new' ? (form.seedId ? `Edit built-in ${noun.toLowerCase()}` : `New ${noun.toLowerCase()}`) : `Edit ${noun.toLowerCase()}`}</h2>
          {form.seedId && editing === 'new' && <p className="adm-meta">Saving stores your edited copy in the database; it replaces the built-in version on the site.</p>}
          <div className="adm-grid">
            {resolved.filter(visible).map((f) => <Field key={f.key} def={f} value={form[f.key]} onChange={(v) => setForm((cur) => ({ ...cur, [f.key]: v }))} />)}
          </div>
          <div className="adm-actions">
            <button className="adm-btn" disabled={busy}>{busy ? 'Saving…' : `Save ${noun.toLowerCase()}`}</button>
            <button type="button" className="adm-btn ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}

      {rows.length > 0 && (
        <div className="adm-filters">
          {tabs.length > 2 && (
            <div className="adm-tabs" role="tablist" aria-label="Filter by funder">
              {tabs.map((t) => (
                <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => { setTab(t); setChip('All') }}>
                  {t} <em>{t === 'All' ? rows.length : rows.filter((r) => r[tabKey] === t).length}</em>
                </button>
              ))}
            </div>
          )}
          {chips.length > 2 && (
            <div className="adm-chips" role="group" aria-label="Filter by category">
              {chips.map((c) => <button key={c} type="button" aria-pressed={chip === c} onClick={() => setChip(c)}>{c === 'All' ? 'All categories' : c}</button>)}
            </div>
          )}
          <div className="adm-filter-row">
            <input type="search" placeholder={`Search ${title.toLowerCase()}…`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
            <select value={state} onChange={(e) => setState(e.target.value)} aria-label="Show">
              {['All', 'Published', 'Draft', ...(pending.length ? ['Built-in'] : [])].map((s) => <option key={s}>{s}</option>)}
            </select>
            <span className="adm-meta">{shown.length} shown</span>
          </div>
        </div>
      )}

      <div className="adm-panel flush">
        {items === null ? (
          <p className="adm-pad">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="adm-pad">Nothing here yet. Use “Add {noun.toLowerCase()}”{importer ? ', “Import from file”' : ''}{['projects', 'events', 'press'].includes(coll) ? ' or “From WhatsApp”' : ''}.</p>
        ) : shown.length === 0 ? (
          <p className="adm-pad">Nothing matches these filters.</p>
        ) : (
          <div className="adm-scroll">
            <table className="adm-table">
              <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th /></tr></thead>
              <tbody>
                {shown.map((it) => (
                  <tr key={(it.builtin ? 'b:' : '') + it.id} className={it.builtin ? 'is-builtin' : ''}>
                    {columns.map((c, i) => (
                      <td key={c.key}>
                        {c.key === 'status' && it.builtin ? <span className="adm-pill">Built-in</span> : c.render ? c.render(it) : it[c.key]}
                        {i === 0 && it.photos?.[0] && <img className="adm-rowthumb" src={it.photos[0]} alt="" />}
                      </td>
                    ))}
                    <td className="r">
                      {confirm === it.id ? (
                        <>
                          <button type="button" className="adm-link danger" onClick={() => remove(it)}>{it.builtin ? 'Remove from site' : 'Delete for good'}</button>{' '}
                          <button type="button" className="adm-link" onClick={() => setConfirm('')}>Keep</button>
                        </>
                      ) : (
                        <>
                          {viewPath && it.status !== 'draft' && <><Link className="adm-link" to={viewPath(it)} target="_blank">View ↗</Link>{' '}</>}
                          <button type="button" className="adm-link" onClick={() => startEdit(it)}>Edit</button>{' '}
                          <button type="button" className="adm-link danger" onClick={() => setConfirm(it.id)}>{it.builtin ? 'Remove' : 'Delete'}</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

/** Turn Firebase permission errors into a next step the office can act on. */
function blockedText(e) {
  const text = e?.message || String(e)
  if (/permission|insufficient/i.test(`${e?.code} ${text}`))
    return 'Firebase refused this change. Publish the latest security rules: Firebase console → Firestore Database → Rules, paste the contents of firestore.rules from the project, then Publish.'
  return text
}
