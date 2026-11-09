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

## Verification and environment limits

Source syntax and local imports pass checks. A supplementary offline type contract check passed against cached React, Motion, Next.js, and the documented Base UI component APIs; it does not verify the installed Animate UI package.

The environment cannot resolve registry.npmjs.org, so dependency installation, the production build, and full runtime checks remain pending. Local HTTP server binding is sandbox-blocked, and browser policy rejects local file previews, so visual browser QA also remains pending. No deployment was performed.

Run the commands above in a network-enabled development environment to finish verification. Dependency tags for Animate UI, Base UI, and Motion resolve to their latest stable releases on first install.

## References

- [Next.js](https://nextjs.org/docs)
- [Animate UI](https://animate-ui.com/docs)
- [Animate UI tabs](https://animate-ui.com/docs/primitives/base-ui/tabs)
- [Animate UI accordion](https://animate-ui.com/docs/primitives/base-ui/accordion)
