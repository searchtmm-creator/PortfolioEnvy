import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { paths } from '../dist-ssr/entry-server.js';

const expectedHost = 'https://www.sergioalzate.com';
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
for (const path of paths) {
  const file = path === '/' ? 'dist/index.html' : path === '/404.html' ? 'dist/404.html' : join('dist', path, 'index.html');
  const html = await readFile(file, 'utf8');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `One primary heading: ${path}`);
  assert.ok(html.includes(`<link rel="canonical" href="${expectedHost}${path}">`), `Canonical: ${path}`);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<meta name="description" content="[^"<>]+">/);
  assert.match(html, /Best Ads on TV|Page not found/);
  assert.ok(!html.includes('Best Ads of TV'));
  assert.ok(!html.includes('19 PROJECTS'));
  assert.ok(!html.includes('<!--app-html-->'));
  for (const match of html.matchAll(/(?:src|poster)="(\/assets\/[^"<>]+)"/g)) {
    await stat(join('dist', decodeURIComponent(match[1]).replace(/&amp;/g, '&')));
  }
  if (path === '/404.html') assert.match(html, /noindex, follow/);
  else {
    assert.ok(sitemap.includes(`<loc>${expectedHost}${path}</loc>`));
    const schema = JSON.parse(html.match(/<script id="portfolio-schema" type="application\/ld\+json">([^<]+)<\/script>/)[1]);
    assert.equal(schema['@graph'][0].name, 'Sergio Alzate');
    if (path !== '/') {
      assert.equal(schema['@graph'][1]['@type'], 'CreativeWork');
      assert.equal(schema['@graph'][1].url, expectedHost + path);
      assert.match(html, /About this project/);
    }
  }
}
const robots = await readFile('dist/robots.txt', 'utf8');
assert.match(robots, /User-agent: \*/);
assert.ok(robots.includes(`Sitemap: ${expectedHost}/sitemap.xml`));
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
assert.ok(!config.rewrites?.some(rule => rule.source.includes('(.*)')), 'No catch-all rewrite');
assert.equal(config.outputDirectory, 'dist');
const assets = await readdir('dist/assets');
assert.ok(!assets.some(file => file.endsWith('.gif')), 'No GIF payload in production');
const main = assets.find(file => /^index-.*\.js$/.test(file));
const script = await readFile(join('dist/assets', main), 'utf8');
assert.ok(!script.includes('face_landmarker.task'), 'No facial model initialization in main bundle');
assert.ok((await stat(join('dist/assets', main))).size < 500_000, 'Initial JS under 500 KB');
assert.ok(assets.some(file => /^EnvyEngine-.*\.js$/.test(file)), 'Vision engine has a separate chunk');
console.log(`PASS: ${paths.length} prerendered pages, metadata, structured data, asset URLs, sitemap, robots, 404 configuration and deferred vision engine.`);
