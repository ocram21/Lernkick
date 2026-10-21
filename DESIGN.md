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

Gehäuse: `housing`. Dunkle Anzeige: `display`. Mathematik: `number`. Deutsch, Sozialkunde, Biologie, Geographie und Wortschatz: `petrol`. Galgenraten: `red`. Deutschlandquiz und Hauptaktionen: `orange` mit dunkler Schrift. Dual N-Back: `violet`. Türkis dient als Fortschrittsakzent. Kleine weiße Beschriftung auf farbigen Tasten erhält eine aus derselben Palette abgeleitete dunklere Tastenfläche für besseren Kontrast.

**Ausdrückliche Ausnahme:** Spätere anatomische und andere Schautafeln dürfen fachlich notwendige andere Farben verwenden. Diese Ausnahme gilt für den Inhalt der Schautafeln, nicht für ihre umgebenden Bedienelemente oder die restliche App.

**The Central Palette Rule.** Standardfarben kommen aus `src/design/palette.json`/`palette.css`; die optionale Pink-Palette ausschließlich aus `src/design/pink.json`. `pink.ts` stellt daraus die `--pink-*`-Variablen bereit, `pink.css` ordnet sie den bestehenden Rollen zu. Keine lokalen Pink-Abwandlungen erfinden. Der gespeicherte Schalter `data-pink="true"` aktiviert helle Flächen, dunkle Leseschrift und den Pink-Akzent. Er färbt weder Originalbilder noch semantische Tafelzustände um.

`board-success` ist das ausdrücklich freigegebene funktionale Grün für korrekte Tafelplätze. Falsche Plätze verwenden vorhandenes Rot; beide Zustände werden zusätzlich benannt. Diese Ausnahme begründet keinen grünen LCD-Stil. Die Pink-Farben im Frontmatter entsprechen unverändert den Schlüsseln der zentralen `pink.json`.

## Typography

Barlow und Barlow Condensed, lokal mitgeliefert. Fachtasten zeigen ausschließlich **MA, D, SK, Bio, Geo** in 35–52 px, abhängig vom Viewport. Vollständige zugängliche Namen: Mathematik, Deutsch, Sozialkunde, Biologie, Geographie. Spielnamen bleiben ausgeschrieben; Deutschlandquiz darf gezielt zwischen Deutschland und quiz umbrechen.

Kleine Levelzahlen bleiben 12 px und ergänzen die großen Kürzel. Keine zusätzlichen Statistikspalten auf den Tasten. Die Punkteanzeige hat 27–38 px; die normale Leseschrift 17 px.

## Layout

Neun Tasten in einem Raster aus drei Spalten. Zentraler Inhaltsbereich bis 640 px, dunkel eingelassenes Tastenbett. Auf kleinen Smartphones kompaktere Tasten und Abstände; alle neun Tasten bleiben bei 320×568 über der Navigation sichtbar. Kurze Querformate dürfen scrollen. Die zentrale Navigation sitzt fest am nutzbaren unteren Viewportrand mit einmaligem Safe-Area-Padding. Inhalt erhält entsprechenden Platz nach unten.

Der PIN-Einstieg passt ab 320 px Breite: vier maskierte Positionen, darunter ein dreispaltiger Ziffernblock. Zifferntasten sind mindestens 58 px hoch, bei höchstens 650 px Viewporthöhe 50 px. Tafeln dürfen bis 920 px breit sein; ihre Sortierliste scrollt innerhalb von höchstens 52dvh. Unter 400 px stehen die beiden Verschiebepfeile übereinander.

Bei Texteingabe wird die untere Navigation kontrolliert verborgen. Nach Fokusverlust verhindert eine 200-ms-Frist, dass sie den gerade ausgelösten Speichern-Klick abfängt.

## Elevation & Depth

Ruhestellung: obere Lichtkante, seitliche Formung, circa 7 px optische Tiefe und weicher darunterliegender Schatten. Druck: komplette Taste um 6 px absenken, Schatten zusammenziehen und Fläche leicht abdunkeln. 100 ms hinein, 165 ms zurück. Keine Layoutverschiebung, Bewegungsreduktion respektieren. Tasten und dunkles Tastenbett verwenden ausschließlich paletteigene Licht-/Schattenmischungen.

## Shapes

Rechteckige Tastenkappen mit 9 px Radius, Tastenbett mit 15 px, vertiefte Anzeige mit 7 px. Keine Puzzleformen und keine dekorativen Bildwelten. Icons stammen aus der bestehenden Lucide-Bibliothek.

## Components

`CalculatorKey` ist die zentrale Komponente. CSS-Farbzuordnung erfolgt über `data-module`; keine abweichenden Inline-Farben. Punkte und ein globaler Lernstärkebalken stehen gemeinsam im dunklen Anzeigefeld. Kleine Levelzahl, Fortschrittsbalken und unaufdringliches Endgegner-Symbol je Taste.

Andere Aktionsbuttons folgen derselben Palette mit weniger ausgeprägter Tiefe. Dual N-Back erhält die aufgelösten Palettevariablen über die auf das eigene iframe und die eigene Origin beschränkte Nachrichtenbrücke. PWA-Symbole verwenden `number` und `orange`.

### PIN, Tafeln und Rückblick

Der PIN-Einstieg übernimmt Flächen, Rundungen und plastische Tasten der App. Ein beschriftetes Passwortfeld unterstützt Tastatureingabe; die sichtbaren vier Positionen zeigen ausschließlich Maskierungspunkte. Fokus umfasst die Eingabe mit Akzentkontur. Status und Fehler besitzen reservierten Platz, „Öffnen“ wird erst mit vier Ziffern aktiv.

Sortier-Testtafeln zeigen unveränderte Originalbilder und den sichtbaren Fachfreigabehinweis. Vergrößerung, Ziehgriff und Pfeiltasten sind gleichwertige Bedienwege. Pfeiltasten bieten mindestens 44 × 44 px, der Griff mindestens 44 × 46 px. Eine sichtbare Einfügelücke begleitet das Ziehen. „Check“ markiert richtige und falsche Plätze mit Farbe und Text, ohne die Lösung einzusetzen; weitere Bearbeitung entfernt alte Markierungen.

Pause/Fortsetzen und Rückblick bleiben in der bestehenden Aufgabenstruktur. Der Rückblick trennt eigene Antwort, richtige Lösung und Erklärung ohne neue Bewertung. Bei Fachfragen und Wort-Multiple-Choice stehen richtiges wie falsches Feedback zwei Sekunden; Pause hält den Wechsel an, Fortsetzen startet wieder volle zwei Sekunden. Fehlerhafte Satzbau-Entwürfe bleiben bearbeitbar; laufende Zuordnungs-/Buchstabenspiele und N-Back behalten ihre modulspezifische Pause. „Ausgang“ verlässt unmittelbar und erhält den Stand.

Der Wortschatz-Auswahlcontainer bündelt die Schalter mit 15 px Rundung und 22 px seitlichem Innenabstand. Kleine Bundesländer erhalten Verbindungslinien im aktuellen Akzent mit 2,5 px Strichbreite.

## Do's and Don'ts

- Die gespeicherte Nutzervorlage und `palette.json` sind die Farbreferenz für spätere Änderungen.
- Farben nicht je Komponente neu erfinden; gemeinsame Variablen verwenden.
- Vollständige zugängliche Fachnamen und deutlich erkennbare Fokuszustände erhalten.
- Außer der ausdrücklich freigegebenen Pink-Option keine zusätzlichen Oberflächenpaletten einführen; der Standard behält seinen dunklen LCD-Stil.
- Originalbilder unverändert lassen und Tafel-Feedback mit Farbe und Text kennzeichnen.
- Lernstand, Punkte und Speicherformat werden durch Designänderungen nicht verändert.

## Ergänzung vom 20.10.2026

Auf ausdrücklichen Nutzerauftrag sind korrekt belegte Hauptstadtfelder weiß (`#fff`) mit dunkler Schrift. Offene Felder verwenden Orange. Diese eng begrenzte Ausnahme gilt nur für die Hauptstadtzuordnung. Zitierte Deutsch-Beispiele verwenden den vorhandenen Orange-Akzent. QWERTZ-Reihen und die sichtbare Beschriftung „Ausgang“ übernehmen die bestehenden Tastenformen.
