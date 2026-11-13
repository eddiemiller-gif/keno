# Eddie's Keno Data

A Massachusetts Keno dashboard with game-count filters, heat maps, bonus frequencies, number matching, and automatic refresh. No API key or database is required.

## Deploy with GitHub and Vercel

1. Create a GitHub repository and upload the contents of this project (not its parent TSDCirro repository). Include `api/`, `worker/`, `scripts/`, `package.json`, `vercel.json`, and `.gitignore`. The images are already embedded in `worker/index.js`.
2. In Vercel, choose **Add New → Project**, connect GitHub, and import the repository.
3. Leave the root directory at the repository root. If you intentionally use a monorepo, select the directory containing this package.json instead.
4. Use framework preset **Other**. The checked-in vercel.json supplies the build command and output directory. Use Node.js 22.x.
5. Deploy. No environment variables are needed. Vercel serves the generated page and images and runs `/api/results` as a server-side function.
6. Check `/`, both images, and `/api/results?date=YYYY-MM-DD` with today's Eastern date. Confirm the dashboard loads results, the filter changes counts, and number search works.

Subsequent pushes to the connected production branch deploy through Vercel's Git integration. GitHub stores the source; GitHub Pages alone cannot run the API function.

Do not upload `.git/`, `.openai/`, `.vercel/`, `outputs/`, `node_modules/`, or generated `public/` and `dist/` folders. The supplied GitHub ZIP excludes these. Keep the existing local Git remote unchanged unless you deliberately want to replace its Sites connection.

## Local checks

Install Node.js 22, then run:

```powershell
npm test
npm run build
```

To preview the page together with the API, run `npx vercel dev` and follow Vercel's sign-in/project prompts. A static file server cannot run the results API.

## Existing Sites / Cloudflare build

The existing deployment uses `worker/index.js`. Continue building it with `npm run build:worker` and validating with `npm run validate`. Vercel support does not change the running Sites deployment.

The Vercel build renders the page and images from that same Worker source; `api/results.js` reuses its API handler. Edit `worker/index.js` to change the shared dashboard.

## Data

The server fetches the public Mass Lottery results feed. Feed outages appear as errors in the dashboard. Numbers and bonus frequencies describe past results and do not predict future draws.
