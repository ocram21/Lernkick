# Erweiterung vom 17.10.2026

Umsetzung des übergebenen Änderungsauftrags „Lern-Kick_Codex_Anforderungen.md“. Bestehende Gestaltung, sechs Lernbereiche, Lernrunden, Fortschritt, Sicherungen und persönliche Daten bleiben erhalten. Der untere Schriftzug samt Motto ist vollständig entfernt; der obere App-Titel bleibt.

## Karten

Suche in Frage und Antwort, bestehender Fachfilter, Sortierung Neueste zuerst / Älteste zuerst / Alphabetisch. Zunächst zehn passende Karten; „Weitere anzeigen“ blendet jeweils zehn weitere ein. Änderungen an Suche, Fach oder Sortierung beginnen wieder mit zehn. Neue Karten haben ein optionales Erstellungsdatum; Bearbeiten verändert es nicht. Alte Karten ohne Datum bleiben gültig und erhalten keinen erfundenen Zeitpunkt: persönliche Karten stehen vor Standards, innerhalb gleich alter Bestände dient die bisherige Reihenfolge als stabiles Kriterium. Standardkarten sind ohne Einzeldatum enthalten. Wiederherstellen, Bearbeiten, Löschen und Wiederholen bleiben verfügbar. Das Fragenfeld einer neuen Karte bleibt leer.

Kein Wechsel der Datenbank oder Sicherungsversion nötig: `createdAt` ist eine optionale Ergänzung der bestehenden Kartenstruktur. Sicherungen der Versionen 1–3 bleiben lesbar, persönliche Änderungen und Ausblendungen erhalten.

## Lernspiele

Ein eigener Einstieg „Lernspiele“ unter den sechs bestehenden Bereichen führt zu vier getrennt auswählbaren Spielen:

- Kreuzworträtsel: zwei tatsächlich gekreuzte Begriffe; gewählter Hinweis und Bildschirmbuchstaben. Kleine Rätsel halten die komplette Ansicht auf dem Handy erreichbar.
- Wortsalat: Buchstaben zu einem vorhandenen Begriff ordnen, korrigieren und prüfen.
- Zahlenrätsel: kurze Aufgaben direkt aus dem bestehenden Mathe-Fragenkatalog; Rückmeldung mit vorhandener Erklärung, anschließend eine neue Aufgabe.
- Galgenraten: klassischer Galgen und Strichmännchen als SVG-Linien, sechs Fehlversuche, Buchstabentasten, Auflösung.

Begriffe und Hinweise stammen aus den persönlichen Karten und dem Wortschatz. Fragen nach einzelnen Begriffen werden erkannt; unbekannte, zu lange oder ungeeignete Karten werden nicht als Wörter geraten. Begriffe vier bis zwölf normalisierte Buchstaben, Hinweise höchstens 180 Zeichen; fürs kompakte Kreuzworträtsel höchstens sieben Buchstaben und 100 Zeichen Hinweis. Keine zweite Definitionensammlung. Entfernte oder persönlich geänderte Inhalte werden berücksichtigt; unpassende Änderungen ergeben keine automatische neue Wortantwort. Umlaute werden als AE/OE/UE, ß als SS gesetzt und bei Wortspielen erklärt.

Bildschirmtasten lösen keine zusätzliche Betriebssystem-Tastatur aus; eine Hardwaretastatur ist optional möglich. Responsive Anordnung hält auch bei reduzierter Ansichtshöhe Bedienelemente sichtbar. Die Spiele sind nach dem ersten vollständigen Laden offline verfügbar. Es gibt keine Spielzeit, Strafen, Konten oder zusätzlichen Fächer. Spielrunden verändern keine Kompetenznachweise oder Fortschrittsfelder. Laufende Spiele lassen sich mit bestehender Abbruchbestätigung verlassen; abgeschlossene Spiele direkt.

## Feedback und noch nötige Einrichtung

In Einstellungen öffnet „Feedback geben“ das Formular mit freiwilligem Namen/Bereich und Pflichtnachricht. Ein Hinweis erklärt Öffentlichkeit und Verzicht auf sensible Angaben. Ohne konfigurierten Server ist der Versand ausdrücklich deaktiviert. Bei Fehlern bleibt der Text im offenen Formular; Erfolg wird erst nach bestätigtem Issue-Versand gemeldet. Keine automatische Wiederholung bei unklarem Versandstatus.

Serverloser Endpunkt, GitHub-Secret nur auf dem Server, Validierung, begrenzter Request-Body, eingeschränkte Origin und zwei verpflichtende Kurzzeitbegrenzer sind vorbereitet. **Noch extern nötig:** Cloudflare-Worker bereitstellen, neuen GitHub-Token ausschließlich mit Issues-Schreibrecht für das bestehende Repository und ein Zufalls-Secret hinterlegen, öffentliche Endpoint-URL als Repository-Variable setzen und die App erneut bauen. [Schrittfolge und Grenzen](FEEDBACK-EINRICHTEN.md). Keine vorhandenen CLI-Zugangsdaten werden zweckentfremdet. Ein echter Versand ist ohne diese Einrichtung nicht möglich und wird nicht als getestet behauptet.

## Prüfung

56 Logiktests bestehen einschließlich Wortquellen, echter Kreuzungen, Buchstabenmischung, Kartenreihenfolge, Datenverträglichkeit und serverseitigem Feedbackversand mit simuliertem GitHub. TypeScript-Prüfung umfasst Frontend und separat den Worker. Browserprüfungen decken die vorhandenen Lernfunktionen, Kartenfilter, vier Spiele bis zum Abschluss, falsche Antworten und Auflösung, Abbruch, Offline-Nutzung und Layouts 320×568, 390×420, 844×390 und 1440×900 ab. Zusätzlich wird der Feedbackversand in einer getrennten Testkonfiguration mit simuliertem Server geprüft; die öffentliche App enthält diese Testadresse nicht. Installation auf echten Geräten und echter Feedbackversand nach Einrichtung bleiben Praxisschritte.
