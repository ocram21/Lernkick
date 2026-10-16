# LernKick

**Live-PWA:** [LernKick öffnen](https://ocram21.github.io/Lernkick/)

Mobile Lern-PWA für einen BvB-Reha-Piloten. Lernangebot mit 250 Fragen zur Vorbereitung auf den qualifizierten Hauptschulabschluss in Sachsen-Anhalt. **Keine offiziellen Prüfungsfragen, keine fachliche Freigabe.** Das Originalbriefing liegt in `docs/CODEX_BRIEF_LERN_PWA.md`.

## Lokal entwickeln

Node.js 22.12 oder neuer installieren, dann:

```sh
npm ci
npm run dev
```

Produktionsbuild und lokale Vorschau:

```sh
npm test
npm run build
npm run preview
```

App-Icons können nach Änderungen an `public/icon.svg` mit `node scripts/icons.mjs` neu erzeugt werden. Die Offline-Funktion wird im Produktionsbuild aktiviert. Die App muss zuerst einmal vollständig online geöffnet werden. Installation funktioniert über HTTPS oder localhost, je nach Browser über „App installieren“ bzw. „Zum Home-Bildschirm“. Lokale Schriftdateien und Inhalte werden mit zwischengespeichert.

## Funktionen

- Je 50 Fragen für Mathematik, Deutsch, Sozialkunde, Biologie und Geografie; zehn unterschiedliche Fragen pro Runde, zwei bis vier gemischte Antworten.
- Adaptive Lernrunde oder zufälliges freies Üben. Alle fünf Fächer sind spielbar.
- Leitner-Boxen: richtig beantwortete Fragen nach 1, 3, 7, 14, 30 Tagen; falsche nach 10 Minuten. Fällige Fragen haben Vorrang. Nach mindestens fünf Antworten wird die Schwierigkeit anhand der bisherigen Trefferquote eingeschätzt; das ist eine einfache Heuristik, kein diagnostisches Kompetenzmodell.
- Punkte pro Frage maximal einmal in 24 Stunden. Bestleistung pro Fach ist die höchste Rundenpunktzahl. Level wächst pro fünf gefestigten Fragen (Box 3 oder höher).
- IndexedDB für Fortschritt, Bestleistungen, Einstellungen und eigene Karten. Eigene Karten erstellen, bearbeiten, löschen und manuell umdrehen/wiederholen. Eigene Karten haben in dieser Version noch keine adaptive Terminplanung.
- Versionierter, validierter JSON-Export/Import. Import ersetzt nach Bestätigung den vorhandenen Stand und ist auf 5 MB / 2.000 eigene Karten begrenzt.
- Updates werden angezeigt und nur außerhalb einer laufenden Runde angeboten. Nutzerdaten bleiben unabhängig vom Service-Worker-Cache erhalten.

## Architektur und Inhalte pflegen

Die fünf JSON-Dateien unter `src/content/` enthalten je 50 versionierte Fragen samt Lehrplanquellen. `src/lib/schema.ts` validiert Fragen und Sicherungen. `engine.ts` hält Lernlogik getrennt von `storage.ts` und UI. `src/App.tsx` enthält die Oberflächen, `style.css` die gemeinsamen Tokens und Styles.

Jede Frage braucht eine dauerhafte `id`, `subject`, `topic`, `competency`, `difficulty` (1–3), `prompt`, 2–4 eindeutige `options`, `correct` als nullbasierten Index und eine verständliche `explanation`. IDs bei bloßen Textkorrekturen behalten; bei inhaltlich veränderter Frage neue IDs vergeben. Neue Inhaltsdateien in `src/content/index.ts` registrieren. Inhaltsformat 2 verwendet `status: practice`, eine Inhaltsrevision, Quellenmetadaten und pro Frage `curriculum` mit `sourceId`, `section` und `stage`. `reviewStatus: teacher-review-pending` macht die offene Freigabe ausdrücklich. Das alte Inhaltsformat 1 bleibt lesbar. Lernstände und Sicherungen behalten Datenversion 1.

Beispiel:

```json
{"id":"math-051","subject":"math","topic":"einmaleins","competency":"einmaleins","difficulty":1,"prompt":"Wie viel ist 3 × 4?","options":["7","12","16"],"correct":1,"explanation":"3 × 4 = 4 + 4 + 4 = 12.","curriculum":{"sourceId":"lsa-math-2019","section":"3.2","stage":"foundation"}}
```

Aktuell sichern Tests exakt 50 Fragen pro Fach. Bei bewusstem Ausbau die Sollzahl anpassen. Für Runden werden mindestens zehn Fragen benötigt. Build und Tests ausführen. Fehlerhafte Inhalte brechen die Validierung ab. Erweiterungen des Datenformats müssen die aktuelle Sicherungsversion weiterhin lesen oder eine explizite Migration anbieten; keine stille Löschung alter Daten.

## GitHub Pages

Die Workflow-Datei `.github/workflows/pages.yml` prüft Pull Requests und baut bei Push auf `main`. Veröffentlichen erfolgt ausdrücklich manuell über **Actions → Build, test and deploy LernKick → Run workflow → publish**. Im Ziel-Repository unter **Settings → Pages → Source → GitHub Actions** aktivieren. Ziel-Repository: [ocram21/Lernkick](https://github.com/ocram21/Lernkick), auf ausdrückliche Bestätigung des Nutzers öffentlich gestellt. GitHub Pages muss für Repository-Sichtbarkeit und Kontotarif verfügbar sein.

Der Workflow setzt automatisch `BASE_PATH=/<Repositoryname>/`; bei `<Owner>.github.io` wird `/` verwendet. Für eine eigene Domain die Repository-Variable `BASE_PATH=/` setzen und die Domain in Pages konfigurieren. Manifest, Assets und Service-Worker-Scope folgen diesem Pfad. Lokal einen Unterpfad prüfen:

```sh
BASE_PATH=/Lernkick/ npm run build
npm run preview
```

Referenzen: [Vite: GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages), [Vite PWA: Update-Hinweise](https://vite-pwa-org.netlify.app/guide/prompt-for-update).

## Prüfung

`node scripts/export-questions.mjs` aktualisiert den lesbaren Fragenkatalog nach Inhaltsänderungen.

`npm test` prüft 50 Fragen je Fach, gültige Quellenbezüge, alle Schwierigkeitsstufen, Inhaltsvalidierung, zehn eindeutige Fragen, leichte Einstiegsfragen, Wiederholungsfristen, adaptive Schwierigkeit, Punktebegrenzung und ungültige Imports. `npm run build` führt die TypeScript-Prüfung aus und generiert den Workbox-Service-Worker.

Für Browserprüfungen ist `tests/pwa.spec.ts` vorgesehen. Nach Browserinstallation `npx playwright test` ausführen. Geprüft werden komplette Runden, Neustart mit gespeicherten Daten, eigene Karten und Offline-Neuladen. Manuell zusätzlich echte Android-/iOS-Installation, Update einer zuvor installierten Version während einer Runde und Nutzung mit der Pilotklasse prüfen. Diese Tests ersetzen keine fachliche Abnahme.

## Offene Entscheidungen und Grenzen

- Betreiberangaben fehlen noch. Die PWA ist unter https://ocram21.github.io/Lernkick/ veröffentlicht.
- Offizielle Lehrplanquellen und Fachhinweise wurden recherchiert; siehe [Recherche Sachsen-Anhalt](docs/ANFORDERUNGEN-SACHSEN-ANHALT.md). Der konkrete Prüfungsweg der BvB-Reha-Gruppe und die Freigabe durch Fachlehrkräfte bleiben offen. Alle 250 Aufgaben mit Lösungen: [Fragenkatalog](docs/FRAGENKATALOG.md).
- Keine Konten, Tracker oder zentralen Schülerdaten. Hosting-Logs sowie Betreiber-/Datenschutzhinweise vor öffentlichem Einsatz gesondert prüfen.
- Browserdaten sind an Origin und Browserprofil gebunden; bei Domainwechsel exportieren/importieren. Entfernte Browserdaten können nur aus einer vorherigen Sicherung wiederhergestellt werden. Andere Apps derselben Origin teilen deren Speicherumgebung; eigene Domain empfohlen.
- App-interne Navigation verwendet keine Serverrouten; Deep Links sind nicht implementiert. Angebrochene Runden werden nach Neuladen nicht fortgesetzt, bereits beantwortete Fragen bleiben gespeichert.
