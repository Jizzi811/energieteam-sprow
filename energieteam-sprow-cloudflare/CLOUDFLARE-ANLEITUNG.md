# EnergieTeam Sprow auf Cloudflare

## 1. Projekt zu GitHub hochladen

Den ZIP-Ordner entpacken. Im leeren Repository `Jizzi811/energieteam-sprow`
**Add file → Upload files** wählen und den gesamten entpackten Inhalt
hochladen. Danach unten **Commit changes** auswählen.

## 2. Worker aus GitHub erstellen

In Cloudflare **Workers & Pages → Create → Import a repository** öffnen und
`Jizzi811/energieteam-sprow` wählen.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Node.js: Version 22 oder neuer

Die erste Bereitstellung erzeugt eine kostenlose `workers.dev`-Adresse.

## 3. Datenbank und Fotospeicher

Für die vollständige Leadfunktion werden zwei Bindings benötigt:

- D1-Datenbank mit Binding `DB`
- R2-Bucket mit Binding `BUCKET`

In Cloudflare beim Worker unter **Settings → Bindings** beide Ressourcen
anlegen oder verbinden. Anschließend die SQL-Datei
`drizzle/0000_unusual_jetstream.sql` in der D1-Konsole ausführen.

Ohne diese beiden Bindings wird die Startseite angezeigt, neue Anfragen können
aber noch nicht gespeichert werden.

## 4. Dashboard schützen

Unter **Zero Trust → Access → Applications** eine selbst gehostete Anwendung
für `/dashboard*` und `/api/leads*` anlegen. Nur
`energieteam.sprow@gmail.com` zulassen. Cloudflare Access übergibt die
angemeldete E-Mail automatisch an das Dashboard.

## 5. Testen

1. Den öffentlichen Solar-Check vollständig ausfüllen.
2. Prüfen, ob der Lead in D1 gespeichert wird.
3. `/dashboard` öffnen und mit der freigegebenen E-Mail anmelden.
4. Optional ein Foto hochladen und im Lead öffnen.
