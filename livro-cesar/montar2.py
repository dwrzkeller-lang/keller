# Monta os livrinhos: ilustração recortada (sem o texto embutido) + texto nítido tipografado.
import os, glob, base64, io
from PIL import Image
from textos import LIVROS
D = os.path.dirname(os.path.abspath(__file__))

def img64(path, t, b):
    im = Image.open(path); h = im.height
    im = im.crop((0, int(h * t), im.width, int(h * b)))
    buf = io.BytesIO(); im.save(buf, 'JPEG', quality=93)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()

CSS = """
@page{size:A4;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;font-family:'Nunito',sans-serif;color:#2B2340}
.pg{width:210mm;height:297mm;position:relative;overflow:hidden;break-after:page;background:linear-gradient(#FFF9F0,#FDEFE0)}
.capa{background:linear-gradient(#1B1E4B,#3B3F8C);color:#fff;text-align:center}
.capa .t{padding:16mm 12mm 6mm;font-family:'Fredoka',sans-serif}
.capa .a{font-size:24pt;color:#9FE0FF}.capa h1{font-size:64pt;margin:0;line-height:1;color:#FFE27A;text-shadow:0 0 18px #FFE27A88}
.capa .b{font-size:24pt;font-weight:600}.capa .h{display:inline-block;margin-top:6mm;background:#FFE27A;color:#2B2340;border-radius:30px;padding:2mm 9mm;font:700 18pt 'Fredoka'}
.capa h2{font:700 30pt 'Fredoka';margin:4mm 0 0}
.capa .im{position:absolute;left:12mm;right:12mm;top:108mm;bottom:28mm;border-radius:10mm;overflow:hidden;box-shadow:0 0 40px #9FE0FF66}
.im img{width:100%;height:100%;object-fit:cover;display:block}
.capa .r{position:absolute;bottom:9mm;width:100%;font:600 15pt 'Fredoka'}
.st .im{margin:12mm 12mm 0;height:150mm;border-radius:8mm;overflow:hidden;box-shadow:0 6px 18px #0003}
.st .tx{padding:7mm 18mm 0}
.k{font:600 11pt 'Fredoka';color:#8A6CC8;letter-spacing:2px;text-transform:uppercase}
h3{font:700 25pt 'Fredoka';color:#E07B39;margin:1mm 0 3mm}
p{font-size:15.5pt;line-height:1.48;margin:0 0 3mm}
.q{margin:4mm 0 0;background:#FFF1B8;border-radius:6mm;padding:3mm 6mm;text-align:center;font:600 14.5pt 'Fredoka';color:#6A4BB0}
.n{position:absolute;bottom:7mm;width:100%;text-align:center;font:600 12pt 'Fredoka';color:#B49BE0}
"""
for L in LIVROS:
    fs = sorted(glob.glob(os.path.join(D, 'paginas', L['nome'] + '-*.jpg')))
    t, b, frase = L['capa']
    out = [f"""<section class="pg capa"><div class="t"><div class="a">As Aventuras de</div><h1>César</h1>
<div class="b">e os Dinossauros Brilhantes</div><div class="h">{L['historia']}</div><h2>{L['titulo']}</h2></div>
<div class="im"><img src="{img64(fs[0], t, b)}"></div><div class="r">{frase}</div></section>"""]
    for i, (t, b, tit, ps, q) in enumerate(L['paginas']):
        out.append(f"""<section class="pg st"><div class="im"><img src="{img64(fs[i+1], t, b)}"></div>
<div class="tx"><div class="k">{L['titulo']}</div><h3>{tit}</h3>{''.join(f'<p>{x}</p>' for x in ps)}
{f'<div class="q">“{q}”</div>' if q else ''}</div><div class="n">{i+1}</div></section>""")
    html = f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>{L['titulo']}</title>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>{''.join(out)}</body></html>"""
    open(os.path.join(D, 'html', L['nome'] + '.html'), 'w').write(html)
