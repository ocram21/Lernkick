# Einstellungen kompakt – 23.10.2026

Umgesetzt nach `lernkick_einstellungen_kompakt_codex.md`.

- `src/App.tsx`: Ausgang/Hilfe nebeneinander; Seitenüberschrift entfernt; Datensicherung unmittelbar darunter. Speicherhinweis und Installationstexte bleiben unverändert. Darstellung mit „Kompakt“ und „Mit Pink“ in einer Zeile, Erklärungstext entfernt. „Daten löschen“ ersetzt die bisherige Warnaktion; separate Fortschrittsüberschrift entfernt.
- `src/style.css`: ausschließlich ergänzende Einstellungsregeln; reduzierte Abstände, skalierbare Schrift, ausreichend große Aktionen, responsive Schalter und Navigation außerhalb des Inhalts-Scrollbereichs. Die geerbte Navigationstransformation ist auf dieser Seite aufgehoben. Safe Areas werden am Seitenrahmen berücksichtigt, ohne doppelten unteren Abstand.
- `src/design/compact.css`: kleinere Absatz-/Überschriftenabstände ausschließlich in den Einstellungen bei aktivem Kompaktmodus.
- `src/components/ResetProgressDialog.tsx`: Erklärung benennt laufende Übungen und den Erhalt der Lernstärke deutlicher. Bestätigung, Checkbox und Löschfunktion bleiben unverändert; eigene Karten, Einstellungen, Gesamtpunkte, neue Level und Endgegner-Erfolge bleiben wie zuvor erhalten. Kein zusätzlicher Löschumfang, keine Migration und kein Reset durch das Update.
- Bestehende Browser-Tests und `scripts/check-live.mjs` verwenden die neuen Aktionsnamen. Release-Kennung: `2026-10-23-compact-settings`. Keine Änderungen an Aufgaben, anderen Oberflächen oder Farbschemata.

## Prüfung

Produktionsbuild und alle 184 Unit-Tests erfolgreich. 47 bestehende Browser-Regressionstests bestanden; alle sechs neuen Einstellungsprüfungen bestanden nach Korrektur der geerbten Navigationsposition.

Eingeklappte Seite ohne vertikales oder horizontales Scrollen bestätigt: iPhone-Viewport 375×812, Android-Viewport 360×800 und verkürzter Viewport 390×744. Ausgang/Hilfe und die beiden Darstellungsschalter stehen jeweils nebeneinander. Navigationsbuttons bleiben vollständig sichtbar und überdecken keinen Inhalt.

Zusätzlich geprüft: 320×568 sowie 375×667 mit 150 % Schriftgröße, geöffnete Lehrplanquellen und deren letzter Hinweis erreichbar, Navigation weiter bedienbar. Export/Import mit Inhaltsvergleich, Schalter per Tastatur, gespeicherte Einstellungen nach Neustart, Hilfe und sichere Löschabfrage einschließlich Abbrechen und unverändertem Löschumfang. Gespeicherte Karten und Lernstände werden beim bloßen Öffnen und Ändern der Darstellung nicht verändert.

Die Veröffentlichung wird über den bestehenden Pages-Workflow ausgelöst; Domain- und Hostingkonfiguration bleiben unverändert. Live-Erfolg wird nur bei tatsächlicher Bestätigung gemeldet.
