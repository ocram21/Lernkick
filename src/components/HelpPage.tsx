import {boxHelpParagraphs} from '../study/boxHelp';
import {ExitButton} from './ExitButton';

// Current help content, including expandable sections.
export const helpSections=[
 {title:'Training und Schwierigkeit',paragraphs:[
  'Wähle Mathematik, Deutsch, Sozialkunde, Biologie oder Geographie. In Mathematik und Deutsch kannst du Themen auswählen. In Biologie, Geografie und Sozialkunde wählst du vor jeder neuen Fragenrunde einen oder mehrere Lernkomplexe. Die zehn Fragen werden ausschließlich aus deiner Auswahl gemischt. Mehrere Komplexe kommen möglichst ausgewogen vor. Üben setzt bei unveränderter Auswahl deine angefangene Runde fort. Eine andere Auswahl beginnt eine neue Runde; bereits verbuchte Erfolge bleiben erhalten. Die globale Schwierigkeit bleibt wirksam. Deutsch enthält auch Begriffe, Satzbau, Grammatik, Rechtschreibung und Sprichwörter. Lies die Rückmeldung nach deiner Antwort. Pause zeigt dir bisherige Aufgaben; danach kannst du fortsetzen.',
  'Normal und Streber stellen die Schwierigkeit global ein. Streber bietet anspruchsvollere Aufgaben in den Bereichen, die diese Einstellung unterstützen.']},
 {title:'Games',paragraphs:[
  'Wähle Zahlenpuzzle, Bildpuzzle oder Codeknacker direkt aus. Beim Puzzle schiebst du eine benachbarte Kachel in die Lücke. Ordne die Zahlen oder die Berglandschaft; unten rechts bleibt frei.',
  'Beim Codeknacker suchst du in Normal drei unterschiedliche Farben aus fünf, in Streber vier aus sechs. Die Variante bleibt für die laufende Runde fest. Tippe eine Position und danach eine Farbe an. Eine bereits verwendete Farbe wird getauscht. Prüfen bewertet alle ausgefüllten Positionen. Du hast zehn Versuche.',
  'Schwarz bedeutet: Farbe und Position stimmen. Weiß bedeutet: Farbe stimmt, Position nicht. Grau bedeutet: keine weitere passende Farbe. Bei noch offenen Versuchen sind alle Punkte grau und noch unbewertet. Die Rückmeldung gehört zu keiner bestimmten Position.',
  'Jede gewonnene Games-Runde bringt einmal 100 Score-Punkte. Verlieren oder Abbrechen bringt keine Punkte. Die drei Zahlen auf der Games-Kachel zählen Siege je Spiel. Spielstände bleiben beim Wechseln und Neuladen erhalten. Nur Neue Runde startet das ausgewählte Spiel neu.']},
 {title:'Weitere Spiele',paragraphs:[
  'Galgenraten: Finde das Wort mit den Buchstabentasten. Im Deutschlandquiz ordnest du zuerst die Bundesländer und dann ihre Hauptstädte zu.',
  'Dual N-Back: Vergleiche Position und Ton mit dem Reiz N Schritte zuvor. Melde passende Positionen und Töne getrennt. 1-Back und 2-Back sind direkt wählbar; 3-Back wird nach bestandenem 2-Back frei. Markierungen auf der Startseite zeigen gemeisterte Stufen.']},
 {title:'Lernkasten',paragraphs:boxHelpParagraphs},
 {title:'Score und Skill',paragraphs:[
  'Score zählt deine Punkte aus dem Training und den Games. Skill zeigt deine Lernstärke. Für mindestens 30 aktive Lernminuten erhältst du einmal pro Kalendertag ein Siebtel des Höchstwerts. Von null auf 100 Prozent brauchst du sieben erfüllte Tagesziele; an einem Tag geht das nicht.',
  'Jeder Tag unter 30 Minuten senkt den bestehenden Skill-Wert um zehn Prozent, zum Beispiel von 80 auf 72 Prozent. Pausen, Hintergrund und lange Untätigkeit zählen nicht.']},
 {title:'Bosskampf und Statistik',details:true,paragraphs:[
  'Fünf vollständig abgeschlossene Runden in einem Fach laden dessen Roboter. Sobald ein Fach geladen ist, kannst du Bosskampf einschalten und dieses Fach wählen. Du hast drei Minuten für zehn Aufgaben; acht richtige Antworten gewinnen. Ein beendeter Kampf verbraucht diese Ladung. Beim Abbrechen bleibt sie erhalten.',
  'Die große Zahl auf einer Fachkachel zählt abgeschlossene Runden seit Beginn der Erfassung. Daneben stehen gewonnene und verlorene Bosskämpfe. Der Roboter zeigt die Ladung von null bis fünf.',
  'Tippe auf Score oder Skill für die Monatsstatistik. Wähle einen Monat und einen Bereich. Die Tagesbalken zeigen deine Lernminuten. Lernminuten stammen aus vollständig abgeschlossenen Runden und beendeten Bosskämpfen. Unvollständige Runden, Pausen, Hintergrund und lange Untätigkeit zählen dort nicht. Frühere Zeiten werden nicht geschätzt.']},
 {title:'Einstellungen und Sicherung',paragraphs:[
  'Kompakt verringert die Abstände. Mit Pink wechselt die Darstellung. Beide Einstellungen ändern keine Lernstände.',
  'Deine Daten liegen nur auf diesem Gerät. Exportiere regelmäßig eine Sicherung. Importieren übernimmt eine zuvor gespeicherte Sicherung. Es gibt keine automatische Synchronisierung. Daten löschen setzt Lernstände zurück; die Rückfrage zeigt dir, was erhalten bleibt.']},
 {title:'App installieren und offline lernen',details:true,paragraphs:[
  'Öffne die App einmal vollständig online. Android: Browser-Menü, App installieren. iPhone: Safari, Teilen, Zum Home-Bildschirm. Danach kannst du offline üben. App aktualisieren lädt eine neue Version; deine gespeicherten Lernstände bleiben erhalten.']}
];
export function HelpPage({onExit}:{onExit:()=>void}){
 return <section className="help-page concise-help"><ExitButton onClick={onExit}/><h1>Kurze Hilfe</h1>{helpSections.map(section=>section.details?<details key={section.title} className={section.title.startsWith('Boss')?'boss-help':'install-help'}><summary>{section.title}</summary>{section.paragraphs.map(text=><p key={text}>{text}</p>)}</details>:<div key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(text=><p key={text}>{text}</p>)}</div>)}</section>;
}
