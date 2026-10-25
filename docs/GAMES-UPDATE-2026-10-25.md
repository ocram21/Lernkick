# Lernkasten, Games, Hauptstadt-Zuordnung und Kacheln

Umgesetzt nach den zuletzt übergebenen Dateien `Lernkick_Aenderungen_2026-10-25_aktualisiert.md` und `lernkick_kacheln_games_anweisung.md`; die unveränderten Anforderungen der ursprünglichen Spezifikation sind enthalten.

## Umsetzung und Dateien

- `src/components/LearningBox.tsx`: In der Auswahl werden Lernkarte, Antwort und alter Abschluss-/Abbruchbereich nicht gerendert. Die gespeicherte Kartensitzung bleibt erhalten. Unveränderte passende Auswahl setzt die Karte fort; nach Fach-/Rubrikwechsel kann die bestehende neue Rundenauswahl gestartet werden.
- `src/components/GameHub.tsx`: Drei direkt anwählbare eigenständige Spiele mit den Nummern 1/2/3; keine Level oder Freischaltung.
- `src/components/SlidingPuzzle.tsx`: Bestehendes Zahlen- und Bildpuzzle, jeweils eigenes Brett. Kein automatischer Neustart nach einem Sieg; „Neue Runde“ setzt nur das ausgewählte Spiel zurück.
- `src/components/Codebreaker.tsx`, `src/games/codebreaker.ts`: Vier verschiedene Farben aus sechs bestehenden Standardfarben, bis zu zehn Versuche; korrigierbarer und gespeicherter Entwurf. Frühere Versuche bleiben sichtbar; aggregierte schwarze/weiße Treffer. Ende bei Erfolg oder zehn Fehlversuchen, dann gegebenenfalls Lösung. Platzsparende Hilfe.
- `src/games/arcade.ts`: Einheitlich einmal 100 Score für einen Sieg, null bei Verlust/Abbruch; keine Geschwindigkeitsboni. Getrennte Erfolgszähler und eigene Rundennummern. Punkte und Abrechnungsereignis werden gemeinsam im bestehenden UserData-Datensatz gespeichert.
- `src/games/slidingPuzzle.ts`: Additive, validierte Rundendaten und Codeknacker-Sitzung am bestehenden Puzzle-Schema. Alte `level`- und `boards`-Daten bleiben für Kompatibilität erhalten; Level-Bezeichnungen sind in der Oberfläche entfernt.
- `src/lib/storage.ts`, `src/games/arcadeRecovery.ts`: Originalstand vor der ersten Arcade-Erweiterung unter `backup.before-arcade` sichern. Bestehende transaktionale Speicher- und Konfliktprüfung wiederverwenden. Die Arcade-Daten werden im selben Vorgang zusätzlich unter `arcade.current` profilgebunden gesichert. Entfernt eine ältere Oberfläche die ihr unbekannten Code-/Rundenfelder, werden sie beim nächsten Laden wiederhergestellt; bewusst gespeicherte aktuelle Felder werden nicht ersetzt.
- `src/components/CalculatorKey.tsx`: Alle Kachel-Fortschrittsbalken entfernt. Games-Stern rechts neben dem Titel; drei nummerierte Erfolgszeilen ohne ausgeschriebene Spielnamen. Fachrunden, Zahlen, N-Back-Erfolge und Bossangaben bleiben erhalten und stehen tiefer.
- `src/design/game-updates.css`, `src/main.tsx`: Skill-LEDs in beiden Designs `calc-orange`; gleichmäßiger 3-px-Plattenrand einschließlich Unterkante. Kachelgrößen beibehalten. Einstellungen nur farblich angepasst: violette Hilfe und schiefergraue Sicherungsbuttons, Weißtext. Violett auf `#8152ea` leicht abgedunkelt, damit kleiner Weißtext ausreichenden Kontrast hat. Hauptstadt-Zuordnungen in drei Spalten mit großflächigen Touchzielen. Codeknacker ohne Seiten-Scrollen, aktive Eingaben mindestens 44 px.
- `src/App.tsx`: Games-Hub einbinden; Hilfetext zu Spielen und deren Punkten aktualisieren. Spiel-Score wird beim Zurückkehren mit dem vorhandenen gekoppelten Zählwerk dargestellt.
- `public/release.json`, `DESIGN.md`: Release `2026-10-25-games-codebreaker` und aktualisierte Designregeln.

## Daten und einmalige Abrechnung

Die Datenversion bleibt 7, Journey-Version 1; neue Puzzle-Felder haben kompatible Standardwerte. Alte Zahlen-/Bildbretter werden unverändert übernommen. Ohne vorher gespeicherte Einzel-Erfolgsdaten starten die neuen Zähler bei null; abgeschlossene Altbretter erhalten beim Öffnen keine rückwirkenden Punkte.

Jede neue Runde hat eine eigene ID. Ein Sieg schreibt in derselben Speicherung 100 Punkte und ein `arcade:<Spiel>:<Runden-ID>`-Ereignis. Daraus werden die dauerhaften drei Erfolgszähler abgeleitet. Bereits verbuchte IDs werden nicht erneut gutgeschrieben. Bestehender Sicherungsimport behält Ereignisse desselben Profils bei; der vorhandene Mehrfenster-Konfliktschutz verhindert konkurrierende Doppelgutschriften. Andere Profile werden wie bisher getrennt übernommen.

Spielstände umfassen beide Puzzle-Bretter und deren Runde sowie Code, Versuche, Entwurf und ausgewählte Position des Codeknackers. Wechseln, Verlassen, Reload und Offline-Nutzung löschen sie nicht. Eine neue Runde verändert ausschließlich das gewählte Spiel. Skill, Fachfortschritt, Bossladungen und Lernzeit bleiben von Arcade-Siegen unberührt.

## Prüfung

- Produktionsbuild und alle 220 Unit-Tests bestanden.
- 20 neue gezielte Browserprüfungen plus bestehende relevante Regressionen; insgesamt 69 unterschiedliche geprüfte Fälle im fokussierten Umfang.
- Codeknacker vollständig in 320×568, 375×667, 390×844, 1440×900 und 844×390, jeweils Standard/Pink: zehn Versuchsreihen, aktive Eingaben mindestens 44 px, kein vertikaler/horizontaler Seiten-Scroll. Auch Verlust-/Lösungsansicht auf 320×568 geprüft.
- Gewinne in Zahlenpuzzle, Bildpuzzle und Codeknacker geben je einmal 100. Weitere neu gestartete Runden zählen erneut; Verlust gibt null. Getrennte Zähler, dauerhafter Entwurf, Reload, Offline-Wechsel und bestehende Score-Animation geprüft.
- Zwei parallele Fenster können dieselbe Runde nicht doppelt vergüten. Alte Puzzle-Datei wird gesichert; beide Bretter, Score und Einstellungen bleiben erhalten. Wiederherstellung einer bereits abgerechneten Runde desselben Profils vergütet nicht erneut.
- Lernkasten mit ausgeblendeter Karte und erhaltenem Antwortzustand in beiden Themes; Fachwechsel und expliziter Neustart; Kartenerstellung und vorhandene Sicherungen.
- Drei Hauptstadt-Spalten auf 320/390 px ohne Seiten-Scroll, vollständige Deutschlandrunden auf Mobil, Querformat und Desktop sowie Pointer-Zuordnung geprüft.
- Fachrunden, Boss-Testmodus, Monatsstatistik offline, N-Back-Eingaben und Stufenauswahl, Kachel- und Konsolenlayout im bestehenden Regressionsumfang abgesichert.
- Gebündelte Sichtprüfung der tatsächlichen Mobil-/Desktopoberflächen. Keine neuen Abhängigkeiten und keine Änderungen an Domain-/Pages-Konfiguration.

## Grenzen und Namenshinweis

Chromium auf macOS mit simulierten Viewports; keine separate physische Geräte-, Safari-/Firefox- oder Screenreader-Prüfung. Nicht die komplette historische Browser-Suite ausgeführt; ältere, bereits ersetzte Wortschatzabläufe sind nicht Teil dieses Auftrags.

Die vorgegebene Bezeichnung „Codeknacker“ wurde übernommen. Eine begrenzte Suchindex-Abfrage für DPMAregister ergab keine indexierten Treffer; daraus lässt sich keine vollständige markenrechtliche Freigabe ableiten.
