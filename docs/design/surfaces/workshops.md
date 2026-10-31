# Lernwerkstätten · Erweiterung vom 31.10.2026

Modus: Operate. Bestehende Taschenrechner-Gestaltung und optionale Pink-Ansicht erweitern, keine neue visuelle Identität.

## Direction contract

THESIS: Schülerinnen und Schüler bearbeiten die wesentlichen Rechenschritte selbst und sehen Bruchteile direkt. Keine Endergebnis-Abfrage als Ersatz des Verfahrens.

OWN-WORLD: Vorhandene Barlow-Schriften, Taschenrechnerpalette, profiled-button/primary/ExitButton, Schiefer- und Pink-Hintergrund. Klar ausgerichtete Ziffern und gleich große Vergleichsfiguren sind die funktionale Gestaltung.

STORY: Hauptmenü → Bruchwerkstatt: zwei Brüche einstellen, Teile auswählen, Darstellung wechseln, erweitern/kürzen. Mathe → drei schriftliche Verfahren: Schritte eingeben, prüfen, selbst korrigieren, nächste Aufgabe. Games → viertes Spiel Galgenraten; Bestand bleibt erhalten.

FIRST VIEWPORT: Klare Überschrift und Ausgang; unmittelbarer Zugriff auf die Bruchbilder bzw. die aktuelle Rechnung. Auf schmalen Displays bleiben die Vergleichsganzen gleich groß und stehen nebeneinander. Schriftliche Zwischenzeilen dürfen innerhalb der Werkstatt vertikal scrollen; die Stellen bleiben ausgerichtet.

SIGNATURE: Bild und Bruchschreibweise ändern sich synchron. Bei schriftlichen Verfahren wird nur die Eingabe geprüft, kein Lösungsweg automatisch ausgefüllt. Spielzeit erscheint ausschließlich nach Erfolg im bestehenden Statusbereich.

QUALITY BAR: Korrekte gleich große Segmente, kein Nenner null, nur ganzzahliges Kürzen, korrigierbare Eingaben an jeder erforderlichen Stelle, eindeutige Aufgaben je Durchgang; kein horizontaler Seitenüberlauf. Vorhandene Daten, Runden und Funktionen bleiben erhalten.

## Umgesetzte Erweiterung und Review

Die Implementierung übernimmt die vorhandene Palette, Barlow-Schriften sowie profilierte Tasten, Primäraktion und Ausgang. Bruchsegmente verwenden Gehäusefarbe, Rot für markierte Teile und Petrol für den Fokus. Beide Vergleichsganzen bleiben gleich groß und nebeneinander; Eingaben und Rechenzeilen verwenden stellenrichtig ausgerichtete Ziffern. Spielzeit ergänzt den bestehenden Erfolgsstatus von Codeknacker und Zahlenpuzzle. Der Spielwechsel bricht auf kleinen Displays in zwei Spalten um.

Codeabgleich: `FractionWorkshop.tsx`, `WrittenPractice.tsx`, `GameHub.tsx`, `Codebreaker.tsx`, `SlidingPuzzle.tsx` und `src/design/workshops.css`. Die Umsetzung ist codebasiert; keine generierten Bilder oder neuen Assets.

Finish-Review: zunächst **fix**, weil die Übertragszeile der Addition falsch platziert war. Nach Korrektur steht sie oberhalb der Operanden; die benannte Korrektur ist bei 320 und 900 px aufgelöst. Abschlussurteil: **ship**.

Gesichtete Evidenz: `/tmp/written-addsub-false-320.png`, `/tmp/written-addsub-false-900.png` (Übertragsplatzierung) sowie `/tmp/workshop-fraction-320-false.png`, `/tmp/workshop-fraction-900-true.png` (gleich große Bruchstreifen, schmale Schieferansicht und breite Pink-Ansicht). Die Werkstatt scrollt vertikal innerhalb des Bildschirms.

Der Detektorbericht `/tmp/lernkick-oct31-detector.json` enthält vier unverbindliche Schriftgrößen-Hinweise und keine weiteren Befunde. Sie dokumentieren die Abweichung zur bestehenden Typografiebeschreibung; daraus folgt keine Änderung der globalen Skala. `PRODUCT.md`, `DESIGN.md` und `.impeccable/design.json` bleiben trotz bereits bestehender Metadatenabweichungen unverändert.
