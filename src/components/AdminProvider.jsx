import { useEffect, useState } from 'react'
import { getAuthKit, getDb } from '../lib/firebase.js'
import { AdminContext, adminRemembered, rememberAdmin } from '../lib/useAdmin.js'

/**
 * Works out whether the visitor is a signed-in administrator. Firebase Auth is only downloaded
 * when this device has signed in to the dashboard before, so ordinary visitors load nothing extra.
 */
export default function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!adminRemembered()) return
    let off = () => {}
    let alive = true
    ;(async () => {
      const kit = await getAuthKit()
      if (!kit || !alive) return
      off = kit.fa.onAuthStateChanged(kit.auth, async (u) => {
        if (!u) {
          rememberAdmin(false)
          return alive && setIsAdmin(false)
        }
        try {
          const { fs, db } = await getDb()
          const snap = await fs.getDoc(fs.doc(db, 'admins', u.uid))
          const ok = snap.exists() && snap.data().ok === true
          if (!ok) rememberAdmin(false)
          if (alive) setIsAdmin(ok)
        } catch {
          if (alive) setIsAdmin(false)
        }
      })
    })()
    return () => {
      alive = false
      off()
    }
  }, [])

  return <AdminContext.Provider value={{ isAdmin }}>{children}</AdminContext.Provider>
}
