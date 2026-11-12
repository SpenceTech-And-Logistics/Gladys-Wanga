import { siteConfig } from '../../site.config.js'

// Demo mode (VITE_DEMO_DASHBOARD=1) swaps Firebase for an in-memory copy. See src/lib/demoFirebase.js.
export const demoMode = import.meta.env.VITE_DEMO_DASHBOARD === '1'
export const firebaseReady = demoMode || Boolean(siteConfig.firebase.apiKey && siteConfig.firebase.projectId)

let appPromise
function getApp() {
  if (!appPromise) {
    appPromise = import('firebase/app').then((m) => m.initializeApp(siteConfig.firebase))
  }
  return appPromise
}

/** Firestore, loaded on demand. Returns null when Firebase is not configured. */
export async function getDb() {
  if (!firebaseReady) return null
  if (demoMode) {
    const m = await import('./demoFirebase.js')
    return { fs: m.fs, db: {} }
  }
  const fs = await import('firebase/firestore')
  const db = fs.getFirestore(await getApp())
  return { fs, db }
}

/** Firebase Auth, loaded only by the admin. */
export async function getAuthKit() {
  if (!firebaseReady) return null
  if (demoMode) {
    const m = await import('./demoFirebase.js')
    return { fa: m.fa, auth: m.auth }
  }
  const fa = await import('firebase/auth')
  const auth = fa.getAuth(await getApp())
  return { fa, auth }
}
