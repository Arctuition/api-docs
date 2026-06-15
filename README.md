# ArcSite API Docs

The documentation for the ArcSite public API, live at <https://dev.arcsite.com>.

Built with [Starlight](https://starlight.astro.build/) (Astro). The site —
content, theme, and config — lives in [`website/`](./website/).

## Getting started

```shell
cd website
npm install
npm run dev      # local dev server
npm run build    # static build to website/dist (also validates internal links)
npm run preview  # preview the production build
```

See [`website/README.md`](./website/README.md) for the maintainer guide
(adding pages, the code-tabs pattern, theming).

## Deployment

Pushing changes under `website/` to `master` triggers
[`.github/workflows/deploy-modern-docs.yml`](./.github/workflows/deploy-modern-docs.yml),
which builds the site and publishes it to the `gh-pages` branch. The custom
domain (`dev.arcsite.com`) is preserved via `website/public/CNAME`.

Pull requests that touch `website/` run a build + internal-link check via
[`.github/workflows/docs-ci.yml`](./.github/workflows/docs-ci.yml).
