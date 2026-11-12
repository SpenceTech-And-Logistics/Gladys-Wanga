// Reads the short WhatsApp notes the field team sends with project photos, such as:
//
//   -Rangwe market shed…
//   -works done…roofing n floor slab…
//   -stretch of 1.2kmts
//   -ward…Kagan ward…
//
// and turns them into a draft title, ward, size, works and description. Everything stays editable.

const SECTOR_WORDS = [
  ['Roads and Transport', /\b(road|rd|bridge|culvert|gravel|tarmac|murram|bitumen|pothole|footbridge|grading)\b/i],
  ['Health', /\b(hospital|health|dispensary|clinic|maternity|ward block|theatre|chv|medical)\b/i],
  ['Education and ECDE', /\b(school|ecde|classroom|bursar|polytechnic|vtc|vocational|laborator|dormitor)\b/i],
  ['Water and Sanitation', /\b(water|borehole|pipeline|pipe|tank|dam|pan|toilet|latrine|sanitation|sewer)\b/i],
  ['Fisheries and Blue Economy', /\b(fish|beach|jetty|landing|cage|boat|lake)\b/i],
  ['Agriculture', /\b(farm|agric|seed|fertili|livestock|dip|irrigation|cattle|crop)\b/i],
  ['Trade and Markets', /\b(market|shed|stalls?|traders?|boda)\b/i],
  ['Youth and Sports', /\b(youth|sport|stadium|pitch|playground|talent)\b/i],
]

const tidy = (s) =>
  s
    .replace(/[.…]{2,}|…/g, ' ')
    .replace(/\s+n\s+/gi, ' and ')
    .replace(/installition|instalation/gi, 'installation')
    .replace(/\s+/g, ' ')
    .replace(/^[\s,:;.-]+|[\s,:;.-]+$/g, '')

const titleCase = (s) =>
  s
    .split(' ')
    .map((w) => (w.length > 3 || /^[a-z]/.test(w) === false ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ')
    .replace(/\/([a-z])/g, (_, c) => `/${c.toUpperCase()}`)
    .replace(/^./, (c) => c.toUpperCase())

const ABBREVIATIONS = [
  [/\bsch\b\.?/gi, 'School'],
  [/\bpri\b\.?/gi, 'Primary'],
  [/\bsec\b\.?/gi, 'Secondary'],
  [/\bjnct\b\.?|\bjunc\b\.?|\bjn\b\.?/gi, 'Junction'],
  [/\brd\b\.?/gi, 'Road'],
  [/\bsc\b\.?/gi, 'Secondary School'],
  [/\bhc\b\.?/gi, 'Health Centre'],
  [/,s\b/g, "'s"],
]
const expand = (s) => ABBREVIATIONS.reduce((t, [re, w]) => t.replace(re, w), s)

/** "1.5kms", "2kmts", "70mts" → "1.5 km", "2 km", "70 m". */
export function normaliseLength(s) {
  return s
    .replace(/(\d+(?:\.\d+)?)\s*(?:kms?|kmts?|kilomet(?:er|re)s?)\b/gi, '$1 km')
    .replace(/(\d+(?:\.\d+)?)\s*(?:mts?|metres?|meters?)\b/gi, '$1 m')
}

export function guessSector(text) {
  return (SECTOR_WORDS.find(([, re]) => re.test(text)) || ['Other'])[0]
}

export function guessStage(text) {
  if (/\b(almost complete|ongoing|on-going|in progress|underway|remaining|progress so far|nearing)\b/i.test(text)) return 'Ongoing'
  if (/\b(upcoming|planned|to start|will start|groundbreaking|ground breaking|proposed)\b/i.test(text)) return 'Upcoming'
  return 'Completed'
}

/** Strip a WhatsApp chat export (_chat.txt) down to the message text. */
export function cleanChatExport(text) {
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^‎?\[?\d{1,2}\/\d{1,2}\/\d{2,4},? \d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?\]?\s?(?:-\s)?[^:]{1,40}:\s?/i, ''))
    .filter((l) => l.trim() && !/<attached:|omitted|end-to-end encrypted|\.(jpe?g|png|mp4|opus)$/i.test(l))
    .join('\n')
    .slice(0, 3000)
}

export function parseNote(text = '') {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[\s\-–—•*]+/, '').trim())
    .filter(Boolean)

  let title = ''
  let ward = ''
  let size = ''
  const works = []
  const extra = []

  for (const raw of lines) {
    const l = tidy(raw)
    if (!l) continue
    if (/^ward\b/i.test(l)) ward = l.replace(/^ward\s*/i, '')
    else if (/\bward$/i.test(l) && l.split(' ').length <= 5) ward = l
    else if (/^(stretch|length|distance)\b/i.test(l) || /^\d+(\.\d+)?\s*(km|kms|kmts|kilomet|mts|m)\b/i.test(l)) size = l.replace(/^(stretch|length|distance)( of)?\s*/i, '')
    else if (/^works? done\b/i.test(l)) works.push(l.replace(/^works? done\s*/i, ''))
    else if (/^(hard ?pa(ck|rk)ed|stone ?pitched|gravelled|unclogged|new(ly)? installed|culverts?)\b/i.test(l)) works.push(l)
    else if (!title) title = l
    else extra.push(l)
  }

  ward = titleCase(ward.replace(/\s*ward$/i, '').replace(/\s*\/\s*/g, '/'))
  size = normaliseLength(size)
  title = titleCase(expand(title).replace(/\s*-\s*/g, ' – '))
  const workText = works.map((w) => normaliseLength(w)).join('; ')

  const parts = []
  if (workText) parts.push(`${workText.charAt(0).toUpperCase()}${workText.slice(1)}${size ? ` over ${size}` : ''}.`)
  else if (size) parts.push(`A ${size} stretch.`)
  if (ward) parts.push(`${ward} Ward.`)
  const description = [parts.join(' '), ...extra.map((e) => `${normaliseLength(e).replace(/^./, (c) => c.toUpperCase())}${/[.!?]$/.test(e) ? '' : '.'}`)]
    .filter(Boolean)
    .join('\n\n')

  return { title, ward, size, works: workText, description, sector: guessSector(text), stage: guessStage(text) }
}
