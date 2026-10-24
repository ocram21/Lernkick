# Deutsch, Bossbilanz und Schiebepuzzle

Umsetzung des Gesamtauftrags inklusive Schiebepuzzle; die Bildvorschau wurde vom Nutzer als dauerhaft sichtbare Zielvorschau mit Berglandschaft bestätigt.

## Deutsch und Daten

Deutsch öffnet unmittelbar die gemeinsame Themenauswahl: Deutschfragen, Begriffe, Satzbau, Grammatik, Rechtschreibung, Sprichwörter. Neue Profile und die einmalige Zusammenführung starten mit allen sechs Bereichen. Anschließend bleibt die Auswahl gespeichert. Die bisherigen Wortschatzresultate, Satzentwürfe und IDs bleiben erhalten; die Aktivität wird intern weiterverwendet, ohne paralleles zweites Übungssystem. Eine noch offene alte Deutschrunde lässt sich vorübergehend aus der gemeinsamen Auswahl fortsetzen.

Abgeschlossene neue gemeinsame Runden werden einmalig dem Modul Deutsch zugeordnet und laden ausschließlich diesen Roboter. Historische Wortschatzrunden und Minuten bleiben als historische Daten erhalten und werden nicht zusätzlich als Deutsch verbucht. Offene Zeitpuffer werden beim Übergang dem gemeinsamen Deutschbereich zugeordnet. Die ursprünglichen Gesamtpunkte, Level und Roboterladungen werden beim Übergang nicht neu berechnet oder erhöht. Deutschfragen benutzen weiterhin die bestehende Antwort-/Kompetenzwertung.

Der Deutschboss berücksichtigt den gesamten aktiven Deutsch- und Wortschatzbestand im globalen Niveau; deaktivierte normale Themen sind kein Bossfilter. Andere Fächer behalten ihre Auswahl geübter Themen. Siege und Niederlagen werden aus abgeschlossenen echten Bossdatensätzen oberhalb des Roboters gezählt. Testkämpfe und Abbrüche gehen nicht in diese Bilanz ein. Die Monatsstatistik bleibt unverändert nutzbar. Fünf Logotipps in Einstellungen melden jetzt zusätzlich die Aktivierung oder Deaktivierung des Testmodus.

## Abschluss und Game

Der globale Level-Hinweisblock und redundante Rückkehrknöpfe auf den Abschlussseiten entfallen. Ausgang und Noch eine Runde bleiben verfügbar. Die frühere Wortschatzkachel heißt Game und bleibt auf Position sechs. Ihre alte Trainings-Levelanzeige und deren Balken werden nicht als Puzzlefortschritt ausgegeben; die sichtbare Zahl ist das gewählte Puzzlelevel.

Das Puzzle benutzt dieselbe 4×4-Logik in beiden Leveln. 160 gültige Schiebezüge aus dem Zielzustand erzeugen eine lösbare Mischung. Nur orthogonal benachbarte Kacheln dürfen in die Lücke. Der Zielzustand ist 1–15 mit Lücke unten rechts. Zahlen- und Bildlevel sind frei wählbar; es gibt keine erfundene Freischaltung, Belohnung oder Zeitgrenze. Anordnung und gewähltes Level bleiben lokal gespeichert, neue Mischung und Wiederholung verwenden dieselben Regeln. Bildkacheln haben zugängliche Positionsnamen und eine feste sichtbare Zielvorlage. Das Spiel erzeugt keine Lernrunden, Punkte, Lernstärke oder Bossladungen.

## Bildherkunft und Offlinebetrieb

`public/games/sliding-puzzle/mountains.webp` wurde mit dem Skill imagegen und dem integrierten Bildgenerator erstellt und für die Webauslieferung als WebP komprimiert. Es wird vom Service Worker vorgeladen; das Bildlevel funktioniert nach vollständigem Online-Laden offline. Die ursprüngliche PNG-Datei bleibt unter `/Users/marco/.codex/generated_images/01a159b7-e2ac-7d72-abd2-cdc6704df165/exec-418c31ec-7345-4820-b969-970ac1176678.png` erhalten.

Generierungsauftrag: Create a square 1024x1024 full-bleed scenic mountain landscape image as the fixed image for a classic educational 4x4 sliding tile puzzle. Cheerful, detailed, clear painterly illustration with natural realistic forms, not geometric icon art. Snowy alpine mountain peak in upper center-right, blue lake with reflections lower center, wildflower meadow lower left, distinct pine tree on far left, rustic small wooden chalet middle right, winding trail and colorful flowers lower right. Every quadrant should contain distinctive shapes and colors so cut-out tiles can be recognized, avoid large empty sky or uniform areas. Peaceful, daylight, saturated natural colors, suitable for school children and adults. No letters, no numbers, no grid, no border, no UI, no text. Composition will be split into sixteen equal square cells; bottom-right cell is the puzzle's empty slot.

## Prüfung

Build und 205 Logiktests bestanden. Der gezielte Browserlauf mit 55 Fällen prüft alle sechs Deutschbereiche in beiden Niveaus einschließlich Wiederaufnahme/Satzentwurf, fünf vollständig abgeschlossene Deutschrunden, Boss-Ladung und Testmodusmeldungen, Monatsstatistik, beide Puzzlelevel bei 320/390/1440 Pixeln einschließlich Lösungsprüfung und Offline-Bild, Abschlussseiten aller fünf Fächer bei 320×568 und 844×390 sowie unveränderte N-Back-, Karten- und Einstellungsabläufe. Die Bildmetadaten enthalten den Generierungsauftrag als Sidecar; der Provenienzscan meldet keine fehlenden Einträge.

Die Sichtprüfung der neuen Puzzleansicht erfolgte auf kleinen und großen Bildschirmen. Die bestehende Farb- und Schriftwelt sowie DESIGN.md bleiben erhalten. Das neue Spiel hat eine kompakte Vorschau und behält auch bei 320×568 den Mischknopf sichtbar. Vorbestehende Build-Warnungen zur Bundlegröße und zu Kommentaren aus Drittanbieterpaketen bleiben unverändert.
