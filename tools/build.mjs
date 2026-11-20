// Assembles docs/index.html from src/. No dependencies.
//
//   src/page.html            the shell, with {{chapters}}, {{nav}}, {{sources}}, {{credits}}
//   src/chapters/NN-*.html   one file per chapter, in order
//   src/sources.json         citation registry: key -> {author, title, container, date, url, note}
//   src/media.json           third-party media: key -> {file, alt, caption, credit, license, licenseUrl, source, changes}
//
// In chapter files:
//   {{cite key ...}}                 numbered citation(s); unknown keys fail the build
//   {{photo key}} / {{photo key wide}}  a credited figure from media.json
//   <figure class="player" data-call="..."> gets its controls mount and, rendered here from the
//   same code the browser runs, the step-by-step text and signal table (so they exist without JS).

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { escapeHtml, fidelitySummary, segmentsHtml, stepsHtml } from '../docs/js/annotate.js';
import { builders } from '../docs/js/handshakes/index.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (path) => readFile(root + path, 'utf8');
const errors = [];

const sources = JSON.parse(await read('src/sources.json'));
const media = JSON.parse(await read('src/media.json'));
const chapterFiles = (await readdir(`${root}src/chapters`)).filter((f) => f.endsWith('.html')).sort();
let body = (await Promise.all(chapterFiles.map((f) => read(`src/chapters/${f}`)))).join('\n');

// --- Citations -------------------------------------------------------------------
const order = [];
body = body.replace(/\s*\{\{cite ([^}]+)\}\}/g, (_, keys) => {
  const links = keys.trim().split(/\s+/).map((key) => {
    if (!sources[key]) {
      errors.push(`Unknown citation key "${key}"`);
      return '?';
    }
    if (!order.includes(key)) order.push(key);
    const n = order.indexOf(key) + 1;
    return `<a href="#src-${key}" aria-label="Source ${n}">${n}</a>`;
  });
  return `<sup class="cite">${links.join('<span aria-hidden="true">,</span> ')}</sup>`;
});

const link = (url, text) => `<a href="${escapeHtml(url)}" rel="noopener">${text}</a>`;
function sourceHtml(key, n) {
  const s = sources[key];
  const parts = [
    s.author && `${escapeHtml(s.author)}.`,
    s.url ? link(s.url, `<cite>${escapeHtml(s.title)}</cite>`) : `<cite>${escapeHtml(s.title)}</cite>`,
    s.container && `${escapeHtml(s.container)},`,
    s.date && `${escapeHtml(s.date)}.`,
    s.note && `<span class="src-note">${escapeHtml(s.note)}</span>`,
  ].filter(Boolean);
  return `<li id="src-${key}" value="${n}">${parts.join(' ')}</li>`;
}
const sourcesHtml = order.map((key, i) => sourceHtml(key, i + 1)).join('\n');
const unused = Object.keys(sources).filter((key) => !order.includes(key));

// --- Photos ----------------------------------------------------------------------
const usedMedia = [];
function creditHtml(m) {
  const license = m.licenseUrl ? link(m.licenseUrl, escapeHtml(m.license)) : escapeHtml(m.license);
  return `${escapeHtml(m.credit)}, ${license}, ${link(m.source, 'source')}${m.changes ? `. ${escapeHtml(m.changes)}` : ''}`;
}
body = body.replace(/\{\{photo (\S+)( [^}]+)?\}\}/g, (_, key, flags = '') => {
  const m = media[key];
  if (!m) {
    errors.push(`Unknown media key "${key}"`);
    return '';
  }
  if (!usedMedia.includes(key)) usedMedia.push(key);
  return `<figure class="photo${flags}">
  <img src="media/${m.file}" alt="${escapeHtml(m.alt)}" width="${m.width}" height="${m.height}" loading="lazy" decoding="async">
  <figcaption>${m.caption} <span class="credit">${creditHtml(m)}.</span></figcaption>
</figure>`;
});
const creditsHtml = usedMedia.map((key) => `<li><b>${escapeHtml(media[key].alt)}</b> <span>${creditHtml(media[key])}.</span></li>`).join('\n');

// --- Players ---------------------------------------------------------------------
const attr = (tag, name) => new RegExp(`${name}='([^']*)'|${name}="([^"]*)"`).exec(tag)?.slice(1).find((v) => v !== undefined);
body = body.replace(/(<figure class="player"[^>]*>)([\s\S]*?)<\/figure>/g, (_, open, inner) => {
  const name = attr(open, 'data-call');
  const variants = JSON.parse(attr(open, 'data-variants') || '[]');
  const options = variants[0]?.options ?? JSON.parse(attr(open, 'data-options') || '{}');
  if (!builders[name]) {
    errors.push(`Unknown call "${name}"`);
    return '';
  }
  const call = builders[name](options);
  const share = fidelitySummary(call);
  return `${open}${inner}
  <div class="p-mount"><p class="p-nojs">The interactive player needs JavaScript. Everything it plays is described in words below.</p></div>
  <div class="p-text">
    <details class="steplist" open>
      <summary>What you hear, step by step</summary>
      <ol class="steps">${stepsHtml(call)}
      </ol>
    </details>
    <details class="seglist">
      <summary>Every signal in this recording, and how faithful each one is</summary>
      <p class="seg-intro">Synthesized in your browser, ${call.duration.toFixed(1)} seconds. By duration of signal, ${share.spec + share.nominal}% follows the cited standard and ${share.approx}% is a labeled approximation. Hover or focus a row’s “Basis” for the clause it comes from.</p>
      <div class="seglist-body table-scroll">${segmentsHtml(call)}
      </div>
    </details>
  </div>
</figure>`;
});

// --- Navigation from chapter headings --------------------------------------------
const nav = [...body.matchAll(/<section class="chapter[^"]*" id="([^"]+)" data-nav="([^"]+)"(?: data-sub="([^"]*)")?/g)]
  .map(([, id, label, sub]) => `<li><a href="#${id}"><b>${escapeHtml(label)}</b>${sub ? `<span>${escapeHtml(sub)}</span>` : ''}</a></li>`).join('\n');

const leftover = body.match(/\{\{[^}]*\}\}/g);
if (leftover) errors.push(`Unprocessed tokens: ${[...new Set(leftover)].join(' ')}`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const page = (await read('src/page.html'))
  .replace('{{chapters}}', () => body)
  .replace('{{nav}}', () => nav)
  .replace('{{sources}}', () => sourcesHtml)
  .replace('{{credits}}', () => creditsHtml)
  .replace('{{built}}', () => new Date().toISOString().slice(0, 10));
await writeFile(`${root}docs/index.html`, page);
const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).length;
console.log(`docs/index.html: ${(page.length / 1024).toFixed(0)} kB, ~${words} words, ${order.length} sources cited, ${usedMedia.length} images`);
if (unused.length) console.log(`Sources never cited: ${unused.join(', ')}`);
