# LernKick

**Live-PWA:** [LernKick öffnen](https://ocram21.github.io/Lernkick/)

Mobile Lern-PWA für einen BvB-Reha-Piloten. Lernangebot mit 500 redaktionellen Fragen und einem adaptiven Mathe-Piloten mit zusätzlichen generierten Aufgaben zur Vorbereitung auf den qualifizierten Hauptschulabschluss in Sachsen-Anhalt. **Keine offiziellen Prüfungsfragen, keine fachliche Freigabe.** Das Originalbriefing liegt in `docs/CODEX_BRIEF_LERN_PWA.md`.

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

Die Startseite passt auf geprüfte Handygrößen ab 320×568 ohne Scrollen. Alle fünf Fächer als quadratische Buttons (MA, D, SK, Bio, Geo), Lernmodus und Hauptnavigation bleiben sichtbar. Zurückpfeil und Logo fragen während einer Runde mit „Weiterlernen“ / „Runde verlassen“ nach; die Automatik pausiert im Dialog. Eine kurze Bedienhilfe erklärt Lernformen und Installation. Technische Hintergründe stehen in dieser README und im [Pilotkonzept](docs/MATHE-PILOT.md).

- Je 100 Fragen für Mathematik, Deutsch, Sozialkunde, Biologie und Geografie; zehn unterschiedliche Fragen pro Runde, zwei bis vier gemischte Antworten.
- Drei Lernformen auf der Startseite: Deine Lernrunde, Freies Üben und Meine Karten. Danach startet ein Fachbutton die gewählte Lernform. Ein eigener Wortschatz-Einstieg bietet 25 Alltagswörter mit Auswahlantworten sowie bearbeitbare eigene Einträge.
- Mathe-Lernpfad mit 35 kleinen Kompetenzen, Voraussetzungen, sieben deterministischen Generatorarten und drei Aufgabenstufen. Nach Fehlern passende Unterstützung, anschließend eine neue Herausforderung derselben ursprünglichen Stufe. Kompetenzeinschätzung aus mehreren Beobachtungen statt fachweiter Trefferquote. Grenzwerte, Rückfragen und Fallbacks: [Mathe-Pilot](docs/MATHE-PILOT.md).
- Hinweis → Beispiel → Lösungserklärung; optionale Zahlenstrahl-/Punktefeld-Hilfe. Unter „Lernweg“ jederzeit leichter, passend, anspruchsvoller oder anders erklären lassen. Keine Zeitmessung und keine Minuspunkte.
- Leitner-Boxen bleiben für Bestandsfragen erhalten: 1, 3, 7, 14, 30 Tage bei richtigen Antworten, 10 Minuten nach Fehlern. In den anderen vier Fächern bleibt die bisherige Auswahlheuristik bestehen. Ihre neuen Kompetenzbäume sind ein späterer Schritt.
- Punkte für Bestandsfragen maximal einmal pro Frage und 24 Stunden, für Generatoren einmal pro Kompetenz und 24 Stunden. Bestleistungen bleiben erhalten. Veränderliche Kompetenzzustände ersetzen die globale Level-Zahl.
- „Fortschritt“ zeigt auf einer Bildschirmhöhe ausschließlich die Fachauswahl (MA, D, SK, Bio, Geo) und das ausgewählte Fortschrittsbild. Erklärtexte, Zähler, Kompetenzliste und Bestleistungen werden dort nicht angezeigt; gespeicherte Bestleistungen bleiben in Sicherungen erhalten. Die fünf Bildwelten verwenden weiterhin neutrale Platzhalter. Freigeschaltete Segmente bleiben bei Fehlern erhalten; Motive sind unabhängig von gespeicherten Meilensteinen austauschbar.
- IndexedDB für Fortschritt, Bestleistungen, Einstellungen und eigene Karten. 75 Standardkarten (15 je Fach) und eigene Karten erstellen, bearbeiten, löschen und wiederholen. Nach dem Aufdecken steuern „Gewusst“ / „Noch üben“ die Wiederholungsfristen (1/3/7/14/30 Tage bzw. zehn Minuten). Wiederherstellen blendet entfernte Standardkarten wieder ein und bewahrt persönliche Bearbeitungen und eigene Karten. Selbstbewertungen schalten keine Bildteile frei.
- Versionierter, validierter JSON-Export/Import. Import ersetzt nach Bestätigung den vorhandenen Lernstand und die Karten; bereits freigelegte Bildteile bleiben erhalten. Der Import ist auf 5 MB / 2.000 eigene Karten begrenzt.
- Rechts neben dem Logo auf der Fächerauswahl steht „App aktualisieren“. Er prüft online auf eine neue Version, wartet auf den vollständigen Download und lädt die App nach dem Versionswechsel neu. Meldungen unterscheiden aktuell, offline und Fehler. Während der Prüfung kann keine Lernrunde gestartet werden. Nutzerdaten bleiben unabhängig vom Service-Worker-Cache erhalten.
- Nach einer richtigen Antwort sind Lösung und Erklärung drei Sekunden sichtbar; danach geht die Runde automatisch weiter. Nach einer falschen Antwort bleibt die Erklärung ohne Timer stehen und die nächste Frage wird ausschließlich manuell geöffnet. „Anhalten“ gibt mehr Lesezeit, „Automatisch weiter“ startet die drei Sekunden neu. Manuelles Weitergehen ist ebenfalls möglich.

Für ein neues Fortschrittsfeld werden je Fach mindestens vier von fünf verschiedenen Aufgaben ohne Hilfe richtig beantwortet. Dieselbe Aufgabensignatur zählt innerhalb von 24 Stunden nicht erneut; nach Freigabe beginnt ein neues Fenster. Alte Freischaltungen bleiben erhalten. Langfristige Kompetenzfestigung wird separat bewertet. Details: [Überarbeitung vom 17.10.2026](docs/UEBERARBEITUNG-2026-10-17.md). Lesbarer Anfangsbestand: [Lernkarten und Wortschatz](docs/LERNKARTEN-UND-WORTSCHATZ.md).

## Architektur und Inhalte pflegen

Die fünf JSON-Dateien unter `src/content/` enthalten je 100 versionierte Fragen samt Lehrplanquellen. `src/lib/schema.ts` validiert Fragen und Sicherungen. `engine.ts` hält die bestehende Leitner- und Punkte-Logik. `src/learning/` kapselt Kompetenzgraph, Generatoren, adaptive Auswahl, Beobachtungen, Migration und Mosaik-Konfiguration getrennt von React; UI-Bausteine liegen in `src/components/`. `src/App.tsx` enthält die Oberflächen, `style.css` die gemeinsamen Tokens und Styles.

Jede Frage braucht eine dauerhafte `id`, `subject`, `topic`, `competency`, `difficulty` (1–3), `prompt`, 2–4 eindeutige `options`, `correct` als nullbasierten Index und eine verständliche `explanation`. IDs bei bloßen Textkorrekturen behalten; bei inhaltlich veränderter Frage neue IDs vergeben. Neue Inhaltsdateien in `src/content/index.ts` registrieren. Inhaltsformat 2 verwendet `status: practice`, eine Inhaltsrevision, Quellenmetadaten und pro Frage `curriculum` mit `sourceId`, `section` und `stage`. `reviewStatus: teacher-review-pending` macht die offene Freigabe ausdrücklich. Das alte Inhaltsformat 1 bleibt lesbar. Neue Lernstände und Sicherungen verwenden Datenversion 3. Versionen 1 und 2 werden verlustfrei migriert; Datenbank und Store bleiben erhalten. Die Migration erfindet weder Antwortzeitpunkte noch gesicherte Kompetenzen aus alten Summen. Alte App-Versionen können neue Sicherungen nicht lesen; bei Rollbacks die neue Leseschicht beibehalten.

Beispiel:

```json
{"id":"math-101","subject":"math","topic":"einmaleins","competency":"einmaleins","difficulty":1,"prompt":"Wie viel ist 3 × 4?","options":["7","12","16"],"correct":1,"explanation":"3 × 4 = 4 + 4 + 4 = 12.","curriculum":{"sourceId":"lsa-math-2019","section":"3.2","stage":"foundation"}}
```

Aktuell sichern Tests exakt 100 Fragen pro Fach. Bei bewusstem Ausbau die Sollzahl anpassen. Für Runden werden mindestens zehn Fragen benötigt. Build und Tests ausführen. Fehlerhafte Inhalte brechen die Validierung ab. Erweiterungen des Datenformats müssen die aktuelle Sicherungsversion weiterhin lesen oder eine explizite Migration anbieten; keine stille Löschung alter Daten.

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

`npm test` prüft zusätzlich Kompetenzgraph und Fragezuordnung, viele Generatorparameter, Fehlerfolgen, Hilfesignal, zeitversetzte Sicherheit, Varianten-Duplikate, dauerhafte Erfolge und Migration. Der Bestandstest prüft weiterhin 100 Fragen je Fach, gültige Quellenbezüge, alle Schwierigkeitsstufen, Inhaltsvalidierung, zehn eindeutige Fragen, leichte Einstiegsfragen, Wiederholungsfristen, adaptive Schwierigkeit, Punktebegrenzung und ungültige Imports. `npm run build` führt die TypeScript-Prüfung aus und generiert den Workbox-Service-Worker.

Die Browserprüfungen liegen in `tests/*.spec.ts`, der Pilot in `tests/learning.spec.ts`. Nach Browserinstallation `npx playwright test` ausführen. Geprüft werden komplette Runden einschließlich des gesamten Katalogs, kompakte Startseite, Hilfestufen, Lernweg-Wahl, Mosaik-Erhalt nach Fehlern, IndexedDB-Migration, tatsächlicher Sicherungsexport und -import, eigene Karten, Offline-Nutzung und Service-Worker-Updates. Manuell zusätzlich echte Android-/iOS-Installation, Update einer zuvor installierten Version während einer Runde und Nutzung mit der Pilotklasse prüfen. Diese Tests ersetzen keine fachliche Abnahme.

## Offene Entscheidungen und Grenzen

- Betreiberangaben fehlen noch. Die PWA ist unter https://ocram21.github.io/Lernkick/ veröffentlicht.
- Offizielle Lehrplanquellen und Fachhinweise wurden recherchiert; siehe [Recherche Sachsen-Anhalt](docs/ANFORDERUNGEN-SACHSEN-ANHALT.md). Der konkrete Prüfungsweg der BvB-Reha-Gruppe und die Freigabe durch Fachlehrkräfte bleiben offen. Alle 500 Aufgaben mit Lösungen: [Fragenkatalog](docs/FRAGENKATALOG.md).
- Keine Konten, Tracker oder zentralen Schülerdaten. Hosting-Logs sowie Betreiber-/Datenschutzhinweise vor öffentlichem Einsatz gesondert prüfen.
- Browserdaten sind an Origin und Browserprofil gebunden; bei Domainwechsel exportieren/importieren. Entfernte Browserdaten können nur aus einer vorherigen Sicherung wiederhergestellt werden. Andere Apps derselben Origin teilen deren Speicherumgebung; eigene Domain empfohlen.
- App-interne Navigation verwendet keine Serverrouten; Deep Links sind nicht implementiert. Angebrochene Runden werden nach Neuladen nicht fortgesetzt, bereits beantwortete Fragen bleiben gespeichert.
