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
