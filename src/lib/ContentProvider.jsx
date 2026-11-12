import { useCallback, useEffect, useMemo, useState } from 'react'
import { LISTS, defaults } from '../data/content.js'
import { combine, mergeList } from './combine.js'
import { getDb } from './firebase.js'
import { ContentContext } from './useContent.js'

const nonEmpty = (v) => (Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== '')

function merge(base, over) {
  if (!over) return base
  const out = { ...base }
  for (const k of Object.keys(over)) if (nonEmpty(over[k])) out[k] = over[k]
  return out
}

const byOrder = (a, b) => Number(a.order ?? 999) - Number(b.order ?? 999)
const byDateDesc = (a, b) => String(b.date || b.year || '').localeCompare(String(a.date || a.year || ''))

const COLLECTIONS = ['engagements', 'press', 'gallery', 'positions', 'projects', 'events']

export function ContentProvider({ children }) {
  const [remote, setRemote] = useState(null)
  const [tick, setTick] = useState(0)
  const refresh = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      const kit = await getDb()
      if (!kit) return
      const { fs, db } = kit
      const list = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      try {
        const site = await fs.getDocs(fs.collection(db, 'site'))
        const docs = Object.fromEntries(site.docs.map((d) => [d.id, d.data()]))
        // Each collection loads on its own, so one missing rule does not blank the whole site.
        const lists = await Promise.all(
          COLLECTIONS.map((c) =>
            fs.getDocs(fs.collection(db, c)).then(list, (err) => {
              console.warn(`Could not load “${c}” from Firebase; showing built-in content for it.`, err)
              return []
            }),
          ),
        )
        if (alive) setRemote({ docs, ...Object.fromEntries(COLLECTIONS.map((c, i) => [c, lists[i]])) })
      } catch (err) {
        console.warn('Could not load content from Firebase; showing built-in content.', err)
      }
    })()
    return () => {
      alive = false
    }
  }, [tick])

  const value = useMemo(() => {
    const r = remote
    const hidden = r?.docs.hidden || {}
    const settings = r?.docs.settings || {}
    const published = (items) => items.filter((i) => i.status !== 'draft')
    const pick = (c) => published(combine(r?.[c] || [], defaults[c] || [], hidden[c]))
    // A list saved from the dashboard replaces the default one, so the office can also remove or rename entries.
    const lists = Object.fromEntries(Object.entries(LISTS).map(([k, base]) => [k, mergeList(settings[k]?.length ? settings[k] : base)]))
    const county = merge(defaults.county, r?.docs.county)
    lists.subcounties = county.subcounties || []

    return {
      positions: pick('positions').sort(byOrder),
      engagements: pick('engagements').sort(byDateDesc),
      press: pick('press').sort(byDateDesc),
      gallery: pick('gallery'),
      projects: pick('projects').sort(byDateDesc),
      events: pick('events').sort(byDateDesc),
      profile: merge(defaults.profile, r?.docs.profile),
      delivery: merge(defaults.delivery, r?.docs.delivery),
      county,
      contact: merge(defaults.contact, r?.docs.contact),
      lists,
      live: Boolean(r),
      refresh,
    }
  }, [remote, refresh])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
