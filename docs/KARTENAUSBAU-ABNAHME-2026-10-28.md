# Abnahme: Kartenausbau, Daten-Neustart und Codeknacker · 28.10.2026

Grundlage: `LERNKICK_CODEX_FOLGEAUFTRAG_2026-10-27.md`, `CODEX-MASTERMIND-NORMAL-STREBER.md` und ausdrücklicher Wunsch, die Farbbuchstaben zu entfernen.

## Ergebnis und tatsächliche Bestände

**758 aktive Standardkarten, alle 25 bestehenden Unterrubriken mit mindestens 30 und höchstens 80 Karten.** 436 neue Karten, 112 vorhandene Merkkarten als gezielte Abruffragen mit passenden Musterantworten überarbeitet. Alle 322 Bestands-IDs bleiben vorhanden. Keine zusätzlichen Rubriken und keine Änderungen an den Trainingsfragen. Die Fachfragenbasis und die vorhandenen Trainingsformate wurden je Rubrik als Ausgangsmaterial berücksichtigt; der Folgeauftrag erweitert Karten, nicht erneut Trainingspools.

Vorher wurde `standardCards` aus dem unveränderten Checkout geladen. Nachher wurden die tatsächliche Laufzeit-Zuordnung und die sichtbaren Zähler geprüft, einschließlich der bisherigen Altrubrik-Abbildung. Nicht lediglich Rohzahlen einer Inhaltsdatei addiert. `npm run validate:cards` gibt die aktuellen Zahlen aus.

| Fach | Unterrubrik | Vorher | Neu | Nachher |
|---|---|---:|---:|---:|
| Mathematik | Grundrechenarten | 10 | 20 | 30 |
| Mathematik | Brüche & Dezimalzahlen | 4 | 26 | 30 |
| Mathematik | Prozent & Zinsen | 5 | 25 | 30 |
| Mathematik | Geometrie | 6 | 24 | 30 |
| Mathematik | Daten & Diagramme | 3 | 27 | 30 |
| Deutsch | Wortarten | 7 | 23 | 30 |
| Deutsch | Satzglieder & Satzbau | 7 | 23 | 30 |
| Deutsch | Zeitformen | 5 | 25 | 30 |
| Deutsch | Texte & Kommunikation | 8 | 22 | 30 |
| Sozialkunde | Die BRD – ein demokratischer und sozialer Staat | 37 | 0 | 37 |
| Sozialkunde | Wahlen | 17 | 13 | 30 |
| Sozialkunde | Familie und Umwelt | 17 | 13 | 30 |
| Biologie | Zellen | 21 | 9 | 30 |
| Biologie | Stoff- und Energiewechsel des Menschen | 23 | 7 | 30 |
| Biologie | Lebewesen in ihrer Umwelt | 28 | 2 | 30 |
| Biologie | Sinnes- und Nervenfunktionen des Menschen | 10 | 20 | 30 |
| Geografie | Räumliche Disparitäten und Verflechtungen | 31 | 0 | 31 |
| Geografie | Doppelkontinent Amerika | 19 | 11 | 30 |
| Geografie | Wirtschaftsraum Deutschland | 22 | 8 | 30 |
| Mathematik | Größen & Einheiten | 2 | 28 | 30 |
| Deutsch | Rechtschreibung & Zeichensetzung | 3 | 27 | 30 |
| Sozialkunde | Medien | 11 | 19 | 30 |
| Geografie | Europäische Union | 10 | 20 | 30 |
| Geografie | Weltwirtschaftsmacht USA | 8 | 22 | 30 |
| Sozialkunde | Freizeit und Drogen | 8 | 22 | 30 |

**Gesamt: 322 + 436 = 758.** Die Rubriken mit 37 bzw. 31 Karten werden nicht künstlich auf 30 reduziert. Persönliche Karten zählen für diese Abnahme nicht mit.

## Redaktionsplan und semantische Stichprobe je Unterrubrik

Die Tabelle benennt die beim Bestandsvergleich gefundenen Lücken, ergänzte Wissens-/Verstehens-/Anwendungsziele, berücksichtigte Trainingsbasis und redaktionell quergelesene Stichproben. Nummern ohne weiteren Präfix beziehen sich auf `standard.expansion.<Rubrik>.<Nummer>`. „Überarbeitet“ bezeichnet `standard.complex.<Rubrik>.01–08`. Quellenkürzel werden unten aufgelöst.

| Unterrubrik | Bestandslücke | Kompetenzabdeckung | Quellen / vorhandene Trainingsbasis | Semantische Stichprobe |
|---|---|---|---|---|
| Grundrechenarten | Begriffe vorhanden; Strategien, Umkehrung und begründetes Prüfen ausbauen | Null, Rechenrangfolge, Verteilen, Rest, negative Zahlen, Teilbarkeit, Potenzen, Gleichungsprobe | M, KM; Grundrechenarten/Generatoren | 006: Distributivgesetz; 019: Gleichung und Probe |
| Brüche & Dezimalzahlen | Nur vier Grunddefinitionen; Operationen und Darstellungswechsel fehlen | Anteile, unechte/gemischte Brüche, Größenvergleich, gemeinsamer Nenner, vier Rechenarten, Dezimalrechnung | M, KM; Bruch-/Dezimalaufgaben | 013: 7/12; 018: 5/6; 020: 1/8 |
| Prozent & Zinsen | Grundbegriffe vorhanden; Bezugsgrößen und mehrschrittige Anwendungen ergänzen | Umwandeln, alle drei Grundaufgaben, Rabatt, Aufschlag, Prozentpunkte, Faktoren, einfache Zinsen und Zinseszins | M, KM; Prozent-/Zinsaufgaben | 012: 96 statt 100; 021: Schulmodell 360 Tage; 023: 121 Euro |
| Geometrie | Sechs Grundbegriffe; Beziehungen und Anwendung fehlen | Winkel, Figuren, Umfang/Flächen, Kreis, Pythagoras, Körper, Symmetrie, Koordinaten, zusammengesetzte Flächen | M, KM; Geometrieaufgaben | 009: 12 cm²; 016: 5 cm; 017: 30 cm³ |
| Daten & Diagramme | Drei Definitionen; Diagrammkritik und Zufall ausbauen | Häufigkeiten, Diagrammwahl, Skalen, Kennwerte, Stichproben, Korrelation, Wahrscheinlichkeit, Unabhängigkeit | M, KM; Daten-/Zufallsfragen | 012: Median 4,5; 014: Mittelwert 3000; 024: unabhängige Münzwürfe |
| Wortarten | Sieben Definitionen; Anwendung und Formenbildung fehlen | Wortart/Satzglied, Nominalisierung, Flexion, Artikel/Pronomen, Verbarten, Steigerung, Adverb/Zahlwort | D, KD, IDS; Grammatik und Deutschfragen | 008: Infinitiv; 019: Adverb; 023: Kontextabhängigkeit |
| Satzglieder & Satzbau | Grundbegriffe vorhanden; Satzbau und funktionale Verknüpfung ergänzen | Proben, Satzglieder/Attribut, Satzklammer, Frage/Aufforderung, Ursache/Folge/Bedingung/Gegensatz, Relativsatz, Kongruenz | D, KD, IDS; Satzbau und Grammatik | 001: Umstellprobe; 019: obwohl; 022: unklarer Pronomenbezug |
| Zeitformen | Fünf Definitionen; Bildung, Gebrauch und Reihenfolge ergänzen | Regelmäßige/starke Verben, Hilfsverben, Partizipformen, Vorzeitigkeit, Gebrauch, Futur II, Vermutung, Passivabgrenzung | D, KD, IDS; Grammatik/Deutschfragen | 010: telefoniert; 012: Vorzeitigkeit; 024: Passiv statt Futur |
| Texte & Kommunikation | Textsortenbegriffe vorhanden; Verstehen und eigenes Handeln ausbauen | Informationssuche, Erschließen/Belegen, Perspektive, Anweisung, Stellungnahme, Bewerbung/Beschwerde, Absätze, Überarbeitung | D, KD; Deutschfragen und berufsbezogene Texte | 004: Schlussfolgern; 006: Autor/Erzähler; 013: Bewerbung |
| Die BRD – ein demokratischer und sozialer Staat | 37 Karten; keine Mengenergänzung nötig, Merkkarten schärfen | Verfassungsgrenzen, Minderheiten, gerichtliche Kontrolle, kommunale Zuständigkeit, Opposition, Beiträge/Steuern, Beteiligung | S, GG; soc-state (50) | Überarbeitet 02: Mehrheit/Grundrechte; 07: Verhältnismäßigkeit |
| Wahlen | Grundbegriffe vorhanden; Verfahren und Anwendung ergänzen | Unmittelbar/frei, Wahlalter/Wahlart, Beteiligung, Nichtwählen, Zweitstimmendeckung, Sperrklausel, Hilfsperson, Stimmen/Sitze | S, GG, WAHL; soc-elections (50) | 003: Bundestag ab 18; 007: Deckung/Einzelbewerber; 010: Hilfsperson |
| Familie und Umwelt | Begriffe und Merkkarten; konkretes Alltagsurteil ausbauen | Sorgearbeit, Budget, Rücklagen, Rollen, Bedürfnisse, Ich-Botschaften, Grenzen, Kinderrechte, Barrieren, Wohnumfeld | S, GG, BGB; soc-family (50 Trainingsfragen) | 004: Jahresrechnung; 010: Gewaltfreiheit; 011: Zugangshindernisse |
| Zellen | 21 Karten; Struktur/Funktion und Erkenntnisgewinn ergänzen | Zellwand/Vakuole/Turgor, Ribosomen/Zellplasma, Mikroskop/Vergrößerung/Auflösung, kontrollierter Versuch | B, OS4, OS5; bio-cells (50) | 006: 400-fach; 008: Auflösung; 009: Kontrollansatz |
| Stoff- und Energiewechsel des Menschen | 23 Karten; Verdauung und Zusammenwirken konkretisieren | Speichel, Speiseröhrentransport, Magen, Enzyme, Dickdarm, Fließrichtung der Gefäße, Belastungsreaktion | B, OS34; bio-metabolism (50) | 002: aktiver Transport; 006: Arterie/Vene nach Fließrichtung |
| Lebewesen in ihrer Umwelt | 28 Karten; zwei zusätzliche Analyseziele, Merkkarten präzisieren | Nahrungsnetzfolgen und Trennung von Beobachtung/Erklärung; Stoff-/Energiefluss, Beziehungen und Verbindungen | B; bio-ecology (50) | 001: Räuberentfernung; 002: Beobachtung und Deutung |
| Sinnes- und Nervenfunktionen des Menschen | Zehn Karten; Sinnesorgane und Reizverarbeitung ausbauen | Reiz/Reaktion, ZNS/PNS, Bahnen, Reaktionszeit, Pupille/Linse/Netzhaut, Hören/Gleichgewicht, Geruch/Haut, Synapse, Schmerz/Lernen | B, OS35, OS36; bio-senses (50) | 008: Akkommodation; 014: Bogengänge; 018: Synapse |
| Räumliche Disparitäten und Verflechtungen | 31 Karten; keine Mengenergänzung nötig, Anwendung schärfen | Räumliche Durchschnittskritik, Infrastruktur, Lieferkette, Sektoren, Pendeln, Migration, BIP, Abhängigkeiten | G, BEA; geo-disparities (50) | Überarbeitet 04: Sektoren; 07: BIP ist kein persönliches Einkommen |
| Doppelkontinent Amerika | 19 Karten; regionale Mechanismen und Transfer ausbauen | Isthmus/Kanal, Relief/Regen, Wirbelstürme, Amazonas, kulturelle Raumbegriffe, ENSO, Landnutzung/Interessen | G, NOAA, USGS; geo-americas (50) | 004: Hurrikan/Tornado; 008: ENSO; 010: indigene Lebensräume |
| Wirtschaftsraum Deutschland | 22 Karten; Standort- und Nutzungskonflikte ergänzen | Häfen/Rhein, Standortbündel, Qualifikation, Siedlung/Versiegelung, Hochwasser, Windenergie, Flächenrecycling | G, UBA, USGS; geo-germany (50) | 005: Siedlung ist nicht Versiegelung; 008: Flächenrecycling |
| Größen & Einheiten | Zwei Grundkarten; Einheitenwechsel und Größenverständnis fehlen | Länge/Masse/Volumen/Fläche/Zeit, Geschwindigkeit, Energie/Leistung, Geld, Maßstab, Messunsicherheit | M, KM; Größen-/Einheitengeneratoren | 009: 1000 Liter; 019: 10 m/s; 020: −7 °C |
| Rechtschreibung & Zeichensetzung | Drei Grundkarten; Schreibstrategien und konkrete Zeichenregeln fehlen | Verlängern/Ableiten, kurze Vokale, ss/ß, Großschreibung, Anrede, Wortgruppen, Kommas, Rede, Merkwörter, Korrektur | D, KD, R; Rechtschreibung/Grammatik | 001: Hund/Hunde; 015: direkte Rede; 026: indirekte Frage |
| Medien | Grundbegriffe und Merkkarten; Belegprüfung und Medienhandeln ausbauen | Redaktion/Werbung, Interessen, Likes/Belege, Kontext, KI/Desinformation, Datenspuren, Rechte, Anhänge, Updates/Backup | S, KD, POL; soc-media (50) | 007: Originalbeleg; 010: KI ist kein Beleg; 019: Korrekturtransparenz |
| Europäische Union | Zehn Karten; Institutionen, Regeln und räumliche Anwendung ausbauen | Räte/Parlament/Kommission/Gericht/Bank, Verordnung/Richtlinie, Mitgliedschaft/Währung, Binnenmarkt, Grenzregion, Förderung/Agrar/Netze | G, EU; geo-eu (50) | 001: zwei Räte; 006: Rechtsakte; 019: grenzüberschreitender Fluss |
| Weltwirtschaftsmacht USA | Acht Merkkarten; räumliche und ökonomische Zusammenhänge ausbauen | Lage/Binnenmarkt, BIP/Verteilung, Industrie/Cluster, Agribusiness/Wasser, Häfen/Verkehr, Suburbanisierung/Metropole, Wohnen, Migration, Risiken | G, BEA, CENSUS, USGS; geo-usa (50) | 004: BIP; 013: Grundwasser; 017: funktionaler Stadtraum |
| Freizeit und Drogen | Acht Merkkarten; differenzierte Prävention und Freizeitplanung ausbauen | Risiken/Abhängigkeit, Toleranz/Entzug, Werbung, Nikotin, Gruppendruck, Spielen/Glücksspiel, Hilfe, Kosten, Erholung | S, BIOEG, GES, DRK; soc-leisure (50) | 003: Toleranz; 015: Verluste; Bestandskarte 08: Notfall/Atmung |

Alle Ergänzungen wurden eigenständig formuliert und auf eindeutige Frage/Antwort-Bezüge sowie Nähe zum Bestand redaktionell durchgesehen. Begriffsabruf und konkrete Anwendung eines Begriffs sind bewusst unterschiedliche Aufgaben. Reine Zahlenvarianten werden nicht als neue Lernziele verwendet. Beispiele mit Geld und Zinsen sind Schulmodelle mit ausdrücklich vorgegebenen Bedingungen, keine Produktberatung. 360 Zinstage werden ausdrücklich nur als Schulmodell bezeichnet. Politische Fragen vermeiden wechselnde Amtsinhaber, Umfragewerte und aktuelle Sitzverteilungen. Das Bundestagswahlalter und die Zweitstimmendeckung wurden am Prüfdatum amtlich abgeglichen.

### Dubletten und Nähe

Keine identischen normalisierten Vorderseiten, keine gleichen IDs. Zusätzlich Wortmengen-Jaccard ab 0,65 je Rubrik; die vier gemeldeten Paare wurden einzeln geprüft:

- `standard.math.v2.005` / `.006`: Kürzen gegenüber Erweitern; entgegengesetzte Operationen, keine Doppelkarte.
- `standard.expansion.units.007` / `.009`: Liter–Kubikdezimeter gegenüber Kubikmeter–Liter; unterschiedliche räumliche Größenordnungen.
- `standard.biology.v1.007` / `.011`: Ökosystem gegenüber Produzent im Ökosystem; Systembegriff gegenüber Organismenrolle.
- `standard.biology.v1.010` / `standard.biology.v2.034`: abiotischer gegenüber biotischem Umweltfaktor; fachlich notwendige Unterscheidung.

Eine weitere Unit-Prüfung ersetzt Zahlen in den Vorderseiten und prüft auf gleiche Aufgabenformen, erhält dabei Rechenzeichen. Sonst würden Bruchaddition, Bruchdivision und Dezimalmultiplikation fälschlich zu derselben Form zusammenfallen. Algorithmische Ähnlichkeit ersetzt keine semantische Begutachtung.

## Quellen und Prüfdatum

**Internetabgleich am 28.10.2026.** Verlinkte Lehrpläne haben weiterhin Dokumentstand 01.08.2019; Abrufdatum und Dokumentstand sind verschieden. Keine wörtlichen Aufgabenübernahmen. Bestehende Rechercheberichte `ANFORDERUNGEN-SACHSEN-ANHALT.md`, `LERNKASTEN-2026-10-21.md` und `LERNKOMPLEXE-2026-10-26.md` wurden als Vorarbeiten herangezogen.

- **M**: [Fachlehrplan Sekundarschule Mathematik](https://www.bildung-lsa.de/files/164f3f97e3adf65ff6f44685dd9e1ced/lp_sks_mathe_01_08_2019.pdf), insbesondere die im bisherigen Sachsen-Anhalt-Bericht genannten Grundlagen und Kompetenzbereiche.
- **D**: [Fachlehrplan Sekundarschule Deutsch](https://www.bildung-lsa.de/files/164f3f97e3adf65ff6f44685dd9e1ced/lp_sks_deutsch_01_08_2019_k2.pdf), insbesondere die im bisherigen Sachsen-Anhalt-Bericht genannten Grundlagen und Kompetenzbereiche.
- **S**: [Fachlehrplan Sekundarschule Sozialkunde](https://www.bildung-lsa.de/files/164f3f97e3adf65ff6f44685dd9e1ced/lp_sks_sozi_01_08_2019.pdf), insbesondere die im bisherigen Sachsen-Anhalt-Bericht genannten Grundlagen und Kompetenzbereiche.
- **B**: [Fachlehrplan Sekundarschule Biologie](https://www.bildung-lsa.de/files/164f3f97e3adf65ff6f44685dd9e1ced/lp_sks_biologie_01_08_2019.pdf), insbesondere die im bisherigen Sachsen-Anhalt-Bericht genannten Grundlagen und Kompetenzbereiche.
- **G**: [Fachlehrplan Sekundarschule Geographie](https://www.bildung-lsa.de/files/164f3f97e3adf65ff6f44685dd9e1ced/lp_sks_geo_01_08_2019.pdf), insbesondere die im bisherigen Sachsen-Anhalt-Bericht genannten Grundlagen und Kompetenzbereiche.

Zusätzliche Fachprüfgrundlagen:

- **KM**: [KMK Mathematik ESA/MSA 2022](https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2022/2022_06_23-Bista-ESA-MSA-Mathe.pdf): inhaltliche und prozessbezogene Ausrichtung.
- **KD**: [KMK Deutsch ESA/MSA 2022](https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2022/2022_06_23-Bista-ESA-MSA-Deutsch.pdf): Sprachgebrauch, Textverstehen und Schreiben.
- **R**: [Rat für deutsche Rechtschreibung, Amtliches Regelwerk 2024](https://www.rechtschreibrat.com/DOX/RfdR_Amtliches-Regelwerk_2024.pdf): Schreib- und Zeichensetzungsregeln.
- **IDS**: [IDS grammis: Tempus](https://grammis.ids-mannheim.de/terminologie/264), [Präsensperfekt](https://grammis.ids-mannheim.de/systematische-grammatik/259): Bildung und Gebrauch von Zeitformen; Unterscheidung Form und zeitlicher Bedeutung.
- **GG**: [Art. 20 GG](https://www.gesetze-im-internet.de/gg/art_20.html), [Art. 38 GG](https://www.gesetze-im-internet.de/gg/art_38.html): Staatsprinzipien und Bundestagswahl.
- **BGB**: [§ 1631 BGB](https://www.gesetze-im-internet.de/bgb/__1631.html): Gewaltfreiheit in der Erziehung. Inhalt im Suchabruf vorhanden; direkter Folgeabruf zeitweise Timeout.
- **WAHL**: [Bundeswahlleiterin: geltendes Wahlsystem](https://www.bundeswahlleiterin.de/bundestagswahlen/2025/informationen-waehler/wahlsystem.html): Stimmen, Zweitstimmendeckung, persönliche Stimmabgabe/Hilfsperson. Keine Vereinfachung zu einem garantierten Sitz bei jedem Wahlkreissieg.
- **BIOEG**: [BIÖG Suchtprävention](https://www.bioeg.de/themen/suchtpraevention/): Prävention und Unterstützungsorientierung. **GES**: [IQWiG Alkoholwirkung](https://www.gesundheitsinformation.de/wie-wirkt-alkohol-und-wie-schnell-wird-er-abgebaut.html), [gesund.bund.de: Alkoholvergiftung](https://gesund.bund.de/alkoholvergiftung): Gewöhnung und Notfallrisiken.
- **DRK**: [Atmung prüfen](https://www.drk.de/hilfe-in-deutschland/erste-hilfe/atmung/atemkontrolle/), [Prüfen, Rufen, Drücken](https://www.drk.de/hilfe-in-deutschland/erste-hilfe/erste-hilfe-massnahmen-zur-wiederbelebung-pruefen-rufen-druecken/): normale Atmung als Entscheidungskriterium; keine pauschale Seitenlage ohne Atemprüfung.
- **POL**: [Polizeiliche Kriminalprävention mit BSI: Checkliste Phishing](https://www.polizei-beratung.de/medienangebot/detail/351-checkliste-phishing/): digitale Täuschung und sichere Prüfung. Ein früher versuchter BSI-Detailpfad war nicht erreichbar und wird nicht als erfolgreich gelesen ausgegeben.
- **OS4**: [OpenStax: prokaryotische Zellen](https://openstax.org/books/biology-2e/pages/4-2-prokaryotic-cells), [eukaryotische Zellen](https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells): gemeinsame Strukturen und Pflanzen-/Tierzellen.
- **OS5**: [OpenStax: passiver Transport](https://openstax.org/books/biology-2e/pages/5-2-passive-transport): Membranen, Diffusion und Osmose.
- **OS34**: [OpenStax: Verdauungssysteme](https://openstax.org/books/biology-2e/pages/34-1-digestive-systems): Transport, Verdauung und Aufnahme.
- **OS35**: [OpenStax: Nervenzellen](https://openstax.org/books/biology-2e/pages/35-1-neurons-and-glial-cells): Reizleitung und Nervensystem.
- **OS36**: [Sinnesprozesse](https://openstax.org/books/biology-2e/pages/36-1-sensory-processes), [Sehen](https://openstax.org/books/biology-2e/pages/36-5-vision), [Hören/Gleichgewicht](https://openstax.org/books/biology-2e/pages/36-4-hearing-and-vestibular-sensation): Sinnesfunktionen. Der zunächst gescheiterte Hörseitenabruf gelang beim erneuten Abruf.
- **NOAA**: [El Niño/La Niña](https://www.noaa.gov/education/resource-collections/weather-atmosphere/el-nino): Zusammenhänge zwischen Pazifik und Wetterwirkungen; keine aktuelle ENSO-Prognose übernommen.
- **USGS**: [Wasserkreislauf](https://www.usgs.gov/water-science-school/water-cycle), [Grundwasser](https://www.usgs.gov/index.php/special-topics/water-science-school/science/groundwater-flow-and-water-cycle): Speicherung, Bewegung und Nutzung. Ein nicht vorhandener Erdbeben-Detailpfad wurde nicht als Quelle verwendet.
- **BEA**: [BIP-Definition](https://www.bea.gov/index.php/help/glossary/gross-domestic-product-gdp): Wirtschaftsleistung gegenüber individuellem Einkommen.
- **CENSUS**: [Städtische und ländliche Räume](https://www.census.gov/programs-surveys/geography/guidance/geo-areas/urban-rural.html): unterschiedliche Raumbegriffe, ohne wechselnde Zahlen als Lernpflicht zu setzen.
- **EU**: [EU-Organe und Aufgaben](https://european-union.europa.eu/institutions-law-budget/institutions-and-bodies/types-institutions-and-bodies_de): Institutionen und unterschiedliche Zuständigkeiten. Keine aktuelle Mitgliederzahl, Euro- oder Schengen-Liste festgeschrieben.
- **UBA**: [Siedlungs- und Verkehrsfläche](https://www.umweltbundesamt.de/daten/umweltzustand-trends/flaeche-boden-land-oekosysteme/flaechennutzung-in-deutschland/siedlungs-verkehrsflaeche): Siedlungsfläche ist nicht vollständig versiegelte Fläche.

## Daten-Neustart und Bestandsschutz

Die ausdrückliche Neustartfreigabe des Folgeauftrags wird einmalig mit der lokalen Epoche `cards-2026-10-28` umgesetzt. Beim ersten Laden ohne diese Marke werden der bisherige IndexedDB-Nutzerspeicher einschließlich alter Sicherungs-/Nebenstände in einer Transaktion geleert und ein frisches Profil sowie die Epochenmarke geschrieben. Eine alte lokale N-Back-Runde wird entfernt. Zugriffscode-/PWA-Zulassung wird nicht verändert.

Nach erfolgreichem Neustart bleiben neue Daten beim Reload und bei regulären Updates erhalten; die Epochenmarke bleibt konstant. Beschädigte Daten der neuen Epoche werden nicht stillschweigend verworfen. Der vorhandene Schutz gegen konkurrierende Schreibvorgänge bleibt. Standardinhalte und Trainingsfragen liegen außerhalb des Nutzerspeichers und werden nicht gelöscht.

Die Datenformatnummer bleibt 7. Es gibt keinen unnötigen Totalumbau; vorhandene Import-/Migrationshelfer bleiben für ausdrücklich importierte Sicherungen und bestehende Tests nutzbar. Alte lokale Profile werden im normalen Startpfad nicht mit dem frischen Profil vermischt. Die Freigabe wurde nicht als Auftrag zum Löschen von Standardkarten oder Trainingsaufgaben verstanden.

## Codeknacker

- Sichtbare Farbbuchstaben aus Palette, Eingabe, Historie und Lösung entfernt. Zugängliche Farbnamen an Buttons und Beschreibungen bleiben erhalten.
- Normal: drei unterschiedliche Farben aus fünf; Streber: vier aus sechs. Jeweils zehn Versuche, keine mehrfachen Farben im Geheimcode oder Versuch.
- Die Variante ist im Rundenschnappschuss gespeichert. Ein globaler Wechsel verändert diese Runde nicht; Neue Runde übernimmt die aktuelle globale Einstellung.
- Bestehendes Tauschen bereits belegter Farben bleibt erhalten; der Hinweis erklärt die Einmalverwendung. Richtige Position/Farbe bleibt schwarz, richtige Farbe an anderer Position weiß.
- Vollständige Enumeration in Tests: 60 beziehungsweise 360 mögliche Codes. Wiederholte Gewinne derselben Runde vergeben weiterhin nur einmal 100 Punkte.
- Bestehende Palette und Spielgestaltung bleiben; Spalten- und Rückmeldezahl passen sich an. Keine weitere Modusauswahl.

## Prüfungen

- `npm run validate:cards`: alle 758 Karten und 25 Rubriken gültig, Zielumfang erfüllt, keine exakten Dubletten; vier dokumentierte Ähnlichkeitshinweise.
- `npm run validate:complexes`: alle 14 unveränderten Trainingspools strukturell gültig, insgesamt 700 Sachfachfragen. Die übrigen Trainingsinhalte bleiben ebenfalls unverändert.
- `npm test`: alle **277 Tests in 32 Dateien** erfolgreich. Enthalten: Rubrik-Mindestumfang und aktive Aufgaben, IDs, Zahlenvariantenprüfung, Rechen-/Fachstichproben, Wiederholungsstufen/Abschlusskontrolle, beide Codevarianten mit Enumeration, Doppelfarben, Rückmeldungen, maximal zehn Versuche, fixierter Modus, einmalige Punkte und Datenvalidierung.
- Produktionsbuild erfolgreich; vorhandene Hinweise zu großen Bundle-Größen und fremden PURE-Kommentaren bleiben ohne Buildfehler.
- **66 unterschiedliche gezielte Browserprüfungen erfolgreich.** Im ersten Durchlauf 62 bestanden und drei alte Tests wegen fest angenommener vier Code-Stellen bzw. früherem Navigationsnamen fehlgeschlagen. Nach Anpassung der Testannahmen alle drei erfolgreich wiederholt; zusätzlich der normale dreistellige Sieg separat erfolgreich geprüft. Keine produktive Spielregel wurde zur Erfüllung einer veralteten Testannahme geändert.
- Neue Browserfälle: tatsächliche Zähler aller 25 Rubriken, 320 × 568, Normal/Pink, kein unnötiger Auswahlüberlauf; einmaliger Neustart aus ungültigen alten Daten samt Nebenständen; drei Bewertungen, Profilidentität, genaue Kartenposition und Reviews über Reload/Offline; drei/fünf und vier/sechs im Codeknacker, keine sichtbaren Farbbuchstaben, Tauschhinweis, globale Änderung erst bei neuer Runde und Speicherung; normaler Sieg samt dreistelliger Rückmeldung und nur einmal 100 Punkten nach Reload.
- Bestehende gezielte Regressionen: Lernkasten-Rhythmus, Fälligkeit/Häkchen/Import, Auswahl/Fortsetzen, Training/Statistik, Spiele-Zähler/Verlust/Offline sowie Smartphone-, Desktop- und Querformatansichten.
- Gezielte Sichtprüfung: Codeknacker Normal und Pink/Streber auf 320 × 568. Keine physische Android-Hardwareprüfung behauptet.

Releasekennung: `2026-10-28-card-expansion-codebreaker`. Die Live-Veröffentlichung wird nach dem Push separat geprüft.

## Grenzen der Abnahme

Die quantitative und technische Vorgabe ist geprüft. Redaktionelle Sach- und Sprachprüfung sowie semantische Stichproben sind erfolgt; es wird **keine unabhängige fachpädagogische Freigabe durch Lehrkräfte** behauptet. Offene Praxisprüfung: Passung von Textlänge und Schwierigkeit zur konkreten BvB-Reha-Gruppe, mündliche Bewertung und Vollständigkeit im individuellen Prüfungsweg. Das Angebot ersetzt keine Experimente, längeren Schreibaufgaben oder vollständige Prüfungssimulation. Rechtliche Grundlagen müssen bei Änderungen erneut geprüft werden. Keine ungeklärten Mengenlücken verbleiben.


## Geänderte Dateien

- Inhalt: `src/content/expansionCards.json` (436 neue Datensätze), `src/content/complexCards.json` (112 überarbeitete Bestandskarten), `src/study/cards.ts` (Integration und feste neue Rubrikzuordnung).
- Speicher: `src/lib/storage.ts` (einmalige Epoche, atomarer sauberer Profilstart).
- Codeknacker: `src/games/codebreaker.ts`, `arcade.ts`, `src/components/Codebreaker.tsx`, `GameHub.tsx`, `HelpPage.tsx`, `src/design/game-updates.css`.
- Prüfung: `scripts/validate-cards.mjs`, npm-Skript, neue Tests `card-expansion`, `codebreaker-modes`, `expansion-reset-codebreaker` sowie betroffene vorhandene Bestands-/Browserprüfungen.
- Release und Bericht: `public/release.json`, dieser Bericht. Domain- und Pages-Konfiguration bleiben unverändert.
