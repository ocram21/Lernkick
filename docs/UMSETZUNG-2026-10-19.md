# Bestandsaufnahme vor Umsetzung

19.10.2026. IndexedDB `lernkick`, Version 1, Object Store `user`, Schlüssel `data` enthält Datenformat 3. `src/lib/storage.ts` lädt/schreibt den vollständigen validierten Stand. `src/learning/migration.ts` migriert Formate 1/2/3. `src/lib/schema.ts`: Antworten, Fachbestleistungen (keine kumulierten Gesamtpunkte), Kompetenzen, Mosaik-Erfolge, Karten, Einstellungen. `src/activities/schema.ts`: Wortschatz/Satzbau, Galgenraten und Deutschlandquiz einschließlich laufender Sitzungen. Dual N-Back hält bisher Ergebnisse nur im iframe-Arbeitsspeicher. Keine Profile/Accounts/Synchronisation vorhanden; eine lokale Profilkennung bezeichnet den bestehenden Gerätestand, sie führt keine zusätzliche Nutzerverwaltung ein.

PWA: `vite.config.ts`, Workbox mit Update-Rückfrage, lokale statische Assets. Cachebereinigung betrifft CacheStorage, nicht IndexedDB. Keine Datenbanklöschung vorsehen. Alte Lernrunden sind nicht vollständig rekonstruierbar: Fachbestleistungen dürfen nicht als bisherige Gesamtsumme ausgegeben werden. Übernommen werden alle alten Daten unverändert; als konservativer Punktebestand gilt die Summe der gespeicherten Fachbestleistungen, spätere Punkte werden addiert. Alte Kompetenzstufen/Mosaike bleiben eigene historische Daten und werden nicht in erfundene neue Level oder Endgegner umgerechnet.

## Geplantes additives Modell

Datenformat 3 bleibt lesbar; neues Feld `journey` mit eigener `schemaVersion:1`, Profil-ID, Gesamtpunkten, neun Modulständen (aktuelles Level, Fortschritt, Abschlüsse, Siege, Aktivität), deduplizierten Ergebnis-IDs und Aufgaben-Wiederholungsschutz. Alte vollständige Rohdaten werden in derselben IndexedDB-Transaktion vor Migration unter `backup.before-journey` gesichert. Abbruch lässt den Originalstand unverändert. Import erhält automatisch eine vollständige Vorher-Sicherung. Unlesbare Daten blockieren das Laden statt Nullwerte zu erzeugen. JSON-Export bleibt verfügbar. Kein localStorage.clear und keine Datenbanklöschung.

Aktivität wird nur aus sichtbaren Interaktionen mit maximal 30 Sekunden Abstand abgeleitet, nicht aus bloßer Öffnungszeit. Keine Speicherung einzelner Antwortzeiten. Die Stärke gewinnt 10 Punkte pro 30 aktiven Minuten, nach zwei Tagen Schonfrist verliert sie 5 Punkte pro weiterem Tag. Zeitrücksprünge erzeugen keinen Gewinn.

## Ergebnis der Umsetzung

Die Nutzerantwort „nur retro tech“ ersetzt die gewünschte Dreier-Themeauswahl: ausschließlich Retro Tech, ohne weiteren Schalter. Zentrale Farbvariablen in `src/style.css`; Dual N-Back erhält die aufgelösten Farbwerte über eine auf Origin und iframe beschränkte Nachricht. Auswahl der neun Bereiche direkt auf der Startseite, Gesamtpunkte ohne Zielwert, ein Lernstärkebalken. Der Routenname `social` bleibt intern erhalten, die Startseite zeigt SK für Sozialkunde. Eigene Kartenverwaltung bleibt erhalten, weil dort exklusive persönliche Inhalte, Suche, Bearbeitung und Wiederholungen liegen; der Kartenlernmodus auf der Startseite entfällt. Freies Üben nutzte denselben Fragenpool, keine exklusiven Aufgaben gehen verloren. Die separate Fortschrittsoberfläche ist nicht mehr eingebunden. Historische Kompetenz- und Mosaikdaten bleiben in Sicherungen erhalten.

### Fortschrittskonfiguration

`src/learning/journey.ts` ist die gemeinsame Konfiguration. Fachrunden: zehn Aufgaben und drei bestandene Durchläufe je Level. Wortschatz einschließlich Satzbau: zehn Aufgaben und drei bestandene Durchläufe; erste Prüfung entscheidet, spätere Korrektur derselben Aufgabe erzeugt keinen neuen Levelerfolg. Galgenraten: fünf gelöste verschiedene Wörter je Level, angebotene Hilfe ist erlaubt; Aufdecken ist kein Erfolg. Deutschlandquiz: beide Spielabschnitte zusammen, 32 Erstzuordnungen, zwei bestandene Gesamtdurchläufe je Level. Dual N-Back: 24 bewertete Reize mit jeweils zwei Entscheidungen, drei bestandene Runden je zentralem Level; die spielinternen N-Stufen 1–4 bleiben davon unabhängig.

Für N-Back zählt die ausgewogene Trefferrate: Mittelwert aus Sensitivität (Treffer / echte Übereinstimmungen) und Spezifität (korrekte Nicht-Reaktionen / Nicht-Übereinstimmungen), strikt >60 %. Dadurch besteht bloßes Nicht-Reagieren nicht. Mindestens vier tatsächliche Antworten sind für die zentrale Ergebnisbuchung erforderlich. Die ursprüngliche N-Back-Auswertung/Spielmechanik bleibt bestehen; angezeigt werden ausschließlich Gesamtfehler und die vorhandenen sinnvollen Stufenangaben. Details, Verlauf und Druckfunktion sind aus der Oberfläche entfernt.

Punkte: zehn je korrekt gelöster normaler Aufgabe bzw. N-Back-Entscheidung. Fehlversuche haben keinen Abzug. Neu gewertete Aufgaben füllen nach bestandenem Durchlauf das jeweilige Level; mindestens >60 % des Durchlaufs müssen außerhalb der 24-Stunden-Wiederholungssperre liegen. Nur tatsächlich neue richtige Aufgaben liefern Punkte; korrekte Aufgaben innerhalb der Wiederholungssperre liefern keine. Event-IDs verhindern doppelte Ergebnisbuchungen. Ein bestandener Durchlauf füllt einen von mehreren Balkenschritten; erst der volle Balken schaltet das nächste Level frei. Die vorhandene fachliche Adaption aus Korrektheit und Entwicklung bleibt; Mathematik vergleicht ab Einstieg nahe zweistellige Zahlen, Addition und Subtraktion ohne Übergang beginnen im zweistelligen Bereich. Keine Antwortzeit wird als Nachteil gewertet oder personenbezogen übertragen. Weitere pädagogische Feinabstimmung bleibt anhand von Schülererfahrungen möglich.

Jedes fünfte abgeschlossene Level schaltet innerhalb des Bereichs eine kleine Bonusaufgabe frei. Einmalige Wertung, 50 Bonuspunkte bei Erfolg, keine Abzüge oder Sperre bei Fehler oder Überspringen. Figur und Farbe variieren, neue Grafiken können die einfachen Bibliotheks-Icons später ersetzen. Siege und Versuche bleiben dauerhaft gespeichert.

### Persistenz und Wiederherstellung

Datenformat 3 mit additiver Journey-Schema-Version 1. Vor Migration: Rohkopie unter `backup.before-journey`. Import und ausdrücklicher Detail-Reset: vollständige Vorher-Kopie unter `backup.import.<Zeitstempel>`. Der zusätzliche Button „Vorher-Sicherung exportieren“ lädt die letzte solche Kopie (sonst die Migrationskopie) als JSON herunter; über den normalen Import wiederherstellbar. Importe validieren vor der Bestätigung. Dasselbe Profil behält die höheren Punkte, weiter erreichten Level und Vereinigungen dauerhafter Erfolge; ein ausdrücklich bestätigter Import eines anderen Profils ersetzt den Stand, ohne Schülerdaten zu vermischen. Geräteprofile sind keine neuen Konten.

Alle Schreibvorgänge laufen in einer seriellen Warteschlange und transaktionssicher in IndexedDB. Verglichen wird eine nach Objektschlüsseln normalisierte Momentaufnahme; ein veraltetes zweites Fenster kann einen neueren Stand nicht still überschreiben. Fehler bleiben sichtbar, der aktuelle In-Memory-Stand ist exportierbar. Der zusätzliche Schlüssel `journey.current` bewahrt neue Punkte/Level/Siege, wenn ein altes App-Fenster den Hauptdatensatz ohne die neue Erweiterung zurückschreibt. Alle neuen Schreibvorgänge halten beide Schlüssel atomar aktuell. Ein alter Stand mit bisher nur Fachbestleistungen erhält deren Summe als konservativen Startpunkt; historische Gesamtsummen wurden früher nicht gespeichert und werden nicht erfunden. Es werden keine alten Erfolge als neue Endgegner ausgegeben.

Lernstärke: +10 pro 30 aktiven Minuten, nach zwei Tagen Schonfrist -5 pro weiterem vollen 24-Stunden-Zeitraum. Interaktionsabstände bis 30 Sekunden in sichtbaren laufenden Übungen zählen, Pausen/Ergebnisansichten/bloßes Öffnen nicht. Es wird keine Zeit im Hintergrund hochgezählt. Zeitrücksprünge schaffen keinen Gewinn. In allen Simulationen bleiben Gesamtpunkte unabhängig von der Stärke erhalten.

### Verifikation und verbleibende Grenzen

Produktionsbuild erfolgreich. 88 Logiktests erfolgreich. Vollständige Browser-Suite: 90 Tests erfolgreich, darunter sämtliche 500 Fachfragen, echter Service-Worker-Wechsel, Datenübernahme aus Altformaten, Offline-Runden/Reload/Neustart, abgebrochene Migration, wiederholte Migration, fehlerhafte Importe, Profilwechsel, Mehrfensterkonflikt, Wiederherstellung nach Altclient-Schreibzugriff und Endgegner-Bonus. Mobile Viewports 320×568, 390×844, kurze Hoch-/Querformate und Desktop; große Touchflächen, fixe Navigation und Eingabefeldverhalten getestet. Die nach der letzten Punkte-/Importkorrektur betroffenen Browserprüfungen wurden nochmals ausgeführt (37 erfolgreich); stabile Sichtprüfungsbilder liegen unter `.impeccable/review/`. Die unabhängige Sichtprüfung gab für Startseite und laufendes Dual N-Back das Urteil „ship“ ohne materielle Befunde.

Echte Android-/iOS-Geräte und installierte PWA mit Systemtastatur können in dieser Umgebung nicht physisch abgenommen werden. Die Browserprüfungen ersetzen diese Geräteabnahme und pädagogische Erprobung nicht. Lokale Daten bleiben bei bewusst gelöschten Browserdaten, Defekten oder Gerätewechsel ohne Export gefährdet; es gibt kein Serverbackup und keine Synchronisation. Sehr alte parallel geöffnete Clients kennen die neuen Profile nicht: vor einem bewussten Profilwechsel alte Fenster schließen. Keine produktive Veröffentlichung vorgenommen. Der Build meldet weiterhin den bestehenden großen Haupt-Bundle; keine neue Laufzeitabhängigkeit eingeführt.

### Geänderte Dateien

| Bereich | Dateien |
| --- | --- |
| Daten und Regeln | `src/learning/journey.ts`, `src/learning/migration.ts`, `src/lib/schema.ts`, `src/lib/storage.ts`, `src/activities/schema.ts` |
| Startseite und Stil | `src/App.tsx`, `src/style.css`, `src/components/CalculatorKey.tsx`, `src/components/BossChallenge.tsx`, `index.html`, `vite.config.ts` |
| Spiele und Aufgaben | `src/activities/content.ts`, `src/learning/generator.ts`, `src/components/{CountryQuiz,Hangman,VocabularyPractice,NBackGame,ResetProgressDialog}.tsx`, `public/games/dual-n-back/index.html` |
| Prüfung | `tests/journey.test.ts`, `tests/journey.spec.ts`, angepasste bestehende Browserprüfungen und N-Back-Logiktests |
| Dokumentation | dieser Bericht, `DESIGN.md`, `.impeccable/design.json`, Verweis in `README.md` |

Bestehender Dokumentationshinweis: `PRODUCT.md` verwendet das ältere Impeccable-Kontextformat. Eine gesondert gewünschte `init`-Aktualisierung kann dieses Format erneuern; es wurde im Rahmen dieses Auftrags nicht ungefragt umgebaut.

Nutzerkorrektur: Fachtasten zeigen MA, D, SK, Bio und Geo. Vollständige zugängliche Namen: Mathematik, Deutsch, Sozialkunde, Biologie, Geographie. Die weitere Designrichtung wird neu abgestimmt.

Gestalterische Nachbesserung auf Nutzerwunsch: kräftiger, plastischer Retro-Taschenrechner. Große Fachkürzel, zentrale bereichsspezifische Tastenkappenfarben, vertiefte LCD-Punkteanzeige und dunkles Tastenbett mit 7px optischer Tiefe / 6px Druckweg. Geändert wurden nur Tastenkomponente und Styles; Speicher- und Lernlogik bleiben unberührt. Produktionsbuild und acht gezielte Browserprüfungen für Smartphone/Desktop erfolgreich.

## Abschliessende Farbvorgabe und Release

Die Taschenrechner-Vorlage vom 19.10.2026 ersetzt fruehere Pastelltasten und den gruenen LCD-Stil. Original: `docs/design/calculator-reference.jpeg`. Neun zentrale Grundfarben: `src/design/palette.json`; CSS-Variablen: `src/design/palette.css`. Die Palette gilt fuer alle Module, Dual N-Back und die App-Symbole. Nur spaetere anatomische und andere Schautafelinhalte duerfen davon abweichen. Farbtests sichern Grundfarben und Variablen ab.

90 Logiktests und 90 Browsertests erfolgreich. Hilfsagent fuer Dokumentation am Nutzungslimit; Abschlussdokumentation anhand des Codes hier vorgenommen. Pages bestaetigt: lernkick.eu, HTTPS, BASE_PATH=/. Release: `2026-10-19-retro-calculator`.
