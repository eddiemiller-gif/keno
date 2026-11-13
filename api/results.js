import worker from '../worker/index.js';

// Reuse the same API implementation so both hosts validate results identically.
export function GET(request) {
  const url = new URL(request.url);
  url.pathname = '/api/results';
  return worker.fetch(new Request(url, { method: 'GET' }));
}
