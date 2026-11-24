import { chromium } from 'playwright';
const EXE = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const b = await chromium.launch({ executablePath: EXE }); const p = await b.newPage();
for (const u of process.argv.slice(2)) {
  await p.goto(u);
  const r = await p.evaluate(async () => { const img = document.querySelector('img'); await img.decode(); const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; const x = c.getContext('2d'); x.drawImage(img, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data; const m = {};
    for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 200) continue; const [r, g, bb] = [d[i], d[i + 1], d[i + 2]]; if (Math.max(r, g, bb) - Math.min(r, g, bb) < 40) continue; const k = '#' + [r, g, bb].map(v => (v & 0xF0).toString(16).padStart(2, '0')).join('').toUpperCase(); m[k] = (m[k] || 0) + 1; }
    return { size: `${c.width}x${c.height}`, top: Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6) }; });
  console.log(u.split('/').pop(), JSON.stringify(r));
}
await b.close();
