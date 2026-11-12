import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { EditLink } from '../components/AdminBar.jsx'
import Empty from '../components/Empty.jsx'
import PageHead from '../components/PageHead.jsx'
import Placeholder from '../components/Placeholder.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { STAGES } from '../data/content.js'
import { useContent } from '../lib/useContent.js'

const short = (t = '', n = 130) => (t.length > n ? `${t.slice(0, n - 3).trimEnd()}…` : t)

export function StageBadge({ stage }) {
  if (!stage) return null
  return <span className={`stage stage-${stage.toLowerCase()}`}>{stage}</span>
}

export default function Projects() {
  const { projects, lists } = useContent()
  const [params, setParams] = useSearchParams()
  const fund = params.get('fund') || 'All'
  const sector = params.get('sector') || 'All'
  const stage = params.get('stage') || 'All'
  const sc = params.get('sc') || 'All'

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    if (value === 'All') next.delete(key)
    else next.set(key, value)
    if (key === 'fund') next.delete('sector')
    setParams(next, { replace: true })
  }

  const inFund = fund === 'All' ? projects : projects.filter((p) => p.fund === fund)
  const sectors = useMemo(() => lists.projectSectors.filter((s) => inFund.some((p) => p.sector === s)), [lists.projectSectors, inFund])
  const subcounties = lists.subcounties.filter((s) => projects.some((p) => p.subcounty === s))
  const shown = inFund.filter(
    (p) => (sector === 'All' || p.sector === sector) && (stage === 'All' || p.stage === stage) && (sc === 'All' || p.subcounty === sc),
  )
  const count = (f) => (f === 'All' ? projects.length : projects.filter((p) => p.fund === f).length)

  return (
    <>
      <PageHead
        eyebrow="Projects"
        title="Development across Homa Bay County"
        lead="Health, education, roads, water and livelihoods: the work of the county government and its partners, ward by ward."
      />
      <section className="wrap section-tight">
        {projects.length === 0 ? (
          <Empty
            title="Projects are being added"
            text="The office is compiling completed, ongoing and upcoming projects with photos from each sub-county. They will appear here as they are published."
            cta={{ to: '/contact', label: 'Ask the office about a project' }}
          />
        ) : (
          <>
            <div className="tabs" role="tablist" aria-label="Funded by">
              {['All', ...lists.funds].map((f) => (
                <button key={f} type="button" role="tab" aria-selected={fund === f} className="tab" onClick={() => set('fund', f)}>
                  {f === 'All' ? 'All projects' : f} <em>{count(f)}</em>
                </button>
              ))}
            </div>

            <div className="filters">
              {sectors.length > 0 && (
                <div className="chips" role="group" aria-label="Filter by sector">
                  {['All', ...sectors].map((c) => (
                    <button key={c} type="button" className="chip" aria-pressed={sector === c} onClick={() => set('sector', c)}>{c === 'All' ? 'All sectors' : c}</button>
                  ))}
                </div>
              )}
              <div className="filter-row">
                <label>
                  Status
                  <select value={stage} onChange={(e) => set('stage', e.target.value)}>
                    <option value="All">All</option>
                    {STAGES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
                {subcounties.length > 0 && (
                  <label>
                    Sub-county
                    <select value={sc} onChange={(e) => set('sc', e.target.value)}>
                      <option value="All">All sub-counties</option>
                      {subcounties.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </label>
                )}
                <span className="muted">{shown.length} project{shown.length === 1 ? '' : 's'}</span>
              </div>
            </div>

            {shown.length === 0 ? (
              <p className="muted">No projects match these filters yet.</p>
            ) : (
              <div className="grid grid-3 grid-fill">
                {shown.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 90} className="card-wrap">
                    <Link to={`/projects/${p.id}`} className="card card-link">
                      <div className="card-img">
                        {p.photos?.[0] ? <img src={p.photos[0]} alt={p.title} loading="lazy" /> : <Placeholder />}
                        <StageBadge stage={p.stage} />
                      </div>
                      <div className="card-body">
                        <span className="tag">{p.sector || 'Project'}</span>
                        <h3>{p.title}</h3>
                        {p.description && <p>{short(p.description)}</p>}
                        <span className="meta">{[p.ward && `${p.ward} Ward`, p.subcounty, p.year].filter(Boolean).join(' · ')}</span>
                      </div>
                    </Link>
                    <EditLink coll="projects" id={p.id} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}
