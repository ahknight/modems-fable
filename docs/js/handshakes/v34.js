// 28 800 and 33 600 bit/s: ITU-T V.34.
//
// Sources: V.34 (02/98) clause 5 (symbol rates, carriers), clause 7
// (scramblers), clause 9.1 (superconstellation), clause 10.1 (signals:
// Tones A/B, INFO sequences, L1/L2, S, PP, TRN, J, MP, E), clause 11
// (procedures and timers), Tables 8 and 10 (frame and constellation sizes).
//
// Faithful: everything up to and including the E sequence.
// Approximate: B1 and data. Real V.34 chooses points with shell mapping, a
// four-dimensional trellis code and precoding; here points are drawn at
// random from the correct constellation, which gives the right spectrum,
// symbol rate and level but is not a decodable V.34 data stream.

import { SR, TAU, bitsLE, crc16, prng, scrambler, tone } from '../dsp/core.js';
import { AMP, ANSWERER, Burst, CALLER, Call } from './call.js';
import { v8 } from './v8.js';

/** Table 1 and Table 2/V.34: symbol rate = 2400 a/c; carrier = S d/e. P from Table 8. */
export const V34_RATES = {
  2400: { a: 1, c: 1, index: 0, low: [2, 3], high: [3, 4], P: 12 },
  2743: { a: 8, c: 7, index: 1, low: [3, 5], high: [2, 3], P: 12 },
  2800: { a: 7, c: 6, index: 2, low: [3, 5], high: [2, 3], P: 14 },
  3000: { a: 5, c: 4, index: 3, low: [3, 5], high: [2, 3], P: 15 },
  3200: { a: 4, c: 3, index: 4, low: [4, 7], high: [3, 5], P: 16 },
  3429: { a: 10, c: 7, index: 5, low: [4, 7], high: [4, 7], P: 15 },
};

/** Constellation size L (expanded shaping) for data rate at symbol rate, Table 10/V.34. */
export const V34_L = {
  '2400/19200': 448, '2400/21600': 896,
  '2743/24000': 768, '2743/26400': 1408,
  '2800/24000': 704, '2800/26400': 1280,
  '3000/24000': 448, '3000/26400': 832, '3000/28800': 1408,
  '3200/24000': 320, '3200/26400': 544, '3200/28800': 896, '3200/31200': 1536,
  '3429/26400': 384, '3429/28800': 640, '3429/31200': 960, '3429/33600': 1664,
};

export const symbolRate = (name) => (2400 * V34_RATES[name].a) / V34_RATES[name].c;
export const carrierFor = (name, which = 'high') => (symbolRate(name) * V34_RATES[name][which][0]) / V34_RATES[name][which][1];

/**
 * The first `count` points of the quarter-superconstellation of Figure 5/V.34:
 * grid points with both coordinates congruent to 1 mod 4, numbered by
 * increasing magnitude, larger imaginary part first on ties (clause 9.1).
 */
export function quarterConstellation(count) {
  const pts = [];
  for (let i = -12; i <= 12; i++) for (let j = -12; j <= 12; j++) pts.push([4 * i + 1, 4 * j + 1]);
  pts.sort((p, q) => p[0] ** 2 + p[1] ** 2 - (q[0] ** 2 + q[1] ** 2) || q[1] - p[1]);
  return pts.slice(0, count);
}

const ccw = ([x, y], n = 1) => {
  for (let i = 0; i < (n & 3); i++) [x, y] = [-y, x];
  return [x, y];
};
const cw = (p, n = 1) => ccw(p, 4 - (n & 3));

/** An L-point constellation: L/4 quarter points and their three rotations. */
export function constellation(L) {
  return quarterConstellation(L / 4).flatMap((p) => [0, 1, 2, 3].map((n) => ccw(p, n)));
}

const P0 = [1, 1];
const FOUR = [0, 1, 2, 3].map((n) => cw(P0, n));
const meanPower = (pts) => pts.reduce((sum, [x, y]) => sum + x * x + y * y, 0) / pts.length;
const ones = (n) => new Array(n).fill(1);
const bitsOf = (s) => [...s.replaceAll(' ', '')].map(Number);

// --- Phase 2: INFO sequences, ranging tones, line probing ----------------------

/** Table 17/V.34: probing tones, [Hz, initial phase in degrees]. 900, 1200, 1800 and 2400 Hz are left out. */
export const PROBE_TONES = [
  [150, 0], [300, 180], [450, 0], [600, 0], [750, 0], [1050, 0], [1350, 0], [1500, 0], [1650, 180],
  [1950, 0], [2100, 0], [2250, 180], [2550, 0], [2700, 180], [2850, 0], [3000, 180], [3150, 180],
  [3300, 180], [3450, 180], [3600, 0], [3750, 0],
];

/** L1 (gain 2: 6 dB above nominal) or L2 (gain 1): 21 cosines repeating every 1/150 s. */
export function probe(seconds, gain = 1) {
  const n = Math.round(seconds * SR);
  const out = new Float32Array(n);
  const amp = (gain * AMP) / Math.sqrt(PROBE_TONES.length);
  const fade = SR / 1000;
  for (let i = 0; i < n; i++) {
    let v = 0;
    for (const [f, deg] of PROBE_TONES) v += Math.cos((TAU * f * i) / SR + (deg * Math.PI) / 180);
    out[i] = v * amp * Math.min(1, (i + 1) / fade, (n - i) / fade);
  }
  return out;
}

/** An INFO frame: fill, frame sync, payload, CRC over the payload, fill (Tables 14-16/V.34). */
export function infoFrame(payload) {
  return [...bitsOf('1111 01110010'), ...payload, ...crc16(payload), 1, 1, 1, 1];
}

/** INFO0 payload, bits 12-28: what this modem's transmitter is able and allowed to do. */
export const info0 = ({ big = true } = {}) => [
  1, 1, 1, // symbol rates 2743, 2800, 3429 supported
  1, 1, 1, 1, // low and high carriers at 3000 and 3200
  1, // 3429 permitted
  1, // can reduce transmit power
  0, 0, 0, // no difference allowed between the two directions' symbol rates
  0, // not circuit-multiplication equipment
  big ? 1 : 0, // supports constellations up to 1664 points
  0, 0, // transmit clock: internal
  0, // not an error-recovery acknowledgement
];

/** One nine-bit probing result: high carrier, pre-emphasis filter 0, projected maximum rate. */
const probeResult = (maxRate) => [1, 0, 0, 0, 0, ...bitsLE(maxRate / 2400, 4)];

/** INFO1c payload, bits 12-88: the call modem's view of the line, one result per symbol rate. */
export const info1c = (projected) => [
  ...bitsLE(0, 3), ...bitsLE(0, 3), // power reductions
  ...bitsLE(0, 7), // no MD signal
  ...[2400, 2743, 2800, 3000, 3200, 3429].flatMap((s) => probeResult(projected[s])),
  ...bitsLE(0, 10), // measured frequency offset
];

/** INFO1a payload, bits 12-49: the answer modem's results and the symbol rates both will use. */
export const info1a = (maxRate, rateIndex) => [
  ...bitsLE(0, 3), ...bitsLE(0, 3), ...bitsLE(0, 7),
  ...probeResult(maxRate),
  ...bitsLE(rateIndex, 3), ...bitsLE(rateIndex, 3),
  ...bitsLE(0, 10),
];

/** A 600 bit/s binary DPSK transmitter that can also hold, flip or drop its carrier (10.1.2). */
class Keyer {
  constructor(call, who, carrier, t0, level) {
    this.burst = new Burst(call, who, { symRate: 600, carrier, alpha: 0.75, t0, amp: AMP * level });
    this.sign = 1;
    this.lit = []; // [from, to] spans with carrier on, for the guard tone
  }

  get time() {
    return this.burst.time;
  }

  push(pts, label, fidelity, note) {
    const from = this.time;
    this.burst.add(pts, { label, fidelity, note, power: 1, show: Boolean(label) });
    if (pts[0][0] !== 0) this.lit.push([from, this.time]);
  }

  /** An INFO frame: a reference point, then a 180-degree turn for every 1 bit. */
  info(bits, label, note) {
    const pts = [[this.sign, 0]];
    for (const bit of bits) {
      if (bit) this.sign = -this.sign;
      pts.push([this.sign, 0]);
    }
    this.push(pts, label, 'spec', note);
  }

  /** Unmodulated carrier until `until`. */
  hold(until, label, fidelity, note) {
    const n = Math.max(1, Math.round((until - this.time) * 600));
    this.push(new Array(n).fill([this.sign, 0]), label, fidelity, note);
  }

  flip() {
    this.sign = -this.sign;
  }

  silence(until) {
    const n = Math.round((until - this.time) * 600);
    if (n > 0) this.push(new Array(n).fill([0, 0]), '');
  }
}

/**
 * Phase 2, shared by V.34 and V.90. Roles are V.34's: the "call" role sends
 * on 1200 Hz (Tone B), the "answer" role on 2400 Hz (Tone A) with a guard tone.
 * In V.90 the roles are swapped relative to who dialled.
 *
 * @param {object} o
 * @param {number} o.cWho lane playing the call role; o.aWho the answer role
 * @param {number} o.tC, o.tA when each may start (after V.8's 75 ms silences)
 * @param {object} o.frames bit arrays {info0c, info0a, info1c, info1a}
 * @param {object} o.names display names for the frames and the two modems
 * @returns {number} time at which the answer role's INFO1 ends
 */
export function phase2(call, { cWho, aWho, tC, tA, rt, frames, names }) {
  const react = (from, t, wait) => t + wait + (from === CALLER ? rt : 0);
  const listen = 0.35; // how long each side studies L2 (the standard allows up to 500 ms)
  const c = new Keyer(call, cWho, 1200, tC, 1);
  const a = new Keyer(call, aWho, 2400, tA, 10 ** (-1 / 20));
  const toneNote = (which) => `V.34 10.1.2: Tone ${which}. Phase reversals are timed to the millisecond; the stretches between them depend on detection times.`;

  c.info(frames.info0c, names.info0c, `${names.info0c}: ${frames.info0c.length} bits at 600 bit/s, binary DPSK on 1200 Hz, with CRC. Field values are a plausible example.`);
  a.info(frames.info0a, names.info0a, `${names.info0a}: ${frames.info0a.length} bits at 600 bit/s, binary DPSK on 2400 Hz with an 1800 Hz guard tone, with CRC. Field values are a plausible example.`);
  const cInfoEnd = c.time;

  // Tone A's first reversal, once Tone B has been heard and A has run for 50 ms.
  const aFlip1 = Math.max(a.time + 0.05, react(cWho, cInfoEnd, 0.04));
  a.hold(aFlip1, 'Tone A', 'nominal', toneNote('A, 2400 Hz'));
  a.flip();
  // The call role answers 40 ms after hearing it, holds 10 ms, then goes quiet.
  const bFlip1 = react(aWho, aFlip1, 0.04);
  c.hold(bFlip1, 'Tone B', 'nominal', toneNote('B, 1200 Hz'));
  c.flip();
  c.hold(bFlip1 + 0.01, 'B̄', 'spec', 'Tone B reversed, 40 ± 1 ms after the Tone A reversal is received; 10 ms more, then silence.');
  // The answer role replies 40 ms after hearing that, holds 10 ms, then probes.
  const aFlip2 = react(cWho, bFlip1, 0.04);
  a.hold(aFlip2, 'Ā', 'spec', 'Tone A reversed, until 40 ± 1 ms after the Tone B reversal is received.');
  a.flip();
  a.hold(aFlip2 + 0.01, 'A', 'spec', 'Tone A restored for 10 ms. The round trip has now been timed from both ends.');
  const aProbe = a.time;
  const bBack = react(aWho, aProbe + 0.16, listen);
  const aProbeEnd = react(cWho, bBack, 0.03);
  call.put(aWho, aProbe, probe(0.16, 2), 'L1', 'spec', 'V.34 10.1.2.4: 21 tones 150 Hz apart, phases per Table 17, 160 ms at 6 dB above nominal level.');
  call.put(aWho, aProbe + 0.16, probe(aProbeEnd - aProbe - 0.16), 'L2', 'nominal', 'The same 21 tones at nominal level, for at most 550 ms plus the round-trip delay.');
  a.silence(aProbeEnd);

  // The call role comes back with Tone B; the answer role acknowledges and falls silent.
  c.silence(bBack);
  const aFlip3 = aProbeEnd + 0.05;
  a.hold(aFlip3, 'Tone A', 'spec', 'Tone A for 50 ms.');
  a.flip();
  a.hold(aFlip3 + 0.01, 'Ā', 'spec', 'Reversed for 10 ms, then silence.');
  const bFlip2 = react(aWho, aFlip3, 0.04);
  c.hold(bFlip2, 'Tone B', 'nominal', toneNote('B, 1200 Hz'));
  c.flip();
  c.hold(bFlip2 + 0.01, 'B̄', 'spec', 'Reversed 40 ± 1 ms after the Tone A reversal is received; 10 ms more, then the probe.');
  const cProbe = c.time;
  const aBack = react(cWho, cProbe + 0.16, listen);
  const cProbeEnd = react(aWho, aBack, 0.03);
  call.put(cWho, cProbe, probe(0.16, 2), 'L1', 'spec', 'V.34 10.1.2.4: 160 ms at 6 dB above nominal level.');
  call.put(cWho, cProbe + 0.16, probe(cProbeEnd - cProbe - 0.16), 'L2', 'nominal', 'At nominal level, for at most 550 ms plus the round-trip delay.');
  c.silence(cProbeEnd);
  a.silence(aBack);

  // Results.
  c.info(frames.info1c, names.info1c, `${names.info1c}: ${frames.info1c.length} bits carrying the probing results for each symbol rate. Field values are a plausible example.`);
  const aInfo1 = react(cWho, c.time, 0.005);
  a.hold(aInfo1, 'Tone A', 'nominal', toneNote('A, 2400 Hz'));
  a.info(frames.info1a, names.info1a, `${names.info1a}: ${frames.info1a.length} bits naming the symbol rate to use. Field values are a plausible example.`);
  const end = a.time;
  c.burst.emit();
  a.burst.emit();
  // V.34 10.1.2.1 / 10.1.2.3.1: an 1800 Hz guard tone accompanies everything the answer role sends on 2400 Hz.
  for (const [from, to] of mergeSpans(a.lit)) call.lines[aWho].add(from, tone(1800, to - from, { amp: AMP * 10 ** (-7 / 20) }));

  call.step(Math.min(tC, tA), 'Introductions at 600 bit/s', `A short, slow burst from each side: “here is what my transmitter can do.” ${names.cModem} speaks on 1200 Hz and ${names.aModem} on 2400 Hz, using the simple phase-flipping of the 1200 bit/s era at half its speed, because nothing has been measured yet and it has to work on any line.`, 'V.34, 1994');
  call.step(Math.min(c.lit[0][1], aFlip1 - 0.05), 'Ranging: two tones and a flip', 'Each modem settles on a steady tone, 1200 Hz against 2400 Hz. One flips its tone upside down; exactly 40 ms after hearing that, the other flips back. Subtract the 40 ms and what is left is the round-trip time of the line, the same sonar trick as 9600, done more precisely.', 'V.32, 1984');
  call.step(aProbe, `${names.aModem} probes the line`, 'This harsh buzz is the heart of V.34. It is 21 pure tones sounded at once, from 150 Hz to 3750 Hz, loud for a sixth of a second and then softer. The other modem measures how strongly each tone arrives and how much noise sits between them. Four tones are deliberately missing so the receiver can hear distortion the line adds in those gaps. The result is a map of this exact phone line.', 'V.34, 1994');
  call.step(cProbe - 0.06, `${names.cModem} probes back`, 'The same 21-tone chord in the other direction. A phone line is not the same in both directions, so each modem has to measure for itself.', 'V.34, 1994');
  call.step(cProbeEnd, 'Comparing notes', 'Each modem tells the other what it found: for each of six possible symbol rates, how fast it thinks it could go. Then they pick a symbol rate and a carrier frequency to suit this line, instead of the one-size-fits-all 2400 baud of every earlier fast modem.', 'V.34, 1994');
  return end;
}

function mergeSpans(spans) {
  const out = [];
  for (const [from, to] of spans) {
    if (out.length && from - out.at(-1)[1] < 1e-4) out.at(-1)[1] = to;
    else out.push([from, to]);
  }
  return out;
}

// --- Phases 3 and 4: training signals --------------------------------------------

/** MP sequence Type 0 (Table 20/V.34). */
export function mpFrame({ maxRate, ack, rateMask }) {
  const b = new Array(88).fill(0);
  b.fill(1, 0, 17); // frame sync
  const put = (at, bits) => bits.forEach((bit, i) => { b[at + i] = bit; });
  put(20, bitsLE(maxRate / 2400, 4)); // call-to-answer maximum
  put(24, bitsLE(maxRate / 2400, 4)); // answer-to-call maximum
  b[32] = 1; // expanded constellation shaping
  b[33] = ack ? 1 : 0;
  put(35, rateMask);
  put(69, crc16([...b.slice(18, 34), ...b.slice(35, 51), ...b.slice(52, 68)]));
  return b;
}

const J4 = bitsOf('0000100110010001'); // Table 18/V.34: request 4-point training
const J_PRIME = bitsOf('1111100110010001'); // Table 19/V.34

/**
 * Transmitter for the V.34 training signals of clause 10.1.3.
 * @param {'call'|'answer'} role selects the scrambler polynomial (clause 7)
 */
export function trainer(call, who, role, { rateName, t0, which = 'high' }) {
  const taps = role === 'call' ? [18, 23] : [5, 23];
  let scramble = scrambler(...taps);
  let z = 0;
  const S = symbolRate(rateName);
  const burst = new Burst(call, who, { symRate: S, carrier: carrierFor(rateName, which), alpha: 0.12, span: 16, t0 });
  const add = (pts, label, fidelity, note, ideal = FOUR) => burst.add(pts, { label, fidelity, note, power: 2, ideal });
  /** Scrambled bit pairs, differentially encoded onto the four rotations of point 0 (10.1.3.3). */
  const dibits = (bits) => {
    const pts = [];
    for (let i = 0; i + 1 < bits.length; i += 2) {
      const i1 = scramble(bits[i]);
      const i2 = scramble(bits[i + 1]);
      z = (z + i1 + 2 * i2) & 3;
      pts.push(FOUR[z]);
    }
    return pts;
  };
  return {
    burst,
    S,
    get time() {
      return burst.time;
    },
    s: () => add(Array.from({ length: 128 }, (_, i) => (i % 2 ? ccw(P0, 1) : P0)), 'S', 'spec', 'V.34 10.1.3.7: point 0 and its 90° rotation, alternating, for 128 symbols.'),
    sBar: () => add(Array.from({ length: 16 }, (_, i) => (i % 2 ? ccw(P0, 3) : ccw(P0, 2))), 'S̄', 'spec', 'The same pattern rotated 180°, for 16 symbols. The flip is the timing mark.'),
    /** PP: six periods of a 48-symbol constant-amplitude sequence (equation 10-1). */
    pp() {
      const pts = [];
      for (let i = 0; i < 288; i++) {
        const k = i >> 2;
        const I = i & 3;
        const angle = (Math.PI * (k % 3 === 1 ? k * I + 4 : k * I)) / 6;
        pts.push([Math.SQRT2 * Math.cos(angle), Math.SQRT2 * Math.sin(angle)]);
      }
      const ring = Array.from({ length: 12 }, (_, n) => [Math.SQRT2 * Math.cos((n * Math.PI) / 6), Math.SQRT2 * Math.sin((n * Math.PI) / 6)]);
      return add(pts, 'PP', 'spec', 'V.34 10.1.3.6: six repeats of a 48-symbol sequence whose energy is spread perfectly evenly across the band, for fast equalizer training.', ring);
    },
    /** TRN: scrambled ones on four points, scrambler restarted from zero (10.1.3.8). */
    trn(n) {
      scramble = scrambler(...taps);
      const pts = [];
      for (let k = 0; k < n; k++) {
        z = scramble(1) + 2 * scramble(1);
        pts.push(FOUR[z]);
      }
      return add(pts, 'TRN', 'nominal', `${n} symbols of scrambled ones on four points. The standard requires at least 512; how many more is up to the modem.`);
    },
    j: (n) => add(dibits(new Array(n).fill(J4).flat()), 'J', 'nominal', 'V.34 10.1.3.3: a 16-bit pattern asking for four-point training, repeated until the other modem responds.'),
    jPrime: () => add(dibits(J_PRIME), 'J′', 'spec', 'V.34 10.1.3.4: sent once to end J.'),
    mp: (n, fields, label) => add(dibits(new Array(n).fill(mpFrame(fields)).flat()), label, 'nominal', `V.34 10.1.3.9: an 88-bit modulation-parameter frame (maximum rates, trellis code, shaping, a mask of supported speeds, CRC), repeated ${n} time${n === 1 ? '' : 's'}. Field values are a plausible example.`),
    bits: (bits, label, fidelity, note) => add(dibits(bits), label, fidelity, note),
    e: () => add(dibits(ones(20)), 'E', 'spec', 'V.34 10.1.3.2: twenty scrambled ones marking the end of MP.'),
    /** Stand-in for B1 and data: random points from the right L-point constellation. */
    data(n, L, label, seed) {
      const points = constellation(L);
      const random = prng(seed);
      const pts = Array.from({ length: n }, () => points[Math.floor(random() * points.length)]);
      const note = `Approximation. Correct symbol rate, carrier, bandwidth and ${L}-point constellation, but the points are picked at random. Real V.34 picks them by shell mapping, a 4D trellis code and precoding, so this stretch is not a decodable data stream.`;
      return burst.add(pts, { label, fidelity: 'approx', note, power: meanPower(points), ideal: points });
    },
  };
}

/**
 * A V.34 call from answer to data.
 * @param {object} [o]
 * @param {28800|33600|number} [o.rate] data rate in bit/s
 * @param {string} [o.rateName] symbol rate: '2400' ... '3429'
 * @param {number} [o.roundTrip] seconds
 */
export function v34({ rate = 28800, rateName = '3200', roundTrip = 0.012, id = `v34-${rate}` } = {}) {
  const L = V34_L[`${rateName}/${rate}`];
  if (!L) throw new Error(`V.34 has no ${rate} bit/s mode at ${rateName} symbols/s`);
  const info = V34_RATES[rateName];
  const big = L > 1408 || rate > 28800;
  const kbps = (rate / 1000).toLocaleString('en-US');
  const call = new Call({ id, title: `V.34, ${rate.toLocaleString('en-US')} bit/s`, standard: 'V.34' });
  const rt = roundTrip;
  const react = (from, t, wait) => t + wait + (from === CALLER ? rt : 0);

  const { sigC, sigA } = v8(call, { rt });

  // What each symbol rate could carry on this (imaginary) line: the chosen one tops out at `rate`.
  const projected = Object.fromEntries(Object.keys(V34_RATES).map((name) => {
    const best = Math.max(...Object.keys(V34_L).filter((k) => k.startsWith(`${name}/`)).map((k) => Number(k.split('/')[1])));
    return [name, Math.min(best, Number(name) > Number(rateName) ? rate - 2400 : rate, big ? 33600 : 28800)];
  }));
  const end2 = phase2(call, {
    cWho: CALLER,
    aWho: ANSWERER,
    tC: sigC,
    tA: sigA,
    rt,
    frames: {
      info0c: infoFrame(info0({ big })),
      info0a: infoFrame(info0({ big })),
      info1c: infoFrame(info1c(projected)),
      info1a: infoFrame(info1a(rate, info.index)),
    },
    names: { info0c: 'INFO0c', info0a: 'INFO0a', info1c: 'INFO1c', info1a: 'INFO1a', cModem: 'The caller', aModem: 'The answerer' },
  });

  // -- Phase 3: each side trains in turn (11.3) -----------------------------------
  const S = symbolRate(rateName);
  const trn3 = Math.round((0.85 * S) / 48) * 48;
  const trn4 = Math.round((0.45 * S) / 48) * 48;
  const pattern = 8 / S; // one 16-bit J pattern
  const frame = 44 / S; // one 88-bit MP frame
  const ans3 = trainer(call, ANSWERER, 'answer', { rateName, t0: end2 + 0.07 });
  ans3.s();
  ans3.sBar();
  ans3.pp();
  ans3.trn(trn3);
  const ansJ = ans3.time;
  const call3 = trainer(call, CALLER, 'call', { rateName, t0: react(ANSWERER, ansJ + 3 * pattern, 0.04) });
  const callS = call3.time;
  ans3.j(Math.ceil((react(CALLER, callS + 128 / S, pattern) - ansJ) / pattern));
  ans3.burst.emit();
  call3.s();
  call3.sBar();
  call3.pp();
  call3.trn(trn3);
  const callJ = call3.time;

  // -- Phase 4: both at once, then modulation parameters (11.4) -----------------
  const ans4 = trainer(call, ANSWERER, 'answer', { rateName, t0: react(CALLER, callJ + 3 * pattern, 0.04) });
  const p4 = ans4.time;
  ans4.s();
  ans4.sBar();
  ans4.trn(trn4);
  call3.j(Math.ceil((react(ANSWERER, p4 + 128 / S, pattern) - callJ) / pattern));
  call3.jPrime();
  call3.trn(trn4);
  const mpA = ans4.time;
  const mpC = call3.time;
  // Each sends MP until it has received one, then MP' until it has received an MP', then E.
  const plainA = Math.max(1, Math.ceil((react(CALLER, mpC + frame, 0) - mpA) / frame));
  const plainC = Math.max(1, Math.ceil((react(ANSWERER, mpA + frame, 0) - mpC) / frame));
  const ackA = Math.max(1, Math.ceil((react(CALLER, mpC + (plainC + 1) * frame, 0) - mpA) / frame - plainA));
  const ackC = Math.max(1, Math.ceil((react(ANSWERER, mpA + (plainA + 1) * frame, 0) - mpC) / frame - plainC));
  const rateMask = Array.from({ length: 15 }, (_, i) => ((i + 1) * 2400 <= (big ? 33600 : 28800) ? 1 : 0));
  const finish = (tx, plain, ack, seed) => {
    tx.mp(plain, { maxRate: rate, ack: false, rateMask }, 'MP');
    tx.mp(ack, { maxRate: rate, ack: true, rateMask }, 'MP′');
    tx.e();
    tx.data(8 * info.P, L, 'B1', seed);
    const dataAt = tx.time;
    tx.data(Math.round(1.8 * S), L, `Data ${kbps}k`, seed + 1);
    tx.burst.emit();
    return dataAt;
  };
  const dataA = finish(ans4, plainA, ackA, 34);
  const dataC = finish(call3, plainC, ackC, 43);

  call.step(end2 + 0.07, 'The answerer trains at the chosen rate', `Now the real signal, at the symbol rate the probing chose: ${rateName} symbols per second around a ${Math.round(carrierFor(rateName))} Hz carrier. You hear a short rasp, then a clean rushing hiss while the caller’s equalizer learns the line and the answerer learns its own echo. The band is visibly wider than 9600’s: this modem uses nearly every hertz the line will pass.`, 'V.34, 1994');
  call.step(callS, 'The caller trains', 'The same, in the other direction, while the answerer stays quiet and listens.', 'V.34, 1994');
  call.step(p4, 'Both together, and the final offer', 'Both modems transmit at once and fine-tune. Then each sends a small frame of “modulation parameters”: the fastest speed it believes it can receive, and which optional tricks it wants the other to use. The slower of the two opinions wins.', 'V.34, 1994');
  call.step(Math.min(dataA, dataC), 'Data', `Connected at ${rate.toLocaleString('en-US')} bit/s. Each symbol now carries about ${(rate / S).toFixed(1)} bits, chosen from a constellation of ${L.toLocaleString('en-US')} points. To the ear it is the same hiss as the training, and from here on it will not change.`, 'V.34, 1994');
  return call.finish();
}
