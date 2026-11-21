// "Type something, and hear it at 300 baud": a text box wired to a normal player.

import { Player } from '../player.js';

export default function mount(el) {
  const panel = el.querySelector('.w-panel');
  panel.outerHTML = `
    <div class="w-panel w-typer">
      <label class="w-field"><span>Your text (up to 24 characters)</span><input type="text" maxlength="24" value="HELLO, WORLD" spellcheck="false" autocomplete="off"></label>
    </div>
    <figure class="player" data-call="fskText" data-options='{"text":"HELLO, WORLD"}'><div class="p-mount"></div></figure>`;
  const input = el.querySelector('input');
  const player = new Player(el.querySelector('figure.player'));
  let timer = 0;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // Bell 103 carried 7-bit ASCII; anything else becomes "?".
      const text = [...input.value].map((ch) => (ch.charCodeAt(0) < 128 ? ch : '?')).join('') || ' ';
      player.pause();
      player.t = 0;
      player.options = { text };
      player.load();
    }, 350);
  });
}
