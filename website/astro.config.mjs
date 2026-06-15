// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import rehypeExternalLinks from 'rehype-external-links';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';

/**
 * Turn inline-code endpoints written as `GET https://…` into color-coded
 * HTTP-method badges, so reference pages scan like a proper API doc.
 * Build-time (no client JS, no layout shift). Skips code inside <pre>.
 */
function rehypeApiMethods() {
  const METHODS = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(\S.*)$/;
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      for (const child of node.children) {
        const isInlineCode =
          child.type === 'element' &&
          child.tagName === 'code' &&
          node.tagName !== 'pre' &&
          child.children?.length === 1 &&
          child.children[0].type === 'text';
        if (isInlineCode) {
          const match = child.children[0].value.match(METHODS);
          if (match) {
            const [, method, rest] = match;
            child.properties = child.properties || {};
            child.properties.className = [
              ...(child.properties.className || []),
              'endpoint',
            ];
            child.children = [
              {
                type: 'element',
                tagName: 'span',
                properties: { className: ['endpoint-method', `method-${method.toLowerCase()}`] },
                children: [{ type: 'text', value: method }],
              },
              { type: 'text', value: ` ${rest}` },
            ];
            continue;
          }
        }
        walk(child);
      }
    };
    walk(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://dev.arcsite.com',
  // Color-code endpoints, then open external links in a new tab (with safe rel).
  markdown: {
    rehypePlugins: [
      rehypeApiMethods,
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
  integrations: [
    starlight({
      title: 'ArcSite API',
      description:
        'Documentation for the ArcSite API — an easy-to-use CAD app for sales and inspection professionals.',
      // Fail the build on broken internal links and heading anchors.
      plugins: [starlightLinksValidator()],
      logo: {
        src: './src/assets/logo.webp',
        alt: 'ArcSite',
        replacesTitle: true,
      },
      favicon: '/favicon.ico',
      social: [
        { icon: 'external', label: 'arcsite.com', href: 'https://www.arcsite.com' },
      ],
      components: {
        Footer: './src/components/Footer.astro',
      },
      head: [
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://dev.arcsite.com/og.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://dev.arcsite.com/og.png' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        // Starlight's header social links open in the same tab; make them open
        // in a new tab for consistency with the rest of the site's external links.
        {
          tag: 'script',
          content:
            "addEventListener('DOMContentLoaded',function(){document.querySelectorAll('a.sl-flex[href^=\"http\"]').forEach(function(a){if(!a.href.includes('dev.arcsite.com')){a.target='_blank';a.rel='noopener noreferrer';}});});",
        },
      ],
      customCss: [
        '@fontsource-variable/inter',
        '@fontsource-variable/jetbrains-mono',
        './src/styles/fonts.css',
        './src/styles/custom.css',
      ],
      expressiveCode: {
        plugins: [pluginCollapsibleSections()],
        styleOverrides: {
          borderRadius: '0.6rem',
          codeFontFamily: "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, monospace",
          codeFontSize: '0.85rem',
        },
      },
      lastUpdated: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Quickstart', slug: 'quickstart' },
            { label: 'Introduction', slug: 'introduction' },
            { label: 'Authentication', slug: 'authentication' },
            { label: 'Pagination', slug: 'pagination' },
          ],
        },
        {
          label: 'API Reference',
          items: [
            { label: 'Projects', slug: 'projects' },
            { label: 'Drawings', slug: 'drawings' },
            { label: 'Product Items', slug: 'product_items' },
            { label: 'Field Data', slug: 'field_data' },
            { label: 'Products', slug: 'products' },
            { label: 'Proposals', slug: 'proposals' },
          ],
        },
        {
          label: 'Events & Integrations',
          items: [
            { label: 'Webhooks', slug: 'webhooks' },
            { label: 'Integrations', slug: 'integrations' },
          ],
        },
        { label: 'Errors', slug: 'errors' },
      ],
    }),
  ],
});
