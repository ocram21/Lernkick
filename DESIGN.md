---
name: LernKick
description: Plastischer Retro-Taschenrechner nach verbindlicher Nutzervorlage
colors:
  housing: "#494b57"
  display: "#2b2d39"
  number: "#2a303c"
  petrol: "#00789a"
  teal: "#12a49a"
  red: "#ce4454"
  orange: "#e79e35"
  violet: "#86509b"
  ink: "#ecedf1"
  board-success: "#237647"
  pink-ground: "#fff4f8"
  pink-panel: "#fffafd"
  pink-ink: "#3f2433"
  pink-muted: "#6b4154"
  pink-accent: "#ae165c"
  pink-line: "#ba809b"
  pink-lcd: "#ffe1ee"
  pink-recess: "#ecd0de"
  pink-white: "#ffffff"
typography:
  body:
    fontFamily: "Barlow, sans-serif"
    fontSize: "17px"
    lineHeight: 1.55
  subject-key:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(35px, 9vw, 49px)"
    fontWeight: 700
    lineHeight: 1
  game-key:
    fontFamily: "Barlow, sans-serif"
    fontSize: "clamp(14px, 3.6vw, 19px)"
    fontWeight: 700
rounded:
  key: "9px"
  housing: "15px"
  display: "7px"
spacing:
  mobile-gutter: "16px"
  key-row-gap: "20px"
  key-column-gap: "14px"
components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.number}"
    rounded: "{rounded.key}"
    padding: "14px 22px"
  calculator-key:
    textColor: "{colors.ink}"
    rounded: "{rounded.key}"
    padding: "13px 12px 12px"
---

# Design System: LernKick

## Overview

Verbindliche Nutzervorgabe vom 19.10.2026: die Farben des Taschenrechner-Referenzfotos verwenden und dieses Design konsistent fortführen. Die ausdrücklich freigegebenen Erweiterungen vom 21.10.2026 ergänzen optionales Pink und funktionales Tafel-Grün; sie ersetzen die Taschenrechner-Welt nicht. Kräftige, plastische rechteckige Tasten, große Fachkürzel und eine eingelassene dunkle Anzeige. Der Nutzer hat den vorherigen Pastell-Entwurf und die grüne LCD-Fläche ersetzt.

Das Original liegt unter `docs/design/calculator-reference.jpeg`. Die aus ruhigen Bildflächen abgenommenen Farben stehen in `src/design/palette.json`; JPEG-Kompression verursacht kleine lokale Abweichungen. `src/design/palette.css` stellt die verbindlichen Variablen bereit und wird nach den allgemeinen Styles geladen.

## Colors

- `housing`: **#494b57**.
- `display`: **#2b2d39**.
- `number`: **#2a303c**.
- `petrol`: **#00789a**.
- `teal`: **#12a49a**.
- `red`: **#ce4454**.
- `orange`: **#e79e35**.
- `violet`: **#86509b**.
- `ink`: **#ecedf1**.

Die Standardansicht erhält ihre Grundfarben und ihren dunklen LCD-Hintergrund. Die ausdrücklich freigegebene Option „Mit Pink“ ist die einzige zusätzliche Oberflächenpalette. Lichtkanten, Schatten und Zwischenflächen werden ausschließlich aus diesen Grundfarben gemischt; sie sind keine zusätzlichen Farbfamilien. Auf Weiß oder Schwarz als neue Grundfarbe verzichten: hellster Ton ist `ink`, dunkelste Töne sind `display`/`number`.

Gehäuse: `housing`. Dunkle Anzeige: `display`. Mathematik: `number`. Deutsch, Sozialkunde, Biologie, Geographie und Wortschatz: `petrol`. Galgenraten: `red`. Deutschlandquiz und Hauptaktionen: `orange` mit dunkler Schrift. Dual N-Back: `violet`. Der globale Lernstärkebalken verwendet den aktuellen Orange-/Pink-Akzent; Prozenttext und Füllung bilden denselben Wert ohne künstliche Mindestfüllung ab. Die WebKit- und Gecko-Füllregeln stehen getrennt, damit unbekannte Pseudoelemente die jeweils andere Regel nicht verwerfen. Kleine weiße Beschriftung auf farbigen Tasten erhält eine aus derselben Palette abgeleitete dunklere Tastenfläche für besseren Kontrast.

**Ausdrückliche Ausnahme:** Spätere anatomische und andere Schautafeln dürfen fachlich notwendige andere Farben verwenden. Diese Ausnahme gilt für den Inhalt der Schautafeln, nicht für ihre umgebenden Bedienelemente oder die restliche App.

**The Central Palette Rule.** Standardfarben kommen aus `src/design/palette.json`/`palette.css`; die optionale Pink-Palette ausschließlich aus `src/design/pink.json`. `pink.ts` stellt daraus die `--pink-*`-Variablen bereit, `pink.css` ordnet sie den bestehenden Rollen zu. Keine lokalen Pink-Abwandlungen erfinden. Der gespeicherte Schalter `data-pink="true"` aktiviert helle Flächen, dunkle Leseschrift und den Pink-Akzent. Er färbt weder Originalbilder noch semantische Tafelzustände um.

`board-success` ist das ausdrücklich freigegebene funktionale Grün für korrekte Tafelplätze. Falsche Plätze verwenden vorhandenes Rot; beide Zustände werden zusätzlich benannt. Diese Ausnahme begründet keinen grünen LCD-Stil. Die Pink-Farben im Frontmatter entsprechen unverändert den Schlüsseln der zentralen `pink.json`.

## Typography

Barlow und Barlow Condensed, lokal mitgeliefert. Fachtasten zeigen ausschließlich **MA, D, SK, Bio, Geo** in 35–52 px, abhängig vom Viewport. Vollständige zugängliche Namen: Mathematik, Deutsch, Sozialkunde, Biologie, Geographie. Spielnamen bleiben ausgeschrieben; Deutschlandquiz darf gezielt zwischen Deutschland und quiz umbrechen.

Kleine Levelzahlen bleiben 12 px und ergänzen die großen Kürzel. Keine zusätzlichen Statistikspalten auf den Tasten. Die Punkteanzeige hat 27–38 px; die normale Leseschrift 17 px.

## Layout

Neun Tasten in einem Raster aus drei Spalten. Zentraler Inhaltsbereich bis 640 px, dunkel eingelassenes Tastenbett. Auf kleinen Smartphones kompaktere Tasten und Abstände; alle neun Tasten bleiben bei 320×568 über der Navigation sichtbar. Kurze Querformate dürfen scrollen. Die zentrale Navigation sitzt fest am nutzbaren unteren Viewportrand mit einmaligem Safe-Area-Padding. Inhalt erhält entsprechenden Platz nach unten.

Die Hauptnavigation lautet **Training | Lernkasten | Einstellungen**. Tafeln sind archiviert; ihre nachstehenden Regeln bleiben als Archivdokumentation erhalten. Der Lernkasten nutzt die volle nutzbare Viewporthöhe: Kopf und fünf direkte Fachwahlen bleiben oben, nur die Auswahl-/Kartenfläche scrollt, die Navigation bleibt unten im Flexlayout. Quellen und Unterrubriken sind bei laufenden Karten über „Auswahl ändern“ ausklappbar. Mathematik verwendet drei Stufentasten nebeneinander und ein zweispaltiges Raster aus acht Kategorien mit Mehrfachwahl und „Alle“. „Kleines Einmaleins“ ist über `aria-describedby` den „Grundrechenarten“ zugeordnet; „Gleichungen“ nutzt dieselbe Auswahl und dieselben drei Stufen. Die Hauptstadtrunde ordnet 16 Länder in zwei Spalten zu je acht Zeilen; jede Antwortfläche bleibt mindestens 44 px hoch.

Der PIN-Einstieg passt ab 320 px Breite: vier maskierte Positionen, darunter ein dreispaltiger Ziffernblock. Zifferntasten sind mindestens 58 px hoch, bei höchstens 650 px Viewporthöhe 50 px. Die Tafelauswahl darf bis 920 px breit sein. Eine aktive Tafel nutzt die volle Bildschirmhöhe und verfügbare Inhaltsbreite; Kopfzeile und untere Hauptnavigation sind dabei ausgeblendet. Links liegt das Bild, rechts eine eigenständig scrollbar bedienbare Begriffsliste. Die rechte Spalte belegt 32 %, mindestens 140 px; unter 400 px bleibt sie 140 px breit. Beide Arbeitsbereiche erhalten die verbleibende Höhe; die Verschiebepfeile stehen auch auf schmalen Displays nebeneinander.

Bei Texteingabe wird die untere Navigation kontrolliert verborgen. Nach Fokusverlust verhindert eine 200-ms-Frist, dass sie den gerade ausgelösten Speichern-Klick abfängt.

## Elevation & Depth

Ruhestellung: obere Lichtkante, seitliche Formung, circa 7 px optische Tiefe und weicher darunterliegender Schatten. Druck: komplette Taste um 6 px absenken, Schatten zusammenziehen und Fläche leicht abdunkeln. 100 ms hinein, 165 ms zurück. Keine Layoutverschiebung, Bewegungsreduktion respektieren. Tasten und dunkles Tastenbett verwenden ausschließlich paletteigene Licht-/Schattenmischungen.

## Shapes

Rechteckige Tastenkappen mit 9 px Radius, Tastenbett mit 15 px, vertiefte Anzeige mit 7 px. Keine Puzzleformen und keine dekorativen Bildwelten. Icons stammen aus der bestehenden Lucide-Bibliothek.

## Components

`CalculatorKey` ist die zentrale Komponente. CSS-Farbzuordnung erfolgt über `data-module`; keine abweichenden Inline-Farben. Punkte und ein sichtbar akzentgefüllter globaler Lernstärkebalken stehen gemeinsam im dunklen Anzeigefeld. Kleine Levelzahl, Fortschrittsbalken und unaufdringliches Endgegner-Symbol je Taste.

Andere Aktionsbuttons folgen derselben Palette mit weniger ausgeprägter Tiefe. Dual N-Back erhält die aufgelösten Palettevariablen über die auf das eigene iframe und die eigene Origin beschränkte Nachrichtenbrücke. PWA-Symbole verwenden `number` und `orange`.

### PIN, Tafeln und Rückblick

Der PIN-Einstieg übernimmt Flächen, Rundungen und plastische Tasten der App. Ein beschriftetes Passwortfeld unterstützt Tastatureingabe; die sichtbaren vier Positionen zeigen ausschließlich Maskierungspunkte. Fokus umfasst die Eingabe mit Akzentkontur. Status und Fehler besitzen reservierten Platz, „Öffnen“ wird erst mit vier Ziffern aktiv.

Zuordnungs-Testtafeln zeigen unveränderte Originalbilder und den sichtbaren Fachfreigabehinweis. Begriffe werden vom Griff direkt auf zusätzliche Bildnummern gezogen; alternativ Begriff und Nummer antippen. Die beiden Listenplätze tauschen dabei verlustfrei. Pfeiltasten bleiben als Sortieralternative erhalten. Bildnummern, Griff und Pfeiltasten bieten mindestens 44 × 44 px. Die Begriffsliste scrollt unabhängig per Touch; ein Finger verschiebt das Bild, zwei Finger zoomen. Verkleinern, Vergrößern und Zurücksetzen bleiben als eigene Buttons verfügbar. Ein Querformat-Hinweis erläutert den zusätzlichen Platz. „Check“ markiert richtige und falsche Plätze mit Farbe und Text, ohne die Lösung einzusetzen; weitere Bearbeitung entfernt alte Markierungen.

Pause/Fortsetzen und Rückblick bleiben in der bestehenden Aufgabenstruktur. Der Rückblick trennt eigene Antwort, richtige Lösung und Erklärung ohne neue Bewertung. Bei Fachfragen sowie Begriffe- und Grammatik-Multiple-Choice stehen richtiges wie falsches Feedback zwei Sekunden; Pause hält den Wechsel an, Fortsetzen startet wieder volle zwei Sekunden. Fehlerhafte Satzbau-Entwürfe bleiben bearbeitbar; laufende Zuordnungs-/Buchstabenspiele und N-Back behalten ihre modulspezifische Pause. „Übung beenden“ steht bei pausierten Fachrunden, Wortschatz, Galgenraten und Deutschlandquiz als Nebenaktion mit mindestens 44 px Höhe bereit; im Rundenkopf belegt es eine eigene Zeile. In der Wortschatz-Auswahl und im Lernkasten ist die Aktion auch für eine noch offene Runde erreichbar. Sie verwirft die offene Übung, ohne eine neue Gestaltungswelt einzuführen. „Ausgang“ verlässt unmittelbar und erhält gespeicherte Lernstände einschließlich einer fortsetzbaren offenen Übung. Bei Dual N-Back endet die temporäre Zeitfolge einschließlich Audio; das nächste Öffnen zeigt den Startbildschirm. Dauerhafte N-Stufen, Erfolge und Punkte bleiben erhalten.

Der gemeinsame „Ausgang“-Button steht als erste Aktion links oben: mindestens 44 px hoch, 94 px breit, mit 9 px Radius, 9 × 12 px Innenabstand, Barlow in 15 px/600 und bestehendem Pfeil-Icon. Die Startseite benötigt keinen Ausgang aus der App. Mathematik trennt Stufen- und Kategorieüberschriften von den profilierten Auswahlknöpfen.

Der Wortschatz-Auswahlcontainer bündelt „Begriffe“, „Satzbau“, „Grammatik“ und „Sprichwörter“ mit 15 px Rundung und 22 px seitlichem Innenabstand. Die Schwierigkeit bleibt „Normal“/„Streber“. Grammatik übernimmt die vorhandene Aufgaben-, Antwort-, Feedback-, Pause- und Rückblickdarstellung; eine Runde enthält zehn Aufgaben. Kleine Bundesländer erhalten Verbindungslinien im aktuellen Akzent mit 2,5 px Strichbreite.

### Gleichungsumformungen

Gleichungen führen die bestehende Aufgabenfläche weiter. Ausgangsgleichung und folgende Umformungszeilen verwenden tabellarische Ziffern, umbrechbaren Text und eine kompakte Größe von 20–28 px bei Zeilenhöhe 1,5. Die verwendete Operation steht hinter „|“. Darunter stehen die Beschriftung „Operation“, ein einziges frei beschreibbares Eingabefeld und „Prüfen“ in einer Zeile mit 10 px Abstand. Feld und Prüfaktion sind mindestens 48 px hoch; das Feld verwendet 18 px Schrift und 10 px Innenabstand. Bestehende Flächen-, Akzent- und Fokusregeln gelten weiter. Eingaben bleiben während der Prüfung gesperrt; Fehlermeldungen erscheinen unter der Eingabe als zugänglicher Alarm. Die Umformungsfolge wird höflich angekündigt. Diese Regeln beschreiben die Gleichungseingabe und erweitern keine anderen Felder.

### Lernkasten und kompakte Auswahl

Profilierte Auswahlknöpfe führen die vorhandene Tastenkappe kompakt weiter: 9 px Radius, mindestens 44 px Höhe, 9 × 12 px Innenabstand und Barlow (15 px/600). Eine innere Lichtkante und 3 px Sockeltiefe formen die Ruhelage; Druck senkt sie um 2 px ab. Auswahl verwendet den bestehenden Akzent mit dunkler Aktionsschrift und `aria-pressed`. Rubriken dürfen umbrechen. Neue Tastenfarben entstehen dabei nicht.

Die Lernkarte ist eine ruhige Fläche mit 12 px Radius, 18 px Innenabstand und vorhandener Konturlinie. Metadaten (12 px), Frage (27 px) und Antwort (18 px, Zeilenhöhe 1,45) bilden die Hierarchie. „Antwort zeigen“ und „Karten lernen“ sind breite Hauptaktionen; „Nicht gewusst“ und „Gewusst“ stehen nach Aufdecken in zwei gleich breiten Spalten mit mindestens 52 px Höhe; auf schmalen Ansichten werden sie untereinander mit mindestens 48 px Höhe angezeigt. Fach, Unterrubriken und voreingestellte/eigene Quellen verwenden vorhandene Daten und dieselben Auswahlzustände.

„Karten hinzufügen“ steht unmittelbar bei den Quellen als profilierte Aktion: bei ausreichender Breite rechts, bei schmalen Ansichten darunter; unter 400 px füllt der Button die Zeile. Ohne aktive Unterrubrik ist er deaktiviert. Die sichtbaren Rubrikwahlen enthalten kein „Allgemein“. Einstellungen bieten vorhandene Karten zum Bearbeiten und Löschen; die Erstellung gehört in den Lernkasten.

Das native modale Eingabefenster übernimmt das gewählte Fach und beschränkt die Unterrubrikwahl auf die aktive Auswahl. Eine einzelne Unterrubrik ist vorausgewählt; bei mehreren wird ausdrücklich gewählt. Es verwendet bestehende Panel-, Schrift- und Konturfarben, 12 px Radius, 22 px Innenabstand (unter 400 px: 16 px), maximal 540 px Breite und maximal die Viewporthöhe abzüglich 24 px; längerer Inhalt scrollt im Fenster. Der Hintergrund ist eine transparente Mischung aus der vorhandenen dunklen Displayfarbe. Das Formular hat 12 px Abstand, beschriftete Felder mit 6 px Abstand und vertikal vergrößerbare Textflächen mit mindestens 85 px Höhe. Aktionen sind mindestens 48 px hoch; unter 400 px stehen sie in voller Breite untereinander.

Nach erfolgreichem „Karte speichern“ bleibt das Fenster offen, leert Frage und Antwort, erhält die Unterrubrik und fokussiert die Frage für die nächste Karte. Eine Statusmeldung bestätigt das Speichern. Fehler erhalten die Eingaben; während des Speicherns sind Eingabe und Abschluss gesperrt. „Fertig“ oder Escape schließen außerhalb des Speicherns und geben den Fokus an den Auslöser zurück. Diese Regeln beschreiben die Kartenerstellung, keine neue allgemeine Dialogwelt.

Die Lernstärke zeigt denselben Prozentwert in Text und Balken. Im Hauptmenü entfällt der Zusatz „100 % = 5 Stunden aktive Lernzeit“; die Hilfe erklärt das Tagesziel von 30 aktiven Minuten, sieben erfüllte Ziele von 0 auf 100 % und 10 % relativen Abzug bei verfehlten Tagen. Der Lernkasten zählt aktive Lernzeit ohne Leistungspunkte.

Die Bildschirmtastatur bleibt QWERTZ mit eingerückter zweiter (3 %) und letzter Reihe (9 %), 6 px Tastenradius und 2 px Sockeltiefe. Dual N-Back bietet 1-/2-/3-Back nebeneinander; freigeschaltetes 4-Back erhält eine zusätzliche volle Zeile. Der aktive Rasterreiz trägt einen sichtbaren runden Mittelpunkt aus der vorhandenen Palette.

## Do's and Don'ts

- Die gespeicherte Nutzervorlage und `palette.json` sind die Farbreferenz für spätere Änderungen.
- Farben nicht je Komponente neu erfinden; gemeinsame Variablen verwenden.
- Vollständige zugängliche Fachnamen und deutlich erkennbare Fokuszustände erhalten.
- Außer der ausdrücklich freigegebenen Pink-Option keine zusätzlichen Oberflächenpaletten einführen; der Standard behält seinen dunklen LCD-Stil.
- Originalbilder unverändert lassen und Tafel-Feedback mit Farbe und Text kennzeichnen.
- Lernstand, Punkte und Speicherformat werden durch Designänderungen nicht verändert.

## Ergänzung vom 20.10.2026

Auf ausdrücklichen Nutzerauftrag sind korrekt belegte Hauptstadtfelder weiß (`#fff`) mit dunkler Schrift. Offene Felder verwenden Orange. Diese eng begrenzte Ausnahme gilt nur für die Hauptstadtzuordnung. Zitierte Deutsch-Beispiele verwenden den vorhandenen Orange-Akzent. QWERTZ-Reihen und die sichtbare Beschriftung „Ausgang“ übernehmen die bestehenden Tastenformen.

## Menütaste Dual N-Back, 21.10.2026

Nur N1, N2 und N3 als kleine Stufenmarkierungen. Gemeisterte Stufen erhalten die bestehende ausgefüllte, kontrastreiche Darstellung. Keine aktuelle Stufe und keine Bestleistungszeile auf der Taste; gespeicherte Trainingsdaten bleiben erhalten.

## Globaler Modus und mobile Geometrie, 22.10.2026

Ein zentraler Normal-/Streber-Schalter steht direkt unter „Dein Lern-Kick“; Untermenüs haben keine weiteren Niveauschalter. Ausgang verwendet appweit das vorhandene Türkis mit heller Schrift; „Zu den Kategorien“ verwendet Orange mit dunkler Schrift. Beschriftungen ergänzen die Farborientierung. Mathe bietet zehn auswählbare Kategorien bei unverändert drei Stufen. Geometrie verwendet proportional skalierte SVG-Rechtecke bzw. rechtwinklige Dreiecke mit sichtbaren Seitenlängen, kompakte Antworttasten und zwei Navigationszeilen. Aufgaben, Figur, Erklärung und nächste Aktion sind auf 320×568 in allen drei Stufen ohne Scrollen erreichbar. Der kleine Hauptbildschirm verdichtet Abstände, damit der globale Schalter und alle neun Menütasten sichtbar bleiben. Bestehende Palette, Schrift und Tastentiefe bleiben maßgeblich.

Menükorrektur 22.10.2026: „Dein Lern-Kick“ entfällt. Der globale Normal-/Streber-Schalter steht links an der bisherigen Überschriftenposition, Hilfe bleibt rechts in derselben Zeile. Dadurch entfällt eine Zeile; das Hauptmenü bleibt ohne Seiten-Scrollen bedienbar. Geprüft bei 320×568, 375×667, 390×844 und 1440×900.

## Maßgebliche UX-Vereinfachung, 23.10.2026

Zentrale Funktionsfarben in `src/design/actions.css`: Hauptaktion Orange/Pink, Bestätigung/Zurück Petrol, Auswahl Violett, Ausgang Türkis, Abbruch und Warnung Rot, neutral bestehende Fläche. Palettenmischungen sichern Textkontrast. Diese Rollen gelten in beiden Farbmodi und ersetzen frühere abweichende Buttonfarben. Mathematik hat nur den globalen Normal-/Streber-Modus; Kategorien bleiben separat. Aktive Lernkarten zeigen die komplette Auswahl erst auf „Auswahl ändern“, ohne Kartenverlust. „Kompakte Ansicht“ ist eine freiwillige, gespeicherte Dichtewahl mit skalierbarer Schrift und scrollbaren Inhaltsbereichen. Details und Testgrenzen: docs/UX-VEREINFACHUNG-2026-10-23.md.

## Maßgebliche Anpassung vom 23.10.2026

Im Lernkasten stehen fünf kompakte Hauptmenü-Tastenkappen in einer Reihe: MA, D, SK, Bio, Geo mit vollständigen zugänglichen Fachnamen, mindestens 44 px Breite und 52 px Höhe. Die Reihe ist höchstens 420 px breit und nutzt vorhandene Farben und Tiefen; aktive Auswahl hat zusätzlich eine sichtbare Kontur. Unterrubriken bleiben unverändert. Quellen-Schalter entfallen; „Karten hinzufügen“ bleibt direkt unter den Rubriken. Das Formular verwendet die bestehenden Dialogregeln mit den Aktionen „Speichern“ und „Abbrechen“; Escape verhält sich wie Abbrechen und warnt bei ungespeichertem Text.

Wortschatz ergänzt Rechtschreibung als fünften Bereich im bestehenden Auswahlcontainer. Lange Rubriknamen erhalten auf schmalen Displays 18–23 px Schrift, während Abstände und Schalter-Touchflächen erhalten bleiben. Keine Änderung der Pink-Palette oder anderer Gestaltungsbereiche.

## Kompakte Einstellungen, 23.10.2026

Die Einstellungsseite benötigt keine große Seitenüberschrift. Ausgang und Hilfe stehen in einer gemeinsamen Zeile mit mindestens 44 px hohen Aktionen. Direkt darunter stehen Datensicherung, der unveränderte Speicherhinweis, Darstellung, die Warnaktion „Daten löschen“, Installationshinweise und die einklappbaren Lehrplanquellen. „Kompakt“ und „Mit Pink“ stehen mit ihren Schaltern nebeneinander; bei geringer Breite oder großer Schrift umbrechen sie. Der zusätzliche Erklärungstext zur kompakten Ansicht entfällt.

Die vorhandenen Farben bleiben erhalten; die Warnaktion ist rot und nicht unterstrichen. Überschriften und Text sind rem-basiert, Schalter mindestens 44×44 px. Der Rahmen füllt die dynamische Viewporthöhe, berücksichtigt Safe Areas und hält Header und Navigation außerhalb des bei Bedarf scrollbaren Inhaltsbereichs. Auf 375×812, 360×800 und 390×744 passt die eingeklappte Seite ohne Scrollen; auf 320×568, bei großer Schrift oder geöffneten Informationen bleibt Inhalt scrollbar. Die Datenlöschaktion behält ihre bisherige Bestätigung und ihren bisherigen Umfang.

## Fachfarben, Lernstart und N-Back, 23.10.2026

Auf ausdrücklichen Nutzerwunsch verwendet Mathe dieselbe bestehende Petrol-/Türkis-Tastenkappe wie die übrigen Standard-Fachtasten; Wortschatz übernimmt die dunkle Tastenkappe. Im Lernkasten sind alle ungewählten Fachtasten türkis und die aktive Taste violett, mit horizontal und vertikal mittiger Beschriftung. Die äußere Pseudofläche der kompakten Fachbuttons entfällt, damit Hover und Fokus die aktive Farbe nicht verdecken. Unterrubriken bleiben unverändert. Diese konkret benannten Farben gelten auch bei aktivem Pink; andere Pink-Regeln bleiben erhalten.

Unter den Unterrubriken stehen mit 22 px Abstand zwei Aktionen in einem höchstens 500 px breiten 1:2-Raster mit 18 px Zwischenraum: links der kleinere türkise Plus-Button „Karten hinzufügen“, rechts ein großer quadratischer Button im bestehenden Gelb/Orange. „Lernen beginnen“ und darunter die aktuelle Rundengröße ersetzen die getrennte Mengenzeile. Bei leerer Auswahl bleibt die bestehende Statushilfe erhalten. Aktive Runden, Kartenauswahl, Fälligkeiten und Speicherung bleiben unverändert.

Die bestehende gemeinsame Kopfzeile verwendet für Training, Lernkasten und Einstellungen dieselbe Höhe (56 px) und Logo-Geometrie: 30 px Schrift, mobil 27 px, 27 px Blitz und identische Abstände. Safe Areas werden für diese Bereiche gleich berücksichtigt.

Dual N-Back zeigt keinen Mittelpunkt mehr auf dem aktiven Feld. Antworttasten erhalten nach Eingabe einen gelben 200-ms-Rand, der bei neuer Aufgabe, Pause oder Verlassen entfernt wird. Tastaturfokus verwendet davon unabhängig die Textfarbe und bleibt sichtbar. Spielfeldfarbe und Spielablauf bleiben erhalten.

## Kompakter Lernkasten – nachfolgende Korrektur, 23.10.2026

Die Starttaste „Lernen beginnen“ bleibt quadratisch, ist aber höchstens 168 px breit; das Aktionspaar ist höchstens 326 px breit und nutzt das Verhältnis 1:1,2 mit 18 px Abstand. Die untergeordnete Kartenanzahl entfällt auf ausdrücklichen Nutzerwunsch. Notwendige Meldungen zu leerer Auswahl und abgeschlossenen Runden stehen vor dem Aktionsbereich. Ausgewählte Unterrubriken verwenden die bestehende violette Fläche mit beständigem weißem Rand aus dem vorhandenen Schriftfarbtoken. Tastaturfokus ist separat als gestrichelte äußere Kontur erkennbar; Fokus verändert weder Auswahl noch Hintergrundfarbe. Andere Ansichten, Kartenfilterung, Fälligkeit, Fortschritt und gespeicherte Runden bleiben unverändert.

Validiert: Produktionsbuild und 43 gezielte Browserfälle erfolgreich, einschließlich 320/390/1440 px, Auswahlwechsel per Touch/Tastatur, Karten hinzufügen, unveränderter Rundengröße, Auswahl schließen, Offline-Fortsetzung und Erhalt eigener Karten/Leitner-Stände.
