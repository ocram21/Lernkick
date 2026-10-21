# Lernkasten, Training und Sprichwörter – Umsetzung 21.10.2026

Dieser Stand setzt `Lernkick_Codex_Aenderungen_2026-10-21.md` und die Ergänzung zu Sprichwörtern um. Er ersetzt ältere Aussagen über die Hauptnavigation, die Tafelansicht als Hauptziel und den zeitlichen Abbau der Lernstärke.

## Navigation und Bedienung

Die Hauptnavigation heißt **Training | Lernkasten | Einstellungen**. Alle bisherigen Fächer und Spiele bleiben im Training. Die interaktiven Tafeln sind nicht mehr das Ziel eines Hauptbuttons; ihre Komponenten, ursprünglichen PNG-/JSON-Dateien, ZIP-Pakete und gespeicherten Zuordnungen bleiben archiviert erhalten. Es gibt keine Kamera, Galerie, Konten oder neue externe Dienste.

Der Lernkasten verwendet `src/components/LearningBox.tsx` mit der bestehenden Kartenbasis und der bestehenden Leitner-Logik in `src/study/cards.ts`. Fachwechsel sind direkt oben möglich. Unterrubriken sind feste Mehrfachauswahlen; „Allgemein“ erhält alte Karten ohne Zuordnung. Zwei unabhängige Schalter wählen voreingestellte und eigene Karten. Nach Rundenstart wird die Auswahl kompakt zusammengefasst; „Auswahl ändern“ öffnet sie wieder. Leere Quellen/Themen oder noch nicht fällige Karten erzeugen verständliche Meldungen, keine leere Lernrunde.

Vorne steht eine Frage, nach „Antwort zeigen“ die Erklärung. „Gewusst“ und „Nicht gewusst“ sind eine Selbsteinschätzung, kein Textvergleich. Die vorhandene Wiederholungsregel bleibt: fünf höhere Fächer mit 1/3/7/14/30 Tagen; unbekannte Karten zurück auf Fach 0 und nach zehn Minuten wieder fällig. Mehrfaches sofortiges Bewerten verlängert bekannte Intervalle nicht wiederholt. Überfällige Karten kommen vor neuen; gleichrangige Karten werden zufällig gemischt, höchstens zehn pro Runde. Keine Leistungspunkte im Lernkasten oder beim Anlegen eigener Karten.

Eigene Karten werden weiterhin ausschließlich in Einstellungen → Karten verwalten erstellt, bearbeitet und gelöscht. Dieser Einstieg und die zentrale Hilfe stehen nun weiter oben als profilierte farbige Buttons. Unterrubriken werden aus festen fachbezogenen Optionen gewählt. Beim Fachwechsel im Editor wird „Allgemein“ gesetzt, um eine unpassende Rubrik zu vermeiden. Änderung oder Löschung einer Karte beendet einen betroffenen Runden-Schnappschuss; gespeicherte Wiederholungsergebnisse bleiben erhalten. Es entsteht keine zweite Karten-Datenbank.

## Voreingestellte Karten

| Fach | Vorhanden, IDs/Inhalte erhalten | Neu ergänzt | Gesamt |
|---|---:|---:|---:|
| Mathematik | 15 | 15 | 30 |
| Deutsch | 15 | 15 | 30 |
| Sozialkunde | 15 | 35 | 50 |
| Biologie | 15 | 35 | 50 |
| Geografie | 15 | 35 | 50 |
| **Summe** | **75** | **135** | **210** |

Die 30 Karten für Mathematik bzw. Deutsch sind eine redaktionelle Festlegung anhand der vorhandenen Grundbegriffe und Themen, keine zuvor festgelegte Nutzerzahl. Mathematik ergänzt insbesondere Brüche/Dezimalzahlen, Prozent/Zinsen, Geometrie, Einheiten und Diagramme. Deutsch ergänzt Wortarten, Satzbau/Fälle, Rechtschreibung/Zeichensetzung, Zeitformen und Textverständnis. Die vorgeschlagenen Unterrubriken wurden anhand der vorhandenen Lerninhalte übernommen; „Allgemein“ kommt für Altbestände hinzu. Das ist eine redaktionelle Gliederung, keine amtliche Lehrplanstruktur.

Alle bisherigen `standard.<fach>.v1.*`-IDs und Texte bleiben erhalten; neue Karten verwenden `.v2.*`. Standardkarten sind getrennt von Nutzerkarten versionierter Inhalt in `src/content/standardCards.json`. Nutzeränderungen an alten Standards werden weiterhin als persönliche Kopien rekonstruiert. Keine Standardkarte wird automatisch in `data.cards` dupliziert.

### Quellen und Prüfgrundlage

Die Definitionen sind eigenständig formuliertes Übungsmaterial. Orientierung sind die bereits im Projekt dokumentierten [Fachlehrpläne Sekundarschule Sachsen-Anhalt](https://www.bildung-lsa.de/informationsportal/unterricht/sekundarschule/schulformbezogene_informationen/lehrplan.html), mit den Fach-PDFs und Abschnittsbezügen im [bestehenden Recherchebericht](ANFORDERUNGEN-SACHSEN-ANHALT.md). Die fünf curricularen Bereiche wurden mit dem vorhandenen Fachfragenbestand abgeglichen. Zusätzliche Sachprüfgrundlagen:

- [Deutscher Bundestag: Funktion und Aufgaben](https://www.bundestag.de/parlament/aufgaben-197186), [Grundgesetz](https://www.gesetze-im-internet.de/gg/BJNR000010949.html): Institutionen, Gewaltenteilung und Grundrechte.
- [RKI: FAQ Antibiotikaresistenz](https://www.rki.de/DE/Themen/Infektionskrankheiten/Antibiotikaresistenz/FAQ/faq-node.html) und [Impfwirkung](https://www.rki.de/DE/Themen/Infektionskrankheiten/Impfen/Informationsmaterialien/Impfmythen/Wirksamkeit_Impfschutz.html): grundlegende Abgrenzungen bei Erregern, Abwehr und Impfungen. Keine individuellen Behandlungsempfehlungen.
- [Umweltbundesamt: Klima und Treibhauseffekt](https://www.umweltbundesamt.de/themen/klima-energie/klimawandel/klima-treibhauseffekt): natürliche und menschliche Klimaeinflüsse.

Redaktionell geprüft wurden Verständlichkeit, fachliche Kernaussage, doppelte Fragen, stabile IDs und die Zuordnung zu festen Rubriken. Automatische Strukturprüfungen ergänzen diesen Abgleich. Eine externe fachliche Unterrichtsfreigabe wird nicht behauptet; `teacher-review-pending` bleibt erhalten. Keine offiziellen Prüfungsfragen und keine Garantie einer vollständigen Prüfungsvorbereitung.

## Weitere Trainingsänderungen

- Mathematik: Ausgang und Titel nebeneinander, Leicht/Mittel/Schwer in einer Reihe; sechs bestehende Kategorien als Mehrfachbuttons, kein Dropdown. „Alle“ wählt alle bzw. keine. Neue Runden wechseln zwischen genau den gewählten Themen; alte laufende Runden mit früherer Einzelkategorie bleiben lesbar. Andere Fächer starten direkt.
- Galgenraten: QWERTZ bleibt erhalten; zweite und dritte Reihe sind leicht versetzt. Normal/Streber unverändert.
- Deutschlandquiz: Die Hauptstadtrunde verwendet zwei Spalten mit je acht Länderzeilen, jeweils Land über Hauptstadt. Die Kartenrunde bleibt erhalten. Auf kleinen Displays bleibt die Liste scrollbar statt abgeschnitten.
- Dual N-Back: feste gleichartige 1-/2-/3-Back-Auswahl vor Ton testen und Training starten. Gemeisterte Stufen sind markiert; 4-Back ist nach vorhandener Freigabe zusätzlich sichtbar. Kein ersetzender „Auf N3 fortsetzen“-Button. Ausgang beendet die Zeitfolge wie zuvor; die dauerhaften Erfolge bleiben. Aktive Positionsfelder nutzen im Pink-Modus kräftiges Pink mit zusätzlichem Kreis/Umriss als nicht allein farbgebundenem Merkmal.
- Wortschatz: Begriffe, Satzbau und Grammatik bleiben. Als vierter Bereich kommen **Sprichwörter** hinzu, unabhängig kombinierbar. Je 30 Aufgaben Normal/Streber, drei Alternativen, genau eine Lösung, sofort richtige Antwort und Erklärung. Alte Sprüche werden als übertragene Bilder erläutert; pauschale Aussagen wie „Erwachsene lernen nichts mehr“ werden ausdrücklich eingeordnet, nicht als Tatsache vermittelt. Neue Runden und Sprichwort-Antwortpositionen werden gemischt; die Optionsreihenfolge bleibt im laufenden Rundenstand gespeichert. Punkte und Wiederholungsfristen nutzen unverändert das vorhandene Zehn-Aufgaben-Rundensystem.
- Über Lern-Kick: getrennte tatsächliche Bestände werden im Code ermittelt: 500 Fachfragen, 210 voreingestellte Karten, 420 Begriffsaufgaben, 440 Satzbauaufgaben, 60 Grammatikaufgaben, 60 Sprichwortaufgaben. Generierte Mathevarianten werden nicht mit einer erfundenen festen Gesamtzahl beziffert. Lehrplanlinks und zutreffende Speicher-/Hostinghinweise bleiben. Nur der ausdrücklich benannte redaktionelle Platzhalter wurde entfernt; das ersetzt keine Prüfung tatsächlich erforderlicher Anbieter- oder Datenschutzangaben.

## Lernstärke: nachvollziehbare aktive Lernzeit

100 % entsprechen **300 Minuten / fünf Stunden** aktiver Beschäftigung; zehn Prozentpunkte entsprechen weiterhin 30 Minuten. Die Skala ist unabhängig von Leistungspunkten und fachlicher Richtigkeit. Der Bezug steht am Balken und in der zentralen Hilfe. Der bislang gespeicherte Prozentwert wird ohne Umrechnung aus Punkten als Ausgangsstand übernommen. Seit der Umstellung werden zusätzliche Millisekunden in `journey.activeLearningMs` dokumentiert; unbekannte historische Lernzeit wird nicht erfunden. `strengthModel:2` kennzeichnet die neue Darstellung. Der Prozentwert fällt nicht mehr wegen mehrtägiger Unterbrechungen.

Zeit wird während aktiver Trainingsaufgaben, im laufenden Lernkasten und im Editor gezählt, wenn Frage und Antwort nichtleer sind. Es findet keine semantische Bewertung der Texte statt. Ein leerer Editor zählt nicht. Eingaben werden auf echte Browserereignisse geprüft. Nach 30 Sekunden ohne Eingabe, in Pause/Rückblick, in Menüs oder im Hintergrund wird nichts addiert. Bereichs- und Sichtbarkeitswechsel setzen die Messgrenze zurück. Die Intervallmessung verwendet eine monotone Uhr, begrenzt lange Lücken und lässt keine großen Zeitsprünge als Lernzeit durch. N-Back behält seine eigene begrenzte Aktivitätsmeldung. Diese lokale App bietet keinen Schutz gegen bewusstes Verändern des öffentlichen Clients oder lokalen Speichers.

Text und Balken verwenden denselben einmal berechneten Wert. Browserspezifische Progress-Regeln bleiben getrennt; Orange/Pink zeigt die proportionale Füllung: null leer, sechs Prozent sichtbar sechs Prozent, hundert voll. Keine künstliche Mindestfüllung.

## Daten und Migration – Format 4

IndexedDB `lernkick`, Store `user`, Schlüssel `data` bleiben dieselben. Die Datenversion ist jetzt **4**, damit alte Version-3-Clients neue Felder nicht unbemerkt zurückschreiben. Versionen 1, 2 und 3 sowie aktuelle Sicherungen werden weiter gelesen. Die Migration ist idempotent und erfolgt in der bestehenden atomaren Schreibtransaktion. Vor einer Altformat-Umstellung wird einmal der unveränderte Datensatz unter `backup.before-v4` gesichert; bestehende Sicherungsstände werden nicht überschrieben. Ältere App-Versionen können das neue Format nicht lesen und müssen aktualisiert werden.

Neue Felder:

- Karte: `rubric` aus einer festen Werteliste, ohne frühere Angabe automatisch `general`.
- `study.box`: Fach, unabhängige Quellenflags und je Fach ausgewählte Rubriken.
- Bestehendes `cardSession`: derselbe gespeicherte Lernrunden-Schnappschuss, neu mit Rückkehrziel `box`. Kein zweiter Kartenbestand.
- `journey.strengthModel` und `activeLearningMs`: neue Zeitdarstellung, bisherige Punkte und Modulstände unverändert.
- `activities.vocabulary.enabled.proverbs` (alt: false), `proverbs` (alt: leer), optionale `session.optionOrders` für stabile zufällige Antwortpositionen.

Eigene Karten, alle Leitner-Werte, Standard-IDs, Punkte, Kompetenzen, N-Back-Erfolge, Einstellungen, frühere Tafeldaten und Archive bleiben erhalten. Import eines älteren Stands desselben Profils bewahrt zusätzlich die höhere vorhandene Lernstärke und Zeitaufzeichnung. Ein ausdrücklich bestätigter Wechsel zu einem anderen Profil vermischt weiterhin keine Personen. Gesamt-Sicherung exportiert die neuen Felder mit; bereits bestehende Erstell-/Bearbeitungs-/Lösch-/Exportfunktionen bleiben.

## Prüfungen und Grenzen

Unit-Tests sichern Kartenanzahl/IDs/Rubriken, alte Karten ohne Rubrik, idempotente Migration, Wiederholungsintervalle, Schutz voreingestellter Karten, Import/Export, Lernzeit-Skala sowie beide Sprichwort-Pools. Browserprüfungen decken kleine/mobile und Desktop-Ansichten, Quellen einzeln/beide/keine, Fachwechsel, Gewusst/Nicht gewusst ohne Punkte, Kartenbearbeitung und Sicherung, zufällige Sprichwortrunden einschließlich falscher/richtiger Antworten und Punkte, Mathe-Mehrfachwahl, N-Back-Neustart und Pink-Zustände ab. Bestehende PIN-, Offline- und PWA-Update-Prüfungen bleiben Bestandteil der Regression.

Ausgeführt wird Chromium über das installierte Chrome auf macOS; mobile Größen und Touch werden emuliert. Physische Android-/iOS-/Windows-Installation und die fachliche Abnahme im Unterricht bleiben gesonderte Schritte.

Abschließende lokale Prüfung: 123 Unit-Tests und 147 Browser-Tests erfolgreich. Produktionsbuild erfolgreich; der lokale Veröffentlichungs-Prüflauf bestätigt PIN, Lernkasten-Bewertung ohne Punkte, Sprichwortfeedback, N-Back und Offline-Neustart mit erhaltenen Daten. Impeccable-Sichtprüfung: `disposition: ship`, keine wesentlichen offenen Befunde; Aufnahmen für 320/390 px und Desktop. Ein mechanischer Design-Scan meldete keine primären Befunde, ausschließlich Hinweise zu bestehenden Schriftgrößen/Radien.
