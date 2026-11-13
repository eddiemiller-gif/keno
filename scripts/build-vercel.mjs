import { mkdir, writeFile } from 'node:fs/promises';
import worker from '../worker/index.js';

// Render static assets from the existing source without requesting lottery data.
await mkdir('public', { recursive: true });
for (const [route, filename] of [['/', 'index.html'], ['/brand-art.jpg', 'brand-art.jpg'], ['/venmo-qr.jpg', 'venmo-qr.jpg'], ['/keno-background.png', 'keno-background.png']]) {
  const response = await worker.fetch(new Request('https://build.local' + route));
  if (!response.ok) throw new Error('Could not build ' + route);
  await writeFile('public/' + filename, Buffer.from(await response.arrayBuffer()));
}
console.log('Built Vercel static page and images in public/.');
