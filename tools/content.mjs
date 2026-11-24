// node content.mjs <brandsDir> <domain>...  -> brands/<d>/content.md + assets/ (logo, favicon, page images)
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const [outDir, ...domains] = process.argv.slice(2);
const EXE = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const b = await chromium.launch({ executablePath: EXE });
for (const d of domains) {
  const dir = path.join(outDir, d); const adir = path.join(dir, 'assets'); fs.mkdirSync(adir, { recursive: true });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'it-IT' });
  const p = await ctx.newPage();
  await p.goto(`https://${d}/`, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await p.getByRole('button', { name: /^(rifiuta|rifiuta tutti|rifiuta non necessari)$/i }).first().click({ timeout: 2500 }).catch(() => {});
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 700) { await p.evaluate(yy => window.scrollTo(0, yy), y); await p.waitForTimeout(80); }
  const data = await p.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const lines = []; const seen = new Set();
    const roots = [...document.querySelectorAll('header, main > *, body > div section, footer')];
    const blocks = roots.length ? roots : [document.body];
    for (const blk of blocks) {
      if (blk.closest('[role=dialog]')) continue;
      lines.push(`\n---\n<!-- ${blk.tagName.toLowerCase()}${blk.id ? '#' + blk.id : ''} -->`);
      for (const e of blk.querySelectorAll('h1,h2,h3,h4,p,li,a,button,blockquote,dt,dd,figcaption,span,label')) {
        if (!vis(e)) continue;
        const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(' ').trim();
        const tag = e.tagName.toLowerCase();
        let t = (['h1','h2','h3','h4','p','li','blockquote','dt','dd','figcaption'].includes(tag) ? e.innerText : own).replace(/\s+/g, ' ').trim();
        if (!t || t.length < 2 || seen.has(tag + t)) continue;
        if (tag === 'span' && (t.length < 3 || e.closest('h1,h2,h3,h4,p,li,a,button'))) continue;
        if ((tag === 'li' || tag === 'p') && e.querySelector('h1,h2,h3,h4')) continue;
        seen.add(tag + t);
        const pre = { h1: '# ', h2: '## ', h3: '### ', h4: '#### ', li: '- ', blockquote: '> ' }[tag] ?? '';
        const suf = tag === 'a' ? `  [link → ${e.getAttribute('href')}]` : tag === 'button' ? '  [button]' : tag === 'span' ? '  [span]' : '';
        lines.push(pre + t + suf);
      }
    }
    const imgs = [...document.querySelectorAll('img')].filter(vis).map(i => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight }));
    const bgs = [...document.querySelectorAll('*')].map(e => getComputedStyle(e).backgroundImage).filter(x => x.includes('url(')).map(x => x.match(/url\("?([^")]+)"?\)/)?.[1]).filter(Boolean);
    const videos = [...document.querySelectorAll('video source, video')].map(v => v.src || v.currentSrc).filter(Boolean);
    const icons = [...document.querySelectorAll('link[rel*=icon]')].map(l => l.href);
    return { title: document.title, desc: document.querySelector('meta[name=description]')?.content, text: lines.join('\n'), imgs, bgs: [...new Set(bgs)], videos, icons };
  });
  // download images (own site assets only)
  const assets = [];
  const urls = [...new Set([...data.imgs.map(i => i.src), ...data.bgs, ...data.icons])].filter(u => u && u.includes(d) && !u.startsWith('data:'));
  for (const u of urls.slice(0, 25)) {
    try {
      const r = await ctx.request.get(u); if (!r.ok()) continue;
      const buf = await r.body(); const name = decodeURIComponent(u.split('/').pop().split('?')[0]) || 'asset';
      fs.writeFileSync(path.join(adir, name), buf);
      const meta = data.imgs.find(i => i.src === u);
      assets.push(`- assets/${name} — ${Math.round(buf.length / 1024)} KB${meta ? ` · ${meta.w}×${meta.h} · alt="${meta.alt}"` : data.bgs.includes(u) ? ' · usata come background CSS' : ' · favicon/icon'}`);
    } catch {}
  }
  const md = `# ${d} — contenuti reali della homepage\n\nEstratti il ${new Date().toISOString().slice(0, 10)} da https://${d}/ (testo visibile, in ordine di pagina). Usare SOLO questi contenuti e numeri: niente dati inventati.\n\n**Title:** ${data.title}\n\n**Meta description:** ${data.desc}\n\n## Asset scaricati (file originali del sito)\n${assets.join('\n')}\n${data.videos.length ? `\nVideo: ${data.videos.join(', ')}\n` : ''}\n## Testo\n${data.text}\n`;
  fs.writeFileSync(path.join(dir, 'content.md'), md);
  console.log(d, 'chars', data.text.length, 'assets', assets.length);
  await ctx.close();
}
await b.close();
