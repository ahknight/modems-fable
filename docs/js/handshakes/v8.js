// ITU-T V.8: the opening exchange used by V.34 and V.90 modems to discover
// what the other end can do before committing to a modulation.
//
// Sources: V.8 (11/2000) clause 5 (coding format), Tables 1-7 (octets),
// clause 7.2 (ANSam), clause 8 (procedure and timers); V.8 bis (11/2000)
// clause 7.1 (CRe tones and levels).

import { fsk, mix, tone } from '../dsp/core.js';
import { FSK_PLANS } from './fsk300.js';
import { AMP, ANSWERER, CALLER } from './call.js';

const BIT = 1 / 300;
const bitsOf = (s) => [...s.replaceAll(' ', '')].map(Number);
/** An information octet on the wire: start bit, b0..b7 in order of transmission, stop bit. */
const octet = (name, b) => ({ name, bits: [0, ...bitsOf(b), 1] });

const PREAMBLE = bitsOf('1111111111 0000001111'); // ten ones, then CM/JM synchronization (Table 1/V.8)

/**
 * The octets a modem puts in its menu (Tables 3-7/V.8).
 * @param {object} o
 * @param {boolean} o.v34 offer V.34 duplex
 * @param {boolean} o.pcm include the PCM-modem categories (V.90)
 * @param {boolean} o.digital this modem is digitally connected (the V.90 server side)
 */
export function menu({ v34 = true, pcm = false, digital = false } = {}) {
  const list = [
    octet('Call function: data', '1000 0 011'),
    octet(`Modulations: ${v34 ? 'V.34' : 'none'}${pcm ? ', PCM modem' : ''}`, `1010 0 ${pcm ? 1 : 0}${v34 ? 1 : 0}0`),
    octet('…also V.32 bis, V.22 bis', '110 010 00'),
    octet('…also V.21', '000 010 01'),
    octet('Protocol: V.42 error correction', '0101 0 100'),
  ];
  if (pcm) {
    list.push(octet(`Network access: ${digital ? 'digital' : 'analog'}`, `1011 0 00${digital ? 1 : 0}`));
    list.push(octet(`V.90: ${digital ? 'digital' : 'analog'} modem`, `1110 0 ${digital ? '01' : '10'}0`));
  }
  return list;
}

function sequence(octets) {
  const bits = [...PREAMBLE];
  const frames = [{ bit: 0, ch: 'ten ones' }, { bit: 10, ch: 'sync' }];
  for (const o of octets) {
    frames.push({ bit: bits.length, ch: o.name });
    bits.push(...o.bits);
  }
  return { bits, frames };
}

/** Repeat a menu sequence `count` times (optionally cut short), then append `tail` bits. */
function repeated(seq, count, cutBits = Infinity, tail = [], tailName = '') {
  const bits = [];
  const frames = [];
  for (let i = 0; i < count; i++) {
    for (const f of seq.frames) frames.push({ bit: bits.length + f.bit, ch: f.ch });
    bits.push(...seq.bits);
  }
  if (bits.length > cutBits) {
    bits.length = cutBits;
    while (frames.at(-1).bit >= cutBits) frames.pop();
  }
  if (tail.length) {
    frames.push({ bit: bits.length, ch: tailName });
    bits.push(...tail);
  }
  return { bits: Uint8Array.from(bits), frames };
}

/**
 * Phase 1 of a V.34 or V.90 call.
 * @returns {{sigC: number, sigA: number}} when each modem may begin Phase 2, in caller-ear time
 */
export function v8(call, { t = 0, rt, pcm = false, v8bis = false }) {
  const v21 = FSK_PLANS.v21;
  let ansam = t + 1.0;
  call.step(t, 'The line connects', 'The answering modem picks up and waits a moment before speaking.', 'V.25, 1968');

  if (v8bis) {
    // V.8 bis CRe from the answering station: dual tone, then a single identifying tone.
    const cre = t + 0.45;
    const level = AMP * 10 ** (-13 / 20);
    call.step(cre, 'A two-note question', 'First, a quiet two-note chirp that many people remember as the very start of the sound. It is a newer, optional greeting called V.8 bis, asking “do you speak any of the extended languages?” Our caller does not answer it, which is allowed, so the server moves on.', 'V.8 bis, 1996');
    call.put(ANSWERER, cre, mix(tone(1375, 0.4, { amp: level }), tone(2002, 0.4, { amp: level })), 'CRe 1375+2002', 'spec', 'V.8 bis 7.1: capabilities request, segment 1. 1375 + 2002 Hz for 400 ms, sent 12 to 15 dB below normal level.');
    call.put(ANSWERER, cre + 0.4, tone(400, 0.1, { amp: level * Math.SQRT2 }), '400 Hz', 'spec', 'V.8 bis 7.1: segment 2 of CRe, 400 Hz for 100 ms.');
    call.mark(ANSWERER, t, cre, 'Silence', 'spec', 'V.8 bis 10.2.2: at least 400 ms of silence before CRe.');
    ansam = cre + 0.5 + 1.2;
    call.mark(ANSWERER, cre + 0.5, ansam, 'Waiting', 'nominal', 'The answerer waits for a V.8 bis reply. How long before it gives up and sends ANSam is its own choice.');
  } else {
    call.mark(ANSWERER, t, ansam, 'Silence', 'nominal', 'V.8 8.2 requires at least 0.2 s of silence; modems commonly wait longer.');
  }

  // -- Caller: detect ANSam, stay silent for Te, then send CM until JM is understood
  const detect = 0.6;
  const te = 1.0; // V.8 8.1.1: Te >= 1 s when network echo cancellers are to be disabled
  const cmAt = ansam + detect + te;
  const cm = sequence(menu({ pcm, digital: false }));
  const jm = sequence(menu({ pcm, digital: true }));
  const jmAt = cmAt + 2 * cm.bits.length * BIT + rt + 0.01; // after two identical CM sequences
  const heardJm = jmAt + 2 * jm.bits.length * BIT; // two identical JM sequences
  const cmBits = Math.ceil((heardJm - cmAt) / BIT / 10) * 10; // "complete the current octet"
  const cj = new Array(3).fill([0, 0, 0, 0, 0, 0, 0, 0, 0, 1]).flat(); // three all-zero octets
  const cmTrack = repeated(cm, Math.ceil(cmBits / cm.bits.length), cmBits, cj, 'CJ: end of menu');
  const cjAt = cmAt + cmBits * BIT;
  const cjEnd = cjAt + cj.length * BIT;
  const jmEnd = cjEnd + rt;
  const jmTrack = repeated(jm, Math.ceil((jmEnd - jmAt) / BIT / jm.bits.length), Math.round((jmEnd - jmAt) / BIT));

  // -- ANSam: 2100 Hz, 15 Hz amplitude modulation, phase reversals every 450 ms
  const ansamLength = jmAt - ansam;
  const reversals = [];
  for (let x = 0.45; x < ansamLength; x += 0.45) reversals.push(x);
  call.step(ansam, 'Answer tone, now with a wobble', 'The 2100 Hz answer tone again, with its echo-canceller-defeating ticks every 450 ms. But now it also quivers, its loudness rising and falling fifteen times a second. That flutter is a flag to the caller: “I am a modern modem and I can negotiate. Send me your menu.” An old modem ignores the flutter and hears a plain answer tone.', 'V.8, 1994');
  call.put(ANSWERER, ansam, tone(2100, ansamLength, { amp: AMP / 1.2, reversals, am: { freq: 15, depth: 0.2 } }), 'ANSam 2100 Hz', 'nominal', 'V.8 7.2: 2100 Hz, amplitude-modulated ±20% at 15 Hz, phase reversed every 450 ± 25 ms. Sent until two identical CM sequences have been received.');
  call.mark(CALLER, ansam, ansam + detect, 'Detecting', 'nominal', 'Time for the caller to recognize ANSam; implementation-dependent.');
  call.mark(CALLER, ansam + detect, cmAt, 'Silence (Te)', 'spec', 'V.8 8.1.1: the caller stays silent for Te, at least 1 s when echo cancellers must be disabled.');

  const send = (who, at, track, freqs, label, note) => {
    call.put(who, at, fsk(track.bits, { baud: 300, ...freqs, amp: AMP }), label, 'spec', note);
    call.bitTracks.push({ who, t0: at, baud: 300, bits: track.bits, chars: track.frames, wide: true, ...freqs });
  };
  call.step(cmAt, 'The menus, in 300-baud', `The caller sends its “call menu”: a short list of every modulation it can do${pcm ? ', including a flag for 56k' : ''}, repeated over and over. It is sent in V.21, the 300 bit/s two-tone warble: the oldest and simplest signaling in the international rulebook, and so the safest common language. The answerer replies in the upper tone pair with the “joint menu”: the items they have in common.`, 'V.21, 1964');
  send(CALLER, cmAt, cmTrack, v21.caller, 'CM … CJ', 'V.8 7.3: call menu on V.21’s low channel (980/1180 Hz), repeated until two identical JMs are received, then three zero octets (CJ). The octet values are per Tables 3 to 7; which capabilities to list is our example.');
  send(ANSWERER, jmAt, jmTrack, v21.answerer, 'JM', 'V.8 7.4: joint menu on V.21’s high channel (1650/1850 Hz), repeated until CJ has been received.');
  return { sigC: cjEnd + 0.075, sigA: jmEnd + 0.075, cjEnd, jmEnd };
}
