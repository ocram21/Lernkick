# Neues Prüfprotokoll: Mathe-Tafelwerk vereinfachen

**Datum:** 16.11.2026  
**Geprüfter Stand:** `bf072ac` · 59 Tafeln · 109 Schritte  
**Status:** Nachträglich beauftragte Umsetzung am 16.11.2026; siehe Umsetzungsvermerk am Ende. Die folgenden Prüfbefunde dokumentieren den Ausgangsstand.

## Auftrag und Maßstab

Geprüft wurden Verständlichkeit und Einfachheit des aktuellen Bestands. Ziel ist **weniger Text und weniger unnötige Zwischenschritte bei gleicher Aussage**. Dieses Protokoll fordert keine zusätzlichen Themen, Beispiele, Zeichnungen, Bedienelemente oder Fachwortsammlungen.

Alle 59 Tafeln mit ihren 109 Schritten wurden redaktionell durchgesehen. Zusätzlich wurde die Ausgabe in `src/components/Tafelwerk.tsx` mit den zugehörigen Darstellungen in `visuals.ts` abgeglichen. Wichtig: Bei `math-stack` wird das separate Feld `formula` derzeit nicht zusätzlich ausgegeben. Ähnliche Einträge in der JSON-Datei sind deshalb nicht automatisch eine sichtbare Doppelung.

Dies ist eine Inhalts- und Strukturprüfung anhand des aktuellen Quellstands. Es wurde keine neue Browser- oder Realgeräteprüfung vorgenommen. Ob zusammengefasste Ansichten ohne Scrollen passen, wäre erst bei einer später ausdrücklich beauftragten Umsetzung zu prüfen.

## Ergebnis

Die vorhandenen Beispiele reichen aus. Weitere Ergänzungen würden das Nachschlagen eher erschweren. Der nächste sinnvolle Schritt wäre eine kleine redaktionelle Straffung:

1. Vollständige Rechenwege schneller zeigen, statt dieselbe Rechnung mehrfach aufzubauen.
2. Sätze streichen, die nur sichtbare Zahlen oder Ergebnisse wiederholen.
3. Sehr verkürzte Zahlensprache durch einen verständlichen Satz ersetzen – nicht durch einen längeren Erklärungstext.

**Nicht jede Tafel braucht eine Änderung.** Viele kurze Tafeln können unverändert bleiben. Eine feste Kürzungsquote oder eine vorgegebene neue Schrittzahl ist nicht sinnvoll.

## V01 · Vorrangig: Weniger Zwischenansichten bei vollständigen Rechenwegen

**Fundstellen:** `gleichung-einfach` (3 Schritte), `gleichung-beidseitig` (4), `gleichung-klammer` (4), `pythagoras` (5), `gleichungssystem` (4).

Bei den linearen Gleichungen enthält die letzte Ansicht bereits den vollständigen Rechenweg. Zuvor wird dieser zeilenweise aufgebaut. Das ist zum angeleiteten Lernen geeignet, für ein Tafelwerk aber unnötig kleinteilig.

**Vereinfachungsvorschlag:** Bei den drei linearen Gleichungstafeln die vorhandene vollständige Endansicht als eigentliche Nachschlageübersicht nutzen. Die Probe behalten. Zwischenansichten können entfallen; keine neue Rechnung nötig.

Bei Pythagoras bieten sich zwei vorhandene Inhaltsblöcke an: Regel mit Bild sowie durchgerechnetes Beispiel mit Probe. Beim Gleichungssystem zwei Blöcke prüfen: Einsetzen und x berechnen; danach y und die beiden Proben. Nicht alle Zeilen auf einen Bildschirm pressen, wenn sie dadurch unlesbar werden.

**Behalten:** Umformung auf beiden Seiten, Klammern beim Einsetzen, positive Seitenlänge und richtige Einheiten. Kürzen darf diese Aussagen nicht entfernen.

## V02 · Vorrangig: Fertige schriftliche Rechnungen nicht im Fließtext erneut nacherzählen

Die vier vollständigen Rechnungsbilder sind bereits vorhanden und sollen so bleiben. Die Texte darunter müssen nur die jeweilige Besonderheit erklären.

| Tafel | Kürzungs- oder Klarheitsbedarf | Vorschlag ohne Zusatzinhalt |
|---|---|---|
| `schriftlich-addieren` | Text nennt Rechenschritte und danach nochmals das sichtbare Ergebnis. | Stellenordnung und Bedeutung der kleinen Einsen behalten; die abschließende Ergebniswiederholung streichen. |
| `schriftlich-subtrahieren` | „Von 5 + 1 bis 12: 6“ ist sehr kurz, aber sprachlich schwer zu entschlüsseln. | Im Text einen Übertrag in einem vollständigen Satz erklären, statt alle drei Spalten in dieser Kurznotation aufzuzählen. Das vollständige Rechnungsbild bleibt. |
| `schriftlich-mal` | Zehnerwert, Linksversatz, Nullstelle, Summe und Übertrag stehen dicht hintereinander. | Die wichtigen Aussagen „2 steht für 20“, Linksversatz/Nullstelle und kleine 1 behalten. „Dazu 10548 ergibt 63288“ streichen: Die Summe steht schon im Bild. |
| `schriftlich-geteilt` | Die gesamte Ergebnisfolge wird im Text noch einmal ausgerechnet. | Den Ablauf „teilen, abziehen, nächste Ziffer herunterholen“ und den entscheidenden Nullfall `3 : 7 = 0 Rest 3` hervorheben. Die übrigen sichtbaren Endwerte nicht zusätzlich aufzählen. |

**Mögliche Ersatzformulierung für die Subtraktion:** „Bei den Einern ist 6 kleiner als 8. Von 8 bis 16 fehlen 8; die kleine 1 wird unten in die Zehnerspalte übertragen.“ Dies ist ein Ersatz für die komprimierte Zahlenkette, kein zusätzlicher Absatz. Nicht mit einem anderen Subtraktionsverfahren vermischen.

## V03 · Mittel: Identische Bilder nicht auf fast gleichen Folgeseiten wiederholen

| Tafel | Aktueller Aufbau | Vereinfachungsvorschlag |
|---|---|---|
| `median` | Schritt 1 und 2 zeigen dieselben fünf bereits sortierten Werte. | Sortierung und mittleren Wert in einer Ansicht erklären. Den vorhandenen geraden Fall als eigenen Fall behalten. |
| `symmetrie` | Beide Schritte zeigen dieselbe Zeichnung. | Eine Zeichnung mit der knappen Aussage zum deckungsgleichen Falten und zum gleichen Abstand genügt. |
| `aehnlichkeit` | Beide Schritte zeigen dieselben zwei Dreiecke. | Zuordnung und vorhandenen Faktor 3 in einer Übersicht bündeln, sofern gut lesbar. Keine weiteren Seitenpaare ergänzen. |
| `tafelprojektion` | Beide Schritte enthalten bereits beide Ansichten. | Grundriss und Aufriss in einer gemeinsamen Übersicht erklären. Die zweimalige ausführliche Erklärung der hochgestellten Buchstaben ist verzichtbar, weil die Ansichten ausgeschrieben beschriftet sind. |
| `relative-haeufigkeit` | Zuerst werden sechs Treffer von zehn genannt, danach wird derselbe Anteil berechnet. | Die vorhandenen Zahlen und `6 : 10 = 60 %` zusammenführen. Keine weitere Trefferreihe ergänzen. |
| `massstab` | Schritt 2 wiederholt das bereits in Schritt 1 gezeigte Paar 3 cm / 300 m. | Die vollständige erste Tabelle reicht; die Wiederholung des Verdreifachens kann entfallen. |

Zusammenführen ist nur dann eine Verbesserung, wenn die vorhandene Zeichnung und die Kernregel gut lesbar bleiben. Falls es eng wird, zuerst Wiederholungen streichen, nicht die Schrift verkleinern.

## V04 · Mittel: Sichtbare Zahlen nicht vollständig in Sätzen wiederholen

**Fundstellen:** `prozent`, `wahrscheinlichkeit`, `mehrstufige-wahrscheinlichkeit`, `vierfeldertafel`, `kreis`, `rechteck`, `mittelwert`.

Hier stehen in Bild oder Rechnung bereits Werte, die der Erklärungstext erneut nennt. Ein Satz zur Regel oder Bedeutung ist oft hilfreicher als die erneute Aufzählung.

Beispiele für eine spätere Straffung:

- **Prozentwert:** Statt „G ist der Grundwert, also das Ganze: 80 €. Gesucht sind 20 % davon. Setze für die Prozentzahl p die 20 ein. Der Anteil W beträgt 16 €.“ genügt als Begleittext: „G ist das Ganze, W der Anteil. Für 20 % wird p = 20 eingesetzt.“ Rechnung und Ergebnis bleiben sichtbar. Die Unterscheidung von Prozentzahl und Prozentsatz bleibt bestehen.
- **Kreisfläche:** Der Text muss die komplette Rechnung aus der Zeichnung nicht wiederholen. „r ist der Abstand vom Mittelpunkt zum Rand. Die Fläche wird in cm² angegeben.“ reicht als Begleittext zum vorhandenen Bild.
- **Rechteck:** U und A direkt benennen: „U = Umfang: Länge des Randes. A = Fläche: Größe der Innenfläche.“ Die Rechnung mit Einheiten muss dabei weiterhin einmal sichtbar bleiben; sie darf nicht ersatzlos aus dem Text verschwinden, solange das Bild sie nicht enthält.
- **Vierfeldertafel:** Die Bedeutung von Innenfeldern und Randsummen erklären; nicht nochmals sämtliche Personenzahlen aufzählen. Die Zuordnung Bus/Rad und mit/ohne Abo bleibt erhalten.

**Kein pauschales Löschen:** Dass eine Zahl in Text und Bild vorkommt, ist allein kein Fehler. Streichen nur dort, wo der Satz keine zusätzliche Erklärung liefert.

## V05 · Mittel: Alltagsnahe Wörter statt weiterer Fachwort-Erklärungen

| Fundstelle | Derzeit schwerer Ausdruck | Einfachere Formulierung an derselben Stelle |
|---|---|---|
| `ausmultiplizieren` | „Das Distributivgesetz“, „jeder Summand erhält den Faktor“ | „Die Zahl vor der Klammer mit beiden Teilen multiplizieren.“ Die vorhandene Rechnung erklärt die Regel. |
| `ausklammern` | Zwei allgemeine Definitionen von Summanden und Faktoren vor dem eigentlichen Beispiel. | Mit dem Beispiel beginnen: „6x und 9 enthalten beide den Faktor 3. In der Klammer bleiben 2x und 3.“ Die Begriffsdefinitionen können hier entfallen. |
| `binomische-formeln`, Schritte 2–3 | „negative Mischprodukte“ | Die bereits sichtbaren Ausdrücke direkt nennen: „−ab − ab ergibt −2ab“ bzw. „+ab und −ab heben sich auf“. Keine weitere Begriffserklärung hinzufügen. |
| `kombinatorik` | „Anzahlen der unabhängigen Wahlen“ | „Jedes Shirt passt zu jeder Hose: 2 · 3 = 6.“ |
| `quadrat` | „fragt umgekehrt nach dieser nichtnegativen Zahl“ | „Die Quadratwurzel ist die nichtnegative Zahl, deren Quadrat 36 ergibt: √36 = 6.“ Als Ersatz, nicht zusätzlich; die Einschränkung auf nichtnegative Wurzeln bleibt. |
| `exponentialfunktion` | Mehrfach „Schritte“ und „x-mal“ hintereinander. | „x zählt die Zeitschritte. Startwert 2, in jedem Schritt verdoppeln.“ Das vorhandene Beispiel `f(3) = 16` höchstens einmal nennen. |

Fachbegriffe in Formeln oder Überschriften müssen nicht generell verschwinden. Unnötig sind vor allem zusätzliche Definitionen, die das eigentliche Beispiel unterbrechen.

## V06 · Mittel: Überschriften als Nachschlagebegriffe statt Fragen oder Arbeitsaufträge

Das Tafelwerk soll informieren. Einige Überschriften wirken noch wie Aufforderungen aus einem Aufgabenteil.

Mögliche reine Ersatzformulierungen:

| Aktuell | Einfacher als Nachschlageüberschrift |
|---|---|
| „Prozentwert: Wie groß ist der Anteil?“ | „Prozentwert: der Anteil“ |
| „Grundwert: Wie groß ist das Ganze?“ | „Grundwert: das Ganze“ |
| „Prozentsatz: Wie viel Prozent?“ | „Prozentsatz: Anteil in Prozent“ |
| „Exponentielle Frage stellen“ (`logarithmus`) | „Den Exponenten bestimmen“ |
| „Den dritten Winkel benennen“ | „Dritter Innenwinkel“ |
| „Gemeinsame Fälle eintragen“ | „Innenfelder und Randsummen“ |

Nur die Formulierung ersetzen. Daraus entstehen keine neuen Schritte, Übungen oder Lösungsfelder.

## V07 · Nachrangig: Kleine sprachliche Stolperstellen direkt ersetzen

- **`vorzeichen`:** „(ohne 0)“ ist als Einschub unklar. Besser im selben Satz „für Zahlen ungleich 0“ schreiben. Den langen Verweis „Plus und Minus erklärt der Zahlenstrahl“ kann man dafür weglassen. Das Verbot, durch 0 zu teilen, bleibt ausdrücklich stehen.
- **`dezimalzahlen`:** „Jede Stelle rechts vom Komma ist zehnmal kleiner“ kann verkürzt missverstanden werden. Klarer: „Jede nächste Stelle nach rechts hat ein Zehntel des Werts.“ Die vorhandene Stellenwerttabelle genügt als Beispiel.
- **`stellenwert`:** „So kannst du die Zahl lesen, ordnen und zerlegen“ ist ein allgemeiner Zusatz ohne Erklärung am Beispiel. Dieser Satz kann entfallen.
- **`median`:** Den Vergleich mit dem Durchschnitt bei Ausreißern für eine reine Nachschlageübersicht zunächst weglassen. Die Regel für ungerade bzw. gerade Anzahl ist hier der Kern.

## Was unverändert bleiben sollte

- Die vier vollständigen schriftlichen Musterrechnungen mit der gewünschten Anordnung.
- Die sichtbaren Erweiterungsfaktoren bei ungleichnamigen Brüchen, die drei getrennten binomischen Formeln, der negative Fall bei Ungleichungen und die Subtraktion einer negativen Zahl. Sie unterscheiden tatsächlich verschiedene Regeln und sind keine bloßen Wiederholungen.
- Die drei unterschiedlichen Prozentfälle sowie Länge/Masse/Zeit. Nicht aus Sparsamkeit verschiedene Regeln vermischen.
- Notwendige Bedingungen: kein Teilen durch 0, Pythagoras nur im rechtwinkligen Dreieck, passende Voraussetzungen beim Dreisatz und gleich wahrscheinliche Fälle bei der Wahrscheinlichkeitsrechnung.
- Die vorhandenen Zeichnungen zu Kreis, Winkelmesser, Ähnlichkeit, Projektion und binomischer Formel. Keine weiteren Bilder ergänzen; erst die Begleittexte straffen.
- Fachnavigation, Farben, Lernfortschritt, gespeicherte Runden und Offline-Verhalten. Für diese Vereinfachungsprüfung besteht kein Änderungsanlass.

## Vollständiger Überblick über die geprüften Tafeln

„Beibehalten“ heißt: In dieser auf Vereinfachung gerichteten Prüfung wurde kein vorrangiger Änderungsbedarf gefunden. Es ist keine Aufforderung, dort weitere Inhalte zu suchen.

| Rubrik | Tafel / ID | Vorschlag |
|---|---|---|
| Zahlen & Regeln | Vorzeichenregeln (`vorzeichen`) | Nur Einschub und Verweis straffen (V07). |
| Zahlen & Regeln | Negative Zahlen am Zahlenstrahl (`negative-addieren`) | Beibehalten. |
| Zahlen & Regeln | Punkt vor Strich (`reihenfolge`) | Beibehalten; die Reihenfolgeregel ist nötig. |
| Zahlen & Regeln | Quadratzahl und Quadratwurzel (`quadrat`) | Umkehrung direkter formulieren (V05). |
| Zahlen & Regeln | Dezimalzahlen verstehen (`dezimalzahlen`) | Stellenwertsatz präziser ersetzen (V07). |
| Zahlen & Regeln | Stellenwerte natürlicher Zahlen (`stellenwert`) | Allgemeinen Schlusssatz streichen (V07). |
| Zahlen & Regeln | Potenzen verstehen (`potenzen`) | Beibehalten; zwei verschiedene Regeln. |
| Zahlen & Regeln | Mit negativen Zahlen rechnen (`negative-rechnen`) | Beibehalten; drei unterschiedliche Fälle. |
| Zahlen & Regeln | Logarithmen als Umkehrung (`logarithmus`) | Überschrift sachlicher; kein weiterer Stoff (V06). |
| Schriftlich rechnen | Schriftlich addieren (`schriftlich-addieren`) | Nur Besonderheit erklären (V02). |
| Schriftlich rechnen | Schriftlich subtrahieren (`schriftlich-subtrahieren`) | Kurznotation verständlich ersetzen (V02). |
| Schriftlich rechnen | Schriftlich multiplizieren (`schriftlich-mal`) | Zehnerversatz behalten, Summenwiederholung streichen (V02). |
| Schriftlich rechnen | Schriftlich dividieren (`schriftlich-geteilt`) | Nullstelle statt gesamte Rechnung nacherzählen (V02). |
| Brüche | Brüche lesen (`bruchteil`) | Beibehalten. |
| Brüche | Brüche erweitern und kürzen (`erweitern`) | Beibehalten. |
| Brüche | Gleichnamige Brüche addieren (`brueche-gleichnamig`) | Beibehalten. |
| Brüche | Ungleichnamige Brüche addieren (`brueche-ungleich`) | Beibehalten; die Faktoren erklären die Umwandlung. |
| Brüche | Brüche subtrahieren (`brueche-addieren`) | Beibehalten. |
| Brüche | Brüche multiplizieren (`brueche-mult`) | Beibehalten. |
| Brüche | Bruch, Dezimalzahl, Prozent (`bruch-dezimal-prozent`) | Beibehalten; Prozentzahl und Prozentsatz unterscheiden. |
| Brüche | Brüche dividieren (`bruch-dividieren`) | Beibehalten; Anteilsbild und Kehrwert haben verschiedene Rollen. |
| Terme & Gleichungen | Klammern ausmultiplizieren (`ausmultiplizieren`) | Überschrift und Begleittext alltagsnäher (V05). |
| Terme & Gleichungen | Ausklammern (`ausklammern`) | Beispiel statt zwei Begriffsdefinitionen (V05). |
| Terme & Gleichungen | Eine Gleichung lösen (`gleichung-einfach`) | Vollständigen Rechenweg statt drei Aufbauansichten prüfen (V01). |
| Terme & Gleichungen | x auf beiden Seiten (`gleichung-beidseitig`) | Vollständigen Rechenweg statt vier Aufbauansichten prüfen (V01). |
| Terme & Gleichungen | Gleichungen mit Klammern (`gleichung-klammer`) | Vollständigen Rechenweg statt vier Aufbauansichten prüfen (V01). |
| Terme & Gleichungen | Einfache quadratische Gleichungen (`quadratische-gleichung`) | Beibehalten; beide Lösungen bleiben wichtig. |
| Terme & Gleichungen | Binomische Formeln (`binomische-formeln`) | Drei Formeln behalten; „Mischprodukte“ ersetzen (V05). |
| Terme & Gleichungen | Zwei Gleichungen lösen (`gleichungssystem`) | Vier Schritte auf zwei Inhaltsblöcke prüfen (V01). |
| Terme & Gleichungen | Lineare Ungleichungen (`linear-ungleichung`) | Beibehalten; offener Rand und Zeichenwechsel bleiben. |
| Alltagsrechnen | Prozentwert, Grundwert und Prozentsatz (`prozent`) | Begleittexte und Frageüberschriften straffen (V04/V06). |
| Alltagsrechnen | Dreisatz: proportional (`dreisatz-direkt`) | Beibehalten. |
| Alltagsrechnen | Dreisatz: umgekehrt proportional (`dreisatz-indirekt`) | Beibehalten; Voraussetzungen nicht streichen. |
| Alltagsrechnen | Nicht proportional erkennen (`nichtproportional`) | Beibehalten. |
| Alltagsrechnen | Maßeinheiten umrechnen (`einheiten`) | Beibehalten; drei verschiedene Umrechnungen. |
| Alltagsrechnen | Maßstab und Zuordnung (`massstab`) | Zweite Tabelle als Wiederholung streichen prüfen (V03). |
| Alltagsrechnen | Längen- und Flächeneinheiten (`flaecheneinheiten`) | Beibehalten; Faktor 10 und Faktor 100 unterscheiden. |
| Funktionen | Koordinaten ablesen (`koordinaten`) | Beibehalten. |
| Funktionen | Lineare Funktionen (`lineare-funktion`) | Beibehalten; Steigung und Achsenabschnitt brauchen Zuordnung. |
| Funktionen | Quadratische Funktionen (`quadratische-funktion`) | Beibehalten; Tabelle und Parabel ergänzen einander. |
| Funktionen | Exponentielles Wachstum (`exponentialfunktion`) | Text zur Schrittzahl kürzen (V05). |
| Geometrie | Winkel an Parallelen (`winkelbeziehungen`) | Beibehalten; vier unterschiedliche Beziehungen. |
| Geometrie | Winkelsumme im Dreieck (`dreieck-winkel`) | Überschrift vereinfachen (V06). |
| Geometrie | Tafelprojektion (`tafelprojektion`) | Beide bereits dargestellten Ansichten bündeln prüfen (V03). |
| Geometrie | Umfang und Fläche (`rechteck`) | U/A benennen; Rechnung mit Einheiten einmal behalten (V04). |
| Geometrie | Satz des Pythagoras (`pythagoras`) | Fünf Schritte auf Regel und Beispiel verdichten prüfen (V01). |
| Geometrie | Volumen eines Quaders (`quader`) | Beibehalten; Rauminhalt ist verständlich erklärt. |
| Geometrie | Achsensymmetrie erkennen (`symmetrie`) | Gleiche Zeichnung nicht zweimal zeigen (V03). |
| Geometrie | Winkel erkennen und messen (`winkel-messen`) | Beibehalten. |
| Geometrie | Flächeninhalt berechnen (`flaeche-dreieck`) | Beibehalten; senkrechte Höhe ist wesentlich. |
| Geometrie | Ähnliche Figuren (`aehnlichkeit`) | Zuordnung und Faktor in vorhandener Übersicht bündeln (V03). |
| Geometrie | Umfang und Fläche des Kreises (`kreis`) | Rechnung im Begleittext nicht wiederholen (V04). |
| Daten & Kombinationen | Den Durchschnitt berechnen (`mittelwert`) | Begleittext nur zur Regel, Ergebnis nicht erneut nennen (V04). |
| Daten & Kombinationen | Möglichkeiten zählen (`kombinatorik`) | Einfacher am vorhandenen Beispiel formulieren (V05). |
| Daten & Kombinationen | Median bestimmen (`median`) | Gleiche erste Ansichten bündeln; Ausreißerzusatz streichen (V03/V07). |
| Daten & Kombinationen | Einfache Wahrscheinlichkeit (`wahrscheinlichkeit`) | Zahlenwiederholung kürzen, Gleichwahrscheinlichkeit behalten (V04). |
| Daten & Kombinationen | Mehrstufige Zufallsexperimente (`mehrstufige-wahrscheinlichkeit`) | Wiederholte Chancenbeschreibung straffen (V04). |
| Daten & Kombinationen | Relative Häufigkeit (`relative-haeufigkeit`) | Zählung und vorhandenen Quotienten zusammenführen prüfen (V03). |
| Daten & Kombinationen | Vierfeldertafel lesen (`vierfeldertafel`) | Bedeutung statt Zahlen wiederholen; Überschrift ersetzen (V04/V06). |

## Empfohlene Reihenfolge – falls später eine Umsetzung beauftragt wird

1. Zuerst Wiederholungen und allgemeine Füllsätze streichen.
2. Danach schwer lesbare Kurznotation und Fachwortsätze ersetzen.
3. Erst zuletzt gleichartige Zwischenansichten zusammenführen und deren Lesbarkeit prüfen.

Keine neue Inhaltssuche, keine zusätzlichen Beispiele und kein erneuter Ausbau der Zeichnungen. Was bereits knapp und verständlich ist, bleibt unverändert.

## Umsetzungsvermerk · 16.11.2026

Die Vereinfachungen V01–V07 wurden anschließend ausdrücklich beauftragt und umgesetzt. Die 59 Tafeln bleiben erhalten; ihre Ansichten sinken von 109 auf 91. Wiederholte Bilder und Aufbauansichten entfallen, Begleittexte sind kürzer, die genannten Überschriften sachlicher. Die vier schriftlichen Rechnungsbilder bleiben unverändert.

Die drei linearen Gleichungen zeigen jeweils den vollständigen Rechenweg mit Probe. Pythagoras hat zwei Ansichten: Regel mit Zeichnung sowie Rechnung mit positiver Wurzel, Einheiten und Probe. Beim Gleichungssystem bleiben bewusst **drei statt zwei Ansichten**: Ausgangsgleichungen mit Einsetzen, vollständige Berechnung von x, danach y mit beiden Proben. So bleiben Klammern und Umformungen ohne überladene Ansicht sichtbar.

Median behält getrennte Fälle für ungerade und gerade Anzahl. Die verschiedenen Prozentfälle, binomischen Formeln, Ungleichungsfälle und notwendigen Voraussetzungen bleiben erhalten. Keine neuen Themen, Zeichnungen oder Bedienelemente; keine Änderung an Navigation, Farben oder Datenspeicherung.

Validierung: Produktionsbuild, Unit-Tests und Browserprüfungen sämtlicher Mathe-Ansichten in Hoch- und Querformat; zusätzlich Pink-Lesbarkeit sowie Offline-Betrieb mit Erhalt gespeicherter Runden und Lernstände. Ergebnis: 295 Unit-Tests bestanden; 20 Browserprüfungen bestanden (19 im Gesamtlauf, Offline-Prüfung nach Anpassung der erwarteten Überschrift gezielt erneut bestanden). Alle 91 Ansichten passen bei 320 × 568, 844 × 390 und 1440 × 900 ohne Scrollen. Produktionsbuild erfolgreich.
