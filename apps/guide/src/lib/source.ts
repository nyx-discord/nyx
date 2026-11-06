import { docs } from 'collections/server';
import { loader, llms } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
  // it assigns a URL to your pages
  baseUrl: '/',
  icon(icon) {
    if (icon && icon in icons)
      return createElement(icons[icon as keyof typeof icons]);
  },
  source: docs.toFumadocsSource(),
});

export const docsLlms = llms(source, {
  // Link the Markdown version of each page (`/use.md`, root → `/index.md`).
  renderUrl: (node) => `${node.url === '/' ? '/index' : node.url}.md`,
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
