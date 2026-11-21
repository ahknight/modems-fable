# Architecture decisions

## 1. Static site, no framework, no runtime dependencies

`docs/` is the whole site: one HTML page, one stylesheet, ES modules, five font files
and the images. GitHub Pages serves it from branch `main`, folder `/docs`, with no build
step on the server (`docs/.nojekyll` is present). The only development dependency is
Playwright, for browser tests.

Why: the brief asks for a small site judged by a person in three browsers. Fewer moving
parts means fewer ways to differ between them, and anyone can read the source.

## 2. Audio is synthesized in the browser, not shipped

There are no audio files. Each player asks `docs/js/synth.js` for a call by name;
a module Web Worker (`worker.js`) runs the matching builder in
`docs/js/handshakes/` and returns three channels of samples (caller, answerer,
network), spectrograms, and annotations. If module workers are unavailable the same
code runs on the main thread. Building the longest call takes about 0.15 s.

Why: it keeps the site small (the JavaScript is about 220 kB uncompressed; the
equivalent audio would be tens of megabytes), it makes every tone traceable to a line
of code citing a clause, and it allows per-modem soloing and variants that no
recording could offer.

Cost: the audio can only be as right as our reading of the standards. See
`fidelity.md` and `testing.md`.

## 3. One signal library shared by the page and the tests

`docs/js/dsp/core.js` (generation) and `analysis.js` (spectrogram, receivers) use only
typed arrays, so `node --test` imports exactly the modules the browser runs and
demodulates their output.

## 4. Annotations are data produced with the signal

A builder returns, besides audio:

- `segments`: every stretch of signal with lane, times, label, **fidelity** and a note
  citing its basis;
- `steps`: the narration, each with a start time and the era it first appeared in;
- `symbolTracks`, `bitTracks`, `pcmTracks`: what was actually modulated, for the lens.

The player draws all of this; nothing about a call is hard-coded in the UI. Because
the fidelity label travels with the segment, an approximation cannot be displayed as
protocol behavior by oversight, and a test asserts that every `approx` segment
explains itself.

## 5. The text alternative is built from the same data

`tools/build.mjs` runs the builders under Node and writes each player's step-by-step
narration and full signal table into `docs/index.html`. With JavaScript disabled the
page still contains every explanation (a browser test checks this). When a visitor
switches variant, the player re-renders the same structures from the new call.

## 6. Citations are a registry, checked at build time

Chapters in `src/chapters/` cite with `{{cite key}}`. `src/sources.json` holds one
entry per source. The build numbers citations by first use, fails on an unknown key,
and reports unused entries. Images are handled the same way through `src/media.json`,
which also generates the credits list, so an image cannot appear without its
attribution and license.

## 7. Playback and synchronization

One `AudioContext` for the page, created only inside a click handler. Each play
creates an `AudioBufferSourceNode` over a 3-channel buffer, routed through per-lane
gains (mute, left/right split) to a master gain. The playhead is derived from
`audioContext.currentTime` minus `outputLatency`, so picture and sound cannot drift.
Seeking and "pause after each step" restart the source at an offset; guided mode
schedules the source to stop exactly at the next step boundary.

Only one player sounds at a time, the decoded buffer of a player is released when
another starts, and playback stops if the tab is hidden.

Under `prefers-reduced-motion`, the playhead and lens update four times a second
instead of every frame, smooth scrolling is off, and the image-loading demonstration
steps at the same coarse rate. Nothing animates without being started by the visitor,
and everything that animates has pause, restart and seek controls.

## 8. Visual language

- Paper-colored editorial page; every interactive is a dark "instrument".
- Amber is always the calling modem, teal the answering modem, lavender the network.
- Solid, top-ruled and striped bars are the three fidelity levels.
- The "First appeared" row colors each step by the era of the standard it comes from.
  This row is the argument of the whole site in one line: the 56k handshake is a
  stack of earlier handshakes.

## 9. Things deliberately not done

- No audio recordings are included. The freely licensed recordings found do not say
  which standard they show, and the ones that do are ShareAlike; see `media.md`.
- No analytics, no external requests of any kind (a browser test asserts this).
- The spectrogram zooms to one fixed factor (4×), not continuously. The lens windows
  cover finer detail.

## 10. Repainting

The spectrogram canvas is drawn only when the picture changes (load, resize, zoom,
mute). The dimming of the not-yet-played part and the playhead are two positioned
elements moved during playback, so a frame of playback costs two style changes and
two small lens redraws, not a full-canvas repaint.
