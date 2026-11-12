import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { dashboardPath, editPath, useAdmin } from '../lib/useAdmin.js'

/** Floating shortcuts for a signed-in administrator viewing the public site. */
export default function AdminBar() {
  const { isAdmin } = useAdmin()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  if (!isAdmin) return null

  const add = [
    ['/admin/projects?new=1', 'Project'],
    ['/admin/events?new=1', 'Event'],
    ['/admin/news?new=1', 'News story'],
    ['/admin/whatsapp', 'From WhatsApp'],
  ]

  return (
    <div className={`admin-bar ${open ? 'is-open' : ''}`} role="region" aria-label="Administrator shortcuts">
      <span className="admin-bar-dot" aria-hidden="true" />
      <Link to={dashboardPath(pathname)} className="admin-bar-main">Edit this page</Link>
      <Link to="/admin">Dashboard</Link>
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>+ Add</button>
      {open && (
        <div className="admin-bar-menu">
          {add.map(([to, label]) => <Link key={to} to={to} onClick={() => setOpen(false)}>{label}</Link>)}
        </div>
      )}
    </div>
  )
}

/** A small "Edit" button on a card, shown only to administrators. */
export function EditLink({ coll, id, label = 'Edit' }) {
  const { isAdmin } = useAdmin()
  if (!isAdmin || !id) return null
  return <Link to={editPath(coll, id)} className="edit-pill" aria-label={`${label} in the dashboard`}>✎ {label}</Link>
}
