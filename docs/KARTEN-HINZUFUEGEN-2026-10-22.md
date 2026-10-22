# Karten direkt im Lernkasten – 22.10.2026

„Karten hinzufügen“ steht neben den beiden Quellen-Schaltern, auf schmalen Smartphones darunter. Der native Dialog übernimmt das gewählte Fach. Eine einzelne aktive Unterrubrik ist vorausgewählt; bei mehreren verlangt der Dialog eine Auswahl und bietet nur diese Rubriken an. Ohne aktive Rubrik ist Hinzufügen deaktiviert. Fach und Auswahl im Lernkasten bleiben unverändert.

Frage und Antwort sind erforderlich; auch reine Leerzeichen können nicht gespeichert werden. Nach erfolgreichem Speichern bleiben Fach, Unterrubrik und Fenster erhalten; nur Frage/Antwort werden geleert. Eine Bestätigung erscheint, der Fokus kehrt zur Frage zurück. „Fertig“ und Escape schließen das Fenster und geben den Fokus zurück. Auf sehr kleinen Displays ist der Dialog scrollbar. Standarddarstellung und Pink verwenden dieselben vorhandenen Farben und Komponentenregeln.

Die Einstellungen bieten keine Erstellung mehr an. Verwaltung, Suche, Sortierung, Bearbeitung, Löschen und Gesamtsicherung bleiben erhalten. Die zentrale Hilfe beschreibt den neuen Weg. Keine neuen Konten, Dienste oder Speicherorte.

## Rubriken und Bestand

Die sichtbare Rubrik „Allgemein“ entfällt in allen fünf Fächern und im Editor. Laut Nutzer gibt es keine früheren eigenen Karten ohne Unterrubrik. Alle 210 voreingestellten Karten haben bereits konkrete Fachrubriken und bleiben unverändert. Der interne Altformatwert wird lediglich weiterhin gelesen, um Sicherungsdateien nicht ungültig zu machen; er erzeugt keine eigene Rubrik mehr. Falls dennoch ein solcher Test-/Importdatensatz vorkommt, wird er in der Oberfläche der ersten vorhandenen Fachrubrik zugeordnet, ohne Karte oder Lernstand zu löschen.

Die Erstellung nutzt `savePersonalCard` und dieselbe IndexedDB-Datenbasis wie Lernkasten und Verwaltung. Keine Änderung am Datenformat 4, an Leitner-Fristen, Punkten oder vorhandenen Kartendaten. Neue Karten sind bei aktivierter eigener Quelle sofort im passenden Bestand verfügbar. Ein bereits laufender Rundenschnappschuss wird nicht nachträglich umsortiert. Bei ausgeschalteter eigener Quelle bleibt die Präferenz erhalten. Aktive Eingabe mit nichtleerer Frage und Antwort zählt wie zuvor zur Lernstärke, ohne Leistungspunkte; ein leeres Eingabefenster zählt nicht.

## Betroffene Bereiche

- `CardCreateDialog.tsx`: Eingabefenster, Validierung, wiederholtes Speichern, Tastaturfokus.
- `LearningBox.tsx`, `topics.ts`: neuer Einstieg und Auswahl ohne Allgemein.
- `CardManager.tsx`: bestehende Karten verwalten, keine Erstellung.
- `App.tsx`, `style.css`: Hilfe, aktive Lernzeit und responsive Darstellung.
- Browserprüfungen und `check-live.mjs`: neuer Erstellweg, Offline-Bestand und Regression.

## Prüfung

Gezielte Browserprüfungen decken alle fünf Fächer, eine/mehrere/keine Rubrik, wiederholtes Speichern, leere Eingaben, aktivierte/deaktivierte Quellen, unveränderte Auswahl und Punkte, Standard/Pink, Tastaturfokus, Bearbeiten/Löschen/Export/Import sowie Offline-Speicherung und Neustart ab. Ansichten: 320, 390, 768 und 1440 Pixel. Es werden isolierte Testprofile verwendet; reale Nutzerdaten werden nicht angefasst. Mobile Displays sind in Chrome emuliert, keine physische Android-/iOS-Abnahme.

Ergebnis vor Veröffentlichung: **123 Unit-Tests, 153 Browser-Tests und Produktionsbuild erfolgreich**. Der lokale Veröffentlichungs-Prüflauf bestätigt zusätzlich die Erstellung im Pink-Modus und ihren Erhalt beim Offline-Neustart, bestehende Wiederholungsdaten und unveränderte Punkte. Sichtprüfung: `disposition: ship`, keine wesentlichen offenen Befunde. Mechanischer Design-Scan: keine primären Befunde, nur Hinweise zu Schriftgrößen/Radien im bestehenden System.
