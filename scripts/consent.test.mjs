import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../src/consent.js', import.meta.url), 'utf8');

function setup(saved = null) {
  const elements = new Map();
  const panelChildren = new Map();
  const scripts = [];
  const state = new Map(saved ? [['czy-consent-v1', JSON.stringify(saved)]] : []);
  const reload = vi.fn();
  const panel = {
    hidden: false,
    setAttribute() {},
    addEventListener(name, callback) { this[name] = callback; },
    querySelector(selector) {
      if (!panelChildren.has(selector)) panelChildren.set(selector, { textContent: '', checked: false });
      return panelChildren.get(selector);
    }
  };
  const settings = { addEventListener(name, callback) { this[name] = callback; } };
  const document = {
    currentScript: { dataset: { ga4Id: 'G-TEST123', facebookPixelId: '123', clarityId: 'abc', adsenseId: 'ca-pub-111' } },
    documentElement: { getAttribute: () => 'en' },
    readyState: 'complete',
    createElement(name) {
      if (name === 'section') return panel;
      const s = { attributes: {}, setAttribute(k, v) { this.attributes[k] = v; }, addEventListener() {} };
      return s;
    },
    body: { appendChild(el) { elements.set('panel', el); } },
    head: { appendChild(el) { scripts.push(el); } },
    getElementById(id) { return id === 'czy-consent-panel' ? elements.get('panel') : id === 'czy-consent-settings' ? settings : null; },
    querySelectorAll: () => []
  };
  const window = { location: { reload }, dataLayer: [] };
  const localStorage = { getItem: key => state.get(key) ?? null, setItem: (key, value) => state.set(key, value) };
  runInNewContext(source, { document, window, localStorage });
  function choose(choice) {
    panel.click({ target: { closest: () => ({ dataset: { choice } }) } });
  }
  return { scripts, window, state, panel, settings, choose, reload };
}
describe('optional third-party consent', () => {
  it('loads no analytics or advertising tags before first consent', () => {
    const s = setup();
    expect(s.scripts).toHaveLength(0);
    expect(s.panel.hidden).toBe(false);
    expect(s.window.gtag).toBeUndefined();
  });
  it('rejecting optional categories keeps requests blocked and stores the choice', () => {
    const s = setup();
    s.choose('reject');
    expect(s.scripts).toHaveLength(0);
    expect(JSON.parse(s.state.get('czy-consent-v1'))).toEqual({ version: 1, analytics: false, marketing: false });
  });
  it('analytics only loads GA4 and Clarity without advertising tags', () => {
    const s = setup();
    s.choose('analytics');
    expect(s.scripts.map(x => x.src)).toEqual([
      'https://www.googletagmanager.com/gtag/js?id=G-TEST123',
      'https://www.clarity.ms/tag/abc'
    ]);
    expect(s.window.dataLayer).toHaveLength(2);
    expect(Array.from(s.window.dataLayer[1])[2]).toEqual({
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  });
  it('marketing consent without analytics loads Meta and AdSense only', () => {
    const s = setup();
    s.panel.querySelector('#czy-marketing').checked = true;
    s.choose('save');
    expect(s.scripts.map(x => x.src)).toEqual([
      'https://connect.facebook.net/en_US/fbevents.js',
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-111'
    ]);
  });
  it('withdrawal after prior consent reloads to stop already-loaded tags', () => {
    const s = setup({ version: 1, analytics: true, marketing: true });
    expect(s.scripts).toHaveLength(4);
    s.choose('reject');
    expect(s.reload).toHaveBeenCalledOnce();
    expect(JSON.parse(s.state.get('czy-consent-v1')).marketing).toBe(false);
  });
});
