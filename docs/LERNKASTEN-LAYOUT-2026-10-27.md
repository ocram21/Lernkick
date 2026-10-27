# Lernkasten-Auswahlzeile · 27.10.2026

Die kurze Fälligkeitsanzeige steht jetzt rechts neben „Auswahl schließen“ statt als zusätzlicher Block unter den Themen. Die Zahl stammt weiterhin unverändert aus `cardSchedule` für die aktuelle Fach-/Themenauswahl. Sichtbarer Text: „8 Karten warten auf dich“, unter 351 px Breite kompakt „8 Karten fällig“; Einzahl ebenfalls berücksichtigt. Ohne laufende Runde steht die Anzahl an derselben Position, ohne einen neuen Auswahl-Button einzuführen.

Der bisherige zusätzliche Block bei fälligen Karten entfällt. Vorhandene nächste Termine bleiben kompakt sichtbar; abgeschlossene Runden, fehlende Fälligkeiten und freiwilliges Zusatztraining behalten ihre bestehenden Funktionen. Leere Auswahl hat weiterhin genau ihren bisherigen Hinweis.

Kleine Displays: nötige Abstände im Kopf-/Auswahlbereich reduziert, Themen in zwei Spalten, vorhandenen Platz zwischen Themen und Aktionsbereich flexibel aufgeteilt. Der gelbe Start bleibt quadratisch, wenn genug Höhe vorhanden ist (u. a. 375×667 und 390×844). Nur bei Platzmangel wird seine Höhe angepasst, bei unveränderter Breite und mindestens 64 px Höhe. Alle übrigen interaktiven Ziele behalten mindestens 44 px. Der untere Safe-Area-Abstand wird in der Auswahl nicht doppelt angewendet; die vorhandene Navigation berücksichtigt ihn bereits. Bei vergrößerter Schrift bleibt der bestehende Scrollbereich als Zugänglichkeitsfallback erhalten, statt Inhalte abzuschneiden.

Geändert:
- `src/components/LearningBox.tsx`: vorhandene Anzeige in die Auswahlzeile verschoben, kompakte Textvarianten; keine neue Lernlogik.
- `src/design/complexes.css`: ausschließlich notwendige Lernkasten-Auswahlabstände, Zeilenausrichtung und flexible Aktionshöhe.
- `src/components/HelpPage.tsx`: neue Position der Anzeige kurz genannt; keine Hilfestimme.
- `tests/box-layout.spec.ts`: zehn neue gezielte Browserprüfungen.
- `tests/card-rhythm.spec.ts`: bestehende Anzeigeerwartungen auf die neue Position angepasst.
- `public/release.json`: `2026-10-27-box-layout`.

Unverändert: Terminberechnung, Wiederholungsintervalle, Bewertung, gespeicherte Karten/Runden, Lernstände, Score, Skill, Statistik, Export/Import und Offlinefähigkeit. Keine zusätzlichen Bedienelemente oder Abhängigkeiten.

Prüfung: Produktionsbuild und 244 Unit-Tests bestanden. 42 unterschiedliche gezielte Browserprüfungen bestanden (nach Korrektur des gemessenen Vier-Pixel-Überstands und der doppelten Leerstatusmeldung): beide Darstellungen, 320×568, 375×667 und 390×844; dynamisch 8/3 Karten und Themenwechsel; alle fünf Fachauswahlen; unverändertes Schließen/Fortsetzen und Lernstart; simulierte 34-px-Safe-Area; größere Root-Schrift; vorhandene Lernkasten-, Termin-, Offline-, Sicherungs- und Zusatztrainingsprüfungen. Auf typischen geprüften Smartphone-Ansichten stehen Start-Button und Unterkante vollständig ohne Dokument-/Auswahlscrollen im sichtbaren Bereich. Sichtprüfung beider Darstellungen; keine physische Safari-/Android-Geräteprüfung.
