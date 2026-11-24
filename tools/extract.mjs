// Usage: node extract.mjs <outDir> <domain> [<domain>...]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const [outDir, ...domains] = process.argv.slice(2);
const EXE = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const INNER = {
  'privacymasters.it': ['/contatti', '/servizi', '/blog'],
  'bevolve.it': ['/contact', '/services', '/blog'],
  'tuttoaltopiano.it': ['/sentieri/monte-fior', '/chiedi-a-nando', '/meteo'],
  'oblivio.legal': ['/brand', '/valutazione', '/pacchetti'],
  'medicleo.com': ['/assistenza-domiciliare/'],
};

// Runs in page: harvest design tokens from computed styles + stylesheets
function harvest() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const cache = {};
  const hex = (c) => {
    if (!c) return c; if (cache[c]) return cache[c];
    cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#010203'; cx.fillStyle = c;
    if (cx.fillStyle === '#010203' && !/^#010203/i.test(c)) return (cache[c] = c);
    cx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = cx.getImageData(0, 0, 1, 1).data;
    const h = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase() + (a < 255 ? a.toString(16).padStart(2, '0').toUpperCase() : '');
    return (cache[c] = h);
  };
  const fnRe = /(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\([^()]*\)/g;
  const hexAll = (s) => s.replace(fnRe, m => hex(m));
  const transparent = (h) => /^#[0-9A-F]{6}00$/.test(h);
  const cleanShadow = (s) => {
    if (!s || s === 'none') return null;
    const parts = hexAll(s).split(/,(?![^(]*\))/).map(x => x.trim()).filter(p => !/#[0-9A-F]{6}00\b/.test(p) && !/^#[0-9A-F]{6}(00)? 0px 0px 0px 0px$/.test(p));
    return parts.length ? parts.join(', ') : null;
  };
  const rad = (r) => r.replace(/3\.35544e\+07px/g, '9999px');
  const isVisible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0;
  };
  const bump = (map, k, w = 1) => { if (!k) return; map[k] = (map[k] || 0) + w; };
  const colors = { text: {}, bg: {}, border: {}, gradients: {} };
  const fonts = {}; const sizes = {}; const weights = {}; const radii = {}; const shadows = {}; const lineHeights = {}; const letterSp = {};
  const textStyles = {};
  const els = [...document.querySelectorAll('body *')].filter(isVisible);
  for (const el of els) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const area = Math.min(r.width * r.height, 400000);
    const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (hasText) {
      const len = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').length;
      const col = hex(cs.color);
      bump(colors.text, col, len);
      const ff = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
      bump(fonts, ff, len); bump(sizes, cs.fontSize, len); bump(weights, cs.fontWeight, len); bump(lineHeights, cs.lineHeight, len);
      if (cs.letterSpacing !== 'normal' && cs.letterSpacing !== '0px') bump(letterSp, cs.letterSpacing, len);
      const key = `${el.tagName.toLowerCase()}|${ff}|${cs.fontSize}|${cs.fontWeight}|${cs.lineHeight}|${cs.textTransform}|${cs.letterSpacing}|${col}`;
      if (!textStyles[key]) textStyles[key] = { tag: el.tagName.toLowerCase(), font: ff, size: cs.fontSize, weight: cs.fontWeight, lh: cs.lineHeight, transform: cs.textTransform, ls: cs.letterSpacing, color: col, count: 0, chars: 0, sample: '' };
      textStyles[key].count++; textStyles[key].chars += len;
      if (!textStyles[key].sample) textStyles[key].sample = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 60);
    }
    const bg = hex(cs.backgroundColor);
    if (bg && !transparent(bg)) bump(colors.bg, bg, area);
    if (cs.backgroundImage && cs.backgroundImage.includes('gradient')) bump(colors.gradients, hexAll(cs.backgroundImage).slice(0, 400), area);
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      if (parseFloat(cs[`border${side}Width`]) > 0 && cs[`border${side}Style`] !== 'none') { const bc = hex(cs[`border${side}Color`]); if (!transparent(bc)) bump(colors.border, bc, 1); }
    }
    if (cs.borderRadius !== '0px') bump(radii, rad(cs.borderRadius), 1);
    const sh = cleanShadow(cs.boxShadow); if (sh) bump(shadows, sh, 1);
  }
  // Buttons / CTAs: detect by style, not class
  const buttons = []; const seenBtn = new Set();
  for (const el of document.querySelectorAll('a, button, input[type=submit]')) {
    if (!isVisible(el)) continue;
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    if (r.width < 40 || r.height < 28 || r.height > 90 || r.width > 520) continue;
    const bg = hex(cs.backgroundColor); const bw = parseFloat(cs.borderTopWidth); const bc = hex(cs.borderTopColor);
    const hasBg = !transparent(bg) || cs.backgroundImage.includes('gradient');
    const hasBorder = bw > 0 && cs.borderTopStyle !== 'none' && !transparent(bc);
    if (!hasBg && !hasBorder) continue;
    if (parseFloat(cs.paddingLeft) < 8) continue;
    const text = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40);
    if (!text) continue;
    const sig = [bg, cs.backgroundImage.slice(0, 60), hex(cs.color), rad(cs.borderRadius), hasBorder ? bc : '', cs.fontSize, cs.fontWeight, cs.textTransform, Math.round(r.height)].join('|');
    if (seenBtn.has(sig)) continue; seenBtn.add(sig);
    // context background (nearest opaque ancestor) to render on the right surface
    let p = el.parentElement, ctxBg = '#FFFFFF';
    while (p) { const pb = hex(getComputedStyle(p).backgroundColor); if (!transparent(pb) && pb.length === 7) { ctxBg = pb; break; } if (getComputedStyle(p).backgroundImage.includes('url(')) { ctxBg = '#333333'; break; } p = p.parentElement; }
    const hasIcon = !!el.querySelector('svg');
    buttons.push({ text, tag: el.tagName.toLowerCase(), bg, bgImage: cs.backgroundImage !== 'none' ? hexAll(cs.backgroundImage).slice(0, 200) : null, color: hex(cs.color), radius: rad(cs.borderRadius), border: hasBorder ? `${cs.borderTopWidth} ${cs.borderTopStyle} ${bc}` : 'none', padding: cs.padding, font: cs.fontFamily.split(',')[0].replace(/["']/g, ''), size: cs.fontSize, weight: cs.fontWeight, transform: cs.textTransform, ls: cs.letterSpacing, h: Math.round(r.height), w: Math.round(r.width), shadow: cleanShadow(cs.boxShadow), ctxBg, hasIcon });
    if (buttons.length >= 24) break;
  }
  // Inputs
  const inputs = [];
  for (const el of document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=checkbox]):not([type=radio]), textarea, select')) {
    if (!isVisible(el)) continue; const cs = getComputedStyle(el);
    const lab = el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    const lcs = lab ? getComputedStyle(lab) : null;
    inputs.push({ type: el.type || el.tagName.toLowerCase(), placeholder: el.placeholder || '', label: lab ? lab.textContent.trim().slice(0, 40) : '', labelStyle: lcs ? { size: lcs.fontSize, weight: lcs.fontWeight, color: hex(lcs.color) } : null, bg: hex(cs.backgroundColor), color: hex(cs.color), border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${hex(cs.borderTopColor)}`, radius: rad(cs.borderRadius), padding: cs.padding, size: cs.fontSize, h: Math.round(el.getBoundingClientRect().height), shadow: cleanShadow(cs.boxShadow) });
    if (inputs.length >= 8) break;
  }
  // Badges / pills (small rounded labels)
  const badges = []; const seenBadge = new Set();
  for (const el of document.querySelectorAll('span, div, p')) {
    if (!isVisible(el)) continue; const r = el.getBoundingClientRect();
    if (r.height < 16 || r.height > 40 || r.width > 380) continue;
    const cs = getComputedStyle(el); const bg = hex(cs.backgroundColor); const bc = hex(cs.borderTopColor);
    if (transparent(bg) && !(parseFloat(cs.borderTopWidth) > 0 && !transparent(bc))) continue;
    if (parseFloat(cs.borderTopLeftRadius) < 4) continue;
    const text = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40); if (!text || el.querySelector('a,button')) continue;
    const sig = [bg, bc, hex(cs.color), cs.fontSize, cs.textTransform].join('|'); if (seenBadge.has(sig)) continue; seenBadge.add(sig);
    badges.push({ text, bg, color: hex(cs.color), border: parseFloat(cs.borderTopWidth) > 0 ? `${cs.borderTopWidth} solid ${bc}` : 'none', radius: rad(cs.borderRadius), padding: cs.padding, size: cs.fontSize, weight: cs.fontWeight, transform: cs.textTransform, ls: cs.letterSpacing, font: cs.fontFamily.split(',')[0].replace(/["']/g, '') });
    if (badges.length >= 10) break;
  }
  // Cards: medium/large boxes with radius + (border or shadow or bg)
  const cards = []; const seenCard = new Set();
  for (const el of document.querySelectorAll('div, article, li, a')) {
    if (!isVisible(el)) continue; const r = el.getBoundingClientRect();
    if (r.width < 200 || r.height < 120 || r.width > 900) continue;
    const cs = getComputedStyle(el); if (parseFloat(cs.borderTopLeftRadius) < 6) continue;
    const bg = hex(cs.backgroundColor); const bw = parseFloat(cs.borderTopWidth); const sh = cleanShadow(cs.boxShadow);
    if (transparent(bg) && !bw && !sh) continue;
    const sig = [bg, bw ? hex(cs.borderTopColor) : '', rad(cs.borderRadius), sh || '', cs.padding].join('|'); if (seenCard.has(sig)) continue; seenCard.add(sig);
    cards.push({ bg, border: bw ? `${cs.borderTopWidth} solid ${hex(cs.borderTopColor)}` : 'none', radius: rad(cs.borderRadius), shadow: sh, padding: cs.padding, w: Math.round(r.width), h: Math.round(r.height), sample: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 80) });
    if (cards.length >= 8) break;
  }
  // CSS custom properties (custom only, drop Tailwind defaults)
  const twDefault = /^--(color-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|black|white)(-\d+)?$|container-|text-|tracking-|leading-|font-weight-|tw-|spacing$|breakpoint-|default-|ease-|animate-|blur-|radius-(xs|sm|md|lg|xl|2xl|3xl|4xl)$|shadow-|inset-|drop-shadow-|perspective-|aspect-|font-mono$)/;
  const cssVars = {}; const allVarCount = { n: 0 };
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch { continue; }
    const walk = (rs) => { for (const r of rs) {
      if (r.cssRules) walk(r.cssRules);
      if (r.selectorText && /^(:root|html|body|\.dark|:host)/.test(r.selectorText.trim())) {
        for (const p of r.style) if (p.startsWith('--')) { allVarCount.n++; if (!twDefault.test(p)) cssVars[`${r.selectorText.trim().slice(0, 20)} ${p}`] = hexAll(r.style.getPropertyValue(p).trim()); }
      }
    } };
    walk(rules);
  }
  const fontFaces = [];
  try { document.fonts.forEach(f => { if (f.status === 'loaded') fontFaces.push(`${f.family.replace(/["']/g, '')} ${f.weight} ${f.style}`); }); } catch {}
  const logos = [];
  for (const el of document.querySelectorAll('header img, header svg, [class*="logo"] img, img[alt*="logo" i], img[src*="logo" i]')) {
    if (!isVisible(el)) continue; const r = el.getBoundingClientRect(); if (r.width < 18) continue;
    logos.push({ tag: el.tagName.toLowerCase(), src: el.currentSrc || el.src || null, alt: el.alt || '', w: Math.round(r.width), h: Math.round(r.height), svg: el.tagName.toLowerCase() === 'svg' ? el.outerHTML.slice(0, 20000) : null });
    if (logos.length >= 4) break;
  }
  const containers = {};
  for (const el of document.querySelectorAll('div, main, section')) { if (!isVisible(el)) continue; const cs = getComputedStyle(el); if (cs.maxWidth !== 'none' && el.getBoundingClientRect().width > 500) bump(containers, cs.maxWidth); }
  const sectionPad = {};
  for (const el of document.querySelectorAll('section')) { if (!isVisible(el)) continue; const cs = getComputedStyle(el); bump(sectionPad, `${cs.paddingTop} / ${cs.paddingBottom}`); }
  const gaps = {};
  for (const el of els) { const cs = getComputedStyle(el); if ((cs.display.includes('flex') || cs.display.includes('grid')) && cs.gap !== 'normal' && cs.gap !== '0px') bump(gaps, cs.gap); }
  const top = (m, n = 20) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n);
  const meta = {
    title: document.title, description: document.querySelector('meta[name=description]')?.content || '',
    themeColor: document.querySelector('meta[name=theme-color]')?.content || '',
    favicon: [...document.querySelectorAll('link[rel*=icon]')].map(l => l.href), ogImage: document.querySelector('meta[property="og:image"]')?.content || '',
    generator: document.querySelector('meta[name=generator]')?.content || '', lang: document.documentElement.lang,
    fontLinks: [...document.querySelectorAll('link[href*="fonts.googleapis.com/css"], link[href*="typekit"], link[href*="fonts.bunny"]')].map(l => l.href),
  };
  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(t => { const e = [...document.querySelectorAll(t)].find(isVisible); if (!e) return null; const cs = getComputedStyle(e); return { tag: t, text: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 80), font: cs.fontFamily, size: cs.fontSize, weight: cs.fontWeight, lh: cs.lineHeight, ls: cs.letterSpacing, color: hex(cs.color), transform: cs.textTransform }; }).filter(Boolean);
  // accent spans inside headings (coloured words / gradient text)
  const accents = [];
  for (const h of document.querySelectorAll('h1 span, h1 em, h2 span, h1 *[class*="gradient"]')) { if (!isVisible(h)) continue; const cs = getComputedStyle(h); accents.push({ text: h.textContent.trim().slice(0, 40), color: hex(cs.color), bgImage: cs.backgroundImage !== 'none' ? hexAll(cs.backgroundImage).slice(0, 200) : null, clip: cs.webkitBackgroundClip || cs.backgroundClip, style: cs.fontStyle }); if (accents.length > 4) break; }
  const bodyCs = getComputedStyle(document.body);
  const pEl = [...document.querySelectorAll('p')].find(e => isVisible(e) && e.textContent.trim().length > 60);
  const pCs = pEl ? getComputedStyle(pEl) : bodyCs;
  const nav = (() => { const n = [...document.querySelectorAll('header nav a, nav a')].find(isVisible); if (!n) return null; const cs = getComputedStyle(n); return { font: cs.fontFamily.split(',')[0], size: cs.fontSize, weight: cs.fontWeight, color: hex(cs.color), transform: cs.textTransform, ls: cs.letterSpacing }; })();
  const header = (() => { const h = document.querySelector('header'); if (!h) return null; const cs = getComputedStyle(h); return { bg: hex(cs.backgroundColor), h: Math.round(h.getBoundingClientRect().height), position: cs.position, backdrop: cs.backdropFilter, borderBottom: `${cs.borderBottomWidth} ${hex(cs.borderBottomColor)}` }; })();
  const footer = (() => { const f = document.querySelector('footer'); if (!f) return null; const cs = getComputedStyle(f); return { bg: hex(cs.backgroundColor), color: hex(cs.color), h: Math.round(f.getBoundingClientRect().height) }; })();
  const icons = (() => { const svgs = [...document.querySelectorAll('svg')].filter(isVisible); const cls = {}; svgs.forEach(s => (s.getAttribute('class') || '').split(/\s+/).filter(c => c.startsWith('lucide')).forEach(c => bump(cls, c))); return { total: svgs.length, lucide: svgs.filter(s => (s.getAttribute('class') || '').includes('lucide')).length, names: top(cls, 25).map(([k]) => k), strokeWidth: top(svgs.reduce((m, s) => (bump(m, s.getAttribute('stroke-width')), m), {}), 3) }; })();
  const motion = (() => { const m = {}; for (const el of els.slice(0, 1500)) { const cs = getComputedStyle(el); if (cs.transitionDuration !== '0s') bump(m, `${cs.transitionDuration} ${cs.transitionTimingFunction}`); if (cs.animationName !== 'none') bump(m, `anim:${cs.animationName} ${cs.animationDuration}`); } return top(m, 8); })();
  return {
    meta, headings, accents, nav, header, footer, icons, motion,
    body: { font: bodyCs.fontFamily, size: bodyCs.fontSize, color: hex(bodyCs.color), bg: hex(bodyCs.backgroundColor), lh: bodyCs.lineHeight },
    paragraph: pEl ? { font: pCs.fontFamily, size: pCs.fontSize, lh: pCs.lineHeight, color: hex(pCs.color), weight: pCs.fontWeight, sample: pEl.textContent.trim().slice(0, 160) } : null,
    colors: { text: top(colors.text, 15), bg: top(colors.bg, 15), border: top(colors.border, 10), gradients: top(colors.gradients, 6) },
    fonts: top(fonts, 8), fontFaces: [...new Set(fontFaces)].slice(0, 30), sizes: top(sizes, 20), weights: top(weights, 8), lineHeights: top(lineHeights, 10), letterSpacing: top(letterSp, 8),
    textStyles: Object.values(textStyles).sort((a, b) => b.chars - a.chars).slice(0, 30),
    radii: top(radii, 10), shadows: top(shadows, 8), containers: top(containers, 6), sectionPadding: top(sectionPad, 8), gaps: top(gaps, 10),
    buttons, inputs, badges, cards, logos, cssVars, cssVarTotal: allVarCount.n,
    docHeight: document.documentElement.scrollHeight,
  };
}

async function prep(page, result, key) {
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  const rej = page.getByRole('button', { name: /^(rifiuta|rifiuta tutti|rifiuta non necessari)$/i }).first();
  const c = await rej.click({ timeout: 2500 }).then(() => 'rifiutato').catch(() => 'nessun banner');
  if (result) result[key] = c;
  await page.waitForTimeout(500);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < Math.min(h, 20000); y += 600) { await page.evaluate(yy => window.scrollTo(0, yy), y); await page.waitForTimeout(100); }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
}

const browser = await chromium.launch({ executablePath: EXE, headless: true });
for (const domain of domains) {
  const dir = path.join(outDir, domain); fs.mkdirSync(dir, { recursive: true });
  const result = { domain, fetchedAt: new Date().toISOString(), pages: [] };
  // desktop context reused for home + inner pages (cookie rejection persists)
  for (const vp of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844, isMobile: true }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2, isMobile: !!vp.isMobile, hasTouch: !!vp.isMobile, locale: 'it-IT', userAgent: vp.isMobile ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' : undefined });
    const page = await ctx.newPage();
    try {
      const resp = await page.goto(`https://${domain}/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
      result[`${vp.name}Status`] = resp?.status(); result.finalUrl = page.url();
      await prep(page, result, `${vp.name}Cookie`);
      await page.screenshot({ path: path.join(dir, `${vp.name}-fold.png`) });
      await page.screenshot({ path: path.join(dir, `${vp.name}-full.png`), fullPage: true }).catch(e => { result[`${vp.name}FullErr`] = String(e).slice(0, 200); });
      if (vp.name === 'desktop') {
        result.tokens = await page.evaluate(harvest);
        // brand lockup: screenshot the header link containing the logo
        const lockup = page.locator('header a:has(img), header a:has(svg)').first();
        await lockup.screenshot({ path: path.join(dir, 'logo-lockup.png'), omitBackground: true }).then(() => { result.lockup = true; }).catch(() => { result.lockup = false; });
        const hdr = page.locator('header').first();
        await hdr.screenshot({ path: path.join(dir, 'header.png') }).catch(() => {});
        const ftr = page.locator('footer').first();
        await ftr.screenshot({ path: path.join(dir, 'footer.png') }).catch(() => {});
        for (const [i, p] of (INNER[domain] || []).entries()) {
          try {
            const r = await page.goto(`https://${domain}${p}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
            await prep(page);
            const slug = `inner-${i + 1}`;
            await page.screenshot({ path: path.join(dir, `${slug}-fold.png`) });
            await page.screenshot({ path: path.join(dir, `${slug}-full.png`), fullPage: true }).catch(() => {});
            result.pages.push({ path: p, status: r?.status(), slug, title: await page.title(), tokens: await page.evaluate(harvest) });
          } catch (e) { result.pages.push({ path: p, error: String(e).slice(0, 200) }); }
        }
      } else {
        result.mobileTokens = await page.evaluate(() => ({ headings: ['h1', 'h2', 'h3'].map(t => { const e = document.querySelector(t); if (!e) return null; const cs = getComputedStyle(e); return { tag: t, size: cs.fontSize, lh: cs.lineHeight }; }).filter(Boolean), bodySize: getComputedStyle(document.body).fontSize, headerH: Math.round(document.querySelector('header')?.getBoundingClientRect().height || 0) }));
      }
    } catch (e) { result[`${vp.name}Error`] = String(e).slice(0, 300); }
    await ctx.close();
  }
  fs.writeFileSync(path.join(dir, 'tokens.json'), JSON.stringify(result, null, 2));
  console.log(`[done] ${domain} status=${result.desktopStatus}/${result.mobileStatus} cookie=${result.desktopCookie}/${result.mobileCookie} lockup=${result.lockup} inner=${result.pages.map(p => p.status || 'ERR').join(',')} err=${result.desktopError || result.mobileError || '-'}`);
}
await browser.close();
