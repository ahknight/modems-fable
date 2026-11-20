// Front door to synthesis for the page: runs builders in a worker (falling
// back to the main thread), and keeps only the few most recent results, since
// one call is several megabytes of samples.

const KEEP = 3;
const cache = new Map(); // key -> Promise<{call, spectra}>
const waiting = new Map(); // request id -> {resolve, reject}
let worker = null;
let workerBroken = false;
let nextId = 1;

function startWorker() {
  if (worker || workerBroken) return worker;
  try {
    worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }) => {
      const request = waiting.get(data.id);
      waiting.delete(data.id);
      if (data.error) request?.reject(new Error(data.error));
      else request?.resolve(data);
    };
    worker.onerror = () => {
      // Module workers unavailable (or blocked): redo outstanding work inline.
      workerBroken = true;
      worker = null;
      for (const [id, request] of waiting) {
        waiting.delete(id);
        inline(request.name, request.options).then(request.resolve, request.reject);
      }
    };
  } catch {
    workerBroken = true;
    worker = null;
  }
  return worker;
}

async function inline(name, options) {
  const [{ builders }, { spectrogram }] = await Promise.all([import('./handshakes/index.js'), import('./dsp/analysis.js')]);
  const call = builders[name](options);
  return { call, spectra: call.channels.map(spectrogram) };
}

function run(name, options) {
  const w = startWorker();
  if (!w) return inline(name, options);
  return new Promise((resolve, reject) => {
    const id = nextId++;
    waiting.set(id, { resolve, reject, name, options });
    w.postMessage({ id, name, options });
  });
}

/**
 * Synthesize a call. Resolves to `{call, spectra}`; see handshakes/call.js for the shape.
 * @param {string} name a key of `builders`
 * @param {object} [options] passed to the builder
 */
export function generate(name, options = {}) {
  const key = `${name}:${JSON.stringify(options)}`;
  const hit = cache.get(key);
  if (hit) {
    cache.delete(key);
    cache.set(key, hit); // most recently used last
    return hit;
  }
  const promise = run(name, options);
  cache.set(key, promise);
  promise.catch(() => cache.delete(key));
  while (cache.size > KEEP) cache.delete(cache.keys().next().value);
  return promise;
}
