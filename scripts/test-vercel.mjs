import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { GET } from '../api/results.js';
import worker from '../worker/index.js';

execFileSync(process.execPath, ['scripts/build-vercel.mjs'], { stdio: 'inherit' });
const html = await readFile('public/index.html', 'utf8');
assert.match(html, /Eddie's Keno Data!/);
assert.match(html, /fetch\('\/api\/results\?date='/);
for (const name of ['brand-art.jpg', 'venmo-qr.jpg', 'keno-background.png']) {
  const expected = await worker.fetch(new Request('https://test/' + name));
  assert.deepEqual(await readFile('public/' + name), Buffer.from(await expected.arrayBuffer()));
}
assert.equal((await GET(new Request('https://test/api/results?date=bad'))).status, 400);
const originalFetch = globalThis.fetch;
try {
  const numbers = Array.from({ length: 20 }, (_, i) => i + 1);
  globalThis.fetch = async url => {
    assert.match(String(url), /startDate=2026-11-13&endDate=2026-11-13/);
    return Response.json({ draws: [{ drawNumber: 123, winningNumbers: numbers, bonus: 3 }] });
  };
  const response = await GET(new Request('https://test/api/results?date=2026-11-13'));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).draws[0].id, 123);
  globalThis.fetch = async () => { throw new Error('offline'); };
  assert.equal((await GET(new Request('https://test/api/results?date=2026-11-13'))).status, 502);
} finally { globalThis.fetch = originalFetch; }
console.log('Passed: Vercel static build, exact image bytes, API validation, results, and upstream outage.');
