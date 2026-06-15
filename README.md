# ArcSite API Docs

Documentation for the ArcSite public API, live at <https://dev.arcsite.com>.

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build).
Output is 100% static HTML, deployed to GitHub Pages.

## Local development

```sh
npm install      # first time only
npm run dev      # http://localhost:4321
npm run build    # static output → dist/ (also validates internal links & anchors)
npm run preview  # serve the built dist/ locally
```

## Project layout

```
src/
  content/docs/        # one Markdown/MDX file per page (the docs content)
    index.mdx          # landing page (custom Landing.astro hero)
    quickstart.mdx     # getting-started walkthrough
    projects.mdx       # API reference pages (.mdx where code tabs are used)
    ...
  components/          # Landing.astro (hero), Footer.astro
  styles/custom.css    # bespoke theme (brand orange #e3571c) + conventions
  styles/fonts.css     # @font-face for Averta (self-hosted)
public/
  images/              # screenshots referenced as /images/... in docs
  CNAME                # dev.arcsite.com (copied to dist/ on build)
astro.config.mjs       # site config, sidebar (nav), and the docs-specific
                       # rehype/Expressive-Code plugins
```

## Editing the docs

- **Edit a page:** change the matching file in `src/content/docs/`. Each page starts with
  frontmatter (`title`, `description`); Starlight renders the title as the H1 — don't add a
  `#` title.
- **Add a page:** create `src/content/docs/<name>.md(x)`, then add it to the `sidebar` array
  in `astro.config.mjs`.
- **Endpoints:** write each as a lone inline-code line, e.g.
  `` `GET https://api.arcsite.com/v1/projects` `` — this auto-renders as a color-coded HTTP
  method badge.
- **Callouts:** `:::note` / `:::tip` / `:::caution` / `:::danger`.
- **Multi-language request tabs:** use `<Tabs syncKey="lang">` + `<TabItem>` for
  cURL / JavaScript / Python (file must be `.mdx`; import the components after the
  frontmatter). `projects.mdx` is the reference to copy from — keep JSX tags at column 0 and
  leave a blank line between an opening `<TabItem>` and its code fence.
- **Collapse long JSON:** add `collapse={start-end}` to a fenced block's meta line.
- **Images:** drop the file in `public/images/...` and reference it as `![alt](/images/...)`.
- Search (Pagefind) and the right-hand "On this page" TOC are generated automatically.

## Deployment

Pushing to `master` triggers `.github/workflows/deploy-modern-docs.yml`, which builds the
site and publishes `dist/` to the `gh-pages` branch (serving `dev.arcsite.com`). Every PR
runs `.github/workflows/docs-ci.yml` (build + internal-link validation).
