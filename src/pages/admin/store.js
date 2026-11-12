// Small database helpers shared by the dashboard screens.
import { defaults } from '../../data/content.js'
import { pendingBuiltins } from '../../lib/combine.js'
import { getDb } from '../../lib/firebase.js'

/** Collections that have built-in items the office can copy in, remove or bring back. */
export const SEEDED = { engagements: 'Engagements', press: 'News and press', positions: 'Positions', projects: 'Projects', events: 'Events' }

async function siteDoc(id) {
  const { fs, db } = await getDb()
  const snap = await fs.getDoc(fs.doc(db, 'site', id))
  return snap.exists() ? snap.data() : {}
}

export const readHidden = () => siteDoc('hidden')

/** Remember that the office removed a built-in item, so it does not come back. */
export async function hideBuiltin(coll, id) {
  const { fs, db } = await getDb()
  const hidden = await readHidden()
  const list = new Set(hidden[coll] || [])
  list.add(id)
  await fs.setDoc(fs.doc(db, 'site', 'hidden'), { [coll]: [...list] }, { merge: true })
}

export async function unhideAll(coll) {
  const { fs, db } = await getDb()
  await fs.setDoc(fs.doc(db, 'site', 'hidden'), { [coll]: [] }, { merge: true })
}

/** Add a new category (or sector, type…) to a list the office can extend. */
export async function addToList(listKey, value, current) {
  const v = String(value || '').trim()
  if (!v || current.some((x) => x.toLowerCase() === v.toLowerCase())) return false
  const { fs, db } = await getDb()
  const others = current.filter((x) => x.toLowerCase() !== 'other')
  const next = [...others, v, ...current.filter((x) => x.toLowerCase() === 'other')]
  await fs.setDoc(fs.doc(db, 'site', 'settings'), { [listKey]: next }, { merge: true })
  return true
}

/** Copy built-in items into the database (each keeps its built-in id as seedId). */
export async function copyBuiltins(coll, items) {
  const { fs, db } = await getDb()
  for (let i = 0; i < items.length; i += 400) {
    const batch = fs.writeBatch(db)
    items.slice(i, i + 400).forEach((item) => {
      const { id, ...data } = item
      batch.set(fs.doc(fs.collection(db, coll)), { ...data, seedId: id, status: data.status || 'published', createdAt: fs.serverTimestamp() })
    })
    await batch.commit()
  }
}

/** For each seeded collection: how many built-in items are not in the database yet. */
export async function syncStatus() {
  const { fs, db } = await getDb()
  const hidden = await readHidden().catch(() => ({}))
  const out = []
  for (const [coll, label] of Object.entries(SEEDED)) {
    try {
      const snap = await fs.getDocs(fs.collection(db, coll))
      const saved = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      out.push({ coll, label, saved: saved.length, pending: pendingBuiltins(saved, defaults[coll], hidden[coll]), removed: (hidden[coll] || []).length })
    } catch (e) {
      out.push({ coll, label, error: /permission/i.test(e.code || e.message) ? 'blocked' : e.message, pending: [] })
    }
  }
  return out
}

/**
 * Firestore documents must stay under 1 MB. Photos are stored inside them, so move trailing photos
 * out of the item until it fits; the caller can save the overflow to the Gallery instead.
 */
export function fitPhotos(doc, key = 'photos', limit = 900000) {
  const photos = [...(doc[key] || [])]
  const overflow = []
  while (photos.length && JSON.stringify({ ...doc, [key]: photos }).length > limit) overflow.unshift(photos.pop())
  return { doc: { ...doc, [key]: photos }, overflow }
}
