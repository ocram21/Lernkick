# Feedback sicher aktivieren

Die PWA bleibt auf GitHub Pages. Das Formular ist eingebaut; ohne konfigurierte Endpoint-URL zeigt es klar „Versand wird noch eingerichtet“ und sendet nichts. Ein GitHub-Konto für Lernende ist nicht nötig. Der separate Cloudflare Worker in `server/feedback/worker.ts` erstellt Issues ausschließlich in `ocram21/Lernkick`. Kein Token im Frontend, Browser, Export oder Git-Repository.

## Einmalige externe Einrichtung

1. Cloudflare-Konto und Workers-Zugang bereitstellen. Im Worker-Verzeichnis mit Wrangler anmelden: `npx wrangler login`.
2. Einen neuen, zeitlich begrenzten **fine-grained GitHub-Token** erstellen: ausschließlich Repository **ocram21/Lernkick**, Repository-Berechtigung **Issues: Read and write** (zuzüglich automatisch nötigem Metadata-Lesezugriff). Keinen vorhandenen breit berechtigten CLI-Token verwenden. Issues müssen im Repository aktiviert sein.
3. Im Verzeichnis `server/feedback` den Token über `npx wrangler secret put GITHUB_TOKEN` als Server-Secret eingeben. Nicht in eine Datei, Chatnachricht oder Shell-Befehlszeile kopieren. Ein unabhängiges zufälliges Secret (mindestens 32 zufällige Bytes) über `npx wrangler secret put RATE_SALT` eingeben.
4. `wrangler.toml` prüfen. `ALLOWED_ORIGIN` bleibt für diese App `https://ocram21.github.io`. Bei anderen Workern im selben Cloudflare-Konto gegebenenfalls freie Rate-Limit-Namespace-IDs wählen; gleiche IDs teilen Zähler. Dann `npx wrangler deploy` ausführen. Es werden keine neuen App-Konten oder Datenbanken benötigt.
5. Die entstandene öffentliche URL mit Pfad `/feedback` als GitHub-Repository-Variable **VITE_FEEDBACK_ENDPOINT** setzen, beispielsweise `https://lernkick-feedback.<subdomain>.workers.dev/feedback`. Das ist eine öffentliche URL, kein Secret. Anschließend den bestehenden Pages-Workflow mit `publish=true` ausführen. Lokal dieselbe URL in `.env.local` setzen und neu bauen.
6. Eine ausdrücklich als Test markierte Nachricht aus der App senden, das neue Issue im bestehenden Repository prüfen und wieder schließen. Kein echter Testversand wurde ohne eingerichteten Worker behauptet. Fehler- und Erfolgspfad sind automatisiert mit simuliertem GitHub-Dienst geprüft.

## Schutz und Grenzen

Nur POST/JSON, exakte Origin-Prüfung und CORS; Pflichtnachricht 1–3000 Zeichen, Name bis 80, Bereich bis 100, Request maximal 16 KiB auch bei falschem Content-Length. Nutzereingaben werden als wörtlicher Text eingebettet, um Markdown und Erwähnungen nicht aktiv werden zu lassen. Namen sind freiwillig; leer bleibt anonym. Das Formular weist vor dem Senden auf öffentliche Issues und den Verzicht auf sensible/private Angaben hin.

Zwei verpflichtende Cloudflare-Bindings begrenzen auf 10 Versuche je Netzadresse/Minute und 30 insgesamt/Minute pro Cloudflare-Standort. Das sind einfache, standortbezogene Missbrauchsgrenzen, kein weltweit exaktes Kontingent und keine Authentifizierung. Schulnetze können gemeinsam an die Grenze stoßen und nach einer Minute erneut senden. Ohne Bindings oder Secrets verweigert der Worker den Versand. CORS allein verhindert keine absichtlichen Bot-Anfragen. Bei gezieltem Missbrauch zuerst Versand deaktivieren (Variable leeren und neu veröffentlichen bzw. Worker pausieren), bei Bedarf später zusätzliche Bot-Abwehr ergänzen.

Die Plattform verarbeitet notwendige Netzwerkdaten. Die Anwendung erzeugt keine Geräte-ID und überträgt keine Lernstände, Browserkennung oder Karten. Für den Kurzzeitbegrenzer wird die Netzadresse nur in einen minütlich wechselnden HMAC umgewandelt; keine rohe IP geht an GitHub, in Anwendungslogs oder in einen eigenen Datenspeicher. Worker-Observability ist deaktiviert; Hosting-Anbieter können eigene technische Verbindungsdaten verarbeiten. Inhaltsdaten stehen anschließend öffentlich bei GitHub; freiwillige Namen sind ebenso öffentlich. Vor echtem Einsatz Datenschutzhinweise und Betreiberangaben um Cloudflare/GitHub und den Feedbackzweck ergänzen.

Das Formular löscht seine Felder erst nach bestätigtem Erfolg. Bei Fehlern bleiben sie im offenen Formular erhalten; es gibt keine automatische erneute Übermittlung. Bei Zeitüberschreitung kann ein Issue bereits entstanden sein: vor erneutem Senden prüfen, um Doppelmeldungen zu vermeiden. Kein lokales Langzeitspeichern privater Feedbackentwürfe. Verlassen/Neuladen verwirft den Entwurf. Token-Ablauf, Entzug und Rotation sind Betreiberaufgaben.

## Quellen

- [GitHub: Issue anlegen und minimale Token-Berechtigung](https://docs.github.com/en/rest/issues/issues#create-an-issue)
- [Cloudflare: Rate-Limit-Bindings und ihre standortbezogenen Grenzen](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Cloudflare: Server-Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
