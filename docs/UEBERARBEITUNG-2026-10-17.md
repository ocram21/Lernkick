# Überarbeitung nach Gesprächsprotokoll

Die jetzige ausdrückliche Nutzerbeauftragung zur Überarbeitung ersetzt den im Protokoll dokumentierten älteren Stand „nur lesen“. Bestehende 500 Fragen, Kompetenzdaten, Bestleistungen, Freischaltungen und eigene Karten bleiben erhalten.

Bestätigte Ergänzungen im laufenden Gespräch: Wortschatz mit Auswahlantworten; vorsichtige 80-%-Regel jetzt einführen.

## Umsetzungsentscheidungen

- Start: drei Lernformen zuerst, dann Fachkürzel; Wortschatz als gesonderter Einstieg. Kartenverwaltung bleibt in der Navigation.
- 15 kurze Standardkarten je Fach als vorläufiger Anfangsbestand. Ein unveränderlicher Katalog und persönliche Bearbeitungen/Ausblendungen sind getrennt. Wiederherstellen entfernt nur Ausblendungen; eigene Karten und Bearbeitungen werden nicht überschrieben.
- Kartenlernen: Antwort aufdecken, selbst „Gewusst“ oder „Noch üben“ wählen. Keine erfundenen Auswahlantworten. Fällige Karten zuerst; bis zu zehn Karten je Runde. Bekannte Karten nach 1/3/7/14/30 Tagen, „Noch üben“ nach zehn Minuten. Selbstbewertungen sind kein unabhängiger Kompetenznachweis und entsperren keine Prüfungs-Mosaikfelder.
- Wortschatz: eigener, alltagssprachlicher Fragenbestand mit redaktionell formulierten Auswahlantworten. Für eigene Einträge werden neben Wort und Bedeutung mindestens zwei falsche Antwortmöglichkeiten eingegeben; keine automatische Erfindung möglicher Bedeutungen. Fachfragen und Alltagswortschatz bleiben getrennt.
- Sichtbarer Fortschritt: zwölf Felder bleiben. Je Fach ein Fenster von fünf unabhängigen, verschiedenen Aufgaben, davon mindestens vier richtig ohne Hilfe. Direkte Wiederholungen derselben Aufgabensignatur innerhalb 24 Stunden zählen nicht erneut. Hilfe ist erlaubt, wird aber nicht als selbstständiger Nachweis ausgegeben. Nach Freigabe beginnt ein neues Fenster; erworbene Felder bleiben bestehen. Zeitversetzte Kompetenzfestigung wird weiterhin separat bewertet. Alte Freischaltungen werden angerechnet.
- Kompakte Sicherungsaktionen oben in Einstellungen, Installation beibehalten; Quellen/Über-Informationen einklappbar darunter. Der sichtbare Bewegungsschalter entfällt; gespeicherte Präferenz und Betriebssystem-Einstellung bleiben wirksam.
- Kurze Hilfe in kleinen Abschnitten, jeweils höchstens etwa fünf Sätze; praktische Android-/iPhone-Installation bleibt enthalten.
- Kurze Antworten nebeneinander, auch bei zwei/drei Optionen und nach Beantwortung, sofern sie wirklich kurz sind; längere Texte bleiben untereinander. Weiter-Aktion bleibt erreichbar.

Neue Datenversion 3 liest Sicherungen 1 und 2. Standardkarten werden nicht still in eigene Karten kopiert; persönliche Änderungen und Löschungen überleben Updates, Export und Import. Inhalte und didaktische Grenzwerte sind redaktionelle Arbeitsannahmen, keine amtliche oder lehrkräfteseitige Freigabe. Kein durchgeführter Lernenden-Test wird behauptet.

## Bestand und Prüfung

Umgesetzt: 75 Standardkarten (15 je Fach), 25 Alltagswörter mit Auswahlantworten, persönliche Bearbeitungen und eigene Ergänzungen. Die bestehenden 500 Fachfragen bleiben unverändert. Karten- und Wortschatzkataloge stehen unter `src/content/standardCards.json` und `src/content/vocabulary.json`. Neue Browserprüfungen decken alle fünf Kartenfächer, persönliche Änderungen/Wiederherstellung, leere Bestände, eigene Offline-Wortschatzfragen, Sicherungsaktionen und kurze Matheantworten ab.

Abschlussprüfung: 48 Logiktests bestanden, Produktionsbuild erfolgreich. Alle 44 Browserfälle einschließlich Erreichbarkeit sämtlicher 500 Fragen bestanden (vollständiger Lauf plus gezielte Wiederholung nach Korrektur einer Testzuordnung für gleichlautende Deutsch-/Wortschatzfragen). Die neuen Ansichten wurden am kleinen Handy und Desktop geprüft. Reale Geräteinstallation und fachliche Abnahme bleiben gesonderte Praxisschritte.
