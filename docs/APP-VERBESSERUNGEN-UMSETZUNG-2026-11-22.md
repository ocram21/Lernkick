# Umsetzung der App-Prüfung vom 22.11.2026

Ausgangspunkt: `2808c25`. Grundlage: [Prüfprotokoll](APP-PRUEFPROTOKOLL-VERBESSERUNGEN-2026-11-22.md). Der ursprüngliche Prüfbericht dokumentiert den Zustand vor dieser Umsetzung.

## Umgesetzt

- **F01:** Dativaufgabe ausdrücklich im Singular; bei „bewerben“ ist „auf“ keine falsche Alternative mehr. Die Erklärung nennt beide zulässigen Verbindungen.
- **F02:** 611 Erklärungen in den 14 Sachfachkomplexen individuell redaktionell überarbeitet. Alle 604 bisherigen reinen Antwortwiederholungen sind ersetzt. Keine neuen Fragen, keine Umnummerierung; vorhandene Lernstände bleiben zugeordnet.
- **F03:** Ein konkreter problematischer Ablenkerfall bei Pflanzenzellen ist durch fachlich verwandte Alternativen mit eindeutiger Ortsfrage ersetzt. Keine pauschale Erschwerung aller Einstiegsaufgaben. Eine vollständige Neukalibrierung aller Ablenker bleibt ein Unterrichtsprojekt.
- **F04:** Zu breite Bezeichnungen der erzeugten Bruch- und Prozentaufgaben sind enger auf die tatsächlich geübten Anteile bezogen.
- **T01/L02:** Hilfen auch bei Gleichungen und Geometrie sowie in Sachfachrunden. Aus Matheaufgaben öffnet „Regel ansehen“ das vorhandene Tafelwerk; die passende Tafel wird bei zugeordneten Kompetenzen direkt gewählt. Die Aufgabe bleibt montiert. Nachschlagen pausiert Zeit/Automatik und zählt vor einer Antwort als Hilfe.
- **T02:** Leere Tafelwerkfächer haben einen verständlichen Verfügbarkeitszustand; Entwicklerformulierungen entfernt. Fachpositionen bleiben erhalten.
- **T03–T06:** Gleichheitszeichen beim Ausklammern, Zuordnung der Katheten, Pi-Näherungswert, präzisere binomische Beschreibung, vorsichtigere Wortartmerkmale, verständlicheres Bewerbungsvokabular und ein zusammenhängendes Argumentationsmuster. Keine Aufgaben im Tafelwerk und keine neuen Musterrechnungsanimationen.
- **T07/O02:** Sichtbarer knapper Rückweg „Themen“; mehr Textbreite durch kleinere Themensymbole und entfernte Unterthemenpfeile. Die feste Fächerauswahl bleibt sichtbar.
- **O03:** Freiwillige große Leseansicht im Tafelwerk mit größerer Schrift und zugänglichem vertikalen Scrollen. Die normale kompakte Darstellung bleibt erhalten.
- **L01:** Standardmäßig manuelles Weitergehen. Falsche Antworten wechseln auch bei eingeschalteter Automatik nicht selbstständig. Die freiwillige Automatik wird als optionale Einstellung im bestehenden Datenformat gespeichert; ältere Sicherungen bleiben lesbar.
- **L03:** Fachlich unzulässige Gleichungsoperationen markieren Hilfebedarf; reine Syntaxkorrekturen werden nicht pauschal als Fehler gewertet. Das Format bleibt eine Übung zur Operationswahl.
- **L04:** Aufgabenrückblick auch am Ende einer Fachrunde, statt ausschließlich während der Pause.
- **M01/A02:** „Routine“ statt „Skill/Lernstärke“; Erklärung trennt ausdrücklich erfasste Aktivität von Fachkönnen. Statistik nennt erfasste Übungsminuten. Das bisherige Zeit-/Verfallsmodell bleibt aus Gründen der Datenkontinuität zunächst unverändert; dessen pädagogische Neubewertung erfordert die im Bericht vorgesehene Erprobung.
- **M02/M03:** Deutsch-Boss nutzt geübte Inhalte. Auch die letzte Antwort steht im freiwilligen Abschlussrückblick zur Verfügung. Zwei Runden laden den Boss weiterhin auf.
- **M04:** Während der fachlichen Rückmeldung pausiert die Bossuhr. Hintergrundzeit wird nicht als Kampfzeit verbraucht. Statistische Dauer bezieht sich auf aktive Kampfzeit.
- **M05:** Neutrale Bezeichnung „Normal/Knifflig“; gespeicherte Schwierigkeitswerte bleiben kompatibel.
- **M06/O04:** Codeknackerfarben zusätzlich sichtbar nummeriert. Fachbuttons nennen für assistive Technik Runden statt Level. Fokus- und Dialogrückwege erhalten.
- **O05:** „Themen“ statt verwaltungsnaher Bezeichnungen an den betroffenen Auswahlen; Hinweis auf den Bezugsweg des Zugangscodes.
- **A01:** Bei vorhandenen, aber nicht fälligen Karten steht ein positiver Abschlusszustand mit nächstem Termin. Wiederholungsabstände bleiben erhalten.
- **A03/A04:** Inhalts- und Browserregressionen ergänzt. Die neuen Erklärungen vergrößern das JavaScript knapp über die Workbox-Standardgrenze von 2 MiB. Das Limit wurde gezielt auf 3 MiB gesetzt, damit der vollständige vorhandene Bestand weiterhin offline zwischengespeichert wird. Domain und Pages-Konfiguration bleiben unverändert.

## Bewusst offen: Erprobung und redaktionelle Freigabe

Die im Prüfbericht vorgeschlagenen Gespräche und Unterrichtsversuche mit Schülern lassen sich durch eine Codeänderung nicht ersetzen. Dazu gehören die konkrete Realschul-/Landeslehrplan-Zuordnung, die Wirkung eines anderen Tagesziels oder Verfallsmodells, die Kalibrierung der Bosszeit, eine personalisierte Grundlagenempfehlung (L05), die Bewertung optionaler Spielmotive und die vollständige Lehrkraftfreigabe der Inhalte. Die Umsetzung behauptet keinen gemessenen Lernzuwachs und keine vollständige Barrierefreiheitszertifizierung.

Neue Tafelinhalte für die drei bisher leeren Fächer wurden nicht ungeprüft erfunden. Ebenso wurden keine neuen Punktesysteme, Ranglisten oder Stoffmengen eingeführt. Bestehende Punkte, Karten, Aufgaben-IDs, Datenmigrationen und Sicherungen bleiben erhalten.

## Validierung

- Produktionsbuild einschließlich Service Worker erfolgreich; der gesamte App-Bestand wird wieder vorab zwischengespeichert.
- 299 Unit-Tests in 36 Dateien bestanden.
- 87 unterschiedliche relevante Browserprüfungen bestanden: 84 im Integrationslauf, drei anschließend korrigierte Fälle im gezielten Wiederholungslauf mit insgesamt 24 bestandenen Prüfungen. Abgedeckt sind Hilfen, Nachschlagen/Rückkehr, große Leseansicht, alle Mathetafeln, Deutschtafeln, Pink, Fächerpositionen, Bosskampf, Sachfachrunden, Lernkasten, Sicherungen/Migration und echtes PWA-Update mit Datenerhalt.
- Die zwei neuen Nachschlage-/Leseansichten wurden zusätzlich anhand der Browserbilder kontrolliert.
- Inhaltsprüfung: Alle 700 Sachfachfragen behalten ihre IDs; keine identischen Antwortoptionen. 611 Erklärungen geändert, keine länger als 330 Zeichen; keine der 604 alten reinen Antwortwiederholungen bleibt übrig.

Ein Gesamtlauf des historischen 418-Tests-Bestands wurde begonnen und wegen veralteter Erwartungen abgebrochen. Insbesondere wurden Levelnamen, automatische Fehlerwechsel und frühere Navigation erwartet. Die relevanten Kernprüfungen wurden angepasst und erfolgreich wiederholt. Es wird kein vollständig bestandener Lauf aller historischen 418 Tests behauptet; dafür wären weitere, vom eigentlichen Umbau unabhängige Alt-Test-Anpassungen erforderlich.
