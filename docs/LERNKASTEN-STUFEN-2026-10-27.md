# Lernkasten: Fälligkeiten und Abschlusskontrolle

Auftrag: `lernkick_lernkasten_aenderungen_codex.md`.

## Verhalten

Richtige Antworten steigen um eine Stufe: 1 → 10 Minuten, 2 → 24 Stunden, 3 → 3 Tage, 4 → 7 Tage, 5 → 30 Tage. Erst die anschließend richtig beantwortete Abschlusskontrolle setzt `masteredAt`. Gemeisterte Karten bleiben gespeichert und verlassen die reguläre Warteschlange. Fehler senken genau eine Stufe, mindestens auf null, mit zehn Minuten Wartezeit. Bewertungen vor Fälligkeit und erneute Bewertungen gemeisterter Karten ändern nichts. Termine sind genaue Timestamps; ein Tag entspricht 24 Stunden, auch bei Zeitumstellung.

Je Unterrubrik zeigt ein Kreis die aktuell fälligen Karten einschließlich neuer Karten. Null ist kein Meisterungsnachweis. Nur nichtleere Rubriken mit ausschließlich gemeisterten Karten erhalten das goldene Häkchen. Neue eigene Karten entfernen es wieder. Aktualisierung nach Antworten, beim Öffnen/Fokussieren und direkt beim Ablauf eines Termins.

Die bisherigen Termintexte und das Zusatztraining entfallen. Ein Hilfebutton neben der Überschrift öffnet einen nativen Dialog mit Schließen, Außenklick und Escape. Der Text wird mit der Hilfe in den Einstellungen geteilt. Keine Sprachausgabe.

## Datenerhalt

Bestehende Reviewdaten, eigene Karten, Punkte und reguläre gespeicherte Runden bleiben erhalten. Alte Stufe fünf wird niemals automatisch gemeistert: Früheste Kontrolle ist 30 Tage nach der letzten Bewertung; bei unklarer Erfolgshistorie wird zunächst eine neue 30-Tage-Frist verankert. Ursprüngliche Termine bleiben gespeichert. Ausschließlich veraltete Zusatztrainingsrunden werden beim Laden beendet. Die neuen optionalen Zeitfelder überleben Schema-Prüfung, Export und Import. Domain und Pages-Konfiguration unverändert.

## Dateien

- Logik: `src/study/cards.ts`, `src/study/schedule.ts`, `src/lib/schema.ts`, `src/learning/migration.ts`.
- Oberfläche und gemeinsame Hilfe: `src/components/LearningBox.tsx`, `LearningBoxHelp.tsx`, `HelpPage.tsx`, `src/study/boxHelp.ts`, `src/design/complexes.css`.
- Releasekennung: `2026-10-27-box-mastery`.

## Prüfung

- Produktionsbuild erfolgreich.
- 240 Vitest-Tests erfolgreich, einschließlich Stufen, Sperrfristen, Fehlern, 30-Tage-Kontrolle, Migration, Datenerhalt und Warteschlangen.
- 30 gezielte Playwright-Prüfungen erfolgreich: Normal/Pink, 320/375/390 Pixel, alle Fächer, zusätzliche Safe Area, größere Schrift, gespeicherte Runde, dynamische Zähler, Hilfe-Schließwege, Offline-Neuladen, Häkchen und neue eigene Karte.
- Zusätzliche Browserprüfung für Sicherungsexport und Wiederimport der Meisterungsdaten.

Veröffentlichung separat anhand des GitHub-Pages-Workflows und der ausgelieferten Releasekennung prüfen; ein erfolgreicher lokaler Build bestätigt keinen Livegang.
