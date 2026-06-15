# ArcSite API Docs — Starlight

Modern rebuild of the ArcSite API documentation, replacing the legacy Slate
site. Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build).
Output is 100% static HTML, deployable to GitHub Pages (custom domain
`dev.arcsite.com`) just like the old Slate site.

## Local development

```sh
npm install      # first time only
npm run dev      # http://localhost:4321
npm run build    # static output → dist/
npm run preview  # serve the built dist/ locally
```

## Project layout

```
src/
  content/docs/        # one Markdown/MDX file per page (the docs content)
    index.mdx          # landing page (hero + cards)
    introduction.md
    authentication.md
    pagination.md
    projects.md        # API reference pages
    drawings.md
    ...
  styles/custom.css    # ArcSite brand accent (blue) + tweaks
  assets/logo.webp     # top-bar logo
public/
  images/              # screenshots referenced as /images/... in docs
  favicon.ico
  CNAME                # dev.arcsite.com (copied to dist/ on build)
astro.config.mjs       # site title, logo, and the SIDEBAR (nav structure)
```

## Editing the docs

- **Edit a page:** change the matching file in `src/content/docs/`. Each page
  starts with frontmatter (`title`, `description`); Starlight renders the title
  as the H1 automatically — don't add your own `#` title.
- **Add a page:** create `src/content/docs/<name>.md`, then add it to the
  `sidebar` array in `astro.config.mjs`.
- **Callouts:** use `:::note`, `:::tip`, `:::caution`, `:::danger` (these
  replace the old Slate `<aside>` blocks).
- **Code examples:** fenced blocks support titles, e.g.
  ` ```json title="Response" `.
- **Multi-language request tabs:** API request examples use synced
  cURL / JavaScript / Python tabs. The file must be `.mdx`, and it imports the
  components once after the frontmatter:
  `import { Tabs, TabItem } from '@astrojs/starlight/components';`
  Then wrap the example like this (the `syncKey="lang"` makes every tab group on
  the site switch language together when the reader picks one):

  ```mdx
  <Tabs syncKey="lang">
  <TabItem label="cURL">

  ```shell
  curl ...
  ```

  </TabItem>
  <TabItem label="JavaScript"> ... </TabItem>
  <TabItem label="Python"> ... </TabItem>
  </Tabs>
  ```

  Keep the JSX tags at column 0 and leave a blank line between an opening
  `<TabItem>` and its code fence. `projects.mdx` is the reference to copy from.
- **Images:** drop the file in `public/images/...` and reference it as
  `![alt](/images/...)`.
- **Search** (Pagefind) and the right-hand "On this page" TOC are generated
  automatically from headings — no config needed.

## Deployment

A manual-trigger workflow lives at
`.github/workflows/deploy-modern-docs.yml`. It builds this directory and
publishes `dist/` to the `gh-pages` branch. See the comments at the top of that
file for the steps to cut over from the legacy Slate deploy.
