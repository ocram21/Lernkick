# Bosskampf und Monatsstatistik – 24. Oktober 2026

## Bestandsprüfung und Umsetzung

Die bisherige große Fachzahl war das Level, keine gespeicherte Rundensumme. Die Balken zählen erfolgreiche Durchläufe zum nächsten Level. Alte Roboter zeigten historische Siege des automatischen Endgegners nach jedem fünften Level. Die neue freiwillige Herausforderung ersetzt diesen automatischen Einstieg. Alte Level, Siege, Punkte und Inhalte bleiben im Speicher erhalten.

Die fünf Fachzahlen zeigen nun die seit Einführung abgeschlossenen regulären Runden. Der separate Roboterzähler zeigt dauerhaft 0–5 Ladungen, unabhängig von der Trefferquote. Die vorhandenen Levelbalken behalten ihre Bedeutung. Wortschatz, Galgenraten und Deutschlandquiz haben keinen Roboter; N-Back behält N1/N2/N3.

Bosskampf bleibt bis zum Ausschalten aktiv. Einschalten benötigt mindestens ein geladenes Fach. Nicht geladene Fachkacheln erklären die fünf benötigten Runden. Ein Kampf benutzt zehn Aufgaben aus geübten Themen in der globalen Schwierigkeit, endet bei acht richtigen Antworten, zehn bearbeiteten Aufgaben oder nach 180 Sekunden. Das letzte Fünftel des Zeitbalkens ist rot. Beenden verbraucht nur die betroffene Ladung, Abbrechen nicht. Es gibt weder Abzüge noch zusätzliche, im Auftrag nicht festgelegte Bonuspunkte.

## Aufgabenformate

Katalogfragen sowie Mathegeneratoren, Gleichungseditor und Geometrieabbildungen werden wiederverwendet. Deutsch ergänzt geübte Grammatik, Rechtschreibung, Begriffe, Sprichwörter und Satzbau mit dem bestehenden Satzbaustein-Editor. Gleichungen werden wie bisher mit Umformungsschritten gelöst; fehlerhafte Zwischenschritte sind keine fertig beantwortete Frage. Beim Satzbau zählt die erste Überprüfung als Antwort. Die Auswahl mischt verfügbare Formate, garantiert aber keine feste Quote pro Format. Gibt es weniger als zehn passende verschiedene Aufgaben, startet kein Kampf und die Ladung bleibt erhalten.

## Speicherung und Zeit

Additive, standardmäßig leere `journey.statistics` im bestehenden Datenformat 7/Journey 1; `settings.bossMode` standardmäßig aus. Alte Sicherungen bleiben lesbar. Vor einer Migration bleibt der bisherige Sicherungsmechanismus aktiv. Runden und Bossversuche haben stabile eindeutige IDs; wiederholte Abschlussmeldungen zählen einmal. Import desselben Profils vereinigt IDs und rekonstruiert Ladungen nach dem letzten beendeten Kampf, ohne Minuten zu verdoppeln.

Neue Monatszeiten werden zunächst pro Runde und lokalem Kalendertag gepuffert. Erst der Abschluss macht sie sichtbar. Zurück zum Menü erhält fortsetzbare Runden samt Puffer. Explizites Beenden/verwerfen entfernt den Puffer. Pausen, unsichtbare Seiten und mehr als 30 Sekunden ohne Eingabe werden ausgeschlossen. Normale Runden werden im Sekundentakt gemessen, beim Abschluss wird das verbleibende Teilintervall ergänzt. N-Back verwendet seine vorhandenen Aktivitätsmeldungen. Ein vollständiger N-Back-Durchlauf zählt auch ohne vier Antworten als abgeschlossene Runde; die bestehende strengere Punkteprüfung bleibt erhalten.

Abschlussdefinitionen: Fachtraining und Wortschatz zehn Aufgaben, Deutschlandquiz beide vollständigen Zuordnungen (32 Ziele), Galgenraten ein beendetes Wort einschließlich Niederlage/Lösung, N-Back ein vollständiger Durchlauf, Lernkasten die gewählte Kartenrunde bis zur letzten Bewertung. Kartenrunden laden keinen Roboter und vergeben weiterhin keine Punkte. Tafeln und Kartenerstellung haben keinen vollständigen Lernrundenabschluss und erhalten keine Monatszeit.

Der Boss-Timer läuft als absolute Frist auch im Hintergrund weiter. Nur aktive sichtbare Bearbeitung zählt als Lernzeit. Regulär beendete Bosskämpfe erhalten eine eigene Aktivitätsart; Abbrüche keine Minuten. Beim Neuladen wird ein laufender Versuch als abgebrochen gespeichert und verbraucht keine Ladung. Aufgaben und Timer eines Bosskampfs werden nicht fortgesetzt.

## Statistik und Testmodus

Einstieg über die bestehende Punkte-/Lernstärkeanzeige. Alle Kalendertage werden dargestellt, ein Monat pro Ansicht, Navigation per Pfeilen oder horizontaler Wischgeste bis einschließlich aktuellem Monat. Filter für fünf Fächer, Wortschatz, Galgenraten, Deutschlandquiz, N-Back und Lernkasten. Kartenzeit kann unter ihrem Fach und unter Lernkasten betrachtet werden, zählt bei Alle aber nur einmal. Fachleistungen zeigen vorhandene Aufgabenpunkte, keine erfundene Aufteilung des Journey-Gesamtpunktestands. Bossdetails und Versuchszahlen beziehen sich auf ausgewählten Monat und Fach.

Fünf aufeinanderfolgende Tipps auf das Kopfzeilenlogo in Einstellungen schalten den temporären Testmodus an/aus. TEST ist sichtbar, alle fünf Fächer sind ohne Ladung/Übungshistorie startbar. Dieselbe Kampfkomponente wird verwendet. Testkämpfe schreiben keinerlei echte Versuche, Minuten, Ladungen, Punkte, Runden oder Lernstärke. Der Testmodus selbst wird nicht dauerhaft gespeichert.

## Grenzen der Altdaten

Historische Fachrundensummen und einzelne Tagesminuten wurden bisher nicht zuverlässig gespeichert. Sie werden weder aus Levels noch aus Punkten geschätzt. Die Anzeige benennt den Beginn der neuen Erfassung. Bereits vorhandene Fachpunkte und globale Punkte bleiben erhalten. Die bestehende Lernstärke folgt unverändert der aktiven 30-Minuten-Tagesregel über sieben erfüllte Tage; sie ist kein aus der Monatsstatistik berechneter Wert.

Die Oberfläche verwendet bestehende Barlow-Schriften, Rechnerfarben, Bedienelemente und Aufgabenansichten. Neue CSS-Regeln betreffen den Boss-Schalter, Kopfzeilentimer und die Monatsstatistik; das Farbsystem wird nicht ersetzt.

## Prüfung

194 Logiktests bestehen. Die Browserregression umfasst 226 Fälle: 211 bestanden im ersten Gesamtlauf, die 13 durch diesen Auftrag geänderten Erwartungen und zwei zusätzliche Fälle bestanden im gezielten Folgelauf. Die fünf neuen Boss-/Statistik-Abläufe wurden nach der letzten Timerabsicherung erneut geprüft. Erfasst sind unter anderem komplette fünf Runden, Sieg/Abbruch/Timeout, rote Schlussphase, Testisolation, Offline-Ansicht, Filter/Wischgeste, Monatslängen, Tagesgrenzen, gespeicherter Zeitpuffer, Pause/Hintergrund/Leerlauf, Export/Import, Reload, Datenkonflikte und kleine Bildschirme.

Sichtprüfung direkt im Hauptlauf anhand mobiler und Desktop-Aufnahmen: vorhandene Rechnerwelt, Schriften und Farben bleiben erhalten; der Kopfzeilentimer nutzt den verfügbaren Platz, die Monatsansicht behält alle Tagesbalken, enge Achsenbeschriftungen sind reduziert. Keine Änderung an DESIGN.md oder dem Token-Sidecar erforderlich. Vorbestehende Build-Hinweise zu Paketgröße und Drittanbieter-Kommentaren sind unverändert; sie blockieren den Build nicht.
