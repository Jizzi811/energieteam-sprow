# EnergieTeam Sprow – Solar-Check

Premium-Landingpage und Leadgenerator für Balkonkraftwerke.

## Funktionen

- animierter, responsiver Premium-Header
- siebenstufiger Balkonkraftwerk-Check
- persönliche Eignungsbewertung
- dauerhafte Lead-Speicherung mit Cloudflare D1
- Foto-Upload mit Cloudflare R2
- geschütztes Lead-Dashboard
- Statusverwaltung für neue Leads, Kontakte, Angebote und Abschlüsse

## Lokale Entwicklung

Voraussetzung: Node.js 22 oder neuer.

```bash
npm ci
npm run dev
```

## Cloudflare

Die vollständige Einrichtung steht in
[CLOUDFLARE-ANLEITUNG.md](./CLOUDFLARE-ANLEITUNG.md).

Build:

```bash
npm run build
```

Deployment:

```bash
npx wrangler deploy
```
