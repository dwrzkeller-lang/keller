# Recorta os painéis das colagens, melhora a resolução e monta um PDF A4 por história.
import sys, os, cv2, numpy as np
from PIL import Image, ImageFilter, ImageDraw

SRC = sys.argv[1]  # pasta com 2.webp, 3.webp, 4.webp
OUT = os.path.dirname(os.path.abspath(__file__))

def cols(xs): return list(zip(xs[:-1], xs[1:]))
LIVROS = {
  '1-O-Planeta-dos-Sonhos': [('3', 0, 346, c) for c in cols([0, 316, 689, 1049, 1536])] +
                            [('3', 350, 670, c) for c in cols([0, 355, 712, 1122])],
  '2-A-Montanha-de-Cristais': [('3', 350, 670, (1122, 1536))] +
                              [('3', 672, 1013, c) for c in cols([0, 252, 491, 722, 951, 1145, 1335, 1536])],
  '3-O-Mapa-das-Estrelas': [('2', 3, 527, c) for c in cols([0, 291, 522, 766, 1024, 1266, 1536])],
  '4-O-Tesouro-do-Fundo-do-Mar': [('4', 0, 501, c) for c in cols([0, 257, 510, 770, 1025, 1278, 1536])],
  '5-A-Missao-nas-Estrelas': [('4', 511, 1014, c) for c in cols([0, 258, 510, 768, 1023, 1277, 1536])],
}

def melhorar(img, alvo_h):
    a = cv2.cvtColor(np.asarray(img), cv2.COLOR_RGB2BGR)
    a = cv2.fastNlMeansDenoisingColored(a, None, 3, 3, 7, 21)
    while a.shape[0] < alvo_h:
        a = cv2.resize(a, None, fx=2, fy=2, interpolation=cv2.INTER_LANCZOS4)
        a = cv2.bilateralFilter(a, 5, 30, 5)
    s = alvo_h / a.shape[0]
    a = cv2.resize(a, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    blur = cv2.GaussianBlur(a, (0, 0), 2.0)
    a = cv2.addWeighted(a, 1.6, blur, -0.6, 0)
    return Image.fromarray(cv2.cvtColor(a, cv2.COLOR_BGR2RGB))

DPI = 300
PW, PH = int(210 / 25.4 * DPI), int(297 / 25.4 * DPI)
M = int(10 / 25.4 * DPI)
fontes = {k: Image.open(os.path.join(SRC, f'{k}.webp')).convert('RGB') for k in '234'}

for nome, paineis in LIVROS.items():
    paginas = []
    for i, (f, y0, y1, (x0, x1)) in enumerate(paineis):
        p = fontes[f].crop((x0 + 3, y0 + 2, x1 - 3, y1 - 2))
        s = min((PW - 2 * M) / p.width, (PH - 2 * M) / p.height)
        w, h = int(p.width * s), int(p.height * s)
        hi = melhorar(p, h).resize((w, h), Image.LANCZOS)
        fundo = p.resize((PW // 8, PH // 8)).filter(ImageFilter.GaussianBlur(6)).resize((PW, PH), Image.BICUBIC)
        fundo = Image.blend(fundo, Image.new('RGB', fundo.size, (255, 255, 255)), 0.35)
        x, y = (PW - w) // 2, (PH - h) // 2
        sombra = Image.new('L', (PW, PH), 0)
        ImageDraw.Draw(sombra).rounded_rectangle((x + 15, y + 25, x + w + 15, y + h + 25), 40, fill=110)
        fundo.paste(Image.new('RGB', (PW, PH), (30, 20, 50)), (0, 0), sombra.filter(ImageFilter.GaussianBlur(30)))
        mask = Image.new('L', (w, h), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), 40, fill=255)
        fundo.paste(hi, (x, y), mask)
        paginas.append(fundo)
        hi.save(os.path.join(OUT, 'paginas', f'{nome}-{i+1:02d}.jpg'), quality=92)
    paginas[0].save(os.path.join(OUT, f'{nome}.pdf'), save_all=True, append_images=paginas[1:], resolution=DPI, quality=92)
    print(nome, len(paginas))
