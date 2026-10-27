# Lernkartenrhythmus und Plateau · 27.10.2026

Aufträge: `Lernkick_Aenderungen_Lernkasten_Plateau.md` und anschließend `Lernkick_Codex_Lernkarten_Einheitlicher_Rhythmus.md`. Die neuere Anweisung ersetzt die zuerst vorgesehenen Langintervalle.

## Gefundene Ursachen

Die ursprüngliche Funktion `rateCard` berechnete die erste gewusste Karte mit `now + 24 Stunden`, danach mit 3/7/14/30 Tagen als Zeitabstand. `cardQueue` verglich exakt mit `due <= now`. Deshalb konnte eine am Vorabend gelernte Karte am Folgetag um 04:00 noch nicht fällig sein. Die pauschale Meldung „Für heute sind alle passenden Karten wiederholt“ unterschied nicht zwischen heute erledigten Karten und erst später fälligen Terminen. Die konkrete vom Nutzer beobachtete Karte wurde nicht aus privaten gespeicherten Reviewdaten ausgelesen; ein anderer Einzelfallgrund wird deshalb nicht ausgeschlossen.

Beim Plateau trafen drei Pixel Innenabstand auf nach unten versetzte Kachelschatten bis etwa zehn Pixel plus Unschärfe. `overflow: hidden` schnitt diese ab. Die nachträgliche Pseudoelement-Lichtkante löste den fehlenden Platz nicht.

## Verwendete Regeln

- Ein System ohne Prüfungsmodus, Modusschalter oder Intervall-Einstellungen.
- Erstes Gewusst: folgender lokaler Kalendertag. Weitere regulär fällige, erfolgreiche Wiederholungen: 2, 3, 5 und 7 Kalendertage, danach immer 7. Berechnung jeweils ab dem Bearbeitungstag in `Europe/Berlin`.
- Nicht gewusst: zurück auf Stufe null und nach zehn Minuten erneut, auch beim erstmaligen Lernen. Erfolgreiche Kurzzeitwiederholung: Stufe eins und nächster lokaler Tag, danach normaler Neuaufbau.
- Drei Fehlbewertungen einer Karte am selben Berliner Kalendertag: nächste Vorlage am Folgetag statt weiterer Zehn-Minuten-Runden. Tageszähler wird am nächsten Tag neu begonnen. Keine unbegrenzte Kurzzeitschleife.
- Gleicher Tag oder nicht fällige positive Bewertung erhöht die Stufe nicht zusätzlich und verschiebt einen vorhandenen positiven Termin nicht.
- Schwierigkeit: Fehlerquote aus vorhandenen `attempts` und `known`, bei Gleichstand absolute Fehlerzahl. Schwierige fällige Karten zuerst, dann weitere fällige und neue Karten. Jede Runde bleibt auf höchstens zehn Karten begrenzt; Restanzahl bleibt sichtbar und kein Rest wird als erledigt markiert.
- Zusatztraining über „Noch etwas üben?“ verwendet ausschließlich bereits gelernte Karten der aktuellen Fach-/Themenauswahl, bevorzugt schwierige. Termine, Stufen, Reviewzahlen, Score, Skill und Monatsstatistik bleiben unverändert. Die zusätzliche Runde ist endlich, lässt sich beenden und nach Neustart fortsetzen.
- Heute-Status, nächstes Datum und Anzahl verwenden dieselbe Fälligkeitsberechnung wie die Auswahl. Bei Tagesintervallen zählen alle Termine des Berliner Tages; kurzfristige Fehlerrücklagen behalten ihre genaue Uhrzeit. Gleiche nächste Kalendertage werden gezählt, Kurzzeittermine nach exakt gleicher Uhrzeit gruppiert.
- „Für heute geschafft!“ erscheint nach heutigen Bearbeitungen ohne verbleibende fällige Karten und ohne weitere heutige Kurzzeitfrist. Andernfalls werden die tatsächlichen offenen Karten beziehungsweise die fehlende heutige Fälligkeit genannt. Ohne geplante Wiederholung wird kein Datum erfunden.

## Konservative Datenkompatibilität

Vorhandene Review-IDs, Termine, Boxen, Zähler und letztes Bearbeitungsdatum bleiben beim Laden unverändert. Frühere Einzelantwortverläufe sind nicht gespeichert; eine rückwirkende Rekonstruktion neuer Stufen wäre deshalb nicht zuverlässig. Die bestehenden Boxen 0–5 bleiben erhalten und werden bei der nächsten regulären Bewertung nach der neuen Intervalltabelle verwendet. Auch ältere längere Zukunftstermine werden nicht pauschal verschoben und keine Karte rückwirkend als bearbeitet markiert.

Die wenigen Zusatzfelder `retryDay`/`retries` sind optional. Das optionale Kennzeichen `cardSession.extra` unterscheidet intern die freiwillige Runde; es ist kein neuer Schüler-Modusschalter. Alte Sicherungen bleiben lesbar, neue Felder überleben Export/Import. Keine Änderung an Daten-/Journey-Version oder Domain-/Pages-Konfiguration.

## Plateau

Bestehende Container und Materialflächen bleiben erhalten. Symmetrische Innenabstände von acht Pixeln, unten 18 Pixel einschließlich Platz für den vorhandenen Kachelschatten; dadurch bleibt der sichtbare Abschluss frei. Kein abschneidendes `overflow` und kein zusätzlicher Dekorstreifen. Die untere Lichtkante gehört wieder zum bestehenden Container-Schatten. Seitliche Außenabstände gleichen den zusätzlich benötigten Innenraum aus, sodass normale Kacheln nicht verkleinert werden.

Nur wenn kurze Viewports Platz durch Safe Areas verlieren, wird deren Verbrauch in der verfügbaren Zeilenhöhe berücksichtigt. Die kurze Kompaktansicht spart stattdessen unnötige Zwischenabstände. Kurze Desktopfenster bis 760 Pixel Höhe begrenzen die Kachelhöhe ebenfalls responsiv, damit die feste Navigation das Plateau nicht verdeckt. Score, Skill und neun Kacheln bleiben angeordnet und bedienbar.

## Geänderte Dateien

- `src/study/schedule.ts`: Berliner Kalendertage, Fälligkeit, nächster Termin/Anzahl und Fehlerpriorität.
- `src/study/cards.ts`: einheitliche Intervalle, Kurzzeitbegrenzung, reguläre und zusätzliche Kartenqueues.
- `src/components/LearningBox.tsx`: aktuelle Fälligkeitsanzeige, Tageswechsel/Öffnen, Zehnerrunden und freiwilliges Zusatztraining.
- `src/lib/schema.ts`, `src/App.tsx`: optionale Session-/Retryfelder und Schutz der Statistik im Zusatztraining.
- `src/components/HelpPage.tsx`: geschriebene Hilfe zum Rhythmus, Status und Zusatztraining; keine Hilfestimme.
- `src/design/home-status.css`, `game-updates.css`, `complexes.css`: Plateau, kurze Viewports und kompakte Statusanzeige.
- `public/release.json`: Release `2026-10-27-card-rhythm-plateau`.
- Neue Tests `card-calendar.test.ts`, `card-rhythm.test.ts`, `card-rhythm.spec.ts`; bestehende Geometrieerwartungen in `help-ui.spec.ts` und `games-update.spec.ts` angepasst.

## Prüfung

Produktionsbuild und alle 244 Unit-Tests bestanden. 77 unterschiedliche gezielte Browserprüfungen bestanden (nach Behebung der kurzen Kompaktansicht): Kalenderdatum, Mitternacht, Sommer-/Winterzeit, zehnminütige Wiederholung und Tagesgrenze, Fehlerpriorisierung, Bestandskompatibilität, neutrale Zusatzrunden, Neustart/Offline, Export/Import, 30 fällige Karten in Zehnerrunden, Hilfe und bestehende Lernkasten-/Games-/Score-/Skill-Funktionen.

Plateau-Sichtprüfung gemeinsam für Normal/Pink sowie Desktop und Smartphone. Automatisierte Geometrieprüfung auf 320×568, 375×667, 390×844, 414×736 1124×720 und 1440×900; Kompaktansicht und simulierte Safe Areas zusätzlich geprüft. Mobile Browserprüfung erfolgte mit Chromium-Emulation; keine physische Safari-/Android-Geräteprüfung. Keine bekannten offenen funktionalen Einschränkungen im getesteten Umfang.
