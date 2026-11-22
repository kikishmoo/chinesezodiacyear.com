#!/usr/bin/env node
/**
 * Offline Google Search Console Search Results CSV prioritizer.
 *
 * No credentials, network requests or analytics identifiers.
 * Usage:
 *   node scripts/analyze-gsc-export.mjs Queries.csv Pages.csv
 *   node scripts/analyze-gsc-export.mjs path/to/export-directory
 *
 * A CSV export is a top-row sample, not guaranteed complete or additive to
 * property totals. Query and page groupings must NOT be added to one another.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';

function csvRows(source) {
  const text = source.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { current += '"'; i++; }
      else if (ch === '"') quoted = false;
      else current += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(current); current = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(current);
      if (row.some(c => c.trim())) rows.push(row);
      row = []; current = '';
    } else current += ch;
  }
  if (quoted) throw new Error('Malformed CSV: unterminated quoted field');
  row.push(current);
  if (row.some(c => c.trim())) rows.push(row);
  return rows;
}
const norm = s => String(s ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
const numerical = (s, percent = false) => {
  const v = String(s ?? '').trim().replace(/,/g, '').replace(/\s/g, '');
  if (!v || v === '—' || v === '-') return null;
  const number = Number(v.replace('%', ''));
  if (!Number.isFinite(number)) return null;
  return percent && v.includes('%') ? number / 100 : number;
};
function parseGscCsv(contents, filename = 'export.csv') {
  const data = csvRows(contents);
  if (data.length < 2) throw new Error(filename + ': no data rows');
  const header = data[0].map(norm);
  const field = (...choices) => choices.map(x => header.indexOf(x)).find(i => i >= 0) ?? -1;
  const dimIndex = field('top queries', 'queries', 'query', 'top pages', 'pages', 'page');
  const dimension = ['top queries', 'queries', 'query'].includes(header[dimIndex]) ? 'query' : 'page';
  const clicksIndex = field('clicks');
  const impressionsIndex = field('impressions');
  const ctrIndex = field('ctr');
  const positionIndex = field('position', 'average position');
  if ([dimIndex, clicksIndex, impressionsIndex, ctrIndex, positionIndex].some(i => i < 0)) {
    throw new Error(filename + ': expected GSC export columns (Top queries/Top pages, Clicks, Impressions, CTR, Position)');
  }
  const rows = [];
  for (const [index, record] of data.slice(1).entries()) {
    const label = record[dimIndex]?.trim();
    if (!label) continue;
    const clicks = numerical(record[clicksIndex]);
    const impressions = numerical(record[impressionsIndex]);
    const ctr = numerical(record[ctrIndex], true);
    const position = numerical(record[positionIndex]);
    if ([clicks, impressions, ctr, position].some(v => v === null) ||
        clicks < 0 || impressions < 0 || clicks > impressions ||
        ctr < 0 || ctr > 1 || position <= 0) {
      throw new Error(filename + ': invalid metric on CSV row ' + (index + 2));
    }
    rows.push({ label, clicks, impressions, ctr, position });
  }
  if (!rows.length) throw new Error(filename + ': no usable data rows');
  return { dimension, rows };
}
function opportunity(row) {
  if (row.impressions < 20) return null; // Noisy very small samples are deferred.
  const rank = row.position;
  if (rank > 4 && rank <= 20) return 'Improve relevance and content depth (positions 5–20)';
  if (rank <= 10 && row.ctr < 0.025 && row.impressions >= 100) {
    return 'Inspect search intent, titles and snippets (high visibility / low CTR)';
  }
  return null;
}
function prioritize(rows) {
  return rows
    .map(row => ({ ...row, action: opportunity(row) }))
    .filter(row => row.action)
    .sort((a, b) => (b.impressions * (1 - b.ctr)) - (a.impressions * (1 - a.ctr)))
    .slice(0, 25);
}
function asMarkdown(title, result) {
  const sorted = prioritize(result.rows);
  const out = [
    '## ' + title,
    '',
    'Input rows: **' + result.rows.length + '**. Candidate rows: **' + sorted.length + '** (top 25).',
    '',
    '| ' + (result.dimension === 'query' ? 'Search query' : 'Landing page') + ' | Impressions | Clicks | CTR | Avg. position | Suggested review |',
    '|---|---:|---:|---:|---:|---|'
  ];
  for (const row of sorted) {
    const label = row.label.replace(/\|/g, '\\|').replace(/[\r\n]/g, ' ');
    out.push('| ' + label + ' | ' + row.impressions.toLocaleString('en-US') + ' | ' +
      row.clicks.toLocaleString('en-US') + ' | ' + (row.ctr * 100).toFixed(1) + '% | ' +
      row.position.toFixed(1) + ' | ' + row.action + ' |');
  }
  if (!sorted.length) out.push('| No candidate above thresholds | — | — | — | — | Review more data before deciding |');
  return out.join('\n');
}

function main(args) {
  let files = args;
  if (files.length === 1 && statSync(files[0]).isDirectory()) {
    files = readdirSync(files[0]).filter(f => /\.csv$/i.test(f)).map(f => join(files[0], f));
  }
  if (!files.length) throw new Error('Specify GSC Queries.csv / Pages.csv or export directory');
  const parsed = new Map();
  for (const file of files) {
    // CSV exports contain other dimensions; skip unless query/page.
    const name = basename(file);
    if (!/(?:queries|pages)\.csv$/i.test(name) && files.length > 1) continue;
    const result = parseGscCsv(readFileSync(file, 'utf8'), name);
    if (parsed.has(result.dimension)) throw new Error('Duplicate dimension: ' + result.dimension);
    parsed.set(result.dimension, result);
  }
  if (!parsed.size) throw new Error('No query/page CSV exports recognized');
  const chunks = [
    '# Search Console organic search review',
    '',
    '> Offline, read-only report. Export may be truncated to top rows; query and page statistics are different aggregations. Do not sum them or call this a complete traffic report.',
    '> Sorting is a heuristic, not a forecast of clicks, ranking gains or income.',
    ''
  ];
  for (const [key, result] of parsed) chunks.push(asMarkdown(key === 'query' ? 'Search queries' : 'Landing pages', result), '');
  process.stdout.write(chunks.join('\n'));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(process.argv.slice(2)); }
  catch (err) { console.error('[GSC ERROR]', err.message); process.exitCode = 1; }
}
export { csvRows, parseGscCsv, prioritize, main };
