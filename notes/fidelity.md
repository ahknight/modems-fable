# What the audio is, and is not

Every sound on the site is synthesized in the browser by `docs/js/handshakes/*.js`
from the documents listed below. This file records, per standard, what follows the
text exactly, what the text leaves to the implementer (and what we chose), and what
is approximated. The same information is attached to every timeline segment as a
`fidelity` label (`spec`, `nominal`, `approx`) and shown in the page.

Definitions used on the site:

| Label | Shown as | Meaning |
| --- | --- | --- |
| `spec` | Per the standard | Waveform, bit pattern and duration follow the cited clause. |
| `nominal` | Per the standard, timing typical | Waveform and bits follow the clause; the duration or start time depends on detection times, the far modem, or the line, so a representative value was chosen. |
| `approx` | Approximation (striped) | Something is simplified. The segment's note says what. |

## Applies to everything

- **Sample rate** 48 kHz. Chosen because it is 6 × 8000 (V.90's PCM clock) and gives a
  whole number of samples per symbol at 300, 600, 2400, 3000, 3200 and 3429 baud.
  2743 and 2800 baud use fractional symbol timing in the modulator.
- **Levels.** All modems transmit at the same nominal level (0.15 RMS of full scale).
  Real transmit levels were set by regulation and line loss; what a modem's speaker
  played was dominated by its own transmitter. We mix both ends equally so both can
  be heard. This is a presentation choice, not a measurement.
- **No channel.** No line noise, echo, frequency offset, attenuation distortion, or
  loudspeaker coloring is simulated. You hear what each modem puts on the line.
- **Time base.** Timelines are "as heard at the calling modem's line terminals". The
  answering modem's reactions include a round-trip delay (12 ms by default; 28 symbol
  intervals for V.32).
- **Detection times.** Standards say "on detecting X, do Y". How long detection takes
  is the implementer's business. We use short fixed values (tens of milliseconds) and
  label the affected segments `nominal`. Real handshakes are generally *longer* than
  ours for this reason and because modems extend training segments beyond the minimum.
- **Tone keying.** Tones are faded in and out over 2 ms to avoid clicks. Standards do
  not specify this.
- **Pulse shaping.** V.22/V.22 bis specify square-root raised cosine with 75% roll-off
  and we use exactly that. V.32/V.32 bis constrain only the band-edge spectrum; we use
  root-raised-cosine with 25% excess bandwidth. V.34 constrains the spectrum by a
  template; we use 12% excess bandwidth and no pre-emphasis (filter index 0).
  Pulses are truncated to ±8 (or ±16 for V.34) symbols with a Hann window.
- **Payload text** ("LOGIN:", "GUEST") is our example. Async characters are aligned to
  the bit clock, which real start-stop transmission need not be.

## 300 bit/s — Bell 103, V.21 (`fsk300.js`)

- V.21 frequencies and channel use: ITU-T V.21 §3, §7. Exact.
- V.21 answer sequence (1.8–2.5 s silence, 2100 Hz for 3.3 ± 0.7 s, 75 ± 20 ms
  silence): V.25 §4. Exact (2.0 s, 3.3 s, 75 ms).
- Bell 103 frequencies 1070/1270 and 2025/2225 Hz: **not from an AT&T document.**
  The 1967 AT&T 103A interface specification names the tones symbolically (F1M etc.).
  The numbers are from the 1976 Pennywhistle article, a 1977 advertisement and a 1983
  Hayes manual, which agree.
- Bell 103 answer timing (silence, when each carrier starts): `nominal`. We did not
  locate Bell's own timing specification.
- Continuous-phase FSK is assumed. Neither document mandates phase continuity.

## 1200 and 2400 bit/s — V.22, V.22 bis (`v22.js`)

- Carriers, 600 baud, differential quadrant encoding, scrambler 1 + x⁻¹⁴ + x⁻¹⁷,
  16-point constellation (read from Figure 2/V.22 bis), handshake timers (155 ms,
  456 ms, 270 ms, 765 ms; S1 100 ms; 600 ms; 200 ms): exact.
- The scrambler's 64-ones guard (V.22 §5.1) is not implemented; the standard itself
  disables it during the handshake, and our short data segments never trigger it.
- "Bell 212A-style answer": **modeled, not sourced from Bell.** We replace the V.25
  sequence and unscrambled ones with a 2225 Hz tone, on the authority of the note under
  V.22 §6.3.1.1, and otherwise run V.22's timers. We did not find the Bell 212A
  technical reference (PUB 41214). Labelled `nominal`.
- Guard tone variant: 1800 Hz, 6 dB below the data, per V.22 §2.1. The 1 dB reduction
  of the data signal that the standard notes is not applied.

## 9600 and 14 400 bit/s — V.32, V.32 bis (`v32.js`)

- Signal states, AA/AC/CA/CC, S, S̄, TRN (both the 2-state first 256 symbols and the
  4-state remainder), rate and E words, differential encoders, the 8-state trellis
  encoder and both mappings: exact. Tables 1–3 and Figures 1–3 of V.32 and Figures 1
  and 2-1 of V.32 bis were read from the rendered PDF pages because signs and figures
  do not survive text extraction.
- The 128-point V.32 bis mapping was transcribed by eye from Figure 2-1. It is checked
  by a property the figure must have: rotating any point 90° flips Y0, permutes Y1Y2
  in a fixed way, and leaves Q3–Q6 unchanged. All 128 labels satisfy it, as do all 32
  of V.32's (which come from a printed table). A single misread label would not.
- TRN is the minimum 1280 symbols; real modems commonly sent more. `spec`, with the
  note saying so.
- Rate words advertise 4800 and 9600 with trellis coding (V.32), or all V.32 bis rates.
  Which rates a modem offers is its own choice.
- Only the trellis-coded 9600 mode is synthesized, not the uncoded 16-point alternative.
- The optional special echo-canceller training sequence (V.32 §5.4 Note 3) is omitted.

## V.8 and V.8 bis (`v8.js`)

- ANSam (2100 Hz, ±20% AM at 15 Hz, phase reversals every 450 ms), the CM/JM coding
  format, preamble, octet layouts, CJ, Te ≥ 1 s and the 75 ms silences: exact.
- ANSam is scaled so its *average* amplitude equals the nominal level.
- No call indicator (CI) or calling tone is sent; V.8 permits "no signal".
- Octet contents (which modulations are offered) are an example.
- V.8 bis: only the answering station's CRe (1375 + 2002 Hz for 400 ms, then 400 Hz
  for 100 ms, 13 dB below nominal) is synthesized, and the caller does not respond.
  The wait before ANSam is our choice.

## 28 800 and 33 600 bit/s — V.34 (`v34.js`)

Faithful through the end of Phase 4's E sequence:

- INFO0/INFO1 frames: 600 bit/s binary DPSK on 1200/2400 Hz, fill, frame sync, CRC.
  Field *values* are a plausible example.
- Tones A and B with phase reversals at 40 ms spacing; L1/L2 (21 cosines, phases per
  Table 17, L1 6 dB hotter, 160 ms); S, S̄, PP (equation 10-1), TRN, J, J′, MP, MP′, E.
- Superconstellation numbering is generated by rule (§9.1) and checked against two
  rows of Figure 5.

Known deviations and reading notes:

- **Guard tone level.** The 02/98 text of §10.1.2.1 says Tone A is sent 1 dB below
  nominal "while the guard tone is transmitted at the nominal transmit power". That
  would make the total exceed nominal, and §10.1.2.3.1 gives the guard tone as 7 dB
  below nominal during INFO. We use −7 dB throughout and believe the §10.1.2.1 sentence
  has lost the words "7 dB below".
- **CRC bit order.** Implemented as the standard reflected CCITT-16 register preset to
  ones, transmitted LSB first, from our reading of Figure 14. Not checked against a
  reference modem.
- Line-probe *results* are invented: nothing measures our (ideal) line. The chosen
  symbol rate is an input to the synthesizer.
- TRN lengths (0.85 s in Phase 3, 0.45 s in Phase 4) are our choice within the limits.
- No MD segment; 4-point training only; MP Type 0 only (no precoder coefficients).

**Approximated: B1 and data.** Real V.34 selects points by shell mapping, a 4D trellis
code, precoding and optional nonlinear encoding. We draw points uniformly at random
from the correct L-point constellation (Table 10, expanded shaping) at the correct
symbol rate and carrier. The spectrum, bandwidth and level are right; the result is
not a decodable V.34 data stream, and uniform selection has slightly different
statistics from shell-mapped selection.

The four "line quality" variants in the 33.6k chapter map a named quality to a symbol
rate and speed. That mapping is illustrative.

## 56 000 bit/s — V.90 (`v90.js`)

Faithful:

- Phase 1 (V.8 with the PCM category octets) and Phase 2, including the role swap:
  the digital modem takes V.34's call role, the analog modem its answer role (§9.2).
- Everything the analog modem sends in Phase 3 (V.34 S, S̄, PP, TRN; Ja per Table 12).
- The digital modem's Sd, S̄d, TRN1d, Jd, Jd′ and Ri/R̄i, built sample by sample from
  µ-law codewords (Table 1) at 8000 per second.

Our choices: UINFO = Ucode 79, the loudest codeword not exceeding −12 dBm0 (and > 66 as
Table 10 requires); upstream 3200 symbols/s at 28 800 bit/s; µ-law only.

Approximated:

- **PCM reconstruction.** The line card's decoder filter is a windowed-sinc low-pass
  at 3.7 kHz. Real filters differ. "+0" and "−0" are rendered as (nearly) zero volts.
- **DIL contents.** The structure follows §8.4.1; the descriptor (which codewords, in
  what order, segment lengths, sign and training patterns) is requested by the
  analog modem and was each manufacturer's design. Ours is invented: Ucodes 16–111
  ascending, 78-sample segments, alternating training/reference symbols, a pseudo-random
  32-bit sign pattern.
- **Digital modem Phase 4 and data** (TRN2d, MP, Ed, B1d, data): random µ-law codewords
  from a plausible constellation within the power limit. The real signal comes from
  V.90's modulus encoder and spectral shaper using constellations negotiated in CP.
- **CPt/CP frames**: correct V.34 4-point modulation and frame skeleton, placeholder
  contents.
- **Upstream data**: as V.34 above.
- The dial tone, digits and ringback use North American frequencies (ITU E.180 list;
  Q.23); their durations are typical.

## Things real recordings have that ours do not

Listeners comparing with memory or with recordings may notice: ours are shorter;
there is no line noise or echo; and some remembered sounds are artifacts we do not
model. In particular we make no claim about which signal produces the "bong" or
"boing" many people recall from 56k connections. We could not attribute it to a
specific clause with confidence, so the site does not describe it.
