import { createContext, useContext } from 'react'

// Remembers on this device that an administrator signed in to the dashboard, so the public site
// can show "Edit" shortcuts. The shortcuts only appear after Firebase confirms the account is still
// an administrator, and editing itself always happens in the dashboard behind the sign-in.
export const ADMIN_FLAG = 'gw-admin'

export function rememberAdmin(on) {
  try {
    if (on) localStorage.setItem(ADMIN_FLAG, '1')
    else localStorage.removeItem(ADMIN_FLAG)
  } catch {
    /* storage unavailable: shortcuts simply stay hidden */
  }
}

export function adminRemembered() {
  try {
    return localStorage.getItem(ADMIN_FLAG) === '1'
  } catch {
    return false
  }
}

export const AdminContext = createContext({ isAdmin: false })
export const useAdmin = () => useContext(AdminContext)

/** Where in the dashboard a public page or item is edited. */
export function dashboardPath(pathname) {
  const [, first = '', id] = pathname.split('/')
  const map = {
    '': 'profile', about: 'profile', delivery: 'office', county: 'county', positions: 'positions',
    engagements: 'engagements', projects: 'projects', events: 'events', news: 'news', gallery: 'gallery', contact: 'contact',
  }
  const section = map[first]
  if (!section) return '/admin'
  return id ? `/admin/${section}?edit=${encodeURIComponent(id)}` : `/admin/${section}`
}

export const editPath = (coll, id) => `/admin/${coll === 'press' ? 'news' : coll}?edit=${encodeURIComponent(id)}`
