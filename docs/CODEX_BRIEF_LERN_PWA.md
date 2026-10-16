# Codex-Auftrag: Lern-PWA für die BvB-Reha

**Projektname:** LernKick (Arbeitstitel, Domain ungeprüft)
**Ziel:** Mobile, installierbare, offlinefähige Lern-App zur Vorbereitung auf den qualifizierten Hauptschulabschluss in Sachsen-Anhalt. Zunächst Pilotprojekt mit einer BvB-Reha-Klasse.

## Pädagogisches Konzept
Die App verbindet Quiz im Stil von „Wer wird Millionär?“ mit einem adaptiven Karteikastensystem nach dem Leitner-Prinzip. Lernende beginnen mit einfachen Aufgaben, sammeln Erfolgserlebnisse und steigern die Schwierigkeit schrittweise. Fehler lösen kurze Erklärungen und gezielte spätere Wiederholungen aus, keine Bestrafung. Kurze Runden mit ungefähr zehn Fragen; Grundlagen regelmäßig wiederholen, besonders das kleine Einmaleins. Individuellen Kompetenzstand über mehrere Antworten einschätzen, nicht über Einzelfehler. Einfache Highscores pro Fach und wenige Levels, keine Badges.

## Fächer und Lerninhalte
- **Mathematik:** Grundrechenarten, kleines Einmaleins, negative Zahlen, Primzahlen, Brüche erweitern/kürzen und Bruchrechnung, Terme, direkter und indirekter Dreisatz, Prozentrechnung. Weitere Themen nach offiziellen Vorgaben.
- **Deutsch:** Wortschatz und Wortbedeutungen, auch für Deutschlernende, Rechtschreibung, Grammatik. Anfangs Auswahlfragen, später Lückentexte und Eingaben.
- **Sozialkunde, Biologie, Geografie:** Begriffe, Zusammenhänge und prüfungsnahe Sachfragen mit verständlichen Erklärungen.
Prüfungsanforderungen und Themen mit aktuellen offiziellen Quellen aus Sachsen-Anhalt und den Lehrkräften abgleichen. Quellen und Stand dokumentieren. Keine ungesicherten Aufgaben als offizielle Prüfungsfragen ausgeben.

## Spielmechanik
- Pro Frage variabel zwei, drei oder vier Antworten, abhängig von deren Textlänge; kurze Antworten ggf. im 2×2-Raster, lange untereinander.
- Große Touchflächen, klare Trennung von Frage und Antwortbereich, keine überfrachteten Smartphone-Ansichten.
- Sofortiges Feedback und kurze Erklärungen; Antworten durchmischen.
- Eigene Lernkarten erstellen, bearbeiten, löschen und wiederholen; getrennt von den redaktionellen Karten speichern.
- Freies Üben und adaptive Lernrunden. Später optional Challenge-Modus.
- Wiederholungsplanung mit lokal gespeicherten Lernständen; keine unbegrenzte Punktevergabe für triviale Wiederholungen.

## Design
Mobile-first, jugendlich, modern, Streetstyle/Skater/Arcade: kräftige Akzentfarben, starke Typografie, klare Kontraste, kleine Animationen. Einheitliche Gestaltung in allen Fächern mit fachspezifischen Farben. Fragebereich und Antwortbereich optisch klar getrennt. Navigation und Einstellungen minimal. Gelegentlich kurze motivierende, humorvolle Sprüche oder Skater-Animationen, niemals herabsetzend oder kindisch. Barrierefreiheit, gut lesbare Schrift, ausreichend große Bedienelemente und reduzierte Animationen berücksichtigen. Design-Tokens und wiederverwendbare Komponenten einsetzen. Impeccable optional für Design-Review nutzen, sofern verfügbar.

## Technik
- PWA mit React, TypeScript und Vite; Service Worker/Workbox, Manifest und installierbare Icons.
- Hosting zunächst statisch über GitHub Pages und GitHub Actions; GitHub-Pages-Unterpfade korrekt konfigurieren.
- Keine Accounts, keine zentrale Datenbank und keine Übertragung von Schüler-Lernständen an einen Server.
- IndexedDB für Lernfortschritt, Einstellungen, Highscores und eigene Karten.
- Offline-Nutzung nach erstem Laden; App und freigegebene Inhalte zwischenspeichern.
- Beim App-Start online auf neue Versionen prüfen; verständliche Updateanzeige. Laufende Runden nicht unterbrechen; lokale Daten bei Updates erhalten.
- Export/Import der Nutzerdaten als versionierte JSON-Datei mit Validierung, damit ein Gerätewechsel möglich ist.
- Achtung: Browserdaten sind an die Web-Origin gebunden. Beim späteren Hostingwechsel möglichst dieselbe eigene Domain verwenden; andernfalls Datenübernahme über Export/Import.
- Datenschutzsparsam entwickeln; keine Tracker, keine externen KI-Aufrufe erforderlich. Hosting-Logs und rechtliche Pflichten gesondert prüfen.

## Architektur und Pflege
Design, Quiz-Engine, adaptive Lernlogik, lokale Datenspeicherung und Lerninhalte strikt trennen. Lerninhalte als validierte, versionierte JSON-Dateien pro Fach und Thema ablegen, mit stabilen IDs, Schwierigkeitsgrad, Kompetenzzuordnung, Antwortoptionen, korrekter Lösung und Erklärung. So können Lehrkräfte Inhalte ergänzen, ohne den Programmcode oder das Design zu verändern. Später optional ein einfacher Frageneditor mit Import/Export. Änderungen an Inhalten und Datenstruktur migrationssicher gestalten.

## Umsetzung in Etappen
1. PWA-Grundgerüst, Navigation, Designsystem, GitHub-Pages-Deployment.
2. Spielbare Demo mit Mathematik und Deutsch, Zehn-Fragen-Runden und 2–4 Antwortoptionen.
3. Adaptive Schwierigkeit, Wiederholungslogik, lokale Highscores und Levels.
4. Eigene Lernkarten, Datensicherung, Update-Mechanismus und Offline-Tests.
5. Weitere Fächer und geprüfte Inhalte ergänzen.
6. Test mit BvB-Reha-Schülern, UX verbessern, Inhalte mit Fachlehrkräften abstimmen.

## Abnahmekriterien
Die App ist auf Smartphones installierbar und nach initialem Laden offline nutzbar. Alle fünf Fächer sind anwählbar; fehlende Inhalte sind als Demo gekennzeichnet. Die Oberfläche ist auf kleinen Displays gut bedienbar. Lernfortschritt und Highscores bleiben lokal erhalten. Adaptives Wiederholen funktioniert nachvollziehbar. Eigene Karten können erstellt und gesichert werden. Updates löschen keine Nutzerdaten. Neue Fragen lassen sich ohne Layoutänderungen einpflegen. README erklärt lokale Entwicklung, Tests, GitHub-Pages-Deployment und Content-Pflege.

**Erster Codex-Arbeitsauftrag:** Eine funktionierende mobile Demo einschließlich GitHub-Pages-Konfiguration erstellen, mit einer vollständigen Mathe- und Deutsch-Lernrunde. Architektur modular halten, Annahmen und offene Prüfungsanforderungen dokumentieren. Keine kostenpflichtigen Dienste oder Backend-Abhängigkeiten voraussetzen.
