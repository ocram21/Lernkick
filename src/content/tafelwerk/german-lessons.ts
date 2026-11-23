export type GermanItem = { term: string; example: string; note: string; emphasis?: string };
export type GermanLesson = {
  id: string;
  category: 'grammatik';
  title: string;
  goal: string;
  items: GermanItem[];
};

export const germanCategories = [{id:'grammatik',title:'Grammatik'}] as const;

// Reine Nachschlagebeispiele: keine Aufgaben, Bewertung oder Lösungsschalter.
export const germanLessons: GermanLesson[] = [
  {id:'DEU-01',category:'grammatik',title:'Die zehn Wortarten',goal:'Wortarten an kurzen Beispielen erkennen.',items:[
    {term:'Nomen',example:'der Bus',note:'Namenwort; groß.'},
    {term:'Verb',example:'fahren · sein',note:'Tätigkeit, Zustand.'},
    {term:'Adjektiv',example:'ein roter Bus',emphasis:'roter',note:'Eigenschaft.'},
    {term:'Artikel',example:'der · ein',note:'Begleitet Nomen.'},
    {term:'Pronomen',example:'sie · wir',note:'Stellvertreter.'},
    {term:'Numerale',example:'drei Busse',emphasis:'drei',note:'Zahlwort.'},
    {term:'Adverb',example:'heute · dort',note:'Zeit, Ort usw.'},
    {term:'Präposition',example:'mit dem Bus',emphasis:'mit',note:'Verhältnis; mit + Dativ.'},
    {term:'Konjunktion',example:'und · weil',note:'Verbindet.'},
    {term:'Interjektion',example:'Oh!',note:'Ausruf.'}
  ]},
  {id:'DEU-02',category:'grammatik',title:'Satzglieder: Umstellprobe',goal:'Die Teile eines Satzes und ihre Funktion.',items:[
    {term:'Subjekt',example:'Mia liest ein Buch.',emphasis:'Mia',note:'Mia ist hier das Subjekt; es steht im Nominativ.'},
    {term:'Prädikat',example:'Mia liest ein Buch.',emphasis:'liest',note:'Das Verb sagt hier, was Mia tut.'},
    {term:'Akkusativobjekt',example:'Mia liest ein Buch.',emphasis:'ein Buch',note:'Ergänzt hier das Verb lesen.'},
    {term:'Zeitangabe · Umstellprobe',example:'Am Morgen liest Mia ein Buch.',emphasis:'Am Morgen',note:'Auch möglich: Mia liest am Morgen ein Buch. „Am Morgen“ bleibt eine Einheit.'}
  ]},
  {id:'DEU-03',category:'grammatik',title:'Die vier Fälle',goal:'Derselbe Hund in vier Fällen.',items:[
    {term:'Nominativ',example:'Der Hund schläft.',emphasis:'Der Hund',note:'Das Subjekt steht im Nominativ.'},
    {term:'Genitiv',example:'Das Fell des Hundes glänzt.',emphasis:'des Hundes',note:'Zeigt hier die Zugehörigkeit.'},
    {term:'Dativ',example:'Ich helfe dem Hund.',emphasis:'dem Hund',note:'Das Verb helfen verlangt den Dativ.'},
    {term:'Akkusativ',example:'Ich sehe den Hund.',emphasis:'den Hund',note:'Das Verb sehen verlangt hier den Akkusativ.'}
  ]},
  {id:'DEU-04',category:'grammatik',title:'Hauptsatz und Nebensatz',goal:'Das gebeugte Verb und die Satzgrenze erkennen.',items:[
    {term:'Hauptsatz',example:'Mia bleibt zu Hause.',emphasis:'bleibt',note:'Im Aussagesatz steht das gebeugte Verb an zweiter Satzgliedstelle.'},
    {term:'Nebensatz nach dem Hauptsatz',example:'Mia bleibt zu Hause, weil sie krank ist.',emphasis:'ist',note:'Das Komma trennt die Sätze. Nach weil steht das gebeugte Verb am Ende.'},
    {term:'Nebensatz vor dem Hauptsatz',example:'Weil Mia krank ist, bleibt sie zu Hause.',emphasis:'bleibt',note:'Nach dem vorangestellten Nebensatz folgt im Hauptsatz direkt das gebeugte Verb.'}
  ]},
  {id:'DEU-06',category:'grammatik',title:'Fünf häufige Zeitformen',goal:'Zeitformen am gleichen Verb vergleichen.',items:[
    {term:'Präsens',example:'Ich spiele.',note:'Gegenwart; mit Zeitangabe auch Zukunft.'},
    {term:'Präteritum',example:'Ich spielte.',note:'Vergangenheit; oft in Erzählungen.'},
    {term:'Perfekt',example:'Ich habe gespielt.',note:'haben oder sein + Partizip II; Vergangenheit.'},
    {term:'Plusquamperfekt',example:'Ich hatte gespielt.',note:'hatte oder war + Partizip II; vor einem vergangenen Ereignis.'},
    {term:'Futur I',example:'Ich werde spielen.',note:'werden + Infinitiv; Zukunft oder Vermutung.'}
  ]}
];
