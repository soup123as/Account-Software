// Frame-by-frame export (Bang Motion export-frames, Playwright edition): set the timeline time,
// let the browser draw, capture. No dropped frames however long a frame takes to render.
// usage: node tools/export.mjs <framesDir> [fps=30]   then mux with ffmpeg (see README).
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright');
const out = process.argv[2];
const FPS = Number(process.argv[3] || 30);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await page.goto(pathToFileURL(path.resolve('index.html')).href + '?clean=1');
await page.waitForFunction('window.OPENER && window.OPENER.ready', null, { timeout: 60000 });
const DURATION = await page.evaluate(() => window.OPENER.DURATION);
const total = Math.round(DURATION * FPS);
console.log(`${total} frames @ ${FPS} fps (${DURATION}s)`);
for (let i = 0; i < total; i++) {
  await page.evaluate(async (t) => {
    window.OPENER.seek(t);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    window.OPENER.seek(t);
  }, i / FPS);
  await page.screenshot({ path: `${out}/f${String(i).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 96 });
  if (i % (FPS * 5) === 0) console.log(`${i}/${total}`);
}
await browser.close();
console.log('FRAMES_DONE');
