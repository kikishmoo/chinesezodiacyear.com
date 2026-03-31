#!/usr/bin/env node
import fs from 'node:fs';

const specPath = 'docs/openapi/worker-v1.openapi.json';

function fail(message) {
  console.error(`[error] ${message}`);
  process.exit(1);
}

if (!fs.existsSync(specPath)) {
  fail(`missing spec file: ${specPath}`);
}

let spec;
try {
  spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
} catch (error) {
  fail(`invalid JSON in ${specPath}: ${error.message}`);
}

if (!spec.openapi || !String(spec.openapi).startsWith('3.')) {
  fail('openapi version must be 3.x');
}

const requiredPaths = ['/v1/health', '/v1/bazi/calculate', '/v1/reports'];
for (const path of requiredPaths) {
  if (!spec.paths?.[path]) fail(`missing required path: ${path}`);
}

if (!spec.paths['/v1/health'].get) fail('missing GET /v1/health operation');
if (!spec.paths['/v1/bazi/calculate'].post) fail('missing POST /v1/bazi/calculate operation');
if (!spec.paths['/v1/reports'].post) fail('missing POST /v1/reports operation');

const schemas = spec.components?.schemas ?? {};
for (const name of [
  'HealthResponse',
  'ErrorEnvelope',
  'BaziCalculateRequest',
  'BaziCalculateResponse',
  'ReportRequest',
  'ReportJobEnvelope',
  'ReportStatusEnvelope'
]) {
  if (!schemas[name]) fail(`missing schema: ${name}`);
}

console.log('[ok] OpenAPI contract checks passed');
