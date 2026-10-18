# Änderungsauftrag vom 18.10.2026

Umsetzung der übergebenen Datei `Lern-Kick_Aenderungsauftrag_Codex_2026-10-18.md` auf dem veröffentlichten Stand `ee6183b`. Bestehende App weiterentwickelt, keine Neuentwicklung.

## Umsetzung

- Wortschatzauswahl: alle drei Mengen-Unterzeilen entfernt. Die 400 Wörter und 200 Satzaufgaben bleiben unverändert. Stufenwahl in Satzbau und Galgenraten ausschließlich „Normal“ / „Streber“, ohne An/Aus am Stufenschalter. Die unabhängigen Bereichsschalter bleiben erhalten.
- Satzbau Normal: einfache Kommas ab der ersten Aufgabe, zunächst kurze Aufzählungen und einfache Satzverbindungen. Drei interne Bänder nach Satzlänge und Kommas: kurz/einfach, mittellang, länger/eingeschoben. Vier verschiedene beim ersten Prüfen gelöste Aufgaben erhöhen das Band um genau eins; zwei Fehleraufgaben senken es um eins. Eine Korrektur derselben Aufgabe zählt nicht noch einmal. Fehler setzen die Erfolgsserie zurück; ein Erfolg setzt die Fehlerserie zurück. Die Auswahl wird nach einer Normal-Aufgabe für die noch offenen Normal-Plätze der Runde angepasst. Leichtere Aufgaben bleiben zum Wiederholen verfügbar. Streber und Wortfragen bleiben bei ihrer bisherigen Auswahl.
- Fortschritt: Dropdown entfernt; fünf direkte Fachbuttons plus eine zweite Reihe mit Länderquiz (zugänglich auch als Deutschlandquiz bezeichnet), Galgenraten, Wortschatz, Satzbau und Lernkarten. Die bisherigen Bildsegmente, Berechnungen und Ergebnislisten bleiben unverändert. Die Bildhöhe berücksichtigt die zweite Reihe auch im Querformat.
- Mathematik: feste Ziffernspalten und getrennte Übertragszeilen für 234 · 16 und 2057 · 34. Vollständige Divisionen 936 : 4 und 12096 : 8 mit stellenrichtig heruntergeholten Ziffern und Proben. Division als zusätzliches Schaubild derselben Tafel. Bruchgrafik und Textansicht verwenden Zähler, horizontalen Strich und Nenner. Nur die Längenreihe umgestellt: km → m mit Faktor 1000, danach m → dm → cm → mm mit Faktor 10. Alle übrigen Einheiten und ausdrücklich ausgenommenen Tafeln unverändert.
- Deutsch: Übersicht Subjekt, Prädikat, Objekt. Bewerbungsanschreiben aus Kategorie und Favoriten-Auswahl ausgeblendet; Rohdaten, Grafik und gespeicherte Favoriten-ID bleiben erhalten. Keine sonstigen Bewerbungsinhalte entfernt.
- Biologie: neue eigene, dauerhaft beschriftete Schemata für Riechen, Haut und Blutkreislauf. Duftstoffe → Riechzellen → Nervenfasern → Riechkolben → Gehirn; drei Hautschichten, Haar, Schweißdrüse und Nerven; vier Herzhöhlen, Lunge, Körper und gerichteter Blutfluss. Erklärungen und zugängliche Textansichten erhalten bzw. vereinfacht. Verdauung, Auge/Ohr, Atmung, Skelett und Muskeln unverändert.
- Geografie: Amerika durch detailliertere Natural-Earth-Daten 1:50m und eine flächentreue Lambert-Azimutalprojektion ersetzt. Beide Achsen haben denselben Maßstab; Ländergrenzen, Inseln, große Flüsse und beschriftete Anden/Rocky Mountains. Gebirgsbänder sind ausdrücklich schematisch. Der bestehende lokale Zwei-Finger-Zoom mit Verschieben und Zurücksetzen bleibt auf Amerika, Europa, Welt und Deutschland nutzbar. Keine zusätzliche Kartenbibliothek oder API.
- Sozialkunde: eigene beschriftete Sitzungs-/Ablaufschemata für Bundestag/Bundesrat, Gewaltenteilung und Wahl. Keine Parteienfarben und keine aktuellen Personen oder Sitzanzahlen. Bundesrat als Vertretung der Landesregierungen mit Beteiligung je nach Gesetz; keine pauschale Zustimmungspflicht für sämtliche Gesetze behauptet. Grundrechte und Sozialversicherung bleiben erhalten.

## Speicherung und Bestandsschutz

Das vorhandene Datenformat 3 und die IndexedDB bleiben bestehen. Ein mit Standardwerten ergänztes Feld `activities.vocabulary.adaptive` speichert Band, Erfolgs-/Fehlerserie und zuletzt geprüfte Aufgabe. Ältere Sicherungen ohne dieses Feld werden weiter gelesen. Satzentwürfe, Karten, Favoriten, Ergebnisse, Fortschrittsbilder und eigene Inhalte bleiben erhalten. Der vorhandene Fortschritts-Reset setzt auch die neue adaptive Auswahl zurück. Kein Geräteabgleich und keine Übertragung von Lerndaten an einen Server.

500 Fachfragen, 400 Wörter, 200 Sätze, 80 Galgenbegriffe und 75 Standardkarten sind unverändert. 34 Lerntafeln sind sichtbar; die ausgeblendete Bewerbungstafel bleibt archiviert. Alle nicht beauftragten Grafikdateien sind bytegleich zum Ausgangsstand.

## Fachquellen und Bildrechte

Die neuen Schemata wurden selbst erstellt; keine fremden Anatomiebilder übernommen. Sachinformationen wurden anhand folgender Quellen geprüft und in den Tafeln verlinkt:

- [NIDCD: Geruchssinn](https://www.nidcd.nih.gov/health/smell-disorders)
- [IQWiG: Haut](https://www.gesundheitsinformation.de/wie-funktioniert-die-haut.html)
- [IQWiG: Blutkreislauf](https://www.gesundheitsinformation.de/wie-funktioniert-der-kreislauf.html)
- [Bundestag: Aufgaben](https://www.bundestag.de/parlament/aufgaben-197186), [Bundesrat: Landesregierungen und Aufgaben](https://bundesrat.de/)
- [Natural Earth: Nutzungsbedingungen/Public Domain](https://www.naturalearthdata.com/about/terms-of-use/), [Kartendaten 1:50m](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson)

Die Politik-Tafel zur Wahl behält die vorhandene Quelle der Bundeswahlleiterin. Vorhandene Rechtehinweise für unveränderte Fremdgrafiken bleiben bestehen.

## Prüfung

- 73 Unit-/Inhaltstests bestanden: darunter Hoch-/Rückstufung, Schutz vor Zählen einer Korrektur als neuer Erfolg, Lesen alter Sicherungen, Bestandszahlen, lokale Grafiken und Bruch-/Einheitenregeln.
- Browserprüfung: Alle 81 Fälle im abschließenden Gesamtlauf bestanden (22,2 Sekunden). Enthält vollständige Runden aller fünf Fächer, Offline-Neustarts, echte Service-Worker-Aktualisierung mit Datenerhalt, Sicherung/Import, alle sichtbaren Tafeln und zusätzliche Prüfungen der neuen Ansichten.
- Gezielte neue Browserfälle: zehn direkte Fortschrittsbuttons in zwei Reihen auf 320px und Desktop, adaptive Auswahl innerhalb einer Runde und nach Neuladen, Brüche in Textansicht, ausgeblendete Bewerbungstafel, Zwei-Finger-Zoom auf allen vier Karten.
- Visuelle Sammelprüfung aller neuen Grafiken sowie der App auf 320px und Desktop; anschließend eine gebündelte Korrektur von Beschriftungs-/Leitungskollisionen und Platz im Querformat. Schriftliche Verfahren mit unterschiedlich langen Zahlen und Überträgen kontrolliert.
- Produktionsbuild und Whitespace-Prüfung vor Veröffentlichung. Keine zusätzlichen Laufzeitabhängigkeiten.

## Praktische Grenzen

Touch-Prüfungen laufen mit Chromium-Touch-Emulation. Physische iPhones/Android-Geräte, Safari und Screenreader wurden nicht separat geprüft. Die Texte und vereinfachten Schemata benötigen weiterhin die fachliche Abnahme der Lehrkräfte; die automatische Prüfung ersetzt diese nicht. Die bestehende Vite-Hinweismeldung zur großen Hauptdatei bleibt; der Build funktioniert. Alle Karten und Schaubilder werden lokal für Offline-Nutzung mitgeliefert.

## Diagramme neu erzeugen

`python3 scripts/revise-reference-2026-10-18.py` erzeugt ausschließlich die neuen Mathe-/Biologie-/Politikgrafiken. Danach aktualisiert `node scripts/build-reference.mjs math-units german-sentence` nur die beiden Texttafeln. `python3 scripts/revise-americas-map.py` benötigt die im Skript genannten lokalen Natural-Earth-Eingaben und setzt die Amerika-Karte und ihr Seitenverhältnis. Die App benötigt diese Quelldownloads zur Laufzeit nicht.
