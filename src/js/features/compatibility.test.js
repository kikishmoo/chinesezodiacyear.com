import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../utils/base-path.js', () => ({ basePath: '' }));

vi.mock('./report-checkout.js', () => ({
  showCompatibilityOffer: vi.fn()
}));

import { initCompatibility } from './compatibility.js';

function setupForms() {
  const nodes = new Map();
  for (const [form, result, a, b] of [
    ['compat-form', 'compat-result', 'year-a', 'year-b'],
    ['compat-form-tc', 'compat-result-tc', 'year-a-tc', 'year-b-tc'],
    ['compat-form-sc', 'compat-result-sc', 'year-a-sc', 'year-b-sc']
  ]) {
    nodes.set(form, { handlers: {}, addEventListener(name, callback) { this.handlers[name] = callback; } });
    nodes.set(result, {
      innerHTML: '',
      classList: { add: vi.fn() },
      scrollIntoView: vi.fn(),
      parentNode: { insertBefore: vi.fn() }
    });
    nodes.set(a, { value: '1988' });
    nodes.set(b, { value: '1992' });
  }
  const tracker = vi.fn();
  vi.stubGlobal('window', { gtag: tracker });
  vi.stubGlobal('document', {
    getElementById: (id) => nodes.get(id) || null,
    createElement: (tag) => ({ tagName: tag.toUpperCase() })
  });
  initCompatibility();
  return { nodes, tracker };
}

describe('compatibility form language routing', () => {
  afterEach(() => vi.unstubAllGlobals());

  for (const [locale, resultId, heading] of [
    ['tc', 'compat-result-tc', '三合'],
    ['sc', 'compat-result-sc', '三合'],
    ['en', 'compat-result', 'Three Harmony']
  ]) {
    it(`renders the ${locale} submission into its own visible result panel`, () => {
      const { nodes, tracker } = setupForms();
      const form = nodes.get(locale === 'en' ? 'compat-form' : 'compat-form-' + locale);
      const event = { preventDefault: vi.fn() };
      form.handlers.submit(event);
      expect(event.preventDefault).toHaveBeenCalledOnce();
      expect(nodes.get(resultId).innerHTML).toContain(heading);
      expect(nodes.get(resultId).classList.add).toHaveBeenCalledWith('show');
      expect(nodes.get(resultId).scrollIntoView).toHaveBeenCalledOnce();
      expect(tracker).toHaveBeenCalledTimes(1);
      if (locale !== 'en') {
        expect(nodes.get('compat-result').innerHTML).toBe('');
        expect(nodes.get('compat-result').scrollIntoView).not.toHaveBeenCalled();
      }
    });
  }
});
