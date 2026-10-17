# Mathe-Pilot: Plan, Kompetenzstruktur und Migration

Stand: 17.10.2026. Auftrag: adaptiver Lernpfad und Kompetenz-Mosaik.

## Bestandsaufnahme vor der Implementierung

Wiederverwendet werden React/TypeScript/Vite, alle 500 redaktionellen Fragen samt IDs, IndexedDB-Datenbank `lernkick` und Store `user`, Zehn-Fragen-Runden, bestehende Leitner-Einträge, Punkte/Bestleistungen, eigene Karten, Sicherungen, Offline-Cache und bewusste App-Aktualisierung. Die kompakte Startseite und die erreichbare Weiter-Aktion bleiben bestehen. Die bisherige fachweite Trefferquote ist für Einzelkompetenzen ungeeignet und wird nur im Mathe-Lernmodus ersetzt. Freies Üben erhält den vollständigen redaktionellen Bestand.

Migrationsrisiken: Alte Daten enthalten keine Antwortzeitpunkte, Hilfen oder belastbaren Kompetenzzuordnungen. Aus alten Summen dürfen keine gesicherten Kompetenzen oder zeitversetzten Erfolge erfunden werden. Alte Fragefortschritte und Bestleistungen bleiben deshalb unverändert; alte Versuche werden als Ausgangsstand übernommen, neue Beobachtungen getrennt erfasst. Unbekannte Kompetenz- und Freischaltungs-IDs müssen einen Import überleben. Fehlerhafte oder zukünftige Sicherungsformate werden abgewiesen, niemals durch leere Daten ersetzt. Datenbank und Store werden nicht gelöscht oder neu angelegt.

## Umsetzungsschritte

1. Datengetriebenen Mathe-Kompetenzgraphen und separat prüfbare Zuordnung aller 100 Fragen anlegen.
2. Versionierte, injizierbar zufällige Generatoren für Zahlvergleich, Addition, Subtraktion, Multiplikation und Division mit nachprüfbaren Ergebnissen, eindeutigen Optionen und Lernhilfen implementieren.
3. Kompetenzbeobachtungen, vorsichtige Stufenwechsel, Voraussetzungen, Unterstützung nach Fehlern und verteilte Wiederholung als reine Funktionen entwickeln.
4. Sicherungen Version 1 verlustfrei in Version 2 einlesen; Version 2 mit Kompetenzbeobachtungen, Lernweg-Wahl und dauerhaften Meilensteinen speichern.
5. Hilfen und freiwillige Lernweg-Wahl in die vorhandene Runde einbauen; kurze Bedienhilfe ergänzen.
6. Fachweise austauschbare Mosaik-Konfiguration mit neutralen Segmenten anbinden; fachlich belastbare Kompetenzansicht zunächst nur für Mathe.
7. Unit-, Speicher- und Browserprüfungen einschließlich alter Sicherungen, Offline-Nutzung, Fehlerfolgen und dauerhaftem Mosaik durchführen; Produktionsbuild erstellen.

## Konkrete Kompetenzstruktur

Stabile IDs mit Präfix `math.`. Jeder Knoten hat Titel, Voraussetzungen und Stufen 1–3. Stufen beschreiben Aufgabenanforderungen, kein unveränderliches Personen-Level.

- `number.compare`: Zahlen vergleichen → `add.no-carry`: Addition ohne Zehnerübergang → `add.carry`: Addition mit Zehnerübergang.
- `add.no-carry` → `subtract.no-borrow` → `subtract.borrow`; `add.no-carry` → `multiply.facts` → `divide.exact`.
- `number.compare` → `number.place`, `number.negative`; `divide.exact` → `number.divisibility`.
- `add.carry` und `subtract.borrow` → `decimal.calculate`; `multiply.facts` und `divide.exact` → `fraction.basic` → `fraction.calculate`.
- `decimal.calculate` und `fraction.basic` → `percent.basic` → `percent.change`; `multiply.facts` und `divide.exact` → `ratio.proportion`.
- `decimal.calculate` → `measure.convert`; `ratio.proportion` und `measure.convert` → `applied.model`.
- `add.carry` und `multiply.facts` → `term.evaluate` → `equation.linear` → `formula.rearrange` und `equation.system`.
- `multiply.facts` → `power.basic` → `function.power`; `term.evaluate` → `function.linear`; `ratio.proportion` → `growth.model`.
- `add.carry` → `geometry.angle`; `multiply.facts` → `geometry.area` → `geometry.circle`, `geometry.volume`; `power.basic` und `geometry.area` → `geometry.pythagoras`; `geometry.volume` → `geometry.pyramid`.
- `divide.exact` → `data.summary`; `fraction.basic` → `chance.single`; `data.summary` → `data.critique`.

Die ausführbare Struktur steht in `src/learning/mathCompetencies.ts`, die getrennte Zuordnung der Bestandsfragen in `src/learning/mathAssignments.json`. Bei fachlich zu breiten Aufgaben werden Zuordnungen als vorläufig markiert. Keine automatische amtliche oder lehrkräfteseitige Freigabe.

## Noch zu prüfen

Die Grenzwerte und Aufgabenvarianten sind didaktische Arbeitsannahmen, keine validierte Diagnostik. Ein kurzer Test mit Lernenden muss noch zeigen, ob sie die Hilfe, Lernweg-Wahl und Mosaikdarstellung verstehen. Es werden keine stattgefundenen Lernenden- oder Lehrkräftetests behauptet. Aufwendige Bildwelten und eine Prüfungssimulation gehören nicht zu diesem Pilot.

## Auswahllogik und Grenzwerte des implementierten Piloten

`nextMathTask` ist unabhängig von React. Uhrzeit und Zufallsquelle sind injizierbar. Die Reihenfolge ist:

1. Offene Unterstützung nach einem Fehler. Zwei erfolgreiche unterstützende Varianten derselben Fähigkeit auf einer niedrigeren Aufgabenstufe, anschließend eine andere Variante der ursprünglichen Stufe ohne eingeblendete Hilfe. Am unteren Rand bleibt die Stufe 1; die Aufgabe wird durch Hinweise leichter zugänglich.
2. Nach jeweils drei Fehlern einen Grundlagenschritt einflechten. Schlägt auch dieser fehl, wird die ursprüngliche Herausforderung in `returnTo` behalten. Nach der Grundlagenhilfe kehrt die Auswahl zurück. Kein wiederholtes Erzwingen derselben wörtlichen Aufgabe.
3. Bereits vorhandene, fällige redaktionelle Leitnerfragen. Diese expliziten alten Wiederholungen bleiben auch ohne neu beobachtete Voraussetzungen erreichbar.
4. Fällige Kompetenzwiederholung, dann die zuletzt noch geübte Fähigkeit, dann neue Fähigkeiten mit passenden Voraussetzungen. Anschließend weniger häufig bearbeitete geeignete Fähigkeiten als Fallback.

Die Stufe beginnt bei 1 und steigt höchstens um einen Schritt, wenn unter den letzten vier Beobachtungen mindestens drei selbstständig richtige Antworten mit drei unterschiedlichen Aufgabensignaturen vorliegen. Ein Fehler senkt die aktuell geplante Stufe dieser Einzelkompetenz höchstens um einen Schritt. Hilfen lösen keine Minuspunkte aus. Ein mit Hilfe gelöster leichterer Schritt wird nicht als selbstständige Bewältigung einer höheren Stufe gewertet.

Voraussetzungen gelten für einen behutsamen Einstieg als zugänglich, wenn mindestens zwei unterschiedliche Varianten selbstständig gelöst wurden. Bei migrierten Beständen erlauben mindestens drei frühere Versuche mit mindestens 60 % richtigen Antworten einen vorsichtigen Zugang. Das ist ausdrücklich eine Platzierungsannahme, kein Nachweis gefestigter Sicherheit.

Pro Kompetenz werden die letzten zwölf Antworten einschließlich Aufgabensignatur, Zeitpunkt, Aufgabenstufe und höchster verwendeter Hilfestufe sowie kumulierte neue Antwort-/Hilfenzahlen gespeichert. Der alte Ausgangsstand bleibt getrennt. Es wird keine Antwortdauer gemessen oder interpretiert.

- „Du übst gerade“: erste Beobachtungen oder noch zu wenig unabhängige Erfolge.
- „Fortschritt sichtbar“: mindestens drei selbstständig richtige, unterschiedliche Varianten unter den letzten sechs Beobachtungen.
- „Über Zeit gefestigt“: zusätzlich mindestens 20 Stunden zwischen erster und letzter unabhängiger Beobachtung, die letzten zwei Beobachtungen richtig und ohne Hilfe. Diese Einstufung kann sich wieder ändern.
- Identische Varianten innerhalb von 24 Stunden werden nicht mehrfach als unabhängige Evidenz gezählt. Die reine Wiederholung derselben Antwort entsperrt keinen Erfolg.

Kompetenz-Wiederholung: Fehler nach 10 Minuten, mit Hilfe richtige Antwort nach 30 Minuten, erste selbstständige Erfolge nach 4 Stunden, sichtbarer Fortschritt nach 1 Tag, zeitversetzt gefestigte Kompetenz nach 7 Tagen. Die bestehende fragebezogene Leitner-Planung mit 1/3/7/14/30 Tagen bleibt zusätzlich erhalten. Termine bedeuten Auswahlpriorität, keine Frist für Lernende. Die unmittelbare Unterstützung nach einem Fehler hat Vorrang.

Die freiwillige Lernweg-Wahl wird fachweise gespeichert. „Mach’s leichter“ vermindert die nächste gewünschte Stufe um eins, „Mehr Herausforderung“ erhöht sie um höchstens eins und überspringt keine neu unbeobachteten Voraussetzungen. „Passt genau“ hebt die persönliche Anpassung wieder auf. Laufende Fehlerunterstützung und bestehende fällige Wiederholungen haben Vorrang. „Erklär’s anders“ wechselt zur zweiten Formulierung und öffnet die Hilfe; die Wahl kann zurückgenommen werden. Keine dieser Wahlen schreibt die Kompetenzbewertung abrupt um.

## Generatoren, Hilfen und Fallbacks

Sieben generierbare Teilkompetenzen: Zahlvergleich, Addition ohne/mit Übergang, Subtraktion ohne/mit Übergang, Multiplikation und ganzzahlige Division ohne Rest. Drei Zahlenräume bzw. Darstellungsstufen, positive ganze Lösungen einschließlich null bei Subtraktion; niemals Division durch null. IDs enthalten Generatorversion, Kompetenz, Stufe und Parameter. Antwortoptionen sind eindeutig. Die Aufgabenreihenfolge wird mit einer separaten Signatur gegen Wiederholungen derselben Zahlenaufgabe abgesichert; übereinstimmende einfache Katalogaufgaben verwenden dieselbe Signatur.

Nach höchstens 24 normalen Zufallsversuchen folgen begrenzte deterministische Versuche. Danach werden passende andere Katalogaufgaben oder zugängliche Grundlagen verwendet. Damit endet die Auswahl auch bei einer konstanten Zufallsquelle. Für nicht generierbare Kompetenzen nutzen wir den vorhandenen Katalog. Falls dort keine niedrigere Stufe vorhanden ist, wird keine schwierigere als die Ausgangsaufgabe als Unterstützung ausgegeben: Ein passender Grundlagenknoten und mehr Anschauung treten an ihre Stelle. Es gibt keine Behauptung, dass bereits für alle Kompetenzen beliebig viele Varianten vorliegen.

Hilfen: Hinweis → anderes gelöstes Beispiel → Erklärung der aktuellen Lösung. Die höchste genutzte Stufe wird bei der Antwort vermerkt; manuelle Hilfeabrufe zählen zusätzlich auch dann, wenn die Runde verlassen wird. Automatisch angebotene Unterstützung erscheint offen und zählt als Hilfestufe, sofern damit beantwortet wird. Zahlenstrahl für Addition/Subtraktion und kleine Punktefelder für geeignete Multiplikationen sind optionale Hilfedaten, keine Pflichtdarstellung für jede Frage.

Neue generierte Varianten geben höchstens einmal pro Kompetenz und 24 Stunden Punkte, um keine Punktesammlung durch fortlaufend neue Parameter zu fördern. Bestandsfragen behalten ihre bisherige Punktebegrenzung pro Frage. Es gibt keine Minuspunkte. Die frühere globale Level-Zahl wurde durch beobachtete Kompetenzschritte ersetzt: Ein statisches Personen-Level würde der geforderten veränderlichen, kleinteiligen Einschätzung widersprechen. Alte Punktbestleistungen bleiben erhalten.

## Mosaik und übertragbare Architektur

`learning.unlocks` enthält dauerhaft erworbene Ereignisse mit stabilen Kompetenz-IDs. Weder Fehler noch spätere Neubewertung entfernen sie. `mosaics.ts` ordnet diese Ereignisse getrennten Bildsegmenten zu. Welt-ID, Motive, Segmentpositionen und Zuordnung können geändert werden, ohne die gespeicherten Ereignisse zu löschen. Die aktuelle Darstellung verwendet zwölf neutrale Segmente pro Fach; finale Wimmelbilder sind noch nicht gestaltet.

In Mathematik zeigen ausgewählte Kompetenz-Meilensteine das Bild. In den vier anderen Fächern kommen nach jeweils drei weiteren verschiedenen selbstständig richtig beantworteten Fragen zusätzliche Segmente hinzu, bis 36 Fragen zwölf Teile ergeben. Diese Ereignisse heißen bewusst Übungsfortschritt und werden nicht als fachlich validierte Kompetenzdiagnose ausgegeben. Ihre bisherige Aufgaben-Auswahl bleibt unverändert; dieselben Datentypen und Ereignisse können später mit einem eigenen Kompetenzbaum verbunden werden.

Die reine Lernlogik liegt unter `src/learning/`, die UI-Anbindung in `LearningTools` und `CompetencyMosaic`. Es wird kein externer Dienst aufgerufen. Mosaike, Generatoren und Hilfen sind im Offline-Build enthalten; es gibt keine dauernde Belohnungsanimation. Reduzierte Bewegung wird weiterhin beachtet.

## Daten und Rückwärtskompatibilität

Neue Sicherungen verwenden Datenversion 2. `migrateData` akzeptiert validierte Version 1, übernimmt Fragefortschritte einschließlich unbekannter alter IDs, Karten, Einstellungen und Bestleistungen unverändert und ergänzt die neue Lernschicht. Alte Summen werden nur bekannten Fragen zugeordnet; unbekannte Fortschritts-IDs bleiben im Original erhalten. Unbekannte Kompetenz- und Ereignis-IDs der neuen Version bleiben erhalten. Die Migration ist idempotent. Eine künftige unbekannte Datenversion oder beschädigte Sicherung wird abgewiesen.

Die IndexedDB-Datenbankversion bleibt 1: derselbe Store und derselbe Datensatz, kein Löschen von Datenbank, Store oder Caches. Beim Laden wird ein validierter alter Datensatz atomar durch die migrierte Form ersetzt. Ein fehlgeschlagener Lese-/Validierungsschritt führt weiterhin zur sichtbaren Speichermeldung und überschreibt den Bestand nicht mit leeren Daten. Ein Import ersetzt wie bisher erst nach Bestätigung den aktuellen Lernstand und die Karten. Bereits erworbene Mosaik-Ereignisse werden mit den importierten vereinigt; auch eine ältere Sicherung nimmt keine Bildteile zurück. Version 2 ist mit der neuen App lesbar; eine alte App kann eine neue Sicherung nicht verarbeiten. Bei einem technischen Rollback muss deshalb die neue Datenleseschicht mitgeführt werden.

## Kurzer Verständlichkeitstest mit Lernenden: offen

Noch nicht durchgeführt. Vorschlag für einen begleiteten Test mit 3–5 Lernenden, ohne Leistungsbenotung:

1. Die kurze Hilfeseite lesen lassen: „Wie startest du eine Runde?“ und „Was passiert nach einer falschen Antwort?“ in eigenen Worten erklären lassen.
2. In Mathe einen Hinweis und ein Beispiel finden lassen. Fragen, ob der Unterschied verständlich ist und ob die Hilfe wieder geschlossen werden kann.
3. „Mach’s leichter“ und anschließend „Passt genau“ wählen lassen; prüfen, ob klar ist, dass die Wahl veränderbar ist und die nächste Aufgabe betrifft.
4. Das Wimmelbild finden und erklären lassen, ob ein Fehler ein Bildteil wieder entfernen kann.
5. Den Ort der Sicherung zeigen lassen; Begriffe und Sätze notieren, bei denen Nachfragen nötig waren.

Abnahmekriterium als Arbeitsannahme: Jede Kernhandlung gelingt ohne vorsagende Hilfe; missverständliche Begriffe werden vor dem Klassenpilot überarbeitet. Fachliche Freigabe von Generatorvarianten, Kompetenzgrenzen und Zuordnungen sowie Installation auf echten Mobilgeräten bleiben zusätzlich offen.

## Aktuelle kompakte Fortschrittsoberfläche

Auf nachfolgenden Nutzerwunsch zeigt „Fortschritt“ nur die Fachauswahl und das Bild ohne Scrollen. Kompetenzzustände, Baseline und Bestleistungen bleiben im Datenmodell und in Sicherungen erhalten, werden dort aber nicht als Textliste oder Zähler angezeigt. Der Lernenden-Test fragt entsprechend nach dem Finden der Ansicht „Fortschritt“, dem Wechsel zwischen Fächern und dem dauerhaften Erhalt freigelegter Bildteile. Die Bildwelten sind weiterhin neutrale austauschbare Platzhalter.
