# Skill-Segmente, schlankere Konsole und gekoppelter Score

Umgesetzt nach `Lernkick_Startseite_Anpassungen.md`.

## Änderungen

- `src/components/HomeStatus.tsx`: sichtbare Skill-Prozentzahl entfernt; genau 20 LEDs, je ein Segment für fünf vollständig erreichte Prozentpunkte. Zwischenwerte werden nur für die LED-Anzahl abgerundet; gespeicherter Wert und zugänglicher Meterwert bleiben unverändert. Beispiel 11,3 %: zwei leuchtende LEDs, exakter Meterwert 11,3 %.
- Score verwendet vollständige Zahlenrollen (0–9 plus Anschluss-0). Einer laufen vorwärts, höhere Rollen bewegen sich am Übertrag mit. Animation über `requestAnimationFrame`, getrennt von der bestehenden Punktevergabe, ungefähr 2,8 Sekunden. Große Gewinne: fortlaufender Anfang und Schluss mit beschleunigtem Mittelteil. Der endgültige Wert ist exakt der gespeicherte Score.
- Die zuletzt sichtbare Zielpunktzahl wird weiterhin nur im Arbeitsspeicher gehalten. Das Ziel wird sofort als gesehen markiert: kein doppeltes Abspielen nach Verlassen während der Animation, erneutem Öffnen oder Reload. Reduzierte Bewegung überspringt das Zählen.
- `src/App.tsx`: vorhandene Einstellung für reduzierte Bewegung an die Animation weitergegeben.
- `src/design/home-status.css`: Konsole 8 px weiter unter der Steuerungszeile und um 12 px schmaler; Raster mit reduziertem Seitenpadding. Der seitliche Abstand von Platte zu Kacheln überschreitet den jeweiligen Kachelabstand nicht. Skala und Farben bleiben erhalten.
- `tests/home-status.spec.ts`, `tests/home-status.test.ts`: mechanische Überträge, monotone begrenzte Zählwege, echter Übungsabschluss, Wiedereinstieg, große Gewinne, reduzierte Bewegung, 20 LEDs, Zwischenwerte, Abstände und Kontraste.
- `tests/daily-strength.spec.ts`, `tests/progress.spec.ts`, `tests/request-2026-10-21.spec.ts`: Prüfungen an den nun unsichtbaren Prozenttext und die vollständigen Zahlenrollen angepasst. Bestehender Skill-Tagesabzug bleibt unverändert.
- `public/release.json`, `DESIGN.md`: Release und Gestaltungsregeln.

## Geprüft

Produktionsbuild und alle 211 Unit-Tests. 35 unterschiedliche gezielte Browserprüfungen einschließlich zwölf Kombinationen aus beiden Farbmodi, normaler/kompakter Dichte und Mobil-/Desktopgrößen. Kein horizontales Scrollen oder überlagerter Inhalt; Anzeige und Raster bündig, Ränder höchstens so breit wie die Kachelzwischenräume.

Score-Wechsel 9→10, 99→100, 100→200 sowie größere Sprünge bis 1000000. Fortlaufende Zwischenstände und Überträge, Endwert nach spätestens drei Sekunden, echter Mathematik-Rundenabschluss, Verlassen während des Zählens, Wiederkehr ohne Wiederholung, Reload und reduzierte Bewegung. Vollständige Zwischenaufnahme des Übertrags bestätigt die vertikale Kopplung.

Skillwerte 0, 4,9, 5, 11,3, 50, 99,9 und 100: genau 20 Segmente, korrekte Fünferschritte, exakter Meterwert, unveränderte Skala. Theme-Wechsel, Offline-Nutzung, Datenbestand, Skill-Tagesabzug und bestehende Navigation im gezielten Regressionsumfang geprüft.

Keine Änderung der Punktevergabe, des Skill-Modells, des Speicherschemas oder der Domain. Chromium auf macOS mit simulierten Viewports; keine gesonderte physische Geräte-, Safari-/Firefox- oder Screenreader-Prüfung und kein vollständiger Lauf der historischen Browser-Suite.
