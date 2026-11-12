import { ENGAGEMENT_CATEGORIES, GALLERY_CATEGORIES, NEWS_CATEGORIES, POSITION_CATEGORIES, defaults } from '../../data/content.js'

const status = { key: 'status', label: 'Status', type: 'select', options: [{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft (hidden)' }] }
const badge = (it) => (it.status === 'draft' ? 'Draft' : 'Published')

export const profileFields = [
  { key: 'name', label: 'Name as shown', wide: false },
  { key: 'officialName', label: 'Full name in public records' },
  { key: 'title', label: 'Title (shown on About)' },
  { key: 'office', label: 'Office (e.g. Governor)' },
  { key: 'county', label: 'County' },
  { key: 'party', label: 'Party' },
  { key: 'background', label: 'Professional background' },
  { key: 'intro', label: 'Home page introduction', type: 'textarea', wide: true },
  { key: 'bio', label: 'Biography paragraphs', type: 'strings', long: true, wide: true },
  { key: 'vision', label: 'Vision statement (shown on About when filled)', type: 'textarea', wide: true },
  { key: 'photo', label: 'Portrait photo', type: 'image', side: 1000, wide: true, hint: 'Replaces the monogram on the home and About pages.' },
  { key: 'interests', label: 'Areas of interest (scrolling ticker)', type: 'strings', wide: true },
  { key: 'focus', label: 'Focus areas (home page cards)', type: 'list', noun: 'focus area', wide: true, fields: [{ key: 'title', label: 'Title' }, { key: 'text', label: 'Text', type: 'textarea' }] },
  { key: 'timeline', label: 'Career timeline', type: 'list', noun: 'entry', wide: true, fields: [{ key: 'when', label: 'When' }, { key: 'title', label: 'Title' }, { key: 'detail', label: 'Detail', type: 'textarea' }] },
  { key: 'education', label: 'Education', type: 'list', noun: 'qualification', wide: true, fields: [{ key: 'when', label: 'Years' }, { key: 'title', label: 'Qualification' }, { key: 'detail', label: 'Institution' }] },
]

export const deliveryFields = [
  { key: 'stats', label: 'Figures (home page strip and Governor’s office page)', type: 'list', noun: 'figure', wide: true, fields: [{ key: 'value', label: 'Number', type: 'number' }, { key: 'label', label: 'Label' }] },
  { key: 'basis', label: 'Constitutional basis of the office', type: 'textarea', wide: true },
  { key: 'functions', label: 'Functions of the Governor', type: 'strings', long: true, wide: true },
  { key: 'commitments', label: 'Offices and party roles', type: 'list', noun: 'role', wide: true, fields: [{ key: 'name', label: 'Organisation' }, { key: 'role', label: 'Role' }, { key: 'note', label: 'Note' }] },
  { key: 'execIntro', label: 'County executive introduction', type: 'textarea', wide: true },
  { key: 'exec', label: 'County executive', type: 'list', noun: 'seat', wide: true, fields: [{ key: 'role', label: 'Office' }, { key: 'name', label: 'Name (leave blank until confirmed)' }, { key: 'note', label: 'Note', type: 'textarea' }] },
  { key: 'source', label: 'Source note', wide: true },
]

export const countyFields = [
  { key: 'intro', label: 'Introduction', type: 'textarea', wide: true },
  { key: 'facts', label: 'Key facts', type: 'list', noun: 'fact', wide: true, fields: [{ key: 'label', label: 'Label' }, { key: 'value', label: 'Value' }] },
  { key: 'subcounties', label: 'Sub-counties', type: 'strings', wide: true },
  { key: 'note', label: 'Source note', wide: true },
]

export const contactFields = [
  { key: 'office', label: 'Office of the Governor, address', type: 'textarea', wide: true },
  { key: 'assembly', label: 'Address line (town and county)' },
  { key: 'email', label: 'Office email', type: 'email' },
  { key: 'phone', label: 'Office phone', type: 'tel' },
  { key: 'social', label: 'Social links (Facebook, X, YouTube, TikTok…)', type: 'list', noun: 'link', wide: true, fields: [{ key: 'label', label: 'Name' }, { key: 'url', label: 'Link', type: 'url' }] },
  { key: 'links', label: 'Other links', type: 'list', noun: 'link', wide: true, fields: [{ key: 'label', label: 'Name' }, { key: 'url', label: 'Link', type: 'url' }] },
]

export const engagementsConfig = {
  seed: defaults.engagements,
  coll: 'engagements',
  title: 'Engagements',
  blurb: 'Milestones and events: county leadership, Parliament, party and campaigns, community work. Each can have up to 5 photos, and they also appear in the Gallery.',
  noun: 'Engagement',
  empty: { title: '', category: ENGAGEMENT_CATEGORIES[0], date: '', venue: '', description: '', photos: [], status: 'published' },
  fields: [
    { key: 'title', label: 'Title', required: true, wide: true },
    { key: 'category', label: 'Category', type: 'select', options: ENGAGEMENT_CATEGORIES },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'venue', label: 'Where' },
    { key: 'description', label: 'Description', type: 'textarea', wide: true, hint: 'One or two lines on what happened and why it matters.' },
    { key: 'photos', label: 'Photos', type: 'images', max: 5, wide: true },
    status,
  ],
  columns: [
    { key: 'title', label: 'Engagement' },
    { key: 'category', label: 'Category' },
    { key: 'date', label: 'Date' },
    { key: 'photos', label: 'Photos', render: (it) => (it.photos || []).length },
    { key: 'status', label: 'Status', render: badge },
  ],
  importer: {
    columns: ['title', 'category', 'date', 'venue', 'description'],
    example: ['Community forum', 'Community', '2026-09-10', 'Homa Bay town', 'Residents met the Governor to discuss county services.'],
    map: (r) => ({
      title: String(r.title || '').trim(),
      category: ENGAGEMENT_CATEGORIES.includes(r.category) ? r.category : 'Other',
      date: String(r.date || ''),
      venue: String(r.venue || ''),
      description: String(r.description || ''),
      photos: [],
      status: 'published',
    }),
  },
}

export const positionsConfig = {
  seed: defaults.positions,
  coll: 'positions',
  title: 'Positions',
  blurb: 'Offices, committees, party and movement roles, shown on the Positions page. Lower numbers appear first.',
  noun: 'Position',
  empty: { title: '', organisation: '', category: POSITION_CATEGORIES[0], period: '', description: '', order: 50, status: 'published' },
  fields: [
    { key: 'title', label: 'Position', required: true, wide: true },
    { key: 'organisation', label: 'Organisation' },
    { key: 'category', label: 'Group', type: 'select', options: POSITION_CATEGORIES },
    { key: 'period', label: 'When (e.g. 2022 to present)' },
    { key: 'order', label: 'Order on the page', type: 'number' },
    { key: 'description', label: 'Short description', type: 'textarea', wide: true },
    status,
  ],
  columns: [
    { key: 'title', label: 'Position' },
    { key: 'organisation', label: 'Organisation' },
    { key: 'category', label: 'Group' },
    { key: 'status', label: 'Status', render: badge },
  ],
}

export const pressConfig = {
  seed: defaults.press,
  coll: 'press',
  title: 'News and press',
  blurb: 'Profiles, press coverage and statements. Each item links to the original article. Items marked Draft stay hidden from the public site until published.',
  noun: 'Story',
  empty: { title: '', outlet: '', date: '', url: '', category: NEWS_CATEGORIES[1], summary: '', image: '', status: 'published' },
  fields: [
    { key: 'title', label: 'Headline', required: true, wide: true },
    { key: 'outlet', label: 'Outlet or source' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'category', label: 'Category', type: 'select', options: NEWS_CATEGORIES },
    { key: 'url', label: 'Link to the article', type: 'url' },
    { key: 'summary', label: 'Short summary', type: 'textarea', wide: true },
    { key: 'image', label: 'Photo', type: 'image', wide: true, hint: 'Also appears in the Gallery.' },
    status,
  ],
  columns: [
    { key: 'title', label: 'Headline' },
    { key: 'outlet', label: 'Outlet' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: badge },
  ],
  importer: {
    columns: ['title', 'outlet', 'date', 'url', 'category', 'summary'],
    example: ['Headline here', 'The Standard', '2026-05-12', 'https://example.com/article', 'Press coverage', 'One line summary.'],
    map: (r) => ({
      title: String(r.title || '').trim(),
      outlet: String(r.outlet || ''),
      date: String(r.date || ''),
      url: String(r.url || ''),
      category: NEWS_CATEGORIES.includes(r.category) ? r.category : 'Press coverage',
      summary: String(r.summary || ''),
      image: '',
      status: 'published',
    }),
  },
}

export const galleryConfig = {
  coll: 'gallery',
  title: 'Gallery',
  blurb: 'Standalone photos and videos. Project photos and news photos appear here automatically.',
  noun: 'Item',
  empty: { type: 'photo', title: '', category: GALLERY_CATEGORIES[0], src: '', url: '', status: 'published' },
  fields: [
    { key: 'type', label: 'Type', type: 'select', options: [{ value: 'photo', label: 'Photo' }, { value: 'video', label: 'Video link' }] },
    { key: 'title', label: 'Caption' },
    { key: 'category', label: 'Category', type: 'select', options: GALLERY_CATEGORIES, showIf: (f) => f.type !== 'video' },
    { key: 'src', label: 'Photo', type: 'image', wide: true, showIf: (f) => f.type !== 'video' },
    { key: 'url', label: 'Video link', type: 'url', wide: true, hint: 'YouTube, Google Drive, Facebook or TikTok. YouTube thumbnails are automatic.', showIf: (f) => f.type === 'video' },
    status,
  ],
  columns: [
    { key: 'type', label: 'Type', render: (it) => (it.type === 'video' ? 'Video' : 'Photo') },
    { key: 'title', label: 'Caption' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status', render: badge },
  ],
}

export const profileDefaults = defaults.profile
export const deliveryDefaults = defaults.delivery
export const countyDefaults = defaults.county
export const contactDefaults = defaults.contact
