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

Verbindliche Nutzervorgabe vom 19.10.2026: ausschließlich die Farben des Taschenrechner-Referenzfotos verwenden und dieses Design konsistent fortführen. Kräftige, plastische rechteckige Tasten, große Fachkürzel und eine eingelassene dunkle Anzeige. Der Nutzer hat den vorherigen Pastell-Entwurf und die grüne LCD-Fläche ersetzt.

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

Keine weiteren Grundfarben, keine Pastellpalette und kein grüner LCD-Hintergrund. Lichtkanten, Schatten und Zwischenflächen werden ausschließlich aus diesen Grundfarben gemischt; sie sind keine zusätzlichen Farbfamilien. Auf Weiß oder Schwarz als neue Grundfarbe verzichten: hellster Ton ist `ink`, dunkelste Töne sind `display`/`number`.

Gehäuse: `housing`. Dunkle Anzeige: `display`. Mathematik: `number`. Deutsch, Sozialkunde, Biologie, Geographie und Wortschatz: `petrol`. Galgenraten: `red`. Deutschlandquiz und Hauptaktionen: `orange` mit dunkler Schrift. Dual N-Back: `violet`. Türkis dient als Fortschrittsakzent. Kleine weiße Beschriftung auf farbigen Tasten erhält eine aus derselben Palette abgeleitete dunklere Tastenfläche für besseren Kontrast.

**Ausdrückliche Ausnahme:** Spätere anatomische und andere Schautafeln dürfen fachlich notwendige andere Farben verwenden. Diese Ausnahme gilt für den Inhalt der Schautafeln, nicht für ihre umgebenden Bedienelemente oder die restliche App.

## Typography

Barlow und Barlow Condensed, lokal mitgeliefert. Fachtasten zeigen ausschließlich **MA, D, SK, Bio, Geo** in 35–52 px, abhängig vom Viewport. Vollständige zugängliche Namen: Mathematik, Deutsch, Sozialkunde, Biologie, Geographie. Spielnamen bleiben ausgeschrieben; Deutschlandquiz darf gezielt zwischen Deutschland und quiz umbrechen.

Kleine Levelzahlen bleiben 12 px und ergänzen die großen Kürzel. Keine zusätzlichen Statistikspalten auf den Tasten. Die Punkteanzeige hat 27–38 px; die normale Leseschrift 17 px.

## Layout

Neun Tasten in einem Raster aus drei Spalten. Zentraler Inhaltsbereich bis 640 px, dunkel eingelassenes Tastenbett. Auf kleinen Smartphones kompaktere Tasten und Abstände; alle neun Tasten bleiben bei 320×568 über der Navigation sichtbar. Kurze Querformate dürfen scrollen. Die zentrale Navigation sitzt fest am nutzbaren unteren Viewportrand mit einmaligem Safe-Area-Padding. Inhalt erhält entsprechenden Platz nach unten.

Bei Texteingabe wird die untere Navigation kontrolliert verborgen. Nach Fokusverlust verhindert eine 200-ms-Frist, dass sie den gerade ausgelösten Speichern-Klick abfängt.

## Elevation & Depth

Ruhestellung: obere Lichtkante, seitliche Formung, circa 7 px optische Tiefe und weicher darunterliegender Schatten. Druck: komplette Taste um 6 px absenken, Schatten zusammenziehen und Fläche leicht abdunkeln. 100 ms hinein, 165 ms zurück. Keine Layoutverschiebung, Bewegungsreduktion respektieren. Tasten und dunkles Tastenbett verwenden ausschließlich paletteigene Licht-/Schattenmischungen.

## Shapes

Rechteckige Tastenkappen mit 9 px Radius, Tastenbett mit 15 px, vertiefte Anzeige mit 7 px. Keine Puzzleformen und keine dekorativen Bildwelten. Icons stammen aus der bestehenden Lucide-Bibliothek.

## Components

`CalculatorKey` ist die zentrale Komponente. CSS-Farbzuordnung erfolgt über `data-module`; keine abweichenden Inline-Farben. Punkte und ein globaler Lernstärkebalken stehen gemeinsam im dunklen Anzeigefeld. Kleine Levelzahl, Fortschrittsbalken und unaufdringliches Endgegner-Symbol je Taste.

Andere Aktionsbuttons folgen derselben Palette mit weniger ausgeprägter Tiefe. Dual N-Back erhält die aufgelösten Palettevariablen über die auf das eigene iframe und die eigene Origin beschränkte Nachrichtenbrücke. PWA-Symbole verwenden `number` und `orange`.

## Do's and Don'ts

- Die gespeicherte Nutzervorlage und `palette.json` sind die Farbreferenz für spätere Änderungen.
- Farben nicht je Komponente neu erfinden; gemeinsame Variablen verwenden.
- Vollständige zugängliche Fachnamen und deutlich erkennbare Fokuszustände erhalten.
- Keine Pastellfarben, keinen grünen LCD-Stil und keine zusätzlichen Themes einführen.
- Lernstand, Punkte und Speicherformat werden durch Designänderungen nicht verändert.
