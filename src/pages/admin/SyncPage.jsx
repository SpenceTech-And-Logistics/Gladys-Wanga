import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../../lib/useContent.js'
import { copyBuiltins, legacyEngagements, moveEngagementsToEvents, syncStatus } from './store.js'

const PATHS = { press: 'news' }

/** Shows, per section, which built-in items are not in the database yet, and copies them in. */
export default function SyncPage() {
  const { refresh } = useContent()
  const [rows, setRows] = useState(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  const [legacy, setLegacy] = useState(0)

  const check = useCallback(async () => {
    setRows(null)
    setRows(await syncStatus())
    setLegacy((await legacyEngagements().catch(() => [])).length)
  }, [])

  useEffect(() => {
    let alive = true
    syncStatus().then((r) => alive && setRows(r))
    legacyEngagements().then((l) => alive && setLegacy(l.length), () => {})
    return () => {
      alive = false
    }
  }, [])

  const total = (rows || []).reduce((n, r) => n + r.pending.length, 0)
  const blocked = (rows || []).filter((r) => r.error)

  async function updateAll() {
    setBusy(true)
    setMsg(null)
    try {
      for (const r of rows) if (!r.error && r.pending.length) await copyBuiltins(r.coll, r.pending)
      refresh()
      setMsg({ text: `Copied ${total} item${total === 1 ? '' : 's'} into the database.` })
      await check()
    } catch (e) {
      setMsg({ bad: true, text: e.message })
    }
    setBusy(false)
  }

  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Fill the database</h1>
          <p>The site ships with built-in content. Copy it into the database so every item can be edited here. Items you removed are not copied back.</p>
        </div>
        <div className="adm-actions">
          <button type="button" className="adm-btn ghost" onClick={check} disabled={busy}>Check again</button>
          <button type="button" className="adm-btn" onClick={updateAll} disabled={busy || !rows || total === 0 || blocked.length > 0}>
            {busy ? 'Copying…' : total ? `Update: copy ${total} item${total === 1 ? '' : 's'}` : 'All up to date'}
          </button>
        </div>
      </div>
      {msg && <p className={msg.bad ? 'adm-alert' : 'adm-ok'} role="status">{msg.text}</p>}
      {blocked.length > 0 && (
        <p className="adm-alert" role="alert">
          Firebase blocked {blocked.map((b) => b.label).join(', ')}. Publish the latest security rules first: Firebase console → Firestore Database → Rules, paste the contents of
          <code> firestore.rules</code> from the project and press Publish. Then press Check again.
        </p>
      )}
      {legacy > 0 && (
        <div className="adm-banner">
          <p><b>{legacy} item{legacy === 1 ? ' is' : 's are'} still saved under the old Engagements section.</b> Engagements are now part of Events. They already show on the Events page; move them across so you can edit them under Events.</p>
          <button type="button" className="adm-btn" disabled={busy} onClick={async () => {
            setBusy(true)
            try {
              const n = await moveEngagementsToEvents()
              refresh()
              setMsg({ text: `Moved ${n} engagement${n === 1 ? '' : 's'} into Events.` })
              await check()
            } catch (e) {
              setMsg({ bad: true, text: e.message })
            }
            setBusy(false)
          }}>{busy ? 'Moving…' : `Move ${legacy} into Events`}</button>
        </div>
      )}
      <div className="adm-panel flush">
        {!rows ? (
          <p className="adm-pad">Checking the database…</p>
        ) : (
          <table className="adm-table">
            <thead><tr><th>Section</th><th>Saved in the database</th><th>Built-in, not yet copied</th><th>Removed by the office</th><th /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.coll}>
                  <td><b>{r.label}</b></td>
                  <td>{r.error ? '—' : r.saved}</td>
                  <td>{r.error ? <span className="adm-pill warn">Blocked by rules</span> : r.pending.length || '✓'}</td>
                  <td>{r.error ? '—' : r.removed}</td>
                  <td className="r"><Link className="adm-link" to={`/admin/${PATHS[r.coll] || r.coll}`}>Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
