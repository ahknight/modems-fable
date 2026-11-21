// 9600 and 14 400 bit/s: ITU-T V.32 and V.32 bis.
//
// Sources: V.32 (03/93) clause 2.4 with Tables 1-3 and Figures 1-3, clause 4
// (scramblers), clause 5 (receiver conditioning, rate signals, start-up);
// V.32 bis (02/91) clause 2.3 with Table 1 and Figures 1 and 2-1, clause 5.3
// (rate signal). Answer tone with phase reversals: V.25 (10/96).

import { asyncText, scrambler, tone } from '../dsp/core.js';
import { AMP, ANSWERER, Burst, CALLER, Call } from './call.js';

const BAUD = 2400;
const T = 1 / BAUD;
const CARRIER = 1800;
// V.32 fixes only the spectrum at the band edges (2.2); the pulse shape is the
// implementer's choice. 25% excess bandwidth keeps the signal inside 300-3300 Hz.
const ALPHA = 0.25;

/** The four training states of Figure 1/V.32. A -> B -> C -> D is +90 degrees each. */
const STATES = [[-3, -1], [1, -3], [3, 1], [-1, 3]];
const [A, B, C, D] = STATES;
const STATE_POWER = 10;

/** Table 3/V.32, trellis-coded column, indexed by Y0 Y1 Y2 Q3 Q4. */
export const V32_TCM = [
  [-4, 1], [0, -3], [0, 1], [4, 1], [4, -1], [0, 3], [0, -1], [-4, -1],
  [-2, 3], [-2, -1], [2, 3], [2, -1], [2, -3], [2, 1], [-2, -3], [-2, 1],
  [-3, -2], [1, -2], [-3, 2], [1, 2], [3, 2], [-1, 2], [3, -2], [-1, -2],
  [1, 4], [-3, 0], [1, 0], [1, -4], [-1, -4], [3, 0], [-1, 0], [-1, 4],
];

/**
 * Figure 2-1/V.32 bis, row by row from Im = +9 down to -9. Each label is
 * Y0 Y1 Y2 Q3 Q4 Q5 Q6. Points sit where Re + Im is odd, centred on zero.
 * (The test-suite checks this transcription against the figure's four-fold symmetry.)
 */
const V32BIS_ROWS = [
  '0110000 0111000',
  '1100000 1111001 1101000 1110001',
  '0010011 0101001 0010111 0100001 0010101',
  '1011101 1000011 1011111 1000111 1011011 1000101',
  '0110101 0001101 0110100 0001111 0111100 0001011 0111101',
  '1100101 1111011 1100100 1111010 1101100 1110010 1101101 1110011',
  '0010001 0101011 0010010 0101010 0010110 0100010 0010100 0100011 0010000',
  '1011000 1000001 1011100 1000010 1011110 1000110 1011010 1000100 1011001 1000000',
  '0001000 0110111 0001100 0110110 0001110 0111110 0001010 0111111 0001001',
  '1100111 1111111 1100110 1111110 1101110 1110110 1101111 1110111',
  '0011001 0101111 0011010 0101110 0011110 0100110 0011100 0100111 0011000',
  '1010000 1001001 1010100 1001010 1010110 1001110 1010010 1001100 1010001 1001000',
  '0000000 0110011 0000100 0110010 0000110 0111010 0000010 0111011 0000001',
  '1100011 1111101 1100010 1111100 1101010 1110100 1101011 1110101',
  '0101101 0011011 0101100 0011111 0100100 0011101 0100101',
  '1010101 1001011 1010111 1001111 1010011 1001101',
  '0000101 0110001 0000111 0111001 0000011',
  '1100001 1111000 1101001 1110000',
  '0101000 0100000',
];

export const V32BIS_TCM = (() => {
  const points = new Array(128);
  V32BIS_ROWS.forEach((row, r) => {
    const labels = row.split(' ');
    labels.forEach((label, i) => {
      // Rows are contiguous runs two units apart, except the top and bottom
      // rows, whose two points straddle an empty centre position.
      const re = labels.length === 2 ? 4 * i - 2 : 2 * i - (labels.length - 1);
      points[parseInt(label, 2)] = [re, 9 - r];
    });
  });
  return points;
})();

const meanPower = (pts) => pts.reduce((sum, [x, y]) => sum + x * x + y * y, 0) / pts.length;

/** Quadrant turns for a dibit under Table 1/V.32: 00 +90, 01 0, 10 +180, 11 +270 degrees. */
const TURN = [1, 0, 2, 3];

/**
 * The trellis encoder of Figure 2/V.32 (identical in V.32 bis): differential
 * encoding per Table 2/V.32, then the 8-state convolutional encoder that
 * produces the redundant bit Y0.
 */
export function trellisEncoder() {
  let y = 0; // Y1 + 2*Y2 of the previous symbol
  let a = 0;
  let b = 0;
  let c = 0; // delay elements, left to right; c is Y0
  return (q1, q2) => {
    y = (y + q1 + 2 * q2) & 3;
    const y1 = y & 1;
    const y2 = y >> 1;
    const y0 = c;
    [a, b, c] = [c, a ^ y1 ^ y2 ^ ((y2 ^ b) & c), b ^ y2 ^ (y1 & c)];
    return [y0, y1, y2];
  };
}

/** One modem's transmitter state: scrambler, 4800 bit/s state and trellis encoder. */
function transmitter(call, who, t0, bis) {
  const taps = who === CALLER ? [18, 23] : [5, 23];
  let scramble = scrambler(...taps);
  let state = 0; // index into STATES
  const encode = trellisEncoder();
  const burst = new Burst(call, who, { symRate: BAUD, carrier: CARRIER, alpha: ALPHA, t0 });
  const table = bis ? V32BIS_TCM : V32_TCM;
  const tablePower = meanPower(table);
  const section = (pts, label, fidelity, note, ideal = STATES) => burst.add(pts, { label, fidelity, note, power: STATE_POWER, ideal });
  const repeat = (pair, n) => Array.from({ length: n }, (_, i) => pair[i % 2]);

  return {
    burst,
    /** Alternating or repeated training states: AA, CC, AC, CA, S (AB), S-bar (CD). */
    states: (pair, n, label, fidelity, note) => section(repeat(pair, n), label, fidelity, note),
    /** TRN: scrambled ones at 4800 bit/s, no differential encoding (5.2.3). */
    trn(n) {
      scramble = scrambler(...taps); // "initial state of the scrambler shall be all zeros"
      const pts = [];
      for (let k = 0; k < n; k++) {
        const first = scramble(1);
        const second = scramble(1);
        // First 256 symbols: A or C from the first bit only. Then Table 5: 00 A, 01 B, 11 C, 10 D.
        state = k < 256 ? (first ? 2 : 0) : [0, 1, 3, 2][(first << 1) | second];
        pts.push(STATES[state]);
      }
      return section(pts, 'TRN', 'spec', `${n} symbols of scrambled ones on four points, the minimum V.32 5.2.3 allows; real modems often send more.`);
    },
    /** A 16-bit rate or E word, scrambled, as differentially encoded dibits at 4800 bit/s (5.3). */
    words(word, n, label, fidelity, note) {
      const pts = [];
      for (let i = 0; i < n; i++) {
        for (let k = 0; k < 16; k += 2) {
          state = (state + TURN[(scramble(word[k]) << 1) | scramble(word[k + 1])]) & 3;
          pts.push(STATES[state]);
        }
      }
      return section(pts, label, fidelity, note);
    },
    /** Trellis-coded data: 4 bits per symbol (V.32) or 6 (V.32 bis at 14 400). */
    coded(bits, label, fidelity, note) {
      const width = bis ? 6 : 4;
      const pts = [];
      for (let i = 0; i + width <= bits.length; i += width) {
        const q = bits.slice(i, i + width).map(scramble);
        let index = encode(q[0], q[1]).reduce((v, bit) => (v << 1) | bit, 0);
        for (let k = 2; k < width; k++) index = (index << 1) | q[k];
        pts.push(table[index]);
      }
      return burst.add(pts, { label, fidelity, note, power: tablePower, ideal: table });
    },
  };
}

const ones = (n) => new Array(n).fill(1);
const bitsOf = (s) => [...s.replaceAll(' ', '')].map(Number);

/** Rate words (Table 6/V.32, Table 5/V.32 bis) and E words (Table 7/V.32, Table 6/V.32 bis). */
const WORDS = {
  v32: { rate: bitsOf('0000 0111 1001 0001'), e: bitsOf('1111 0011 1001 0001') },
  v32bis: { rate: bitsOf('0000 1111 1111 1001'), e: bitsOf('1111 1001 1001 1001') },
};

/**
 * A V.32 (9600) or V.32 bis (14 400) start-up, from answer to first data.
 * @param {object} [o]
 * @param {9600|14400} [o.rate]
 * @param {number} [o.roundTrip] round-trip delay in symbol intervals (must be even)
 */
export function v32({ rate = 9600, roundTrip = 28 } = {}) {
  const bis = rate === 14400;
  const name = bis ? 'V.32 bis' : 'V.32';
  const call = new Call({ id: `v32-${rate}`, title: `${name}, ${rate.toLocaleString('en-US')} bit/s`, standard: name });
  const words = bis ? WORDS.v32bis : WORDS.v32;
  const rt = roundTrip * T;
  const detect = 24 * T; // time to recognise a rate signal: three 16-bit words (two are required)

  // -- V.25 answer sequence, with phase reversals to disable echo cancellers ----
  const silence = 2.15;
  const ansLength = 3.3;
  const reversals = [];
  for (let t = 0.45; t < ansLength; t += 0.45) reversals.push(t);
  call.step(0, 'The line connects', 'The answering modem picks up, and for two seconds nothing happens, exactly as at 300 and 1200. The opening of the call has not changed.', 'V.25, 1968');
  call.mark(ANSWERER, 0, silence, 'Silence', 'spec', 'V.25 4.3: 1.8 to 2.5 s of silence after going off-hook.');
  call.step(silence, 'Answer tone, with a hiccup', 'The familiar 2100 Hz answer tone, but listen for a tiny tick every 450 ms. Each tick is the tone flipping upside down. Flipped tone is the agreed signal for the telephone network’s echo cancellers to stand down, because these modems are about to cancel echo themselves.', 'V.25, 1968');
  call.put(ANSWERER, silence, tone(2100, ansLength, { amp: AMP, reversals }), 'ANS 2100 Hz ⟲', 'spec', 'V.25: 2100 Hz for 3.3 ± 0.7 s with 180° phase reversals every 450 ± 25 ms, then 75 ± 20 ms of silence.');

  // -- Ranging: AA/CC against AC/CA/AC (V.32 5.4) --------------------------------
  const aa = silence + 1.0; // caller connects after hearing a full second of answer tone
  const ac = silence + ansLength + 0.075;
  const ca = ac + 128 * T; // AC for at least 128 symbols
  const cc = ca + 64 * T; // caller turns 64T after hearing the reversal
  const ac2 = cc + rt + 64 * T; // answerer turns 64T after hearing the caller's
  const callerStop = ac2; // caller falls silent on the second reversal
  const acEnd = callerStop + rt + 12 * T; // answerer notices the caller is gone
  const train1 = acEnd + 16 * T;

  const callTones = transmitter(call, CALLER, aa, bis);
  callTones.states([A, A], Math.round((cc - aa) / T), 'AA 1800 Hz', 'nominal', 'V.32 5.4.1: carrier state A repeated, a pure 1800 Hz tone. It lasts until the answerer’s phase reversal arrives.');
  callTones.states([C, C], Math.round((callerStop - cc) / T), 'CC', 'spec', 'State C repeated: the same tone, upside down. The switch comes 64 ± 2 symbols after the answerer’s reversal is received.');
  callTones.burst.emit();

  const ansTones = transmitter(call, ANSWERER, ac, bis);
  ansTones.states([A, C], 128, 'AC 600+3000 Hz', 'spec', 'V.32 5.4.2: states A and C alternating every symbol, which puts all the energy at 1800 ± 1200 Hz. At least 128 symbols.');
  ansTones.states([C, A], Math.round((ac2 - ca) / T), 'CA', 'spec', 'The same two tones with phase reversed, held until the caller’s reversal has come back.');
  ansTones.states([A, C], Math.round((acEnd - ac2) / T), 'AC', 'nominal', 'Reverts to AC 64 ± 2 symbols after the caller’s reversal is received, until the caller’s tone is seen to stop.');
  ansTones.burst.emit();

  call.step(aa, 'The caller hums along: 1800 Hz', 'One second into the answer tone, the calling modem starts a steady 1800 Hz tone of its own, right over the top. For the first time both modems will use the same frequencies, the whole voice band, at once. 1800 Hz is the center of it.', 'V.32, 1984');
  call.step(ac, 'Two tones against one: measuring the echo', 'The answerer replies with a chord: 600 Hz and 3000 Hz, the two edges of the band. Now each side flips its tone upside down and times how long the other takes to flip back. It is sonar. The round-trip time tells each modem how far away its own echo will be coming from.', 'V.32, 1984');

  // -- First half-duplex training: answerer sends, caller listens ---------------
  const trnLength = 1280;
  const sLength = 256;
  const ans1 = transmitter(call, ANSWERER, train1, bis);
  ans1.states([A, B], sLength, 'S', 'spec', 'V.32 5.2.1: states A and B alternating for 256 symbols.');
  ans1.states([C, D], 16, 'S̄', 'spec', 'V.32 5.2.2: states C and D alternating for 16 symbols. The S-to-S̄ flip is the timing mark.');
  ans1.trn(trnLength);
  const r1 = ans1.burst.time;
  const callerTrain = r1 + detect;
  const r1Words = Math.ceil((callerTrain + rt + 16 * T - r1) / (8 * T));
  ans1.words(words.rate, r1Words, 'R1', 'nominal', 'A 16-bit word listing every speed the answerer offers, repeated until the caller starts to transmit.');
  ans1.burst.emit();
  call.step(acEnd, 'The answerer trains, alone', 'The caller goes quiet and the answerer sends half a second of scrambled data across the whole band. Two things learn from it at once. The caller’s equalizer learns how this particular phone line bends the signal. And the answerer listens to its own transmission bouncing back, and learns exactly what its echo sounds like so it can subtract it later.', 'V.32, 1984');

  // -- Caller trains; answerer listens ------------------------------------------
  const nt = roundTrip + 64; // the delay the caller measured, in symbols
  const call2 = transmitter(call, CALLER, callerTrain, bis);
  call2.states([A, B], nt + sLength, 'S', 'spec', 'S for the measured round-trip time (so the answerer’s echoes die away) plus 256 symbols.');
  call2.states([C, D], 16, 'S̄', 'spec', 'V.32 5.2.2.');
  call2.trn(trnLength);
  const r2 = call2.burst.time;
  const train2 = r2 + rt + detect;
  call.step(callerTrain, 'The caller trains, alone', 'Now the roles swap. The answerer falls silent while the caller sends its own burst of scrambled data and learns its own echo.', 'V.32, 1984');

  // -- Answerer's second training, then both exchange final rates ---------------
  const ans2 = transmitter(call, ANSWERER, train2, bis);
  ans2.states([A, B], sLength, 'S', 'spec', 'V.32 5.2.1.');
  ans2.states([C, D], 16, 'S̄', 'spec', 'V.32 5.2.2.');
  ans2.trn(trnLength);
  const r3 = ans2.burst.time;

  const r2Words = Math.ceil((r3 + detect - r2) / (8 * T));
  call2.words(words.rate, r2Words, 'R2', 'nominal', 'The speeds both modems can do, as judged by the caller. Repeated until the answerer’s final choice, R3, is recognised.');
  call2.words(words.e, 1, 'E', 'spec', 'One 16-bit word that marks the end of negotiation and names the speed about to be used.');
  const callerE = call2.burst.time;
  const r3Words = Math.ceil((callerE + rt - r3) / (8 * T));
  ans2.words(words.rate, r3Words, 'R3', 'nominal', 'The answerer’s final choice of speed. Repeated until the caller’s E arrives.');
  ans2.words(words.e, 1, 'E', 'spec', 'V.32 5.3.2.');
  const dataAt = ans2.burst.time + 128 * T;
  call.step(train2, 'Both at once', 'This is the moment V.32 was built for. The answerer starts transmitting again while the caller is still going, both of them on the same frequencies. Each modem subtracts its own echo from what it hears, and what is left is the other modem. They swap a few short messages to agree on a speed.', 'V.32, 1984');

  // -- B1 and data --------------------------------------------------------------
  const dataSeconds = 1.6;
  const end = dataAt + dataSeconds;
  const bitsPerSymbol = bis ? 6 : 4;
  const fill = (tx, text) => {
    const b1 = Math.round((dataAt - tx.burst.time) / T);
    const dataNote = `${bitsPerSymbol} data bits plus one redundant trellis bit per symbol, on ${bis ? 128 : 32} points. The text is our example.`;
    tx.coded(ones(b1 * bitsPerSymbol), 'B1', 'spec', 'Scrambled ones, encoded exactly as data will be.');
    const payload = asyncText(text);
    const total = Math.round(dataSeconds / T) * bitsPerSymbol;
    tx.coded(payload.concat(ones(Math.max(0, total - payload.length))), `Data ${rate}`, 'spec', dataNote);
    tx.burst.emit();
  };
  fill(ans2, '\r\nWELCOME TO THE SYSTEM\r\nLOGIN: ');
  fill(call2, 'GUEST\r');
  call.step(dataAt - 136 * T, 'Data', `Connected at ${rate.toLocaleString('en-US')} bit/s. Every 1/2400 of a second each modem sends one of ${bis ? 128 : 32} possible symbols. ${bis ? 'More points, packed closer together, on the same 2400 symbols per second: that is the whole difference between 9600 and 14,400.' : 'Only sixteen of those would be needed to carry four bits. The other sixteen are deliberate redundancy, the trellis code, which lets the receiver correct its own mistakes.'}`, bis ? 'V.32 bis, 1991' : 'V.32, 1984');
  call.end = end;
  return call.finish();
}
