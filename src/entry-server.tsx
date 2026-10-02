import { renderToString } from 'react-dom/server';
import App from './App';
import { projects } from './data/portfolio';
import { getPageMetadata, projectPath } from './services/seo';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
export const paths = ['/', ...projects.map(projectPath), '/404.html'];
export function render(pathname: string) {
  const page = getPageMetadata(pathname);
  const head = `<title>${escapeHtml(page.title)}</title>
<link rel="canonical" href="${page.url}">
<meta name="description" content="${escapeHtml(page.description)}">
<meta name="robots" content="${page.noindex ? 'noindex, follow' : 'index, follow'}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
${Object.entries({ title: page.title, description: page.description, url: page.url, image: page.image }).map(([key, value]) => `<meta property="og:${key}" content="${escapeHtml(value)}"><meta name="twitter:${key}" content="${escapeHtml(value)}">`).join('\n')}
${page.noindex ? '' : `<script id="portfolio-schema" type="application/ld+json">${JSON.stringify(page.schema).replace(/</g, '\\u003c')}</script>`}`;
  return { html: renderToString(<App initialPath={pathname} />), head };
}
