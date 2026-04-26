import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const SRC = new URL('../../src/', import.meta.url).pathname;
const EXTENSIONS = new Set(['.njk', '.json', '.css', '.js', '.html', '.md']);
const FORBIDDEN = /[–—]/;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (EXTENSIONS.has(extname(entry))) out.push(full);
  }
  return out;
}

describe('typography', () => {
  it('source files contain no em-dash (—) or en-dash (–)', () => {
    const offenders = [];
    for (const file of walk(SRC)) {
      const text = readFileSync(file, 'utf8');
      const lines = text.split('\n');
      lines.forEach((line, i) => {
        if (FORBIDDEN.test(line)) offenders.push(`${file}:${i + 1}: ${line.trim()}`);
      });
    }
    expect(offenders, `Forbidden long dashes found:\n${offenders.join('\n')}`).toEqual([]);
  });
});
