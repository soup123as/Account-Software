// Verification: freeze the timeline at key seconds and photograph them (Bang Motion snap, Playwright edition).
// usage: node tools/snap.mjs <outDir> <sec> [<sec> ...]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright');
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
const [out, ...times] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const url = pathToFileURL(path.resolve('index.html')).href + '?clean=1';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: Number(process.env.SCALE || 0.4) });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
page.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
await page.goto(url);
await page.waitForFunction('window.OPENER && window.OPENER.ready', null, { timeout: 60000 });
for (const ts of times) {
  const t = Number(ts);
  await page.evaluate(async (time) => { window.OPENER.seek(time); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); window.OPENER.seek(time); }, t);
  await page.screenshot({ path: `${out}/t${t.toFixed(2).replace('.', '_')}.png` });
}
await browser.close(); console.log('done', times.length);
