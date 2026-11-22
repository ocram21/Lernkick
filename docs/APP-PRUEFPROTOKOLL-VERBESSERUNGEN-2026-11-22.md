# LernKick: Verbesserungsvorschläge für Realschüler mit Unterstützungsbedarf

**Datum:** 22.11.2026  
**Geprüfter Stand:** Commit `2808c25`  
**Auftrag:** App gründlich auf Verständlichkeit, Didaktik, fachliche Richtigkeit, Gestaltung und Spaß prüfen; ausschließlich Vorschläge dokumentieren.  
**Status:** Keine App-, Inhalts-, Design- oder Testdateien verändert. Keine Umsetzung, kein Commit, kein Push und keine Veröffentlichung beauftragt oder vorgenommen. Dieses Dokument ist die einzige neu angelegte Projektdatei.

## 1. Einschätzung und wichtigste Entscheidungen

LernKick hat eine brauchbare Grundlage: eine wiedererkennbare Taschenrechnergestaltung, kurze Runden, einen Lernkasten mit Wiederholungsabständen, gespeicherte Spielstände und ein inzwischen deutlich gestrafftes Mathe-Tafelwerk. Ein vollständiger optischer Neustart wäre aus dieser Prüfung nicht begründet.

Der größte Hebel liegt darin, Schüler **nach einem Fehler tatsächlich weiterzubringen**. Dafür sind eindeutige Aufgaben, lesbare Rückmeldungen, erreichbare Hilfen und ehrliche Fortschrittsaussagen wichtiger als zusätzliche Spiele oder ein größerer Fragenbestand. Derzeit prüft die App an einigen Stellen eher Wiedererkennen als Verstehen; manche Erklärungen wiederholen nur die richtige Antwort.

### Die zehn wichtigsten Vorschläge

| Reihenfolge | Vorschlag | Warum zuerst? | Befund |
|---|---|---|---|
| 1 | Mehrdeutige Deutschaufgaben korrigieren. | Richtige Sprache darf nicht als Fehler gewertet werden. | F01 |
| 2 | Nach falschen Antworten nicht automatisch weiterwechseln. | Zwei Sekunden reichen für viele Erklärungen nicht; die Hilfe verschwindet gerade dann, wenn sie gebraucht wird. | L01 |
| 3 | Antwortwiederholungen durch kurze Begründungen ersetzen. | 604 von 700 Fragen in den aktiven Bio-/Geo-/Sozialkunde-Komplexen erklären die Antwort nicht zusätzlich. | F02 |
| 4 | Hilfe auch für Gleichungen, Geometrie und wichtige Sachfragen anbieten. | Schwierige Aufgabenarten haben bislang gerade keinen entsprechenden Hilfeweg. | L02 |
| 5 | Bestehende Tafeln direkt aus einer passenden Aufgabe erreichbar machen. | Das Tafelwerk kann dann im Moment des Feststeckens helfen. | T01 |
| 6 | „Skill“ wahrheitsgetreu benennen und den täglichen Verfall überdenken. | Die Anzeige misst Zeitaktivität, nicht Fachkompetenz. | M01 |
| 7 | Tafelwerk-Texte und -Beschriftungen gezielt nachschärfen. | Vorhandenes verständlicher machen, ohne wieder mehr Seiten und Text zu erzeugen. | T03–T07 |
| 8 | Bosskampf auf geübte Inhalte und einen hilfreichen Rückblick abstimmen. | Herausforderung soll fair sein und auch nach einer Niederlage etwas erklären. | M02–M04 |
| 9 | Lesbarkeit vor bloßes „passt ohne Scrollen“ setzen. | Kleine Schrift und ungünstige Wortabbrüche sind für die Zielgruppe echte Hürden. | O01–O03 |
| 10 | Mit einigen Schülern einen kurzen, begleiteten Praxistest durchführen. | Spaß, Schamgefühl, Motivation und tatsächliches Verstehen sind aus Code allein nicht beweisbar. | Abschnitt 10 |

**Prioritäten:** P1 = für einen verlässlichen Lernbetrieb zuerst bearbeiten; P2 = anschließend gezielt verbessern; P3 = optionale Erprobung. P1 bedeutet nicht automatisch einen technischen Absturz oder Datenverlust.

**Belegarten:** „Belegt“ bezeichnet einen nachvollziehbaren Code-, Inhalts- oder Sichtbefund. „Didaktische Bewertung“ ist die daraus abgeleitete Empfehlung. „Hypothese“ bezeichnet eine mögliche Wirkung, die erst mit Schülern geprüft werden muss.

## 2. Prüfumfang und Grenzen

Die Prüfung umfasst die aktuelle Navigation, Training und Rückmeldungen, Mathe-Hilfen und Auswahl, Deutschübungen, Bosskampf, Lernkasten, Tafelwerk, Statistik/Score/Skill, Einstellungen und die eingebundenen Spiele. Gestaltung und Lernmechanik wurden zunächst getrennt betrachtet und anschließend mit den Inhaltsbefunden abgeglichen.

| Bereich | Was tatsächlich geprüft wurde |
|---|---|
| Mathe-Tafelwerk | Alle **59 Tafeln mit 91 Ansichten** redaktionell gelesen; zentrale Zeichnungsfunktionen und vier feste schriftliche Rechnungen mit den Daten abgeglichen. Layoutprüfung sämtlicher Ansichten über bestehende Browsertests. |
| Deutsch-Tafelwerk | Alle **20 Tafeln** gelesen; Wortarten, Grammatik, Rechtschreibung, Schreiben und Lesen/Medien auf sprachliche Klarheit geprüft. |
| Bio-/Geo-/Sozialkunde-Tafelwerk | Tatsächlichen Zustand geprüft: Es gibt auswählbare Fachtasten, aber noch keine Tafelinhalte. Alte Schautafel-/Übungsspiel-Dateien sind kein Nachweis eines gefüllten aktuellen Tafelwerks. |
| Aktive Sachfachfragen | Einbindung der **14 Komplexe mit insgesamt 700 Fragen** geprüft; sämtliche Erklärungen automatisiert auf reine Antwortwiederholung geprüft. Je Komplex Fragen 1, 26 und 50 redaktionell gesichtet, zusätzliche konkrete Fundstellen vertieft. Das ist keine vollständige fachliche Einzelabnahme aller 700 Fragen. |
| Weitere Übungen/Karten | Relevante aktive Deutschaufgaben, Mathegeneratoren, Karten- und Spiellogik an konkreten Stellen geprüft. Nicht jede Vokabel, jeder Satz, jede Karte und jede Spielkombination wurde einzeln abgenommen. |
| Oberfläche | Eigenständige Sichtprüfung von Training, Trainingshilfe, Mathe-/Deutsch-Tafelwerk und Lernkasten bei 390 × 844; ergänzende Browseransicht des aktuellen Builds und Formeldarstellung. Aktuellen Bundle-Stand nach Aktualisierung abgeglichen. |
| Technik | Produktionsbuild; 295 Unit-Tests; 20 vorhandene Browserprüfungen zu Tafelwerk, Pink, Navigation, Offline und Datenerhalt. Alle bestanden. |

Die automatisierte Mathe-Layoutprüfung deckt 320 × 568, 844 × 390 und 1440 × 900 ab. Deutsch wird zusätzlich auf mehreren Handyhöhen geprüft. Diese Prüfungen bestätigen technische Erreichbarkeit und Containermaße, **nicht**, dass jeder Schüler den Inhalt bequem lesen und verstehen kann. Die Pink-Prüfung ist eine gezielte Kontrastprüfung, keine vollständige Barrierefreiheitszertifizierung.

Ein ergänzender Impeccable-Quellscan über `src/components` lieferte keine Meldungen. Das ist kein Beweis für fehlerfreie Gestaltung. Ein verändernder Browser-Overlay wurde nicht eingesetzt; die Browserprüfung blieb bei Ansicht und Bedienung des lokalen Teststands.

**Nicht durchgeführt:** Unterrichtsversuch mit der Klasse, Nachweis eines Lernzuwachses, vollständige Prüfung mit Screenreader oder echter 200-%-Textvergrößerung, umfassender Leistungstest auf schwachen Handys und vollständiger Landeslehrplanabgleich. Es wurden keine echten Schülerprofile ausgewertet. Lokale Prüfungen ersetzen keine Freigabe durch Fachlehrkräfte.

### Zielgruppe und Lehrplan zuerst sauber auseinanderhalten

Der aktuelle Auftrag nennt **Realschüler**. Historische Projektunterlagen beschreiben dagegen eine BvB-Reha-Gruppe und die Vorbereitung auf den qualifizierten Hauptschulabschluss in Sachsen-Anhalt (`PRODUCT.md:7`, `docs/ANFORDERUNGEN-SACHSEN-ANHALT.md:3`). Das ist kein Beleg, dass die App ungeeignet ist; es ist aber auch kein Nachweis vollständiger Realschulabdeckung.

**P1 für die weitere Inhaltsplanung:** Mit der Fachlehrkraft Zieljahrgang, Bundesland, Abschluss und häufigste Lernhürden festlegen. Erst dann den vorhandenen Bestand zuordnen. Grundlagen nicht entfernen, weil ältere Schüler sie benötigen; schwierigere Inhalte nicht automatisch als passend betrachten, nur weil sie vorhanden sind. Die [KMK-Übersicht der Bildungsstandards](https://www.kmk.org/en/bildungsministerkonferenz/bildungsthemen/bildungsstandards.html) unterscheidet die einschlägigen Abschlüsse und verweist auf deren Standards; die konkrete Umsetzung liegt bei den Ländern. Keine pauschale Behauptung „deckt die Realschule ab“ ergänzen.

## 3. Fachliche Richtigkeit und Qualität der Aufgaben

### F01 · P1 · Zwei Deutschaufgaben sind nicht eindeutig lösbar

**Belegt:** `src/content/grammarV3.json:3` / `grammar.v3.normal.1` lautet „Die Auszubildende hilft ___ neuen Kollegen.“ Zur Auswahl stehen `dem`, `den`, `des`; nur die erste Option gilt als richtig. Sowohl **dem neuen Kollegen** im Singular als auch **den neuen Kollegen** im Plural ist Dativ und grammatisch korrekt. Die Aufgabe nennt keine Anzahl. [Duden: Kollege](https://www.duden.de/rechtschreibung/Kollege) dokumentiert die Form „Kollegen“ auch für den Plural.

`src/content/grammarV3.json:168` / `grammar.v3.normal.16` verlangt „Er bewirbt sich ___ eine Ausbildungsstelle.“ `um` gilt als richtig; `auf` wird als falsch behandelt. [Duden: bewerben](https://www.duden.de/rechtschreibung/bewerben) führt beide Verbindungen als zulässig auf.

**Vorschlag:** Beim ersten Satz die Einzahl ausdrücklich vorgeben oder eine Form wählen, deren Singular und Plural nicht zusammenfallen. Beim zweiten Satz keinen ebenfalls richtigen Gebrauch als Ablenker verwenden. Das bestehende Format mit genau einer richtigen Auswahl lässt sich beibehalten. Nicht bloß eine zusätzliche Erklärung nach der falschen Bewertung anhängen.

**Abnahme:** Jede angebotene falsche Alternative ist im konkreten vollständigen Satz wirklich falsch. Die Lehrkraft prüft den gesamten aktiven Grammatikbestand gezielt auf solche Mehrdeutigkeiten; bei Varianten der Standardsprache wird nicht vorschnell nur eine Form akzeptiert.

### F02 · P1 · Erklärungen müssen einen Grund liefern

**Belegt:** In den 14 aktiven Sachfach-Komplexen sind **604 von 700 Erklärungen = 86,3 %** wortgleich mit der richtigen Antwort, wenn abschließende Satzzeichen und Leerraum nicht berücksichtigt werden. Das ist ein reproduzierbarer Textvergleich, keine automatische Gesamtbewertung der Aufgaben.

| Fach | Fragen | Reine Antwortwiederholungen |
|---|---:|---:|
| Biologie | 200 | 151 |
| Geographie | 250 | 210 |
| Sozialkunde | 250 | 243 |
| Gesamt | 700 | 604 |

Besonders deutlich: `soc-media` 50/50, `soc-family` und `soc-leisure` je 49/50. Aktive Einbindung: `src/content/index.ts:12`; Dateien unter `src/content/complexes/`.

**Beispiel:** `complex.bio-cells.026` fragt nach Osmose. Antwort und Erklärung nennen lediglich Wasserbewegung durch eine selektiv durchlässige Membran. Das grenzt die Richtung und den zugrunde liegenden Konzentrationsunterschied nicht verständlich ab. Hier ist die Antwort nicht pauschal falsch, aber als Erklärung zu dünn.

**Vorschlag:** Zuerst die häufig genutzten und oft falsch beantworteten Fragen redaktionell überarbeiten. Eine Erklärung enthält **einen verständlichen Grund, Zusammenhang oder Unterschied**. Sie darf kurz bleiben. Bei Osmose sollte eine fachlich geprüfte Erklärung zum Beispiel verdeutlichen, dass sich bei der üblichen Schulbetrachtung netto Wasser zur Seite mit der höheren Konzentration gelöster, nicht durch die Membran tretender Teilchen bewegt. Fachlicher Abgleich: [OpenStax, Biology 2e: Osmosis](https://openstax.org/books/biology-2e/pages/5-2-passive-transport). Keine medizinischen Schlussfolgerungen oder unnötige Moleküldetails ergänzen.

Bei einer reinen Namensfrage kann eine knappe Antwort ausreichend sein; keine künstliche Textpflicht für jede Karte. Entscheidend ist, ob nach einem Fehler etwas Neues verständlich wird.

**Abnahme:** Ein Schüler kann mit Hilfe der Rückmeldung eine ähnliche Frage später begründen; er muss nicht nur denselben Antwortsatz wiedererkennen. Fachlehrkraft prüft neue Erklärungen und Bedingungen.

### F03 · P2 · Falsche Antwortmöglichkeiten sollen typische Irrtümer treffen

**Belegt:** `complex.bio-cells.005` bietet neben „Eine Zellwand“ die Alternativen „Eine Ohrmuschel“ und „Eine Sehne“. Andere Sachfachfragen lassen die richtige Antwort durch extreme Gegenbehauptungen wie „immer“, „jede“ oder „keinerlei“ leicht erkennen. Bei generierten Matheaufgaben bestehen Ablenker häufig aus Ergebnis ±1, +10 oder anderen allgemeinen Nachbarwerten (`src/learning/generator.ts:59`).

**Bewertung:** Leichte Einstiegsfragen sind sinnvoll. Wenn aber auch anspruchsvollere Aufgaben ohne Sachwissen durch Aussortieren absurder Antworten lösbar sind, kann eine hohe Trefferquote das Verständnis überschätzen.

**Vorschlag:** Gezielt plausible, altersgerechte Fehlvorstellungen verwenden. Bei Brüchen beispielsweise eine Verwechslung der Rechenregeln statt einer zufälligen Nachbarzahl. Die Rückmeldung erklärt genau den Unterschied. Nicht alle Einstiegsfragen auf einmal erschweren und keine sprachlichen Fallen einbauen.

**Abnahme:** Ein falscher Lösungsweg ist fachlich nachvollziehbar; die richtige Antwort bleibt eindeutig. Schüler müssen wegen des Inhalts entscheiden, nicht nur wegen Länge oder Tonfall der Antwort.

### F04 · P2 · Kompetenznamen an die tatsächlich geübten Leistungen anpassen

**Belegt:** `math.fraction.calculate` beschreibt unter anderem Bruchaddition, Multiplikation/Division und verschiedene Nenner (`src/learning/mathCompetencies.ts:16`). Der zugeordnete Generator `fraction` erzeugt jedoch ausschließlich Anteile einer Gesamtzahl (`src/learning/generator.ts:10`). Bei `math.percent.change` versprechen die Stufen auch Grundwert und mehrere Änderungen, der Generator berechnet Rabattanteile.

**Vorschlag:** Erst Zuordnung und Bezeichnungen berichtigen. Aus häufig richtig beantworteten Anteilsaufgaben darf keine breite Beherrschung der Bruchrechnung abgeleitet werden. Weitere Aufgabenformen nur ergänzen, wenn sie zum vereinbarten Lernziel gehören.

**Abnahme:** Für jede angezeigte Kompetenz lässt sich konkret zeigen, welche Leistungen dafür tatsächlich beobachtet wurden. Neue Benennungen erhalten vorhandene Lernstände und setzen sie nicht still zurück.

## 4. Das Tafelwerk gezielt verbessern

### T01 · P1 · Nachschlagen aus der Aufgabe ermöglichen

**Belegt:** Die Fachrunde wird in `src/App.tsx:257` in einem eigenen Renderzweig angezeigt. Die untere Navigation und das Tafelwerk liegen im anderen Zweig. `LearningTools.tsx:5` enthält Hilfe, aber keinen Verweis auf die passende Tafel. Historische Texte über einen überall verfügbaren Tafelwerk-Dialog beschreiben den aktuellen Weg nicht zuverlässig.

**Vorschlag:** Bei passenden Aufgaben einen kurzen Zugang wie „Regel ansehen“ zur **bereits vorhandenen** Tafel anbieten. Zur Aufgabe zurückkehren muss ohne verlorene Eingabe, geänderte Aufgabe oder weiterlaufende Automatik möglich sein. Nachschlagen vor der Antwort wird für selbstständige Kompetenznachweise transparent als Hilfe behandelt, nicht als Fehlleistung bestraft.

**Abnahme:** Prozentaufgabe → passende Prozenttafel → unveränderte Aufgabe. Keine zusätzliche Suche durch drei Menüebenen. Die Tafel selbst bleibt unbewertet.

### T02 · P1 · Leere Fächer ehrlich kennzeichnen

**Belegt:** `src/components/Tafelwerk.tsx:74` bietet Sozialkunde, Biologie und Geographie als normale Fachtasten an. Dahinter steht „Noch keine Tafeln“ und „Hier können später wichtige Bilder und kurze Erklärschritte … abgelegt werden“.

**Vorschlag:** Fachpositionen beibehalten, die fehlende Verfügbarkeit aber verständlich erkennbar machen. Den Entwicklungsauftrag nicht als Schülertext anzeigen. Danach nur dort einen kleinen Bestand aufbauen, wo tatsächlich wiederkehrender Erklärbedarf besteht: etwa eine beschriftete Zellübersicht für den vorhandenen Zellen-Komplex. Zunächst einen solchen Bereich fachlich und mit Schülern erproben, nicht drei Fächer auf einmal auffüllen.

**Abnahme:** Die Auswahl erzeugt keine Erwartung eines vorhandenen Nachschlagebestands, wenn keiner existiert. Neu entstehende Tafeln enthalten Regel/Übersicht/Beispiel, keine Aufgaben oder Lösungsschalter.

### T03 · P2 · Eine verlässliche innere Form verwenden

**Belegt:** Einige Tafeln zeigen Definition, andere nur Formel oder Beispiel. Die eigentlichen Themenüberschriften verschwinden teilweise zugunsten einer einzelnen Schrittüberschrift. Die Variablen-Erklärung ist je nach Tafel unterschiedlich deutlich.

**Vorschlag:** Bestehende Inhalte möglichst in derselben Reihenfolge lesbar machen: **Thema → Kernregel oder vollständige Rechnung → kurze Bedeutung**. Nur tatsächlich benötigte Zeichen direkt zuordnen. Keine neuen Textkästen auf jeder Seite erzwingen und keine schon vorhandene Formel ein zweites Mal ausgeben.

Konkrete Kandidaten:

- `ausklammern`: Die drei mathematisch zusammengehörigen Zeilen könnten ihre Gleichwertigkeit mit sichtbaren Gleichheitszeichen zeigen, statt nur untereinander zu stehen. Die fertige Übersicht bleibt erhalten.
- `kreis`: π wird in der Zeichnung verwendet, aber auf den beiden Ansichten nicht erklärt. Ein knappes „π ≈ 3,14“ im vorhandenen Formelbereich ist hilfreicher als ein weiterer Absatz.
- `pythagoras`: Die Zeichnung benennt am Dreieck die Seiten 3, 4 und c; die Quadrate daneben heißen a², b² und c². Eine direkte Zuordnung „a = 3, b = 4“ würde Text und Bild verbinden, ohne eine weitere Ansicht zu brauchen.
- `prozent`: Die drei Fälle bleiben getrennt. Im Grundwertfall die Rollen von W und p kurz zuordnen; die Zahlen nicht noch einmal im Fließtext ausrechnen.

**Abnahme:** Bei einer Tafel kann ein Schüler auf Regel, Bedeutung der Zeichen und fertiges Beispiel zeigen, ohne eine zusätzliche Anleitung aufzurufen. Kein Verlust notwendiger Bedingungen oder Einheiten.

### T04 · P2 · Kleine sprachliche Ungenauigkeiten nicht als Regeln festschreiben

**Mathe:** Bei der zweiten binomischen Formel heißt es „Die Quadrate a² und b² bleiben positiv“ (`math-lessons.json:1781`). Für a oder b gleich null ist das streng genommen nicht richtig. Gemeint sind die **Pluszeichen vor den Quadrattermen**. Genau das benennen, ohne neue Fallunterscheidung.

**Deutsch:** `DEU-01` bezeichnet Adjektive pauschal mit „Eigenschaft; steigerbar“ und Verben über „Tätigkeit“ (`german-lessons.ts:20`). Das sind nützliche Einstiegshilfen, aber als alleiniges Erkennungsmerkmal zu eng. „Eigenschaft; häufig steigerbar“ und „Tätigkeit oder Zustand“ wären vorsichtiger. Die [Grammatik des IDS](https://grammis.ids-mannheim.de/systematische-grammatik/276) beschreibt die Eigenschaften der Wortart differenzierter; Sonderfälle müssen hier nicht ausgebreitet werden.

**Abnahme:** Der knappe Merksatz führt bei gängigen Gegenbeispielen nicht zu einer falschen Zuordnung. Kein zusätzliches Glossar erforderlich.

### T05 · P2 · Schreiben an einem Beispiel zeigen

**Belegt:** `DEU-14` heißt „Argumentieren: Behauptung, Grund, Beispiel“, liefert aber unter den als `example` gespeicherten Inhalten überwiegend abstrakte Definitionen (`german-lessons.ts:45`). Gerade der Unterschied zwischen Grund und Beispiel bleibt so voraussetzungsreich.

**Vorschlag:** Die vorhandenen Definitionen durch **ein zusammenhängendes, kurzes Muster** ersetzen, dessen Teile eindeutig beschriftet sind. Zum Beispiel:

| Baustein | Mögliches Muster |
|---|---|
| Behauptung | Ein überdachter Fahrradplatz wäre sinnvoll. |
| Begründung | Dort bleiben Fahrräder bei Regen trockener. |
| Beispiel | Nach dem letzten Schultag im Regen waren viele Sättel nass. |
| Schluss | Deshalb sollte ein Teil der Stellplätze überdacht werden. |

Das ist eine Nachschlageübersicht, keine Aufforderung zum Bearbeiten. Die konkrete Formulierung ist ein Vorschlag und noch nicht fachlich/unterrichtlich freigegeben. Den vorhandenen Hinweis bewahren, dass ein Einzelbeispiel eine allgemeine Behauptung nicht automatisch beweist.

**Abnahme:** Schüler unterscheiden in einem anderen kurzen Argument Grund und Beispiel. Nicht einfach vier Definitionen plus vier neue Sätze anhängen.

### T06 · P2 · Schwierige Begriffe in den bestehenden Sätzen übersetzen

**Belegt:** Deutschtafeln verwenden „finit“, „Nominativ“, „Konnektoren“, „nominalisiert“ und „rückwärts chronologisch“. Das ist fachlich nicht automatisch falsch, verlangt aber Vorwissen. Teilweise existieren bereits gute Übersetzungen, zum Beispiel „finit (gebeugt)“.

**Vorschlag:** Dieses bestehende Prinzip konsequent nutzen: „neueste Station zuerst“ statt einer zusätzlichen Erklärung von „rückwärts chronologisch“, „Bindewörter“ als Einstieg vor „Konnektoren“. Fachwörter dort erhalten, wo sie Unterrichtsgegenstand sind; nicht jedes Vorkommen doppelt erklären. Bei `DEU-06` prüfen, ob der Titel die Auswahl von fünf Zeitformen deutlich genug bezeichnet. Das fehlende Futur II allein rechtfertigt keinen Ausbau.

**Abnahme:** Eine leseschwächere Person kann den Satz ohne weitere Begriffskette wiedergeben. Kein fachlich notwendiger Unterschied geht verloren.

### T07 · P2 · Rückweg und aktuelle Rubrik erkennbar halten

**Belegt:** Bei mehrseitigen Mathetafeln erscheint am Ende „Zur Themenliste“. Einseitige Tafeln und Deutschansichten haben diesen Weg nicht. Zurück geht es über erneutes Antippen des bereits aktiven Fachs; erklärt wird das erst in der Info (`Tafelwerk.tsx:45`, `:116`, `:119`).

**Vorschlag:** Die permanenten Fachbuttons behalten. Zusätzlich einen sehr knappen, erkennbaren Weg zur aktuellen Rubrik prüfen, beispielsweise eine antippbare Rubrikbezeichnung. Kein großer zusätzlicher Kopfbereich und keine Rückkehr zum früheren versteckten Fächermenü.

**Abnahme:** Ein Erstnutzer findet nach „Vorzeichenregeln“ wieder andere Zahlenthemen, ohne erst die Hilfe zu öffnen. Fachpositionen springen dabei nicht.

### Was am Mathe-Tafelwerk ausdrücklich nicht zurückgebaut werden sollte

Die gestrafften 59 Tafeln sind kein Anlass für einen erneuten Komplettumbau. Die vier schriftlichen Rechnungen sind rechnerisch stimmig: 348 + 176 = 524; 426 − 258 = 168; 2637 · 24 = 63288; 59535 : 7 = 8505. Stellenordnung, kleine Übertragsziffern und die Nullstelle bei der Division bleiben erhalten. Addition, Subtraktion, Multiplikation und Division bleiben vollständige feste Darstellungen, keine neu entwickelten Schrittanimationen.

Auch die sichtbaren Erweiterungsfaktoren bei Brüchen, beide Fälle beim Median, die drei Prozentfälle und die getrennten binomischen Formeln sind sinnvoll. Pythagoras bleibt auf rechtwinklige Dreiecke beschränkt; Äquivalenzumformungen, Einheiten und der Zeichenwechsel beim Teilen einer Ungleichung durch eine negative Zahl dürfen nicht durch Kürzen verschwinden.

## 5. Hilfe, Fehler und Lernfortschritt

### L01 · P1 · Die Rückmeldung muss stehen bleiben dürfen

**Belegt:** `src/App.tsx:114` startet mit `autoAdvance = true`; der Timer bei `:243` unterscheidet nicht zwischen richtiger und falscher Antwort. `src/lib/useAutoAdvance.ts:6` und `:13` setzen zwei Sekunden. Auch Deutsch nutzt diesen Mechanismus (`VocabularyPractice.tsx:22`, `:27`). „Anhalten“ existiert, verlangt aber eine rechtzeitige Reaktion.

**Vorschlag:** Standardmäßig manuell weiterlesen. Mindestens falsche Antworten ohne Automatik stehen lassen. Eine freiwillig aktivierte Automatik merken und in allen Fächern gleich behandeln. Keine neue Einstellungssammlung nötig: der bestehende Schalter kann verständlich weiterverwendet werden.

**Abnahme:** Nach einem Fehler kann beliebig lange gelesen werden. Ein Neustart aktiviert nicht ungefragt wieder den Countdown. Pause, Nachschlagen und Hilfedialoge halten einen gewählten Timer zuverlässig an.

### L02 · P1 · Der nächste hilfreiche Schritt statt „Lies noch einmal“

**Belegt:** In `App.tsx:262` erscheinen die Mathe-Hilfen nur für Aufgaben ohne `equation` und ohne `diagram`. `EquationPractice.tsx` hat ein Operationsfeld und Fehlermeldungen, aber keinen Hinweisweg. Andere Fächer haben keine entsprechende gestufte Hilfe. Generische Fallbacks in `src/learning/tasks.ts:13` bleiben sehr allgemein.

**Vorschlag:** Den vorhandenen Aufbau Hinweis → ähnliches Beispiel → Erklärung gezielt an die häufigsten Hürden anschließen. Bei Gleichungen etwa die nächste sinnvolle Umformung begründen; bei Geometrie zuerst zeigen, welche beschriftete Größe zur Formel gehört. Nicht sofort das Ergebnis verraten und nicht jede Aufgabe mit drei neuen Absätzen versehen. Bestehende Hilfedaten der Gleichungsaufgaben nutzen, die bereits in `equations.ts` hinterlegt sind.

**Abnahme:** Ein feststeckender Schüler findet eine konkrete nächste Handlung. Hilfe ist kein Punktabzug und wird bei selbstständigen Kompetenznachweisen trotzdem korrekt berücksichtigt.

### L03 · P2 · Das Gleichungsformat misst nicht alle Rechenfähigkeiten

**Belegt:** Der Schüler gibt eine Operation ein; `applyOperation` wendet diese automatisch auf beide Seiten an und berechnet die Folgezeile (`src/learning/equations.ts:21`). Unzulässige Eingaben wie Teilen durch null oder eine nicht passende vorgeschriebene Gleichungszeile werden lokal zurückgewiesen. Erst das erfolgreiche Freistellen von x führt in `App.tsx:264` zu `answer(0)`. Diese zurückgewiesenen Versuche werden nicht als eigene Lernbeobachtung übergeben.

**Bewertung:** Das Format übt die Wahl der Operation und ist dafür sinnvoll. Es belegt aber nicht, dass der Schüler sämtliche Zwischenrechnungen selbst berechnen kann. Ein Tippfehler ist außerdem kein fachlicher Fehler.

**Vorschlag:** Lernerfolg und Beobachtung differenzieren: sinnvolle Operation gewählt, nach einem fachlichen Hinweis gelöst, unzulässige Operation versucht. Reine Syntaxkorrekturen nicht pauschal als Falschantwort zählen. Den Kompetenznachweis eng auf die tatsächlich selbst ausgeführte Tätigkeit beziehen. Eine zusätzliche Eingabe jeder Folgezeile wäre eine spätere Option, kein notwendiger Umbau dieser Prüfung.

**Abnahme:** Mehrfaches Teilen-durch-null-Versuchen wird nicht unbemerkt als störungsfreier Erstversuch behandelt; eine versehentlich fehlende Doppelpunkt-Eingabe löst zugleich keine ungerechtfertigte Abwertung aus.

### L04 · P2 · Nach der Runde einen verständlichen nächsten Schritt anbieten

**Belegt:** Das Rundenende zeigt vor allem Bestehen/Weiterüben, Summen und „Noch eine Runde“ (`App.tsx:258`). Ein Aufgabenrückblick existiert bereits über die Pause, aber nicht als gleichwertiger Abschlussweg.

**Vorschlag:** Den vorhandenen Rückblick am Ende anbieten und einen konkreten nächsten Schritt nennen: beispielsweise „Brüche mit verschiedenen Nennern noch einmal ansehen“. Nur auf tatsächlich beobachtete Aufgaben stützen; aus einer Antwort keine umfassende Schwäche diagnostizieren. Keine weitere Statistikseite bauen.

**Abnahme:** Nach einer Runde weiß ein Schüler, was schon gelungen ist und was er jetzt sinnvoll wiederholen oder nachschlagen kann.

### L05 · P2 · Unterstützung beim Einstieg statt zufälligem Überfordern

**Belegt:** Der normale Matheeinstieg nutzt die hinterlegten Voraussetzungen nicht überall als Auswahlbedingung (`src/learning/adaptive.ts:64`). Nach wiederholten Fehlern gibt es dagegen bereits hilfreiche Rückgriffe auf Grundlagen (`:39`).

**Vorschlag:** Bei Bedarf eine kleine Grundlagenempfehlung anbieten, bevor eine Reihe erfolgloser Versuche entsteht. Freie Themenwahl erhalten; keine langen Pflicht-Einstufungstests oder undurchsichtigen Sperren. Vorhandene Zuordnung und Beobachtungen nutzen.

**Abnahme:** Ein Schüler, der noch mit dem Einmaleins kämpft, landet nicht wiederholt ohne passende Hilfe in überfordernden Bruchaufgaben. Andere Schüler werden nicht unnötig auf ganz leichte Aufgaben zurückgesetzt.

## 6. Motivation und Spaß

### M01 · P1 · „Skill“ und täglicher Verlust senden eine problematische Botschaft

**Belegt:** `src/components/HomeStatus.tsx:28` nennt die Anzeige „Skill“, die Hilfe auch „Lernstärke“. Das Modell in `src/learning/journey.ts:16` und `:34` belohnt mindestens 30 aktive Minuten an einem Kalendertag mit 1/7 des Maximalwerts. Tage unter dem Ziel verringern einen vorhandenen Wert um 10 %. Es ist keine Ableitung aus Fachkönnen. Ein Tag mit 29 gezählten Minuten erreicht den Tageszuwachs nicht.

**Vorschlag:** Score und Instrumentengestaltung dürfen bleiben. Den Balken zunächst ehrlich als Aktivität oder Übungsroutine benennen. Anschließend ein kleineres, realistisches Tagesziel bzw. die Anerkennung kurzer abgeschlossener Einheiten erproben und den täglichen Verfall überdenken. Keine scheinbare Kompetenz in Prozent aus Zeit ableiten. Vorhandene Erfolge und Sicherungen bei einer späteren Umstellung erhalten.

**Hypothese:** Der Verlust nach Wochenenden, Krankheit oder kurzen Lernphasen kann entmutigen. Das ist ein begründetes Risiko, kein durch diese Prüfung nachgewiesener Effekt.

**Abnahme:** Schüler erklären zutreffend, was der Balken misst. Sinnvolle fünf bis zehn Minuten gelten sprachlich als Erfolg, nicht als verlorener Lerntag.

### M02 · P1 · Deutsch-Bosskampf muss zum geübten Bereich passen

**Belegt:** `src/learning/boss.ts:18` setzt `all = test || subject === 'german'`. Dadurch können im normalen Deutsch-Boss auch ungeübte Grammatik-, Satzbau-, Rechtschreib- oder Sprichwortaufgaben auftauchen.

**Vorschlag:** Die Herausforderung aus tatsächlich bearbeiteten Bereichen zusammenstellen. Die vereinbarte Aufladung nach **zwei** vollständigen Übungsrunden beibehalten. Wenn der verfügbare Bestand nicht genügt, klar erklären, welcher Übeschritt noch fehlt; vorhandene Ladung nicht wegnehmen.

**Abnahme:** Ausschließlich geübte Grammatik führt nicht überraschend in einen Kampf über völlig unberührte Deutschbereiche.

### M03 · P1 · Auch nach dem Bosskampf noch aus Fehlern lernen

**Belegt:** Bei der zehnten Antwort oder acht richtigen Antworten schaltet `BossBattle.tsx:25` sofort zum Ergebnis. Die letzte Rückmeldung wird dadurch übersprungen. Die Ergebnisansicht enthält keinen Aufgabenrückblick.

**Vorschlag:** Nach dem Kampf eine kurze, freiwillige Nachbesprechung aus den vorhandenen Aufgaben und Erklärungen anbieten. Den bereits existierenden Rückblick-Baustein wiederverwenden. Kein zusätzlicher Lesetext unter laufender Uhr.

**Abnahme:** Auch die letzte falsche Antwort lässt sich anschließend samt richtiger Antwort und Begründung ansehen. Ein Sieg muss keinen langen Pflichtdialog auslösen.

### M04 · P2 · Der Timer soll Herausforderung sein, nicht Lesetempo bestrafen

**Belegt:** Zehn Aufgaben teilen sich drei Minuten (`BossBattle.tsx:14`). Multiple Choice, Satzbau und Gleichungsumformungen brauchen sehr unterschiedliche Eingaben; die Uhr läuft während der Rückmeldungen weiter.

**Vorschlag:** Zeitmodus bewusst als freiwillige Herausforderung ausweisen. Mit Schülern prüfen, ob Rückmelde-Lesezeit pausiert und die Aufgabenauswahl zeitlich vergleichbarer werden sollte. Das bereits vorhandene zeitfreie Training als Alternative erreichbar halten; dafür ist keine zusätzliche Spielwelt oder dritte Schwierigkeitsstufe nötig.

**Abnahme:** Ein vergleichbarer Kenntnisstand hat nicht allein wegen längerer Texte oder mehrerer notwendiger Eingaben deutlich schlechtere Chancen. Erst beobachten, dann Zeitbudget festlegen.

### M05 · P2 · „Normal/Streber“ mit Jugendlichen prüfen

**Belegt:** Die globale Schwierigkeit nutzt diese beiden Bezeichnungen (`src/components/PracticeSwitch.tsx:3`).

**Vorschlag:** Neutralere Alternativen wie „Grundlagen/Anspruchsvoll“ oder „Normal/Knifflig“ mit der Klasse testen. Nicht voraussetzen, dass „Streber“ zwingend verletzt oder zwingend motiviert. Deutlich machen, was sich an der Aufgabe ändert, statt Menschen zu kategorisieren.

**Abnahme:** Beide Stufen werden als normale Wahl verstanden; auch unsichere Schüler trauen sich, die schwierigere zu probieren.

### M06 · P2/P3 · Vorhandene Spiele zugänglicher und abwechslungsreicher nutzen

- **P2, Codeknacker:** Die sichtbaren Spielsteine unterscheiden sich nur über Farbe (`Codebreaker.tsx:5`). Zugängliche Namen sind vorhanden, helfen sehenden Spielern mit Farbsehschwäche aber nicht ausreichend. Kleine zusätzliche Symbole oder Muster auf den bestehenden Steinen prüfen. Farbe und Spiellogik behalten. Abnahme: ohne sichere Farbunterscheidung spielbar.
- **P3, Galgenraten:** Das Wort wird nach dem Ende aufgedeckt, danach geht es zur nächsten Runde (`Hangman.tsx`). Ein vorhandener Hinweis könnte die Wortbedeutung am Ende noch einmal knapp zugänglich machen. Keine erzwungene Zusatzaufgabe. Ein alternatives neutrales Fehlversuchsmotiv nur bei entsprechendem Feedback der Klasse prüfen; nicht ungefragt die gesamte Gestaltung ersetzen.
- **P3, Fortschritt:** Punkte und kleine Erfolgsmeldungen können Spaß machen. Zuerst verständliche persönliche Erfolge zeigen, etwa eine schwierige Runde nach Hilfe geschafft. Neue Badges, Ranglisten, tägliche Pflichtserien oder Konkurrenzdruck sind dafür nicht notwendig.
- **P3, N-Back/Puzzle:** Als freiwillige Denkspiele behandeln. Aus einer besseren Spielleistung keine unbelegte Verbesserung der Intelligenz oder allgemeiner Schulleistung ableiten. Kein solcher Lerntransfer wurde in dieser Prüfung nachgewiesen.

## 7. Optik, Orientierung und Lesbarkeit

### O01 · P2 · Die Taschenrechner-Optik behalten, Nebensachen beruhigen

**Belegt/Sichtprüfung:** Die großen Fachkacheln und die drei unteren Hauptbereiche sind wiedererkennbar. Gleichzeitig konkurrieren Score, Skill, Rundenanzahl, Bossbilanz, Roboterladung, Spielzähler und Schwierigkeitswahl um Aufmerksamkeit.

**Vorschlag:** Keine neue Stilwelt. Sekundäre Zahlen sparsamer gewichten bzw. in der vorhandenen Statistik erläutern. Die Fachauswahl soll die stärkste Handlung bleiben. Spiele müssen nicht entfernt werden; sie müssen auch nicht gleichrangig den nächsten hilfreichen Lernschritt erklären.

**Abnahme:** Ein neuer Schüler kann zeigen, wo er weitermacht und was die wichtigsten Zahlen bedeuten, ohne alle Infotexte zu lesen.

### O02 · P2 · Mehr Platz für Wörter, nicht weniger Schrift

**Belegt/Sichtprüfung:** Bei 390 Pixel Breite entstehen ungünstige Wortabbrüche, etwa bei „Vorzeichenregeln“. Auf Themenkacheln nehmen Symbol, Innenabstand und Pfeil einen erheblichen Teil der Breite ein (`src/design/tafelwerk.css:35`). Die Fachauswahl selbst ist bereits konsistent.

**Vorschlag:** Symbole/Pfeile auf Unterthemen zurücknehmen, gut verständliche kurze Titel und natürliche Umbrüche verwenden. Nicht die Fachreihenfolge ändern und nicht wieder alle Tafeln untereinander ausgeben. Zweispaltige Themenauswahl erhalten, solange Wörter darin vernünftig lesbar bleiben.

**Abnahme:** Keine isolierten Wortreste wie „… / eln“ in häufig verwendeten Themen. Schrift wird nicht weiter verkleinert.

### O03 · P2 · „Ohne unnötiges Scrollen“ von „niemals scrollen“ unterscheiden

**Belegt:** Es gibt sehr kleine Nebenbeschriftungen, etwa 7–8 px an der Skill-Skala (`src/design/home-status.css:19`, `:23`). Das Tafelwerk ist auf feste Bildschirmhöhen und eingepasste Grafiken optimiert. Die vorhandenen Tests messen überwiegend Erreichbarkeit und Überlauf.

**Vorschlag:** Die kompakte Standardansicht bewahren. Bei Bedarf größere Schrift, lesbare Formeln und eine vergrößerbare Tafelansicht ermöglichen. Im vergrößerten Lesemodus ist vertikales Scrollen besser als abgeschnittene Inhalte oder wieder winzige Schrift. Zusammengehörige schriftliche Rechnungen dabei nicht auseinanderreißen.

Die [W3C-Erläuterung zu Textvergrößerung](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) nennt eine Vergrößerung auf 200 % ohne Informations- oder Funktionsverlust. [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) betrifft lesbaren Umbruch ohne ständiges Scrollen in zwei Richtungen; für inhaltlich zweidimensionale Darstellungen gibt es Ausnahmen. Daraus folgt kein pauschales Verbot vertikalen Scrollens und keine Pflicht, mathematische Zeichnungen beliebig umzubrechen.

**Abnahme:** Realer 200-%-Lese-/Zoomtest sowie Tastaturprüfung mit sichtbaren Bedienelementen. Formeln, Überträge und Beschriftungen werden zusätzlich von Menschen gelesen, nicht nur auf Überlauf geprüft. In dieser Prüfung wurde kein vollständiger 200-%-Konformitätsnachweis erbracht.

### O04 · P2 · Zugängliche Bezeichnungen müssen zum Sichtbaren passen

**Belegt:** `CalculatorKey.tsx:18` nennt Fachbuttons für Screenreader „Level …“, während die große sichtbare Zahl inzwischen abgeschlossene Runden bezeichnet. Diese Bedeutungen sind verschieden.

**Vorschlag:** Fachname und tatsächlichen Runden-/Ladungsstatus konsistent benennen. Nicht dieselbe Information mehrfach und widersprüchlich vorlesen lassen. Vorhandenes Fokus- und Dialogverhalten bewahren.

**Abnahme:** Tastatur-/Screenreader-Durchgang versteht „Runden“ als Runden. Auswahl, gesperrt und aktiv bleiben auch ohne alleinige Farberkennung erkennbar. Pink darf nicht auf Standardseiten gut aussehen, aber innerhalb eines Spiels unlesbar werden.

### O05 · P3 · Kleine sprachliche Orientierungshilfen

„Lernkomplexe“ und „Unterrubriken“ können durch „Themen“ ersetzt werden, sofern die Unterscheidung im jeweiligen Kontext nicht nötig ist (`ComplexPanel.tsx`, `LearningBox.tsx:33`). Beim Zugangscode fehlt eine sichtbare Auskunft, wo man ihn bekommt (`AccessGate.tsx:20`). Wenn die Lehrkraft ihn ausgibt, genügt ein entsprechender kurzer Satz. Keine eigenmächtige Entfernung der Zugangsbeschränkung.

**Abnahme:** Ein Schüler ohne Vorwissen weiß, was auszuwählen ist und an wen er sich bei fehlendem Code wendet.

## 8. Lernkasten, Statistik und Alltagstauglichkeit

### A01 · P2 · „Heute nichts fällig“ ist ein Erfolg, kein leerer Zustand

**Belegt:** `LearningBox.tsx:34` erklärt fehlende Auswahl bzw. fehlende Karten. Sind Karten vorhanden, aber keine fällig, ist „Lernen beginnen“ deaktiviert, ohne vergleichbar deutlichen Abschluss-/Fälligkeitshinweis.

**Vorschlag:** Kurzer positiver Zustand mit nächstem Wiederholungszeitpunkt. Die vorhandenen Wiederholungsabstände beibehalten. Nicht alle bekannten Karten wieder in eine Pflichtschleife schicken, nur damit der Knopf aktiv bleibt.

**Abnahme:** Eine leere fällige Auswahl wird als erledigte Wiederholung verstanden. Laufende Runden und eigene Karten bleiben erhalten.

### A02 · P2 · Zeitstatistik eindeutig erklären

**Belegt:** Aktivitätszeit stoppt nach 30 Sekunden ohne Eingabe; Monatsstatistik und Skill berücksichtigen Zeit zudem auf unterschiedliche Weise (`App.tsx:129`, `:141`; `Statistics.tsx:13`). Unvollständige Runden sind in der Monatsdarstellung nicht gleichbedeutend mit „keine Arbeit“. Ruhiges Tafelwerklesen ist ebenfalls kein zuverlässiger Teil dieser Messung.

**Vorschlag:** „Erfasste Übungszeit“ statt einer vermeintlichen Gesamtlernzeit ausweisen und nicht mit Kompetenz verwechseln. Langsames Lesen und Denken nicht sprachlich abwerten. Die Messung nicht einfach pauschal hochsetzen: zuerst klären, welche Aussage die Zahl leisten soll.

**Abnahme:** Ein Schüler versteht, warum eine begonnene Runde noch nicht als abgeschlossene Zeit im Monatsbalken steht. Eine längere Denkpause wird nicht als Beweis fehlender Mitarbeit interpretiert.

### A03 · P2 · Datensicherheit und Offline als Stärke erhalten

**Belegt:** Lokale Speicherung, Export/Import, Rückfragen und Speicherfehlerhinweise sind vorhanden. Die vorhandene Offline-Prüfung bestätigt für ihren Ablauf den Erhalt von Lernständen und gespeicherten Runden. Das ist ein echter Vorteil für den Schulalltag.

**Vorschlag:** Bei späteren Änderungen diese Wege gezielt absichern. Im Unterricht einmal mit Testdaten zeigen, wie eine Sicherung wiederhergestellt wird. Nach einem Browser-/Gerätewechsel keine automatische Synchronisierung versprechen. Aktualisieren muss eine erkennbare aktuelle Version erreichen, ohne Runden oder Eingaben zu verlieren.

**Abnahme:** Bestehende Sicherungen bleiben lesbar; eigene Karten und Lernfortschritt gehen bei Updates nicht verloren. Echte Android-/iOS-Geräte und unterbrochene Downloads gesondert prüfen. Neue Konten oder ein Cloud-Backend sind für die hier vorgeschlagenen Verbesserungen nicht erforderlich.

### A04 · P2 · Technische Tests um Inhaltsqualität ergänzen

**Belegt:** Die bestehenden Tests laufen erfolgreich, obwohl die beiden Mehrdeutigkeiten und die Antwortwiederholungen enthalten sind. Strukturvalidierung und Layouttests können diese fachlichen Probleme nicht vollständig erkennen. Historische README-Angaben, unter anderem zur Weiter-Automatik und zum Umfang der Fachbestände, weichen vom aktuellen Code ab.

**Vorschlag:** Einen kleinen redaktionellen Prüfprozess mit eindeutiger Antwort, echter Erklärung, passender Schwierigkeit und Lehrkraftfreigabe verwenden. Ein einfacher Vergleich kann reine Antwortwiederholungen zur Durchsicht markieren; er darf nicht automatisch entscheiden, welche Texte falsch sind. Die wichtigsten aktuellen Produktregeln an einer gepflegten Stelle dokumentieren.

**Abnahme:** Jede später überarbeitete Aufgabe hat eine nachvollziehbare fachliche Prüfung. Bestehende IDs bei reinen Textkorrekturen erhalten; bei echten Bedeutungsänderungen die bestehenden Datenregeln beachten. Keine ungefragte Umstrukturierung des gesamten Repositories.

## 9. Was bereits gut ist und bleiben sollte

- **Eigenständige Gestaltung:** Taschenrechnerkacheln, Hintergrund und markante Typografie sind zusammenhängend. Eine nüchterne Standard-Lernplattform wäre nicht automatisch besser.
- **Stabile Hauptnavigation:** Training, Lernkasten und Tafelwerk sind beschriftet. Fächer im Lernkasten und Tafelwerk stehen an denselben Positionen und nutzen eine konsistente Auswahlfarbe.
- **Kurze Hilfen:** Trainingsinfo, Lernkasten- und Tafelwerkhilfe nicht wieder zu langen Anleitungen ausbauen. Konkrete Hilfe gehört dorthin, wo man feststeckt.
- **Nachschlagecharakter:** Das Tafelwerk enthält Regeln, Bilder und fertige Beispiele ohne Aufgaben, Bewertung und Lösungsspielchen.
- **Abrufen vor Aufdecken:** Der Lernkasten lässt erst erinnern und dann selbst einschätzen; „mit eigenen Worten“ ist sinnvoll. Wiederholungsabstände statt dauernder Sofortwiederholung erhalten.
- **Korrekturen möglich:** Satzbau erlaubt Nachbessern und merkt den Erstversuch. Das ist hilfreicher als eine Sackgasse nach dem ersten Fehler.
- **Teilweise gute Lernlogik:** Hilfen und zeitversetzte unterschiedliche Varianten werden in der Kompetenzbeobachtung berücksichtigt. Nach Fehlern bietet der Mathepfad Unterstützungsaufgaben. Diese Ansätze gezielt vervollständigen.
- **Dauerhafte Erfolge:** Bereits freigelegte Bildteile verschwinden nach späteren Fehlern nicht. Ein verlorener Bosskampf zieht keine Score-Punkte ab; Abbruch erhält die Ladung.
- **Mehrere Bedienwege:** Satzbau und Länderzuordnung unterstützen Antippen als Alternative zum Ziehen. Hilfedialoge haben Fokusführung und Schließmöglichkeit.
- **Privat und offline nutzbar:** Keine Rangliste, Kontopflicht oder zusätzliche Datensammlung nötig, um die hier beschriebenen Lernhürden zu verbessern.

## 10. Empfohlene Umsetzung in kleinen Paketen

### Paket 1: Vertrauen und Hilfe

F01, L01, F02 und L02 zuerst angehen: eindeutige Deutschaufgaben; Rückmeldung ohne Wegspringen; bei den wichtigsten Sachfragen echte Erklärungen; Hilfe für Gleichungen und Geometrie. Nicht sofort alle 700 Erklärungen automatisiert neu schreiben. Eine kleine fachlich geprüfte Serie mit der Klasse erproben.

**Fertig, wenn:** Ein Schüler kann eine falsche Antwort in Ruhe verstehen und danach eine ähnliche Aufgabe besser erklären. Die bekannte Mehrdeutigkeit erzeugt keine Falschwertung mehr.

### Paket 2: Tafelwerk im richtigen Moment nutzbar machen

T01–T07 und O02: passende bestehende Tafel aus der Aufgabe öffnen; Weg zurück; wenige Begriffe/Beschriftungen verbessern; die Argumentationstafel am Muster zeigen; leere Fächer ehrlich darstellen. Kompakte Standardansicht und feste schriftliche Rechnungen erhalten.

**Fertig, wenn:** Nachschlagen hilft ohne verlorenen Arbeitsstand und ohne mühsame Suche. Schüler verstehen die vorhandenen Tafeln leichter, obwohl nicht mehr Text angezeigt wird.

### Paket 3: Motivation ehrlich und fair gestalten

M01–M05, L04 und A01: Aktivität und Können trennen; tägliche Verlustlogik besprechen; Boss aus bekannten Inhalten mit Rückblick; sinnvoller Rundenabschluss; „nichts fällig“ als Erledigt-Zustand.

**Fertig, wenn:** Eine kurze sinnvolle Übeeinheit sichtbar zählt und eine Niederlage einen nächsten hilfreichen Schritt ermöglicht. Bestehende Punkte, Sicherungen und Lernerfolge bleiben erhalten.

### Paket 4: Lesen und Spielspaß gezielt erproben

O03–O05, M06 und A03: größere Lesedarstellung, korrekte zugängliche Namen, Symbole für Codeknackerfarben und echte Geräteprüfung. Erst danach über weitere Spiele, Inhalte oder zusätzliche Fortschrittsinstrumente entscheiden.

### Kleiner Schülertest statt Geschmacksabstimmung

Vorschlag: zunächst vier bis sechs Schüler mit unterschiedlichen Lern- und Leseschwierigkeiten, jeweils etwa 15–20 Minuten, möglichst auf ihren üblichen Geräten. Das liefert frühe Hinweise, aber keinen repräsentativen Wirksamkeitsnachweis. Eine Lehrkraft begleitet; ausschließlich mit Testprofilen arbeiten.

| Situation | Beobachten |
|---|---|
| Ohne Erklärung sinnvoll starten | Erkennt der Schüler Fach, Thema und Fortsetzen? Welche Zahl versteht er nicht? |
| Eine Aufgabe falsch beantworten | Kann er die Rückmeldung vollständig lesen und den Fehler danach mit eigenen Worten erklären? |
| Bei einer Bruch-/Prozentaufgabe feststecken | Findet und versteht er Hilfe oder Tafel, kommt er zur gleichen Aufgabe zurück? |
| Eine neue ähnliche Aufgabe später lösen | Überträgt er den Gedanken oder erkennt er nur den alten Antwortsatz wieder? |
| Eine Tafel auf dem Handy lesen | Sind Brüche, Überträge und Beschriftungen lesbar? Wird Scrollen wirklich durch Kürze vermieden oder nur durch winzige Darstellung? |
| Boss freiwillig spielen und auch verlieren | Empfindet er Aufgabe und Uhr als fair? Erkennt er nachher, was zu üben ist? |
| Lernkasten mit nichts Fälligem öffnen | Versteht er „fertig für heute“ statt „geht nicht“? |
| Eine Pause machen und wiederkommen | Versteht er Aktivitätswerte, ohne einen Verlust mit „ich bin schlechter geworden“ zu verwechseln? |

Spaß nicht nur als „Gefällt dir das?“ abfragen: beobachten, ob Schüler freiwillig weitermachen, nach einem Fehler wieder einsteigen und zwischen Herausforderung und Hilfe wechseln. Zusätzlich kurz besprechen, welche Darstellung sie als kindlich, angenehm oder peinlich empfinden. Keine heimliche Nutzungsanalyse nötig; direkte Beobachtung genügt für diesen ersten Durchgang.

Die Transferaufgabe und das Wiederholen gehören in **Training oder den begleiteten Test**, nicht in das Tafelwerk.

## 11. Fachlicher und didaktischer Maßstab

Diese Vorschläge sind eine Prüfung der konkreten App, keine Behauptung über einen bereits gemessenen Lerneffekt. Folgende Quellen stützen die gewählte Richtung:

- [IES/What Works Clearinghouse: Teaching Strategies for Improving Algebra Knowledge in Middle and High School Students](https://ies.ed.gov/ncee/wwc/PracticeGuide/20/WhatWeDo): behandelt unter anderem die Analyse fertig gelöster Beispiele und das Erkennen algebraischer Struktur. Die Empfehlungen haben unterschiedliche Evidenzbewertungen. Das unterstützt die Verwendung verständlicher Muster, beweist aber nicht die Wirksamkeit dieser App. Die dortigen Unterrichtsfragen sind kein Auftrag, das Tafelwerk in einen Aufgabenteil umzubauen.
- [IES: Organizing Instruction and Study to Improve Student Learning](https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/20072004.pdf): behandelt unter anderem verteiltes Wiederholen, Abrufen und den Umgang mit gelösten Beispielen. Für LernKick folgt daraus, vorhandene Wiederholungsabstände und verständliche Muster zu erhalten; nicht jede Empfehlung muss als zusätzliche App-Funktion erscheinen.
- [KMK: Bildungsstandards](https://www.kmk.org/en/bildungsministerkonferenz/bildungsthemen/bildungsstandards.html): Orientierung für Abschlussziele; Landeslehrplan und konkrete Lerngruppe bleiben gesondert abzugleichen.
- [Duden: bewerben](https://www.duden.de/rechtschreibung/bewerben): fachliche Gegenprüfung der zulässigen Präpositionen in F01.
- [IDS: Adjektiv](https://grammis.ids-mannheim.de/systematische-grammatik/276): fachlicher Bezug für differenzierte Wortartmerkmale, ohne diese gesamte Darstellung in die Schüleransicht zu übernehmen.
- [W3C: Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) und [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): konkrete Maßstäbe für Vergrößerung und lesbaren Umbruch. Keine Behauptung einer bereits vollständig geprüften WCAG-Konformität.

**Bewusst nicht vorgeschlagen:** mehr Stoff um der Vollständigkeit willen, ein kompletter optischer Neubau, neue Ranglisten, mehr Zeitdruck, Aufgaben im Tafelwerk oder eine KI, die ungeprüft ständig neue Erklärungen erzeugt. Zuerst sollen vorhandene Inhalte verlässlich richtig, verständlich und im passenden Moment hilfreich sein.
 