# Werkstätten und Spielzeit · 31.10.2026

Grundlage sind die drei Nutzeraufträge zur Spielzeitanzeige, zu schriftlichen Rechenverfahren und zum Bruchwerkstatt-Kernprototyp. Bestehende Funktionen und Speicherepoche `cards-2026-10-28` bleiben erhalten.

## Umgesetzt

- Zahlenpuzzle: erster gültiger Zug startet die Messung. Codeknacker: erst der erste gültig abgegebene Versuch. Öffnen, Betrachten und Farbauswahl starten nichts. Erfolg beendet die Messung; erst dann erscheint eine kleine Minuten-/Sekundenanzeige im vorhandenen Statusbereich. Fehlversuche, Verluste und alte Siege ohne Messwert erhalten keine erfundene Erfolgszeit. Neue Runde leert den Messwert. Keine Intervalle, keine Uhr während des Spiels, keine Änderung der Lernzeit oder Punkte.
- Die beiden Zeitstempel werden mit der jeweiligen Runde gespeichert und über Reload, Offlinebetrieb und die vorhandene Arcade-Wiederherstellung erhalten. Es handelt sich um die verstrichene Zeit zwischen erster Aktion und Erfolg, einschließlich Unterbrechungen; keine zusätzliche Aktivitätsmessung.
- Hauptmenü: Bruchwerkstatt ersetzt Galgenraten am roten Platz. Galgenraten ist als viertes Spiel unter Games erreichbar; Spiel und gespeicherte Daten sind unverändert. Die bisherigen drei Games-Siegeszähler bleiben erhalten.
- Bruchwerkstatt-Kern: zwei gleich große Ganze, Kreis oder Streifen, synchroner Zähler/Nenner und direkte Auswahl der Teile per Maus, Touch, Enter oder Leertaste. Erweitern und nur ganzzahliges Kürzen mit Faktor 2–6; verständliche Grenzen bei Nenner null, ungültigen Zählern und mehr als 48 Teilen. Vergleich durch Kreuzprodukte, ohne Rundungsfehler.
- Mathe: drei zusätzliche Einstiege für Addition/Subtraktion, Multiplikation und Division. Zehn Aufgaben je Durchgang. Eingaben pro Verfahrensschritt; falsche Werte oder Stellen bleiben korrigierbar. Zahlen und Felder sind stellengetreu ausgerichtet. Entbündelte Ziffern stehen oberhalb der ursprünglichen oberen Zahl; Entbündeln über Null ist möglich. Multiplikation enthält Überträge und selbst einzutragende versetzte Teilprodukte. Division enthält Teildividend, Quotientziffer, Produkt, Rest und Herunterholen; Streber auch kurze endliche Dezimalergebnisse mit Komma.
- Die Eingaben werden nicht automatisch gelöst. Nach einem richtigen Schritt führt der Tastaturfokus zum nächsten Eingabeschritt. Vorhandene Gleichungsübung, Trainingsfragen und gespeicherte Mathe-Runden bleiben unverändert.
- Kanonische Aufgabenkennungen berücksichtigen vertauschte Summanden/Faktoren. Pro Durchgang keine Dopplungen. In weiteren Durchgängen derselben geöffneten Übung werden unbenutzte Aufgaben bevorzugt. Der endliche Pool umfasst 160 Aufgaben je Verfahren/Niveau; bei erschöpftem Pool wird Wiederverwendung angekündigt. Keine unbeschränkten Zufallsschleifen.

## Bewusster Umfang

Bruchaddition/-subtraktion und geführte Bruchaufgaben sind entsprechend dem Konzept eine spätere Ausbaustufe. Der Kernprototyp stellt echte Brüche von 0 bis 1 mit maximal 48 Teilen dar; keine gemischten Zahlen. Die optionalen Euro-Betragslisten der schriftlichen Addition sind nicht Bestandteil dieser Stufe. Die neuen schriftlichen Durchgänge bleiben während der geöffneten Übung erhalten und lassen sich zurück zu Mathe verlassen; es wurde kein zweites dauerhaftes Rundenspeichersystem oder zusätzliches Punktesystem eingeführt.

## Geänderte Dateien

- `src/games/playTime.ts`, `arcade.ts`, `codebreaker.ts`, `slidingPuzzle.ts`: optionale Rundenzeit und gültige Start-/Endereignisse, abwärtskompatible Schemas.
- `src/components/Codebreaker.tsx`, `SlidingPuzzle.tsx`: zurückhaltende Erfolgszeit.
- `src/components/GameHub.tsx`, `CalculatorKey.tsx`, `src/App.tsx`: Menüeinbindung, Galgenraten-Einstieg und Ausgang.
- `src/components/FractionWorkshop.tsx`: interaktiver Kernprototyp.
- `src/learning/written.ts`, `src/components/WrittenPractice.tsx`: geprüfte Aufgabenmodelle und schrittweise Rastereingabe.
- `src/design/workshops.css`, `src/main.tsx`: begrenzte Ergänzung des bestehenden Designs.
- `public/release.json`: neue Versionskennung; keine Änderung der Speicher-Epoche oder Domain.
- Neue Tests: `tests/play-time.test.ts`, `written.test.ts`, `oct31-workshops.spec.ts`. Gestaltungsvertrag: `docs/design/surfaces/workshops.md`.

## Prüfungen

- `npm test`: 290 Tests in 35 Dateien bestanden.
- Produktionsbuild einschließlich PWA-Precache erfolgreich.
- 26 Browser-Abnahmefälle bestanden: Werkstätten bei 320 und 900 Pixeln, Bruchbilder in Normal/Pink; beide Niveaus aller schriftlichen Verfahren, fehlerhafte Eingaben und Korrektur, Dezimalkomma, Rückkehr und neue Aufgabe; Spielzeit vor/nach Erfolg, Reset und Reload; Codeknacker-Neustart nach Sieg und Verlust in beiden Varianten/Ansichten.
- Vier vorhandene Games-Regressionsfälle bestanden: gespeicherte Siege/Offlinebetrieb, keine Doppelgutschrift in zwei Fenstern, Übernahme alter Puzzle-Dateien und Wiederherstellung durch ältere Oberflächen entfernter Felder.
- Vier vorhandene Hauptmenü-Layoutfälle bei 320, 375, 390 und 1440 Pixeln bestanden.
- Rechenstichproben: 18 + 14 = 32 mit Übertrag; 402 − 185 = 217 mit Entbündeln über Null; 123 × 24 mit Teilprodukten 492 und 2460; 848 : 8 = 106 mit Null im Quotienten; 34 : 4 = 8,5 mit Herunterholen der Dezimalnull. 30 : 4 = 7,5 und ungültige periodische Division werden zusätzlich im Unit-Test geprüft. Je Niveau/Verfahren 18 vollständige Durchgangsmodelle geprüft.
- Ein zusätzlicher Lauf der gesamten älteren `home.spec.ts` zeigte drei außerhalb dieses Auftrags liegende veraltete Erwartungen: Hilfetext unter 180 Wörtern sowie zweimal den nicht mehr vorhandenen Startbutton „Runde starten“ statt „Üben“. Hilfetext und diese Tests wurden nicht verändert. Die relevanten vier Hauptmenü-Layoutfälle sind erfolgreich.
- Design-Detektor einmal ausgeführt: vier beratende Hinweise zu lokalen Schriftgrößen, keine übrigen Befunde. Die bestehende Gestaltung wird erweitert; keine neue Designidentität oder Reparatur älterer Designmetadaten.

## Veröffentlichung

Veröffentlichung über den bestehenden Pages-Workflow auf lernkick.eu. Domain, PIN, Speicher-Epoche und PWA-Konfiguration unverändert. Der Live-Status wird nach Push durch Pages-Ergebnis und ausgelieferte Versionsdatei geprüft.
