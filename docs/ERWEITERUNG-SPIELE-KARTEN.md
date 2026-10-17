# Erweiterung vom 17.10.2026

Umsetzung des übergebenen Änderungsauftrags „Lern-Kick_Codex_Anforderungen.md“. Bestehende Gestaltung, sechs Lernbereiche, Lernrunden, Fortschritt, Sicherungen und persönliche Daten bleiben erhalten. Der untere Schriftzug samt Motto ist vollständig entfernt; der obere App-Titel bleibt.

## Karten

Suche in Frage und Antwort, bestehender Fachfilter, Sortierung Neueste zuerst / Älteste zuerst / Alphabetisch. Zunächst zehn passende Karten; „Weitere anzeigen“ blendet jeweils zehn weitere ein. Änderungen an Suche, Fach oder Sortierung beginnen wieder mit zehn. Neue Karten haben ein optionales Erstellungsdatum; Bearbeiten verändert es nicht. Alte Karten ohne Datum bleiben gültig und erhalten keinen erfundenen Zeitpunkt: persönliche Karten stehen vor Standards, innerhalb gleich alter Bestände dient die bisherige Reihenfolge als stabiles Kriterium. Standardkarten sind ohne Einzeldatum enthalten. Wiederherstellen, Bearbeiten, Löschen und Wiederholen bleiben verfügbar. Das Fragenfeld einer neuen Karte bleibt leer.

Kein Wechsel der Datenbank oder Sicherungsversion nötig: `createdAt` ist eine optionale Ergänzung der bestehenden Kartenstruktur. Sicherungen der Versionen 1–3 bleiben lesbar, persönliche Änderungen und Ausblendungen erhalten.

## Galgenraten

Der eigene quadratische Button „Galgenraten“ mit schlichtem Galgensymbol steht direkt neben den bisherigen Bereichen auf der Startseite. Es gibt keine zusätzliche Spielauswahlseite. Alle anderen Fächer und Lernformen bleiben erhalten. Die bisherigen weiteren Spiele samt Auswahl-, Spiel- und Darstellungscode sind entfernt.

Begriffe und Hinweise stammen weiter aus den persönlichen Karten und dem Wortschatz: vier bis zwölf Buchstaben und Hinweise bis 180 Zeichen. Ausgeblendete und bearbeitete Karten bleiben berücksichtigt. Es gibt keine zweite Definitionensammlung und keine Änderungen am gespeicherten Lernstand durch Spielrunden.

Ä, Ö, Ü und ß sind eigene Buchstaben und eigene Bildschirmtasten. Klein- und Großbuchstaben werden gleich behandelt; ß und ẞ gehören zusammen, ß bleibt aber von S und SS getrennt. Wiederholte Eingaben kosten keinen weiteren Versuch. Hardwaretastatur und Touch sind nutzbar; die Bildschirmtasten öffnen keine zusätzliche OS-Tastatur.

Zehn Fehlversuche, anfangs leere Zeichnung. Pro Fehler erscheint genau ein Element:

1. Fuß
2. Stütze
3. Querbalken
4. Seil
5. Kopf
6. Körper
7. Linker Arm
8. Rechter Arm
9. Linkes Bein
10. Rechtes Bein

Verbleibende Versuche und Zeichnung nutzen denselben Fehlerzähler. Vollständiges Erraten gewinnt, der zehnte unterschiedliche Fehler beendet die Runde mit Auflösung. Nach Ende sind Eingaben gesperrt, auch bei sehr schnellen Eingaben. Neustart setzt Buchstaben, Zähler, Zeichnung und Auflösung zurück. „Lösung zeigen“ bleibt als freiwillige Hilfe erhalten. Offline nutzbar. Feedback- und Issuefunktion bleiben vollständig entfernt.

## Geänderte Dateien und Prüfung

- `src/components/Hangman.tsx`: vereinfachte Spielansicht, Galgensymbol, zehn Zeichnungsstufen und Eingaben; ersetzt die bisherige Komponente für mehrere Spiele.
- `src/games/engine.ts`: nur noch Begriffe, Normalisierung und Galgenraten-Zustand; ungenutzte Spielfunktionen entfernt.
- `src/App.tsx`: direkter Startbutton, keine Auswahlseite, Rückkehr zur Startseite.
- `src/style.css`: nur noch benötigte Spielstile und responsive Darstellung.
- `tests/extensions.test.ts` und `tests/extensions.spec.ts`: Sonderzeichen, wiederholte Eingaben, zehn einzelne Zeichnungsschritte, Sieg, Niederlage, Neustart, schnelle Eingaben, Maus/Touch, Offline-Nutzung und Kartenfilter.
- README, Produkt- und Designkontext auf den aktuellen Umfang gebracht.

53 Logiktests und 49 Browserprüfungen bestehen; Produktionsbuild und TypeScript-Prüfung erfolgreich. Browserprüfung auf 320×568, 390×844, 390×420, 844×390 und 1440×900. Startseite und aktive Spielansicht ohne Scrollen auf diesen Größen geprüft. Die zehn Zeichnungsschritte werden einzeln geprüft, nicht nur als fertiges Bild. Datenstruktur und Sicherungen bleiben unverändert. Eine Prüfung auf echten Mobilgeräten wird dadurch nicht behauptet.
