import {randomUUID} from 'node:crypto'
import {request} from './core.mjs'

export function sanityConnection(config, env = process.env, fetcher = fetch) {
  const p = config.publishing
  if (p.adapter !== 'sanity' || p.mode !== 'draft') throw new Error('Only the Sanity draft adapter is supported.')
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || p.projectId
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET || p.dataset
  if (projectId !== p.projectId || dataset !== p.dataset) throw new Error('Sanity environment and growth.config.json targets differ. Correct the target before proceeding.')
  if (!/^[a-z0-9]+$/.test(projectId) || !/^[a-z0-9_-]+$/.test(dataset)) throw new Error('Invalid Sanity project/dataset.')
  const root = `https://${projectId}.api.sanity.io/v${p.apiVersion}/data`
  const writeToken = env[p.writeTokenEnv]
  const readToken = writeToken || env.SANITY_API_READ_TOKEN
  async function query(groq, params = {}, requireWrite = false) {
    if (requireWrite && !writeToken) throw new Error(`Set ${p.writeTokenEnv} to an Editor token. Read tokens are never used for mutations.`)
    const url = new URL(`${root}/query/${dataset}`)
    url.searchParams.set('query', groq); url.searchParams.set('perspective', 'raw')
    for (const [k, v] of Object.entries(params)) url.searchParams.set(`$${k}`, JSON.stringify(v))
    const res = await request(url, {headers: readToken ? {Authorization: `Bearer ${readToken}`} : {}}, fetcher)
    const json = await res.json()
    if (json.error) throw new Error('Sanity query failed.')
    return json.result
  }
  const inventory = () => query('*[_type == "post"]{_id,_rev,title,"slug":slug.current,seoGenie}')
  async function push(document, record) {
    if (!writeToken) throw new Error(`Set ${p.writeTokenEnv} to an Editor token. Local previews have been retained.`)
    const matches = await query('*[_type == "post" && (seoGenie.topicKey == $key || slug.current == $slug || _id == $publishedId)]{_id,_rev,seoGenie}', {key: document.seoGenie.topicKey, slug: document.slug.current, publishedId: record?.id?.replace(/^drafts\./, '') || ''}, true)
    if (matches.some((m) => !m._id.startsWith('drafts.'))) throw new Error('A matching post is already published. Use the editorial update workflow; no changes made.')
    const owned = matches.filter((m) => m.seoGenie?.topicKey === document.seoGenie.topicKey)
    if (matches.some((m) => m.seoGenie?.topicKey !== document.seoGenie.topicKey) || owned.length > 1) throw new Error('Conflicting or duplicate CMS draft; resolve in Studio before retrying.')
    // Random IDs are persisted locally before the first request. Retrying an uncertain
    // network outcome uses the same ID. A revision guard protects subsequent edits.
    const id = owned[0]?._id || record?.id || `drafts.${randomUUID()}`
    if (!/^drafts\.[a-zA-Z0-9_-]+$/.test(id)) throw new Error('Invalid draft ID in receipt.')
    const existing = await query('*[_id == $id][0]{_id,_rev,seoGenie}', {id}, true)
    if (existing && existing.seoGenie?.topicKey !== document.seoGenie.topicKey) throw new Error('Draft ID belongs to another topic.')
    const mutation = existing ? {patch: {id, ifRevisionID: existing._rev, set: document}} : {create: {...document, _id: id}}
    return {id, mutation, async commit() {
      const res = await request(`${root}/mutate/${dataset}?returnIds=true&visibility=sync`, {method: 'POST', headers: {Authorization: `Bearer ${writeToken}`, 'Content-Type': 'application/json'}, body: JSON.stringify({mutations: [mutation]})}, fetcher)
      const json = await res.json()
      if (!json.results?.some((r) => r.id === id)) throw new Error('CMS write response did not confirm the draft ID.')
      const verified = await query('*[_id == $id][0]{_id,seoGenie}', {id}, true)
      if (verified?.seoGenie?.contentHash !== document.seoGenie.contentHash) throw new Error('CMS verification failed; retry using the saved receipt.')
      return {id, projectId, dataset, status: 'draft', verifiedAt: new Date().toISOString(), studioUrl: `${config.seoGenie.publicUrl}/studio/structure/post;${encodeURIComponent(id.replace(/^drafts\./, ''))}`}
    }}
  }
  return {projectId, dataset, writeConfigured: Boolean(writeToken), inventory, query, push}
}
