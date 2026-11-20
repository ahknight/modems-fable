// Signal-level tests: every "per spec" label in the players is backed here by
// decoding the synthesized audio with a receiver written separately from the
// transmitter, or by comparing against a pattern printed in the standard.

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { demodFsk, demodQam, tonePower } from '../docs/js/dsp/analysis.js';
import { SR, asyncText, crc16, descrambler, qam, rrc, scrambler, ucodeLinear } from '../docs/js/dsp/core.js';
import { AMP, ANSWERER, CALLER, FIDELITY } from '../docs/js/handshakes/call.js';
import { FSK_PLANS, fsk300 } from '../docs/js/handshakes/fsk300.js';
import { builders } from '../docs/js/handshakes/index.js';
import { V22BIS_POINTS, v22 } from '../docs/js/handshakes/v22.js';
import { V32BIS_TCM, V32_TCM, v32 } from '../docs/js/handshakes/v32.js';
import { PROBE_TONES, carrierFor, mpFrame, quarterConstellation, v34 } from '../docs/js/handshakes/v34.js';
import { DIL, pcmConstellation, v90 } from '../docs/js/handshakes/v90.js';

const ones = (n) => new Array(n).fill(1);
const window = (t0, t1) => [Math.round(t0 * SR), Math.round(t1 * SR)];
const segment = (call, who, label, nth = 0) => call.segments.filter((s) => s.who === who && s.label === label)[nth];
const contains = (haystack, needle) => haystack.join('').includes(needle.join(''));

/** Demodulate a whole symbol track from the audio; returns points in the track's normalized units. */
function receive(call, track, alpha, carrier, span = 8) {
  const count = track.points.length >> 1;
  const rx = demodQam(call.channels[track.who], { symRate: track.symRate, carrier, alpha, t0: track.t0, count, span });
  let worst = 0;
  for (let i = 0; i < rx.length; i++) {
    rx[i] /= AMP;
    worst = Math.max(worst, Math.abs(rx[i] - track.points[i]));
  }
  return { rx, worst };
}

/** Index of the nearest of `ideal` ([re, im] pairs) to received symbol k. */
function nearest(rx, k, ideal, scale) {
  let best = 0;
  let bestD = Infinity;
  ideal.forEach(([re, im], i) => {
    const d = (rx[2 * k] - re * scale) ** 2 + (rx[2 * k + 1] - im * scale) ** 2;
    if (d < bestD) [best, bestD] = [i, d];
  });
  return best;
}

/** Symbol index range of a section within a track. */
const sectionOf = (track, label, nth = 0) => track.sections.filter((s) => s.label === label)[nth];

test('scramblers reproduce the opening patterns printed in V.32 5.2.3', () => {
  const run = (a, b) => ones(30).map(scrambler(a, b)).join('');
  assert.equal(run(18, 23), '111111111111111111000001111111'); // call mode, GPC
  assert.equal(run(5, 23), '111110000011111000001110011111'); // answer mode, GPA
});

test('descrambler inverts scrambler', () => {
  const data = Array.from({ length: 500 }, (_, i) => (i * 7 + (i >> 3)) & 1);
  assert.deepEqual(data.map(scrambler(14, 17)).map(descrambler(14, 17)), data);
});

test('root-raised-cosine pulse has unit energy and no singularities', () => {
  for (const alpha of [0.12, 0.25, 0.75]) {
    let energy = 0;
    for (let i = -4000; i <= 4000; i++) energy += rrc(i / 100, alpha) ** 2 / 100;
    assert.ok(Math.abs(energy - 1) < 0.01, `alpha ${alpha}: energy ${energy}`);
    assert.ok(Number.isFinite(rrc(1 / (4 * alpha), alpha)));
  }
});

test('QAM modulator round-trips through the matched-filter receiver, including fractional symbol rates', () => {
  const sym = Float32Array.from({ length: 400 }, (_, i) => [1, -1, 3, -3][(i * 5 + (i >> 2)) & 3] / Math.sqrt(10));
  for (const [symRate, carrier, alpha] of [[600, 1200, 0.75], [2400, 1800, 0.25], [24000 / 7, 1959, 0.12], [19200 / 7, 1646, 0.12]]) {
    const { samples, start, t0 } = qam(sym, { symRate, carrier, alpha, span: 16, t0: 0.5 });
    const signal = new Float32Array(Math.round((start + 1) * SR) + samples.length);
    signal.set(samples, Math.round(start * SR));
    const rx = demodQam(signal, { symRate, carrier, alpha, t0, count: 200, span: 16 });
    for (let i = 40; i < 360; i++) assert.ok(Math.abs(rx[i] - sym[i]) < 0.06, `${symRate} baud, value ${i}: ${rx[i]} vs ${sym[i]}`);
  }
});

test('mu-law Ucodes match Table 1/V.90', () => {
  assert.deepEqual([0, 1, 6, 64, 65, 70, 127].map(ucodeLinear), [0, 8, 48, 1980, 2108, 2748, 32124]);
});

test('CRC-16: appending the CRC leaves a constant residue', () => {
  const residue = (data) => crc16([...data, ...crc16(data)]).join('');
  assert.equal(residue([1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0]), residue(ones(40)));
});

for (const plan of ['bell103', 'v21']) {
  test(`${plan}: carriers sit on the standard frequencies and the text decodes from the audio`, () => {
    const call = fsk300({ plan });
    const freqs = FSK_PLANS[plan];
    for (const [who, side] of [[CALLER, 'caller'], [ANSWERER, 'answerer']]) {
      const track = call.bitTracks.find((b) => b.who === who);
      assert.ok(tonePower(call.channels[who], freqs[side].mark, ...window(track.t0 + 0.05, track.t0 + 0.3)) > 0.5 * AMP * AMP, 'idle carrier is the mark tone');
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
  assert.ok(tonePower(call.channels[ANSWERER], 2100, ...window(ans.t0 + 0.1, ans.t1 - 0.1)) > 0.5 * AMP * AMP);
  assert.ok(tonePower(call.channels[ANSWERER], 2100, ...window(0.1, ans.t0 - 0.1)) < 1e-6);
});

test('V.22: timers match 6.3.1; scrambled ones and the typed text decode from the audio', () => {
  const call = v22({ rate: 1200 });
  const usb1 = segment(call, ANSWERER, 'USB1');
  const callerSb1 = segment(call, CALLER, 'SB1 1200');
  const answererSb1 = segment(call, ANSWERER, 'SB1 1200');
  assert.ok(Math.abs(callerSb1.t0 - usb1.t0 - 0.611) < 0.002, 'caller waits 155 + 456 ms');
  assert.ok(Math.abs(answererSb1.t1 - answererSb1.t0 - 0.765) < 0.002, 'answerer sends SB1 for 765 ms');
  // USB1 is a steady -90 degrees per symbol: a tone 150 Hz below the 2400 Hz carrier.
  assert.ok(tonePower(call.channels[ANSWERER], 2250, ...window(usb1.t0 + 0.05, usb1.t1 - 0.05)) > 0.3 * AMP * AMP);

  const track = call.symbolTracks.find((t) => t.who === CALLER);
  const { rx, worst } = receive(call, track, 0.75, 1200);
  assert.ok(worst < 0.1, `worst symbol error ${worst}`);
  const quadrant = (re, im) => (Math.round((Math.atan2(im, re) - Math.atan2(1, 3)) / (Math.PI / 2)) + 8) & 3;
  const turnBits = [[0, 1], [0, 0], [1, 0], [1, 1]]; // Table 1/V.22: 0, +90, +180, +270 degrees
  const d = descrambler(14, 17);
  const decoded = [];
  for (let k = 1; k < track.points.length / 2; k++) {
    const turn = (quadrant(rx[2 * k], rx[2 * k + 1]) - quadrant(rx[2 * k - 2], rx[2 * k - 1]) + 4) & 3;
    decoded.push(...turnBits[turn].map(d));
  }
  const sb1 = sectionOf(track, 'SB1 1200');
  assert.ok(decoded.slice(34, 2 * sb1.to - 2).every((b) => b === 1), 'SB1 descrambles to ones');
  assert.ok(contains(decoded, asyncText('GUEST\r')), 'the typed text is recoverable from the audio');
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
  assert.ok(worst < 0.1, `worst symbol error ${worst}`);
  const used = new Set();
  for (let k = sectionOf(track, 'SB1 2400').from + 2; k < track.points.length / 2; k++) used.add(nearest(rx, k, V22BIS_POINTS, 1 / Math.sqrt(10)));
  assert.equal(used.size, 16);
});

test('Bell 212A answer uses 2225 Hz in place of unscrambled ones', () => {
  const call = v22({ rate: 1200, answer: 'bell' });
  const answer = segment(call, ANSWERER, '2225 Hz');
  assert.ok(tonePower(call.channels[ANSWERER], 2225, ...window(answer.t0 + 0.05, answer.t1 - 0.05)) > 0.5 * AMP * AMP);
  assert.equal(segment(call, ANSWERER, 'ANS 2100 Hz'), undefined);
});

test('V.32 and V.32 bis constellations have the 90-degree symmetry of the published figures', () => {
  // Rotating a point by +90 degrees must flip Y0, permute Y1Y2 (00>11, 01>10, 10>00, 11>01)
  // and leave the uncoded bits alone. A single mis-transcribed label breaks this.
  const turn = [3, 2, 0, 1];
  for (const [table, width] of [[V32_TCM, 5], [V32BIS_TCM, 7]]) {
    assert.equal(table.filter(Boolean).length, 1 << width);
    const index = new Map(table.map(([x, y], i) => [`${x},${y}`, i]));
    assert.equal(index.size, 1 << width, 'no two labels share a point');
    const low = (1 << (width - 3)) - 1;
    table.forEach(([x, y], i) => {
      const y12 = (i >> (width - 3)) & 3;
      const expected = ((((i >> (width - 1)) ^ 1) << 2) | turn[y12]) << (width - 3) | (i & low);
      assert.equal(index.get(`${-y},${x}`), expected, `label ${i.toString(2).padStart(width, '0')}`);
    });
  }
});

for (const rate of [9600, 14400]) {
  test(`V.32 at ${rate}: ranging tones, the TRN patterns printed in the standard, and trellis-coded data decode`, () => {
    const call = v32({ rate });
    const bis = rate === 14400;
    const aa = segment(call, CALLER, 'AA 1800 Hz');
    const ac = segment(call, ANSWERER, 'AC 600+3000 Hz');
    assert.ok(tonePower(call.channels[CALLER], 1800, ...window(aa.t0 + 0.1, aa.t1 - 0.1)) > 0.5 * AMP * AMP);
    for (const f of [600, 3000]) assert.ok(tonePower(call.channels[ANSWERER], f, ...window(ac.t0 + 0.01, ac.t1 - 0.005)) > 0.1 * AMP * AMP, `${f} Hz in AC`);
    assert.ok(tonePower(call.channels[ANSWERER], 1800, ...window(ac.t0 + 0.01, ac.t1 - 0.005)) < 0.01 * AMP * AMP, 'no carrier in AC');

    const states = [[-3, -1], [1, -3], [3, 1], [-1, 3]];
    const printed = { [CALLER]: 'CCCCCCCCCAAACCC', [ANSWERER]: 'CCCAACCCAACCACC' }; // V.32 5.2.3
    for (const who of [CALLER, ANSWERER]) {
      const track = call.symbolTracks.filter((t) => t.who === who).at(-1);
      const { rx, worst } = receive(call, track, 0.25, 1800);
      assert.ok(worst < 0.1, `worst symbol error ${worst}`);
      const trn = sectionOf(track, 'TRN');
      const heard = Array.from({ length: 15 }, (_, k) => 'ABCD'[nearest(rx, trn.from + k, states, 1 / Math.sqrt(10))]).join('');
      assert.equal(heard, printed[who]);

      // Decode the data: slice to the constellation, undo Table 2 and the scrambler.
      const table = bis ? V32BIS_TCM : V32_TCM;
      const width = bis ? 7 : 5;
      const power = table.reduce((s, [x, y]) => s + x * x + y * y, 0) / table.length;
      const data = sectionOf(track, `Data ${rate}`);
      const d = descrambler(...(who === CALLER ? [18, 23] : [5, 23]));
      const bits = [];
      let previous = null;
      for (let k = sectionOf(track, 'B1').from; k < data.to; k++) {
        const label = nearest(rx, k, table, 1 / Math.sqrt(power));
        const y = ((label >> (width - 2)) & 1) | (((label >> (width - 3)) & 1) << 1); // Y1 + 2*Y2
        if (previous !== null) {
          const q = (y - previous + 4) & 3;
          const uncoded = Array.from({ length: width - 3 }, (_, i) => (label >> (width - 4 - i)) & 1);
          bits.push(...[q & 1, q >> 1, ...uncoded].map(d));
        }
        previous = y;
      }
      assert.ok(contains(bits, asyncText(who === CALLER ? 'GUEST\r' : 'LOGIN: ')), 'text recovered from trellis-coded audio');
    }
  });
}

test('V.8: ANSam is 2100 Hz with 15 Hz sidebands, and the menus decode as V.21', () => {
  const call = v34();
  const ansam = segment(call, ANSWERER, 'ANSam 2100 Hz');
  const [from, to] = window(ansam.t0 + 0.02, ansam.t0 + 0.42); // between phase reversals
  const carrier = tonePower(call.channels[ANSWERER], 2100, from, to);
  const sideband = tonePower(call.channels[ANSWERER], 2115, from, to);
  assert.ok(carrier > 0.2 * AMP * AMP);
  assert.ok(Math.abs(Math.sqrt(sideband / carrier) - 0.1) < 0.03, '20% modulation puts each sideband at one tenth of the carrier');
  for (const track of call.bitTracks) {
    const freqs = FSK_PLANS.v21[track.who === CALLER ? 'caller' : 'answerer'];
    const bits = demodFsk(call.channels[track.who], { baud: 300, ...freqs, t0: track.t0, count: track.bits.length });
    assert.deepEqual(bits, [...track.bits]);
    assert.equal(bits.slice(0, 20).join(''), '11111111110000001111', 'ten ones and CM/JM sync (Table 1/V.8)');
    assert.equal(bits.slice(20, 30).join(''), '0100000111', 'call function: data (Table 3/V.8)');
  }
  const cm = call.bitTracks.find((t) => t.who === CALLER);
  assert.equal([...cm.bits.slice(-30)].join(''), '000000000100000000010000000001', 'CJ: three zero octets');
});

test('V.34 superconstellation numbering matches Figure 5/V.34', () => {
  const q = quarterConstellation(416);
  const row = (im) => q.map((p, i) => [p, i]).filter(([p]) => p[1] === im).sort((a, b) => a[0][0] - b[0][0]).map(([, i]) => i);
  assert.deepEqual(row(9), [380, 316, 255, 203, 158, 119, 84, 60, 39, 24, 17, 15, 20, 30, 49, 72, 101, 138, 182, 230, 283, 348, 415]);
  assert.deepEqual(row(45), [408, 396, 394, 400, 414]);
});

test('V.34: probing tones, INFO frames, training signals and MP decode from the audio', () => {
  const call = v34({ rate: 33600, rateName: '3429' });
  // L2 from the answerer: the 21 tones of Table 17 present, the four omitted ones absent.
  const l2 = segment(call, ANSWERER, 'L2');
  const span = window(l2.t0 + 0.02, l2.t0 + 0.22);
  const each = (AMP * AMP) / PROBE_TONES.length;
  for (const [f] of PROBE_TONES) assert.ok(Math.abs(tonePower(call.channels[ANSWERER], f, ...span) / each - 1) < 0.1, `${f} Hz present at equal level`);
  for (const f of [900, 1200, 1800, 2400]) assert.ok(tonePower(call.channels[ANSWERER], f, ...span) < 0.001 * each, `${f} Hz omitted`);
  const l1 = segment(call, ANSWERER, 'L1');
  assert.ok(Math.abs(l1.t1 - l1.t0 - 0.16) < 0.001);
  assert.ok(Math.abs(tonePower(call.channels[ANSWERER], 1050, ...window(l1.t0 + 0.01, l1.t0 + 0.15)) / each - 4) < 0.4, 'L1 is 6 dB hotter');

  // INFO0c: binary DPSK at 600 bit/s on 1200 Hz; frame sync and CRC check out.
  const keyed = call.symbolTracks.find((t) => t.who === CALLER && t.symRate === 600);
  const { rx } = receive(call, keyed, 0.75, 1200);
  const info = sectionOf(keyed, 'INFO0c');
  const bits = [];
  for (let k = info.from + 1; k < info.to; k++) bits.push(rx[2 * k] * rx[2 * k - 2] < 0 ? 1 : 0);
  assert.equal(bits.length, 49);
  assert.equal(bits.slice(0, 12).join(''), '111101110010', 'fill and frame sync (Table 14/V.34)');
  assert.deepEqual(bits.slice(29, 45), crc16(bits.slice(12, 29)));

  // Phase 3/4 from the caller: TRN is scrambled ones, J is the printed pattern, MP carries a valid CRC.
  const carrier = carrierFor('3429');
  const track = call.symbolTracks.filter((t) => t.who === CALLER).at(-1);
  const { rx: train, worst } = receive(call, track, 0.12, carrier, 16);
  const four = [[1, 1], [1, -1], [-1, -1], [-1, 1]]; // point 0 turned clockwise 0-3 times
  const turns = (label) => {
    const s = sectionOf(track, label);
    return Array.from({ length: s.to - s.from }, (_, k) => nearest(train, s.from + k, four, Math.SQRT1_2));
  };
  const trn = sectionOf(track, 'TRN');
  assert.ok(worst < 0.2, `worst symbol error ${worst}`);
  const d = descrambler(18, 23);
  assert.ok(turns('TRN').flatMap((i) => [i & 1, i >> 1].map(d)).every((b) => b === 1), 'TRN descrambles to ones');
  let z = turns('TRN').at(-1);
  const undo = (label) => turns(label).flatMap((i) => {
    const diff = (i - z + 4) & 3;
    z = i;
    return [diff & 1, diff >> 1].map(d);
  });
  assert.equal(undo('J').slice(0, 32).join(''), '0000100110010001'.repeat(2), 'J: Table 18/V.34');
  assert.equal(undo('J′').join(''), '1111100110010001', 'J′: Table 19/V.34');
  assert.ok(trn.to - trn.from >= 512);

  const second = call.symbolTracks.filter((t) => t.who === CALLER).at(-1);
  assert.equal(second, track);
  const d2 = descrambler(18, 23);
  const phase4 = track.sections.filter((s) => s.label === 'TRN')[1];
  let z2 = 0;
  const stream = [];
  for (let k = phase4.from; k < sectionOf(track, 'E').to; k++) {
    const i = nearest(train, k, four, Math.SQRT1_2);
    const value = k < phase4.to ? i : (i - z2 + 4) & 3;
    z2 = i;
    stream.push(...[value & 1, value >> 1].map(d2));
  }
  const mp = stream.slice(2 * (phase4.to - phase4.from), 2 * (phase4.to - phase4.from) + 88);
  assert.deepEqual(mp, mpFrame({ maxRate: 33600, ack: false, rateMask: [...ones(14), 0] }));
  assert.deepEqual(mp.slice(69, 85), crc16([...mp.slice(18, 34), ...mp.slice(35, 51), ...mp.slice(52, 68)]));
  assert.ok(stream.slice(-20).every((b) => b === 1), 'E is twenty ones');
});

test('V.90: the roles swap in Phase 2 and the server’s first signals are built from mu-law codewords', () => {
  const call = v90({ dial: false, v8bis: true });
  // V.8 bis CRe from the answering modem.
  const cre = segment(call, ANSWERER, 'CRe 1375+2002');
  for (const f of [1375, 2002]) assert.ok(tonePower(call.channels[ANSWERER], f, ...window(cre.t0 + 0.02, cre.t1 - 0.02)) > 0.01 * AMP * AMP);
  // The analogue (calling) modem sends Tone A on 2400 Hz; the digital (answering) one Tone B on 1200 Hz.
  const toneA = segment(call, CALLER, 'Tone A');
  const toneB = segment(call, ANSWERER, 'Tone B');
  assert.ok(tonePower(call.channels[CALLER], 2400, ...window(toneA.t0 + 0.01, toneA.t1 - 0.01)) > 0.2 * AMP * AMP);
  assert.ok(tonePower(call.channels[ANSWERER], 1200, ...window(toneB.t0 + 0.01, toneB.t1 - 0.01)) > 0.2 * AMP * AMP);

  const down = call.pcmTracks[0];
  const full = ucodeLinear(127);
  const values = (label) => {
    const s = down.sections.find((x) => x.label === label);
    return [...down.values.subarray(s.from, s.to)].map((v) => Math.round(v * full));
  };
  const W = ucodeLinear(16 + 79);
  assert.deepEqual(values('Sd').slice(0, 6).map((v) => v || 0), [W, 0, W, -W, 0, -W]);
  assert.deepEqual(values('S̄d').slice(0, 6).map((v) => v || 0), [-W, 0, -W, W, 0, W]);
  assert.equal(values('Sd').length, 384);
  assert.equal(values('S̄d').length, 48);
  const trn = values('TRN1d');
  assert.ok(trn.length >= 2040 && trn.length % 6 === 0);
  assert.deepEqual(trn.slice(0, 30).map((v) => (v > 0 ? 1 : 0)).join(''), '111111111111111111000001111111', 'signs are GPC-scrambled ones');
  assert.ok(trn.every((v) => Math.abs(v) === ucodeLinear(79)));
  // Sd repeats every six samples at 8 kHz: its fundamental is 1333 Hz.
  const sd = segment(call, ANSWERER, 'Sd');
  assert.ok(tonePower(call.channels[ANSWERER], 8000 / 6, ...window(sd.t0 + 0.005, sd.t1 - 0.005)) > 0.5 * AMP * AMP);
  // DIL covers each requested codeword against the reference.
  const dil = new Set(values('DIL').map(Math.abs));
  for (const u of DIL.ucodes.slice(0, 10)) assert.ok(dil.has(ucodeLinear(u)));
});

test('downstream constellations respect the -12 dBm0 power limit and grow with the rate', () => {
  const limit = (ucodeLinear(127) / Math.SQRT2) * 10 ** (-15.17 / 20);
  let previousGap = Infinity;
  for (const levels of [16, 36, 64]) {
    const set = pcmConstellation(levels).map(ucodeLinear);
    assert.equal(set.length, levels);
    assert.ok(Math.sqrt(set.reduce((s, v) => s + v * v, 0) / levels) <= limit);
    const gap = Math.min(...set.slice(1).map((v, i) => v - set[i]));
    assert.ok(gap <= previousGap, 'more levels means they sit closer together');
    previousGap = gap;
  }
});

const variants = [
  ['fsk300', {}], ['fsk300', { plan: 'v21' }],
  ['v22', {}], ['v22', { rate: 2400 }], ['v22', { answer: 'bell' }],
  ['v32', {}], ['v32', { rate: 14400 }],
  ['v34', {}], ['v34', { rate: 33600, rateName: '3429' }], ['v34', { rate: 21600, rateName: '2400' }], ['v34', { rate: 26400, rateName: '2800' }],
  ['v90', {}], ['v90', { rate: 56000, dial: false, v8bis: false }],
];
test('every call: no clipping, lanes never double-book, annotations are complete', () => {
  for (const [name, options] of variants) {
    const call = builders[name](options);
    const tag = `${name} ${JSON.stringify(options)}`;
    let peak = 0;
    for (let i = 0; i < call.channels[0].length; i++) peak = Math.max(peak, Math.abs(call.channels[0][i] + call.channels[1][i] + call.channels[2][i]));
    assert.ok(peak < 1, `${tag}: peak ${peak}`);
    assert.ok(peak > 0.2, `${tag}: audible`);
    for (const who of [0, 1, 2]) {
      const lane = call.segments.filter((s) => s.who === who);
      lane.forEach((s, i) => {
        assert.ok(FIDELITY.includes(s.fidelity), `${tag}: ${s.label} fidelity`);
        assert.ok(s.note.length > 10 || /^(Silence|[0-9A-D*#])$/.test(s.label) || s.note.length > 0, `${tag}: ${s.label} has a note`);
        assert.ok(s.t1 > s.t0 && s.t1 <= call.duration, `${tag}: ${s.label} within the call`);
        if (i) assert.ok(s.t0 >= lane[i - 1].t1 - 0.003, `${tag}: ${lane[i - 1].label} overlaps ${s.label}`);
      });
    }
    assert.ok(call.steps.length >= 2);
    for (const step of call.steps) assert.ok(step.title && step.text.length > 40 && step.t >= 0 && step.t < call.duration, `${tag}: step ${step.title}`);
    assert.ok(call.segments.filter((s) => s.fidelity === 'approx').every((s) => /approx|example|our own/i.test(s.note)), `${tag}: approximations explain themselves`);
  }
});
