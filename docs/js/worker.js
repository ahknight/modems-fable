// Synthesis worker: builds a call and its spectrograms off the main thread.

import { spectrogram } from './dsp/analysis.js';
import { builders } from './handshakes/index.js';

self.onmessage = ({ data: { id, name, options } }) => {
  try {
    const call = builders[name](options);
    const spectra = call.channels.map(spectrogram);
    const transfer = [...call.channels.map((c) => c.buffer), ...spectra.map((s) => s.data.buffer)];
    self.postMessage({ id, call, spectra }, transfer);
  } catch (error) {
    self.postMessage({ id, error: String(error?.stack || error) });
  }
};
