# Dual N-Back – Eingabetasten, 24.10.2026

Nach `lernkick_dual_n_back_codex.md`.

Geändert: `public/games/dual-n-back/index.html`. Der bisherige Hover-Hintergrund der Antworttasten wechselte auf die Spielfeldfarbe und konnte auf Touchgeräten sichtbar bleiben. Er verwendet jetzt dieselbe Grundfarbe wie die ruhende Taste.

Antworten werden unabhängig über `pointerdown` registriert; es gibt keine Beschränkung auf den primären Finger und keine gemeinsame Touch-Sperre. Touch verhindert nur das nachfolgende synthetische Mausereignis. Pointer-Klicks starten die Bestätigung nicht erneut; Tastatur-/assistive Klicks ohne Pointer sowie A/L bleiben verfügbar. Die bereits vorhandenen Timer sind pro Taste getrennt. Erneutes Drücken setzt nur den jeweiligen 200-ms-Timer zurück; die bestehende Wertungssperre je Kanal und Durchgang bleibt bestehen. Sequenz, Audio, Timing, Auswertung und gespeicherte Lernstände bleiben unverändert.

Zusätzlich: Release-Kennung `2026-10-24-nback-input`, gezielte Browserprüfung `tests/nback-input.spec.ts`, Designnotiz. Keine Datenmigration und keine anderen Oberflächenänderungen.

Validierung: Produktionsbuild erfolgreich; 12 bestehende N-Back-/Bestandsschutz-Unit-Tests bestanden. Acht gezielte Browserfälle erfolgreich (sechs bestehende Fälle sowie zwei neue Fälle in Standard/Pink). Die neuen Fälle senden zwei echte gleichzeitige Browser-Touchpunkte, prüfen beide erfassten Antworten und Rahmen, versetzte/repetitive Eingaben, unabhängiges Ablaufen der Timer, stabile Grundfarbe auch bei Maus-Hover und die vollständige Rundenauswertung gegen die aus der gespeicherten Sequenz erwarteten Fehler. Eine zunächst falsche Zeitschrittberechnung im Test wurde korrigiert; beide abschließenden Mehrfingerfälle bestanden.
