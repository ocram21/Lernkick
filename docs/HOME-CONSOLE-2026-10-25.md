# Gemeinsame Startkonsole

Umgesetzt nach `LernKick_Startseite_Aenderungen_Codex.md`. Dieser Auftrag ersetzt ausdrücklich die vorherige Einzelrahmen- und transparente Rastergestaltung.

## Dateien

- `src/App.tsx`: gemeinsame Konsole um Anzeige und neun Kacheln.
- `src/components/HomeStatus.tsx`: Score links über dem vertikal rollenden Zähler, Skill rechts mit Segmenten und feiner technischer 0/25/50/75/100-Skala. Berechnungen, Überlaufbehandlung und Animation bleiben erhalten.
- `src/components/CalculatorKey.tsx`: zusätzliche Einzelrahmenklasse entfernt; ursprüngliche plastische Tastenkappen bleiben erhalten.
- `src/design/home-status.css`: durchgehende Aluminiumoberfläche, feine unregelmäßige Kratzspuren, leichte Abschürfungen und dezenter Pinkstich. Score und Skill sind bündig zum Raster. Einfarbig türkisblaue Standard-LEDs, weiße Pink-LEDs; dunkle Vertiefung sichert LED- und Skalenkontrast. Pink-Anzeige übernimmt den vorhandenen Akzent `pink-highlight`.
- `src/design/pink.css`: Deutsch verwendet wie alle anderen Fachkacheln das bestehende Türkisblau.
- `tests/home-status.spec.ts`, `tests/home-status.test.ts`: gemeinsame Struktur, bündige Kanten, Spalten ohne Überschneidung, neue Farben, Kontraste, Skala und zusätzliche Überträge.
- `tests/daily-strength.spec.ts`, `tests/progress.spec.ts`, `tests/request-2026-10-21.spec.ts`: erwartete Startseiten-Beschriftungen auf Score/Skill aktualisiert.
- `public/release.json`, `DESIGN.md`: Release und neue verbindliche Gestaltung.

## Prüfung

- Produktionsbuild und alle 209 Unit-Tests bestanden.
- 12 Kombinationen aus Standard/Pink, normaler/kompakter Dichte und 320×568, 375×667, 390×844, 1440×900: keine Überlagerung, kein horizontaler Scrollbalken, obere Anzeige nicht höher als in der Vorversion, Anzeige und Raster bündig.
- Score-Überträge 9→10, 99→100, 5399→5400; größere Sprünge und 1000000; reduzierte Bewegung; Reload-Erhalt.
- Türkisblau aller fünf Fachkacheln, einschließlich Deutsch; einheitliche aktive LED-Farben nach Theme. Textkontrast mindestens 4,5:1, LED-Kontrast auf der dunklen Leiste mindestens 3:1.
- Bestehende Theme-Wechsel-, Offline-, Daten-, Skill-0–100-, Tagesabzug-, Boss-, Statistik-, Karten- und N-Back-Prüfungen im gezielten Browserumfang bestanden.
- Gebündelte Sichtprüfung beider Themes auf Mobil- und Desktopgrößen.

Keine Änderungen an Spiellogik, gespeicherten Daten, Werteberechnung oder Domainkonfiguration. Kein vollständiger Lauf der historischen Browser-Suite und keine gesonderte Prüfung auf physischen Geräten, in Safari/Firefox oder mit einem Screenreader.
