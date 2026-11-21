# The Handshake

A history of the dial-up modem told through its sound: every tone, warble and hiss of
the handshake from 300 bit/s to 56k, synthesized in the browser from the original
standards, explained one generation at a time.

Live site: served by GitHub Pages from `main` / `docs`.

## What is here

| Path | What |
| --- | --- |
| `docs/` | The site. Static files only; this folder is what Pages serves. |
| `docs/js/dsp/` | Signal generation and analysis (no DOM; shared with the tests). |
| `docs/js/handshakes/` | One synthesizer per standard, each citing the clauses it follows. |
| `docs/js/player.js`, `lens.js` | The synchronized player and its close-up views. |
| `docs/js/widgets/` | The smaller interactives. |
| `src/` | Chapter text, the page shell, the source registry and the media registry. |
| `tools/build.mjs` | Assembles `docs/index.html` from `src/`. No dependencies. |
| `tests/` | Signal tests (`node --test`) and real-browser tests (Playwright). |
| `notes/` | Architecture, fidelity and approximations, source verification, test record. |
| `research/` | The fact sheets the history was written from. |
| `DEVLOG.md` | Append-only development journal. |

## Working on it

```sh
npm install                 # only Playwright, for browser tests
npm run build               # src/ -> docs/index.html
npm test                    # signal tests: decode the synthesized audio
npx playwright install chromium firefox webkit
node tests/browser.mjs      # Chromium, Firefox and WebKit
npm run serve               # http://127.0.0.1:8765/
node tools/inspect.mjs v34  # print any call's timeline
```

The built `docs/index.html` is committed, so deploying is a push.

## Honesty about the audio

Read [`notes/fidelity.md`](notes/fidelity.md) before relying on any sound here. In
short: handshake signals are built from the ITU-T Recommendations and tested by
decoding them; durations that depend on real modems and lines are representative; the
data that follows a V.34 or V.90 handshake, and parts of V.90's later phases, are
labeled approximations; nothing has been tested against hardware; and nobody has
listened to it yet. [`notes/testing.md`](notes/testing.md) lists what was and was not
tested.

## License

Original text, code, generated audio and diagrams: [CC BY-NC 4.0](LICENSE).

Not covered by that license, and kept under their own terms:

- Third-party images in `docs/media/`, each credited on the page and listed in
  [`notes/media.md`](notes/media.md).
- IBM Plex fonts in `docs/fonts/`, © IBM Corp., SIL Open Font License 1.1
  (`docs/fonts/OFL.txt`).
- Short quotations, which remain their authors'.

The ITU-T Recommendations the synthesizers follow are not included in this repository.
