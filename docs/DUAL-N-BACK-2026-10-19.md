# Dual N-Back statt Lerntafeln – 19.10.2026

## Auftrag und Stand

Der Nutzer möchte alle Lerntafeln entfernen, sein vollständiges Spiel aus [ocram21/dual-n-back](https://github.com/ocram21/dual-n-back) als Button innerhalb LernKicks spielen, einfach zu LernKick zurückkehren und anschließend alle Änderungen auf GitHub pushen.

Die lokale Umsetzung ist vorbereitet und noch nicht gepusht. Der GitHub-Abgleich wurde begonnen, konnte aber nicht abgeschlossen werden. Browserprüfungen wurden nicht ausgeführt: Die automatische Freigabeprüfung meldet wiederholt „Selected model is at capacity“. Dies ist ein Fehler der Prüfung, keine Einstufung der Aktionen als unsicher. Die Freigabe wurde nicht umgangen. Ein lokaler Testserver wird in der normalen Sandbox mit `listen EPERM` blockiert; der benötigte Freigabeversuch scheiterte ebenfalls am Kapazitätsfehler.

## Eingebaute lokale Quelle

- Datei: `/Users/marco/Documents/Dev/Codex/Dual-N-Back/index.html`
- Lokaler Repository-Commit: `67d4c89` („Add standalone Dual N-Back training app“).
- SHA-256 der ursprünglichen Datei: `c7f108c2656efba3496c79ae1b43bf7f8d18539126222e5fbc3531517bb966ca`.
- Das lokale Repository hat keinen Remote eingetragen. GitHub-Repository und Branch `main` wurden inzwischen bestätigt: Commit `e27789458db62b763da7f1827f868bdee4ada4b5`. Die abgerufene `index.html` ist nur ein Einstieg mit Weiterleitung auf `Dual%20N-Back.html` (Dateiname `Dual N-Back.html`). Der Abruf dieser eigentlichen Spieldatei scheiterte erneut an der automatischen Freigabeprüfung. Deshalb ist weiterhin nicht bestätigt, ob die eingebaute lokale Spielversion dem GitHub-Stand entspricht. Vor Abschluss vergleichen.
- Kopie unter `public/games/dual-n-back/index.html`. Keine externen Spielserver, APIs oder Medienabrufe. Die neun WAV-Sprachaufnahmen bleiben eingebettet.

## Änderungen

- Sämtliche Tafelkacheln und Header-Einstiege sowie Hilfehinweise entfernt; Tafel-Komponenten, Katalog, Quellen-/Grafikdateien und Erzeugungsskripte entfernt. Historische Arbeitsberichte bleiben als Dokumentation im Git-Verlauf und im docs-Ordner.
- Bestehende CountryQuiz-Karten und ihre Tests bleiben; sie gehören zum weiter vorhandenen Deutschlandquiz.
- `NBackGame.tsx` lädt das komplette lokale Spiel im iframe. Ein feststehender Rückweg außerhalb des iframe bleibt sichtbar. Kein Wechsel zu einer anderen Website erforderlich.
- Originalfunktionen: Anfangsstufe 1/2, 24 bewertete Reize plus Einlernreize, 3×3-Positionsraster, Audio und Position getrennt erkennen, A/L-Tastatur und Touchknöpfe, Auswertung von Treffern/Verpasst/Fehlalarmen, Aufstieg bis 4-Back, neue Runden, Sitzungsverlauf und Druckauswertung.
- Ergänzt: Ton-Test vor dem Start, Pauseknopf, Pause bei verstecktem Dokument sowie während LernKicks Verlassen-Abfrage. Die Wartezeit wird mit Restdauer angehalten. Antworten während der Pause werden ignoriert. Beim Verlassen stoppt das iframe mit seinen Audios.
- Verlassen einer aktiven Runde nur nach Bestätigung. Der Text erklärt ausdrücklich, dass die N-Back-Sitzungsergebnisse beim Verlassen verloren gehen; sie werden wie im Original nicht in LernKicks Lernständen gespeichert.
- `postMessage` prüft Quelle und exakten Origin in beide Richtungen. Keine Lerndaten an den Spielrahmen übergeben.
- Bestehende Fach-, Spiel-, Karten- und Satzbau-Lernstände bleiben unverändert. Alte Tafel-Favoriten bleiben nur als archivierte Daten in bestehenden Sicherungen lesbar.
- Service Worker precacht das neue Spiel inklusive Audio; die entfernten Tafeln werden nicht mehr ausgeliefert.

## Prüfung

- `npm test`: 70 Tests bestanden, darunter 120 generierte N-Back-Runden über alle vier Stufen, Übereinstimmungen mit tatsächlichen N-Schritten, Bewertung von perfekten und vollständig falschen Antworten, eingebettete WAV-Dateien und Pausieren mit fortgesetztem Zeitplan.
- `npm run build`: bestanden; 19 Offline-Dateien, etwa 1,69 MB Precache. Keine neue Laufzeitabhängigkeit.
- Browserfälle vorbereitet: komplette Sitzung bis 4-Back, Antwortknöpfe/Tastatur, Rückweg/Bestätigung, mobile Hoch-/Querformate und Offline-Einstieg. Sie sind aufgrund des Freigabefehlers noch nicht gelaufen. Die vorbereiteten Tests sind keine bestandene Abnahme.
- Visuelle Kontrolle, tatsächliche Audiowiedergabe auf Geräten und Live-Veröffentlichung noch offen.

## Noch abzuschließen

1. Freigabeprüfung wieder funktionsfähig machen (z. B. vom Nutzer vorgeschlagenen Modellwechsel abwarten).
2. Repository `ocram21/dual-n-back` lesen und aktuelle Quelldatei mit obiger lokaler Version vergleichen. Abweichungen in die Integration übernehmen.
3. Alle vorbereiteten Playwright-Fälle ausführen und die Darstellung auf Handy/Desktop in einer gebündelten Runde kontrollieren; reale Fehler beheben.
4. README-Arbeitsstand in einen Abschlussstand ändern, diesen Bericht aktualisieren, Änderungen committen und wie beauftragt nach `ocram21/Lernkick` pushen. Noch kein Commit oder Push für diesen Auftrag erfolgt.
5. Falls die bestehende Veröffentlichungsautorisierung genutzt wird: Pages mit `publish=true`, `BASE_PATH=/` und Domain `https://lernkick.eu/` veröffentlichen und live prüfen.

## Nachtrag: GitHub-Push am 19.10.2026

Auf erneute ausdrückliche Anweisung wird das vorhandene Änderungspaket committed und nach `ocram21/Lernkick` auf `main` gepusht. `git fetch origin` war erfolgreich; vor dem Commit waren lokaler Branch und `origin/main` identisch. Der Vergleich mit der externen Dual-N-Back-Spielquelle bleibt offen.

Erneute Prüfung: `npm test` mit 70 bestandenen Tests und `npm run build` erfolgreich. Der lokale Playwright-Server konnte nach Freigabe starten; die Browsertests konnten jedoch nicht ausgeführt werden, weil das erwartete Chromium-Headless-Binary (Revision 1248) nicht installiert ist. Es wird keine bestandene Browserabnahme behauptet. Eine Live-Veröffentlichung ist nicht Bestandteil dieses Pushs. Die obigen offenen Schritte dokumentieren den früheren Arbeitsstand; Commit und Push werden mit diesem Nachtrag erledigt.
