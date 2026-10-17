# LernKick

Produktkontext aus dem vom Nutzer zur Umsetzung übergebenen Briefing, Stand 17.10.2026.

Mobile installierbare Lern-PWA für Jugendliche einer BvB-Reha-Klasse. Ziel ist die Vorbereitung auf den qualifizierten Hauptschulabschluss in Sachsen-Anhalt. Kurze, verständliche Runden fördern Erfolgserlebnisse; Fehler führen zu Erklärungen und späteren Wiederholungen. Keine Bestrafung und keine Badges.

React, TypeScript, Vite, Workbox und IndexedDB. Statisches Hosting auf GitHub Pages; keine Accounts, Tracker oder Backend-Abhängigkeiten. Lernstände bleiben auf dem Gerät. Eigene Karten werden getrennt von redaktionellen Fragen gespeichert. Inhalte sind versionierte JSON-Dateien mit stabilen IDs.

Umsetzung: zehn Fragen je Runde in allen fünf Fächern, je 100 Fragen im Bestand. Die Aufgaben sind selbst erstelltes Übungsmaterial und keine offiziellen Prüfungsfragen. Die Recherche offizieller Lehrplanquellen liegt vor; der konkrete Prüfungsweg und die Freigabe durch Fachlehrkräfte bleiben abzugleichen.

Gestaltung laut Brief: Streetstyle/Skater/Arcade, kräftige Akzente, klare Kontraste, große Touchflächen, zurückhaltende Animationen. Annahme zur ersten Demo: dunkle neutrale Fläche, Limettengrün, kräftige kondensierte Überschriften, Fachfarben. Diese konkrete Ausgestaltung ist eine vorläufige Annahme bis zur Rückmeldung.

Aktueller Umfang auf Nutzerwunsch: 100 Fragen je Fach, insgesamt 500. Quellen und Anforderungen wurden am 17.10.2026 recherchiert; Fachlehrpläne Sekundarschule (Dokumentstand 01.08.2019) und aktuelle verlinkte bLf-Fachhinweise bilden die Orientierung. Alle fünf Fächer spielbar. Die Oberfläche trägt keine Demo-Kennzeichnung; die offene Freigabe durch Fachlehrkräfte wird in den Einstellungen erklärt. Inhaltsrevision und Lehrplanbezüge sind im Format 2 dokumentiert; Nutzerdaten werden aus Format 1 und 2 verlustfrei in Format 3 übernommen.

Bestätigte Nutzervorgabe für die Startseite: auf eine Handy-Bildschirmhöhe reduzieren, Update rechts neben dem Logo, alle fünf Fächer und Navigation ohne Scrollen erreichbar. Werbe-Einstieg, große Grafik und verzichtbare Erklärungstexte entfernen; die Bedienung über einen kleinen Hilfe-Button erklären.

Bei falschen Antworten bleibt die Erklärung ohne Zeitlimit stehen; weiter geht es ausschließlich manuell. Richtige Antworten wechseln nach drei Sekunden, mit weiterhin verfügbarer Pause. Das gilt auch für die letzte Frage einer Runde.

Mathe-Pilot laut Entwicklungsauftrag: kleine veränderliche Kompetenzen, deterministische Aufgabenvarianten, freiwillige Hilfestufen und Lernweg-Wahl. Kein Zeitdruck bei der Antwort, keine Interpretation von Antwortgeschwindigkeit. Mosaik-Meilensteine bleiben dauerhaft erhalten. Fünf getrennte neutrale Bildplatzhalter; aufwendige finale Bildwelten und neue Kompetenzbäume der anderen Fächer folgen später.

Fachauswahl auf ausdrücklichen Nutzerwunsch als abgerundete quadratische Buttons mit MA, D, SK, Bio und Geo. Vollständige Fachnamen bleiben zugänglich. Verlassen einer laufenden Runde über Zurückpfeil oder Logo erst nach eigener Bestätigung; die Automatik pausiert während der Abfrage.

Fortschritt auf ausdrücklichen Nutzerwunsch: nur Überschrift „Fortschritt“, Fachkürzel und das jeweilige Bild auf einer Bildschirmhöhe. Keine sichtbaren Erklärtexte, Zähler, Kompetenzlisten oder Bestleistungen. Die Bezeichnung „Wimmelbild“ entfällt in der Oberfläche. Bestleistungen und Kompetenzdaten bleiben gespeichert.

Bestätigte Überarbeitung vom 17.10.2026: Lernform zuerst (Lernrunde, Freies Üben, Karten), Fach danach. Eigener Alltagswortschatz mit Auswahlantworten und eigenen Einträgen. 75 bearbeitbare Standardkarten; persönliche Löschungen und Bearbeitungen bleiben von Updates getrennt. Selbstbewertung „Gewusst“ / „Noch üben“ plant Kartenwiederholungen. Zwölf Fortschrittsfelder je Fach: vier richtige von fünf verschiedenen selbstständig gelösten Aufgaben, Wiederholungssperre 24 Stunden; alte Felder bleiben erhalten. Hilfe stark gekürzt, Sicherungen in Einstellungen oben kompakt erreichbar.

Erweiterungsauftrag: Unteren Schriftzug entfernen, Kartensuche und Sortierung mit zehn Einträgen pro Schritt, vier eigenständige Lernspiele aus bestehendem Lernstoff. Keine neuen Fächer. Aktive Spielansichten kompakt ohne Scrollen auf typischen Handys; Bildschirmtasten vermeiden eine zusätzliche OS-Tastatur.
