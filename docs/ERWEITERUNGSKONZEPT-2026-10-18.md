# Länderquiz und Lerntafeln – Umsetzung

Auftrag: `/Users/marco/Downloads/Lern-Kick_Codex_Erweiterungskonzept.md`, ausdrücklich zur Umsetzung übergeben. Bestehende Funktionen bleiben erhalten; entfernte Feedbackfunktion und frühere entfernte Spiele werden nicht wieder eingeführt. Die vorherige Galgenraten-Version (43d9d48) ist erfolgreich auf GitHub Pages veröffentlicht.

## Kurzplan

1. Bestehendes Galgenraten mit zehn Schritten und echten deutschen Buchstaben behalten.
2. Deutschlandquiz als direkter Einstieg: amtliche VG250-Ländergrenzen, alle 16 Länder und danach ihre Hauptstädte, unbegrenzte Versuche, Pointer-Drag und gleichwertiges Antippen, vergrößerte Ziele für kleine Regionen.
3. Lerntafeln als modaler Nachschlagebereich aus dem Hauptmenü und laufenden Ansichten. Aktuelle Komponenten bleiben montiert; Eingaben und Scrollposition erhalten. Timer pausiert bei offenem Tafelwerk. Nachschlagen vor Beantwortung einer Fachfrage zählt als Hilfe, ohne bisherigen Fortschritt zurückzunehmen.
4. Fünf Kategorien, keine Texteingabe/Suche, Vorschaubilder, Sternchen und lokal gespeicherte Favoriten. Datengetriebener Katalog mit 35 Tafeln: Mathematik 9, Deutsch 6, Biologie 7, Geografie 8, Sozialkunde 5. Verwandte Themen zusammenfassen. Anatomie mit echten frei nutzbaren Fachgrafiken, keine erfundenen Platzhalter. Quellen und Lizenzen offline mitliefern.
5. Zoom, Verschieben, Pinch, Reset und dauerhaft geöffnete Funktionserklärungen. Keine Vorlesefunktion.
6. Erklärungen standardmäßig ohne automatischen Wechsel; bestehende Dreisekunden-Automatik als freiwillige Option erhalten. Transparente Änderung gegenüber älterem Auftrag; bei geöffneten Tafeln stets pausiert.
7. Inhaltsprüfung, responsive Browser- und Offlineprüfungen, Daten-/Sicherungsverträglichkeit; anschließend Veröffentlichung und überprüfbarer Abschlussbericht.

## Quellen und Assetprüfung

Amtliche Ländergeometrien vom BKG (VG250, WFS, Landflächen GF=4), auf 16 Länder begrenzt und für die Anzeige vereinfacht; attribution: © BKG 2026, dl-de/by-2-0. Kartenstand und Datenquellen siehe mitgelieferte Kartenmetadaten.

Frei nutzbare SVG-Anatomiegrafiken von Wikimedia Commons (Originalautoren und individuelle Lizenzen werden im Katalog dokumentiert). Mathematische/grammatische und vereinfachte Funktionsdiagramme werden als eigene Vektorgrafiken erstellt. Keine lehrkräfteseitige Freigabe oder reale Geräteprüfung behaupten, die nicht stattgefunden hat.

## Arbeitsstand

Umgesetzt: Deutschlandquiz mit 16 amtlichen Länderumrissen, zweiter Runde mit allen Hauptstädten, unbegrenzten Fehlversuchen, Pointer-Drag auf Maus und Touch, neutralem Hover, Tastatur, Tap-Alternative und vergrößerten kleinen Regionen. Bereits zugeordnete Regionen lassen sich zur ausgeschriebenen Anzeige antippen. Die Abbruchabfrage gilt auch für Spiele.

35 Lerntafeln mit 38 lokalen SVG-Grafiken, darunter neun frei nutzbare Anatomiegrafiken und eine zusätzliche Jahreslaufansicht. Genau fünf Kategorien, Vorschauen, lokale Favoriten oben, Sicherung/Import kompatibel, keine Suche und keine Vorlesefunktion. Organbeschriftungen haben dauerhafte Funktionserklärungen; bei Verdauung zusätzlich präzise Touchmarker direkt im Organbild. Andere komplexe anatomische Details werden über große beschriftete Schaltflächen erklärt, um die ursprünglichen Fachbeschriftungen nicht zu verdecken. Zoom, Pinch, Verschieben, Tastatur und Reset sind umgesetzt.

Das Buchsymbol bleibt auch in gescrollten Ansichten erreichbar. Dialogöffnung erhält Aufgabe, Spielezustand und ungespeicherte Karten-/Worteingaben. Vorheriger Fokus und Scrollposition werden beim Schließen wiederhergestellt. Automatik ist standardmäßig aus; freiwillig eingeschaltet pausiert sie im Dialog und beginnt nach Rückkehr eine neue volle Lesezeit. Falsche Antworten wechseln weiterhin ausschließlich manuell. Bestehende Datenbank v1 und Nutzerdaten v3 bleiben lesbar; Favoriten erhalten beim Lesen älterer Sicherungen einen leeren Standardwert.

Quellen, individuelle Bildlizenzen, Kartenherkunft und Erweiterungsanleitung: [Lerntafeln – Quellen und Pflege](LERNTAFELN-QUELLEN.md). Originale Fachgrafiken statt ungenauer anatomischer Platzhalter. Mathematische Formen und Funktionsmodelle sind eigene Vektordarstellungen. Keine neuen Laufzeitabhängigkeiten.

## Tatsächliche Prüfungen

- `npm test`: 58 Tests bestanden, darunter ältere v3-Nutzerdaten ohne Favoriten, Sicherungs-Rundlauf, alle lokalen SVG-Dateien ohne externe Bild-/Scriptabhängigkeiten und beide Deutschlandrunden mit beliebig vielen Fehlversuchen.
- `npm run build`: TypeScript, Vite und Workbox erfolgreich. Gemeinsamer Offlinecache ungefähr 4 MB; alle 38 Tafelfiguren und Vorschaubilder enthalten. Bekannte Vite-Größenwarnung für das gemeinsame JS-Bundle bleibt eine Optimierungsmöglichkeit, kein Buildfehler.
- Vollständige Playwright-Suite: 67 Tests bestanden, einschließlich aller 100 Fragen jedes der fünf bestehenden Fächer, Kartenverwaltung, Wortschatz, adaptivem Lernen, Galgenraten und Update/Datenbewahrung.
- Nach der letzten Anpassung der sichtbaren Organerklärungen und Kurzhilfe: alle 21 betroffenen Browserprüfungen erneut bestanden.
- Neue Prüfungen: alle 35 Tafeln und 38 Figuren im simulierten Offlinebetrieb geöffnet; Erklärungen, Figurenwechsel und Tastaturzoom; native Zwei-Finger-Gesten per Chromium-Touch-Ereignissen; echtes Maus- und Touch-Ziehen im Quiz, Tastaturdurchlauf aller 32 Zuordnungen, Neustart, Zwischenaufruf des Tafelwerks, Mindestgrößen kleiner Touchziele.
- Kleine Ansichten: 320×568 und 390×844; zusätzlich Querformat 844×390 und Desktop 1440×900. Startseite und Deutschlandquiz ohne Dokument-Scrollen. Kategorie-, Anatomie-, Karten- und Formeltafeln visuell geprüft; Überlappungen in der redaktionellen Grafikprüfung korrigiert. Erklärungen erscheinen im sichtbaren Dialogbereich und bleiben bis zum ausdrücklichen Schließen stehen.
- Favoriten über Seitenneustart und JSON-Export, unveränderter Aufgabenstand mit pausierter Automatik, ungespeicherter Kartenentwurf sowie exakte Rückkehr der Scrollposition mit direkter Mausbedienung geprüft.

## Verbleibende Grenzen

- Physisches iPhone/Android-Gerät einschließlich Safari, OS-Installation, echter Flugmodus und Screenreader-Abnahme sind hier nicht ausgeführt worden. Die Tests verwenden Chromium mit Smartphone-Viewports und nativen Touch-Ereignissen; Offlinebetrieb wird über gesperrtes Netzwerk geprüft.
- Redaktionelle Plausibilitätsprüfung und nachgerechnete Beispiele sind erfolgt. Die unabhängige fachliche Abnahme durch Lehrkräfte bleibt offen; die App behauptet keine schulbehördliche Freigabe.
- Europakarte ist eine beschriftete Auswahl einschließlich aller deutschen Nachbarländer, kein vollständiger Länderatlas. Natural-Earth-Küsten und BKG-Grenzen sind für Schulorientierung vereinfacht, Landschaften schematisch. Bilder sind zoombar; die Textansicht bietet zusätzlich gut lesbaren Zugang zu den Inhalten.
- Ein App-Update benötigt Internet und einmaligen vollständigen Download. Externe Quellenlinks benötigen Internet; Tafeln, Lizenzerläuterungen, Erklärungen, Favoriten und Quiz selbst funktionieren danach offline. Favoriten bleiben gerätebezogen; Übertragung erfolgt per Sicherung.
- Bereits vorher dokumentierte offene Betreiberangaben/rechtliche Prüfung und neutrale Fortschrittsmotive sind durch diesen Erweiterungsauftrag nicht verändert worden.
