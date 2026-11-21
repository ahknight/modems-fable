// Real-browser checks, run in Chromium, Firefox and WebKit via Playwright.
// Usage: node tests/browser.mjs [engine ...]      (default: all three)
//
// What it verifies, per engine:
//   - the page loads with no console errors or failed requests, and makes no off-site request
//   - no AudioContext exists before a user gesture (nothing can auto-play)
//   - every player synthesizes its call and draws a non-blank spectrogram
//   - play / pause / seek / step / variant controls work, by mouse and by keyboard
//   - the playhead follows the audio clock
//   - "Pause after each step" stops at a step boundary
//   - every widget renders and responds
//   - with JavaScript disabled, the step-by-step text and signal tables are still present

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import * as playwright from 'playwright';

const engines = process.argv.slice(2).length ? process.argv.slice(2) : ['chromium', 'firefox', 'webkit'];
const port = 8600 + Math.floor(Math.random() * 90);
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [fileURLToPath(new URL('../tools/serve.mjs', import.meta.url)), String(port)], { stdio: 'ignore' });
await new Promise((resolve) => setTimeout(resolve, 500));

const seconds = (text) => {
  const [m, s] = text.split('/')[0].trim().split(':');
  return Number(m) * 60 + Number(s);
};

async function check(engine) {
  const browser = await playwright[engine].launch();
  const log = [];
  const note = (message) => log.push(message);
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    const problems = [];
    const offsite = [];
    page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
    page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) => problems.push(`failed: ${r.url()}`));
    page.on('request', (r) => !r.url().startsWith(origin) && !r.url().startsWith('data:') && !r.url().startsWith('blob:') && offsite.push(r.url()));
    await page.addInitScript(() => {
      window.__contexts = 0;
      for (const name of ['AudioContext', 'webkitAudioContext']) {
        const Real = window[name];
        if (!Real) continue;
        window[name] = class extends Real {
          constructor(...args) {
            super(...args);
            window.__contexts++;
            window.__audio = this;
          }
        };
      }
    });
    await page.goto(origin, { waitUntil: 'load' });
    assert.equal(await page.evaluate(() => window.__contexts), 0, 'no AudioContext before a user gesture');

    // Every player loads and paints.
    const players = page.locator('main figure.player');
    const count = await players.count();
    assert.ok(count >= 9, `expected at least 9 players, found ${count}`);
    for (let i = 0; i < count; i++) {
      const player = players.nth(i);
      await player.scrollIntoViewIfNeeded();
      await player.locator('.p-status').waitFor({ state: 'hidden', timeout: 30000 });
      const lit = await player.locator('canvas.p-spectro').evaluate((canvas) => {
        const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        let bright = 0;
        for (let k = 0; k < data.length; k += 4) if (data[k] + data[k + 1] + data[k + 2] > 120) bright++;
        return bright / (data.length / 4);
      });
      assert.ok(lit > 0.004, `player ${i}: spectrogram has content (${lit})`);
      assert.ok((await player.locator('.p-lanes .seg').count()) >= 2, `player ${i}: lanes drawn`);
    }
    assert.equal(await page.evaluate(() => window.__contexts), 0, 'synthesizing and drawing creates no AudioContext');
    note(`${count} players synthesized and drawn`);

    // Transport on the 1200 bit/s player.
    const p = page.locator('#p1200');
    await p.scrollIntoViewIfNeeded();
    const time = p.locator('.p-time');
    await p.locator('.p-play').click();
    await page.waitForTimeout(1600);
    assert.equal(await page.evaluate(() => window.__contexts), 1, 'one AudioContext after pressing play');
    const state = await page.evaluate(() => window.__audio.state);
    const t1 = seconds(await time.textContent());
    assert.ok(t1 > 0.8 && t1 < 2.6, `playhead advanced with the audio clock (${t1} s, context ${state})`);
    assert.equal(await p.locator('.p-play .label').textContent(), 'Pause');
    await p.locator('.p-play').click();
    const paused = seconds(await time.textContent());
    await page.waitForTimeout(400);
    assert.equal(seconds(await time.textContent()), paused, 'pause holds the playhead');
    note(`audio context ${state}; playhead at ${t1.toFixed(1)} s after 1.6 s of play`);

    // Keyboard: seek slider and buttons.
    await p.locator('.p-seek').focus();
    await page.keyboard.press('End');
    assert.ok(seconds(await time.textContent()) > 8, 'End key seeks to the end');
    await page.keyboard.press('Home');
    assert.equal(seconds(await time.textContent()), 0);
    await p.locator('.p-next').focus();
    await page.keyboard.press('Enter');
    const stepTitle = await p.locator('.p-step-title').textContent();
    assert.ok(seconds(await time.textContent()) > 1.5, 'Next step moved the playhead');
    assert.ok(await p.locator('.steps li.is-current').count(), 'the current step is highlighted in the text list');
    await p.locator('.p-restart').click();
    note(`keyboard seek and step controls work (stepped to “${stepTitle}”)`);

    // Guided mode stops at the next step boundary.
    await p.locator('.p-guided').check();
    await p.locator('.p-play').click();
    await page.waitForFunction(() => document.querySelector('#p1200 .p-play .label').textContent !== 'Pause', null, { timeout: 8000 });
    const stopped = seconds(await time.textContent());
    const boundary = Number(await p.locator('.steps li').nth(1).getAttribute('data-t'));
    assert.ok(Math.abs(stopped - boundary) < 0.15, `guided mode paused at the step boundary (${stopped} vs ${boundary})`);
    assert.equal(await p.locator('.p-play .label').textContent(), 'Continue');
    await p.locator('.p-guided').uncheck();
    note(`guided mode paused at ${stopped.toFixed(2)} s`);

    // Variants re-synthesize and re-render the text.
    const before = await p.locator('.steps li').nth(1).textContent();
    await p.locator('[data-variant="1"]').click();
    await page.waitForFunction((old) => document.querySelector('#p1200 .steps li:nth-child(2)').textContent !== old, before, { timeout: 15000 });
    assert.match(await p.locator('.steps').textContent(), /2225/);
    note('variant switch re-synthesized');

    // Starting a second player stops the first.
    await p.locator('.p-play').click();
    const q = page.locator('#p2400');
    await q.scrollIntoViewIfNeeded();
    await q.locator('.p-play').click();
    await page.waitForTimeout(300);
    assert.equal(await p.locator('.p-play .label').textContent() === 'Pause', false, 'only one player sounds at a time');
    await q.locator('.p-play').click();

    // Clicking the picture seeks.
    const stage = await q.locator('.p-stage').boundingBox();
    await q.locator('.p-stage').click({ position: { x: stage.width / 2, y: 40 } });
    const mid = seconds(await q.locator('.p-time').textContent());
    const total = Number(await q.locator('.p-seek').getAttribute('max'));
    assert.ok(Math.abs(mid - total / 2) < 0.3, `clicking mid-picture seeks to the middle (${mid} of ${total})`);

    // Zoom stretches the timeline four times and keeps the playhead in view.
    await q.locator('.p-zoom').click();
    const view = await q.locator('.p-scroll').evaluate((el) => ({ scroll: el.scrollWidth, client: el.clientWidth, left: el.scrollLeft }));
    assert.ok(view.scroll > 3.9 * view.client, `zoomed timeline is four times as wide (${view.scroll} vs ${view.client})`);
    assert.ok(Math.abs(view.left + view.client / 2 - view.scroll / 2) < 4, 'zoom centers on the playhead');
    await q.locator('.p-zoom').click();
    assert.equal(await q.locator('.p-scroll').evaluate((el) => el.scrollWidth <= el.clientWidth + 1), true, 'zoom out restores the full view');

    // Widgets.
    for (const [name, probe] of [
      ['typer', async (w) => {
        await w.locator('input[type=text]').fill('MODEM');
        await page.waitForTimeout(1500);
        await w.locator('.p-status').waitFor({ state: 'hidden' });
        assert.ok(Number(await w.locator('.p-seek').getAttribute('max')) > 0.5);
      }],
      ['constellation', async (w) => {
        await w.locator('[data-set="3"]').click();
        await w.locator('.snr').fill('14');
        assert.match(await w.locator('.w-out').textContent(), /128 points.*misread/s);
      }],
      ['download', async (w) => {
        await w.locator('.file').selectOption('4');
        // 1,474,560 bytes x 8 bits x 1.03 / 300 bit/s = 40,501 s
        assert.match(await w.locator('.w-out').textContent(), /At 300 bit\/s: 11 h 15 min/);
      }],
      ['progressive', async (w) => {
        await w.locator('.play').click();
        await page.waitForTimeout(700);
        await w.locator('.play').click();
        assert.ok(Number(await w.locator('.pos').inputValue()) > 0.01, 'download animation advanced');
        await w.locator('.restart').click();
        assert.equal(Number(await w.locator('.pos').inputValue()), 0);
      }],
      ['shannon', async (w) => {
        await w.locator('.hz').fill('3100');
        await w.locator('.db').fill('34');
        assert.match(await w.locator('.w-out').textContent(), /Capacity: 35,0\d\d bit\/s/);
      }],
      ['ladder', async (w) => {
        await w.locator('[data-rate="6"]').click();
        assert.match(await w.locator('.w-out').textContent(), /56,000 bit\/s.*64 levels/s);
      }],
    ]) {
      const widget = page.locator(`[data-widget="${name}"]`);
      await widget.scrollIntoViewIfNeeded();
      await widget.locator('.w-panel :is(canvas, input, select)').first().waitFor({ timeout: 10000 });
      await probe(widget);
    }
    note('six widgets render and respond');

    assert.deepEqual(problems, [], 'no console errors or failed requests');
    assert.deepEqual(offsite, [], 'no off-site requests');
    await page.screenshot({ path: `/tmp/handshake-${engine}.png` });

    // Reduced motion: still plays and tracks, in coarse steps.
    const calm = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1000, height: 800 } });
    const calmPage = await calm.newPage();
    await calmPage.goto(origin);
    const hero = calmPage.locator('#hero');
    await hero.locator('.p-status').waitFor({ state: 'hidden', timeout: 30000 });
    await hero.locator('.p-play').click();
    await calmPage.waitForTimeout(1200);
    assert.ok(seconds(await hero.locator('.p-time').textContent()) > 0.4, 'plays under prefers-reduced-motion');
    await calm.close();

    // Without JavaScript the narration and tables are in the page.
    const plain = await browser.newContext({ javaScriptEnabled: false });
    const plainPage = await plain.newPage();
    await plainPage.goto(origin);
    assert.ok((await plainPage.locator('.steps li').count()) > 60, 'step text present without JavaScript');
    assert.ok((await plainPage.locator('.seglist tbody tr').count()) > 200, 'signal tables present without JavaScript');
    assert.ok((await plainPage.locator('.sources li').count()) > 150, 'sources present');
    await plain.close();
    note('reduced-motion and no-JavaScript modes verified');
    return { engine, version: browser.version(), ok: true, log };
  } catch (error) {
    return { engine, version: browser.version(), ok: false, log, error: error.message };
  } finally {
    await browser.close();
  }
}

let failed = false;
for (const engine of engines) {
  const result = await check(engine);
  console.log(`\n${result.ok ? 'PASS' : 'FAIL'}  ${result.engine} ${result.version}`);
  for (const line of result.log) console.log(`  · ${line}`);
  if (!result.ok) {
    failed = true;
    console.log(`  ✖ ${result.error}`);
  }
}
server.kill();
process.exit(failed ? 1 : 0);
