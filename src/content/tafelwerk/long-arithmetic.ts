export type ArithmeticStep = {
  headline: string;
  formula: string;
  explanation: string;
  visual: Record<string, any>;
  sub?: string;
};

const intString = (raw: string, name: string) => {
  if (!/^\d+$/.test(raw)) throw new Error(`${name} muss eine nichtnegative ganze Zahl sein.`);
  return BigInt(raw).toString();
};

const rightAligned = (value: string, columns: number) => {
  const cells: (string | null)[] = Array(columns).fill(null);
  [...value].forEach((digit, i) => { cells[columns - value.length + i] = digit; });
  return cells;
};

function multiplySnapshot(input: {
  top: string;
  bottom: string;
  columns: number;
  partials: { label: string; cells: (string | null)[]; complete: boolean }[];
  activeTopIndex?: number;
  activeBottomIndex?: number;
  carryIn?: { value: string; column: number };
  resultCells?: (string | null)[];
  addCarry?: { value: string; column: number };
  activeAddColumn?: number;
  final?: boolean;
  result?: string;
}) {
  return { type: 'multiplication-grid', ...input };
}

export function buildMultiplicationSteps(topInput: string, bottomInput: string): ArithmeticStep[] {
  const top = intString(topInput, 'Der erste Faktor');
  const bottom = intString(bottomInput, 'Der zweite Faktor');
  const columns = top.length + bottom.length;
  const steps: ArithmeticStep[] = [];
  let partials: { label: string; cells: (string | null)[]; complete: boolean }[] = [];
  steps.push({
    headline: 'Faktoren stellenrichtig aufschreiben', formula: `${top} × ${bottom}`,
    explanation: 'Richte beide Faktoren rechtsbündig aus: Einer unter Einer, Zehner unter Zehner. Jede Ziffer bekommt eine feste Spalte.',
    visual: multiplySnapshot({ top, bottom, columns, partials })
  });

  const topDigits = [...top].map(Number);
  const bottomDigits = [...bottom].map(Number);
  for (let bottomIndex = bottomDigits.length - 1; bottomIndex >= 0; bottomIndex--) {
    const multiplierDigit = bottomDigits[bottomIndex];
    const place = bottomDigits.length - 1 - bottomIndex;
    const placeName = place === 0 ? 'Einer' : place === 1 ? 'Zehner' : place === 2 ? 'Hunderter' : `${10 ** place}er`;
    const outDigits: number[] = [];
    let carry = 0;
    const label = `× ${multiplierDigit} ${placeName}`;

    for (let topIndex = topDigits.length - 1; topIndex >= 0; topIndex--) {
      const incoming = carry;
      const total = topDigits[topIndex] * multiplierDigit + incoming;
      const resultDigit = total % 10;
      carry = Math.floor(total / 10);
      outDigits.unshift(resultDigit);
      const productPrefix = outDigits.join('');
      const partialDigits: (string | null)[] = Array(columns).fill(null);
      const shiftedEnd = columns - 1 - place;
      [...productPrefix].forEach((digit, i) => {
        const col = shiftedEnd - productPrefix.length + 1 + i;
        if (col >= 0 && col < columns) partialDigits[col] = digit;
      });
      const completes = topIndex === 0;
      if (completes && carry > 0) {
        const col = shiftedEnd - productPrefix.length;
        if (col >= 0) partialDigits[col] = String(carry);
      }
      const visibleProduct = completes
        ? (BigInt(top) * BigInt(multiplierDigit) * (10n ** BigInt(place))).toString()
        : `${productPrefix}${'0'.repeat(place)}`;
      const visibleCells = completes ? rightAligned(visibleProduct, columns) : partialDigits;
      const working = [...partials, { label, cells: visibleCells, complete: completes }];
      const carryCell = incoming > 0 ? { value: String(incoming), column: columns - top.length + topIndex } : undefined;
      const action = `${topDigits[topIndex]} × ${multiplierDigit}${incoming ? ` + ${incoming} Übertrag` : ''} = ${total}`;
      const factorPlace=topDigits.length-1-topIndex;
      const factorPlaceName=factorPlace===0?'Einer':factorPlace===1?'Zehner':factorPlace===2?'Hunderter':`${10**factorPlace}er`;
      const outputPlace=factorPlace+place;
      const outputPlaceName=outputPlace===0?'Einer':outputPlace===1?'Zehner':outputPlace===2?'Hunderter':`${10**outputPlace}er`;
      let explanation = `${action}. Schreibe ${resultDigit} in die ${outputPlaceName}stelle des Teilprodukts`;
      if (carry > 0 && topIndex > 0) explanation += ` und übertrage ${carry} zur nächsten Ziffer links.`;
      else if (carry > 0) explanation += `; die übrigen ${carry} stehen als führende Ziffer des Teilprodukts.`;
      else explanation += '.';
      steps.push({
        headline: completes ? `Teilprodukt ${label.replace('× ', '')} fertigstellen` : `${factorPlaceName}ziffer ${topDigits[topIndex]} mit ${multiplierDigit} multiplizieren`,
        formula: '', explanation,
        visual: multiplySnapshot({ top, bottom, columns, partials: working, activeTopIndex: topIndex, activeBottomIndex: bottomIndex, carryIn: carryCell })
      });
    }
    const product = (BigInt(top) * BigInt(multiplierDigit) * (10n ** BigInt(place))).toString();
    partials = [...partials, { label, cells: rightAligned(product, columns), complete: true }];
  }

  const product = (BigInt(top) * BigInt(bottom)).toString();
  if (partials.length > 1) {
    const resultDigits: (string | null)[] = Array(columns).fill(null);
    let carry = 0;
    for (let col = columns - 1; col >= 0; col--) {
      const addends = partials.map(partial => Number(partial.cells[col] ?? 0));
      const total = addends.reduce((sum, digit) => sum + digit, carry);
      const digit = total % 10;
      const carryOut = Math.floor(total / 10);
      resultDigits[col] = String(digit);
      steps.push({
        headline: `Teilprodukte addieren · Spalte ${columns - col}`,
        formula: '',
        explanation: `${addends.join(' + ')}${carry ? ` + Übertrag ${carry}` : ''} = ${total}. Schreibe ${digit}${carryOut ? ` und übertrage ${carryOut} eine Spalte nach links` : ''}.`,
        visual: multiplySnapshot({ top, bottom, columns, partials, resultCells: [...resultDigits], addCarry: carryOut > 0 && col > 0 ? { value: String(carryOut), column: col - 1 } : undefined, activeAddColumn: col })
      });
      carry = carryOut;
    }
  }
  steps.push({
    headline: 'Produkt und Probe', formula: `${top} × ${bottom} = ${product}`,
    explanation: `Die Teilprodukte sind stellengerecht addiert: ${top} × ${bottom} = ${product}.`,
    visual: multiplySnapshot({ top, bottom, columns, partials, resultCells: rightAligned(product, columns), final: true, result: product })
  });
  return steps;
}

type DivisionGroup = {
  partial: string;
  start: number;
  end: number;
  quotientIndex: number;
  quotientDigit: string;
  product?: string;
  remainder?: string;
  brought?: { rest: string; digit: string; from: number; to: number };
  phase: 'selected' | 'subtracted';
};

function divisionSnapshot(input: {
  dividend: string;
  divisor: string;
  quotientCells: string[];
  groups: DivisionGroup[];
  activeGroup?: number;
  activeIndex?: number;
  final?: boolean;
  quotient?: string;
  remainder?: string;
}) { return { type: 'division-grid', ...input }; }

export function buildDivisionSteps(dividendInput: string, divisorInput: string): ArithmeticStep[] {
  const dividend = intString(dividendInput, 'Der Dividend');
  const divisor = intString(divisorInput, 'Der Divisor');
  if (BigInt(divisor) === 0n) throw new Error('Der Divisor darf nicht 0 sein.');
  const digits = [...dividend];
  const quotientCells = Array(digits.length).fill('');
  const groups: DivisionGroup[] = [];
  const steps: ArithmeticStep[] = [];
  const snapshot = (extra: Partial<Parameters<typeof divisionSnapshot>[0]> = {}) => divisionSnapshot({ dividend, divisor, quotientCells: [...quotientCells], groups: groups.map(group => ({ ...group, brought: group.brought && { ...group.brought } })), ...extra });
  steps.push({ headline: 'Dividend, Divisor und Quotient anordnen', formula: '', explanation: `Wir teilen ${dividend} durch ${divisor}. Wir beginnen links und nehmen so viele Dividendziffern, bis die Teilzahl mindestens ${divisor} ist.`, visual: snapshot() });

  let prefix = '';
  let initialEnd = -1;
  while (initialEnd + 1 < digits.length && BigInt(prefix || '0') < BigInt(divisor)) {
    initialEnd++;
    prefix += digits[initialEnd];
  }
  if (BigInt(prefix || '0') < BigInt(divisor)) {
    quotientCells[0] = '0';
    steps.push({
      headline: 'Dividend kleiner als Divisor', formula: `${dividend} < ${divisor}`,
      explanation: `${dividend} ist kleiner als ${divisor}. Der ganzzahlige Quotient ist 0; der Rest bleibt ${dividend}.`,
      visual: snapshot({ final: true, quotient: '0', remainder: dividend })
    });
    return steps;
  }

  let q = BigInt(prefix) / BigInt(divisor);
  let rem = BigInt(prefix) % BigInt(divisor);
  const initialGroup: DivisionGroup = { partial: prefix, start: 0, end: initialEnd, quotientIndex: initialEnd, quotientDigit: q.toString(), phase: 'selected' };
  groups.push(initialGroup);
  quotientCells[initialEnd] = q.toString();
  steps.push({
    headline: `Erste Teilzahl ${prefix} betrachten`, formula: `${prefix} : ${divisor} = ${q}`,
    explanation: initialEnd > 0 && BigInt(digits[0]) < BigInt(divisor)
      ? `${digits[0]} ist kleiner als ${divisor}. Deshalb beginnen wir mit ${prefix}. ${divisor} passt ${q}-mal hinein; schreibe ${q} über die letzte Ziffer dieser Teilzahl.`
      : `${divisor} passt ${q}-mal in ${prefix}. Schreibe ${q} über die Einerstelle dieser Teilzahl.`,
    visual: snapshot({ activeGroup: 0, activeIndex: initialEnd })
  });
  initialGroup.product = (q * BigInt(divisor)).toString();
  initialGroup.remainder = rem.toString();
  initialGroup.phase = 'subtracted';
  steps.push({ headline: `${prefix} minus ${initialGroup.product}`, formula: `${prefix} − ${initialGroup.product} = ${rem}`,
    explanation: `${q} × ${divisor} = ${initialGroup.product}. Schreibe ${initialGroup.product} unter ${prefix}, subtrahiere und notiere den Rest ${rem}.`,
    visual: snapshot({ activeGroup: 0, activeIndex: initialEnd }) });

  for (let index = initialEnd + 1; index < digits.length; index++) {
    const broughtDigit = digits[index];
    const previousRemainder = rem.toString();
    const partial = (rem * 10n + BigInt(broughtDigit)).toString();
    const start = Math.max(0, index - partial.length + 1);
    const qdigit = BigInt(partial) / BigInt(divisor);
    rem = BigInt(partial) % BigInt(divisor);
    const group: DivisionGroup = { partial, start, end: index, quotientIndex: index, quotientDigit: qdigit.toString(), brought: { rest: previousRemainder, digit: broughtDigit, from: index - 1, to: index }, phase: 'selected' };
    groups.push(group);
    const groupIndex = groups.length - 1;
    steps.push({
      headline: `Ziffer ${broughtDigit} herunterholen`, formula: `${previousRemainder} · 10 + ${broughtDigit} = ${partial}`,
      explanation: `Hole genau die nächste Ziffer ${broughtDigit} herunter. Aus Rest ${previousRemainder} und ${broughtDigit} entsteht die neue Teilzahl ${partial}.`,
      visual: snapshot({ activeGroup: groupIndex, activeIndex: index })
    });
    quotientCells[index] = qdigit.toString();
    if (qdigit === 0n) {
      steps.push({
        headline: 'Quotientenziffer 0 notieren', formula: `${partial} < ${divisor}`,
        explanation: `${partial} ist kleiner als ${divisor}. Schreibe deshalb 0 an diese Quotientenstelle. 0 × ${divisor} = 0; der Rest bleibt ${partial}.`,
        visual: snapshot({ activeGroup: groupIndex, activeIndex: index })
      });
    } else {
      steps.push({
        headline: `Quotientenziffer ${qdigit} bestimmen`, formula: `${partial} : ${divisor} = ${qdigit}`,
        explanation: `${divisor} passt ${qdigit}-mal in ${partial}. Schreibe ${qdigit} über die heruntergeholte Ziffer ${broughtDigit}.`,
        visual: snapshot({ activeGroup: groupIndex, activeIndex: index })
      });
    }
    group.product = (qdigit * BigInt(divisor)).toString();
    group.remainder = rem.toString();
    group.phase = 'subtracted';
    steps.push({
      headline: `${partial} minus ${group.product}`, formula: `${partial} − ${group.product} = ${rem}`,
      explanation: `${qdigit} × ${divisor} = ${group.product}. Subtrahiere unter der Teilzahl ${partial}; übrig bleibt der Rest ${rem}.`,
      visual: snapshot({ activeGroup: groupIndex, activeIndex: index })
    });
  }

  const firstQuotientIndex = quotientCells.findIndex(cell => cell !== '');
  const quotient = quotientCells.slice(firstQuotientIndex).join('') || '0';
  const remainder = rem.toString();
  steps.push({
    headline: 'Quotient, Rest und Probe', formula: `${dividend} : ${divisor} = ${quotient}${rem ? ` Rest ${remainder}` : ''}`,
    explanation: rem === 0n
      ? `Alle Ziffern sind verarbeitet. Die Probe stimmt: ${divisor} × ${quotient} = ${dividend}. Der Rest ist 0.`
      : `Alle Ziffern sind verarbeitet. Die Probe stimmt: ${divisor} × ${quotient} + ${remainder} = ${dividend}; ${remainder} ist kleiner als ${divisor}.`,
    visual: snapshot({ final: true, quotient, remainder })
  });
  return steps;
}

export function buildLongArithmeticSteps(kind: 'multiplication' | 'division', first: string, second: string) {
  return kind === 'multiplication' ? buildMultiplicationSteps(first, second) : buildDivisionSteps(first, second);
}
