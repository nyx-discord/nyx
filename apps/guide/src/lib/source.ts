import { docs } from 'collections/server';
import { loader, llms } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import { absoluteUrl } from './site';

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

/** URL of a page's Markdown version (`/use` → `.../use.md`, root → `.../index.md`), absolute so agents can fetch it. */
export function markdownUrl(url: string): string {
  return absoluteUrl(`${url === '/' ? '/index' : url}.md`);
}

export const docsLlms = llms(source, {
  renderUrl: (node) => markdownUrl(node.url),
  renderPage: async (page) => `# ${page.data.title} (${absoluteUrl(page.url)})

${await page.data.getText('processed')}`,
});
