// node shoot.mjs <outDir> <url> [<url>...]  -> section screenshots of a board
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
const [outDir, ...urls] = process.argv.slice(2);
const EXE = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const b = await chromium.launch({ executablePath: EXE });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
fs.mkdirSync(outDir, { recursive: true });
for (const u of urls) {
  await p.goto(u, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  await p.addStyleTag({ content: 'nav.toc{position:static!important}' });
  const name = u.split('/').slice(-2).join('_').replace(/\W+/g, '_');
  const ids = await p.$$eval('section[id]', s => s.map(x => x.id));
  for (const id of ids) await p.locator(`#${id}`).screenshot({ path: path.join(outDir, `${name}__${id}.png`) });
  const errs = await p.evaluate(() => [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src));
  console.log(name, 'sections', ids.join(','), 'broken images:', errs.length ? errs : 'none');
}
await b.close();
