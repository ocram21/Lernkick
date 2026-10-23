# Einheitliche Bedienung – 23.10.2026

Auftrag: `Lernkick_Codex_UX_Vereinfachung_2026-10-22.md`.

## Befund und Umsetzung

| Bereich | Befund | Ergebnis |
| --- | --- | --- |
| Mathematik | Lokale Stufen in Startauswahl und Lernhilfe; Kategorienbutton löschte Runde | Nur global Normal/Streber. Normal adaptiv 1–2, Streber 3 mit vorhandener Fehlerhilfe. Kategorien öffnen/schließen bewahrt Runde; neue Runde nur nach ausdrücklichem Start. |
| Deutsch/Sachfächer | Globaler Modus und Rundenfortsetzung bereits vorhanden | Beibehalten; Ausgang führt ins Hauptmenü. Hilfe/Pause/Rückblick und explizites Beenden bleiben. |
| Wortschatz | Ausgang führte ins Untermenü; Bereichsschalter löschten Runde | Ausgang ins Hauptmenü; gespeicherte Runde bleibt auch bei Auswahländerungen erhalten. Beenden bleibt ausdrücklich verfügbar. |
| Lernkasten | Fachauswahl stets sichtbar; Quellen/Rubriken löschten Session | Aktive Karte zeigt zunächst keine Auswahl. Auswahl ändern/schließen bewahrt ID, Karte, Antwortseite und Bewertungsstand, selbst bei Fachwechsel. Neue Auswahl wird erst mit „Neue Runde starten“ zur Runde. Lernzeit zählt beim Lesen/Editor, nicht bei geöffneter Auswahl. |
| Galgenraten/Deutschlandquiz | Ausgang, Pause und Beenden bereits vorhanden | Funktionen erhalten, Aktionsfarben vereinheitlicht. |
| Dual N-Back | Eigenes zeitgebundenes Spiel mit dauerhaften Erfolgen | Ausdrückliches „Übung beenden“ ergänzt; gespeicherte Erfolge bleiben. Ausgang pausiert und speichert die Reizfolge über die vorhandene Wiederaufnahmelogik. Beim Wiedereintritt bleibt sie bis „Weiter spielen“ pausiert; Ergebnis-ID und Position bleiben erhalten. Erst „Übung beenden“ verwirft sie. |
| Einstellungen | Keine freiwillige Dichtewahl | „Kompakte Ansicht“, Standard aus, sofort wirksam und offline gespeichert. |

## Farben und Darstellung

Zentrale Rollen in `src/design/actions.css`: Hauptaktion Orange (Pink als vorhandene Akzentvariante), Bestätigung/Zurück Petrol, Auswahl Violett, Ausgang Türkis, Abbruch/destruktiv/Warnung Rot, neutral bestehende Fläche. Für Kontrast werden ausschließlich vorhandene Palettenfarben gemischt. Beschriftung, Fokus und aktiv/inaktiv ergänzen Farbe. Die Spiel-Einbettung erhält dieselben Rollentokens. Retro-Tastenformen und Hauptmenüfarben bleiben.

`src/design/compact.css` verdichtet Abstände und Überschriften maßvoll, mit skalierbarer rem-Schrift und mindestens 44 px hohen Hauptaktionen. Keine Unterdrückung der Textskalierung, kein `text-size-adjust:none`, kein Abschneiden durch versteckten Seiteninhalt. Bei größerer Schrift scrollen die vorhandenen Inhaltsbereiche; notwendige Aktionen bleiben erreichbar. Die beiden verlangten Lernzeit-/Punktetexte entfallen im Kartenlernen, die Zeitmessung bleibt aktiv.

## Daten und Prüfung

Datenformat 6 ergänzt ausschließlich die optionale Dichtepräferenz (Standard false) und liest Versionen 1–5. Unverändertes Original vor Migration unter `backup.before-v6`; frühere Backups bleiben. Alte Mathepräferenzen bleiben als Bestand gespeichert, bestimmen aber keine neue Aufgabe mehr. Ein früher geöffnetes, jetzt entferntes Stufenpanel wird geschlossen; Aufgaben, Rechenwege, Bewertungen, Rundenposition und Punkte bleiben erhalten. Kein Wechsel von Domain, DNS, PIN oder Lerninhalten.

Gezielte Tests: globale Mathezuordnung in allen zehn Kategorien, Moduswechsel bei bewerteten/offenen Aufgaben, Kategorien ohne Sessionverlust, aktive Kartenrunde bei allen Auswahländerungen, ausdrücklicher Neustart, Originalbackup und Offline-Persistenz, Kompaktschalter per Tastatur, Rollen und Textkontraste. Browsermatrix: 320×568, 375×667, 390×844, 1440×900, jeweils Normal/Pink und regulär/kompakt. Zusätzlich vergrößerte rem-Schrift als Browser-Simulation. Echte iPhone-/Safari-Systemschrift und Android-Geräte stehen hier nicht zur Verfügung; diese Hardwareabnahme bleibt offen. Vollständige Regression wegen appweiter Änderungen; abschließend gezielte Wiederholung nur korrigierter Fälle.

Ergebnis vor Push: Produktionsbuild erfolgreich. 161 Unit-Fälle durch vollständigen Lauf und gezielte Ergänzungsprüfungen abgedeckt. Browser-Gesamtlauf: 186 erfolgreich; drei alte Neustart-Erwartungen und zwei CSS-Farbrollenfehler anschließend gezielt korrigiert und erfolgreich wiederholt. Drei zusätzliche Fälle für Wortschatzauswahl, N-Back-Abbruch und pausierte Wiederaufnahme bestehen ebenfalls; damit alle 194 vorhandenen Browserfälle geprüft. Abschließender lokaler Produktionscheck: PIN, Pink/Kompakt, Kartenanlage/Leitner, Gleichungen, globale Schwierigkeit, Geometrie und Offline-Neustart erfolgreich, keine Laufzeitfehler. Browser-Simulation ersetzt keine reale iOS-/Android-Hardwareabnahme. Nach Push wird der Pages-Status einmal abgefragt; wartende Veröffentlichung wird nicht als live bestätigt ausgegeben.

N-Back-Nachprüfung: zehn gezielte Browserfälle erfolgreich, einschließlich aller Aufstiege bis 4-Back, Offline-Nutzung, Ausgang ohne Abbruchwertung, pausierter Wiederaufnahme nach 30 Sekunden Hintergrund und ausdrücklich verworfener Runde. Die neue Ausgang-Regel ersetzt die frühere Vorgabe, beim Ausgang die flüchtige N-Back-Runde zu löschen.
