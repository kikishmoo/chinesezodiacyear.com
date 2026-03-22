/**
 * Tests for Windada adapter parser.
 *
 * Uses saved HTML fixtures — no network calls.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '../../adapters/windada-adapter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = (name) => readFileSync(resolve(__dirname, '../fixtures', name), 'utf-8');

describe('windada-adapter parse()', () => {
  it('extracts True Solar Time from valid response', () => {
    const html = fixture('windada-solar-time.html');
    const result = parse(html);

    expect(result).not.toBeNull();
    expect(result.year).toBe(2026);
    expect(result.month).toBe(3);
    expect(result.day).toBe(15);
    expect(result.hour).toBe(14);
    expect(result.minute).toBe(23);
    expect(result.second).toBe(45);
  });

  it('returns null when no solar time is found', () => {
    const html = fixture('windada-no-result.html');
    const result = parse(html);

    expect(result).toBeNull();
  });

  it('returns null for empty HTML', () => {
    expect(parse('')).toBeNull();
    expect(parse('<html></html>')).toBeNull();
  });
});
