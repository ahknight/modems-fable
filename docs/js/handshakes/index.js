// Registry of every synthesized call, by the name the page and tools use.

import { fsk300, fskText } from './fsk300.js';
import { v22 } from './v22.js';
import { v32 } from './v32.js';
import { v34 } from './v34.js';
import { v90 } from './v90.js';

export const builders = {
  fsk300,
  fskText: ({ text = 'HELLO', ...rest } = {}) => fskText(text, rest),
  v22,
  v32,
  v34,
  v90,
};
