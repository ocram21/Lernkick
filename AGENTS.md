# LernKick – Arbeitsregeln

- Nur ausdrücklich beauftragte Änderungen durchführen; keine ungefragten Refactorings, Texte, Funktionen oder Abhängigkeiten.
- Zunächst betroffene Dateien und direkte Abhängigkeiten untersuchen, statt wiederholt das gesamte Repository einzulesen.
- Bestehende Komponenten und Testinfrastruktur wiederverwenden.
- Standardablauf: fokussiert implementieren → gezielt testen → bei Bedarf relevante Regressionstests → committen → pushen.
- Zusätzliche Unteragenten für Dokumentation, Reviews oder Parallelaufgaben nur bei klar begründetem Bedarf; keine routinemäßigen Doppelprüfungen.
- Nach kleinen Korrekturen gezielte Tests wiederholen, nicht reflexartig alle Browser- und Unit-Tests. Bei weitreichenden Änderungen vollständige Tests durchführen, soweit erforderlich. Korrektheit und Datensicherheit haben Vorrang vor Ressourceneinsparung.
- Nur notwendige Screenshots/Sichtprüfungen; kompakte Ergebnisberichte.
- Lernfortschritt, Offline-Funktion, gespeicherte Runden und Datenkompatibilität gezielt absichern.
- Bei Veröffentlichung bestehende Domain- und Pages-Konfiguration nicht ungefragt ändern. Bisher ist lernkick.eu eingerichtet; aktuelle Konfiguration im Repository verifizieren. lernkick.de nicht eigenmächtig umstellen.
- Nach Push CI-/Pages-Status einmal prüfen. Wenn GitHub Pages nur auf einen Runner wartet, nicht fortlaufend pollen: Commit, Workflow und ausstehenden Status melden. Live-Veröffentlichung nur als erfolgreich bezeichnen, wenn tatsächlich geprüft.
