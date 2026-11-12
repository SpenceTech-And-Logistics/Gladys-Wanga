// How saved (Firebase) items and built-in items are shown together.
//
// - Every item saved in the database is shown.
// - A built-in item is also shown unless the database already has it (matched by seedId or title),
//   or the office removed it (its id is listed in site/hidden).
// So deleting a built-in item in the dashboard keeps it gone, and new built-in items still appear.

export const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ')

/** Keys that say "this database item stands for that built-in item". */
export function haveKeys(dbItems) {
  const have = new Set()
  for (const d of dbItems) {
    if (d.seedId) have.add(`id:${d.seedId}`)
    if (d.title) have.add(`t:${norm(d.title)}`)
  }
  return have
}

/** Built-in items that are neither in the database nor removed by the office. */
export function pendingBuiltins(dbItems, builtins = [], hidden = []) {
  const have = haveKeys(dbItems)
  const gone = new Set(hidden)
  return builtins.filter((b) => !gone.has(b.id) && !have.has(`id:${b.id}`) && !have.has(`t:${norm(b.title)}`))
}

export function combine(dbItems = [], builtins = [], hidden = []) {
  return [...dbItems, ...pendingBuiltins(dbItems, builtins, hidden)]
}

/** The built-in item a database item was copied from, if any. */
export function builtinFor(item, builtins = []) {
  return builtins.find((b) => (item.seedId && b.id === item.seedId) || (item.title && norm(b.title) === norm(item.title)))
}

/** A default list plus whatever the office added, with "Other" kept last. */
export function mergeList(base = [], extra = []) {
  const out = []
  for (const v of [...base, ...(extra || [])]) {
    const s = String(v || '').trim()
    if (s && !out.some((x) => norm(x) === norm(s))) out.push(s)
  }
  const i = out.findIndex((x) => norm(x) === 'other')
  if (i >= 0) out.push(out.splice(i, 1)[0])
  return out
}

/** URL-safe id from a title, never ending in "-digits". */
export function slugify(title) {
  const s = norm(title).normalize('NFKD').replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
  return /-\d+$/.test(s) ? `${s}-x` : s || 'item'
}
