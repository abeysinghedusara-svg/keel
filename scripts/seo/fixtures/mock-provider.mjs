// Imported only by the subprocess integration test. Never used by the real CLI.
import {readFile, writeFile} from 'node:fs/promises'
const json = (result) => new Response(JSON.stringify(result), {status: 200})
globalThis.fetch = async (url, options = {}) => {
  const parsed = new URL(url)
  if (!parsed.hostname.endsWith('.api.sanity.io')) throw new Error('Unexpected test network request')
  const documents = JSON.parse(await readFile(process.env.SEO_TEST_DB, 'utf8'))
  if (parsed.pathname.includes('/mutate/')) {
    const mutation = JSON.parse(options.body).mutations[0]
    const id = mutation.create?._id || mutation.patch.id
    if (mutation.create && documents[id]) return new Response('', {status: 409})
    if (mutation.patch && mutation.patch.ifRevisionID !== documents[id]._rev) return new Response('', {status: 409})
    documents[id] = {...(mutation.create || {...documents[id], ...mutation.patch.set}), _rev: crypto.randomUUID()}
    await writeFile(process.env.SEO_TEST_DB, JSON.stringify(documents))
    return json({results: [{id}]})
  }
  const id = JSON.parse(parsed.searchParams.get('$id') || 'null')
  if (id) return json({result: documents[id] || null})
  const key = JSON.parse(parsed.searchParams.get('$key') || 'null')
  const slug = JSON.parse(parsed.searchParams.get('$slug') || 'null')
  return json({result: Object.values(documents).filter((d) => !key || d.seoGenie?.topicKey === key || d.slug.current === slug)})
}
