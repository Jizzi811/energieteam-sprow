# EnergieTeam Sprow – Solar-Check

Premium-Landingpage und Leadgenerator für Balkonkraftwerke.

## Funktionen

- animierter responsiver Premium-Header
- siebenstufiger Balkonkraftwerk-Check
- Lead-Scoring und persönliche Eignungsbewertung
- dauerhafte Lead-Speicherung mit Cloudflare D1
- Foto-Upload mit Cloudflare R2
- geschütztes Lead-Dashboard mit Statusverwaltung

## Cloudflare Build

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- Node.js: Version 22 oder neuer

Nach dem ersten erfolgreichen Deployment werden eine D1-Datenbank mit Binding
`DB` und ein R2-Bucket mit Binding `BUCKET` verbunden. Die Migration liegt in
`drizzle/0000_unusual_jetstream.sql`.
