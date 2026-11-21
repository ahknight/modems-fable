// 56 000 bit/s: ITU-T V.90.
//
// Sources: V.90 (09/98) clause 3 and Table 1 (Ucodes), clause 5 (digital
// modem), clause 6 (analogue modem), clause 8 (signals: INFO sequences, Ja and
// the DIL descriptor, Sd, TRN1d, Jd, DIL, R, TRN2d), clause 9 (procedures);
// V.34 (02/98) for everything the analogue modem transmits; V.8 and V.8 bis
// for Phase 1.
//
// Faithful: Phase 1, Phase 2, the analogue modem's Phase 3 signals, and the
// digital modem's Sd, TRN1d, Jd, Jd' and Ri, which are built sample by sample
// from mu-law codewords at 8000 per second.
// Approximate (and labelled as such on the timeline): the contents of the DIL,
// which each modem maker chose for itself; the digital modem's Phase 4
// signals and data, which need the full V.90 encoder and a negotiated
// constellation; the CP frames; and upstream V.34 data.

import { PCM_RATE, bitsLE, crc16, pcm, prng, scrambler, ucodeLinear } from '../dsp/core.js';
import { AMP, ANSWERER, CALLER, Call, dialPreamble } from './call.js';
import { v8 } from './v8.js';
import { V34_L, V34_RATES, info0, infoFrame, phase2, symbolRate, trainer } from './v34.js';

/** The service limit on downstream power, -12 dBm0, as a linear RMS in Table 1/V.90 units. */
const FULL_SCALE_SINE_DBM0 = 3.17; // G.711 mu-law
const LIMIT_RMS = (ucodeLinear(127) / Math.SQRT2) * 10 ** ((-12 - FULL_SCALE_SINE_DBM0) / 20);
/** Linear PCM units to our audio scale: the power limit plays at the same level as other modems. */
const PCM_SCALE = (AMP / Math.SQRT2) / LIMIT_RMS;
const UINFO = 79; // loudest codeword not exceeding the limit (and > 66, as Table 10/V.90 requires)

/**
 * A plausible downstream constellation: `levels` positive mu-law codewords
 * spaced as widely as possible while their average power stays within the
 * limit. Real modems derive one per frame position from what the DIL revealed.
 * @returns {number[]} Ucodes, ascending
 */
export function pcmConstellation(levels) {
  let best = null;
  for (let gap = 8; gap <= 1024; gap += 4) {
    const picked = [];
    let last = -Infinity;
    for (let u = 0; u < 128 && picked.length < levels; u++) {
      const v = ucodeLinear(u);
      if (picked.length === 0 ? v >= gap / 2 : v - last >= gap) {
        picked.push(u);
        last = v;
      }
    }
    if (picked.length < levels) break;
    const rms = Math.sqrt(picked.reduce((sum, u) => sum + ucodeLinear(u) ** 2, 0) / levels);
    if (rms > LIMIT_RMS) break;
    best = picked;
  }
  return best;
}

/** Downstream bit rate for K magnitude bits and S sign bits per six-symbol frame (5.4.1). */
export const pcmRate = (bitsPerFrame) => (bitsPerFrame * PCM_RATE) / 6;

/** The digital modem's transmitter: a run of 8 kHz PCM samples assembled section by section. */
class PcmBurst {
  constructor(call, who, t0) {
    Object.assign(this, { call, who, t0 });
    this.values = [];
    this.sections = [];
  }

  get time() {
    return this.t0 + this.values.length / PCM_RATE;
  }

  /** @param {number[]} samples signed linear values @param {number[]} [levels] the magnitudes in play */
  add(samples, label, fidelity, note, levels = null) {
    const from = this.values.length;
    for (const v of samples) this.values.push(v);
    this.sections.push({ from, to: this.values.length, label, fidelity, note, levels });
    return this;
  }

  emit() {
    const { samples, start } = pcm(this.values, { amp: PCM_SCALE, t0: this.t0 });
    this.call.lines[this.who].add(start, samples);
    const at = (k) => this.t0 + k / PCM_RATE;
    for (const s of this.sections) this.call.mark(this.who, at(s.from), at(s.to), s.label, s.fidelity, s.note);
    this.call.pcmTracks.push({
      who: this.who,
      t0: this.t0,
      rate: PCM_RATE,
      values: Float32Array.from(this.values, (v) => v / ucodeLinear(127)),
      sections: this.sections.map(({ from, to, label, levels }) => ({ from, to, label, levels: levels && levels.map((v) => v / ucodeLinear(127)) })),
    });
    return this.time;
  }
}

const sign = (bit) => (bit ? 1 : -1);

/** Frames of 16-bit groups, each preceded by a start bit, after a 17-ones sync, with CRC (as Jd, Ja, MP). */
function framed(groups, fill) {
  const body = groups.flat();
  return [...new Array(17).fill(1), ...groups.flatMap((g) => [0, ...g]), 0, ...crc16(body), ...fill];
}

/** Jd (Table 13/V.90): the digital modem's capabilities. */
function jdFrame() {
  const rates = new Array(16).fill(1); // 28 000 ... 48 000
  const more = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]; // 49 333 ... 56 000; 4-point CP; lookahead 1
  return framed([rates, more], [0, 0, 0, 0]);
}

/**
 * The DIL descriptor the analogue modem sends in Ja (Table 12/V.90).
 * These particular choices are ours; every modem maker made its own.
 */
export const DIL = (() => {
  const ucodes = Array.from({ length: 96 }, (_, i) => 16 + i); // chords 2 to 7: every codeword a data constellation could use
  const random = prng(90);
  return {
    ucodes,
    sp: Array.from({ length: 32 }, () => (random() < 0.5 ? 1 : 0)), // sign pattern
    tp: [1, 0], // training pattern: training symbol, reference symbol, ...
    h: new Array(8).fill(12), // each segment is (12 + 1) * 6 = 78 symbols
    ref: new Array(8).fill(UINFO),
  };
})();

function dilDescriptor() {
  const pad16 = (bits) => bits.concat(new Array((16 - (bits.length % 16)) % 16).fill(0));
  const chunks = (bits) => Array.from({ length: bits.length / 16 }, (_, i) => bits.slice(16 * i, 16 * i + 16));
  const pairs = (values) => chunks(pad16(values.flatMap((v) => [...bitsLE(v, 7), 0])));
  return framed([
    [...bitsLE(DIL.ucodes.length, 8), ...new Array(8).fill(0)],
    [...bitsLE(DIL.sp.length - 1, 7), 0, ...bitsLE(DIL.tp.length - 1, 7), 0],
    ...chunks(pad16(DIL.sp)),
    ...chunks(pad16(DIL.tp)),
    ...pairs(DIL.h),
    ...pairs(DIL.ref),
    ...pairs(DIL.ucodes),
  ], [0, 0]);
}

/** PCM samples for `segments` DIL segments (8.4.1). */
function dilSamples(segments) {
  const out = [];
  for (let n = 0; n < segments; n++) {
    const u = DIL.ucodes[n % DIL.ucodes.length];
    const chord = u >> 4;
    for (let i = 0; i < (DIL.h[chord] + 1) * 6; i++) {
      const training = DIL.tp[i % DIL.tp.length];
      out.push(sign(DIL.sp[i % DIL.sp.length]) * ucodeLinear(training ? u : DIL.ref[chord]));
    }
  }
  return out;
}

/** Table 2/V.90 in miniature: the frame size, in bits, for a downstream rate. */
const frameBits = (rate) => Math.round((rate * 6) / PCM_RATE);

/**
 * A V.90 call: your analogue modem dials an ISP's digital modem.
 * @param {object} [o]
 * @param {number} [o.rate] downstream rate, 28 000 to 56 000 in steps of 8000/6
 * @param {boolean} [o.dial] include dial tone, dialling and ringing
 * @param {boolean} [o.v8bis] include the answering modem's V.8 bis greeting
 */
export function v90({ rate = 49333, upstream = 28800, dial = true, v8bis = true, roundTrip = 0.012, id = 'v90' } = {}) {
  const call = new Call({ id, title: `V.90, ${rate.toLocaleString('en-US')} bit/s down`, standard: 'V.90', lanes: ['Your modem (analog)', 'ISP’s modem (digital)', 'Telephone network'] });
  const rt = roundTrip;
  const react = (from, t, wait) => t + wait + (from === CALLER ? rt : 0);
  const upName = '3200'; // the one upstream symbol rate every V.90 modem must support (6.2)
  const S = symbolRate(upName);
  const upL = V34_L[`${upName}/${upstream}`];

  const answered = dial ? dialPreamble(call) : 0;
  const { sigC, sigA } = v8(call, { t: answered, rt, pcm: true, v8bis });

  // -- Phase 2: V.34's probing, with the roles swapped (9.2) ----------------------
  // The digital modem answered the phone but plays V.34's "call" role (1200 Hz,
  // Tone B); the analogue modem that dialled plays the "answer" role (2400 Hz, Tone A).
  const info0d = [
    ...info0().slice(0, 14), 0, 0, 0, // as INFO0, with bits 26-27 reserved
    ...bitsLE(6, 4), // nominal transmit power: -12 dBm0
    ...bitsLE(23, 5), // maximum transmit power: -12 dBm0
    0, // power measured at the modem's terminals
    0, // mu-law
    0, // no 3429 upstream
    0,
  ];
  const info1d = [
    ...bitsLE(0, 3), ...bitsLE(0, 3), ...bitsLE(0, 7),
    // Nine bits per symbol rate, 2400 ... 3429: only 3000 and 3200 are usable in V.90 mode.
    ...[0, 0, 0, upstream, upstream, 0].flatMap((r) => [1, 0, 0, 0, 0, ...bitsLE(r / 2400, 4)]),
    ...bitsLE(0, 10),
  ];
  const info1a = [
    ...bitsLE(0, 6), ...bitsLE(0, 7),
    ...bitsLE(UINFO, 7), 0, 0,
    ...bitsLE(V34_RATES[upName].index, 3),
    ...bitsLE(6, 3), // "symbol rate 8000": V.90 is wanted
    ...bitsLE(0, 10),
  ];
  const end2 = phase2(call, {
    cWho: ANSWERER,
    aWho: CALLER,
    tC: sigA,
    tA: sigC,
    rt,
    frames: { info0c: infoFrame(info0d), info0a: infoFrame([...info0().slice(0, 14), 0, 0, 0]), info1c: infoFrame(info1d), info1a: infoFrame(info1a) },
    names: { info0c: 'INFO0d', info0a: 'INFO0a', info1c: 'INFO1d', info1a: 'INFO1a', cModem: 'The server', aModem: 'Your modem' },
  });

  // -- Phase 3 (9.3): your modem trains the server, then the server shows its hand
  const pattern = 8 / S;
  const up3 = trainer(call, CALLER, 'answer', { rateName: upName, t0: end2 + 0.07 });
  const up3At = up3.time;
  up3.s();
  up3.sBar();
  up3.pp();
  up3.trn(Math.round((0.6 * S) / 48) * 48);
  const jaAt = up3.time;
  const descriptor = dilDescriptor();
  const descriptorTime = descriptor.length / 2 / S;

  // Server: Sd, Sd-bar, TRN1d, Jd..., Jd', DIL.
  const down = new PcmBurst(call, ANSWERER, Math.round(react(CALLER, jaAt + descriptorTime, 0.04) * PCM_RATE) / PCM_RATE);
  const sdAt = down.time;
  const W = ucodeLinear(16 + UINFO);
  const zero = 1e-3; // "+0" and "-0" are distinct codewords with the same (zero) voltage
  down.add(new Array(64).fill([W, zero, W, -W, -zero, -W]).flat(), 'Sd', 'spec', 'V.90 8.4.4: 64 repeats of the six-sample pattern +W, +0, +W, −W, −0, −W, where W is the codeword 16 Ucodes above the training level.', [W]);
  down.add(new Array(8).fill([-W, -zero, -W, W, zero, W]).flat(), 'S̄d', 'spec', 'Eight repeats of the inverted pattern. The flip is the timing mark.', [W]);
  const level = ucodeLinear(UINFO);
  const scramble = scrambler(18, 23); // the digital modem uses GPC (8.4)
  const trn1d = 3000;
  let previous = 1;
  down.add(Array.from({ length: trn1d }, () => { previous = scramble(1); return sign(previous) * level; }), 'TRN1d', 'nominal', `V.90 8.4.5: one codeword (Ucode ${UINFO}) whose sign is a scrambled string of ones, at 8000 samples per second. At least 2040 samples are required; ${trn1d} are sent here.`, [level]);
  const jdAt = down.time;
  const jd = jdFrame();
  const differential = (bits) => bits.map((bit) => { previous ^= scramble(bit); return sign(previous) * level; });

  // Your modem: Ja until Sd's flip is seen, silence, then S when Jd has been read.
  const jaEnd = sdAt + 0.048 + 6 * pattern;
  const jaBits = [];
  while (jaBits.length / 2 / S < jaEnd - jaAt) jaBits.push(...descriptor);
  jaBits.length = Math.round((jaEnd - jaAt) * S) * 2;
  up3.bits(jaBits, 'Ja', 'nominal', `V.90 8.3.1: the ${descriptor.length}-bit DIL descriptor, repeated until the server’s Sd flip is detected. The layout is per Table 12; the parameters in it are our example.`);
  up3.burst.emit();

  const upS = trainer(call, CALLER, 'answer', { rateName: upName, t0: jdAt + 2.5 * jd.length / PCM_RATE + 0.03 });
  const sAt = upS.time;
  // Server keeps repeating Jd until it hears S, finishes the current one, then Jd'.
  const jdCount = Math.ceil((react(CALLER, sAt, 24 / S) - jdAt) / (jd.length / PCM_RATE));
  down.add(differential(new Array(jdCount).fill(jd).flat()), 'Jd', 'nominal', 'V.90 8.4.2: a 72-bit frame listing the downstream speeds the server offers, sent as the sign of the training codeword and repeated until your modem replies.', [level]);
  down.add(differential(new Array(12).fill(0)), 'Jd′', 'spec', 'Twelve zero bits ending Jd.', [level]);
  const dilAt = down.time;
  // Your modem holds S until Jd' is heard, sends S-bar, then scrambled ones while it studies the DIL.
  const sSymbols = Math.ceil(((dilAt + 0.004 - sAt) * S) / 2) * 2;
  const sPair = [[1, 1], [-1, 1]];
  upS.burst.add(Array.from({ length: sSymbols }, (_, i) => sPair[i % 2]), { label: 'S', fidelity: 'nominal', note: 'V.34 signal S, held until the server’s Jd′ is detected.', power: 2 });
  upS.sBar();
  const dilSeconds = 1.35;
  upS.bits(new Array(Math.round(dilSeconds * S) * 2).fill(1), 'SCR', 'spec', 'V.90 8.3.5: scrambled ones on four points, to keep the line alive while the DIL is studied.');
  upS.s();
  upS.sBar();
  const up4At = upS.time; // Phase 4 begins for your modem
  // The server stops the DIL at the end of the segment in which it hears the second S flip.
  const segment = (DIL.h[0] + 1) * 6 / PCM_RATE;
  const segments = Math.ceil((react(CALLER, up4At - 16 / S, 0.002) - dilAt) / segment);
  down.add(dilSamples(segments), 'DIL', 'approx', `Structure per V.90 8.4.1: ${segments} segments of ${(DIL.h[0] + 1) * 6} samples, each exercising one mu-law codeword against a reference. Which codewords, in what order, with what signs and for how long is requested by the analog modem and differed between manufacturers; this sequence is our own example.`, DIL.ucodes.map(ucodeLinear));

  // -- Phase 4 (9.4) ----------------------------------------------------------------
  const riAt = down.time;
  const cpBits = (ack, seed) => {
    const random = prng(seed);
    const groups = Array.from({ length: 22 }, () => Array.from({ length: 16 }, () => (random() < 0.5 ? 1 : 0)));
    groups[0][15] = ack ? 1 : 0;
    return framed(groups, [0, 0]);
  };
  const cpNote = 'Approximation. Correct V.34 four-point modulation and frame skeleton (sync, start bits, CRC), but the constellation tables inside are placeholder bits of representative length.';
  const cpTime = cpBits(false, 1).length / 2 / S;
  // Server: Ri until one CPt has arrived, Ri-bar for 24 samples, TRN2d, MP, MP', Ed, B1d, data.
  const riCount = Math.max(32, Math.ceil(((react(CALLER, up4At + cpTime, 0.004) - riAt) * PCM_RATE) / 6));
  const riFlip = riAt + (riCount * 6) / PCM_RATE;
  const cptCount = Math.ceil((riFlip + 0.004 - up4At) / cpTime);
  upS.bits(new Array(cptCount).fill(cpBits(false, 1)).flat(), 'CPt', 'approx', cpNote);
  down.add(new Array(riCount).fill([1, 1, 1, -1, -1, -1].map((s) => s * level)).flat(), 'Ri', 'nominal', 'V.90 8.6.4: the training codeword with the sign pattern + + + − − −, repeated until a CPt frame has been received.', [level]);
  down.add(new Array(4).fill([-1, -1, -1, 1, 1, 1].map((s) => s * level)).flat(), 'R̄i', 'spec', 'Four repeats of the inverted pattern.', [level]);

  const bitsPerFrame = frameBits(rate);
  const levels = pcmConstellation(Math.round(2 ** (bitsPerFrame / 6 - 1)));
  const linear = levels.map(ucodeLinear);
  const randomDown = prng(56);
  const draw = (n, set) => Array.from({ length: n }, () => (randomDown() < 0.5 ? -1 : 1) * set[Math.floor(randomDown() * set.length)]);
  const training = pcmConstellation(8).map(ucodeLinear);
  const downNote = 'Approximation. Real mu-law codewords at 8000 per second and within the power limit, but chosen at random; the real signal is produced by V.90’s modulus encoder and spectral shaper from a constellation negotiated in CP.';
  down.add(draw(2400, training), 'TRN2d', 'approx', `${downNote} At least 2040 samples.`, training);
  const mpAt = down.time;
  // Your modem: scrambled ones through TRN2d, then CP until MP is seen, CP' until MP' is seen, E, B1, data.
  const scr = Math.round((mpAt - 0.03 - upS.time) * S);
  upS.bits(new Array(scr * 2).fill(1), 'SCR', 'spec', 'V.90 9.4.2.2: scrambled ones, optional, for at most 4 s.');
  const cpAt = upS.time;
  const mpTime = 0.03;
  const plainUp = Math.max(1, Math.ceil((mpAt + mpTime - cpAt) / cpTime));
  const plainDown = Math.max(1, Math.ceil((react(CALLER, cpAt + cpTime, 0) - mpAt) / mpTime));
  const ackUp = Math.max(1, Math.ceil((mpAt + (plainDown + 1) * mpTime - cpAt) / cpTime - plainUp));
  const ackDown = Math.max(1, Math.ceil((react(CALLER, cpAt + (plainUp + 1) * cpTime, 0) - mpAt) / mpTime - plainDown));
  upS.bits(new Array(plainUp).fill(cpBits(false, 2)).flat(), 'CP', 'approx', cpNote);
  upS.bits(new Array(ackUp).fill(cpBits(true, 2)).flat(), 'CP′', 'approx', cpNote);
  upS.e();
  upS.data(8 * V34_RATES[upName].P, upL, 'B1', 91);
  const upData = upS.time;
  down.add(draw(Math.round((plainDown + ackDown) * mpTime * PCM_RATE), training), 'MP, MP′', 'approx', downNote, training);
  down.add(draw(12, training), 'Ed', 'approx', downNote, training);
  down.add(draw(288, linear), 'B1d', 'approx', `${downNote} 48 data frames.`, linear);
  const downData = down.time;
  const end = Math.max(upData, downData) + 2.2;
  down.add(draw(Math.round((end - downData) * PCM_RATE), linear), `Data ${Math.round(rate / 1000)}k`, 'approx', `${downNote} ${levels.length} levels of each sign, ${bitsPerFrame} bits per six samples.`, linear);
  down.emit();
  upS.data(Math.round((end - upData) * S), upL, `Data ${upstream / 1000}k`, 92);
  upS.burst.emit();

  call.step(up3At, 'Your modem trains the server', `Your modem goes first, with exactly the signals a V.34 modem uses: a rasp, a short sweep, then hiss at ${upName} symbols per second. Everything your modem sends in this call is V.34. Only the other direction is new.`, 'V.34, 1994');
  call.step(jaAt, 'A shopping list', 'Still in V.34’s voice, your modem sends a long list of instructions: which of the telephone network’s 255 voltage levels it wants to be shown, in what order, and for how long.', 'V.90, 1998');
  call.step(sdAt, 'The server’s first digital sound', 'Now something no earlier modem could do. The server is not generating a waveform at all. It is writing numbers, 8000 of them a second, straight into the telephone network’s digital stream, and the phone company’s own equipment near your house turns each number into a voltage. First a harsh buzz to mark time, then a hiss made of just two voltages, one positive and one negative.', 'V.90, 1998');
  call.step(jdAt, 'What the server offers', 'The server lists the downstream speeds it supports, from 28,000 to 56,000 bits per second, encoded as nothing more than the plus or minus sign of that same single voltage.', 'V.90, 1998');
  call.step(dilAt, 'Digital impairment learning', 'The server plays the shopping list back: one voltage level after another, each compared against a reference. Your modem measures what actually arrives. This is how it discovers what the network between you does to those numbers, such as bits stolen for signalling or levels quietly remapped by a volume adjustment, and which of the 255 levels are still far enough apart to tell from one another on your line.', 'V.90, 1998');
  call.step(riAt, 'Agreeing on the constellation', 'Your modem now tells the server exactly which levels to use, which is the whole secret of your connect speed, and the two exchange final parameters. A quieter line means more usable levels.', 'V.90, 1998');
  call.step(Math.min(upData, downData), 'Connected', `Downstream at ${rate.toLocaleString('en-US')} bit/s: 8000 times a second the server picks one of about ${levels.length * 2} voltage levels. Upstream, your modem replies with ordinary V.34 at ${upstream.toLocaleString('en-US')} bit/s. The speaker clicks off. Everything you just heard took well under half a minute, and in it you can hear forty years of modems: Touch-Tone, the 2100 Hz answer tone, 300-baud warbles, the ranging tones of 9600, the probing chord of 28.8, and at the very end something new.`, 'V.90, 1998');
  call.end = end;
  return call.finish();
}
