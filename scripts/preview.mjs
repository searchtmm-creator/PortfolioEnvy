import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = resolve('dist');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(400).end(); return; }
    let info;
    try {
      info = await stat(file);
      if (info.isDirectory()) {
        if (!pathname.endsWith('/')) { res.writeHead(308, { Location: `${pathname}/${new URL(req.url, 'http://localhost').search}` }).end(); return; }
        file = resolve(file, 'index.html'); info = await stat(file);
      }
    } catch { file = resolve(root, '404.html'); info = await stat(file); res.statusCode = 404; }
    const headers = { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Accept-Ranges': 'bytes' };
    const match = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    let start = 0, end = info.size - 1;
    if (match && res.statusCode !== 404) {
      start = Number(match[1]); end = match[2] ? Math.min(Number(match[2]), end) : end;
      if (start > end) { res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end(); return; }
      res.statusCode = 206; headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
    }
    headers['Content-Length'] = end - start + 1;
    res.writeHead(res.statusCode, headers);
    if (req.method === 'HEAD') res.end(); else createReadStream(file, { start, end }).pipe(res);
  } catch { res.writeHead(500).end('Preview unavailable. Run npm run build first.'); }
});
server.listen(Number(process.env.PORT ?? 4173), '127.0.0.1', () => console.log(`Portfolio preview: http://127.0.0.1:${process.env.PORT ?? 4173}`));
