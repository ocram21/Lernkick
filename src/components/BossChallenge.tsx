import { useRef, useState } from 'react';
import { Bot, BookOpen, Globe, Leaf, Hash, Brain, CaseSensitive, MapPin, Search } from 'lucide-react';
import { questions } from '../content';
import { words } from '../activities/content';
import { moduleIds, moduleRules, type ModuleId } from '../learning/journey';
const figures = [Bot, BookOpen, Search, Leaf, Globe, CaseSensitive, Hash, MapPin, Brain];
export function BossChallenge({ module, level, onResult }: {
    module: ModuleId;
    level: number;
    onResult: (won: boolean) => void;
}) {
    const answered = useRef(false);
    function finish(won: boolean) { if (answered.current)
        return; answered.current = true; onResult(won); }
    const [challenge] = useState(() => {
        if (module === 'nback')
            return { prompt: 'Merke dir diese Folge: A – B – A. Stimmt der letzte Buchstabe mit dem zwei Schritte zuvor überein?', options: ['Ja', 'Nein'], correct: 0 };
        if (module === 'germany')
            return { prompt: 'Welche Stadt ist die Landeshauptstadt von Sachsen-Anhalt?', options: ['Magdeburg', 'Berlin', 'Halle'], correct: 0 };
        if (module === 'hangman' || module === 'vocabulary') {
            const word = words[(level * 7) % words.length];
            return { prompt: `Was bedeutet „${word.word}“?`, options: [word.meaning, ...word.distractors], correct: 0 };
        }
        const pool = questions.filter(q => q.subject === module);
        return pool[(level * 7) % pool.length];
    });
    const Figure = figures[(moduleIds.indexOf(module) + Math.floor(level / 5) - 1) % figures.length];
    return <section className={`boss-challenge boss-${module}`}><Figure size={32} style={{ color: ['var(--calc-violet)', 'var(--calc-orange)', 'var(--calc-ink)', 'var(--calc-orange)'][Math.floor(level / 5) % 4] }}/><h2>{moduleRules[module].boss} · Bonus</h2><p>{challenge.prompt}</p><div className="answers">{challenge.options.map((answer, i) => <button className="answer" key={answer} onClick={() => finish(i === challenge.correct)}>{answer}</button>)}</div><button className="text-button" onClick={() => finish(false)}>Ohne Bonus weiter</button></section>;
}
