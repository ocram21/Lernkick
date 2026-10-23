# Fachfarben, Lernkasten, Dual N-Back und Logo

Umgesetzt nach `lernkick_codex_anweisung (1).md` und `lernkick_codex_dual_n_back_und_logo.md`.

- `src/design/palette.css`, eng begrenzt `pink.css`: Mathe türkis, Wortschatz dunkel. Vorhandene Farbtokens bleiben die Quelle. Andere Fachtasten und Farben bleiben unverändert.
- `src/components/LearningBox.tsx` und `src/style.css`: zentrierte Fachkappen, nicht gewählt türkis/aktiv violett. Vorhandene Unterrubriken bleiben erhalten. Aktionspaar unterhalb der Rubriken mit Abstand, links kleiner türkiser Plus-Button, rechts großer quadratischer gelber Start mit dynamischer Anzahl aus der vorhandenen Warteschlange. Keine separate Mengenzeile. Leere Auswahl und fällige Karten verwenden dieselben Regeln wie zuvor; neue Runde startet weiterhin nur auf explizite Aktion.
- Derselbe Header in `App.tsx` bleibt bestehen; ausschließlich gemeinsame CSS-Geometrie für Training, Lernkasten und Einstellungen ergänzt. Logo und Blitz wechseln weder Position noch Größe.
- `public/games/dual-n-back/index.html`: Mittelpunkt entfernt, Hover-Rand neutral, Eingabebestätigung 200 ms über eine getrennte temporäre Klasse. Timer werden bei Aufgabenwechsel, Pause, Ende und Verlassen entfernt. Fokuskennzeichnung bleibt unabhängig und kontrastreich. Scoring, Reize, Zeitfolge, Antworten und gespeicherte Runden bleiben erhalten.
- Release-Metadaten, vorhandenes Prüfscript und betroffene Browser-Tests verwenden den neuen Lernstartnamen. Keine Datenmigration oder Änderung von Filter-/Leitner-/Punktelogik.

## Validierung

Produktionsbuild und 184 Unit-Tests erfolgreich. Der erste gezielte Browserlauf bestand 42 von 44 Fällen; der Hover-Stil überdeckte noch die gelbe Eingabekontur. Nach Korrektur bestanden alle 34 Fälle des abschließenden Laufs einschließlich beider N-Back-Prüfungen und der fortsetzbaren Runden. Die zusätzliche Prüfung der benannten Farben im Pink-Modus bestand ebenfalls.

Geprüft auf 320, 390 und 1440 px: Fachfarben, Auswahlwechsel, Zentrierung, quadratisches Seitenverhältnis, kleinere Plus-Aktion, sichtbare Abstände, keine Überläufe und exakt gleiche Logo-/Blitz-Koordinaten in allen drei Bereichen. Eine Auswahl mit nur drei tatsächlich fälligen Karten zeigt „3 Karten“ und startet genau diese drei Karten; eigene Karten und Leitner-Stände bleiben gleich. Kartenanlage, Offline-Fortsetzung, leere Auswahl und bestehende Einstellungen sind in den Regressionstests enthalten.

N-Back mit kontrollierter Uhr in Normal-/Pink-Ansicht: kein Feldpunkt, gelber Rand nach Eingabe bis 199 ms sichtbar und bei 200 ms entfernt, trotz fortbestehendem Fokus. Separater Tastaturfokus bleibt bestehen; neue Aufgabe und Pause entfernen ausstehende Rückmeldungen. Antwortwerte bleiben je Reiz unverändert.
