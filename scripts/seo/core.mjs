import {randomUUID, createHash} from 'node:crypto'
import {mkdir, readFile, writeFile, rename} from 'node:fs/promises'
import path from 'node:path'

export const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const topicKey = (brand, query) => `${brand}:${slugify(query)}`
export async function readJson(file) { return JSON.parse(await readFile(file, 'utf8')) }
export async function saveJson(file, data) {
  await mkdir(path.dirname(file), {recursive: true})
  const temp = `${file}.${randomUUID()}.tmp`
  await writeFile(temp, `${JSON.stringify(data, null, 2)}\n`)
  await rename(temp, file)
}
export async function request(url, options = {}, fetcher = fetch) {
  const response = await fetcher(url, {...options, signal: AbortSignal.timeout(60000)})
  if (!response.ok) throw new Error(`Request to ${new URL(url).hostname} failed (HTTP ${response.status}). Check credentials, dataset and permissions.`)
  return response
}
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
export const textOnly = (s) => decode(s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*["']([^"']*)["']/g)].map((m) => [m[1].toLowerCase(), decode(m[2])]))
export function extractPage(html, url, publicUrl) {
  const clean = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
  const content = clean.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || clean.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || clean
  const main = content.replace(/<(nav|footer)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => attrs(m[0]))
  const links = [...clean.matchAll(/<a\b[^>]*>/gi)].map((m) => attrs(m[0]).href).filter(Boolean).flatMap((href) => {
    try { const u = new URL(href, url); return u.origin === new URL(url).origin ? [new URL(u.pathname + u.hash, publicUrl).href] : [] } catch { return [] }
  })
  return {
    url: new URL(new URL(url).pathname, publicUrl).href,
    title: textOnly(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || ''),
    description: metas.find((m) => m.name === 'description')?.content || '',
    headings: [...main.matchAll(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi)].map((m) => textOnly(m[1])),
    canonical: [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => attrs(m[0])).find((a) => a.rel === 'canonical')?.href || null,
    robots: metas.find((m) => m.name === 'robots')?.content || null,
    text: textOnly(main).slice(0, 24000), links: [...new Set(links)],
    anchors: [...main.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map((m) => m[1]),
  }
}
export async function discover(config, {sourceFile, approved = false} = {}) {
  const c = config.seoGenie
  const pages = [], warnings = [], queue = [new URL(c.crawlUrl).href], visited = new Set()
  if (sourceFile) {
    pages.push(extractPage(await readFile(sourceFile, 'utf8'), c.crawlUrl, c.publicUrl))
    warnings.push(`Discovery used local HTML: ${sourceFile}; verify it matches production.`)
  } else {
    try {
      const xml = await (await request(new URL('/sitemap.xml', c.crawlUrl))).text()
      for (const m of xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)) {
        const u = new URL(decode(m[1])); if (u.origin === new URL(c.crawlUrl).origin && !u.pathname.endsWith('.xml')) queue.push(u.href)
      }
    } catch (error) { warnings.push(`Sitemap unavailable: ${error.message}`) }
    while (queue.length && visited.size < c.maxPages) {
      const url = queue.shift()
      if (visited.has(url)) continue
      visited.add(url)
      try {
        const response = await request(url, {redirect: 'error'})
        if (!(response.headers.get('content-type') || '').includes('text/html')) continue
        const page = extractPage(await response.text(), url, c.publicUrl)
        pages.push(page)
        for (const link of page.links) {
          const u = new URL(link); u.hash = ''; u.search = ''
          if (/\.(?:png|jpg|svg|pdf|xml)$|^\/studio(?:\/|$)/i.test(u.pathname)) continue
          const local = new URL(u.pathname, c.crawlUrl).href
          if (!visited.has(local)) queue.push(local)
        }
        queue.sort((a, b) => Number(new URL(a).pathname.startsWith('/blog/')) - Number(new URL(b).pathname.startsWith('/blog/')))
      } catch (error) { warnings.push(`${url}: ${error.message}`) }
    }
  }
  if (!pages.length) throw new Error('No pages discovered. Check crawlUrl or use --source-file path/to/site.html.')
  const servicePages = pages.filter((p) => !new URL(p.url).pathname.startsWith('/blog'))
  const text = servicePages.map((p) => p.text).join(' ').toLowerCase()
  const offerings = ['legal', 'compliance'].filter((word) => text.includes(word))
  const profile = {
    discoveredAt: new Date().toISOString(),
    niche: offerings.length ? `${offerings.join(' and ')} support` : 'Needs review',
    offerings, audience: 'Law firms and businesses needing operational support',
    language: c.language, market: c.market, contentPillars: offerings,
    conversionPages: servicePages.flatMap((p) => p.links.filter((l) => /#(?:services|contact)$/.test(l))),
    evidence: servicePages.map((p) => ({url: p.url, title: p.title, description: p.description})),
    reviewFlags: ['Audience and market require owner verification.', 'Keyword seeds are hypotheses, not measured search demand.'],
    ...c.profileOverrides,
    brandId: config.brandId, approved,
  }
  return {profile, inventory: {brandId: config.brandId, generatedAt: new Date().toISOString(), pages, warnings}}
}

const tokens = (s) => new Set(slugify(s).split('-').filter((t) => !['a','the','to','for','of','how','what','can','your','and','with','in'].includes(t)))
export function similarity(a, b) {
  const x = tokens(a), y = tokens(b)
  return x.size && y.size ? [...x].filter((t) => y.has(t)).length / Math.max(x.size, y.size) : 0
}
export function planTopics(config, profile, inventory, cmsPosts, signals = [], limit = 5) {
  if (!profile.approved) throw new Error('Review the profile and rerun discover --approve-profile (use profileOverrides for corrections).')
  const now = new Date().toISOString()
  const opportunities = config.seoGenie.keywordSeeds.filter((seed) => profile.offerings.includes(seed.offering)).map((seed) => {
    const id = slugify(seed.query), key = topicKey(config.brandId, seed.query)
    const cmsMatch = cmsPosts.find((p) => p.seoGenie?.topicKey === key || p.slug === id || similarity(p.title || '', seed.title) >= 0.65 || similarity(p.seoGenie?.primaryQuery || '', seed.query) >= 0.65)
    const pageMatch = inventory.pages.find((p) => new URL(p.url).pathname !== '/' && [p.title, ...p.headings].some((heading) => similarity(heading, seed.title) >= 0.65))
    const existingPage = cmsMatch ? {id: cmsMatch._id, url: `${config.seoGenie.publicUrl}/blog/${cmsMatch.slug}`, draft: cmsMatch._id.startsWith('drafts.')} : pageMatch ? {url: pageMatch.url} : null
    const evidence = signals.filter((s) => s.brandId === config.brandId && slugify(s.query || '') === id && typeof s.source === 'string' && s.source && /^\d{4}-\d{2}-\d{2}$/.test(s.periodStart || '') && /^\d{4}-\d{2}-\d{2}$/.test(s.periodEnd || '') && s.periodStart <= s.periodEnd && ['impressions','clicks','volume','position'].some((k) => Number.isFinite(s[k]) && s[k] >= 0))
    const sourcePage = inventory.pages.find((p) => !new URL(p.url).pathname.startsWith('/blog') && p.text.toLowerCase().includes(seed.offering))
    const action = existingPage ? (cmsMatch?._id.startsWith('drafts.') && cmsMatch.seoGenie?.topicKey === key ? 'update-draft' : 'update-existing') : seed.intent === 'transactional' ? 'strengthen-service-page' : 'new-article'
    const score = 60 + (seed.intent === 'informational' ? 15 : 5) + (sourcePage ? 10 : 0) + (evidence.length ? 10 : 0)
    const serviceUrl = `${config.seoGenie.publicUrl}/#services`
    return {id, topicKey: key, title: seed.title, primaryQuery: seed.query, relatedPhrases: seed.relatedPhrases || [], audience: profile.audience, market: profile.market, intent: seed.intent, action, existingPage, score,
      rankingReasons: ['Matches a confirmed offering', seed.intent === 'informational' ? 'Answers a buyer workflow question' : 'Transactional query belongs on a service page', evidence.length ? 'Measured evidence supplied' : 'Search demand unknown'],
      demandStatus: evidence.length ? 'evidence-supplied' : 'unknown', demandEvidence: evidence,
      supportingEvidence: sourcePage ? [{url: sourcePage.url, note: `Site describes ${seed.offering} support; this supports business fit, not search volume.`}] : [],
      outline: ['Answer the main question', 'Responsibilities and boundaries', 'A practical workflow checklist', 'Questions to discuss before delegating'],
      conversionTarget: `${config.seoGenie.publicUrl}/#contact`, internalLinks: [serviceUrl, `${config.seoGenie.publicUrl}/#contact`],
    }
  }).sort((a, b) => b.score - a.score).slice(0, limit)
  return {brandId: config.brandId, generatedAt: now, methodology: 'Configured buyer-question hypotheses ranked by offering fit, intent and supplied dated demand evidence. No volume estimates are invented.', opportunities}
}

export function validateArticle(article, brief) {
  for (const [field, max] of [['title',110],['slug',100],['excerpt',240],['seoTitle',60],['seoDescription',160]]) {
    if (typeof article[field] !== 'string' || !article[field].trim() || article[field].length > max) throw new Error(`Invalid article ${field}; required, maximum ${max} characters.`)
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) throw new Error('Invalid article slug.')
  if (!Array.isArray(article.sections) || article.sections.length < 3) throw new Error('Article requires at least three sections.')
  for (const s of article.sections) {
    if (typeof s.heading !== 'string' || !s.heading.trim() || !Array.isArray(s.paragraphs) || !s.paragraphs.length || s.paragraphs.some((p) => typeof p !== 'string' || !p.trim())) throw new Error('Invalid article section.')
  }
  if (!Array.isArray(article.sourceNotes) || !article.sourceNotes.length || article.sourceNotes.some((s) => typeof s !== 'string')) throw new Error('Article requires source notes.')
  if (!Array.isArray(article.reviewFlags) || article.reviewFlags.some((s) => typeof s !== 'string')) throw new Error('Article requires reviewFlags array.')
  if (article.sections.flatMap((s) => s.paragraphs).join(' ').split(/\s+/).length < 300) throw new Error('Article body must contain at least 300 words.')
  if (brief && !article.sections.some((s) => s.paragraphs.some((p) => p.toLowerCase().includes(brief.primaryQuery.toLowerCase())))) throw new Error('Article must address the primary query explicitly.')
  return article
}
const block = (text, style = 'normal') => ({_key: randomUUID(), _type: 'block', style, markDefs: [], children: [{_key: randomUUID(), _type: 'span', text, marks: []}]})
export function toDocument(article, brief, config) {
  validateArticle(article, brief)
  const body = article.sections.flatMap((s) => [block(s.heading, 'h2'), ...s.paragraphs.map((p) => block(p))])
  for (const [i, url] of brief.internalLinks.entries()) {
    if (!['http:', 'https:'].includes(new URL(url).protocol) || new URL(url).origin !== new URL(config.seoGenie.publicUrl).origin) throw new Error('Invalid internal link.')
    const b = block(i === 0 ? 'Explore our services' : 'Talk with Keel Talent')
    const key = randomUUID(); b.markDefs = [{_key: key, _type: 'link', href: url}]; b.children[0].marks = [key]; body.push(b)
  }
  return {_type: 'post', title: article.title, slug: {_type: 'slug', current: article.slug}, excerpt: article.excerpt, publishedAt: new Date().toISOString(), body,
    seo: {title: article.seoTitle, description: article.seoDescription},
    seoGenie: {topicKey: brief.topicKey, primaryQuery: brief.primaryQuery, brandId: config.brandId, sourceNotes: article.sourceNotes, reviewFlags: article.reviewFlags, generatedAt: new Date().toISOString(), contentHash: createHash('sha256').update(JSON.stringify(article)).digest('hex')},
  }
}
export function markdown(article, brief) {
  return `# ${article.title}\n\n${article.excerpt}\n\n${article.sections.map((s) => `## ${s.heading}\n\n${s.paragraphs.join('\n\n')}`).join('\n\n')}\n\n${brief.internalLinks.map((u) => `[${u}](${u})`).join('\n\n')}\n\n## Editorial notes\n\nPrimary query: ${brief.primaryQuery}\n\nSEO title: ${article.seoTitle}\n\nMeta description: ${article.seoDescription}\n\nSources:\n${article.sourceNotes.map((s) => `- ${s}`).join('\n')}\n\nReview flags:\n${article.reviewFlags.map((s) => `- ${s}`).join('\n')}\n`
}
