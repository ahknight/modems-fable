// Page bootstrap: players, widgets, and the chapter indicator in the top bar.

import { mountPlayers } from './player.js';

mountPlayers();

// Widgets are loaded only if the page contains them.
const widgets = {
  typer: () => import('./widgets/typer.js'),
  constellation: () => import('./widgets/constellation.js'),
  download: () => import('./widgets/download.js'),
  progressive: () => import('./widgets/progressive.js'),
  shannon: () => import('./widgets/shannon.js'),
  ladder: () => import('./widgets/ladder.js'),
};
for (const el of document.querySelectorAll('[data-widget]')) {
  widgets[el.dataset.widget]?.().then((module) => module.default(el)).catch((error) => console.error(el.dataset.widget, error));
}

// Highlight the chapter being read.
const links = new Map([...document.querySelectorAll('.topbar li a')].map((a) => [a.getAttribute('href').slice(1), a]));
const seen = new Set();
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) seen.add(entry.target.id);
    else seen.delete(entry.target.id);
  }
  const current = [...links.keys()].filter((id) => seen.has(id)).at(-1);
  for (const [id, a] of links) {
    if (id === current) {
      a.setAttribute('aria-current', 'true');
      a.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    } else a.removeAttribute('aria-current');
  }
}, { rootMargin: '-45% 0px -45% 0px' });
for (const id of links.keys()) {
  const section = document.getElementById(id);
  if (section) observer.observe(section);
}
