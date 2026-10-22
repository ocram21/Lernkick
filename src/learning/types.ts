import type {Equation} from './equations';
import type { Question } from '../lib/schema';
export type Pace = 'easier' | 'fit' | 'challenge';
export type HelpLevel = 0 | 1 | 2 | 3;
export type TaskHelp = { hint: string; example: string; alternate: string; visual?: { kind: 'number-line' | 'groups'; start: number; change: number } };
export type LearningTask = Question & { skillId: string; signature: string; help: TaskHelp; generated?: { version: 1; operands: [number, number]; operation: 'compare' | 'add' | 'subtract' | 'multiply' | 'divide' | 'estimate' | 'percent' | 'equation' }; equation?:Equation; support?: boolean };
