# Lernkomplexe und Fragenrunden · 26.10.2026

Umgesetzt nach `Lernkick_Codex_Lernkomplexe_Fragenrunden.md`. Die 14 Namen wurden aus der im Auftrag enthaltenen verbindlichen Referenz übernommen. Eine gesonderte Datei `Stoffkomplexe.xlsx` war diesem Auftrag nicht beigefügt.

## Inhaltlicher Bestand

| Fach | Lernkomplex | Quizfragen | Neue Lernkarten |
|---|---|---:|---:|
| Biologie | Stoff- und Energiewechsel des Menschen | 50 | 8 |
| Biologie | Sinnes- und Nervenfunktionen des Menschen | 50 | 8 |
| Biologie | Zellen | 50 | 8 |
| Biologie | Lebewesen in ihrer Umwelt | 50 | 8 |
| Geografie | Räumliche Disparitäten und Verflechtungen | 50 | 8 |
| Geografie | Doppelkontinent Amerika | 50 | 8 |
| Geografie | Weltwirtschaftsmacht USA | 50 | 8 |
| Geografie | Europäische Union | 50 | 8 |
| Geografie | Wirtschaftsraum Deutschland | 50 | 8 |
| Sozialkunde | Familie und Umwelt | 50 | 8 |
| Sozialkunde | Freizeit und Drogen | 50 | 8 |
| Sozialkunde | Medien | 50 | 8 |
| Sozialkunde | Die BRD – ein demokratischer und sozialer Staat | 50 | 8 |
| Sozialkunde | Wahlen | 50 | 8 |

**Gesamt: 700 einzeln gespeicherte neue Quizfragen und 112 neue Lernkarten.** Je Pool 15 leichte, 15 mittlere und 20 schwere Fragen. Normal verwendet wie bisher Stufen 1/2, Streber Stufe 3. Einschließlich unveränderter Mathematik- und Deutschbestände gibt es 950 aktive Fachfragen; einschließlich erhaltener älterer Karten 322 voreingestellte Lernkarten.

Fragen sind vollständig gespeicherte Datensätze mit stabilen IDs, drei Antwortmöglichkeiten, gültigem Lösungsschlüssel und Rückmeldung. Es gibt keinen neuen Fragengenerator und keine zweite Quiz-Engine. Die Karten erklären Begriffe und Zusammenhänge statt die Quizfragen mechanisch zu wiederholen.

## Bedienung und Bestandsschutz

- Gemeinsamer datengetriebener Katalog für Fragenrunden und Lernkasten: exakt 4/5/5 Komplexe mit den vorgegebenen Namen. Mathematik und Deutsch behalten ihre bisherigen Kataloge.
- Neue Zehn-Fragen-Runde über die Fachkachel und die bekannte Auswahl mit Schaltern starten. Leere Auswahl deaktiviert Üben. Mehrere Komplexe werden möglichst gleichmäßig gemischt, ohne doppelte Frage innerhalb der Runde.
- Pro Fach getrennte lokale Auswahl unter `complexSelection`; unabhängig von `study.box.rubrics`. Laufende Runden behalten ihre gespeicherte Themenauswahl. Angefangene Runde fortsetzen ist ein eigener bewusster Weg; Üben startet die neue Auswahl. Noch eine Runde öffnet wieder die Auswahl.
- Der bestehende Lernkasten zeigt die neuen Komplexe, passende Standardkarten und unverändert die Kartenerstellung. Vorhandene Standardkarten-IDs und Reviewdaten bleiben erhalten. Alte Rubrik-IDs werden bei der Anzeige vorsichtig zugeordnet; persönliche Karten werden nicht umgeschrieben oder künstlich angelegt.
- Die bisherigen 300 Fragen dieser drei Fächer bleiben als Archiv für ältere Lernnachweise verfügbar. Laufende alte Fragenrunden enthalten ihre Aufgabe bereits vollständig und werden nicht zurückgesetzt.
- Bosskampf-Auswahl wird nicht an `complexSelection` gekoppelt. Geübte Komplexe und ältere fachliche Nachweise bleiben nutzbar. Fünf Runden zur Ladung, Zeitlimit, Bewertung, Score, Skill und Statistik bleiben im vorhandenen Ablauf.
- Neue Inhalte werden lokal gebündelt und von der bestehenden PWA offline bereitgestellt. Daten-/Journey-Version und Domain-/Pages-Konfiguration bleiben unverändert.
- Geschriebene Hilfe ergänzt; weiterhin keine Hilfestimme.

## Dateien

- `src/content/complexes/catalog.json`, die 14 Pool-JSON-Dateien und `index.ts`: gemeinsamer Katalog, Inhalte und Laufzeitvalidierung.
- `src/content/complexCards.json`, `src/study/cards.ts`, `src/study/topics.ts`: neue Lernkarten, gemeinsame Themen und lesbare Altrubriken.
- `src/learning/complexes.ts`, `complexSelection.ts`, `legacyComplex.ts`: Katalogzugriff, ausgewogene Auswahl über die bestehende Auswahlfunktion, Zuordnung älterer Nachweise.
- `src/components/ComplexPanel.tsx`, `LearningBox.tsx`, `HelpPage.tsx`, `src/App.tsx`, `src/design/complexes.css`, `src/main.tsx`: Integration und eng begrenzte responsive Darstellung.
- `src/content/index.ts`, `src/learning/boss.ts`, `src/lib/schema.ts`: aktive Pools, Bosskompatibilität und additive Speicherung.
- `scripts/validate-complexes.mjs`, `package.json`, `tests/complexes.test.ts`, `tests/complexes.spec.ts` sowie angepasste vorhandene Tests: Datenprüfung und Regressionen.
- `public/release.json`: Release `2026-10-26-learning-complexes`, 322 Karten.

## Fachliche Einordnung und Quellen

Redaktionell auf Sachrichtigkeit, eindeutige Lösung, Themenpassung und verständliche Sprache geprüft. Keine aktuellen Bevölkerungs-, Mitgliedschafts- oder Wirtschaftsranglisten als auswendig zu lernende Zahlen. Politische Inhalte sind parteipolitisch neutral; Suchtprävention vermeidet Konsumanleitungen und stigmatisierende Aussagen. Rechtsbezogene Grundlagen wurden am 26.10.2026 mit amtlichen Angeboten abgeglichen; insbesondere Zweitstimmendeckung ist keine Zusage eines Sitzes allein durch einen Wahlkreissieg.

Abgleichquellen und fachlicher Hintergrund (abgerufen 26.10.2026):

- [Deutscher Bundestag: Grundgesetz](https://www.bundestag.de/parlament/aufgaben/rechtsgrundlagen/grundgesetz/) – Grundrechte, Staatsaufbau und demokratische Beteiligung.
- [Bundeswahlleiterin: Wahlinformationen](https://www.bundeswahlleiterin.de/bundestagswahlen/2025/informationen-waehler.html), [Bundeswahlgesetz](https://www.bundeswahlleiterin.de/dam/jcr/2596ba8d-34e4-4c9b-a731-a27f8fb0618f/bundeswahlgesetz.pdf), [Wahlgeheimnis](https://www.bundeswahlleiterin.de/service/glossar/w/wahlgeheimnis.html).
- [Bundestag: Sozialstaat](https://www.bundestag.de/services/glossar/sozialstaat-245542).
- [Sozialministerium Baden-Württemberg: gewaltfreie Erziehung](https://sozialministerium.baden-wuerttemberg.de/de/soziales/familie/gewaltfreie-erziehung).
- [BIÖG: Suchtprävention](https://www.bioeg.de/themen/suchtpraevention/), [Elterninformation Cannabis](https://shop.bioeg.de/pdf/34600000.pdf), [Drogenaffinitätsstudie](https://www.bioeg.de/fileadmin/user_upload/Studien/PDF/DAS_2023_Forschungsbericht_final.pdf).
- [klicksafe: Desinformation und Meinung](https://www.klicksafe.de/desinformation-und-meinung).
- [Europäische Union: Ziele und Werte](https://european-union.europa.eu/principles-countries-history/principles-and-values/aims-and-values_de).
- [Destatis: BIP-Begriff](https://www.destatis.de/DE/Themen/Wirtschaft/Volkswirtschaftliche-Gesamtrechnungen-Inlandsprodukt/Methoden/bip.html).
- [bpb: Globalisierung](https://www.bpb.de/kurz-knapp/lexika/lexikon-der-wirtschaft/19533/globalisierung/).
- [Diercke: Nord- und Mittelamerika – Wirtschaft](https://schule.diercke.de/content/nord-und-mittelamerika-wirtschaft-bersicht-978-3-14-100902-6-225-5-1) – kartografische Einordnung der Wirtschaftsräume.
- [NOAA: ENSO im Pazifik](https://www.noaa.gov/jetstream/tropical/enso/enso-patterns).
- [OpenStax: Zellgrundlagen](https://openstax.org/books/biology-2e/pages/4-2-prokaryotic-cells).
- [Umweltbundesamt: Eutrophierung](https://www.umweltbundesamt.de/themen/wasser/gewaesser/meere/nutzung-belastungen/eutrophierung).
- Die bisherigen landesbezogenen Lehrplanquellen in den Inhaltspaketen bleiben erhalten.

Eine unabhängige fachpädagogische Freigabe durch Lehrkräfte wird nicht behauptet. `teacher-review-pending` bleibt bestehen. Sinnvolle weitere Fachprüfung: didaktische Schwierigkeitseinstufung im konkreten BvB-Reha-Unterricht sowie regelmäßiger Abgleich geänderter Wahlrechtsregeln. Diese Prüfung ist keine noch fehlende technische Implementierung.

## Validierung

`npm run validate:complexes` berichtet Anzahl, Zuordnung, Schwierigkeitsverteilung und Kartenbestand für alle 14 Komplexe. Automatische Prüfung von IDs, Fragetext-Dubletten, Optionen, Lösungen und Mindestumfang; zusätzliche Zod-Validierung in der App und Unit-Tests.

Produktionsbuild und alle **226 Unit-Tests** bestanden. **47 unterschiedliche gezielte Browserprüfungen** bestanden (nach Anpassung veralteter Testbezeichnungen und Bestandszahlen): neue 4/5/5-Auswahl in beiden Darstellungen; Einzel-/Mehrfachwahl, leere Auswahl, zehn Fragen ohne Wiederholung und mit gleichmäßiger Verteilung, erneute Auswahl vor der nächsten Runde, getrennte lokale Einstellungen, Streber, alte und neue gespeicherte Runden, Offline-Fortsetzung, Lernkarten und neue eigene Karte, fünf echte Runden bis zur Bossfreischaltung, Abbruch/Sieg/Timeout, einmalige Statistik, Lernzeit und Hauptmenü-/Hilferegression. Neue Auswahl auf 320×568, 390×844 und 1440×900 ohne Dokument- oder Auswahlscrollen; lange Titel vollständig lesbar. Im Lernkasten bleibt der bestehende Scrollbereich auf kurzen Displays erhalten. Keine Prüfung auf physischen iOS-/Android-Geräten.
