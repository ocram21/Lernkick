# Prüfstand vom 16.10.2026

- Acht Logik-/Datenprüfungen bestanden (`npm test`).
- TypeScript und Vite-Produktionsbuild bestanden; Workbox generiert 18 vorab gespeicherte Einträge.
- Browserprüfungen mit vorhandenem Chromium bestanden: vollständige Mathematik- und Deutschrunde mit je zehn Fragen; erhaltene Lernstände nach Neuladen; Offline-Neuladen und neuer Rundenstart ohne Netzwerk; eigene Karten erstellen, nach Neuladen wiederfinden, anzeigen, bearbeiten und löschen.
- 320px-Ansicht ohne horizontalen Überlauf. Mobil-/Desktop-Screenshots visuell geprüft. Der Design-Detektor meldete keine Auffälligkeiten.
- Produktionsbuild für `/Lernkick/` erstellt und Pfade von Assets und Manifest geprüft.
- Speicherrennen beim sofortigen Neuladen nach Kartenanlage im Browser-Test entdeckt und behoben: Speicherbestätigung erfolgt erst nach abgeschlossener IndexedDB-Transaktion. Antworten und Rundenabschluss warten ebenfalls auf die Speicherung.

Noch offen: Installation auf realem Android/iPhone, Update einer bereits installierten Vorgängerversion während einer laufenden Runde, fachliche Freigabe und Klassenpilot. Keine Veröffentlichung auf GitHub Pages erfolgt. CI-Workflow vorhanden; Pages-Deployment wird manuell ausgelöst.
