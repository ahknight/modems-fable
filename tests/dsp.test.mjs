// Signal-level tests: every claim of "per spec" in the players should be
// backed here by decoding the synthesized audio with an independent receiver.

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { demodFsk, demodQam, tonePower } from '../docs/js/dsp/analysis.js';
import { SR, asyncText, crc16, descrambler, qam, rrc, scrambler, ucodeLinear } from '../docs/js/dsp/core.js';
import { ANSWERER, CALLER } from '../docs/js/handshakes/call.js';
import { FSK_PLANS, fsk300 } from '../docs/js/handshakes/fsk300.js';
import { V22BIS_POINTS, v22 } from '../docs/js/handshakes/v22.js';

const ones = (n) => new Array(n).fill(1);
const window = (t0, t1) => [Math.round(t0 * SR), Math.round(t1 * SR)];
const segment = (call, who, label) => call.segments.find((s) => s.who === who && s.label === label);

/** Nearest constellation point index for each received symbol. */
function slice(received, ideal) {
  const out = [];
  for (let k = 0; k < received.length; k += 2) {
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < ideal.length; i += 2) {
      const d = (received[k] - ideal[i]) ** 2 + (received[k + 1] - ideal[i + 1]) ** 2;
      if (d < bestD) [best, bestD] = [i >> 1, d];
    }
    out.push(best);
  }
  return out;
}

/** Demodulate a whole symbol track and return received points plus worst error distance. */
function receive(call, track, alpha, carrier) {
  const count = track.points.length >> 1;
  const rx = demodQam(call.channels[track.who], { symRate: track.symRate, carrier, alpha, t0: track.t0, count });
  let worst = 0;
  for (let i = 0; i < rx.length; i += 2) {
    const scaled = [rx[i] / 0.2 / Math.SQRT2, rx[i + 1] / 0.2 / Math.SQRT2];
    worst = Math.max(worst, Math.hypot(scaled[0] - track.points[i], scaled[1] - track.points[i + 1]));
    rx[i] = scaled[0];
    rx[i + 1] = scaled[1];
  }
  return { rx, worst };
}

test('scramblers reproduce the opening patterns printed in V.32 5.2.3', () => {
  const run = (a, b) => ones(30).map(scrambler(a, b)).join('');
  assert.equal(run(18, 23), '111111111111111111000001111111'); // call mode, GPC
  assert.equal(run(5, 23), '111110000011111000001110011111'); // answer mode, GPA
});

test('descrambler inverts scrambler', () => {
  const data = Array.from({ length: 500 }, (_, i) => (i * 7 + (i >> 3)) & 1);
  const s = scrambler(14, 17);
  const d = descrambler(14, 17);
  assert.deepEqual(data.map(s).map(d), data);
});

test('root-raised-cosine pulse has unit energy and no singularities', () => {
  for (const alpha of [0.1, 0.25, 0.75]) {
    let energy = 0;
    for (let i = -4000; i <= 4000; i++) energy += rrc(i / 100, alpha) ** 2 / 100;
    assert.ok(Math.abs(energy - 1) < 0.01, `alpha ${alpha}: energy ${energy}`);
    assert.ok(Number.isFinite(rrc(1 / (4 * alpha), alpha)));
  }
});

test('QAM modulator round-trips through the matched-filter receiver', () => {
  const sym = Float32Array.from({ length: 400 }, (_, i) => [1, -1, 3, -3][(i * 5 + (i >> 2)) & 3] / Math.sqrt(10));
  for (const [symRate, carrier, alpha] of [[600, 1200, 0.75], [2400, 1800, 0.25], [24000 / 7, 1959, 0.12], [19200 / 7, 1646, 0.12]]) {
    const { samples, start, t0 } = qam(sym, { symRate, carrier, alpha, span: 12, t0: 0.5 });
    const signal = new Float32Array(Math.round((start + 1) * SR) + samples.length);
    signal.set(samples, Math.round(start * SR));
    const rx = demodQam(signal, { symRate, carrier, alpha, t0, count: 200, span: 12 });
    for (let i = 24; i < 376; i++) assert.ok(Math.abs(rx[i] - sym[i]) < 0.06, `${symRate} baud symbol ${i}: ${rx[i]} vs ${sym[i]}`);
  }
});

test('mu-law Ucodes match Table 1/V.90', () => {
  assert.deepEqual([0, 1, 6, 64, 65, 70, 127].map(ucodeLinear), [0, 8, 48, 1980, 2108, 2748, 32124]);
});

test('CRC-16 register is self-checking', () => {
  const data = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0];
  const residue = crc16([...data, ...crc16(data)]);
  assert.deepEqual(residue, crc16([...ones(12), ...crc16(ones(12))]));
});

for (const plan of ['bell103', 'v21']) {
  test(`${plan}: carriers sit on the standard frequencies and the text decodes`, () => {
    const call = fsk300({ plan });
    const freqs = FSK_PLANS[plan];
    for (const [who, side] of [[CALLER, 'caller'], [ANSWERER, 'answerer']]) {
      const track = call.bitTracks.find((b) => b.who === who);
      const [from, to] = window(track.t0 + 0.05, track.t0 + 0.3);
      assert.ok(tonePower(call.channels[who], freqs[side].mark, from, to) > 0.03, 'idle carrier is the mark tone');
      const bits = demodFsk(call.channels[who], { baud: 300, ...freqs[side], t0: track.t0, count: track.bits.length });
      assert.deepEqual(bits, [...track.bits]);
      const text = track.chars.map(({ bit }) => String.fromCharCode(bits.slice(bit + 1, bit + 9).reduce((v, b, i) => v | (b << i), 0))).join('');
      assert.equal(text, track.chars.map((c) => c.ch).join(''));
    }
    assert.match(call.bitTracks.find((b) => b.who === CALLER).chars.map((c) => c.ch).join(''), /GUEST/);
  });
}

test('V.25 answer tone is 2100 Hz for 3.3 s after 1.8-2.5 s of silence', () => {
  const call = v22({ rate: 1200 });
  const ans = segment(call, ANSWERER, 'ANS 2100 Hz');
  assert.ok(ans.t0 >= 1.8 && ans.t0 <= 2.5);
  assert.ok(Math.abs(ans.t1 - ans.t0 - 3.3) < 0.01);
  assert.ok(tonePower(call.channels[ANSWERER], 2100, ...window(ans.t0 + 0.1, ans.t1 - 0.1)) > 0.03);
  assert.ok(tonePower(call.channels[ANSWERER], 2100, ...window(0.1, ans.t0 - 0.1)) < 1e-6);
});

test('V.22: timers match 6.3.1 and scrambled ones descramble to ones', () => {
  const call = v22({ rate: 1200 });
  const usb1 = segment(call, ANSWERER, 'USB1');
  const callerSb1 = segment(call, CALLER, 'SB1 1200');
  const answererSb1 = segment(call, ANSWERER, 'SB1 1200');
  assert.ok(Math.abs(callerSb1.t0 - usb1.t0 - 0.611) < 0.002, 'caller waits 155 + 456 ms');
  assert.ok(Math.abs(answererSb1.t1 - answererSb1.t0 - 0.765) < 0.002, 'answerer sends SB1 for 765 ms');
  // USB1 is a steady -90 degrees per symbol: a tone 150 Hz below the 2400 Hz carrier.
  assert.ok(tonePower(call.channels[ANSWERER], 2250, ...window(usb1.t0 + 0.05, usb1.t1 - 0.05)) > 0.02);

  const track = call.symbolTracks.find((t) => t.who === CALLER);
  const { rx, worst } = receive(call, track, 0.75, 1200);
  assert.ok(worst < 0.12, `worst symbol error ${worst}`);
  // Differentially decode the caller's symbols and descramble: SB1 must be all ones.
  const quadrant = (re, im) => (Math.round((Math.atan2(im, re) - Math.atan2(1, 3)) / (Math.PI / 2)) + 8) & 3;
  const turnBits = [[0, 1], [0, 0], [1, 0], [1, 1]];
  const d = descrambler(14, 17);
  const decoded = [];
  for (let k = 1; k < track.points.length / 2; k++) {
    const turn = (quadrant(rx[2 * k], rx[2 * k + 1]) - quadrant(rx[2 * k - 2], rx[2 * k - 1]) + 4) & 3;
    decoded.push(...turnBits[turn].map(d));
  }
  const sb1Symbols = Math.round((callerSb1.t1 - callerSb1.t0) * 600);
  assert.ok(decoded.slice(34, 2 * sb1Symbols - 2).every((b) => b === 1), 'SB1 descrambles to ones');
  const text = asyncText('GUEST\r').join('');
  assert.ok(decoded.join('').includes(text), 'the typed text is recoverable from the audio');
});

test('V.22 bis: S1 exchange, 600 ms shift, and all sixteen points in use', () => {
  const call = v22({ rate: 2400 });
  const callerS1 = segment(call, CALLER, 'S1');
  const answererS1 = segment(call, ANSWERER, 'S1');
  const fast = segment(call, ANSWERER, 'SB1 2400');
  assert.ok(Math.abs(callerS1.t1 - callerS1.t0 - 0.1) < 0.002);
  assert.ok(answererS1.t0 >= callerS1.t1, 'answerer replies after the caller’s S1 ends');
  assert.ok(Math.abs(fast.t0 - answererS1.t0 - 0.6) < 0.003, '2400 starts 600 ms after the rate decision');
  assert.ok(Math.abs(fast.t1 - fast.t0 - 0.2) < 0.002);

  const track = call.symbolTracks.find((t) => t.who === ANSWERER);
  const { rx, worst } = receive(call, track, 0.75, 2400);
  assert.ok(worst < 0.12, `worst symbol error ${worst}`);
  const ideal = Float32Array.from(V22BIS_POINTS.flat().map((v) => v / Math.sqrt(10)));
  const from = Math.round((fast.t0 - track.t0) * 600) + 2;
  const used = new Set(slice(rx.subarray(2 * from), ideal));
  assert.equal(used.size, 16);
});

test('Bell 212A answer uses 2225 Hz in place of unscrambled ones', () => {
  const call = v22({ rate: 1200, answer: 'bell' });
  const answer = segment(call, ANSWERER, '2225 Hz');
  assert.ok(tonePower(call.channels[ANSWERER], 2225, ...window(answer.t0 + 0.05, answer.t1 - 0.05)) > 0.03);
  assert.equal(segment(call, ANSWERER, 'ANS 2100 Hz'), undefined);
});
