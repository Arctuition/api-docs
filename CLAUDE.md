# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Documentation-only repo for the ArcSite public REST API, served at **dev.arcsite.com**.
It is a single [Astro](https://astro.build) + [Starlight](https://starlight.astro.build)
project **at the repo root** that builds to 100% static HTML. (The previous
Slate/Middleman site was removed after the cutover; it remains in git history.)

## Commands

```sh
pnpm install        # first time
pnpm dev            # dev server at http://localhost:4321
pnpm build          # static build to dist/
pnpm preview        # serve the built dist/ locally
```

There is no unit-test suite. **`pnpm build` is the correctness gate**: it fails on
broken internal links and missing heading anchors (via `starlight-links-validator`).
To check a single page, run the dev server and open it; there is no per-page build.

## Content model

- One Markdown/MDX file per page in `src/content/docs/`. `.md` for plain pages,
  `.mdx` for pages that need components (code tabs).
- Page titles come from frontmatter (`title`, `description`); Starlight renders the H1
  automatically — **do not add a `#` title** in the body.
- The sidebar / navigation is **hand-defined in `astro.config.mjs` (`sidebar`)**, not
  auto-generated. Adding a page means creating the file *and* adding it to `sidebar`.
- Callouts use `:::note` / `:::tip` / `:::caution` / `:::danger`.
- Images go in `public/images/...` and are referenced as `/images/...`.
- Cross-page links must be root-relative with the page path, e.g. `/projects/#create-project`
  (the build's link validator will fail the build on a bad target).

## Build-time conventions (the non-obvious parts)

These behaviors are wired in `astro.config.mjs` and `src/styles/custom.css`:

- **HTTP method badges** — a custom rehype plugin (`rehypeApiMethods` in `astro.config.mjs`)
  turns a paragraph containing a single inline code that starts with an HTTP verb, e.g.
  `` `GET https://api.arcsite.com/v1/projects` ``, into a color-coded badge. **Write every
  endpoint line in exactly that form** (lone inline code, `METHOD url`). Colors are defined
  by `.method-get|post|put|patch|delete` in `custom.css`.
- **Synced multi-language code tabs** — request examples use
  `<Tabs syncKey="lang">` + `<TabItem>` (cURL / JavaScript / Python). Requires `.mdx` and
  `import { Tabs, TabItem } from '@astrojs/starlight/components';` after the frontmatter.
  Keep JSX tags at column 0 and leave a blank line between `<TabItem>` and its code fence.
  **`src/content/docs/projects.mdx` is the gold-standard pattern to copy from.**
- **Collapsible long JSON** — add `collapse={start-end}` to a fenced code block's meta
  (line numbers are relative to the fence), e.g. ` ```json title="Response" collapse={8-33} `.
- **External links auto-open in a new tab** via `rehype-external-links` — do not add
  `target="_blank"` manually in markdown.
- **Internal links + anchors are validated at build** (`starlight-links-validator`).
- Theming is bespoke (no community theme): brand accent orange `#e3571c`, fonts Averta /
  Inter / JetBrains Mono (self-hosted via Fontsource + `src/styles/fonts.css`), all driven by
  CSS custom properties in `src/styles/custom.css`. The landing page is a custom component
  (`src/components/Landing.astro`); the footer is `src/components/Footer.astro`.

## Deploy & contribution flow

- **Deploy is automatic**: pushing to `master` triggers
  `.github/workflows/deploy-modern-docs.yml`, which builds the site and publishes `dist/` to
  the `gh-pages` branch. The custom domain is preserved by `public/CNAME` (copied to
  `dist/CNAME` on build).
- **Every PR** runs `.github/workflows/docs-ci.yml` (build + internal-link validation).
- This is a **fork-based** repo: `origin` is a personal fork, `upstream` is
  `Arctuition/api-docs`. Work on a branch, open a PR against `upstream:master`; merge commits
  follow a `publish:` subject prefix.

## Gotcha

Keep `.gitignore` minimal (`node_modules/`, `dist/`, `.astro/`, `.DS_Store`). **Never add an
unanchored `docs` ignore pattern** — it would silently match `src/content/docs/` and drop the
entire docs content collection from commits while local builds still pass (this bit the
project once during the Slate migration).
