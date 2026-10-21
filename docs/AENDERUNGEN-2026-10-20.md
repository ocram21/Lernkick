# Änderungsauftrag vom 20. Oktober 2026

## Umsetzung

- Mathematik startet in gemischten Runden mit drei Additionen mit echtem Zehnerübergang. Danach folgen zunächst vier Subtraktionen mit negativen Ergebnissen. Nach Fehlern bleibt die vorhandene Unterstützung verfügbar. Der Zahlenstrahl zeigt Start, Null, Richtung und Ergebnis.
- Vor neuen Mathematikrunden sind Gemischt, Grundrechenarten, Negative Zahlen, Brüche, Prozentrechnung, Überschlag und Weitere Themen wählbar. Leicht, Mittel und Schwer sind unabhängig davon auswählbar. „Lernweg“ heißt jetzt „Stufe“; die Auswahl enthält genau diese drei Optionen.
- Negative Zahlen, Bruchanteile, Prozentanteile und Überschläge haben zusätzliche deterministisch prüfbare Zahlenvarianten. Bestehende Aufgaben und Kompetenz-IDs bleiben erhalten. Konkrete beantwortete Aufgaben pausieren zunächst einen Tag, nach zwei richtigen Antworten sieben Tage. Die Variantenhistorie und die Einzelstände generierter Mathematikaufgaben sind auf jeweils 2.000 Einträge begrenzt; aggregierte Kompetenzstände bleiben erhalten. Bereits vorhandene Einzelstände fließen ebenfalls in die Sperre ein.
- Lernstärke bleibt von Punkten getrennt: Die bestehende Rate von zehn Prozentpunkten je 30 Minuten aktiver Übung bleibt bestehen. Sichtbare Übungszeit wird jetzt alle fünf Sekunden erfasst, bis höchstens 30 Sekunden nach der letzten Eingabe. Versteckte Tabs und Menüs zählen nicht. Eine Nachkommastelle macht kleine Fortschritte sichtbar. Frühere aktive Zeit lässt sich nicht verlässlich aus Punkten rekonstruieren und wird deshalb nicht nachträglich erfunden. Eine zusätzliche Lernstärke je Kategorie wurde als optionale Erweiterung weggelassen.
- Richtige Antworten wechseln standardmäßig nach zwei Sekunden weiter, auch im Satzbau und bei der letzten Frage. Anhalten und manuelles Weitergehen bleiben verfügbar. Fehler bleiben ohne Zeitlimit stehen. Timer werden beim Verlassen abgeräumt; eine zusätzliche Sperre verhindert doppelte Übergänge.
- Deutsch hebt zitierte Beispiele in Orange hervor; die folgende Frage behält ihre normale Textfarbe. Galgenraten hat drei QWERTZ-Reihen einschließlich Ü, Ö, Ä und ß.
- Alltag und Beruf bieten über den vorhandenen Streber-Schalter jeweils zehn anspruchsvollere zusätzliche Begriffe mit derselben Antwortmechanik.
- Satzbau behält alle 200 festen Aufgaben und ergänzt 240 stabile Kombinationen aus geprüften Namen und Satzbausteinen. Drei Strukturen variieren Hauptsätze, vorangestellte Zeitangaben und Nebensätze. Lösungen verwenden jeden Baustein genau einmal; kürzlich bearbeitete Sätze werden zurückgestellt. IDs und Reihenfolgen bleiben beim Wiederöffnen stabil.
- Dual N-Back zeigt links ausschließlich „Position“, rechts „Audio“, mit größeren Flächen. Der laufende Reiz, Antworten, Phase und verbleibende Wartezeit werden lokal gespeichert und beim Wiederöffnen fortgesetzt.
- Offene Hauptstadtfelder zeigen „Einsetzen“ auf Orange mit dunkler Schrift; belegte Felder sind ausdrücklich weiß. Dies ist die vom Auftrag gewünschte Ausnahme von der bisherigen Palette.
- „Ausgang“ führt ohne Rückfrage zum Menü. Fragerunden speichern Aufgabe, Antwortreihenfolge, Rückmeldung, Hilfestufe, Punkte und Fortschritt je Fach. Vorhandene Speicher für Wortschatz, Satzbau, Galgenraten und Deutschlandquiz bleiben erhalten; Kartenrunden speichern zusätzlich Index, aufgedeckte Antwort und Selbstbewertung. Die bisherige Abbruchdialog-Komponente wurde entfernt.

## Datenhaltung

Das IndexedDB-Format bleibt Version 3. Neue Felder erhalten sichere Standardwerte für ältere Sicherungen. Bestehende Punkte, Karten, Einstellungen, Kompetenzdaten und Erfolge werden übernommen. Antwort und Rundenstand werden gemeinsam gespeichert. Die vorhandene Prüfung gegen das Überschreiben durch veraltete App-Fenster bleibt aktiv. N-Back verwendet einen eigenen begrenzten lokalen Sitzungseintrag; dieser gehört nicht zum bisherigen JSON-Export der Lernstände.

## Qualitätssicherung

Logiktests prüfen alle erzeugten Rechenlösungen über viele Parameter, eindeutige Antworten, Zahlenbereiche, Stufen, Kategorien, Wiederholungssperren und Speichergrenzen. Alle Satzkombinationen werden auf vollständige Bausteinverwendung und korrekte Auswertbarkeit geprüft. Browserprüfungen decken Desktop, kleine Mobilbildschirme, Querformat, Touch, Offline-Betrieb, App-Updates, alte Daten, Exporte/Importe, Punkteerhalt sowie Ausgang und Wiederaufnahme ab.

Abschließende Ergebnisse:

- `npm test`: 96 von 96 Logiktests erfolgreich.
- Vollständige Playwright-Reihe mit installiertem Chrome: 101 von 101 Browsertests erfolgreich, einschließlich jeweils 100 verschiedener Aufgaben pro Fach beziehungsweise vollständigem Fragenbestand der übrigen Fächer.
- `npm run build`: erfolgreich; TypeScript und PWA-Erzeugung erfolgreich.
- `git diff --check`: ohne Befund.
- Mobil- und Desktopdarstellung visuell geprüft. Ein überlagernder Levelhinweis in der Matheauswahl wurde gefunden, korrigiert und durch den erneuten kompletten Testlauf abgesichert.

 Das Produktionsbuild meldet weiterhin den bereits vorhandenen Hinweis auf die Größe des JavaScript-Bundles. Eine Veröffentlichung ist nicht Teil dieser lokalen Umsetzung. Highscore, Gruppencodes und Supabase wurden nicht ergänzt.
