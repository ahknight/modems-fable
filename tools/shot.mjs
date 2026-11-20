// Development aid: screenshot part of the local site in a real browser engine.
// Usage: node tools/shot.mjs <chromium|firefox|webkit> <selector> <out.png> [--play seconds] [--width px] [--dark]

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import * as playwright from 'playwright';

const [engine = 'chromium', selector = 'body', out = '/tmp/shot.png', ...flags] = process.argv.slice(2);
const flag = (name) => (flags.includes(name) ? flags[flags.indexOf(name) + 1] ?? true : null);
const port = 8700 + Math.floor(Math.random() * 200);
const server = spawn(process.execPath, [fileURLToPath(new URL('./serve.mjs', import.meta.url)), String(port)], { stdio: 'ignore' });
await new Promise((resolve) => setTimeout(resolve, 400));

const browser = await playwright[engine].launch();
try {
  const page = await browser.newPage({
    viewport: { width: Number(flag('--width') || 1280), height: 900 },
    colorScheme: flag('--dark') ? 'dark' : 'light',
    reducedMotion: flag('--reduced') ? 'reduce' : 'no-preference',
  });
  page.on('console', (message) => ['error', 'warning'].includes(message.type()) && console.log(`[${message.type()}]`, message.text()));
  page.on('pageerror', (error) => console.log('[pageerror]', error.message));
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
  const target = page.locator(selector).first();
  await target.scrollIntoViewIfNeeded();
  if (await target.locator('.p-status').count()) await target.locator('.p-status').first().waitFor({ state: 'hidden', timeout: 20000 });
  const seek = flag('--seek');
  if (seek) {
    await target.locator('.p-seek').evaluate((input, value) => {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, seek);
  }
  const play = flag('--play');
  if (play) {
    await target.locator('.p-play').click();
    await page.waitForTimeout(Number(play) * 1000);
    if (!flag('--keep')) await target.locator('.p-play').click();
  }
  await page.waitForTimeout(300);
  if (selector === 'body') await page.screenshot({ path: out, fullPage: Boolean(flag('--full')) });
  else await target.screenshot({ path: out });
  console.log(`${engine}: wrote ${out}`);
} finally {
  await browser.close();
  server.kill();
}
