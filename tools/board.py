"""Generate an HTML 'current design system' board per site from tokens.json.
Usage: python3 -I board.py <estrazione_dir>
"""
import json, sys, re, html, os
from urllib.parse import quote_plus

root = sys.argv[1]
esc = lambda s: html.escape(str(s)) if s is not None else ''

def rgb(hx):
    hx = hx.lstrip('#')
    return tuple(int(hx[i:i+2], 16) / 255 for i in (0, 2, 4))

def lum(hx):
    try:
        r, g, b = rgb(hx[:7])
    except Exception:
        return 0.5
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)

def contrast(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)

def alpha(hx):
    return round(int(hx[7:9], 16) / 255, 2) if len(hx) == 9 else 1.0

def merge_counts(lists):
    out = {}
    for l in lists:
        for k, w in l:
            out[k] = out.get(k, 0) + w
    return sorted(out.items(), key=lambda x: -x[1])

def dedupe(items, keyf, n):
    seen, out = set(), []
    for it in items:
        k = keyf(it)
        if k in seen:
            continue
        seen.add(k); out.append(it)
        if len(out) >= n:
            break
    return out

def swatches(items, label):
    tot = sum(w for _, w in items) or 1
    out = []
    for c, w in items:
        a = alpha(c)
        txt = '#fff' if (lum(c) < 0.35 and a > 0.5) else '#111'
        al = f' · α{a:g}' if a < 1 else ''
        out.append(f'<div class="sw"><div class="chip checker"><div style="background:{c};color:{txt}">Aa</div></div><code>{c[:7]}{al}</code><small>{w/tot*100:.1f}% {label}</small></div>')
    return '\n'.join(out)

def google_fonts_link(fams):
    keep = [f.replace(' Variable', '') for f in fams if f and f.lower() not in ('system-ui', 'ui-sans-serif', '-apple-system', 'arial', 'helvetica')]
    keep = list(dict.fromkeys(keep))
    if not keep:
        return ''
    q = '&'.join(f'family={quote_plus(f)}:wght@300..900' if f not in ('Fraunces',) else 'family=Fraunces:opsz,wght@9..144,300..900' for f in keep)
    return f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{q}&display=swap">'

def ff(f):
    # render with real font, map "Inter Variable" -> Inter
    base = f.split(',')[0].strip().strip('"\'')
    return f"'{base}', '{base.replace(' Variable', '')}', system-ui, sans-serif"

def build(domain):
    d = os.path.join(root, domain)
    data = json.load(open(os.path.join(d, 'tokens.json')))
    t = data.get('tokens')
    if not t:
        return f'<p>Estrazione fallita: {esc(data.get("desktopError"))}</p>'
    pages = [p for p in data.get('pages', []) if p.get('tokens')]
    all_t = [t] + [p['tokens'] for p in pages]
    meta = t['meta']
    fams = [f for f, _ in merge_counts([x['fonts'] for x in all_t])]
    fontlink = google_fonts_link(fams)

    bg = merge_counts([x['colors']['bg'] for x in all_t])[:16]
    tx = merge_counts([x['colors']['text'] for x in all_t])[:14]
    bd = merge_counts([x['colors']['border'] for x in all_t])[:10]
    gr = merge_counts([x['colors']['gradients'] for x in all_t])[:6]
    sizes = sorted({float(s[:-2]) for x in all_t for s, _ in x['sizes']})
    weights = merge_counts([x['weights'] for x in all_t])
    radii = merge_counts([x['radii'] for x in all_t])[:10]
    shadows = merge_counts([x['shadows'] for x in all_t])[:8]
    buttons = dedupe([b for x in all_t for b in x['buttons']], lambda b: (b['bg'], b['bgImage'], b['color'], b['radius'], b['border'], b['size'], b['weight'], b['h']), 18)
    inputs = dedupe([i for x in all_t for i in x['inputs']], lambda i: (i['type'], i['bg'], i['border'], i['radius'], i['h']), 8)
    badges = dedupe([b for x in all_t for b in x['badges']], lambda b: (b['bg'], b['color'], b['border'], b['size'], b['transform']), 12)
    cards = dedupe([c for x in all_t for c in x['cards']], lambda c: (c['bg'], c['border'], c['radius'], c['shadow']), 8)

    heads = ''.join(
        f'<div class="spec"><div class="spec-meta"><b>{h["tag"].upper()}</b><code>{esc(h["font"].split(",")[0].strip(chr(34)))}</code><code>{h["size"]} / {h["lh"]}</code><code>w{h["weight"]}</code><code>ls {h["ls"]}</code><code><span class="dot" style="background:{h["color"]}"></span>{h["color"]}</code>{"<code>"+h["transform"]+"</code>" if h["transform"]!="none" else ""}</div>'
        f'<div style="font-family:{ff(h["font"])};font-size:{h["size"]};line-height:{h["lh"]};font-weight:{h["weight"]};color:{h["color"] if lum(h["color"])<0.8 else "#111"};text-transform:{h["transform"]};letter-spacing:{h["ls"]}">{esc(h["text"])}</div></div>'
        for h in t['headings'])
    mob = data.get('mobileTokens', {})
    mobs = ', '.join(f'{h["tag"].upper()} {h["size"]}/{h["lh"]}' for h in mob.get('headings', []))
    p = t.get('paragraph') or {}
    pcol = p.get('color', '#333')
    para = (f'<div class="spec"><div class="spec-meta"><b>BODY LEAD</b><code>{esc(p.get("font","").split(",")[0].strip(chr(34)))}</code><code>{p.get("size")} / {p.get("lh")}</code><code>w{p.get("weight")}</code><code><span class="dot" style="background:{pcol}"></span>{pcol}</code></div>'
            f'<div style="font-family:{ff(p.get("font","Inter"))};font-size:{p.get("size")};line-height:{p.get("lh")};font-weight:{p.get("weight")};color:{pcol if lum(pcol[:7])<0.8 else "#444"};max-width:70ch">{esc(p.get("sample"))}</div></div>') if p else ''
    accents = ''.join(f'<li>«{esc(a["text"])}» colore <code>{a["color"]}</code>{" · gradiente <code>"+esc(a["bgImage"][:120])+"</code>" if a.get("bgImage") else ""}{" · corsivo" if a.get("style")=="italic" else ""}</li>' for a in t.get('accents', []))

    styles_rows = ''.join(
        f'<tr><td>{s["tag"]}</td><td>{esc(s["font"])}</td><td>{s["size"]}</td><td>{s["weight"]}</td><td>{s["lh"]}</td><td>{s["ls"] if s["ls"] not in ("normal","0px") else ""}</td><td><span class="dot" style="background:{s["color"]}"></span>{s["color"]}</td><td>{s["transform"] if s["transform"]!="none" else ""}</td><td>{s["chars"]}</td><td class="sample">{esc(s["sample"][:48])}</td></tr>'
        for s in t['textStyles'][:24])

    def btn_html(b):
        style = (f'display:inline-flex;align-items:center;gap:8px;justify-content:center;background:{b["bg"]};'
                 + (f'background-image:{b["bgImage"]};' if b.get('bgImage') else '')
                 + f'color:{b["color"]};border-radius:{b["radius"]};border:{b["border"]};padding:{b["padding"]};font-family:{ff(b["font"])};font-size:{b["size"]};font-weight:{b["weight"]};text-transform:{b["transform"]};letter-spacing:{b["ls"]};'
                 + (f'box-shadow:{b["shadow"]};' if b.get('shadow') else '') + f'height:{b["h"]}px;text-decoration:none;white-space:nowrap')
        arrow = ' →' if b.get('hasIcon') else ''
        stage, note = b['ctxBg'], ''
        if lum(b['color'][:7]) > 0.6 and lum(stage[:7]) > 0.6 and (alpha(b['bg']) < 0.5 and not b.get('bgImage')):
            stage, note = '#1F2633', ' · sfondo reale = gradiente/immagine scura (stage simulato)'
        return (f'<div class="btn-cell"><div class="btn-stage" style="background:{stage}"><a style="{style}">{esc(b["text"])}{arrow}</a></div>'
                f'<small class="mono">bg {b["bg"][:9]} · testo {b["color"][:9]} · r {b["radius"]} · {b["size"]}/{b["weight"]} · h{b["h"]} · pad {b["padding"]}{" · bordo "+b["border"] if b["border"]!="none" else ""}{note}</small></div>')
    btns = ''.join(btn_html(b) for b in buttons)

    inp = ''.join(
        f'<div class="btn-cell">{"<label style=font-size:"+i["labelStyle"]["size"]+";font-weight:"+i["labelStyle"]["weight"]+";color:"+i["labelStyle"]["color"]+">"+esc(i["label"])+"</label>" if i.get("labelStyle") else ""}'
        f'<{"textarea" if i["type"]=="textarea" else "input"} placeholder="{esc(i["placeholder"] or i["type"])}" style="background:{i["bg"]};color:{i["color"]};border:{i["border"]};border-radius:{i["radius"]};padding:{i["padding"]};font-size:{i["size"]};height:{i["h"]}px;width:280px;font-family:inherit{";box-shadow:"+i["shadow"] if i.get("shadow") else ""}">{"</textarea>" if i["type"]=="textarea" else ""}'
        f'<small class="mono">{esc(i["type"])} · h{i["h"]} · r {i["radius"]} · bordo {esc(i["border"])} · bg {i["bg"]}</small></div>'
        for i in inputs) or '<p class="muted">Nessun campo form nelle pagine campionate.</p>'

    bdg = ''.join(
        f'<div class="btn-cell"><span style="display:inline-flex;align-items:center;background:{b["bg"]};color:{b["color"]};border:{b["border"]};border-radius:{b["radius"]};padding:{b["padding"]};font-size:{b["size"]};font-weight:{b["weight"]};text-transform:{b["transform"]};letter-spacing:{b["ls"]};font-family:{ff(b["font"])}">{esc(b["text"])}</span><small class="mono">bg {b["bg"]} · {b["color"]} · r {b["radius"]}</small></div>'
        for b in badges) or '<p class="muted">Nessuno.</p>'

    crd = ''.join(
        f'<div class="card-cell"><div style="background:{c["bg"] if alpha(c["bg"])>0 else "#fff"};border:{c["border"]};border-radius:{c["radius"]};{"box-shadow:"+c["shadow"]+";" if c.get("shadow") else ""}padding:{c["padding"]};height:150px;overflow:hidden;font-size:13px;color:#445">{esc(c["sample"])}</div><small class="mono">bg {c["bg"]} · r {c["radius"]} · pad {c["padding"]} · bordo {c["border"]}{" · ombra "+esc(c["shadow"][:80]) if c.get("shadow") else ""}</small></div>'
        for c in cards) or '<p class="muted">Nessuna.</p>'

    lockup = '<img src="logo-lockup.png" style="max-height:72px">' if os.path.exists(os.path.join(d, 'logo-lockup.png')) else ''
    logos = ''
    seen_src = set()
    for l in t['logos']:
        if l.get('src') in seen_src:
            continue
        seen_src.add(l.get('src'))
        if l.get('src'):
            logos += f'<div class="logo-cell"><img src="{esc(l["src"])}" style="max-width:220px;max-height:80px"><small class="mono">{esc(l["src"].split("/")[-1][:60])} · reso {l["w"]}×{l["h"]}px</small></div>'
        elif l.get('svg'):
            logos += f'<div class="logo-cell"><div style="width:64px;height:64px;color:#111">{l["svg"].replace("<svg", "<svg width=64 height=64", 1)}</div><small class="mono">SVG inline · reso {l["w"]}×{l["h"]}px</small></div>'
    fav = ''.join(f'<img src="{esc(u)}" style="width:32px;height:32px" title="{esc(u)}">' for u in meta.get('favicon', [])[:3])

    rad = ''.join(f'<div class="rad"><div style="border-radius:{esc(r)}"></div><code>{esc(r)}</code><small>{n} elementi</small></div>' for r, n in radii)
    shd = ''.join(f'<div class="shd"><div style="box-shadow:{esc(s)}"></div><small class="mono">{esc(s[:140])}</small><small>{n}×</small></div>' for s, n in shadows) or '<p class="muted">Nessuna ombra.</p>'
    grd = ''.join(f'<div class="shd"><div style="background:{esc(g)};border:1px solid #e4e7ec"></div><small class="mono">{esc(g[:160])}</small></div>' for g, _ in gr) or '<p class="muted">Nessuno.</p>'

    vars_rows = ''
    for k, v in list(t['cssVars'].items())[:90]:
        sel, name = k.rsplit(' ', 1)
        m = re.match(r'^#[0-9A-F]{6,8}$', v)
        vars_rows += f'<tr><td><code>{esc(name)}</code></td><td class="muted">{esc(sel)}</td><td>{"<span class=dot style=background:"+v+"></span>" if m else ""}<code>{esc(v[:100])}</code></td></tr>'

    bg0 = next((c for c, _ in bg if alpha(c) == 1), '#FFFFFF')
    contr = ''
    for c, _ in tx[:8]:
        if alpha(c) < 1 or (lum(bg0) > 0.6 and lum(c) > 0.6) or (lum(bg0) < 0.2 and lum(c) < 0.2):
            continue  # light text lives on dark sections (and vice versa): not comparable with dominant bg
        r = contrast(c, bg0)
        contr += f'<tr><td><span class="dot" style="background:{c}"></span>{c}</td><td><span class="dot" style="background:{bg0}"></span>{bg0}</td><td>{r:.2f}</td><td>{"AA ✓" if r >= 4.5 else ("solo testo grande" if r >= 3 else "insufficiente")}</td></tr>'
    for b in buttons[:8]:
        if alpha(b['bg']) == 1:
            r = contrast(b['color'][:7], b['bg'][:7])
            contr += f'<tr><td>CTA «{esc(b["text"][:20])}» <span class="dot" style="background:{b["color"]}"></span>{b["color"][:7]}</td><td><span class="dot" style="background:{b["bg"]}"></span>{b["bg"][:7]}</td><td>{r:.2f}</td><td>{"AA ✓" if r >= 4.5 else ("solo testo grande" if r >= 3 else "insufficiente")}</td></tr>'

    ic = t.get('icons', {})
    hd, ft = t.get('header') or {}, t.get('footer') or {}
    inner = ''.join(f'<figure><img src="{p["slug"]}-fold.png"><figcaption><a href="{p["slug"]}-full.png">{esc(p["path"])}</a> — {esc(p.get("title",""))[:60]}</figcaption></figure>' for p in pages)

    return f'''<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(domain)} · DS attuale</title>{fontlink}
<style>
:root{{--ink:#15181d;--muted:#667085;--line:#e4e7ec;--panel:#f6f7f9}}
*{{box-sizing:border-box}}body{{margin:0;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:#fff}}
header.top{{padding:28px 40px;border-bottom:1px solid var(--line)}}header.top h1{{margin:0;font-size:26px}}header.top p{{margin:4px 0 0;color:var(--muted)}}
nav.toc{{position:sticky;top:0;background:#fffffff0;backdrop-filter:blur(6px);border-bottom:1px solid var(--line);padding:10px 40px;display:flex;gap:16px;flex-wrap:wrap;font-size:13px;z-index:5}}nav.toc a{{color:var(--muted);text-decoration:none}}nav.toc a:hover{{color:var(--ink)}}
main{{padding:0 40px 80px;max-width:1440px}}
section{{padding:32px 0;border-bottom:1px solid var(--line)}}section>h2{{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:0 0 16px}}
h3{{font-size:14px;margin:22px 0 10px}}
.shots{{display:grid;grid-template-columns:3fr 1fr;gap:16px;align-items:start}}.shots img,figure img{{width:100%;border:1px solid var(--line);border-radius:6px;display:block}}
.inner{{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}}figure{{margin:0}}figcaption{{font-size:12px;color:var(--muted);margin-top:6px}}
.sws{{display:flex;flex-wrap:wrap;gap:12px}}.sw{{width:118px;display:flex;flex-direction:column;gap:2px}}
.chip{{height:64px;border-radius:8px;border:1px solid var(--line);overflow:hidden}}.chip>div{{height:100%;display:flex;align-items:flex-end;padding:8px;font-weight:600}}
.checker{{background-image:linear-gradient(45deg,#eee 25%,transparent 25%,transparent 75%,#eee 75%),linear-gradient(45deg,#eee 25%,transparent 25%,transparent 75%,#eee 75%);background-size:12px 12px;background-position:0 0,6px 6px}}
code,.mono{{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}}small{{color:var(--muted);font-size:11px;display:block;word-break:break-word}}
.spec{{padding:14px 0;border-bottom:1px dashed var(--line)}}.spec-meta{{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;align-items:center}}.spec-meta code{{background:var(--panel);padding:1px 6px;border-radius:4px}}
table{{border-collapse:collapse;width:100%;font-size:12px}}td,th{{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}}th{{color:var(--muted);font-weight:500}}td.sample{{color:var(--muted)}}
.dot{{display:inline-block;width:12px;height:12px;border-radius:3px;border:1px solid #0002;margin-right:6px;vertical-align:-2px}}
.btns{{display:flex;flex-wrap:wrap;gap:20px}}.btn-cell{{display:flex;flex-direction:column;gap:8px;align-items:flex-start;max-width:360px}}.btn-stage{{padding:22px;border-radius:10px;border:1px solid var(--line)}}
.cards{{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}}.card-cell{{display:flex;flex-direction:column;gap:8px;padding:16px;background:var(--panel);border-radius:10px}}
.logos{{display:flex;flex-wrap:wrap;gap:16px;align-items:stretch}}.logo-cell{{padding:20px;background:var(--panel);border-radius:8px;display:flex;flex-direction:column;gap:8px;justify-content:space-between}}
.rads,.shds{{display:flex;flex-wrap:wrap;gap:18px}}.rad div{{width:72px;height:72px;background:#dfe3ea}}.rad{{display:flex;flex-direction:column;gap:4px;width:100px}}.shd{{display:flex;flex-direction:column;gap:4px;width:220px}}.shd div{{height:72px;background:#fff;border-radius:8px;margin:10px}}
.cols{{display:grid;grid-template-columns:1fr 1fr;gap:32px}}.muted{{color:var(--muted)}}ul{{margin:0;padding-left:18px}}li{{margin:3px 0}}
@media(max-width:800px){{.shots,.cols,.inner{{grid-template-columns:1fr}}main,header.top,nav.toc{{padding-left:16px;padding-right:16px}}}}
</style></head><body>
<header class="top"><h1>{esc(domain)} — design system attuale</h1><p>{esc(meta.get("title"))}</p><p class="mono">Estratto il {esc(data["fetchedAt"][:10])} · homepage + {len(pages)} pagine interne · desktop 1440px e mobile 390px · valori computati dal browser (non dal sorgente)</p></header>
<nav class="toc"><a href="#shot">Screenshot</a><a href="#logo">Logo</a><a href="#col">Colori</a><a href="#typo">Tipografia</a><a href="#btn">CTA</a><a href="#badge">Badge</a><a href="#card">Card</a><a href="#form">Form</a><a href="#fx">Raggi, ombre, gradienti</a><a href="#layout">Layout</a><a href="#vars">Variabili</a></nav>
<main>
<section id="shot"><h2>Screenshot homepage</h2><div class="shots"><img src="desktop-fold.png"><img src="mobile-fold.png"></div><p class="muted">Pagina intera: <a href="desktop-full.png">desktop</a> · <a href="mobile-full.png">mobile</a></p>
<h3>Pagine interne</h3><div class="inner">{inner}</div>
<h3>Header e footer</h3><img src="header.png" style="width:100%;border:1px solid var(--line)"><br><br><img src="footer.png" style="width:100%;border:1px solid var(--line)"></section>
<section id="logo"><h2>Logo e marchio</h2><div class="logos"><div class="logo-cell" style="background:#fff;border:1px solid var(--line)">{lockup}<small>lockup come appare nell'header</small></div>{logos}<div class="logo-cell"><div style="display:flex;gap:8px">{fav}</div><small>favicon</small></div></div></section>
<section id="col"><h2>Colori</h2>
<h3>Sfondi (peso = area occupata)</h3><div class="sws">{swatches(bg, "area")}</div>
<h3>Testo (peso = caratteri)</h3><div class="sws">{swatches(tx, "testo")}</div>
<h3>Bordi</h3><div class="sws">{swatches(bd, "bordi")}</div>
<h3>Contrasto (WCAG 2.1)</h3><table><tr><th>Primo piano</th><th>Sfondo</th><th>Rapporto</th><th>Esito</th></tr>{contr}</table>
</section>
<section id="typo"><h2>Tipografia</h2>
<p><b>Famiglie usate:</b> {", ".join(f"<code>{esc(f)}</code>" for f in fams)} · <b>Pesi:</b> {", ".join(w for w, _ in weights)} · <b>Dimensioni (px):</b> {" · ".join(f"{x:g}" for x in sizes)}</p>
<p><b>Mobile:</b> {esc(mobs)} · body {esc(mob.get("bodySize","—"))} · <b>Nav:</b> {esc(json.dumps(t.get("nav"), ensure_ascii=False))}</p>
{heads}{para}
{"<h3>Parole in evidenza nei titoli</h3><ul>"+accents+"</ul>" if accents else ""}
<h3>Stili di testo più usati (homepage)</h3><table><tr><th>tag</th><th>font</th><th>size</th><th>peso</th><th>interlinea</th><th>spaziatura</th><th>colore</th><th>case</th><th>car.</th><th>esempio</th></tr>{styles_rows}</table>
</section>
<section id="btn"><h2>Pulsanti e CTA (sul loro sfondo reale)</h2><div class="btns">{btns or "<p class=muted>Nessuno.</p>"}</div></section>
<section id="badge"><h2>Badge ed etichette</h2><div class="btns">{bdg}</div></section>
<section id="card"><h2>Card</h2><div class="cards">{crd}</div></section>
<section id="form"><h2>Campi form</h2><div class="btns">{inp}</div></section>
<section id="fx"><div class="cols"><div><h2>Raggi</h2><div class="rads">{rad}</div></div><div><h2>Ombre</h2><div class="shds">{shd}</div></div></div><h3>Gradienti e texture</h3><div class="shds">{grd}</div></section>
<section id="layout"><h2>Layout, icone, movimento</h2><ul>
<li><b>Container max-width:</b> {esc(", ".join(f"{a} ({b})" for a, b in t["containers"]))}</li>
<li><b>Padding verticale sezioni:</b> {esc(", ".join(f"{a} ({b})" for a, b in t["sectionPadding"]))}</li>
<li><b>Gap flex/grid:</b> {esc(", ".join(f"{a} ({b})" for a, b in t["gaps"]))}</li>
<li><b>Header:</b> altezza {hd.get("h")}px desktop / {mob.get("headerH")}px mobile · posizione {esc(hd.get("position"))} · sfondo {esc(hd.get("bg"))} · backdrop {esc(hd.get("backdrop"))} · bordo {esc(hd.get("borderBottom"))}</li>
<li><b>Footer:</b> sfondo {esc(ft.get("bg"))} · testo {esc(ft.get("color"))}</li>
<li><b>Icone:</b> {ic.get("total")} SVG, di cui {ic.get("lucide")} Lucide · stroke {esc(ic.get("strokeWidth"))} · {esc(", ".join(n.replace("lucide-","") for n in ic.get("names", []) if n!="lucide"))}</li>
<li><b>Transizioni/animazioni:</b> {esc(", ".join(f"{a} ({b})" for a, b in t.get("motion", [])))}</li>
<li><b>Variabili CSS:</b> {t.get("cssVarTotal")} in totale, {len(t["cssVars"])} custom (le default di Tailwind sono escluse)</li>
</ul></section>
<section id="vars"><h2>Variabili CSS custom</h2>{"<table><tr><th>token</th><th>selettore</th><th>valore</th></tr>"+vars_rows+"</table>" if vars_rows else "<p class=muted>Nessuna.</p>"}</section>
</main></body></html>'''

for domain in sorted(os.listdir(root)):
    p = os.path.join(root, domain, 'tokens.json')
    if os.path.exists(p):
        open(os.path.join(root, domain, 'design-system-attuale.html'), 'w').write(build(domain))
        print('board', domain)
