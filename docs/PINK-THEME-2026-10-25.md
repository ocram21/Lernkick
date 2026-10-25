# Pink-Theme · 25.10.2026

Umgesetzt nach Lernkick_Pink_Design_Codex.md und der vom Nutzer gelieferten Bildreferenz Abstrakte Magenta-Lichtwellen.png.

## Änderungen

- `src/design/pink.json`: zentrale Rollen für Pflaumen-Hintergrund, rosige Karten, dunkle Kartenleseschrift, helle Hintergrundschrift, Magenta-Auswahl, helle Kontur, Fokus, Eingaben, Navigation und Schatten.
- `src/design/pink.css`: ausschließlich Pink-spezifische Zuordnung auf vorhandene Ansichten, Karten, Formulare, Dialoge, Spiele, Tastaturen, Navigation und Fortschrittsanzeigen. Geometrie bleibt erhalten.
- `src/design/pink-waves.webp` und Herkunfts-Sidecar: bereitgestelltes Bild als ca. 17 KB WebP; Vite übernimmt Assetpfad und PWA-Precache. Pflaumen-Abtönung sichert Lesbarkeit auch über dem hellsten Bildpunkt.
- `src/design/actions.css`: Hauptaktion weiterhin Orange; Pink-Auswahl Magenta und neutrale Flächen mit dunkler Schrift. Bestätigung, Ausgang und Warnungen behalten ihre unterscheidbaren funktionalen Farben.
- `src/components/NBackGame.tsx`, `public/games/dual-n-back/index.html`: vorhandene Theme-Nachricht überträgt Hintergrund und Kartenrollen auch an das Spielfenster. Herkunftsprüfung und Spiellogik unverändert.
- `public/release.json`: Releasekennung `2026-10-25-pink-waves`.
- `DESIGN.md`, `.impeccable/design.json`: aktualisierte Pink-Referenz; Standardpalette unverändert.
- `tests/pink-theme.spec.ts`, `tests/pink-theme.test.ts`: Theme-, Daten-, Offline- und Kontrastprüfung.

## Prüfung

- Produktionsbuild und alle 207 Unit-Tests bestanden. Kontrasttests prüfen Kartenleseschrift, Sekundärschrift, Auswahl und helle Schrift über sämtlichen Pixeln der abgetönten Bilddatei (mindestens 4,5:1).
- Browser: Pink ein/aus, Reload-Persistenz, Offline-Abruf der Hintergrunddatei, exakter Erhalt der Kachelgeometrie und der gespeicherten Nutzerdaten beim Umschalten.
- Mobil 320×568 und Desktop 1440×900: Hauptmenü, Einstellungen, Lernkasten, Kartenformular, Lernkarte mit Antwort, Zahlenpuzzle, Dual-N-Back-Start und laufende Runde. Zusätzlich bestehende Layoutprüfungen 375/390 px, kompakte und normale Dichte in beiden Themes.
- Weitere Pink-Zustände: Gleichungseingabe, Deutschübung, Sozialkunde, Biologie, Geographie, Galgenraten mit Tasteneingabe, Deutschlandkarte mit Verbindungslinien, Bosskampf und Abbruch, leere Monatsstatistik.
- Vorhandene Regressionstests für Kartenerstellung, beide Puzzle-Level und Zielvorschau, N-Back-Sperre/Touch/Timer/Rundenpause, Boss-Testmodus und funktionale Button-Kontraste bestanden.
- Sichtprüfung als gebündelte Mobil-/Desktop-Aufnahmen; kein neues Layout und keine Änderung an Speicherschema, Lernlogik oder Domainkonfiguration.

## Grenzen

Chromium auf macOS mit simulierten Viewports; keine physische iPhone-/Android-, Safari-, Firefox- oder Screenreader-Prüfung. Nicht jede einzelne Aufgabe, sämtliche Fehlermeldungen oder jede Dialogkombination wurde manuell geöffnet. Bestehende automatische Tests sichern die Lernlogik; dies ist keine Behauptung einer vollständig ausgeführten Browser-Gesamtsuite.
