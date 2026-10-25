# Punkte, Lernstärke und Kachelrahmen

Umsetzung von `lernkick_codex_punkte_led_rahmen.md`.

## Geänderte Dateien

- `src/components/HomeStatus.tsx`: sechsstelliger Rollenzähler, vollständige Darstellung größerer Zahlen, gleichzeitiges Rollen nur geänderter Ziffern, segmentierte Lernstärke mit zugänglichem Meter. Keine neuen gespeicherten Daten.
- `src/App.tsx`: bindet die Anzeige an die bestehenden Werte an; hält die zuletzt sichtbare Anzeige im Arbeitsspeicher, damit Rückkehr aus einer Übung animiert werden kann.
- `src/components/CalculatorKey.tsx`: gemeinsame Materialklasse für die neun Hauptmenütasten.
- `src/design/home-status.css`, `src/main.tsx`: zentrale Material-, Zahlenfenster- und LED-Rollen; dünne CSS-Aluminiumränder, zurückhaltende Gebrauchsspuren, keine neue Trägerplatte. Berücksichtigt Betriebssystem und vorhandene Einstellung für reduzierte Bewegung.
- `tests/home-status.spec.ts`, `tests/home-status.test.ts`: Ziffernwechsel, Übertrag, größere Sprünge, Überlauf, reduzierte Bewegung und Vergleich mit den Abmessungen der Vorversion.
- `tests/progress.spec.ts`, `tests/request-2026-10-21.spec.ts`: bisherige native Progress-Erwartungen an die ausdrücklich angeforderte LED-Anzeige angepasst.
- `public/release.json`, `DESIGN.md`: Releasekennung und Designbeschreibung.

## Geprüft

- Produktionsbuild und alle 209 Unit-Tests bestanden.
- 12 Kombinationen aus Pink/Normal, 320×568, 375×667, 390×844 und 1440×900 einschließlich kompakter Darstellung: Anzeige nicht höher als zuvor; erste Kachel an unveränderter Position; keine Scrollbalken, Überlappung oder gemeinsame Hintergrundfläche.
- Punktewechsel über den normalen Sicherungsimport: 005390 → 005391, 005399 → 005400, größerer Sprung und 1000000. Nur betroffene Ziffern rollen; gleichzeitig und kurz. Mit reduzierter Bewegung keine Animation. Nach Reload bleiben Punkte erhalten.
- LED-Stände 0/6/25/80/100 Prozent, exakter zugänglicher Prozentwert und bestehender Tagesabzug. Berechnung, Datenformat und Skala unverändert.
- Statistik über die Anzeige erreichbar, Kartenpositionen und Kachelinhalte erhalten. Materialrahmen fangen keine Eingaben ab.
- Gebündelte Sichtprüfung beider Themes auf Mobil- und Desktopgrößen.

## Grenzen

Chromium auf macOS mit simulierten Viewports; keine gesonderte Prüfung auf physischen Mobilgeräten, in Safari/Firefox oder mit einem Screenreader. Nicht die gesamte historische Browser-Suite ausgeführt; bestehende, inzwischen ersetzte Wortschatzabläufe sind nicht Teil dieser Änderung.
