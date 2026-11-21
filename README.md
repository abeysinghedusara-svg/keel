# Keel Talent

A responsive Next.js App Router website based on `Keel Talent Home.html`, with Animate UI and Motion. The original HTML is preserved as the design and content reference.

## Run

Requires Node.js 20.9+ and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000.

```sh
npm run typecheck
npm run lint
npm run build
npm start
```

Commit the generated `package-lock.json` after the first successful installation.

## Design and interactions

- Navy, ivory, brass, and sage palette, with the supplied logo and locally hosted Geist and Instrument Serif fonts.
- Responsive navigation, service tabs, and FAQ accordion. Tabs and accordion use Animate UI’s Base UI primitives.
- A short branded opening animation, plus a Next.js route loading state.
- Four process illustrations: a discovery conversation, candidate selection, tool onboarding, and daily updates. Each animates when it enters the viewport and includes a replay button.
- System reduced motion preferences are respected. Hero movement finishes after the opening sequence; process illustrations do not loop.
- Contact form validates input and opens an email draft addressed to the supplied business email. It explicitly tells visitors to send from their email app. There is no backend submission service or booking calendar connected.

## Edit

- `app/page.tsx`: page composition and editorial content.
- `lib/content.ts`: services, process steps, navigation, and FAQs.
- `components/process.tsx`: animated process illustrations.
- `components/contact-form.tsx`: email enquiry workflow.
- `app/globals.css`: responsive layout, typography, palette, and loading animation.
- `public/brand`: assets extracted from the supplied HTML.

## Blog and Sanity

- Open `/studio` to create authors, categories, and posts.
- Published posts with a title, slug, publication date, and body appear at `/blog` and `/blog/[slug]`.
- The frontend queries the published perspective and refreshes Sanity content every five minutes. Draft posts stay hidden.
- Set the `NEXT_PUBLIC_SANITY_*` values from `.env.example` in Netlify for deployed pages and Studio.
- The configured dataset is expected to allow public read access. If you make it private, add a read-only `SANITY_API_READ_TOKEN` to the server environment; never prefix that token with `NEXT_PUBLIC_`.

## SEO Genie CLI

The discovery, keyword-planning and Sanity draft-push workflow is documented in [SEO_GENIE_IMPLEMENTATION.md](SEO_GENIE_IMPLEMENTATION.md). Start with `npm run growth -- seo check`, then discovery and planning. `npm run growth -- seo brief --topic-id <id>` prepares context for this coding session to write an article locally. `npm run growth -- seo draft --topic-id <id> --article <file> --write-cms` validates and pushes that article. `seo push --topic-id <id>` retries a saved article without generating it again.

Use `SANITY_API_WRITE_TOKEN` for Editor access; add it to `.env.local` without a `NEXT_PUBLIC_` prefix. Article writing and research happen in the active coding session. No separate model API key or model API request is used. Keyword seeds are hypotheses; dated keyword metrics can be imported. Posts stay unpublished for Studio review. No recurring schedule is installed. Run `npm run test:seo` for the CLI's unit and integration checks.

## Verification and environment limits

On 2026-11-21, `npm run typecheck`, `npm run lint` and all nine SEO CLI tests passed. Authenticated live Sanity reads and public-site discovery also passed. A local article and Markdown preview were created. The session-authored article was pushed to live Sanity and read back successfully. Repeating the push updated the same draft ID; final inventory was one draft and zero published posts. The CLI does not independently start a coding session or schedule article writing.

The default Turbopack production build hits an environment restriction while binding its CSS worker to a local port, including on an escalated retry. No deployment or visual browser QA was performed for the CLI work.

The Webpack fallback (`npm run build -- --webpack`) passed with network access, including Sanity-backed page generation. Its sandbox run could not resolve Sanity during prerendering; use network access when building against the live CMS. CMS error logging excludes raw request objects to keep authentication headers out of logs.

Dependency tags for Animate UI, Base UI, and Motion resolve to their latest stable releases on first install.

## References

- [Next.js](https://nextjs.org/docs)
- [Animate UI](https://animate-ui.com/docs)
- [Animate UI tabs](https://animate-ui.com/docs/primitives/base-ui/tabs)
- [Animate UI accordion](https://animate-ui.com/docs/primitives/base-ui/accordion)

## Published journal

The blog uses the homepage header, footer, fonts and palette. On 2026-11-21, the revised article “What tasks can a legal assistant handle?” was published in Sanity and verified without em dashes. A production Webpack build generated `/blog` and `/blog/what-tasks-can-a-legal-assistant-handle`. The current public domain is on Netlify; deploying the repository update there requires hosting access.
