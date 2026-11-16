# Prüfprotokoll: Verständlichkeit des Mathe-Tafelwerks

**Aktueller Bearbeitungsstand:** M01–M14 umgesetzt (16.11.2026). Die ursprünglichen Befunde bleiben unten als Prüfverlauf erhalten.

**Datum der Erstprüfung:** 15.11.2026
**Geprüfter Stand:** Commit `3aae8f7`  
**Auftrag:** Nur prüfen und protokollieren; keine Änderungen an Tafeln, Oberfläche oder Funktionen.

## Umfang und Vorgehen

- Alle **59 Tafeln mit 105 Schritten** redaktionell gelesen: Überschriften, Formeln, Beispiele und Erklärungstexte.
- Die direkt zugehörigen Darstellungsfunktionen in `visuals.ts`, die festen schriftlichen Musterrechnungen und die Einbindung in `Tafelwerk.tsx` mitgeprüft.
- Zusätzlich **12 ausgewählte Tafeln mit 23 Schritten** im lokalen Chromium bei **320 × 568 Pixeln** geöffnet. Drei auffällige Ansichten visuell betrachtet: schriftliche Subtraktion, Winkelmessen und Kreisfläche.
- Bewertet wurden: selbsterklärendes Nachschlagen, verständliche Begriffe, nachvollziehbare Rechenwege, Zusammenhang von Text und Bild sowie Erreichbarkeit der Erklärung.
- Die Browserstichprobe ist eine Prüfung im emulierten kleinen Handyformat, keine Realgeräteprüfung. Aussagen zur anfänglichen Sichtbarkeit unten beziehen sich auf dieses Format.

**Durchgeführte Änderungen:** ausschließlich dieses Prüfprotokoll. Keine App-Dateien oder Tests verändert; keine Veröffentlichung ausgelöst.

## Ergebnis

Die Grundstruktur ist brauchbar. Zahlreiche Beispiele sind kurz und nachvollziehbar. Besonders gelungen sind die Abgrenzung von Prozentzahl und Prozentsatz, der Dreisatz mit Einheiten, die Rechnungsschritte bei linearen Gleichungen und die Bedingungen bei der Wahrscheinlichkeitsrechnung. Bei den durchgesehenen Musterrechnungen ist kein eindeutiger falscher Ergebniswert aufgefallen.

Der größte Verbesserungsbedarf liegt in **sichtbarer Erklärung und Bildbezug**, weniger in zusätzlichen Themen. Einige Tafeln setzen Wissen voraus, das ihre eigenen Beispiele noch nicht erklären. Die sinnvollste Überarbeitung wäre deshalb gezielter und teilweise sogar kürzer – kein allgemeiner Ausbau der Textmenge.

### Prioritäten

- **Hoch:** Eine wesentliche Erklärung ist zunächst nicht sichtbar oder ein zentrales Verfahren kann leicht missverstanden werden.
- **Mittel:** Inhalt grundsätzlich nachvollziehbar, aber eine konkrete Erklärung, Beschriftung oder passende Darstellung fehlt.
- **Niedrig:** Optionale Abrundung; kein dringender Änderungsbedarf.

## Konkrete Fundstellen und Vorschläge

### M01 · Hoch · Erklärungen liegen im kleinen Handyformat unterhalb der Ansicht

**Fundstelle:** Themenübergreifend; `src/components/Tafelwerk.tsx`, insbesondere die getrennte Ausgabe von Tafel und Erklärung; `src/design/tafelwerk.css`, Mindesthöhen des Tafelfelds und scrollbarer Detailbereich.

**Beobachtung:** Das sichtbare Detailfenster ist im geprüften Format 280 Pixel hoch. In allen 23 geöffneten Schritten endet der Erklärungstext unterhalb dieses Fensters. Beispielsweise beansprucht die Subtraktionsansicht insgesamt 422 Pixel, die zweite Kreisansicht 474 Pixel und das Winkelmessen im zweiten Schritt 522 Pixel. Die Inhalte sind durch Scrollen erreichbar; sie fehlen nicht im Bestand.

**Warum das stört:** Die feste Fachnavigation und die Tafel belegen zunächst die verfügbare Höhe. Wer nur den ersten Ausschnitt sieht, erhält oft nur Formel und Bild; gerade die erklärenden Sätze bleiben zunächst verborgen. Beim Subtraktionsbeispiel ist selbst die fertige Rechnung im ersten Ausschnitt nicht vollständig sichtbar. Das widerspricht dem Ziel einer unmittelbar verständlichen Nachschlagetafel.

**Vorschlag:** Fachnavigation beibehalten, aber unnötige Leerflächen und starre Mindesthöhen im Tafelfeld prüfen. Regel und Beispiel möglichst zusammen sichtbar machen. Kurze Kernerklärung direkt bei der Formel; ergänzende Erläuterung darunter. Nicht pauschal die Schrift verkleinern oder Inhalte abschneiden.

### M02 · Hoch · Schriftliche Subtraktion: Ergänzen und Übertrag nicht ausreichend erklärt

**Fundstelle:** `schriftlich-subtrahieren`, Schritt 1; `math-lessons.json` und `written-reference.ts`.

**Ist:** `426 − 258 = 168`; kleine Einsen in Hunderter- und Zehnerspalte. Der Text beginnt mit „Ergänzen von rechts: 8 + 8 = 16; 5 + 1 + 6 = 12 …“.

**Unklar:** Die beiden Achten der ersten Rechnung haben unterschiedliche Rollen: eine gehört zur unteren Zahl, eine zum Ergebnis. Der Sprung von der oberen 6 zu 16 und von 2 zu 12 wird nicht erklärt. Wer nur gewöhnliches Abziehen kennt, versteht die kleinen Einsen deshalb nicht sicher.

**Vorschlag:** Die gewünschte Darstellung und das Ergänzungsverfahren beibehalten. Knapp erklären: „Von 8 bis 16 fehlen 8; unten in der nächsten Spalte 1 übertragen. Dort: 5 + 1 = 6; von 6 bis 12 fehlen 6.“ Eine eindeutige Zuordnung von Ausgangsziffer, Ergebnisziffer und Übertrag ist wichtiger als weitere Beispielzahlen. Nicht mit der zuvor verwendeten Entbündelungsdarstellung vermischen.

### M03 · Hoch · Schriftliche Multiplikation: Zehnerwert des ersten Teilprodukts bleibt implizit

**Fundstelle:** `schriftlich-mal`, Schritt 1; `written-reference.ts`.

**Ist:** In der Rechnung `2637 · 24` steht `5274` eine Spalte nach links versetzt über `10548`. Der Text nennt `2637 · 2 = 5274`.

**Unklar:** Die 2 in 24 bedeutet zwei Zehner, also 20. Das erste Teilprodukt zählt daher als 52 740, nicht als 5 274. Die Verschiebung ist richtig angeordnet, ihre Bedeutung wird aber nur indirekt mit „Zehner-Teilprodukt“ benannt.

**Vorschlag:** Einen kurzen Satz ergänzen bzw. den vorhandenen Satz ersetzen: „Die 2 steht für 20: 2637 · 20 = 52 740. Deshalb steht 5274 eine Spalte nach links versetzt.“ Das leere Einerkästchen ausdrücklich als Nullstelle verständlich machen, ohne die gewünschte Heftdarstellung zu verändern.

### M04 · Mittel · Schriftliche Division: Quotientenziffern nicht ausdrücklich den Teilzahlen zugeordnet

**Fundstelle:** `schriftlich-geteilt`, Schritt 1.

**Ist:** Vollständige Rechnung `59535 : 7 = 8505` mit Herunterholpfeilen. Der Text erläutert hauptsächlich `59 − 56`, `35 − 35` und die Null im Ergebnis.

**Unklar:** Die entscheidenden Teilungen, aus denen 8, 5, 0 und 5 im Ergebnis entstehen, werden nicht ausgesprochen. „Teilen, multiplizieren, abziehen“ ist die richtige Reihenfolge, aber noch keine Zuordnung zu den sichtbaren Zahlen.

**Vorschlag:** Knapp mit den dargestellten Teilzahlen verbinden: `59 : 7 = 8 Rest 3`; anschließend `35 : 7 = 5`, `3 : 7 = 0 Rest 3`, `35 : 7 = 5`. Insbesondere die Nullstelle beibehalten und erklären. Keine erneute Schrittschaltung nötig.

### M05 · Mittel · Winkelmessen: beschriebenes Werkzeug und Zeichnung passen nicht ganz zusammen

**Fundstelle:** `winkel-messen`, Schritt 2; `visuals.ts`, Funktion `angleVisual`.

**Ist:** Überschrift „Mit dem Geodreieck messen“, dazu eine halbkreisförmige Winkelskala. Ein angelegtes Geodreieck ist nicht dargestellt. Teilstriche sind in 10°-Schritten vorhanden, Zahlen in 30°-Schritten; 45° ist am Winkel beschriftet.

**Unklar:** Die Anleitung fordert, Nullpunkt und Grundlinie des Geodreiecks anzulegen. Diese Bauteile lassen sich in der Zeichnung nicht unmittelbar wiederfinden. Der konkrete Ablesepunkt 45° wird als Ergebnis genannt, ist auf der Skala aber nicht eigens markiert.

**Vorschlag:** Entweder das angelegte Geodreieck mit Nullpunkt, Grundlinie und passender Skala zeigen oder Überschrift und Erklärung ausdrücklich auf einen Winkelmesser abstimmen. Die 45°-Position auf der Skala kenntlich machen.

### M06 · Mittel · Kreis: Begriffe Radius und Durchmesser haben keinen Bildbezug

**Fundstelle:** `kreis`, beide Schritte.

**Ist:** Formeln `U = π · d`, `A = π · r²` und `d = 2r`, jedoch keine Kreiszeichnung und kein eingesetztes Zahlenbeispiel.

**Unklar:** Wer Radius und Durchmesser verwechselt, bekommt die Definition nur im Text unterhalb der Tafel. Die Formelsammlung zeigt nicht, welche Strecke jeweils gemeint ist.

**Vorschlag:** Eine einfache Kreiszeichnung mit Mittelpunkt, Radius und Durchmesser. Ein einziges kurzes Zahlenbeispiel wäre hilfreich, etwa `r = 3 cm`, daraus `d = 6 cm`, anschließend Umfang oder Fläche. Die Formel nicht zusätzlich mehrfach wiederholen.

### M07 · Mittel · Binomische Formeln: die erklärte Flächenzerlegung wird nicht gezeigt

**Fundstelle:** `binomische-formeln`, Schritt 1.

**Ist:** Die Erklärung beschreibt ein Quadrat aus zwei Quadraten und zwei Rechtecken. Sichtbar sind nur `(a + b)² = a² + 2ab + b²` als Formelzeilen.

**Unklar:** Die geometrische Begründung für `2ab` bleibt unsichtbar. Gerade dieser Mittelterm ist eine typische Verwechslungsstelle.

**Vorschlag:** Entweder die vier Teilflächen mit Beschriftungen `a²`, `ab`, `ab`, `b²` tatsächlich zeigen oder kurz algebraisch über `(a + b)(a + b)` begründen. Anschließend alle drei binomischen Formeln klar voneinander trennen; derzeit stehen die zweite und dritte gemeinsam in Schritt 2.

### M08 · Mittel · Ungleichnamige Brüche: Erweiterungsfaktoren fehlen im Rechenweg

**Fundstelle:** `brueche-ungleich`, Schritt 1.

**Ist:** `½ + ⅓ = ³⁄₆ + ²⁄₆ = ⅚` ist richtig. Der Text fordert, die Brüche in Sechstel umzuwandeln.

**Unklar:** Die Faktoren 3 und 2 werden nicht gezeigt. Die zentrale neue Handlung dieser Tafel bleibt damit ein Sprung.

**Vorschlag:** Direkt am Beispiel knapp sichtbar machen: `½ = (1·3)/(2·3)` und `⅓ = (1·2)/(3·2)`. Dafür eine doppelte Ergebniszeile einsparen. „Gemeinsamer Nenner“ kurz als gleich große Teilstücke erklären.

### M09 · Mittel · Lineare Ungleichungen: Zahlengerade angekündigt, Tabelle dargestellt

**Fundstelle:** `linear-ungleichung`, Schritt 2.

**Ist:** Der Erklärungssatz lautet „Auf der Zahlengeraden ist 4 nicht enthalten.“ Gezeigt wird eine Tabelle ausgewählter Werte, keine Zahlengerade.

**Unklar:** Die Tabelle belegt einzelne Beispiele, zeigt aber weder die offene Grenze bei 4 noch den vollständigen Lösungsbereich links davon.

**Vorschlag:** Eine Zahlengerade mit offenem Kreis bei 4 und Markierung nach links oder eine konsequent auf die Tabelle bezogene Erklärung. Für die wichtige Regel zum Zeichenwechsel wäre ein zusätzliches sehr kurzes Beispiel mit negativem Divisor sinnvoll; das bisherige Beispiel verwendet nur eine positive Zahl.

### M10 · Mittel · Ähnlichkeit: entsprechende Seiten sind ohne Figuren schwer zu erkennen

**Fundstelle:** `aehnlichkeit`, beide Schritte.

**Ist:** Die Seitenpaare 2/6, 3/9 und 4/12 stehen in einer Tabelle. Der Text fordert, zusammengehörige Seiten zuzuordnen; zwei Figuren fehlen.

**Unklar:** Die Tabelle liefert die Zuordnung bereits fertig und erklärt nicht, woran entsprechende Seiten erkannt werden. Unterscheidung von Seitenlänge, Winkel und Vergrößerungsfaktor bleibt abstrakt.

**Vorschlag:** Zwei entsprechend beschriftete Figuren und die Zuordnung derselben Seiten zeigen. Die vorhandenen Seitenlängen `2, 3, 4` und `6, 9, 12` lassen sich dafür nutzen. Flächenvergrößerung nicht ungefragt als weiteres Thema ergänzen.

### M11 · Mittel · Tafelprojektion: viele neue Begriffe gleichzeitig

**Fundstelle:** `tafelprojektion`, beide Schritte; `visuals.ts`, `projectionVisual`.

**Ist:** Grundriss, Aufriss, zwei Ebenen, drei Koordinaten und die Zeichen `Pᵍ`/`Pᵃ` erscheinen in einer kleinen perspektivischen Zeichnung. Darin ist `P (3|2|2)` beschriftet; die Erklärung bleibt allgemein bei `(x|y|z)`.

**Unklar:** Die hochgestellten Buchstaben und die drei Koordinatenrollen werden nicht unmittelbar erläutert. Die zwei Ansichten erhalten keine ausgeschriebenen konkreten Koordinaten neben den Bildpunkten.

**Vorschlag:** Kurze Alltagsübersetzung: „Grundriss = Blick von oben; Aufriss = Blick von vorn.“ `x` als Breite, `y` als Tiefe und `z` als Höhe in der verwendeten Anordnung erläutern. Zum dargestellten Punkt auch `Pᵍ(3|2)` und `Pᵃ(3|2)` sichtbar zuordnen. Gerade weil beide Zahlenpaare hier gleich sind, wäre ein Beispiel mit unterschiedlichen y- und z-Werten anschaulicher.

### M12 · Mittel · Negative Zahlen: unterschiedliche Fälle sind nicht vollständig voneinander abgegrenzt

**Fundstelle:** `negative-rechnen` und `vorzeichen`.

**Ist:** `negative-rechnen` zeigt `−2 + 5` und `2 − 5`, also jeweils die Addition bzw. Subtraktion einer positiven Zahl. Die Vorzeichenregeln erklären ausschließlich Mal und Geteilt und benennen diese Begrenzung korrekt.

**Unklar:** Unter dem allgemeinen Titel „Mit negativen Zahlen rechnen“ fehlt der häufig schwierige Fall `2 − (−3)`. Ohne Abgrenzung könnten Lernende die Vorzeichenregeln aus Mal/Geteilt auf Plus/Minus übertragen.

**Vorschlag:** Den vorhandenen Titel genauer auf die zwei gezeigten Fälle begrenzen oder ein kurzes Beispiel zur Subtraktion einer negativen Zahl ergänzen. Die getrennten Regeln ausdrücklich auseinanderhalten; nicht pauschal „Minus und Minus ergibt Plus“ formulieren.

### M13 · Niedrig · Median: gerade Anzahl wird erklärt, aber nicht vorgerechnet

**Fundstelle:** `median`, Schritt 2.

**Ist:** Das Beispiel enthält fünf Werte. Der Text nennt zusätzlich den Durchschnitt der beiden mittleren Werte bei gerader Anzahl.

**Vorschlag:** Optional ein zweites Mini-Beispiel, etwa `1, 5, 12, 70 → (5 + 12) : 2 = 8,5`. Keine weitere lange Definition erforderlich.

### M14 · Niedrig · Einheiten und Grundbegriffe an einzelnen Stellen eindeutiger zuordnen

**Fundstellen:** `rechteck`, `quader`, `quadrat`, `ausklammern`, `exponentialfunktion`.

**Beobachtungen:**

- Beim Rechteck werden `U` und `A` im Erklärungstext nicht ausdrücklich als Umfang und Flächeninhalt ausgeschrieben. In der Rechnung fehlen innerhalb der eingesetzten Ausdrücke teilweise die Einheiten; das Ergebnis trägt sie richtig.
- Beim Quader ist „kubisch“ knapp. Die Brücke „Volumen = Rauminhalt; cm³ zählt Einheitswürfel“ wäre leichter zugänglich.
- „Umkehroperationen am Quadrat“ ist als Überschrift schwieriger als „Quadrieren und Wurzelziehen“.
- Beim Ausklammern sind „Faktor“ und „Summand“ ohne kurze Worterklärung vorausgesetzt.
- Beim exponentiellen Wachstum wird der Faktor „x-mal“ angewendet; die Bedeutung von x als Anzahl der gleich langen Schritte sollte im gezeigten Einstiegsbeispiel ausdrücklich genannt werden. Das Beispiel startet bereits richtig bei Schritt 0 mit Wert 2.

**Vorschlag:** Kurze Begriffserklärungen direkt an den vorhandenen Beispielen; keine zusätzliche Glossar-Navigation und keine pauschale Erweiterung aller Texte.

## Was beibehalten werden sollte

- Die vier vollständigen schriftlichen Musterrechnungen und deren Ausrichtung nach den gewünschten Heftvorlagen. M02–M04 betreffen die Erklärung, nicht die Rückkehr zur kleinteiligen Entwicklung.
- Die Unterscheidung von Mal/Geteilt-Vorzeichenregeln und dem Zahlenstrahl für Plus/Minus.
- Die Einschränkung des Satzes von Pythagoras auf rechtwinklige Dreiecke, die Erklärung von Katheten/Hypotenuse sowie die Probe mit Einheiten.
- Der proportionalitätsabhängige Dreisatz und die ausdrücklich genannten Voraussetzungen bei der Arbeitszeit mehrerer Personen.
- Die Unterscheidung zwischen Prozentzahl 30 und Prozentsatz 30 %.
- Die Voraussetzung gleich wahrscheinlicher Einzelfälle und unabhängiger Münzwürfe.
- Die vorhandenen Hinweise auf Nenner ungleich null und das Verbot der Division durch null.
- Die feste Fachnavigation. Bei M01 wäre der Inhaltsbereich anzupassen, nicht die inzwischen vereinheitlichte Navigation wieder umzubauen.

## Empfohlene Reihenfolge einer möglichen späteren Umsetzung

1. Sichtbarkeit von Regel, Rechnung und Erklärung auf kleinen Displays verbessern (M01).
2. Überträge und Stellenwertverschiebung an den bestehenden schriftlichen Beispielen verdeutlichen (M02–M04).
3. Text und Bild bei Winkelmessen, Kreis, binomischen Formeln, Ungleichungen und Ähnlichkeit in Übereinstimmung bringen (M05–M10).
4. Projektion und negative Zahlen klarer abgrenzen (M11–M12).
5. Optionale Mini-Beispiele und Worterklärungen nach Bedarf (M13–M14).

Das sind Vorschläge zur späteren Entscheidung. **Keiner dieser Vorschläge wurde umgesetzt.**

## Vollständige Prüfliste der 59 Tafeln

„Kein vorrangiger Einzelbefund“ bedeutet: Bei dieser Verständlichkeitsdurchsicht ist kein zusätzlicher konkreter Punkt für die obige Liste entstanden. Es ist keine pauschale fachliche Freigabe. M01 ist ein übergreifender Darstellungsbefund; seine Browsermessung wurde nur an den genannten zwölf Tafeln durchgeführt.

| Rubrik | Tafel / stabile ID | Einzelbefund |
|---|---|---|
| Zahlen & Regeln | Vorzeichenregeln (`vorzeichen`) | M12 (Abgrenzung) |
| Zahlen & Regeln | Negative Zahlen am Zahlenstrahl (`negative-addieren`) | Kein vorrangiger Einzelbefund |
| Zahlen & Regeln | Punkt vor Strich (`reihenfolge`) | Kein vorrangiger Einzelbefund |
| Zahlen & Regeln | Quadratzahl und Quadratwurzel (`quadrat`) | M14 |
| Zahlen & Regeln | Dezimalzahlen verstehen (`dezimalzahlen`) | Kein vorrangiger Einzelbefund |
| Zahlen & Regeln | Stellenwerte natürlicher Zahlen (`stellenwert`) | Kein vorrangiger Einzelbefund |
| Zahlen & Regeln | Potenzen verstehen (`potenzen`) | Kein vorrangiger Einzelbefund |
| Zahlen & Regeln | Mit negativen Zahlen rechnen (`negative-rechnen`) | M12 |
| Zahlen & Regeln | Logarithmen als Umkehrung (`logarithmus`) | Kein vorrangiger Einzelbefund |
| Schriftlich rechnen | Schriftlich addieren (`schriftlich-addieren`) | Kein vorrangiger Einzelbefund |
| Schriftlich rechnen | Schriftlich subtrahieren (`schriftlich-subtrahieren`) | M02 |
| Schriftlich rechnen | Schriftlich multiplizieren (`schriftlich-mal`) | M03 |
| Schriftlich rechnen | Schriftlich dividieren (`schriftlich-geteilt`) | M04 |
| Brüche | Brüche lesen (`bruchteil`) | Kein vorrangiger Einzelbefund |
| Brüche | Brüche erweitern und kürzen (`erweitern`) | Kein vorrangiger Einzelbefund |
| Brüche | Gleichnamige Brüche addieren (`brueche-gleichnamig`) | Kein vorrangiger Einzelbefund |
| Brüche | Ungleichnamige Brüche addieren (`brueche-ungleich`) | M08 |
| Brüche | Brüche subtrahieren (`brueche-addieren`) | Kein vorrangiger Einzelbefund |
| Brüche | Brüche multiplizieren (`brueche-mult`) | Kein vorrangiger Einzelbefund |
| Brüche | Bruch, Dezimalzahl, Prozent (`bruch-dezimal-prozent`) | Kein vorrangiger Einzelbefund |
| Brüche | Brüche dividieren (`bruch-dividieren`) | Kein vorrangiger Einzelbefund |
| Terme & Gleichungen | Klammern ausmultiplizieren (`ausmultiplizieren`) | Kein vorrangiger Einzelbefund |
| Terme & Gleichungen | Ausklammern (`ausklammern`) | M14 |
| Terme & Gleichungen | Eine Gleichung lösen (`gleichung-einfach`) | Kein vorrangiger Einzelbefund |
| Terme & Gleichungen | x auf beiden Seiten (`gleichung-beidseitig`) | Kein vorrangiger Einzelbefund |
| Terme & Gleichungen | Gleichungen mit Klammern (`gleichung-klammer`) | Kein vorrangiger Einzelbefund |
| Terme & Gleichungen | Einfache quadratische Gleichungen (`quadratische-gleichung`) | Kein vorrangiger Einzelbefund |
| Terme & Gleichungen | Binomische Formeln (`binomische-formeln`) | M07 |
| Terme & Gleichungen | Zwei Gleichungen lösen (`gleichungssystem`) | Kein vorrangiger Einzelbefund |
| Terme & Gleichungen | Lineare Ungleichungen (`linear-ungleichung`) | M09 |
| Alltagsrechnen | Prozentwert, Grundwert und Prozentsatz (`prozent`) | Kein vorrangiger Einzelbefund |
| Alltagsrechnen | Dreisatz: proportional (`dreisatz-direkt`) | Kein vorrangiger Einzelbefund |
| Alltagsrechnen | Dreisatz: umgekehrt proportional (`dreisatz-indirekt`) | Kein vorrangiger Einzelbefund |
| Alltagsrechnen | Nicht proportional erkennen (`nichtproportional`) | Kein vorrangiger Einzelbefund |
| Alltagsrechnen | Maßeinheiten umrechnen (`einheiten`) | Kein vorrangiger Einzelbefund |
| Alltagsrechnen | Maßstab und Zuordnung (`massstab`) | Kein vorrangiger Einzelbefund |
| Alltagsrechnen | Längen- und Flächeneinheiten (`flaecheneinheiten`) | Kein vorrangiger Einzelbefund |
| Funktionen | Koordinaten ablesen (`koordinaten`) | Kein vorrangiger Einzelbefund |
| Funktionen | Lineare Funktionen (`lineare-funktion`) | Kein vorrangiger Einzelbefund |
| Funktionen | Quadratische Funktionen (`quadratische-funktion`) | Kein vorrangiger Einzelbefund |
| Funktionen | Exponentielles Wachstum (`exponentialfunktion`) | M14 |
| Geometrie | Winkel an Parallelen (`winkelbeziehungen`) | Kein vorrangiger Einzelbefund |
| Geometrie | Winkelsumme im Dreieck (`dreieck-winkel`) | Kein vorrangiger Einzelbefund |
| Geometrie | Tafelprojektion (`tafelprojektion`) | M11 |
| Geometrie | Umfang und Fläche (`rechteck`) | M14 |
| Geometrie | Satz des Pythagoras (`pythagoras`) | Kein vorrangiger Einzelbefund |
| Geometrie | Volumen eines Quaders (`quader`) | M14 |
| Geometrie | Achsensymmetrie erkennen (`symmetrie`) | Kein vorrangiger Einzelbefund |
| Geometrie | Winkel erkennen und messen (`winkel-messen`) | M05 |
| Geometrie | Flächeninhalt berechnen (`flaeche-dreieck`) | Kein vorrangiger Einzelbefund |
| Geometrie | Ähnliche Figuren (`aehnlichkeit`) | M10 |
| Geometrie | Umfang und Fläche des Kreises (`kreis`) | M06 |
| Daten & Kombinationen | Den Durchschnitt berechnen (`mittelwert`) | Kein vorrangiger Einzelbefund |
| Daten & Kombinationen | Möglichkeiten zählen (`kombinatorik`) | Kein vorrangiger Einzelbefund |
| Daten & Kombinationen | Median bestimmen (`median`) | M13 |
| Daten & Kombinationen | Einfache Wahrscheinlichkeit (`wahrscheinlichkeit`) | Kein vorrangiger Einzelbefund |
| Daten & Kombinationen | Mehrstufige Zufallsexperimente (`mehrstufige-wahrscheinlichkeit`) | Kein vorrangiger Einzelbefund |
| Daten & Kombinationen | Relative Häufigkeit (`relative-haeufigkeit`) | Kein vorrangiger Einzelbefund |
| Daten & Kombinationen | Vierfeldertafel lesen (`vierfeldertafel`) | Kein vorrangiger Einzelbefund |

## Nachvollziehbarkeit der Browserstichprobe

Geöffnet wurden: `schriftlich-subtrahieren`, `schriftlich-mal`, `schriftlich-geteilt`, `winkel-messen`, `kreis`, `binomische-formeln`, `linear-ungleichung`, `tafelprojektion`, `pythagoras`, `negative-addieren`, `brueche-ungleich` und `exponentialfunktion`; jeweils alle vorhandenen Schritte.

Die Stichprobe wurde in einem separaten lokalen Browserprofil ausgeführt. Es wurden keine echten Nutzer-Lernstände bearbeitet. Für die reine Inhaltsprüfung wurden keine neuen Tests oder Abhängigkeiten in das Projekt aufgenommen.


## Umsetzungsvermerk vom 16.11.2026

Nach Freigabe wurden ausschließlich die Punkte M01, M05 und M06 bearbeitet:

- **M01:** Der verfügbare Platz wird zwischen Darstellung, Erklärung und Schrittnavigation aufgeteilt. Starre Mindesthöhen entfallen im Detailbereich. Im flachen Querformat stehen Tafel und Erklärung nebeneinander; auf kleinen Höhen genügt die Schrittanzeige im Kopf statt einer zusätzlichen Punktleiste. Inhalte bleiben erreichbar; es werden keine Erklärungstexte abgeschnitten.
- **M05:** Die Messanleitung bezieht sich jetzt ausdrücklich auf den dargestellten Winkelmesser. Die Skala hat 5°-Teilungen und eine hervorgehobene 45°-Markierung.
- **M06:** Kreiszeichnungen zeigen Mittelpunkt, Radius und Durchmesser. Das Beispiel verwendet r = 3 cm und d = 6 cm mit U ≈ 18,85 cm und A ≈ 28,27 cm².

Die Inhalte von M02 und M03 sowie die übrigen noch offenen Protokollpunkte wurden nicht geändert. Ein Vergleich der Inhaltsdatei mit dem vorherigen Stand bestätigt ausschließlich Änderungen an `winkel-messen` und `kreis`; die Layoutanpassung aus M01 gilt themenübergreifend.

Validierung: alle 59 Tafeln und 105 Schritte auf 320 × 568, 844 × 390 und 1440 × 900 Pixeln auf Überlauf und sichtbare Erklärung geprüft; zusätzlich Bildbezug in Normal/Pink sowie Offline-Funktion und unveränderte gespeicherte Runden geprüft. Die Quelldatei dieses Protokolls bewahrt oben den ursprünglichen Prüfstand vom 15.11.2026.


## Abschluss der übrigen Punkte am 16.11.2026

Der Folgeauftrag umfasst ausdrücklich alle noch offenen Befunde, einschließlich der zuvor zurückgestellten Punkte M02 und M03. Die bereits erledigten Punkte M01, M05 und M06 bleiben bestehen.

| Punkt | Umgesetzt |
|---|---|
| M02 | Das Ergänzungsverfahren erklärt jetzt, wann oben 10 dazugenommen und unten links 1 übertragen wird; die drei Ergänzungen sind der fertigen Rechnung zugeordnet. |
| M03 | Die 2 in 24 ist ausdrücklich als 20 erklärt. 52 740, der Linksversatz und die leere Einerstelle als 0 sind benannt. |
| M04 | Die vier Quotientenziffern 8, 5, 0, 5 sind den Teilzahlen 59, 35, 3 und 35 zugeordnet; insbesondere die Nullstelle ist erklärt. |
| M07 | Die erste binomische Formel besitzt eine Flächenzerlegung mit a², ab, ab und b². Zweite und dritte Formel stehen auf getrennten Schritten mit ihren jeweiligen Mischprodukten. |
| M08 | Erweiterung mit 3 bzw. 2 steht als Zwischenrechnung direkt am Bruch; der gemeinsame Nenner wird als gleich große Teilstücke erklärt. |
| M09 | Eine Zahlengerade zeigt den offenen Rand bei 4 und den Bereich links davon. Ein weiterer Schritt erläutert −2x < −8 → x > 4 samt Zeichenwechsel beim Teilen durch −2. |
| M10 | Zwei maßstäbliche ähnliche Dreiecke zeigen die entsprechenden Seiten a/a′, b/b′ und c/c′ mit 2/6, 3/9 und 4/12. Der Vergrößerungsfaktor 3 ist zugeordnet. |
| M11 | Grundriss und Aufriss sind als zwei klare Ansichten dargestellt. P(3|2|4) führt zu den unterschiedlichen Paaren Pᵍ(3|2) und Pᵃ(3|4); Breite, Tiefe, Höhe und die hochgestellten Buchstaben sind erklärt. |
| M12 | 2 − (−3) = 2 + 3 = 5 ergänzt den Zahlenstrahl. Der Text grenzt die Vorzeichenregel ausdrücklich auf Mal und Geteilt ein. |
| M13 | Ein Beispiel mit vier sortierten Werten zeigt die beiden mittleren Werte 5 und 12 hervorgehoben und ihren Durchschnitt 8,5. |
| M14 | U/A und Rand-/Innenfläche, Volumen als Rauminhalt mit Einheitswürfeln, die Überschrift zum Wurzelziehen, Summanden/Faktoren sowie x als Anzahl gleich langer Zeitschritte sind verständlicher erläutert. |

Die vier schriftlichen Musterrechnungen bleiben vollständige feste Darstellungen; ihre Anordnung wurde nicht verändert. Es wurden keine neuen Themen oder Abhängigkeiten eingeführt. Die Zahl der Tafeln bleibt 59; durch getrennte Fälle gibt es jetzt 109 Schritte.

Prüfung: alle 109 Schritte bei 320 × 568, 844 × 390 und 1440 × 900 Pixeln auf Überlauf und sichtbare Erklärung; zusätzliche Sichtprüfung der neuen Zeichnungen in Normal und Pink; Offline-Funktion und gespeicherte Runden weiterhin abgesichert. Der kleine zusätzliche Innenabstand für Formelblöcke im flachen Querformat verhindert einen unnötigen Scrollüberlauf bei den erweiterten Bruchrechnungen.

**Status: Alle 14 protokollierten Punkte sind umgesetzt.**
