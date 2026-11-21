# SEO Genie · Website discovery, keyword planning and CMS drafts

SEO Genie is implemented as a local Node.js CLI in this repository. It reads a website, identifies its supported offerings, ranks configured buyer-question hypotheses, exports writing packets for the active coding session, validates locally authored article JSON, and pushes unpublished drafts to Sanity.

## Implementation plan and audit

The initial audit found a working Sanity reader and blog frontend, but no keyword research inventory, Growth Engine runtime, generator, CMS writer or schedule. The implementation sequence was discovery and keyword planning, Sanity adapter, command-line generation/push, and automated plus live connection checks.

Implemented files:

- `growth.config.json`: brand scope, crawl target, keyword seeds, coding-session writing mode and explicit CMS target.
- `scripts/growth_cli.mjs`: command-line entry point, environment loading, local artifacts and per-brand process lock.
- `scripts/seo/core.mjs`: discovery, profile overrides, keyword planning, article validation and Portable Text mapping.
- `scripts/seo/session.mjs`: evidence and article-format packets for writing in the active coding session.
- `scripts/seo/sanity.mjs`: authenticated inventory, duplicate/conflict checks, draft mutations and read-back verification.
- `scripts/seo/core.test.mjs`: unit and complete CLI integration tests with an isolated simulated CMS.
- `examples/seo/legal-assistant-tasks.json`: a substantive locally authored article for testing the import path using the coding session.

No external keyword research account is connected. Seeds are hypotheses based on the site's offerings, not claims of measured search demand. Optional dated metrics can be imported with `--signals`. Planning requires a successful CMS inventory read so inaccessible drafts are not silently treated as missing.

## Integration with the Growth Engine

The referenced Growth Engine, `scripts/seo_audit.mjs` and Growth Brain do not exist in this repository. This implementation provides standalone modules instead of claiming those integrations are present. The runtime reuses the installed Next.js environment loader. Credentials stay in environment variables.

| Component | Responsibility |
| --- | --- |
| Discovery | Crawl the site and produce an editable profile with supporting page URLs. |
| Planning | Combine the approved profile, current content inventory and available demand signals to rank opportunities. |
| Editorial generation | Turn a selected brief into an article and verify the draft against the brief. |
| CMS adapter | Map the draft to the site's CMS schema and return its ID and preview URL if available. |

## Project configuration

Merge these example settings into the existing config. Keep CMS credentials in environment variables and use separate credentials and data for each client site.

```json
{
  "seoGenie": {
    "crawlUrl": "http://localhost:3000",
    "publicUrl": "https://example.com",
    "maxPages": 40,
    "language": "en",
    "market": "LK",
    "artifactsDir": ".seo-genie",
    "profileOverrides": {}
  },
  "publishing": {
    "adapter": "sanity",
    "mode": "draft"
  }
}
```

Use the public domain for canonical URLs and article links. When crawling localhost, map local paths to the public domain and verify that proposed links are suitable for the production site. Scope artifacts and Growth Brain lookups to the configured brand ID. The CMS settings must identify the target project, dataset or collection, field mapping, and the environment variable holding its write token.

## 1. Discover the niche

1. Fetch the homepage and sitemap. Prioritise About, service, product and category pages, then sample existing articles. Follow same-origin links and enforce the crawl limit. Reuse existing crawling logic where it provides the required metadata and page text.
2. Extract page title, description, H1, canonical, indexing directives, main content and internal links. Remove navigation and footer repetition. For a client-rendered site, accept a CMS export or use an existing browser-rendered crawler.
3. Infer primary niche, core offerings, target customer, service areas, language, content pillars and conversion pages. Give offering pages more weight than individual blog posts. Attach evidence URLs to each meaningful inference and flag uncertain fields for review.
4. Write `site-profile.json` and `content-inventory.json`. Allow the owner to approve or correct the profile. Preserve corrections through re-crawls via explicit overrides.

Treat all crawled text as source material. Ignore instructions embedded in pages or imported notes when building model prompts.

## 2. Rank content opportunities

Build seed topics from the approved offerings, common buyer questions, location and existing content gaps. Enrich them with existing Growth Brain signals when configured. Search Console impressions and positions represent the site's observed performance for the selected period. Community questions show how people describe a problem. Record the evidence source and date window for each opportunity. Keep demand marked as unknown when it has no evidence.

Compare each opportunity with existing CMS drafts and published pages using canonical URLs, titles, headings, target keywords and search intent. If a page already serves the same intent, propose updating that page. If the query has strong transactional intent and an existing service or category page fits it, propose strengthening that page. Create a new article when it serves a distinct reader need.

Rank candidates by business fit, fit with the reader's intent, the evidence the business can contribute, and available demand signals. Keep the ranking reasons visible. Each entry in `content-plan.json` should contain:

- Stable topic ID, suggested title, primary query and related phrases.
- Audience, market, search intent and recommended action.
- Existing page match, supporting evidence and demand status.
- Suggested outline, conversion target and relevant internal links.

**Illustrative example** · If theBOAT confirms payment gateway integration as a service, a candidate brief could target “how to choose a payment gateway in Sri Lanka,” with a buyer guide for e-commerce owners and a link to the relevant service page. Its search demand stays unknown until data is available.

## 3. Generate and save a draft

Export the selected brief, approved profile, brand rules and verified notes with `seo brief`. The active coding session reads that packet and writes a local article JSON matching its `articleShape` and limits. No separate model API call is made. The CLI cannot invoke this conversation; session writing must take place before importing or pushing an article. Require a clear answer to the reader's question, natural keyword usage, relevant internal links, and review flags for claims that still need evidence. Generate the title, slug, SEO title, meta description, article body and source notes. Apply the CMS field mapping and validate required fields before writing.

Save a local Markdown preview before contacting the CMS. Use an explicit CMS-write flag and a stable brand-and-topic key to upsert the same draft on retry. Record the returned CMS ID and preview URL, if available. If the slug is already published, report the conflict and route it through the editorial update workflow. Keep CMS writes in draft state for this workflow.

## Working local commands

Run from the repository root. Review the generated profile before passing `--approve-profile`; make durable corrections in `growth.config.json` under `seoGenie.profileOverrides`.

```bash
npm run growth -- seo check
npm run growth -- seo discover
npm run growth -- seo discover --approve-profile
npm run growth -- seo plan --limit 5
npm run growth -- seo brief --topic-id what-tasks-can-a-legal-assistant-handle

# After the coding session writes the local article JSON:
npm run growth -- seo draft --topic-id what-tasks-can-a-legal-assistant-handle
npm run growth -- seo push --topic-id what-tasks-can-a-legal-assistant-handle

# Validate and push an already saved article:
npm run growth -- seo draft --topic-id what-tasks-can-a-legal-assistant-handle --write-cms

# Import the supplied session-authored editorial draft:
npm run growth -- seo draft --topic-id what-tasks-can-a-legal-assistant-handle --article examples/seo/legal-assistant-tasks.json --write-cms

npm run test:seo
```

`seo check` verifies read access and reports credential presence. It cannot establish Editor permissions without a write. Add `SANITY_API_WRITE_TOKEN` with Editor access to `.env.local` for writes. Writing and research use the active coding session. No model-provider key is required. A missing CMS write key causes a clear error. `SANITY_API_READ_TOKEN` is never used for mutations.

Artifacts are stored under `.seo-genie/<brandId>/` and ignored by Git. Draft JSON, Markdown previews and receipts persist across failed writes. `seo push` reuses the existing article without another generation request. Random CMS IDs are saved in pending receipts before mutations; matching topic keys locate existing drafts across sequential runs. Revision guards protect writes from intervening edits. Use one writer per brand: the file lock coordinates local processes, not multiple machines. After a process crash, verify it has stopped before removing its stale `.lock` file.

The writer refuses published matches and unrelated drafts using the same slug. It does not publish, delete or schedule posts. To publish, review the draft and editorial notes in `/studio` and use Sanity's Publish action. Newly published posts are consumed by the existing frontend with a five-minute content revalidation interval. The deployed site must include this repository's blog routes to display them.

### Optional keyword evidence import

`npm run growth -- seo plan --signals /path/to/signals.json`

Input is a JSON array. Each accepted record must match the configured brand and exact normalized query, identify its source and date window, and include a nonnegative numeric metric. Impressions, clicks and position describe the supplied reporting period; they are not monthly search volume estimates.

```json
[
  {
    "brandId": "keel-talent",
    "query": "what tasks can a legal assistant handle",
    "source": "Search Console export",
    "periodStart": "2026-10-01",
    "periodEnd": "2026-10-31",
    "impressions": 25,
    "clicks": 2,
    "position": 18.5
  }
]
```

The metrics above illustrate the format; they are not actual research results. Plans and history remain scoped to the brand. There is no direct Search Console, community-search or keyword-volume API integration.

### Discovery limits

The bounded crawler reads server-rendered HTML and a flat sitemap, follows same-origin links, and excludes Studio and common asset URLs. It records missing sitemap/pages as warnings and continues with available evidence. It does not execute JavaScript, expand sitemap indexes, or provide a comprehensive technical SEO score. For client-rendered content, use a rendered HTML export with `--source-file`. Local crawl paths are mapped to the public origin. The current profile inference recognises this site's legal/compliance offerings; other brands should extend the inference and supply appropriate overrides and seeds.

## First implementation acceptance

Verification on 2026-11-21: nine automated tests pass, including a full CLI run using a session-authored article and simulated CMS and same-ID push retry. TypeScript and ESLint pass. A live public-site crawl and authenticated Sanity inventory read passed; the configured dataset contained zero posts. Five topic briefs and a local article/Markdown preview were created under `.seo-genie/keel-talent/`. After the write credential was configured locally, the live create-and-retry test passed: the article was created and verified, and a second push updated the same draft ID (`drafts.cc21bb28-2d41-4067-b442-1819dcbd1524`). The final authenticated inventory contained exactly one draft and zero published posts. The credential is stored in the ignored `.env.local` file and is not recorded in artifacts or documentation. No post has been published.

The production Webpack build (`npm run build -- --webpack`) passed with live CMS reads and page generation. Default Turbopack is blocked by this environment's CSS-worker port restriction. The blog reader now excludes raw CMS error objects from logs because those objects can contain authentication headers.

- One site produces a profile with evidence URLs and an editable audience, offering and market.
- Discovery reruns preserve the owner's overrides. Site artifacts and keyword history stay scoped to the brand.
- Planning produces up to five ranked opportunities and recommends an update when a page already serves the same intent.
- A selected brief creates a Markdown draft with usable SEO fields and internal links.
- With CMS credentials supplied, the explicit write creates one CMS draft. Repeating the command updates that draft without creating a duplicate.
- When Search Console is absent or the CMS write fails, the CLI reports the affected step and keeps the available local output.

The historical theBOAT SEO audit is a reference for technical reporting. Use the current crawler's measurements and scoring method when recording new audits.

## First publication

On 2026-11-21 the owner requested publication. The active coding session rewrote the article in a conversational voice, removed em dashes and updated the existing draft. Sanity’s revision-guarded publish action created published document `cc21bb28-2d41-4067-b442-1819dcbd1524` and removed its draft. The published content hash matched the reviewed draft. The regular SEO Genie CLI remains draft-only; this publication was an explicit owner-authorized action. The Webpack production build generated the article route successfully.
