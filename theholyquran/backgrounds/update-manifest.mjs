import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DIR = dirname(fileURLToPath(import.meta.url));
const EXT = /\.(jpe?g|jfif|jpe|png|apng|webp|avif|gif|bmp|svg|ico)$/i;

const items = readdirSync(DIR)
  .filter((f) => EXT.test(f) && f !== 'manifest.json')
  .map((f) => ({ file: f, added: Math.round(statSync(join(DIR, f)).mtimeMs) }))
  .sort((a, b) => b.added - a.added);

writeFileSync(join(DIR, 'manifest.json'), JSON.stringify(items, null, 2) + '\n', 'utf8');
writeFileSync(join(DIR, 'list.js'), 'window.__READY_BG=' + JSON.stringify(items) + ';\n', 'utf8');
console.log('backgrounds: ' + items.length + ' image(s) -> manifest.json + list.js');
