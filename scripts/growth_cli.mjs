#!/usr/bin/env node
import nextEnv from '@next/env'
import {parseArgs} from 'node:util'
import {mkdir, writeFile, open, unlink} from 'node:fs/promises'
import path from 'node:path'
import {discover, planTopics, readJson, saveJson, validateArticle, toDocument, markdown, slugify} from './seo/core.mjs'
import {sanityConnection} from './seo/sanity.mjs'
import {writingBrief} from './seo/session.mjs'

nextEnv.loadEnvConfig(process.cwd(), false, {info() {}, error() {}})
const help = `SEO Genie — CMS drafts only
  npm run growth -- seo check
  npm run growth -- seo discover [--source-file site.html] [--approve-profile]
  npm run growth -- seo plan [--limit 5] [--signals keyword-signals.json]
  npm run growth -- seo brief --topic-id TOPIC
  npm run growth -- seo draft --topic-id TOPIC [--article article.json] [--write-cms]
  npm run growth -- seo push --topic-id TOPIC

Articles are written locally by the active coding session; no model API key is used.
brief exports writing context. draft validates an imported or previously saved article.
Set SANITY_API_WRITE_TOKEN for CMS writes. push uses an existing saved article.
Use --config path/to/growth.config.json to select a client site.`

async function optionalJson(file, fallback) {
  try { return await readJson(file) } catch (error) { if (error.code === 'ENOENT') return fallback; throw error }
}
async function main() {
  const {values, positionals} = parseArgs({allowPositionals: true, options: {
    config: {type: 'string', default: 'growth.config.json'}, 'source-file': {type: 'string'}, 'approve-profile': {type: 'boolean'},
    limit: {type: 'string', default: '5'}, signals: {type: 'string'}, 'topic-id': {type: 'string'}, article: {type: 'string'}, 'write-cms': {type: 'boolean'}, help: {type: 'boolean'},
  }})
  if (values.help || !positionals.length) { console.log(help); return }
  const [namespace, command] = positionals
  if (namespace !== 'seo' || !['check','discover','plan','brief','draft','push'].includes(command) || positionals.length !== 2) throw new Error(help)
  const config = await readJson(values.config)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(config.brandId)) throw new Error('Invalid brandId.')
  for (const key of ['crawlUrl','publicUrl']) if (!['http:','https:'].includes(new URL(config.seoGenie[key]).protocol)) throw new Error(`Invalid ${key}.`)
  if (!Number.isInteger(config.seoGenie.maxPages) || config.seoGenie.maxPages < 1 || config.seoGenie.maxPages > 100) throw new Error('maxPages must be 1–100.')
  const dir = path.resolve(config.seoGenie.artifactsDir, config.brandId)
  await mkdir(dir, {recursive: true})
  const cms = sanityConnection(config)
  if (command === 'check') {
    const posts = await cms.inventory()
    console.log(JSON.stringify({projectId: cms.projectId, dataset: cms.dataset, published: posts.filter((p) => !p._id.startsWith('drafts.')).length, drafts: posts.filter((p) => p._id.startsWith('drafts.')).length, writeTokenConfigured: cms.writeConfigured, writingMode: 'coding-session', note: 'Read connection verified. Write permission is verified by a draft push, not by token presence.'}, null, 2)); return
  }
  // A per-brand lock prevents concurrent local runs creating the same topic.
  const lockPath = path.join(dir, '.lock')
  let lock
  try { lock = await open(lockPath, 'wx') } catch (error) { if (error.code === 'EEXIST') throw new Error(`Another run is active. If a previous process crashed, remove ${lockPath} after checking it is no longer running.`); throw error }
  try {
    if (command === 'discover') {
      const {profile, inventory} = await discover(config, {sourceFile: values['source-file'], approved: Boolean(values['approve-profile'])})
      await saveJson(path.join(dir, 'site-profile.json'), profile)
      await saveJson(path.join(dir, 'content-inventory.json'), inventory)
      console.log(`Discovered ${inventory.pages.length} pages. Profile ${profile.approved ? 'approved' : 'needs review'}: ${dir}/site-profile.json`)
      for (const warning of inventory.warnings) console.warn(warning)
      return
    }
    const profile = await readJson(path.join(dir, 'site-profile.json'))
    const inventory = await readJson(path.join(dir, 'content-inventory.json'))
    if (profile.brandId !== config.brandId || inventory.brandId !== config.brandId) throw new Error('Artifacts belong to another brand.')
    if (!profile.approved) throw new Error('Review the site profile, set corrections in profileOverrides and run discover --approve-profile.')
    if (command === 'plan') {
      const limit = Number(values.limit)
      if (!Number.isInteger(limit) || limit < 1 || limit > 20) throw new Error('--limit must be 1–20.')
      const signals = values.signals ? await readJson(values.signals) : []
      if (!Array.isArray(signals)) throw new Error('Signals must be a JSON array.')
      // A failed CMS read blocks planning rather than silently missing duplicates.
      const posts = await cms.inventory()
      const plan = planTopics(config, profile, inventory, posts, signals, limit)
      await saveJson(path.join(dir, 'content-plan.json'), plan)
      await saveJson(path.join(dir, 'history', `${plan.generatedAt.replace(/[:.]/g, '-')}.json`), plan)
      console.log(JSON.stringify(plan, null, 2)); return
    }
    const topicId = values['topic-id']
    if (!topicId || slugify(topicId) !== topicId) throw new Error('Supply a valid --topic-id from content-plan.json.')
    const plan = await readJson(path.join(dir, 'content-plan.json'))
    if (plan.brandId !== config.brandId) throw new Error('Plan belongs to another brand.')
    const brief = plan.opportunities.find((t) => t.id === topicId)
    if (!brief) throw new Error('Topic is not in content-plan.json.')
    if (!['new-article', 'update-draft'].includes(brief.action)) throw new Error(`Topic recommends ${brief.action}. Review the existing page instead of generating a competing article.`)
    const draftsDir = path.join(dir, 'drafts'); await mkdir(draftsDir, {recursive: true})
    const articleFile = path.join(draftsDir, `${topicId}.json`)
    const receiptFile = path.join(draftsDir, `${topicId}.receipt.json`)
    if (command === 'brief') {
      if (values['write-cms']) throw new Error('brief prepares local writing context only. Import a completed article before pushing.')
      const packetFile = path.join(draftsDir, `${topicId}.writing-brief.json`)
      await saveJson(packetFile, writingBrief(config, profile, brief, inventory))
      console.log(`Coding-session writing packet saved: ${packetFile}\nAuthor the article JSON in this session, then run seo draft --topic-id ${topicId} --article <file>.`)
      return
    }
    const inputFile = command === 'draft' && values.article ? values.article : articleFile
    const article = await optionalJson(inputFile, null)
    if (!article) throw new Error(`No article at ${inputFile}. Run seo brief --topic-id ${topicId}, author the article locally in this coding session, then use seo draft --topic-id ${topicId} --article <file>.`)
    validateArticle(article, brief)
    await saveJson(articleFile, article)
    await writeFile(path.join(draftsDir, `${topicId}.md`), markdown(article, brief))
    console.log(`Local article and Markdown preview saved: ${articleFile}`)
    if (command === 'push' || values['write-cms']) {
      const document = toDocument(article, brief, config)
      const receipt = await optionalJson(receiptFile, null)
      if (receipt && (receipt.projectId !== cms.projectId || receipt.dataset !== cms.dataset)) throw new Error('Receipt belongs to another CMS target.')
      const pending = await cms.push(document, receipt)
      await saveJson(receiptFile, {id: pending.id, projectId: cms.projectId, dataset: cms.dataset, status: 'pending'})
      const result = await pending.commit()
      await saveJson(receiptFile, result)
      console.log(JSON.stringify(result, null, 2))
    }
  } finally { await lock.close(); await unlink(lockPath) }
}
main().catch((error) => { console.error(`SEO Genie: ${error.message}`); process.exitCode = 1 })
