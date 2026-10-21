# Umsetzung vom 20./21.10.2026

Dieser Stand ergänzt den [Auftrag vom 20.10.](AENDERUNGEN-2026-10-20.md). Er umfasst die beiden Anweisungen zu Tafeln sowie Lernverhalten/Design und den nachgereichten PIN/PWA-Auftrag einschließlich Wortschatz-Abständen und Deutschlandquiz-Kontrast. Ziel der Veröffentlichung ist die bestehende App auf lernkick.eu.

## Tafeln Auge und Ohr

Die beiden ZIP-Pakete bleiben unter `Tafeln/` erhalten. `scripts/import-boards.py` prüft Paketpfade, Dateinamen, PNG-Format, IDs, aufsteigende eindeutige Nummern und Begriffe. Original-JSON und PNG werden unverändert nach `public/boards/original/` übernommen; vorhandene abweichende Originale werden nicht überschrieben. `src/boards/catalog.json` enthält getrennt normalisierte Spieldaten und Prüfsummen. Import: `python3 scripts/import-boards.py`.

Die Hauptnavigation bietet Lernen, Tafeln und Einstellungen. Eigene Karten bleiben über Einstellungen → Karten verwalten erreichbar. Tafeln zeigen Originalbild, Vergrößerung, zufällig gemischte Begriffsliste und Check. Maus-/Touch-Ziehen bietet eine sichtbare Einfügelücke; Pfeiltasten-Schaltflächen sind eine gleichwertige Alternative. Check bewertet alle Plätze zusammen, mit Grün/Rot und Text. Er verrät und korrigiert keine Lösung. Bearbeitung hebt alte Prüfmarkierungen auf. Reihenfolge und Prüfzustand werden pro Tafel lokal und in Sicherungen erhalten; keine zusätzlichen Punkte oder Level werden erfunden.

Beide Tafeln sind sichtbar als **Testtafeln, fachlich nicht freigegeben** gekennzeichnet. Am Auge ist Nummer 16 überzeichnet; einzelne Zuordnungslinien, insbesondere bei 4, 10 und 12, sind nicht eindeutig genug für eine fachliche Freigabe. Die Ohrtafel ist ebenfalls noch nicht fachlich abgenommen. Bilder und Nummern wurden bewusst nicht nachgezeichnet oder verändert. Fachliche Prüfung bleibt erforderlich.

## Pause, Rückblick und Fortschritt

Fachfragen und Wort-Multiple-Choice zeigen richtige wie falsche Antworten zwei Sekunden, dann folgt die nächste Aufgabe. Pause stoppt den Wechsel und die Lernzeit; Fortsetzen gibt wieder volle zwei Sekunden. Bereits beantwortete Aufgaben lassen sich mit eigener Antwort, Lösung und Erklärung zurückblättern, ohne erneute Bewertung. Die letzten 40 Einträge werden mit der laufenden Runde gespeichert. Ausgang verlässt die Ansicht sofort und erhält den Stand.

Bewusste modulspezifische Ausnahmen: Fehlerhafte Satzbau-Entwürfe bleiben zur Korrektur stehen; Länderquiz und Galgenraten sind laufende Zuordnungs-/Buchstabenspiele mit Pause, ohne erfundene rückwirkende Aufgabenhistorie. Dual N-Back behält seine eigene zeitkritische Pause und bietet kein Zurückspulen der Gedächtnisfolge. Auf Ergebnisschirme folgt kein automatischer Neustart.

Lernstärke verwendet weiterhin die bestehende Formel (10 Prozentpunkte pro 30 Minuten aktiver Übungszeit). Sichtbare aktive Zeit wird in kurzen Intervallen erfasst und mit Nachkommastelle angezeigt. Menüs, verborgene Fenster, Pause und Rückblick zählen nicht als Lernen; längere Untätigkeit wird begrenzt. Die zuvor veröffentlichte Version hatte diese Erfassung noch nicht. Die neue Prüfung umfasst mehrere Runden, spätere Übungsaufnahme und Reload. Ein dabei gefundener zweiter Fehler ist behoben: Neue Runden schreiben keine parallelen alten Fach-Maximalscores mehr, deren Summe beim Reload zusätzliche Punkte erzeugt hatte. Bestehende historische Punkte werden erhalten; sie werden nicht in Lernzeit umgerechnet.

Dual N-Back speichert aktuelle N-Stufe, gemeisterte Stufen, beste Fehlerzahl und begrenzte Ergebnishistorie getrennt. Bestehende Regel: höchstens zwei Fehler bestehen eine Runde. Wiederaufnahme und höchste gemeisterte Stufe sind auf der Taste sichtbar. Aus älteren laufenden N3/N4-Runden werden nur sicher vorausgesetzte Stufen rekonstruiert; weder ein gemeistertes N4 noch unbekannte historische Scores werden behauptet.

## Gestaltung

„Mit Pink“ ist ein einzelner dauerhaft gespeicherter Schalter. Farben liegen zentral unter `src/design/pink.*`; die Standard-Taschenrechnerpalette bleibt erhalten. Originalbilder und funktionale Richtig/Falsch-Zustände behalten ihre Bedeutung. Der Wortschatz-Auswahlbereich hat einen gemeinsamen Container mit 15 px Rundung, 22 px Innenabstand und einheitlich ausgerichteten Schaltern. Die Verbindungslinien zu kleinen Bundesländern nutzen den kontrastreicheren Orange-/Pink-Akzent und 2,5 px Strichbreite. Der N-Back-Startbutton erhält helle Schrift für besseren Kontrast.

## PIN und PWA

`src/components/AccessGate.tsx` liegt vor der Lern-App; `src/lib/access.ts` kapselt Berechnung und Freigabe. Formel: deutsches Kalenderdatum in Europe/Berlin als TTMMJJJJ → Dezimalzahl → Quadratwurzel abrunden → links auf vier Stellen auffüllen. Falls die Zeitzonenberechnung nicht verfügbar ist, gilt das lokale Gerätedatum. Keine PIN wird angezeigt oder protokolliert.

Im normalen Browser lebt die Freigabe nur im laufenden JavaScript-Speicher. Vollständiges Neuladen verlangt erneut Eingabe, auch bei vorhandenem PWA-Freigabe-Key. Im erkannten installierten Modus (`display-mode: standalone`, ergänzend iOS `navigator.standalone`) wird `localStorage['lernkick.pwa.pinUnlock.v1'] = 'granted'` ausgewertet bzw. gesetzt. Sonstige Anzeigearten werden nicht als Installation angenommen. `sessionStorage` speichert keine Browserfreigabe. Der getrennte bestehende Runden-Key `lernkick.nback.round.v1` bleibt erhalten; Lernstände und Pink liegen weiterhin in IndexedDB `lernkick`, Store `user`, Datensatz `data`.

Die bereits freigeschaltete PWA kann nach vollständigem Online-Laden offline starten. Updates löschen weder Freigabe noch Lernstände. Bei gelöschten Website-Daten ist die Freigabe weg. Neuinstallation wird nicht zuverlässig erkannt: Ein plattformseitig geteilter Origin-Speicher kann erhalten bleiben. Die Erkennung des installierten Modus ist plattformabhängig.

**Die PIN ist ausschließlich eine UI-Zugangshürde.** Quellcode, statische Dateien und JSON-Lerninhalte bleiben über das öffentliche GitHub-Repository und GitHub Pages erreichbar. Es entstehen weder Serverauthentifizierung noch ein technisch geschlossener Bereich. Die Maßnahme ersetzt keine Prüfung der Impressumspflicht.

## Prüfung und Grenzen

- 109 Funktionstests; Produktionsbuild mit TypeScript-Prüfung und Offline-Service-Worker.
- 131 Browserprüfungen erfolgreich; nach den abschließenden Touchflächen-/N-Back-Kontrastkorrekturen zusätzlich die betroffenen Abläufe erneut geprüft.
- Browsermatrix: Chromium über installiertes Chrome auf macOS, 320/375/390/430 px sowie Desktop; Maus, emuliertes Touch, Tastatur, Speicherung, Migration, Pause, Automatik, Inhalte und Offlinebetrieb.
- PIN-Prüfungen: Browser-Reload, falsche Eingabe, Tastatur, gespeichertes Pink, geteilter Speicher, Mitternacht sowie emulierte Standalone- und iOS-Erkennung einschließlich Offline-Start. Datums-Unit-Tests prüfen Monatsgrenzen und Zeitumstellung.
- Echte Installationen auf Android, iOS, Windows/Edge und macOS müssen noch auf physischen Geräten abgenommen werden. Eine emulierte Moduserkennung ist kein Nachweis für alle Betriebssysteme. Die fachliche Abnahme der Lerninhalte bleibt offen.
- Veröffentlichung erfolgt über GitHub Actions mit explizitem Pages-Deploy; `scripts/check-live.mjs` prüft anschließend die tatsächlich ausgelieferte Releasekennung, PIN, beide Tafeln, Einstellungen, Pause, N-Back und Offline-Neuladen in einem frischen isolierten Browserprofil.

## Veröffentlichung und Live-Abnahme

Am 21.10.2026 wurde Commit `25d8e28cb2a8941f5fb63b93e20836c08340dbfd` auf `main` gepusht und über [Pages-Lauf 39530733260](https://github.com/ocram21/Lernkick/actions/runs/39530733260) erfolgreich gebaut und veröffentlicht. Die Domain lieferte HTTP 200 und exakt `2026-10-21-access-boards-pause-pink` aus.

Der Live-Browsercheck bestand: Zugang erst nach PIN und erneut nach vollständigem Reload, neun Starttasten, Pink, Kartenverwaltung, Mathematik-Antwort und Rückblick, beide Original-Tafelbilder mit Check, N-Back-Einstieg sowie Offline-Neuladen einschließlich gecachtem Tafelbild. Der gespeicherte Testversuch blieb erhalten; keine JavaScript-Laufzeitfehler. Alle Schritte liefen in einem frischen isolierten Browserprofil und veränderten keine vorhandenen Nutzerdaten. Im Prüfskript wurde das Warten auf die Bilddekodierung ergänzt, damit langsamerer Netzwerkabruf nicht fälschlich als fehlendes Bild gilt. Dieser abschließende Protokoll-/Prüfskript-Commit verändert keine ausgelieferten App-Dateien.

Die unabhängige Designprüfung bewertete die beiden angeforderten Korrekturen (mindestens 44 px große Tafel-Touchflächen und widerspruchsfreie aktuelle Designregeln) als behoben; Disposition `ship` für diesen Korrekturumfang. Fachfreigabe und physische Geräteabnahme bleiben wie oben beschrieben offen.

## Nachtrag: reduzierte N-Back-Menütaste

Auf Nutzerwunsch zeigt die Menütaste nur N1, N2 und N3. Gemeisterte Stufen sind ausgefüllt; die Zeilen „Aktuell“ und „Bestes“ entfallen. Die bestehenden gespeicherten N-Stufen und Ergebnisse bleiben erhalten. Release: `2026-10-21-nback-menu`.
