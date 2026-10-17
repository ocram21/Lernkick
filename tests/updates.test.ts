import { afterEach, describe, expect, it, vi } from 'vitest';
import { findUpdate } from '../src/lib/updates';
function registration(values = {}) { return { waiting: null, installing: null, update: vi.fn().mockResolvedValue(undefined), ...values } as unknown as ServiceWorkerRegistration; }
afterEach(() => vi.useRealTimers());
describe('Manuelle Aktualisierung', () => {
  it('meldet aktuell erst nach erfolgreicher Online-Prüfung', async () => {const reg=registration();await expect(findUpdate(reg)).resolves.toBe(false);expect(reg.update).toHaveBeenCalledOnce();});
  it('erkennt eine bereits vollständig geladene Version', async () => {await expect(findUpdate(registration({waiting:{}}))).resolves.toBe(true);});
  it('wartet auf die vollständige Installation', async () => {const worker=Object.assign(new EventTarget(),{state:'installing'});const reg=registration({installing:worker});const pending=findUpdate(reg);await Promise.resolve();Object.assign(reg,{waiting:worker});worker.state='installed';worker.dispatchEvent(new Event('statechange'));await expect(pending).resolves.toBe(true);});
  it('meldet einen Netzwerkfehler statt fälschlich aktuell zu behaupten', async () => {await expect(findUpdate(registration({update:vi.fn().mockRejectedValue(new Error('offline'))}))).rejects.toThrow('Internetverbindung');});
  it('bricht nach einer Zeitgrenze verständlich ab', async () => {vi.useFakeTimers();const pending=findUpdate(registration({update:()=>new Promise(()=>{})}),100);const check=expect(pending).rejects.toThrow('dauert zu lange');await vi.advanceTimersByTimeAsync(100);await check;});
  it('behandelt eine gescheiterte Installation als Fehler', async () => {const worker=Object.assign(new EventTarget(),{state:'redundant'});await expect(findUpdate(registration({installing:worker}))).rejects.toThrow('nicht vollständig');});
});
