# Prüfstand vom 16.10.2026

- Acht Logik-/Datenprüfungen bestanden (`npm test`).
- TypeScript und Vite-Produktionsbuild bestanden; Workbox generiert 18 vorab gespeicherte Einträge.
- Browserprüfungen mit vorhandenem Chromium bestanden: vollständige Mathematik- und Deutschrunde mit je zehn Fragen; erhaltene Lernstände nach Neuladen; Offline-Neuladen und neuer Rundenstart ohne Netzwerk; eigene Karten erstellen, nach Neuladen wiederfinden, anzeigen, bearbeiten und löschen.
- 320px-Ansicht ohne horizontalen Überlauf. Mobil-/Desktop-Screenshots visuell geprüft. Der Design-Detektor meldete keine Auffälligkeiten.
- Produktionsbuild für `/Lernkick/` erstellt und Pfade von Assets und Manifest geprüft.
- Speicherrennen beim sofortigen Neuladen nach Kartenanlage im Browser-Test entdeckt und behoben: Speicherbestätigung erfolgt erst nach abgeschlossener IndexedDB-Transaktion. Antworten und Rundenabschluss warten ebenfalls auf die Speicherung.

Noch offen: Installation auf realem Android/iPhone, Update einer bereits installierten Vorgängerversion während einer laufenden Runde, fachliche Freigabe und Klassenpilot. Auf ausdrücklichen Nutzerwunsch auf GitHub Pages veröffentlicht: https://ocram21.github.io/Lernkick/. Repository ebenfalls ausdrücklich öffentlich gestellt. GitHub-Build, Tests und Deployment erfolgreich (Run 38955626874). Live-HTML, Unterpfad, Manifest und Service Worker per HTTPS geprüft. Weitere Deployments werden manuell ausgelöst.

## Anpassung der Lernrunden

Demo-Kennzeichnung aus der Oberfläche entfernt; fachliche Einschränkungen unter Einstellungen bleiben erhalten. Lernrunde auf die verfügbare Bildschirmhöhe begrenzt, Weiter-Button in eigenem unteren Aktionsbereich. Nach der Antwort bleiben die gewählte und die richtige Antwort samt Erklärung sichtbar. Sieben Browserprüfungen bestanden, darunter vollständige Mathe-/Deutsch-Runden bei 375×667, 320×568 und 844×390: Weiter-Button stets im sichtbaren Bereich und kein Seitenscrollen. Bei 375×667 auch der gesamte Frage-/Antwort-/Erklärungsbereich ohne Scrollen. Acht Logiktests und Produktionsbuild bestanden. Realgeräteprüfung bleibt offen.

## Ausbau auf 250 Fragen

Je 50 Fragen in allen fünf Fächern, Inhaltsformat 2 mit Quellenbezug und offener Lehrerfreigabe. Die bisherigen 24 Aufgaben einschließlich IDs, Antworten und Erklärungen wurden mit dem vorherigen Git-Stand verglichen und unverändert erhalten. Elf Inhalts-/Logik-/Sicherungstests sowie der Produktionsbuild bestanden. Fünfzehn Browserprüfungen bestanden: Offline-Runden in allen fünf Fächern, eigene Karten, kleine Displays und Querformat sowie ein vollständiger Durchlauf aller 50 Fragen jedes Fachs. Der Weiter-Button blieb auch in allen 250 Aufgaben im sichtbaren Bereich; kein Seitenscrollen bei 375×667. Die Browserprüfungen nutzen Chromium mit emulierten Bildschirmgrößen, keine echten Mobilgeräte. Design-Detektor ohne Befund, Startseite auf Mobil- und Desktop-Screenshot geprüft. Recherche und kompletter Fragenkatalog liegen separat bei.

## 17.10.2026: Manuelle Aktualisierung und automatisches Weitergehen

Großer Update-Button oben auf der Startseite, Prüfung und vollständiger Download der neuen Version, bewusster Wechsel des Service Workers mit Neuladen. Kein Löschen von Browserdaten, IndexedDB oder Caches. Nach Antworten drei Sekunden Rückmeldung und automatisches Weitergehen; pausierbar und manuell übersteuerbar.

17 Logik-/Inhalts-/Updateprüfungen bestanden. 18 Browserprüfungen bestanden, darunter ein echter Service-Worker-Wechsel von Testversion 1 auf 2 mit anschließendem Neuladen und unverändert erhaltenen Lernständen, Highscores und eigener Karte. Drei-Sekunden-Timer bei 2.999/3.000 ms, Pause, Fortsetzen und Abbruch alter Timer beim manuellen Weitergehen geprüft. Offline-Hinweis und Erreichbarkeit des großen Update-Buttons auf 320×568 geprüft. Alle bisherigen Runden-, Offline-, Inhalts- und Layoutprüfungen bestanden. Produktionsbuild erfolgreich. Chromium mit emulierten Displays; keine neue Realgeräteprüfung.

## 17.10.2026: Kompakte Startseite

Update-Aktion rechts neben LernKick; Lernmodus, fünf Fächer und untere Navigation auf einer Bildschirmhöhe. Hero, große Grafik, Fach-Untertitel und wiederholte Hinweise entfernt; Hilfeseite mit vollständigen Erklärungen ergänzt. 17 Logiktests und insgesamt 24 Browserprüfungen bestanden (der anfängliche Lade-Überlauf nach Korrektur gezielt erneut geprüft). Geprüfte Ansichten: 320×568, 360×640, 390×844, 844×390 und 1440×900, jeweils ohne Seitenüberlauf und mit erreichbaren, mindestens 44px hohen Fachbuttons oberhalb der Navigation. Hilfe und Rückkehr zum Lernen geprüft. Vor dem vollständigen Laden der Schrift bleibt auch der responsive Header innerhalb von 320px. Alle bisherigen Runden-, Offline-, Inhalts- und Updateprüfungen bestanden. Produktionsbuild erfolgreich; Quellen und Aufgaben unverändert. Prüfung in Chromium mit emulierten Displays, keine neue Realgeräteprüfung.

## 17.10.2026: Fehler in Ruhe lesen und 500 Fragen

Bei falscher Antwort kein Countdown und kein automatisches Weitergehen: Erklärung und Lösung bleiben bis zum manuellen Wechsel stehen, auch bei der zehnten Frage. Richtige Antworten wechseln weiterhin nach drei Sekunden; Pause, Fortsetzen und manuelles Weitergehen bleiben verfügbar. Hilfe und Einstellungsangaben angepasst.

Erneute Recherche der fünf offiziellen Fachlehrpläne, der bLf-Hinweise sowie der Bundestagsquellen. Pro Fach 50 neue Aufgaben mit Lösungen, Erklärungen und Lehrplanzuordnung ergänzt, insgesamt genau 100 je Fach und 500 Aufgaben. Die vorherigen 250 Aufgaben wurden vollständig gegen HEAD verglichen: IDs, Texte, Optionen, richtige Antworten und Erklärungen unverändert. Recherche, Metadaten und vollständiger Fragenkatalog aktualisiert. Fachliche Lehrerfreigabe bleibt ausstehend.

17 Logik-/Inhalts-/Updateprüfungen, TypeScript und Produktionsbuild bestanden. 25 Browserprüfungen bestanden, darunter alle 100 Aufgaben jedes Fachs in zehn Runden, Offline-Nutzung aller Fächer, Kartenverwaltung, Service-Worker-Update mit erhaltenen Nutzerdaten und fünf Startseiten-Displaygrößen ohne Scrollen. Richtige Antworten gezielt bei 2.999/3.000 ms sowie mit Pause/Fortsetzen geprüft. Zehn falsche Antworten nacheinander jeweils nach 30 Sekunden noch unverändert sichtbar, Abschluss der letzten Frage nur manuell. Weiter-Button bei allen 500 Aufgaben innerhalb der Bildschirmhöhe von 667px, kein Seitenscrollen. Screenshots von Startseite und falscher Antwort visuell geprüft. Chromium mit emulierten Displays, keine Realgeräte- oder Lehrkräfteprüfung.

## 17.10.2026: Adaptiver Mathe-Pilot und Kompetenz-Mosaik

Bestandsaufnahme, Migrationsrisiken und konkrete Kompetenzstruktur wurden vor Implementierungsbeginn in `MATHE-PILOT.md` festgehalten. 35 kleine Mathe-Kompetenzen mit Voraussetzungen und Stufen, 100 getrennte und prüfbare Fragezuordnungen, sieben generierbare Teilkompetenzen, gestufte Hilfe und jederzeit veränderbare Lernweg-Wahl umgesetzt. Antwortdauer wird nicht erhoben. Rückmeldungen ohne rote Strafmarkierungen; bisherige Bestleistungen und 500 redaktionelle Aufgaben erhalten. Kurze Bedienhilfe statt technischer Textwand; Mosaike als ausdrücklich neutrale, austauschbare Platzhalter für alle fünf Fächer. Neue Meilensteine bleiben bei Fehlern erhalten.

35 Unit-Tests bestanden. Darunter 3.150 deterministische Generatorfälle mit geprüftem Rechenergebnis, eindeutigen Optionen, Zehnerübergängen und gültiger Division; Kompetenzgraph ohne Zyklen, Fehler-Unterstützung mit Rückkehr zur ursprünglichen Stufe, Fehler im Grundlagenschritt, Hilfenutzung, zeitversetzte Sicherheit, Duplikate, Punktebegrenzung, bestehende und zukünftige unbekannte IDs sowie Sicherungen Version 1 und 2.

30 Browserprüfungen bestanden: weiterhin vollständiger Katalogdurchlauf aller 500 Fragen, komplette Runden in allen Fächern, Offline-Neustart, Kartenverwaltung, kompakte Startseite in fünf Größen, Hilfe, Lernweg-Wahl, Generatorrunden, erhaltene Freischaltung nach Rückfall/Import/Neustart, echte IndexedDB-Migration und tatsächlicher Sicherungsexport mit Reimport. Bestehende Drei-Sekunden-Automatik für richtige und manuelle Weiterführung für falsche Antworten sowie Service-Worker-Update mit erhaltenen Nutzerdaten bestanden. Nach der letzten Korrektur der Fehler-Unterstützung neun betroffene Browserprüfungen erneut bestanden. TypeScript und Produktionsbuild erfolgreich; Offline-Precache knapp 800 KiB. Mechanischer Design-Detektor ohne Befund. Mobil- und Desktopansichten visuell geprüft.

Grenzen: Chromium mit emulierten Displays, kein echter Lernenden-/Lehrkräftetest und keine neue Realgeräteprüfung. Ein konkreter Kurztest mit Lernenden ist in `MATHE-PILOT.md` vorbereitet. Kompetenzgrenzen, Schwellenwerte, vorläufige Zuordnungen und generierte Varianten sind pädagogisch noch abzunehmen. Andere Fächer erhalten Mosaik-Fortschritt, aber noch keinen vollständig neuen Kompetenz-Lernpfad. Datenversion 2 benötigt beim technischen Rollback die neue Leseschicht.
