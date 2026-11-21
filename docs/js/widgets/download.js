// "How long did that take?": download times across the generations.

import { duration, number } from './util.js';

/** Sizes in bytes. "exact" entries follow from a definition; the rest are representative. */
const FILES = [
  { name: 'A page of plain text', bytes: 2000, about: 'about 2 kB', text: true },
  { name: 'A long text file or mailing-list digest', bytes: 60000, about: 'about 60 kB', text: true },
  { name: 'One 640×480 photograph, well compressed', bytes: 60000, about: 'about 60 kB' },
  { name: 'One megabyte of anything', bytes: 1048576, about: '1,048,576 bytes' },
  { name: 'Every byte of a 1.44 MB floppy disk', bytes: 1474560, about: '1,474,560 bytes, exactly' },
  { name: 'A three-minute song as a 128 kbit/s MP3', bytes: 2880000, about: '2,880,000 bytes, by arithmetic' },
  { name: 'A large shareware game', bytes: 5000000, about: 'about 5 MB' },
  { name: 'A web browser installer', bytes: 15000000, about: 'about 15 MB' },
];
const SPEEDS = [
  [300, '300'], [1200, '1,200'], [2400, '2,400'], [9600, '9,600'], [14400, '14,400'], [28800, '28,800'], [33600, '33,600'],
  [46667, '56k (at a typical 46,667)'],
];

export default function mount(el) {
  el.querySelector('.w-panel').innerHTML = `
    <div class="w-grid">
      <label class="w-field"><span>What are you downloading?</span><select class="file">${FILES.map((f, i) => `<option value="${i}"${i === 3 ? ' selected' : ''}>${f.name} (${f.about})</option>`).join('')}</select></label>
      <div class="w-field"><span>Your modem also has</span>
        <label class="p-check"><input type="checkbox" class="ec" checked> Error correction (V.42 or MNP)</label>
        <label class="p-check"><input type="checkbox" class="comp"> Compression (V.42 bis), assumed 2:1 on text</label>
      </div>
    </div>
    <div class="w-bars" role="table" aria-label="Download time by modem speed"></div>
    <p class="w-out"></p>
    <p class="w-note">How this is figured. Without error correction, each byte costs 10 bits on the line: 8 of data plus a start and a stop bit. With V.42 or MNP the start and stop bits are not sent, but packets add framing; we assume 3% overhead, which is a round figure and not a measurement. Compression is applied only to files marked as text, at an assumed 2:1; the engineers who wrote V.42 bis expected “two to four times,” and already-compressed files gain nothing. Real calls were slower again whenever the line forced the modems below their top speed.</p>`;
  const file = el.querySelector('.file');
  const ec = el.querySelector('.ec');
  const comp = el.querySelector('.comp');
  const bars = el.querySelector('.w-bars');
  const out = el.querySelector('.w-out');

  function draw() {
    const f = FILES[Number(file.value)];
    comp.disabled = !ec.checked; // V.42 bis requires an error-corrected link
    const ratio = ec.checked && comp.checked && f.text ? 2 : 1;
    const bitsPerByte = ec.checked ? 8 * 1.03 : 10;
    const seconds = SPEEDS.map(([bps]) => (f.bytes * bitsPerByte) / ratio / bps);
    const longest = seconds[0];
    bars.innerHTML = SPEEDS.map(([, label], i) => `<div class="w-bar" role="row"><span role="cell">${label}</span><i role="presentation" style="width:${Math.max(0.3, (100 * seconds[i]) / longest)}%"></i><span role="cell">${duration(seconds[i])}</span></div>`).join('');
    const at = (bps) => seconds[SPEEDS.findIndex(([s]) => s === bps)];
    out.innerHTML = `At 300 bit/s: <b>${duration(at(300))}</b>. At 14,400: <b>${duration(at(14400))}</b>. At a good 56k connection: <b>${duration(at(46667))}</b>, about ${number(at(300) / at(46667))} times faster than where this story began.${comp.checked && ec.checked && !f.text ? ' Compression makes no difference to this file.' : ''}`;
  }
  for (const control of [file, ec, comp]) control.addEventListener('change', draw);
  draw();
}
