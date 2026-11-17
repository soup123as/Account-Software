// Render selected frames of a composition into a labelled contact sheet.
// usage: node scripts/frames.mjs <compId> <f1,f2,...> <name> [propsJSON] [scale]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [comp, list, name, propsJson = "{}", scaleArg = "0.5"] = process.argv.slice(2);
const frames = list.split(",").map(Number);
const base = process.env.CHK_DIR ?? "/tmp/claude-0/-home-user-Account-Software/a0fca59d-0295-5cba-9791-1bcb096a979d/scratchpad/chk";
const out = path.join(base, `${name}-${Date.now()}`);
fs.mkdirSync(out, { recursive: true });
const CHROME = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const browserExecutable = fs.existsSync(CHROME) ? CHROME : null;

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browser = await openBrowser("chrome", { browserExecutable, chromiumOptions: { gl: "angle" } });
const inputProps = JSON.parse(propsJson);
const composition = await selectComposition({ serveUrl, id: comp, inputProps, puppeteerInstance: browser, browserExecutable });
let i = 0;
for (const frame of frames) {
  const file = path.join(out, `${String(i++).padStart(3, "0")}_f${frame}.jpg`);
  await renderStill({ serveUrl, composition, frame, output: file, imageFormat: "jpeg", jpegQuality: 88, scale: Number(scaleArg), inputProps, puppeteerInstance: browser, browserExecutable });
}
await browser.close({ silent: true });
execFileSync("python3", [path.resolve("scripts/sheet.py"), out], { stdio: "inherit" });
