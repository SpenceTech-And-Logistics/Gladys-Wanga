// A tiny in-memory stand-in for Firebase, used ONLY when the site is built or run with
//   VITE_DEMO_DASHBOARD=1
// so the dashboard can be shown to a client, or tested, before a Firebase project exists.
// Nothing is saved anywhere: refreshing the page resets it. It is never part of a normal build.

const store = new Map() // "collection/id" -> data
let counter = 0
const stamp = (minsAgo = 0) => {
  const seconds = Math.floor(Date.now() / 1000) - minsAgo * 60
  return { seconds, toDate: () => new Date(seconds * 1000) }
}

function put(path, data) { store.set(path, data) }
;[
  ['messages/m1', { name: 'Grace Wanjiru', email: 'grace@example.com', phone: '0712 000 000', topic: 'Petition or public participation', message: 'We would like to submit a petition from Homa Bay residents about the market road. Who should we address it to?', createdAt: stamp(95), read: false }],
  ['messages/m2', { name: 'Peter Mwai', email: 'peter@example.com', phone: '', topic: 'Invitation or event', message: 'Our school would like to invite the Governor to speak on health and education during our prize-giving day in March.', createdAt: stamp(60 * 26), read: false }],
  ['messages/m3', { name: 'Newsroom desk', email: 'desk@example.com', phone: '', topic: 'Media request', message: 'Requesting an interview on the county’s budget for the new financial year.', createdAt: stamp(60 * 72), read: true }],
].forEach(([k, v]) => put(k, v))

const col = (_db, name) => ({ kind: 'col', name })
const doc = (a, b, c) => (a && a.kind === 'col' ? { kind: 'doc', path: `${a.name}/${b || `auto${++counter}`}` } : { kind: 'doc', path: `${b}/${c}` })
const snapOf = (path) => ({ id: path.split('/')[1], exists: () => store.has(path), data: () => store.get(path) })

export const fs = {
  getFirestore: () => ({}),
  collection: col,
  doc,
  getDocs: async (c) => ({ docs: [...store.keys()].filter((k) => k.startsWith(`${c.name}/`)).map(snapOf) }),
  getDoc: async (d) => (d.path === 'admins/demo' ? { exists: () => true, data: () => ({ ok: true }) } : snapOf(d.path)),
  setDoc: async (d, data, opts) => put(d.path, opts?.merge ? { ...store.get(d.path), ...data } : data),
  updateDoc: async (d, data) => put(d.path, { ...store.get(d.path), ...data }),
  addDoc: async (c, data) => { const id = `n${++counter}`; put(`${c.name}/${id}`, data); return { id } },
  deleteDoc: async (d) => store.delete(d.path),
  serverTimestamp: () => stamp(0),
  writeBatch: () => {
    const ops = []
    return { set: (d, data) => ops.push([d, data]), commit: async () => ops.forEach(([d, data]) => put(d.path, data)) }
  },
}

const listeners = new Set()
export const auth = {
  currentUser: { uid: 'demo', email: 'demo@spencetec.com' },
}
export const fa = {
  getAuth: () => auth,
  onAuthStateChanged: (_a, cb) => { listeners.add(cb); setTimeout(() => cb(auth.currentUser), 0); return () => listeners.delete(cb) },
  signInWithEmailAndPassword: async () => {},
  sendPasswordResetEmail: async () => {},
  signOut: async () => { listeners.forEach((cb) => cb(null)) },
}
