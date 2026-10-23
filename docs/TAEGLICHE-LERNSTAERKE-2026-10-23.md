# Tägliche Lernstärke – 23.10.2026

Vom Nutzer bestätigt: 30 Minuten als Tagesziel, sieben erfüllte Tagesziele von 0 auf 100 %, täglicher Höchstzuwachs 100/7 und relativer Abzug von 10 % bei verfehlten Tagen (80 → 72 → 64,8 %). Der bisherige Lernstärkewert bleibt ausdrücklich als Startwert erhalten; deshalb können bestehende Profile die 100 % mit weniger als sieben weiteren Tageszielen erreichen.

- Erst bei 30 aktiven Lernminuten gibt es den Tageszuwachs; zusätzliche Zeit am selben Kalendertag erhöht den Wert nicht weiter. Ein Tag unter 30 Minuten gilt als verfehltes Tagesziel. Der heutige Tag wird erst nach seinem Ende bewertet.
- Kalendertage richten sich nach Europe/Berlin, einschließlich Sommer-/Winterzeit. Kurze aktive Intervalle über Mitternacht werden auf beide Tage verteilt. Pausen, Hintergrund und lange Untätigkeit zählen weiterhin nicht als Lernzeit.
- Abzüge werden auch offline und nach längerer Abwesenheit aus den gespeicherten Kalenderständen berechnet. Wiederholtes Öffnen oder Importieren zieht dieselben Tage nicht erneut ab. Erfüllte Tagesziele bleiben beim Import desselben Profils für den Tag bereits verbraucht.
- Modell 3 speichert Kalendertag und Tageszeit. Modell 2 und ältere Daten werden ohne rückwirkende Abzüge auf den bestätigten Startwert übernommen; bisherige Gesamtlernzeit bleibt erhalten. Datenformat 7 liest Versionen 1–6; das unveränderte Original wird vor Migration unter `backup.before-v7` gesichert. Punkte, Level, Erfolge, Karten und laufende Runden bleiben erhalten.
- Hilfe erklärt Tagesziel, Woche und Abzug. Der redundante Satz, dass Normal/Streber auch für Mathematik gilt, ist entfernt. Pink bleibt unverändert.

Betroffene Logik: `src/learning/journey.ts`, Speicher/Migration und App-Anzeige/Hilfe. Die Hauptmenüanzeige aktualisiert den Tagesabzug auch bei offen gelassener App. Tests sichern Tagesgrenze, siebtes Tagesziel, relative Abzüge, Teil-Tage, Mitternacht, Zeitumstellungen, Uhrenrücklauf, doppelte Intervalle, Altstände, Import, Offline-Neustart und Punkte-/Rundenerhalt ab.

Validierung: Produktionsbuild erfolgreich, 177 Unit-Tests bestanden. Browser-Gesamtlauf: 198 von 199 bestanden; die gefundene Abweichung beim Sicherungsimport (unnötig erneuerter Zeitstempel am selben Tag) wurde korrigiert. Anschließend bestanden alle 10 gezielt wiederholten Browser-Tests für Tagesmodell und Migration sowie 42 betroffene Unit-Tests. Damit sind alle 199 Browser-Fälle erfolgreich geprüft.
