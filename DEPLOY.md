# Deployment — EnergieTeam Sprow Solar-Check (Cloudflare Workers)

This app is a `vinext` (Vite + Next.js) application that deploys to a
**Cloudflare Worker with Static Assets**. It needs a **D1** database (leads)
and an **R2** bucket (photos), plus **Cloudflare Access** to protect the
dashboard.

> The Worker name in the Cloudflare dashboard **must** match `name` in
> `wrangler.jsonc` (`energieteam-sprow`), otherwise Git builds fail.

## Prerequisites

- Node.js 22+ (`.node-version` pins 22 for Cloudflare Builds)
- `npm install` once locally if you run wrangler commands by hand

## 1. Create the D1 database and R2 bucket

```bash
npx wrangler d1 create energieteam-sprow-db        # prints a database_id
npx wrangler r2 bucket create energieteam-sprow-photos
```

Copy the printed `database_id` into `wrangler.jsonc`, replacing
`PLACEHOLDER_D1_DATABASE_ID`:

```jsonc
"d1_databases": [
  { "binding": "DB", "database_name": "energieteam-sprow-db",
    "database_id": "<the id from wrangler>" }
]
```

Then load the schema (creates the `leads` table):

```bash
npx wrangler d1 execute energieteam-sprow-db --remote \
  --file=drizzle/0000_unusual_jetstream.sql
```

Commit the updated `wrangler.jsonc`.

## 2. Deploy the Worker from GitHub

In the Cloudflare dashboard, open the existing **`energieteam-sprow`** Worker →
**Settings → Builds → Connect** and select this repository. Configure:

| Setting          | Value                 |
| ---------------- | --------------------- |
| Branch           | `main`                |
| Build command    | `npm run build`       |
| Deploy command   | `npx wrangler deploy` |
| Root directory   | *(repo root)*         |

Push to the build branch (or merge this PR to `main`) to trigger the build.
The deploy replaces the placeholder "Hello world" Worker with the real app.

D1 and R2 bind automatically from `wrangler.jsonc` during `wrangler deploy`.

### Local one-off deploy (alternative)

```bash
npm install
npm run build
npx wrangler deploy
```

## 3. Protect the dashboard with Cloudflare Access

The app reads the `cf-access-authenticated-user-email` header and only allows
`energieteam.sprow@gmail.com` into `/dashboard` and the lead API.

**Zero Trust → Access → Applications → Add** a self-hosted application:

- Path: your Worker domain, covering `/dashboard*` and `/api/leads*`
- Policy: **Allow** only `energieteam.sprow@gmail.com`

`wrangler.jsonc` already sets `CLOUDFLARE_DEPLOYMENT=true`, so sign-out uses
`/cdn-cgi/access/logout`.

## 4. Verify

1. Open the Worker URL — the public solar check renders.
2. Complete the check → a lead is written to D1.
3. Open `/dashboard`, sign in with the allowed email → the lead appears.
4. Upload a photo in the check → open it from the lead drawer (served from R2).

## Why the deploy failed before

`vite.config.ts` imports `./.openai/hosting.json`, but that file was missing
from the uploaded project, so `vinext build` aborted immediately and only the
default placeholder Worker was ever live. That file is now restored, and the
D1/R2 bindings (previously absent) are declared in `wrangler.jsonc`.
