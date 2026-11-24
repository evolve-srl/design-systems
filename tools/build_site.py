"""Genera tutte le pagine HTML del repository a partire dai dati.

Fonti (SSOT):
  data/brands.json                         descrizione e diagnosi di ogni brand
  brands/<d>/attuale/tokens.json           token estratti (tools/extract.mjs)
  brands/<d>/restyle-*/direction.json      metadati delle direzioni di restyle

Output:
  index.html                               home del repository
  brands/<d>/index.html                    pagina del brand (attuale + 3 direzioni)
  brands/<d>/attuale/index.html            tavola del design system attuale

Uso: python3 -I tools/build_site.py   (dalla root del repo)
"""
import html
import json
import os
import re
from glob import glob
from urllib.parse import quote_plus

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORDER = ['privacymasters.it', 'bevolve.it', 'tuttoaltopiano.it', 'oblivio.legal', 'medicleo.com']
BRANDS = json.load(open(os.path.join(ROOT, 'data', 'brands.json')))
esc = lambda s: html.escape(str(s)) if s is not None else ''

# ---------- colori ----------
def rgb(hx):
    hx = hx.lstrip('#')[:6]
    return tuple(int(hx[i:i + 2], 16) / 255 for i in (0, 2, 4))

def lum(hx):
    try:
        r, g, b = rgb(hx)
    except Exception:
        return 0.5
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)

def contrast(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)

def alpha(hx):
    return round(int(hx[7:9], 16) / 255, 2) if isinstance(hx, str) and len(hx) == 9 else 1.0

def on(hx):
    return '#FFFFFF' if lum(hx) < 0.36 else '#14171C'

def verdict(r):
    if r >= 4.5:
        return '<span class="pass">Leggibile (AA)</span>'
    if r >= 3:
        return '<span class="mid">Solo per testi grandi</span>'
    return '<span class="fail">Insufficiente</span>'

def merge(lists):
    out = {}
    for l in lists:
        for k, w in l:
            out[k] = out.get(k, 0) + w
    return sorted(out.items(), key=lambda x: -x[1])

def dedupe(items, key, n):
    seen, out = set(), []
    for it in items:
        k = key(it)
        if k not in seen:
            seen.add(k)
            out.append(it)
        if len(out) >= n:
            break
    return out

def ff(f):
    base = f.split(',')[0].strip().strip('"\'')
    return f"'{base}','{base.replace(' Variable', '')}',system-ui,sans-serif"

def gfonts(fams):
    system = ('system-ui', '-apple-system', 'blinkmacsystemfont', 'arial', 'helvetica', 'georgia', 'menlo', 'monaco', 'consolas',
              'sfmono-regular', 'courier new', 'monospace', 'serif', 'sans-serif', 'segoe ui', 'roboto')
    fams = [f.replace(' Variable', '') for f in fams if f and not f.lower().startswith('ui-') and f.lower() not in system]
    fams = list(dict.fromkeys(fams + ['Inter', 'JetBrains Mono']))
    parts = []
    for f in fams:
        # pesi espliciti: gli intervalli (300..800) valgono solo per i font variabili e
        # con un font statico (es. Poppins) Google Fonts rifiuta l'intera richiesta
        parts.append('family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700' if f == 'Fraunces' else f'family={quote_plus(f)}:wght@400;500;600;700;800')
    return f'<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?{"&".join(parts)}&display=swap">'

def img(dirpath, stem):
    """Restituisce il nome del file immagine ottimizzato disponibile (webp/jpg/png)."""
    for ext in ('webp', 'jpg', 'png'):
        if os.path.exists(os.path.join(dirpath, f'{stem}.{ext}')):
            return f'{stem}.{ext}'
    return None

ROLE_LABELS = [
    ('primary', 'Colore principale', 'CTA, link, elementi attivi'),
    ('foreground', 'Testo principale', 'titoli e testo'),
    ('ink', 'Inchiostro', 'testo scuro e sezioni scure'),
    ('muted-foreground', 'Testo secondario', 'paragrafi e didascalie'),
    ('background', 'Sfondo', 'fondo della pagina'),
    ('surface', 'Superficie', 'sezioni alternate'),
    ('muted', 'Superficie tenue', 'riquadri e sfondi neutri'),
    ('secondary', 'Secondario', 'pulsanti e fondi secondari'),
    ('accent', 'Accento', 'evidenziazioni'),
    ('border', 'Bordi', 'linee e contorni'),
]

def semantic(vars_, sel=':root'):
    out = []
    for key, label, use in ROLE_LABELS:
        v = vars_.get(f'{sel} --{key}')
        if v and re.match(r'^#[0-9A-F]{6,8}$', v):
            out.append((key, label, use, v))
    return out

def page(title, crumbs, toc, body, fams=()):
    cr = ' <span>/</span> '.join(f'<a href="{h}">{esc(t)}</a>' if h else f'<b>{esc(t)}</b>' for t, h in crumbs)
    tc = ''.join(f'<a href="#{i}">{esc(t)}</a>' for i, t in toc)
    return f'''<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title>{gfonts(list(fams))}
<link rel="stylesheet" href="{{CSS}}"><link rel="icon" href="{{CSS}}/../favicon.svg"></head><body>
<header class="topbar"><div class="wrap"><nav class="crumbs">{cr}</nav><nav class="toc">{tc}</nav></div></header>
{body}
<footer class="site"><div class="wrap">Design system Evolve · estrazione e restyle concept · i valori del sito attuale sono computati dal browser il 23/11/2026.</div></footer>
</body></html>'''

# ---------- tavola del design system attuale ----------
def board(d):
    base = os.path.join(ROOT, 'brands', d, 'attuale')
    data = json.load(open(os.path.join(base, 'tokens.json')))
    b = BRANDS[d]
    t = data['tokens']
    pages = [p for p in data.get('pages', []) if p.get('tokens')]
    allt = [t] + [p['tokens'] for p in pages]
    fams = [f for f, _ in merge([x['fonts'] for x in allt])]
    vars_ = t['cssVars']
    roles = semantic(vars_)
    dark = semantic(vars_, '.dark')
    bg = merge([x['colors']['bg'] for x in allt])[:14]
    tx = merge([x['colors']['text'] for x in allt])[:12]
    bd = merge([x['colors']['border'] for x in allt])[:8]
    gr = merge([x['colors']['gradients'] for x in allt])[:6]
    sizes = sorted({float(s[:-2]) for x in allt for s, _ in x['sizes']}, reverse=True)
    weights = sorted({w for x in allt for w, _ in x['weights']})
    radii = merge([x['radii'] for x in allt])[:8]
    shadows = merge([x['shadows'] for x in allt])[:6]
    buttons = dedupe([x for y in allt for x in y['buttons']], lambda b: (b['bg'], b['bgImage'], b['color'], b['radius'], b['border'], b['size'], b['h']), 12)
    inputs = dedupe([x for y in allt for x in y['inputs']], lambda i: (i['type'], i['bg'], i['border'], i['radius'], i['h']), 6)
    badges = dedupe([x for y in allt for x in y['badges']], lambda b: (b['bg'], b['color'], b['border'], b['size'], b['transform']), 8)
    # escludi blob decorativi (pillola senza padding) e riquadri trasparenti senza bordo né ombra
    real_cards = [x for y in allt for x in y['cards']
                  if not (x['radius'].startswith('9999') and x['padding'] in ('0px', '0px 0px'))
                  and not (alpha(x['bg']) == 0 and x['border'] == 'none' and not x.get('shadow'))]
    cards = dedupe(real_cards, lambda c: (c['bg'], c['border'], c['radius'], c['shadow']), 6)
    heads = t['headings']
    p = t.get('paragraph') or {}
    display = heads[0]['font'] if heads else p.get('font', 'Inter')
    textf = p.get('font', display)
    primary = next((v for k, _, _, v in roles if k == 'primary'), '#333333')

    def btn_html(bt, small=False):
        stage = bt['ctxBg']
        if lum(bt['color'][:7]) > 0.6 and lum(stage[:7]) > 0.6 and alpha(bt['bg']) < 0.5 and not bt.get('bgImage'):
            stage = '#1F2633'
        st = (f'display:inline-flex;align-items:center;gap:8px;background:{bt["bg"]};' + (f'background-image:{bt["bgImage"]};' if bt.get('bgImage') else '')
              + f'color:{bt["color"]};border-radius:{bt["radius"]};border:{bt["border"]};padding:{bt["padding"]};font-family:{ff(bt["font"])};font-size:{bt["size"]};font-weight:{bt["weight"]};text-transform:{bt["transform"]};letter-spacing:{bt["ls"]};'
              + (f'box-shadow:{bt["shadow"]};' if bt.get('shadow') else '') + f'height:{bt["h"]}px;white-space:nowrap;text-decoration:none')
        label = esc(bt['text']) + (' →' if bt.get('hasIcon') else '')
        if small:
            return f'<a style="{st}">{label}</a>'
        r = contrast(bt['color'][:7], bt['bg'][:7]) if alpha(bt['bg']) == 1 else None
        rtxt = f' · contrasto {r:.2f} {verdict(r)}' if r else ''
        return (f'<div class="comp"><div class="stage" style="background:{stage}"><a style="{st}">{label}</a></div>'
                f'<small>sfondo {bt["bg"][:7]} · testo {bt["color"][:7]} · raggio {bt["radius"]} · {bt["size"]}/{bt["weight"]} · altezza {bt["h"]}px{rtxt}</small></div>')

    # --- carta d'identità
    lockup = img(base, 'logo-lockup') or 'logo-lockup.png'
    role_tiles = ''.join(f'<div class="role"><div class="chip" style="background:{v};color:{on(v)}">Aa</div><div class="name">{esc(label)}</div><div class="hex">{v[:7]}{" · α" + str(alpha(v)) if alpha(v) < 1 else ""}</div><div class="tok">--{k} · {esc(use)}</div></div>' for k, label, use, v in roles)
    dark_row = ''
    if dark:
        dark_row = '<div class="label" style="margin-top:22px">Tema scuro (già definito nel CSS)</div><div class="roles">' + ''.join(
            f'<div class="role"><div class="chip" style="background:{v};color:{on(v)}">Aa</div><div class="name">{esc(label)}</div><div class="hex">{v[:7]}</div></div>' for k, label, use, v in dark) + '</div>'
    main_btns = [x for x in buttons if alpha(x['bg']) == 1 or x.get('bgImage')][:2] + [x for x in buttons if alpha(x['bg']) < 1 and x['border'] != 'none'][:1]
    btn_tile = ''.join(f'<div style="padding:14px;background:{x["ctxBg"] if not (lum(x["color"][:7])>0.6 and lum(x["ctxBg"][:7])>0.6 and alpha(x["bg"])<0.5 and not x.get("bgImage")) else "#1F2633"};border-radius:10px;margin-bottom:10px">{btn_html(x, True)}</div>' for x in main_btns) or '<p class="muted">Nessun pulsante rilevato.</p>'
    radius_main = radii[0][0] if radii else '0px'
    identity = f'''
<div class="bento">
  <div class="tile white span-2" style="display:flex;flex-direction:column;justify-content:space-between;gap:20px">
    <div class="label">Logo nell'header</div><img src="{lockup}" alt="Logo {esc(b['name'])} come appare nell'header" style="max-height:64px;width:auto;object-fit:contain;align-self:flex-start">
    <div class="muted" style="font-size:13px">{esc(t['meta'].get('title', ''))}</div></div>
  <div class="tile span-4"><div class="label">Colori per ruolo</div><div class="roles">{role_tiles}</div>{dark_row}</div>
  <div class="tile span-3" style="overflow:hidden"><div class="label">Tipografia</div>
    <div style="font-family:{ff(display)};font-size:96px;line-height:1;font-weight:{heads[0]['weight'] if heads else 700};color:{primary if lum(primary) < .5 else '#14171C'}">Aa</div>
    <div style="margin-top:14px;font-family:{ff(display)};font-size:20px;font-weight:{heads[0]['weight'] if heads else 700}">{esc(display.split(',')[0].strip(chr(34)))} <span class="muted" style="font-family:var(--font);font-size:13px;font-weight:400">titoli</span></div>
    <div style="font-family:{ff(textf)};font-size:16px">{esc(textf.split(',')[0].strip(chr(34)))} <span class="muted" style="font-family:var(--font);font-size:13px">testo</span></div>
    <div class="muted" style="font-size:13px;margin-top:8px">Pesi usati: {', '.join(weights)} · {len(sizes)} dimensioni ({int(sizes[-1])}–{int(sizes[0])}px)</div></div>
  <div class="tile span-3"><div class="label">Pulsanti principali</div>{btn_tile}</div>
  <div class="tile span-2"><div class="label">Forma prevalente</div><div style="width:100%;height:90px;background:{primary};border-radius:{radius_main}"></div><div class="muted" style="font-size:13px;margin-top:10px">raggio più usato: <code>{esc(radius_main)}</code></div></div>
  <div class="tile span-2"><div class="label">Icone</div><div style="font-size:34px;font-weight:700">{t['icons'].get('lucide', 0)}<span class="muted" style="font-size:15px;font-weight:400"> / {t['icons'].get('total', 0)} SVG</span></div><div class="muted" style="font-size:13px">sono Lucide, tratto {esc(', '.join(str(s[0]) for s in t['icons'].get('strokeWidth', [])[:1]))}</div></div>
  <div class="tile span-2"><div class="label">Layout</div><div style="font-size:34px;font-weight:700">{esc(' / '.join(sorted({c for c, _ in t['containers'][:2]}, key=lambda x: float(x[:-2]) if x.endswith('px') else 0))) if t['containers'] else '—'}</div><div class="muted" style="font-size:13px">larghezze massime più usate (testo / pagina) · header alto {(t.get('header') or {}).get('h', '—')}px</div></div>
</div>'''

    # --- diagnosi
    strengths = ''.join(f'<li><span class="ok-ic">✓</span>{esc(s)}</li>' for s in b['strengths'])
    issues = ''.join(f'<div class="issue"><h4><span class="sev {i["sev"]}">{i["sev"]}</span>{esc(i["title"])}</h4><p>{esc(i["detail"])}</p><div class="ev">Evidenza: {esc(i["evidence"])}</div></div>' for i in b['issues'])

    # --- screenshot
    inner = ''.join(f'<figure><a href="{img(base, p["slug"] + "-full")}"><img src="{img(base, p["slug"] + "-fold")}" alt="Pagina {esc(p["path"])}" loading="lazy"></a><figcaption><b>{esc(p["path"])}</b> · {esc(p.get("title", "")[:70])}</figcaption></figure>' for p in pages)

    # --- colori nel dettaglio
    def sw(items, what):
        tot = sum(w for _, w in items) or 1
        bar = ''.join(f'<span style="width:{w / tot * 100:.2f}%;background:{c}"></span>' for c, w in items)
        chips = ''.join(f'<div class="sw"><div class="chip checker"><div style="background:{c}"></div></div><code>{c[:7]}</code><small>{w / tot * 100:.1f}% {what}{" · trasp. " + str(alpha(c)) if alpha(c) < 1 else ""}</small></div>' for c, w in items)
        return f'<div class="bar" style="margin-bottom:14px">{bar}</div><div class="sws">{chips}</div>'
    bg0 = next((c for c, _ in bg if alpha(c) == 1), '#FFFFFF')
    crows = ''
    for c, _ in tx[:8]:
        if alpha(c) < 1 or (lum(bg0) > .6 and lum(c) > .6) or (lum(bg0) < .2 and lum(c) < .2):
            continue
        r = contrast(c, bg0)
        crows += f'<tr><td><span class="dot" style="background:{c}"></span>Testo {c[:7]}</td><td><span class="dot" style="background:{bg0}"></span>{bg0[:7]}</td><td>{r:.2f}:1</td><td>{verdict(r)}</td></tr>'
    for x in buttons[:8]:
        if alpha(x['bg']) == 1:
            r = contrast(x['color'][:7], x['bg'][:7])
            crows += f'<tr><td><span class="dot" style="background:{x["color"]}"></span>Pulsante «{esc(x["text"][:26])}»</td><td><span class="dot" style="background:{x["bg"]}"></span>{x["bg"][:7]}</td><td>{r:.2f}:1</td><td>{verdict(r)}</td></tr>'
    grads = ''.join(f'<div class="shadow"><div style="background:{esc(g)};border:1px solid var(--line)"></div><small class="mono">{esc(g[:150])}</small></div>' for g, _ in gr)

    # --- tipografia
    mob = {h['tag']: h for h in data.get('mobileTokens', {}).get('headings', [])}
    specs = ''
    for h in heads[:4]:
        m = mob.get(h['tag'])
        specs += (f'<div class="spec"><div class="k"><b>{h["tag"].upper()}</b>{esc(h["font"].split(",")[0].strip(chr(34)))} · {h["weight"]}<br>{h["size"]} / {h["lh"]}{" · mobile " + m["size"] if m else ""}<br>spaziatura {h["ls"]} · <span class="dot" style="background:{h["color"]}"></span>{h["color"][:7]}</div>'
                  f'<div class="v" style="font-family:{ff(h["font"])};font-size:{h["size"]};line-height:{h["lh"]};font-weight:{h["weight"]};letter-spacing:{h["ls"]};text-transform:{h["transform"]};color:{h["color"] if lum(h["color"]) < .8 else "#14171C"}">{esc(h["text"])}</div></div>')
    if p:
        specs += (f'<div class="spec"><div class="k"><b>TESTO</b>{esc(p["font"].split(",")[0].strip(chr(34)))} · {p["weight"]}<br>{p["size"]} / {p["lh"]}<br><span class="dot" style="background:{p["color"]}"></span>{p["color"][:7]}</div>'
                  f'<div class="v" style="font-family:{ff(p["font"])};font-size:{p["size"]};line-height:{p["lh"]};color:{p["color"] if lum(p["color"]) < .8 else "#4A5260"};max-width:68ch">{esc(p["sample"])}</div></div>')
    ladder = ''.join(f'<div><span class="px">{s:g}px</span><span style="font-family:{ff(display if s >= 24 else textf)};font-size:{min(s, 72)}px;line-height:1.15;font-weight:{600 if s >= 24 else 400}">{esc(b["name"])} — Aa Bb 123</span></div>' for s in sizes)

    # --- componenti
    btns = ''.join(btn_html(x) for x in buttons)
    bdg = ''.join(f'<div class="comp"><div class="stage" style="background:#fff"><span style="display:inline-flex;align-items:center;background:{x["bg"]};color:{x["color"]};border:{x["border"]};border-radius:{x["radius"]};padding:{x["padding"]};font-size:{x["size"]};font-weight:{x["weight"]};text-transform:{x["transform"]};letter-spacing:{x["ls"]};font-family:{ff(x["font"])}">{esc(x["text"])}</span></div><small>sfondo {x["bg"][:9]} · testo {x["color"][:7]} · raggio {x["radius"]}</small></div>' for x in badges) or '<p class="muted">Nessun badge rilevato.</p>'
    crd = ''.join(f'<div class="comp" style="max-width:none"><div style="background:{x["bg"] if alpha(x["bg"]) > 0 else "#fff"};border:{x["border"]};border-radius:{x["radius"]};{"box-shadow:" + x["shadow"] + ";" if x.get("shadow") else ""}padding:{x["padding"]};height:150px;overflow:hidden;display:flex;flex-direction:column;gap:10px" aria-hidden="true"><span style="display:block;height:12px;width:55%;border-radius:4px;background:{on(x["bg"][:7]) if alpha(x["bg"]) > 0 else "#14171C"};opacity:.75"></span><span style="display:block;height:8px;width:90%;border-radius:4px;background:{on(x["bg"][:7]) if alpha(x["bg"]) > 0 else "#14171C"};opacity:.25"></span><span style="display:block;height:8px;width:75%;border-radius:4px;background:{on(x["bg"][:7]) if alpha(x["bg"]) > 0 else "#14171C"};opacity:.25"></span></div><small>sfondo {x["bg"][:9]} · raggio {x["radius"]} · padding {x["padding"]} · bordo {x["border"]}</small></div>' for x in cards) or '<p class="muted">Nessuna card rilevata.</p>'
    inp = ''.join(f'<div class="comp">{"<label style=font-size:" + i["labelStyle"]["size"] + ";font-weight:" + i["labelStyle"]["weight"] + ";color:" + i["labelStyle"]["color"] + ">" + esc(i["label"]) + "</label>" if i.get("labelStyle") else ""}<{"textarea" if i["type"] == "textarea" else "input"} aria-label="esempio campo" placeholder="{esc(i["placeholder"] or i["type"])}" style="background:{i["bg"]};color:{i["color"]};border:{i["border"]};border-radius:{i["radius"]};padding:{i["padding"]};font-size:{i["size"]};height:{i["h"]}px;width:300px;max-width:100%;font-family:inherit{";box-shadow:" + i["shadow"] if i.get("shadow") else ""}">{"</textarea>" if i["type"] == "textarea" else ""}<small>{esc(i["type"])} · altezza {i["h"]}px · raggio {i["radius"]} · bordo {esc(i["border"])}</small></div>' for i in inputs) or '<p class="muted">Nessun campo form nelle pagine analizzate.</p>'

    # --- forme
    shp = ''.join(f'<div class="shape"><div style="border-radius:{esc(r)}"></div><code>{esc(r)}</code><br><small class="muted">{n} elementi</small></div>' for r, n in radii)
    shd = ''.join(f'<div class="shadow"><div style="box-shadow:{esc(s)}"></div><small class="mono">{esc(s[:120])}</small></div>' for s, _ in shadows) or '<p class="muted">Nessuna ombra.</p>'
    motion = ', '.join(f'{a} ({n})' for a, n in t.get('motion', [])) or '—'

    # --- dati tecnici
    srows = ''.join(f'<tr><td>{s["tag"]}</td><td>{esc(s["font"])}</td><td>{s["size"]}</td><td>{s["weight"]}</td><td>{s["lh"]}</td><td><span class="dot" style="background:{s["color"]}"></span>{s["color"]}</td><td>{s["chars"]}</td><td class="muted">{esc(s["sample"][:46])}</td></tr>' for s in t['textStyles'][:24])
    vrows = ''.join(f'<tr><td><code>{esc(k.rsplit(" ", 1)[1])}</code></td><td class="muted">{esc(k.rsplit(" ", 1)[0])}</td><td>{"<span class=dot style=background:" + v + "></span>" if re.match(r"^#[0-9A-F]{6,8}$", v) else ""}<code>{esc(v[:90])}</code></td></tr>' for k, v in vars_.items())
    layout = f'''<table><tr><th>Elemento</th><th>Valore</th></tr>
<tr><td>Larghezza massima contenuti</td><td>{esc(', '.join(f'{a} ({n})' for a, n in t['containers']))}</td></tr>
<tr><td>Spazio verticale delle sezioni</td><td>{esc(', '.join(f'{a} ({n})' for a, n in t['sectionPadding']))}</td></tr>
<tr><td>Spaziature tra elementi (gap)</td><td>{esc(', '.join(f'{a} ({n})' for a, n in t['gaps']))}</td></tr>
<tr><td>Header</td><td>{esc(json.dumps(t.get('header'), ensure_ascii=False))}</td></tr>
<tr><td>Footer</td><td>{esc(json.dumps(t.get('footer'), ensure_ascii=False))}</td></tr>
<tr><td>Icone Lucide usate</td><td>{esc(', '.join(n.replace('lucide-', '') for n in t['icons'].get('names', []) if n != 'lucide'))}</td></tr>
<tr><td>Transizioni e animazioni</td><td>{esc(motion)}</td></tr></table>'''

    toc = [('identita', "Carta d'identità"), ('diagnosi', 'Diagnosi'), ('screenshot', 'Screenshot'), ('colori', 'Colori'), ('tipografia', 'Tipografia'), ('componenti', 'Componenti'), ('forme', 'Forme'), ('tecnico', 'Dati tecnici')]
    body = f'''
<div class="hero"><div class="wrap"><p class="eyebrow">Design system attuale · {esc(d)}</p><h1>{esc(b['name'])}</h1><p class="lead">{esc(b['summary'])}</p>
<p class="meta">{esc(b['sector'])} · analizzate la homepage e {len(pages)} pagine interne · <a href="https://{d}/" rel="noopener">apri il sito live</a> · <a href="../index.html">vedi le 3 direzioni di restyle →</a></p></div></div>

<section class="block" id="identita"><div class="wrap"><h2>Carta d'identità</h2><p class="explain">Gli elementi base del sito in un colpo d'occhio: i colori con il loro ruolo (come sono definiti nel codice), i caratteri, i pulsanti e le forme ricorrenti.</p>{identity}</div></section>

<section class="block" id="diagnosi"><div class="wrap"><h2>Diagnosi</h2><p class="explain">Cosa tenere e cosa correggere nel restyling. I problemi sono ordinati per gravità; ognuno riporta da dove viene l'evidenza.</p>
<div class="findings"><div class="card"><h3>Cosa funziona</h3><ul class="clean">{strengths}</ul></div><div class="card"><h3>Cosa correggere</h3>{issues}</div></div></div></section>

<section class="block" id="screenshot"><div class="wrap"><h2>Screenshot</h2><p class="explain">Homepage su desktop (1440px) e su mobile (390px), poi le pagine interne analizzate. Clicca un'immagine per vedere la pagina intera.</p>
<div class="shots"><figure><a href="{img(base, 'desktop-full')}"><img src="{img(base, 'desktop-fold')}" alt="Homepage desktop"></a><figcaption>Homepage · desktop</figcaption></figure><figure><a href="{img(base, 'mobile-full')}"><img src="{img(base, 'mobile-fold')}" alt="Homepage mobile"></a><figcaption>Homepage · mobile</figcaption></figure></div>
<h3>Pagine interne</h3><div class="grid-3">{inner}</div>
<h3>Header e footer</h3><figure><img src="{img(base, 'header')}" alt="Header" loading="lazy"></figure><br><figure><img src="{img(base, 'footer')}" alt="Footer" loading="lazy"></figure></div></section>

<section class="block" id="colori"><div class="wrap"><h2>Colori nel dettaglio</h2><p class="explain">Quanto è usato davvero ogni colore. La barra mostra le proporzioni: gli sfondi sono pesati per superficie occupata, i testi per numero di caratteri. I quadretti indicano i colori semitrasparenti.</p>
<h3>Sfondi</h3>{sw(bg, 'della superficie')}<h3>Testi</h3>{sw(tx, 'del testo')}<h3>Bordi</h3>{sw(bd, 'dei bordi')}
<h3>Leggibilità (contrasto WCAG 2.1)</h3><p class="explain" style="margin-bottom:12px">Il contrasto misura quanto un testo si stacca dallo sfondo. La soglia minima per il testo normale è 4.5:1; per i testi grandi basta 3:1.</p>
<table><tr><th>Elemento</th><th>Sfondo</th><th>Contrasto</th><th>Esito</th></tr>{crows}</table>
{('<h3>Gradienti e texture</h3><div class="shapes">' + grads + '</div>') if grads else ''}</div></section>

<section class="block" id="tipografia"><div class="wrap"><h2>Tipografia</h2><p class="explain">I titoli e il testo come appaiono sul sito, con dimensione, interlinea, peso e colore. Sotto, tutte le dimensioni di carattere usate, dalla più grande alla più piccola.</p>
{specs}<h3>Scala delle dimensioni usate</h3><div class="ladder">{ladder}</div></div></section>

<section class="block" id="componenti"><div class="wrap"><h2>Componenti</h2><p class="explain">Pulsanti, badge, card e campi dei form ricostruiti con gli stili reali, ognuno sul suo sfondo (dove lo sfondo è un'immagine o un gradiente scuro, viene simulato).</p>
<h3>Pulsanti e CTA</h3><div class="comps">{btns}</div><h3>Badge ed etichette</h3><div class="comps">{bdg}</div><h3>Card</h3><p class="explain" style="margin-bottom:14px">Forma, sfondo, bordo e ombra reali; il contenuto è schematizzato.</p><div class="cards">{crd}</div><h3>Campi dei form</h3><div class="comps">{inp}</div></div></section>

<section class="block" id="forme"><div class="wrap"><h2>Forme, profondità, movimento</h2><p class="explain">Raggi degli angoli e ombre più usati. Un raggio di 9999px significa forma a pillola.</p>
<div class="grid-2"><div><h3>Raggi</h3><div class="shapes">{shp}</div></div><div><h3>Ombre</h3><div class="shapes">{shd}</div></div></div></div></section>

<section class="block" id="tecnico"><div class="wrap"><h2>Dati tecnici</h2><p class="explain">Per chi sviluppa: valori grezzi estratti dal browser. Il file completo è <a href="tokens.json">tokens.json</a>.</p>
<details><summary>Layout, icone e animazioni</summary><div>{layout}</div></details>
<details><summary>Stili di testo più usati in homepage ({len(t['textStyles'])})</summary><div><table><tr><th>tag</th><th>font</th><th>size</th><th>peso</th><th>interlinea</th><th>colore</th><th>caratteri</th><th>esempio</th></tr>{srows}</table></div></details>
<details><summary>Variabili CSS custom ({len(vars_)} su {t.get('cssVarTotal')}; esclusi i default di Tailwind)</summary><div><table><tr><th>token</th><th>selettore</th><th>valore</th></tr>{vrows}</table></div></details></div></section>'''
    out = page(f'{b["name"]} · design system attuale', [('Design system', '../../../index.html'), (b['name'], '../index.html'), ('Attuale', None)], toc, body, fams)
    open(os.path.join(base, 'index.html'), 'w').write(out.replace('{CSS}', '../../../assets/site.css'))

# ---------- pagina del brand ----------
def directions(d):
    out = []
    for f in sorted(glob(os.path.join(ROOT, 'brands', d, 'restyle-*', 'direction.json'))):
        try:
            j = json.load(open(f))
            j['_dir'] = os.path.basename(os.path.dirname(f))
            out.append(j)
        except Exception as e:
            out.append({'_dir': os.path.basename(os.path.dirname(f)), '_error': str(e)})
    return out

def brand_page(d):
    b = BRANDS[d]
    base = os.path.join(ROOT, 'brands', d)
    t = json.load(open(os.path.join(base, 'attuale', 'tokens.json')))['tokens']
    roles = semantic(t['cssVars'])
    dirs = directions(d)
    fams = []
    cards = ''
    for j in dirs:
        if j.get('_error'):
            cards += f'<div class="pending">{esc(j["_dir"])}: direction.json non leggibile ({esc(j["_error"])})</div>'
            continue
        fams += [f['family'] for f in j.get('fonts', [])]
        prev = 'preview.png' if os.path.exists(os.path.join(base, j['_dir'], 'preview.png')) else None
        chips = ''.join(f'<span style="background:{esc(c["hex"])}" title="{esc(c.get("name", ""))} {esc(c["hex"])} · {esc(c.get("role", ""))}"></span>' for c in j.get('palette', [])[:8])
        fonts = ' + '.join(f'<span style="font-family:\'{esc(f["family"])}\'">{esc(f["family"])}</span>' for f in j.get('fonts', []))
        tags = ''.join(f'<span>{esc(m)}</span>' for m in j.get('motion', [])[:5])
        fixes = ''.join(f'<li>{esc(x)}</li>' for x in j.get('fixes', [])[:4])
        refs = ' · '.join(f'<a href="{esc(r["url"])}" rel="noopener">{esc(r["label"])}</a>' for r in j.get('references', [])[:4])
        cards += f'''<article class="dir-card">{f'<a href="{j["_dir"]}/index.html"><img src="{j["_dir"]}/{prev}" alt="Anteprima {esc(j.get("name"))}" loading="lazy"></a>' if prev else ''}
<div class="body"><p class="eyebrow" style="margin:0">Direzione {esc(j.get('n', ''))}</p><h3>{esc(j.get('name'))}</h3><p style="margin:0;color:var(--ink-2)">{esc(j.get('concept'))}</p>
<div class="chips">{chips}</div><div style="font-size:14px">{fonts}</div><div class="tags">{tags}</div>
{f'<details><summary>Cosa corregge del sito attuale</summary><div><ul style="margin:0;padding-left:18px">{fixes}</ul></div></details>' if fixes else ''}
{f'<div class="muted" style="font-size:13px">Riferimenti: {refs}</div>' if refs else ''}
<div class="btns"><a class="btn primary" href="{j['_dir']}/index.html">Apri la demo →</a><a class="btn" href="{j['_dir']}/tokens.css">Token CSS</a></div></div></article>'''
    if len(dirs) < 3:
        cards += ''.join(f'<div class="pending">Direzione {i + 1}: non ancora disponibile.</div>' for i in range(len(dirs), 3))
    chips = ''.join(f'<span style="background:{v}" title="{esc(label)} {v}"></span>' for _, label, _, v in roles[:7])
    body = f'''
<div class="hero"><div class="wrap"><p class="eyebrow">{esc(d)}</p><h1>{esc(b['name'])}</h1><p class="lead">{esc(b['sector'])}</p></div></div>
<section class="block" id="attuale"><div class="wrap"><h2>Il sito oggi</h2><p class="explain">{esc(b['summary'])}</p>
<a class="brand-card" href="attuale/index.html" style="max-width:860px;flex-direction:row;flex-wrap:wrap"><img src="attuale/{img(os.path.join(base, 'attuale'), 'desktop-fold')}" alt="Homepage attuale" style="width:420px;max-width:100%;aspect-ratio:16/10;border-bottom:0;border-right:1px solid var(--line)">
<div class="body" style="min-width:260px"><h3>Design system attuale</h3><div class="chips">{chips}</div><div class="muted" style="font-size:14px">{len(b['issues'])} problemi da correggere · {sum(1 for i in b['issues'] if i['sev'] == 'alto')} gravi</div><span class="btn" style="align-self:flex-start">Apri la tavola →</span></div></a></div></section>
<section class="block" id="restyle"><div class="wrap"><h2>Tre direzioni di restyle</h2><p class="explain">Tre homepage concept costruite con i testi, il logo e la palette originale del sito. Le direzioni cambiano concetto, caratteri, layout e movimento; i colori sono sempre quelli approvati in data/palettes.json. Ogni direzione ha il suo tokens.css. Servono a scegliere la strada: il design system definitivo nascerà dalla direzione scelta.</p>
<div class="grid-3">{cards}</div></div></section>'''
    out = page(f'{b["name"]} · design system e restyle', [('Design system', '../../index.html'), (b['name'], None)], [('attuale', 'Il sito oggi'), ('restyle', 'Restyle')], body, fams)
    open(os.path.join(base, 'index.html'), 'w').write(out.replace('{CSS}', '../../assets/site.css'))

# ---------- home ----------
def home():
    cards = ''
    for d in ORDER:
        b = BRANDS[d]
        base = os.path.join(ROOT, 'brands', d)
        t = json.load(open(os.path.join(base, 'attuale', 'tokens.json')))['tokens']
        roles = semantic(t['cssVars'])
        chips = ''.join(f'<span style="background:{v}" title="{esc(label)} {v}"></span>' for _, label, _, v in roles[:6])
        nd = len([j for j in directions(d) if not j.get('_error')])
        cards += f'''<a class="brand-card" href="brands/{d}/index.html"><img src="brands/{d}/attuale/{img(os.path.join(base, 'attuale'), 'desktop-fold')}" alt="Homepage attuale di {esc(d)}" loading="lazy">
<div class="body"><p class="eyebrow" style="margin:0">{esc(d)}</p><h3>{esc(b['name'])}</h3><p style="margin:0;color:var(--ink-2);font-size:14px">{esc(b['sector'])}</p><div class="chips">{chips}</div>
<div class="tags"><span>{len(b['issues'])} problemi ({sum(1 for i in b['issues'] if i['sev'] == 'alto')} gravi)</span><span>{nd} direzioni di restyle</span></div></div></a>'''
    body = f'''
<div class="hero"><div class="wrap"><p class="eyebrow">Evolve · design system</p><h1>Cinque siti, cinque design system</h1>
<p class="lead">Per ogni sito: il design system di oggi, estratto dal sito live e spiegato, con una diagnosi di cosa tenere e cosa correggere; poi tre direzioni di restyle concrete, con homepage animate navigabili e i relativi token.</p></div></div>
<section class="block" id="brand"><div class="wrap"><div class="grid-3">{cards}</div></div></section>
<section class="block" id="come"><div class="wrap"><h2>Come leggere questo materiale</h2>
<div class="grid-3"><div class="card"><h3>1 · Il sito oggi</h3><p class="muted" style="margin:0">La tavola "attuale" mostra colori, caratteri e componenti come li vede il browser, con gli screenshot e una diagnosi in linguaggio semplice.</p></div>
<div class="card"><h3>2 · Tre direzioni</h3><p class="muted" style="margin:0">Tre homepage concept per sito, volutamente diverse tra loro. Usano i testi, il logo e la palette originale del sito e risolvono i problemi trovati. Ognuna ha il suo tokens.css.</p></div>
<div class="card"><h3>3 · La scelta</h3><p class="muted" style="margin:0">Dalla direzione scelta (anche mescolando elementi di più direzioni) nasce il design system definitivo da applicare al sito.</p></div></div>
<h3>Metodo</h3><p class="explain">I valori sono stati estratti il 23/11/2026 con un browser automatico (Chromium, Playwright) dagli stili computati di homepage e pagine interne, a 1440px e 390px. Il banner cookie è stato chiuso con "Rifiuta". Gli script sono nella cartella <code>tools/</code>. Tutti e cinque i siti usano React, Tailwind CSS v4, token in stile shadcn e icone Lucide: molte scelte di forma (raggi, ombre) sono i default di Tailwind più che decisioni di brand.</p></div></section>'''
    out = page('Design system · Evolve', [('Design system', None)], [('brand', 'Brand'), ('come', 'Come leggere')], body, [])
    open(os.path.join(ROOT, 'index.html'), 'w').write(out.replace('{CSS}', 'assets/site.css'))

if __name__ == '__main__':
    for d in ORDER:
        board(d)
        brand_page(d)
        print('ok', d, len(directions(d)), 'direzioni')
    home()
    print('ok home')
