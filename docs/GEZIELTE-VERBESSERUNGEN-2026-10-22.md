# Gezielte Verbesserungen – 22.10.2026

Umgesetzt entsprechend `Lern-Kick_Codex-Anweisung_2026-10-22.md`:

- Mathematik: bestehende Zahlenbereiche moderat erhöht. „Kleines Einmaleins“ ist separat bei Grundrechenarten wählbar; die Faktoren bleiben höchstens zehn. „Gleichungen“ erzeugt je nach Leicht/Mittel/Schwer eine, zwei bzw. beide Seiten mit x betreffende Umformungen. Keine Gleichungssysteme oder zusätzlichen Schwierigkeitsmodi.
- Gleichungen: eine Operationszeile hinter `|`, Prüfung und gespeicherte Rechenschritte. Addition/Subtraktion linearer Terme sowie Multiplikation/Division mit Zahlen ungleich null werden auf beide Seiten angewandt. Exakte gekürzte Brüche vermeiden Rundungsfehler; negative Zahlen, Dezimalkomma und Brüche sind möglich. Eine vollständig mitgeschriebene Gleichung vor `|` wird mit der aktuellen Zeile verglichen. Unterschiedliche Reihenfolgen und Lösungen mit x rechts oder links werden akzeptiert. Division durch variable Terme, Nulloperationen bei Multiplikation/Division und ungültige Syntax werden ohne Lösungshinweis zurückgewiesen. Zahlen und Zeilenzahl sind zum Schutz des lokalen Speichers begrenzt. Keine Musterweg-Prüfung.
- „Ausgang“ bleibt Verlassen mit späterer Fortsetzung. „Übung beenden“ steht bei unvollendeten Fach-/Spielrunden im vorhandenen Pausebereich, im Wortschatz-Auswahlmenü und im Lernkasten. Es löscht nur den jeweiligen temporären Rundenschnappschuss. Mathematik kehrt zur Kategorieauswahl zurück, die anderen Übungen zu ihrem regulären Startbildschirm. Bereits gespeicherte Antworten, Punkte, Lernstärke, Karten und Ergebnisse bleiben. N-Back behält das zuvor beauftragte Beenden beim Ausgang.
- Galgenraten: je 40 neue anspruchsvollere Begriffe für Normal und Streber; 80 bisherige Begriffe werden ausschließlich zum Fortsetzen alter Runden lesbar gehalten. Neue Runden wählen daraus nicht mehr. Zehn Fehlversuche, QWERTZ und Umlaute/ß unverändert.
- Sprichwörter: 20 zusätzliche, eindeutige Beispiele; jetzt 40 je Stufe, insgesamt 80. Bisherige IDs/Ergebnisse bleiben. Satzbau- und Grammatikdateien unverändert.
- Biologie: 31, Geografie: 30, Sozialkunde: 29 einfachere Fragen zu Anwendungs-, Ursachen- und Zusammenhangsfragen überarbeitet. Bereits entsprechende anspruchsvollere Aufgaben bleiben. Pro Fach weiterhin 100 Fragen, stabile IDs und Kompetenzzuordnungen. Gespeicherte aktuelle Aufgaben bleiben Schnappschüsse ihrer bisherigen Fassung.
- Im Hauptmenü nur den angeforderten Zeit-Skalenzusatz entfernt; keine Ersatzbeschriftung. Lernstärke, Balken und Berechnung unverändert.

## Quellen und Inhaltssicherung

Die vorhandenen Fachlehrpläne mit Abschnittsbezügen bleiben in den Datenpaketen hinterlegt. Die neuen Fragen verwenden eigenständige Formulierungen und wurden auf eindeutige Lösungen, verständliche Sprache und doppelte Aufgaben geprüft. Ergänzender Sachabgleich: [Bundestag: Gewaltenteilung](https://www.bundestag.de/parlament/aufgaben/rechtsgrundlagen/gewaltenteilung-246408), [Grundgesetz](https://www.gesetze-im-internet.de/gg/BJNR000010949.html) sowie die schon dokumentierten biologischen und geografischen Grundlagen. Externe fachliche Unterrichtsfreigabe wird weiterhin nicht behauptet.

## Speicherung und Veröffentlichung

Datenformat 4 und die IndexedDB bleiben. Rundendaten werden um optionale Gleichungskoeffizienten und Operationszeilen erweitert. Bisherige Sicherungen bleiben lesbar; keine automatische Löschung alter Fortschritte. Das neue Generator-Operationsmerkmal wird von älteren Clients nicht akzeptiert, damit diese Gleichungsstände nicht still in Multiple-Choice zurückverwandeln.

GitHub Pages ist nach Prüfung auf **https://lernkick.eu/** eingerichtet, HTTPS aktiv. **lernkick.de ist diesem Pages-Projekt nicht zugeordnet**. Keine Domain-, Pages- oder DNS-Einstellung wurde geändert. Eine Nutzung von lernkick.de erfordert eine gesondert abgestimmte Zuordnung und gegebenenfalls DNS-Konfiguration.

## Tests und Grenzen

Unit-Tests prüfen mehrere mathematisch gleichwertige Wege, x auf beiden Seiten, negative Zahlen, Brüche, Dezimalkomma, Division und fehlerhafte Eingaben sowie den Erhalt beim Serialisieren. Browserprüfungen prüfen freie Gleichungsschritte, Fortsetzung offline, Beenden ohne Punkteverlust und Erreichbarkeit der Kategorieauswahl. Mobile Ansichten werden mit Chrome emuliert; eine physische Android-/iOS-Abnahme und externe Fachabnahme bleiben offen.

Ergebnisse vor Veröffentlichung: **130 Unit-Tests und 158 Browser-Tests erfolgreich**, Produktionsbuild erfolgreich. Nach dem Kontrast-Fix wurden die fünf neuen Browserprüfungen nochmals erfolgreich ausgeführt. Der lokale Veröffentlichungs-Prüflauf bestätigt PIN, bestehende Kartenerstellung, Offline-Neustart, freie Gleichungsumformungen, Ablehnung von Division durch null und Rückkehr zur Kategorieauswahl nach Beenden. Sichtprüfung: zunächst `fix` wegen blasser Platzhalterschrift, nach erneuter Prüfung `ship`; keine offenen materiellen Befunde. Der mechanische Scan hatte keine primären Befunde, nur vorhandene Schriftgrößen-/Radienhinweise.
