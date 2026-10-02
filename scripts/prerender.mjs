import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { paths, render } from '../dist-ssr/entry-server.js';
const template = await readFile('dist/index.html', 'utf8');
for (const path of paths) {
  const { html, head } = render(path);
  const document = template.replace('<!--page-head-->', head).replace('<!--app-html-->', html);
  const destination = path === '/' ? 'dist/index.html' : path === '/404.html' ? 'dist/404.html' : join('dist', path, 'index.html');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, document);
}
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.filter(path => path !== '/404.html').map(path => `  <url><loc>https://www.sergioalzate.com${path}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Prerendered ${paths.length} pages and generated sitemap.xml.`);
