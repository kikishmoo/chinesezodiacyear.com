import test from 'node:test';
import assert from 'node:assert/strict';
import { csvRows, parseGscCsv, prioritize } from './analyze-gsc-export.mjs';

test('CSV parser handles BOM, quoted comma, embedded newline and escaped quote', () => {
  const rows = csvRows('\uFEFFTop queries,Clicks\n"new year, chinese",12\n"say ""goat""",3\n"multi\nline",1\n');
  assert.deepEqual(rows, [
    ['Top queries', 'Clicks'],
    ['new year, chinese', '12'],
    ['say "goat"', '3'],
    ['multi\nline', '1']
  ]);
});
test('parses official percentage CTR and expected dimensions', () => {
  const queries = parseGscCsv('Top queries,Clicks,Impressions,CTR,Position\n"2027, goat",12,120,10%,7.5\n');
  assert.equal(queries.dimension, 'query');
  assert.equal(queries.rows[0].label, '2027, goat');
  assert.equal(queries.rows[0].ctr, .1);
  const pages = parseGscCsv('Top pages,Clicks,Impressions,CTR,Position\nhttps://chinesezodiacyear.com/,8,400,2%,3.1');
  assert.equal(pages.dimension, 'page');
  assert.equal(pages.rows[0].ctr, .02);
});
test('selects review candidates without inventing measured totals', () => {
  const rows = [
    { label: 'relevant topic', clicks: 25, impressions: 500, ctr: .05, position: 11 },
    { label: 'visible low ctr', clicks: 1, impressions: 400, ctr: .0025, position: 2 },
    { label: 'tiny', clicks: 1, impressions: 10, ctr: .1, position: 8 }
  ];
  assert.equal(prioritize(rows).length, 2);
  assert.ok(prioritize(rows).some(r => r.action.includes('low CTR')));
});
test('rejects inconsistent/missing figures and malformed CSV', () => {
  assert.throws(() => parseGscCsv('Top queries,Clicks,Impressions,CTR,Position\nbad,101,100,20%,2\n'), /invalid metric/);
  assert.throws(() => parseGscCsv('Top queries,Clicks\nbad,4'), /expected GSC export columns/);
  assert.throws(() => csvRows('A,B\n"unclosed,3'), /unterminated/);
});
