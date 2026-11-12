/** Resize an image file to a compact JPEG data URL (stored in Firestore, so no paid Storage is needed). */
export function resizeImage(file, maxSide = 1200, quality = 0.74) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Please choose an image file.'))
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('That image could not be read.'))
    }
    img.src = url
  })
}

/** Work out how to show a video link: thumbnail and an embeddable address when one exists. */
export function videoInfo(link = '') {
  const url = link.trim()
  let m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/)
  if (m) return { kind: 'youtube', thumb: `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`, embed: `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0` }
  m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (m) return { kind: 'drive', thumb: '', embed: `https://drive.google.com/file/d/${m[1]}/preview` }
  if (/facebook\.com|fb\.watch/.test(url)) return { kind: 'facebook', thumb: '', embed: '' }
  if (/tiktok\.com/.test(url)) return { kind: 'tiktok', thumb: '', embed: '' }
  return { kind: 'link', thumb: '', embed: '' }
}

export const formatDate = (d) => {
  if (!d) return ''
  if (/^\d{4}$/.test(String(d).trim())) return String(d).trim()
  if (/^\d{4}-\d{2}$/.test(d)) return new Date(`${d}-01T12:00:00`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const dt = new Date(d)
  return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const money = (n) => (n ? `KES ${Number(n).toLocaleString('en-KE')}` : '')

/** A Kenyan phone number as WhatsApp wants it (2547…), or '' when there is none. */
export function waNumber(raw = '') {
  let d = String(raw).replace(/\D/g, '')
  if (!d) return ''
  if (d.startsWith('0')) d = `254${d.slice(1)}`
  else if (d.length === 9) d = `254${d}`
  return d.length >= 11 ? d : ''
}

/**
 * Oldest first, by the first year in each item's `when` ("2004 to 2012" → 2004).
 * Items with no year ("Secondary school") stay just after the item before them.
 */
export function oldestFirst(list = []) {
  let last = -Infinity
  return list
    .map((item, i) => {
      const y = String(item.when || '').match(/\b(19|20)\d{2}\b/)
      const key = y ? Number(y[0]) : last + 0.5
      last = y ? key : last
      return { item, key, i }
    })
    .sort((a, b) => a.key - b.key || a.i - b.i)
    .map((x) => x.item)
}
