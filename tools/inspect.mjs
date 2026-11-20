// Print a handshake's timeline, narration and peak level.
// Usage: node tools/inspect.mjs <name> [json-options]

import { builders } from '../docs/js/handshakes/index.js';

const [name, json = '{}'] = process.argv.slice(2);
if (!builders[name]) {
  console.error(`Unknown handshake "${name}". Known: ${Object.keys(builders).join(', ')}`);
  process.exit(1);
}
const started = performance.now();
const call = builders[name](JSON.parse(json));
const elapsed = performance.now() - started;
const lanes = ['caller  ', 'answerer', 'network '];
for (const s of call.segments) {
  console.log(`${s.t0.toFixed(3).padStart(7)} ${s.t1.toFixed(3).padStart(7)}  ${lanes[s.who]}  ${s.fidelity.padEnd(7)}  ${s.label}`);
}
console.log();
for (const s of call.steps) console.log(`${s.t.toFixed(2).padStart(6)}  ${s.title}  [${s.origin}]`);
let peak = 0;
for (let i = 0; i < call.channels[0].length; i++) {
  peak = Math.max(peak, Math.abs(call.channels[0][i] + call.channels[1][i] + call.channels[2][i]));
}
console.log(`\n${call.title}: ${call.duration} s, peak of mix ${peak.toFixed(3)}, built in ${elapsed.toFixed(0)} ms`);
