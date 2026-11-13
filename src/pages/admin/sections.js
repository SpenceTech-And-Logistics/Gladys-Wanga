import { GALLERY_CATEGORIES, LISTS, NEWS_CATEGORIES, POSITION_CATEGORIES, STAGES, defaults } from '../../data/content.js'

const status = { key: 'status', label: 'Status', type: 'select', options: [{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft (hidden)' }] }
const badge = (it) => (it.status === 'draft' ? 'Draft' : 'Published')

export const profileFields = [
  { key: 'name', label: 'Name as shown', wide: false },
  { key: 'honours', label: 'Honours (e.g. EGH, CBS)' },
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
  { key: 'resultsIntro', label: 'Results: introduction', type: 'textarea', wide: true },
  { key: 'results', label: 'Results by sector (one point per line)', type: 'list', noun: 'sector', wide: true, fields: [{ key: 'title', label: 'Sector' }, { key: 'text', label: 'Points, one per line', type: 'textarea' }] },
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
  { key: 'whatsapp', label: 'Office WhatsApp number', type: 'tel', hint: 'Adds a “Chat on WhatsApp” button to the Contact page and footer. Leave blank to hide it.' },
  { key: 'social', label: 'Social links (Facebook, X, YouTube, TikTok…)', type: 'list', noun: 'link', wide: true, fields: [{ key: 'label', label: 'Name' }, { key: 'url', label: 'Link', type: 'url' }] },
  { key: 'links', label: 'Other links', type: 'list', noun: 'link', wide: true, fields: [{ key: 'label', label: 'Name' }, { key: 'url', label: 'Link', type: 'url' }] },
]

export const positionsConfig = {
  seed: defaults.positions,
  coll: 'positions',
  title: 'Positions',
  filterKey: 'category',
  viewPath: () => '/about#positions',
  blurb: 'Offices, committees, party and movement roles, shown in the Positions section of the About page. Lower numbers appear first.',
  noun: 'Position',
  empty: { title: '', organisation: '', category: POSITION_CATEGORIES[0], period: '', description: '', order: 50, status: 'published' },
  fields: [
    { key: 'title', label: 'Position', required: true, wide: true },
    { key: 'organisation', label: 'Organisation' },
    { key: 'category', label: 'Group', type: 'combo', listKey: 'positionCategories', noun: 'group' },
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
  filterKey: 'category',
  viewPath: () => '/news',
  blurb: 'Profiles, press coverage and statements. Each item links to the original article. Items marked Draft stay hidden from the public site until published.',
  noun: 'Story',
  empty: { title: '', outlet: '', date: '', url: '', category: NEWS_CATEGORIES[1], summary: '', image: '', status: 'published' },
  fields: [
    { key: 'title', label: 'Headline', required: true, wide: true },
    { key: 'outlet', label: 'Outlet or source' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'category', label: 'Category', type: 'combo', listKey: 'newsCategories' },
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
  filterKey: 'category',
  bulk: true,
  viewPath: () => '/gallery',
  blurb: 'Standalone photos and videos. Photos from projects, events and news appear in the public gallery automatically. Use “Add many photos” to upload a batch at once.',
  noun: 'Item',
  empty: { type: 'photo', title: '', category: GALLERY_CATEGORIES[0], src: '', url: '', status: 'published' },
  fields: [
    { key: 'type', label: 'Type', type: 'select', options: [{ value: 'photo', label: 'Photo' }, { value: 'video', label: 'Video link' }] },
    { key: 'title', label: 'Caption' },
    { key: 'category', label: 'Category', type: 'combo', listKey: 'galleryCategories', showIf: (f) => f.type !== 'video' },
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

const video = { key: 'video', label: 'Video link (optional)', type: 'url', wide: true, hint: 'YouTube, Facebook, TikTok or Google Drive. YouTube and Drive videos play on the page.' }
const subcounty = { key: 'subcounty', label: 'Sub-county', type: 'combo', listKey: 'subcounties', allowNew: false, blank: '— Not set —' }

export const projectsConfig = {
  seed: defaults.projects,
  coll: 'projects',
  title: 'Projects',
  blurb: 'Completed, ongoing and upcoming projects, shown on the Projects page by funder and sector. Up to 6 photos each; they also appear in the Gallery. Keep amounts in the description if you want them mentioned.',
  noun: 'Project',
  tabKey: 'fund',
  tabList: 'funds',
  filterKey: 'sector',
  viewPath: (it) => `/projects/${it.id}`,
  empty: { title: '', fund: LISTS.funds[0], sector: LISTS.projectSectors[0], stage: 'Completed', subcounty: '', ward: '', year: String(new Date().getFullYear()), description: '', photos: [], video: '', status: 'published' },
  fields: [
    { key: 'title', label: 'Project name', required: true, wide: true },
    { key: 'fund', label: 'Funded by', type: 'combo', listKey: 'funds', noun: 'funder' },
    { key: 'sector', label: 'Sector', type: 'combo', listKey: 'projectSectors', noun: 'sector' },
    { key: 'stage', label: 'Status', type: 'select', options: STAGES },
    subcounty,
    { key: 'ward', label: 'Ward' },
    { key: 'year', label: 'Year (e.g. 2025 or 2024/25)' },
    { key: 'description', label: 'Description', type: 'textarea', rows: 6, wide: true, hint: 'What was done, where, and who benefits. Leave a blank line between paragraphs.' },
    { key: 'photos', label: 'Photos (the first is the cover)', type: 'images', max: 6, side: 1000, wide: true },
    video,
    status,
  ],
  columns: [
    { key: 'title', label: 'Project' },
    { key: 'fund', label: 'Funded by' },
    { key: 'sector', label: 'Sector' },
    { key: 'stage', label: 'Status' },
    { key: 'photos', label: 'Photos', render: (it) => (it.photos || []).length },
    { key: 'status', label: 'On site', render: badge },
  ],
  importer: {
    columns: ['title', 'fund', 'sector', 'stage', 'subcounty', 'ward', 'year', 'description'],
    example: ['Rangwe Level 4 maternity wing', 'County Government', 'Health', 'Ongoing', 'Rangwe', 'Kagan', '2025', 'A new maternity wing with 40 beds.'],
    map: (r) => ({
      title: String(r.title || '').trim(),
      fund: String(r.fund || LISTS.funds[0]),
      sector: String(r.sector || 'Other'),
      stage: STAGES.includes(r.stage) ? r.stage : 'Completed',
      subcounty: String(r.subcounty || ''),
      ward: String(r.ward || ''),
      year: String(r.year || ''),
      description: String(r.description || ''),
      photos: [],
      video: '',
      status: 'published',
    }),
  },
}

export const eventsConfig = {
  seed: defaults.events,
  coll: 'events',
  title: 'Events',
  blurb: 'Tours, launches, public forums and milestones (County leadership, Parliament, Party and campaigns). Events dated today or later show as Upcoming; the rest are listed by year with their photos.',
  noun: 'Event',
  filterKey: 'type',
  viewPath: (it) => `/events/${it.id}`,
  empty: { title: '', type: LISTS.eventTypes[0], date: '', time: '', venue: '', subcounty: '', description: '', photos: [], video: '', status: 'published' },
  fields: [
    { key: 'title', label: 'Event', required: true, wide: true },
    { key: 'type', label: 'Type', type: 'combo', listKey: 'eventTypes', noun: 'type' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'time', label: 'Time (e.g. 10:00 am)' },
    { key: 'venue', label: 'Where' },
    subcounty,
    { key: 'description', label: 'Description', type: 'textarea', rows: 5, wide: true },
    { key: 'photos', label: 'Photos (the first is the cover)', type: 'images', max: 6, side: 1000, wide: true },
    video,
    status,
  ],
  columns: [
    { key: 'title', label: 'Event' },
    { key: 'type', label: 'Type' },
    { key: 'date', label: 'Date' },
    { key: 'photos', label: 'Photos', render: (it) => (it.photos || []).length },
    { key: 'status', label: 'On site', render: badge },
  ],
  importer: {
    columns: ['title', 'type', 'date', 'time', 'venue', 'subcounty', 'description'],
    example: ['Budget public participation forum', 'Public participation', '2026-12-02', '10:00 am', 'Homa Bay town hall', 'Homa Bay Town', 'Residents give views on the county budget.'],
    map: (r) => ({
      title: String(r.title || '').trim(),
      type: String(r.type || 'Other'),
      date: String(r.date || ''),
      time: String(r.time || ''),
      venue: String(r.venue || ''),
      subcounty: String(r.subcounty || ''),
      description: String(r.description || ''),
      photos: [],
      video: '',
      status: 'published',
    }),
  },
}

/** Lists the office can edit on the Categories screen. */
export const listFields = [
  { key: 'funds', label: 'Project funders (tabs on the Projects page)', type: 'strings', wide: true },
  { key: 'projectSectors', label: 'Project sectors', type: 'strings', wide: true },
  { key: 'eventTypes', label: 'Event types', type: 'strings', wide: true },
  { key: 'newsCategories', label: 'News categories', type: 'strings', wide: true },
  { key: 'galleryCategories', label: 'Gallery categories', type: 'strings', wide: true },
  { key: 'positionCategories', label: 'Position groups', type: 'strings', wide: true },
]
export const listDefaults = LISTS

export const profileDefaults = defaults.profile
export const deliveryDefaults = defaults.delivery
export const countyDefaults = defaults.county
export const contactDefaults = defaults.contact
