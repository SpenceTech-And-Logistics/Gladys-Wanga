import { useState } from 'react'
import { getDb } from '../../lib/firebase.js'
import { resizeImage } from '../../lib/media.js'
import { useContent } from '../../lib/useContent.js'
import { Field } from './Fields.jsx'
import { addToList } from './store.js'

/** Upload a batch of photos to the Gallery in one go: one gallery item per photo. */
export default function BulkPhotos({ onDone, preset }) {
  const { lists } = useContent()
  const [files, setFiles] = useState([])
  const [category, setCategory] = useState(preset?.category || lists.galleryCategories[0] || '')
  const [caption, setCaption] = useState(preset?.caption || '')
  const [done, setDone] = useState(0)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function upload() {
    setBusy(true)
    setErr('')
    setDone(0)
    try {
      const { fs, db } = await getDb()
      let n = 0
      for (const f of files) {
        const src = await resizeImage(f, 1400, 0.76)
        await fs.addDoc(fs.collection(db, 'gallery'), { type: 'photo', title: caption.trim(), category, src, url: '', status: 'published', createdAt: fs.serverTimestamp() })
        setDone(++n)
      }
      await addToList('galleryCategories', category, lists.galleryCategories)
      setFiles([])
      onDone?.(n)
    } catch (e) {
      setErr(e.message)
    }
    setBusy(false)
  }

  return (
    <div className="adm-panel">
      <h2>Add many photos to the Gallery</h2>
      <div className="adm-grid">
        <Field def={{ key: 'category', label: 'Category for all of them', type: 'combo', options: lists.galleryCategories }} value={category} onChange={setCategory} />
        <Field def={{ key: 'caption', label: 'Caption for all of them (optional)' }} value={caption} onChange={setCaption} />
        <div className="adm-field wide">
          <span className="adm-label">Photos</span>
          <label className="adm-dropzone">
            <input type="file" accept="image/*" multiple hidden onChange={(e) => setFiles([...e.target.files])} />
            {files.length ? `${files.length} photo${files.length === 1 ? '' : 's'} chosen. Click to choose again.` : 'Click to choose photos (you can select many at once)'}
          </label>
          <small>Each photo is resized automatically before it is saved.</small>
        </div>
      </div>
      {err && <p className="adm-alert">{err}</p>}
      <div className="adm-actions">
        <button type="button" className="adm-btn" disabled={!files.length || busy || !category} onClick={upload}>
          {busy ? `Uploading ${done} of ${files.length}…` : `Upload ${files.length || ''} photo${files.length === 1 ? '' : 's'}`}
        </button>
        {busy && <div className="adm-meter" style={{ flex: '1 1 200px' }}><i style={{ width: `${(done / files.length) * 100}%` }} /></div>}
      </div>
    </div>
  )
}
