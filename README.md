> Verbindliche Farbvorlage: [Nutzerfoto](docs/design/calculator-reference.jpeg), [Palette](src/design/palette.json) und [Designregeln](DESIGN.md). Die UI verwendet nur diese Palette; spaetere Schautafelinhalte duerfen davon abweichen.

> Aktueller Stand 19.10.2026: Der konsolidierte Änderungsauftrag ersetzt frühere Oberflächenvorgaben in diesem Dokument. Startseite mit neun Retro-Tech-Tasten, kumulierten Punkten, unabhängigen Leveln und einer Lernstärke; keine separate Fortschrittsseite und kein freier Lernmodus. Datenmigration, Sicherungen, Modulregeln und Abnahme: [Umsetzungsbericht](docs/UMSETZUNG-2026-10-19.md).

# LernKick

**Aktueller Änderungsstand:** Lerntafeln durch Dual N-Back ersetzt. 70 Tests und Produktionsbuild erfolgreich; Browserabnahme und Vergleich mit der externen Spielquelle bleiben offen. [Prüfstand](docs/DUAL-N-BACK-2026-10-19.md).

**Live-PWA:** [LernKick öffnen](https://lernkick.eu/)

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
- Drei Lernformen auf der Startseite: Lernrunde, Freies Üben und Karten. Danach startet ein Fachbutton die gewählte Lernform. Der Wortschatz bietet Alltag (200 Wörter), Beruf (200 Wörter) und Satzbau (200 Aufgaben, 100 je Stufe). Bereiche sind einzeln und gemeinsam aktivierbar; die Auswahl und laufende Runde werden gespeichert.
- Mathe-Lernpfad mit 35 kleinen Kompetenzen, Voraussetzungen, sieben deterministischen Generatorarten und drei Aufgabenstufen. Nach Fehlern passende Unterstützung, anschließend eine neue Herausforderung derselben ursprünglichen Stufe. Kompetenzeinschätzung aus mehreren Beobachtungen statt fachweiter Trefferquote. Grenzwerte, Rückfragen und Fallbacks: [Mathe-Pilot](docs/MATHE-PILOT.md).
- Hinweis → Beispiel → Lösungserklärung; optionale Zahlenstrahl-/Punktefeld-Hilfe. Unter „Lernweg“ jederzeit leichter, passend, anspruchsvoller oder anders erklären lassen. Keine Zeitmessung und keine Minuspunkte.
- Leitner-Boxen bleiben für Bestandsfragen erhalten: 1, 3, 7, 14, 30 Tage bei richtigen Antworten, 10 Minuten nach Fehlern. In den anderen vier Fächern bleibt die bisherige Auswahlheuristik bestehen. Ihre neuen Kompetenzbäume sind ein späterer Schritt.
- Punkte für Bestandsfragen maximal einmal pro Frage und 24 Stunden, für Generatoren einmal pro Kompetenz und 24 Stunden. Bestleistungen bleiben erhalten. Veränderliche Kompetenzzustände ersetzen die globale Level-Zahl.
- „Fortschritt“ zeigt auf einer Bildschirmhöhe ausschließlich die Fachauswahl (MA, D, SK, Bio, Geo) und das ausgewählte Fortschrittsbild. Erklärtexte, Zähler, Kompetenzliste und Bestleistungen werden dort nicht angezeigt; gespeicherte Bestleistungen bleiben in Sicherungen erhalten. Die fünf Bildwelten verwenden weiterhin neutrale Platzhalter. Freigeschaltete Segmente bleiben bei Fehlern erhalten; Motive sind unabhängig von gespeicherten Meilensteinen austauschbar.
- IndexedDB für Fortschritt, Bestleistungen, Einstellungen und eigene Karten. 75 feste Standardkarten (15 je Fach) gemeinsam mit eigenen Karten im Leitner-System wiederholen. Nur eigene Karten können unter „Meine Karten“ angelegt, bearbeitet und gelöscht werden. Nach dem Aufdecken steuern „Gewusst“ / „Noch üben“ die Wiederholungsfristen (1/3/7/14/30 Tage bzw. zehn Minuten). Nicht fällige Karten bleiben mit ihrem Kastenstatus gespeichert und werden aus automatischen Lernrunden herausgehalten. Frühere persönliche Bearbeitungen von Standardkarten werden einmalig als eigene Fassungen übernommen; die Standardvorlagen bleiben unveränderlich. Selbstbewertungen schalten keine Bildteile frei.
- Versionierter, validierter JSON-Export/Import. Import ersetzt nach Bestätigung den vorhandenen Lernstand und die Karten; bereits freigelegte Bildteile bleiben erhalten. Der Import ist auf 5 MB / 2.075 Karten (einschließlich übernommener persönlicher Standardfassungen) begrenzt.
- Rechts neben dem Logo auf der Fächerauswahl steht „App aktualisieren“. Er prüft online auf eine neue Version, wartet auf den vollständigen Download und lädt die App nach dem Versionswechsel neu. Meldungen unterscheiden aktuell, offline und Fehler. Während der Prüfung kann keine Lernrunde gestartet werden. Nutzerdaten bleiben unabhängig vom Service-Worker-Cache erhalten.
- Lösung und Erklärung bleiben standardmäßig bis zum manuellen Weitergehen sichtbar. Auf Wunsch startet „Automatisch weiter“ bei richtigen Antworten einen Dreisekunden-Timer; „Anhalten“ stoppt ihn. Falsche Antworten wechseln immer nur manuell. Tafelwerk und Abbruchdialog pausieren die Automatik.

Für ein neues Fortschrittsfeld werden je Fach mindestens vier von fünf verschiedenen Aufgaben ohne Hilfe richtig beantwortet. Dieselbe Aufgabensignatur zählt innerhalb von 24 Stunden nicht erneut; nach Freigabe beginnt ein neues Fenster. Alte Freischaltungen bleiben erhalten. Langfristige Kompetenzfestigung wird separat bewertet. Details: [Überarbeitung vom 17.10.2026](docs/UEBERARBEITUNG-2026-10-17.md). Lesbarer Anfangsbestand: [Lernkarten und Wortschatz](docs/LERNKARTEN-UND-WORTSCHATZ.md).

## Galgenraten und Kartensuche

„Galgenraten“ startet direkt über einen eigenen Button mit Galgensymbol auf der Startseite. 80 redaktionelle Begriffe mit einfachen Alltagshinweisen verteilen sich auf „Normal“ und „Streber“; das Spiel ist offline nutzbar. Beide Stufen haben freiwillige zusätzliche Hilfe; die laufende Runde und Ergebnisse bleiben lokal gespeichert. Ä, Ö, Ü und ß sind eigene Buchstaben. Zehn Fehlversuche bauen die anfangs leere Zeichnung Schritt für Schritt auf. Die Kartenverwaltung zeigt zunächst zehn Karten, mit Suche, Sortierung und „Weitere anzeigen“. Details und Prüfung: [Erweiterungsstand](docs/ERWEITERUNG-SPIELE-KARTEN.md).


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

Der Workflow setzt automatisch `BASE_PATH=/<Repositoryname>/`; bei `<Owner>.github.io` wird `/` verwendet. Für eine eigene Domain die Repository-Variable `BASE_PATH=/` setzen und die Domain in Pages konfigurieren. Aktuell ist `lernkick.eu` eingerichtet, `BASE_PATH=/` gesetzt und HTTPS aktiviert. Manifest, Assets und Service-Worker-Scope folgen diesem Pfad. Lokal einen Unterpfad prüfen:

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

- Betreiberangaben fehlen noch. Die PWA ist unter https://lernkick.eu/ veröffentlicht.
- Offizielle Lehrplanquellen und Fachhinweise wurden recherchiert; siehe [Recherche Sachsen-Anhalt](docs/ANFORDERUNGEN-SACHSEN-ANHALT.md). Der konkrete Prüfungsweg der BvB-Reha-Gruppe und die Freigabe durch Fachlehrkräfte bleiben offen. Alle 500 Aufgaben mit Lösungen: [Fragenkatalog](docs/FRAGENKATALOG.md).
- Keine Konten, Tracker oder zentralen Schülerdaten. Hosting-Logs sowie Betreiber-/Datenschutzhinweise vor öffentlichem Einsatz gesondert prüfen.
- Browserdaten sind an Origin und Browserprofil gebunden; bei Domainwechsel exportieren/importieren. Entfernte Browserdaten können nur aus einer vorherigen Sicherung wiederhergestellt werden. Andere Apps derselben Origin teilen deren Speicherumgebung; eigene Domain empfohlen.
- App-interne Navigation verwendet keine Serverrouten; Deep Links sind nicht implementiert. Angebrochene Runden werden nach Neuladen nicht fortgesetzt, bereits beantwortete Fragen bleiben gespeichert.

## Deutschlandquiz und Lerntafeln

Die erste Runde ordnet die 16 Bundesländer auf amtlichen Landesumrissen zu. In der zweiten Runde stehen alle Ländernamen links untereinander; Hauptstädte werden rechts in leere Felder gezogen oder per Antippen eingesetzt. Richtige Paare bleiben sichtbar. Ziehen, Antippen und Tastatur sind gleichwertig, falsche Versuche unbegrenzt. Kleine Länder haben vergrößerte Ziele. Kein Zeitlimit.

35 Lerntafeln in genau fünf Kategorien, mit lokalen SVG-Vorschaubildern, Zoom/Pinch/Verschieben und dauerhaften Erklärungen. Sternchen-Favoriten stehen oben und werden lokal sowie in Sicherungen gespeichert. Das modale Tafelwerk lässt laufende Aufgaben, Spiele und ungespeicherte Eingaben montiert und stellt Fokus/Scrollposition wieder her. Nachschlagen vor einer Antwort zählt im adaptiven Lernen als Hilfe. Alle 38 Grafiken und Inhalte werden gemeinsam offline gespeichert.

[Änderungsbericht](docs/ERWEITERUNGSKONZEPT-2026-10-18.md) · [Quellen, Grafikrechte und Erweiterungsanleitung](docs/LERNTAFELN-QUELLEN.md). Redaktionelle Inhaltsprüfung durchgeführt; lehrkräfteseitige Abnahme und reale Geräteprüfung bleiben offen.

## Überarbeitung vom 18.10.2026

Satzbau nutzt einzelne Wort- und Satzzeichenbausteine mit Maus-/Touch-Ziehen und Antipp-Alternative. Erst „Überprüfen“ bewertet; Fehler erlauben Korrektur und „Später üben“, ohne die vollständige Lösung einzublenden. Auf unterstützten Geräten wird bei einer falschen Prüfung einmal kurz vibriert. Satzbau wechselt immer manuell; die freiwillige Wörter-Automatik bleibt erhalten. Keine akustischen Signale oder Vorlesefunktion. Groß-/Kleinschreibung wird mit korrekten Bausteinen dargestellt und bleibt als eigenständige spätere Übung offen.

Unter „Fortschritt“ führen zwei Reihen mit je fünf Buttons direkt zu den fünf Fachbildern sowie zu Länderquiz, Galgenraten, Wortschatz, Satzbau und Lernkarten. „Einstellungen“ bietet einen Fortschritts-Reset mit Dialog und zusätzlicher Checkbox; Karten, Favoriten, Inhalte und Präferenzen bleiben dabei erhalten. Es gibt keine geräteübergreifende Synchronisierung. Browserdaten-Löschung und Gerätewechsel können lokale Daten entfernen; Sicherungsexport/-import dient zur Übertragung.

[Änderungsbericht und Datenübernahme](docs/AENDERUNGEN-2026-10-18.md). Historische Beschreibungen der früheren bearbeitbaren Standardkarten und eigenen Wortlisten sind durch diesen Auftrag abgelöst; deren gespeicherte Inhalte werden nicht still gelöscht.

Die weitere Überarbeitung der Lerntafeln und die adaptive Normal-Stufe im Satzbau sind im [Änderungsauftrag und Abnahmebericht vom 18.10.2026](docs/AENDERUNGSAUFTRAG-2026-10-18.md) dokumentiert.
