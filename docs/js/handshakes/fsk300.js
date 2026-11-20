// 300 bit/s frequency-shift keying: Bell 103 and its CCITT cousin, V.21.
//
// Sources: V.21 frequencies and channel use, ITU-T V.21 (1988) clauses 3 and 7;
// answer-tone timing, ITU-T V.25 (1996) clause 4. Bell 103 frequencies as
// tabulated in the Bell System data-set references (see notes/sources.md).

import { asyncFrame, fsk, tone } from '../dsp/core.js';
import { AMP, ANSWERER, CALLER, Call } from './call.js';

export const FSK_PLANS = {
  bell103: {
    name: 'Bell 103',
    caller: { mark: 1270, space: 1070 },
    answerer: { mark: 2225, space: 2025 },
  },
  v21: {
    name: 'V.21',
    caller: { mark: 980, space: 1180 },
    answerer: { mark: 1650, space: 1850 },
  },
};

const BAUD = 300;
const BIT = 1 / BAUD;

/** Bits for a modem that idles at mark and sends characters at the given bit offsets. */
function keyed(totalBits, events) {
  const bits = new Uint8Array(totalBits).fill(1);
  const chars = [];
  for (const { at, ch } of events) {
    const frame = asyncFrame(ch.charCodeAt(0));
    if (at + frame.length > totalBits) continue;
    bits.set(frame, at);
    chars.push({ bit: at, ch });
  }
  return { bits, chars };
}

/**
 * A complete 300 bit/s session: answer, carrier exchange, then a login typed by hand.
 * @param {object} [o]
 * @param {'bell103'|'v21'} [o.plan]
 */
export function fsk300({ plan = 'bell103' } = {}) {
  const p = FSK_PLANS[plan];
  const bell = plan === 'bell103';
  const call = new Call({ id: plan, title: `${p.name}, 300 bit/s`, standard: p.name });

  // -- Answering modem ---------------------------------------------------------
  const silence = 2.0;
  call.step(0, 'The line connects', 'The answering modem has picked up. For about two seconds it says nothing at all. The pause keeps the tones from interfering with the telephone network’s own signalling as the call is set up.', 'Telephone network');
  call.mark(ANSWERER, 0, silence, 'Silence', bell ? 'nominal' : 'spec', bell ? 'Answering data sets wait before sending carrier; two seconds is typical.' : 'V.25 clause 4.3: 1.8 to 2.5 s of silence after going off-hook.');

  let answerCarrier = silence;
  if (!bell) {
    const ans = 3.3;
    call.step(silence, 'Answer tone: 2100 Hz', 'A steady 2100 Hz tone says “a modem lives here”. It also tells echo suppressors on long-distance circuits to switch themselves off so that both ends can talk at once.', 'CCITT V.25');
    call.put(ANSWERER, silence, tone(2100, ans, { amp: AMP }), 'ANS 2100 Hz', 'spec', 'V.25: 2100 ± 15 Hz for 3.3 ± 0.7 s, then 75 ± 20 ms of silence.');
    answerCarrier = silence + ans + 0.075;
  }

  // -- Calling modem: hears carrier, answers with its own ----------------------
  const callerCarrier = answerCarrier + (bell ? 0.9 : 0.4);
  const dataStart = callerCarrier + 0.6;
  call.step(answerCarrier, `The answerer’s carrier: ${p.answerer.mark} Hz`, bell
    ? `The answering modem sends its “mark” tone, ${p.answerer.mark} Hz, and simply holds it. On a Bell 103 this high whistle is the answer tone and the idle carrier in one. Nothing is being said yet; it means “I am here, and I am sending ones.”`
    : `Now the answering modem sends its own idle carrier, ${p.answerer.mark} Hz, the “mark” tone of V.21’s upper channel.`, p.name);
  call.step(callerCarrier, `The caller replies: ${p.caller.mark} Hz`, `The calling modem has heard the answerer and switches on its own mark tone, lower in pitch at ${p.caller.mark} Hz. Two steady tones, one from each end, each in its own slice of the voice band so they never collide. That is the entire handshake.`, p.name);

  // -- Data: a login, typed by a person ---------------------------------------
  // Answerer (host) character events, then caller keystrokes echoed by the host.
  const hostEvents = [];
  const userEvents = [];
  const start = (t) => Math.round(t / BIT);
  const banner = '\r\nLOGIN: ';
  let hostBit = start(dataStart - answerCarrier);
  for (const ch of banner) {
    hostEvents.push({ at: hostBit, ch });
    hostBit += 10;
  }
  const typed = 'GUEST\r';
  const gaps = [0.5, 0.21, 0.28, 0.17, 0.24, 0.42]; // a human at a keyboard
  let userTime = dataStart + banner.length * 10 * BIT;
  const keyTimes = [];
  typed.split('').forEach((ch, i) => {
    userTime += gaps[i];
    const at = start(userTime - callerCarrier);
    userEvents.push({ at, ch });
    keyTimes.push(callerCarrier + at * BIT);
    // The host echoes each character once it has fully arrived.
    const echoAt = start(callerCarrier + (at + 11) * BIT - answerCarrier);
    hostEvents.push({ at: echoAt, ch });
    if (ch === '\r') hostEvents.push({ at: echoAt + 10, ch: '\n' });
  });
  const endTime = userTime + 0.9;

  const emit = (who, t0, freqs, events) => {
    const { bits, chars } = keyed(Math.round((endTime - t0) / BIT), events);
    call.lines[who].add(t0, fsk(bits, { baud: BAUD, ...freqs, amp: AMP }));
    call.bitTracks.push({ who, t0, baud: BAUD, bits, chars, ...freqs });
  };
  emit(ANSWERER, answerCarrier, p.answerer, hostEvents);
  emit(CALLER, callerCarrier, p.caller, userEvents);

  const idleNote = 'Frequencies per the standard. When each modem starts depends on its carrier-detect timers; these delays are typical.';
  call.mark(ANSWERER, answerCarrier, dataStart, `Mark ${p.answerer.mark} Hz`, 'nominal', idleNote);
  call.mark(CALLER, callerCarrier, dataStart, `Mark ${p.caller.mark} Hz`, 'nominal', idleNote);
  const dataNote = `Continuous-phase FSK at 300 baud: 1 = ${'{mark}'} Hz, 0 = ${'{space}'} Hz, one start bit, eight data bits, one stop bit. The text is our example; character timing is snapped to the bit clock.`;
  call.mark(ANSWERER, dataStart, endTime, 'Data: host', 'spec', dataNote.replace('{mark}', p.answerer.mark).replace('{space}', p.answerer.space));
  call.mark(CALLER, dataStart, endTime, 'Data: you', 'spec', dataNote.replace('{mark}', p.caller.mark).replace('{space}', p.caller.space));

  call.step(dataStart, 'Connected: the host speaks', `The host sends a prompt. Every time its tone dips from ${p.answerer.mark} to ${p.answerer.space} Hz, that is a zero bit; back up is a one. Each character is ten of these: a start bit, eight data bits, a stop bit. At 300 bits per second that is 30 characters per second, about as fast as you can read.`, p.name);
  call.step(keyTimes[0] - 0.15, 'You type; the host echoes', `Now a person types G-U-E-S-T. Each keystroke is a brief warble in the caller’s lower tone, and a moment later the same warble comes back in the answerer’s higher tone: the host echoing the character so it appears on screen. Between keystrokes both tones hold steady. The line is never silent.`, p.name);
  call.end = endTime;
  return call.finish();
}

/** Free-typing playground: one modem sending `text` as 300 bit/s FSK. */
export function fskText(text, { plan = 'bell103', side = 'caller', lead = 0.25 } = {}) {
  const freqs = FSK_PLANS[plan][side];
  const who = side === 'caller' ? CALLER : ANSWERER;
  const call = new Call({ id: 'typed', title: 'Typed text', standard: FSK_PLANS[plan].name });
  const leadBits = Math.round(lead / BIT);
  const events = [...text].map((ch, i) => ({ at: leadBits + i * 10, ch }));
  const { bits, chars } = keyed(leadBits * 2 + text.length * 10, events);
  call.lines[who].add(0, fsk(bits, { baud: BAUD, ...freqs, amp: AMP }));
  call.bitTracks.push({ who, t0: 0, baud: BAUD, bits, chars, ...freqs });
  call.mark(who, 0, bits.length * BIT, 'Your text', 'spec', '');
  return call.finish(0.05);
}
