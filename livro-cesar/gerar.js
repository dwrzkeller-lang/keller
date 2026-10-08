// Gera o livrinho "César e os Dinossauros Brilhantes" (HTML com ilustrações SVG) pronto para impressão.
const fs = require('fs');
const path = require('path');

const DINOS = {
  laranja: { body: '#F4A259', belly: '#FCE3B8', spike: '#E07B39', glow: '#FFC46B' },
  rosa:    { body: '#F28FB0', belly: '#FDE0EA', spike: '#D9668E', glow: '#FFB3D1' },
  verde:   { body: '#8CCB6E', belly: '#E4F5C8', spike: '#5FA348', glow: '#B8FF8C' },
  azul:    { body: '#7FB2E5', belly: '#DDEEFC', spike: '#4F86C6', glow: '#9FE0FF' },
  roxo:    { body: '#B49BE0', belly: '#EEE6FB', spike: '#8A6CC8', glow: '#D9C2FF' },
  dourado: { body: '#F7D35C', belly: '#FFF5CC', spike: '#E3A92B', glow: '#FFF09A' },
};

const defs = `
<defs>
  <filter id="brilho" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="22" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="suave"><feGaussianBlur stdDeviation="3"/></filter>
  <radialGradient id="luz" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#fff" stop-opacity=".9"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="ceuNoite" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1B1E4B"/><stop offset="1" stop-color="#3B3F8C"/>
  </linearGradient>
  <linearGradient id="quartoNoite" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2E3470"/><stop offset="1" stop-color="#4A4F94"/>
  </linearGradient>
  <linearGradient id="floresta" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#16284A"/><stop offset=".6" stop-color="#1F4A5A"/><stop offset="1" stop-color="#2E6B5A"/>
  </linearGradient>
  <linearGradient id="amanhecer" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFD9A8"/><stop offset=".5" stop-color="#FFE9D0"/><stop offset="1" stop-color="#FFF6EA"/>
  </linearGradient>
</defs>`;

// Dinossaurinho fofo e brilhante. (x,y) = base; s = escala; flip = olhando para a esquerda
function dino(cor, x, y, s = 1, { flip = false, brilha = true, feliz = true } = {}) {
  const c = DINOS[cor];
  const spots = [[-10, -60], [8, -78], [22, -50], [-24, -40]]
    .map(([a, b]) => `<circle cx="${a}" cy="${b}" r="4" fill="${c.spike}" opacity=".55"/>`).join('');
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
    ${brilha ? `<ellipse cx="0" cy="-60" rx="95" ry="85" fill="${c.glow}" opacity=".55" filter="url(#brilho)"/>` : ''}
    <ellipse cx="0" cy="2" rx="55" ry="9" fill="#000" opacity=".15"/>
    <!-- cauda -->
    <path d="M-30 -20 Q-90 -10 -105 -45 Q-70 -25 -35 -45 Z" fill="${c.body}"/>
    <!-- espinhos -->
    ${[[-28,-95],[-8,-112],[14,-118],[36,-112]].map(([a,b])=>`<path d="M${a-10} ${b+12} L${a} ${b-8} L${a+10} ${b+12} Z" fill="${c.spike}"/>`).join('')}
    <path d="M-78 -32 l-6 -14 l12 6 z M-58 -28 l-4 -14 l11 7z" fill="${c.spike}"/>
    <!-- corpo -->
    <ellipse cx="0" cy="-45" rx="45" ry="48" fill="${c.body}"/>
    <ellipse cx="6" cy="-38" rx="27" ry="34" fill="${c.belly}"/>
    <!-- cabeça -->
    <ellipse cx="22" cy="-108" rx="44" ry="36" fill="${c.body}"/>
    <ellipse cx="44" cy="-96" rx="22" ry="16" fill="${c.belly}" opacity=".7"/>
    ${spots}
    <!-- olhos -->
    <ellipse cx="18" cy="-116" rx="8" ry="10" fill="#2B2340"/>
    <ellipse cx="44" cy="-116" rx="8" ry="10" fill="#2B2340"/>
    <circle cx="21" cy="-120" r="3.2" fill="#fff"/><circle cx="47" cy="-120" r="3.2" fill="#fff"/>
    <!-- bochechas -->
    <ellipse cx="8" cy="-98" rx="7" ry="4.5" fill="#FF7FA0" opacity=".55"/>
    <ellipse cx="58" cy="-98" rx="7" ry="4.5" fill="#FF7FA0" opacity=".55"/>
    <!-- boca -->
    ${feliz ? `<path d="M22 -98 Q33 -84 44 -98" stroke="#2B2340" stroke-width="3" fill="#FF8FA3" stroke-linecap="round"/>`
            : `<path d="M24 -94 Q33 -100 42 -94" stroke="#2B2340" stroke-width="3" fill="none" stroke-linecap="round"/>`}
    <!-- bracinhos e pés -->
    <ellipse cx="38" cy="-58" rx="9" ry="14" fill="${c.body}" transform="rotate(-30 38 -58)"/>
    <ellipse cx="-30" cy="-58" rx="9" ry="14" fill="${c.body}" transform="rotate(30 -30 -58)"/>
    <ellipse cx="-20" cy="-4" rx="18" ry="11" fill="${c.body}"/>
    <ellipse cx="24" cy="-4" rx="18" ry="11" fill="${c.body}"/>
    <!-- brilhinhos -->
    ${brilha ? `<g fill="#fff">${estrelinha(-50,-140,5)}${estrelinha(70,-150,4)}${estrelinha(80,-40,3.5)}</g>` : ''}
  </g>`;
}

function estrelinha(x, y, r) {
  return `<path d="M${x} ${y - r * 2.2} Q${x} ${y} ${x + r * 2.2} ${y} Q${x} ${y} ${x} ${y + r * 2.2} Q${x} ${y} ${x - r * 2.2} ${y} Q${x} ${y} ${x} ${y - r * 2.2}Z"/>`;
}

// César: cabelo cacheado loiro, sardinhas, pijama azul-marinho com dinossauros
function cesar(x, y, s = 1, { pose = 'sentado', bracos = 'baixo' } = {}) {
  const cachos = [];
  const pts = [[-52,-150],[-38,-170],[-16,-182],[8,-186],[32,-180],[52,-166],[62,-146],[-60,-128],[64,-124],[-56,-108],[60,-104],[-20,-168],[20,-172]];
  pts.forEach(([a, b]) => cachos.push(`<circle cx="${a}" cy="${b}" r="20" fill="#E9BE5B"/><path d="M${a-10} ${b} q10 -14 20 0" stroke="#C9973A" stroke-width="3" fill="none"/>`));
  const sardas = [[-24,-108],[-18,-102],[-30,-101],[22,-108],[28,-102],[16,-101],[0,-112]]
    .map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1.8" fill="#C77B4E" opacity=".7"/>`).join('');
  const pijamaDinos = [[-28,-40],[22,-20],[-10,0]]
    .map(([a,b]) => `<g transform="translate(${a} ${b}) scale(.18)" opacity=".85">${dino('verde',0,0,1,{brilha:false})}</g>`).join('');
  const luas = [[30,-50],[-40,-5],[5,-62]].map(([a,b])=>`<path d="M${a} ${b} a7 7 0 1 0 7 9 a6 6 0 1 1 -7 -9z" fill="#F7D35C"/>`).join('');
  const bracoL = bracos === 'cima'
    ? `<path d="M-38 -55 Q-75 -100 -70 -140" stroke="#26315E" stroke-width="22" stroke-linecap="round" fill="none"/><circle cx="-70" cy="-145" r="13" fill="#F9D2B4"/>`
    : `<path d="M-38 -55 Q-62 -20 -40 5" stroke="#26315E" stroke-width="22" stroke-linecap="round" fill="none"/><circle cx="-36" cy="10" r="13" fill="#F9D2B4"/>`;
  const bracoR = bracos === 'cima'
    ? `<path d="M38 -55 Q75 -100 70 -140" stroke="#26315E" stroke-width="22" stroke-linecap="round" fill="none"/><circle cx="70" cy="-145" r="13" fill="#F9D2B4"/>`
    : `<path d="M38 -55 Q62 -20 40 5" stroke="#26315E" stroke-width="22" stroke-linecap="round" fill="none"/><circle cx="36" cy="10" r="13" fill="#F9D2B4"/>`;
  const pernas = pose === 'sentado'
    ? `<ellipse cx="0" cy="38" rx="78" ry="26" fill="#26315E"/><ellipse cx="-62" cy="46" rx="16" ry="11" fill="#F9D2B4"/><ellipse cx="62" cy="46" rx="16" ry="11" fill="#F9D2B4"/>`
    : `<rect x="-34" y="10" width="28" height="70" rx="12" fill="#26315E"/><rect x="6" y="10" width="28" height="70" rx="12" fill="#26315E"/><ellipse cx="-22" cy="84" rx="18" ry="10" fill="#F9D2B4"/><ellipse cx="22" cy="84" rx="18" ry="10" fill="#F9D2B4"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="${pose === 'sentado' ? 60 : 92}" rx="85" ry="12" fill="#000" opacity=".15"/>
    ${pernas}
    <path d="M-48 -62 Q0 -80 48 -62 L56 30 Q0 44 -56 30 Z" fill="#26315E"/>
    ${pijamaDinos}${luas}
    ${bracoL}${bracoR}
    <!-- cabeça -->
    ${cachos.slice(7).join('')}
    <ellipse cx="0" cy="-118" rx="56" ry="54" fill="#F9D2B4"/>
    <ellipse cx="-56" cy="-112" rx="10" ry="14" fill="#F4BFA0"/><ellipse cx="56" cy="-112" rx="10" ry="14" fill="#F4BFA0"/>
    ${cachos.slice(0, 7).join('')}
    <ellipse cx="-20" cy="-124" rx="9" ry="11" fill="#3A2A1E"/><ellipse cx="20" cy="-124" rx="9" ry="11" fill="#3A2A1E"/>
    <circle cx="-17" cy="-128" r="3.5" fill="#fff"/><circle cx="23" cy="-128" r="3.5" fill="#fff"/>
    <path d="M-30 -140 q8 -6 16 -2 M14 -142 q8 -4 16 2" stroke="#C9973A" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="0" cy="-110" rx="5" ry="4" fill="#EBA88A"/>
    <ellipse cx="-34" cy="-100" rx="10" ry="6" fill="#FF9AA8" opacity=".55"/><ellipse cx="34" cy="-100" rx="10" ry="6" fill="#FF9AA8" opacity=".55"/>
    ${sardas}
    <path d="M-20 -94 Q0 -70 20 -94 Z" fill="#B5444F"/><path d="M-14 -93 Q0 -88 14 -93 L12 -90 Q0 -86 -12 -90Z" fill="#fff"/>
  </g>`;
}

function ceuEstrelado(w, h, n = 60, seed = 1) {
  let r = seed; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = rnd() * w, y = rnd() * h, k = 1 + rnd() * 3;
    out += rnd() > .8 ? `<g fill="#FFF6C8">${estrelinha(x, y, k)}</g>` : `<circle cx="${x}" cy="${y}" r="${k * .6}" fill="#fff" opacity="${.5 + rnd() * .5}"/>`;
  }
  return out;
}

function blocos(x, y, s = 1, torre = false) {
  const cores = ['#E86A5C', '#F7D35C', '#6FA8DC', '#7CC47C', '#C9A27A'];
  let out = '';
  if (torre) {
    for (let i = 0; i < 6; i++) out += `<rect x="${-22 + (i % 2) * 4}" y="${-44 * (i + 1)}" width="44" height="44" rx="4" fill="${cores[i % 5]}" stroke="#00000022" stroke-width="2"/>`;
    out += `<path d="M-30 -264 L0 -310 L30 -264Z" fill="#E86A5C"/>`;
    out += `<circle cx="0" cy="-288" r="70" fill="#FFF3A0" opacity=".55" filter="url(#brilho)"/><g fill="#fff">${estrelinha(0,-290,9)}</g>`;
  } else {
    [[-60, 0], [-10, 0], [40, 0], [-35, -44], [15, -44], [-10, -88]].forEach(([a, b], i) =>
      out += `<rect x="${a}" y="${b - 44}" width="44" height="44" rx="4" fill="${cores[i % 5]}" stroke="#00000022" stroke-width="2"/>`);
    out += `<path d="M-14 -132 L12 -170 L38 -132Z" fill="#E86A5C"/>`;
  }
  return `<g transform="translate(${x} ${y}) scale(${s})">${out}</g>`;
}

function arvoreCristal(x, y, s, cor) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-8" y="-120" width="16" height="120" fill="#3D2E4F"/>
    <ellipse cx="0" cy="-170" rx="70" ry="80" fill="${cor}" opacity=".4" filter="url(#brilho)"/>
    <path d="M0 -260 L50 -170 L28 -110 L-28 -110 L-50 -170Z" fill="${cor}" opacity=".85"/>
    <path d="M0 -260 L18 -170 L0 -110 L-18 -170Z" fill="#fff" opacity=".35"/>
  </g>`;
}

function cogumelo(x, y, s, cor) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <circle cx="0" cy="-30" r="40" fill="${cor}" opacity=".5" filter="url(#brilho)"/>
    <rect x="-7" y="-28" width="14" height="28" rx="6" fill="#FFF2DC"/>
    <path d="M-30 -26 Q0 -70 30 -26Z" fill="${cor}"/>
    <circle cx="-10" cy="-38" r="4" fill="#fff" opacity=".8"/><circle cx="10" cy="-44" r="3" fill="#fff" opacity=".8"/>
  </g>`;
}

function quartoNoite(W, H) {
  return `<rect width="${W}" height="${H}" fill="url(#quartoNoite)"/>
    <!-- janela -->
    <rect x="${W/2-170}" y="60" width="340" height="300" rx="10" fill="url(#ceuNoite)" stroke="#E8DCC8" stroke-width="14"/>
    <g clip-path="inset(0)">${ceuEstrelado(W, 330, 25, 7).replace(/cx="([\d.]+)" cy="([\d.]+)"/g, (m, a, b) => `cx="${W/2-160 + (+a % 320)}" cy="${70 + (+b % 280)}"`)}</g>
    <path d="M${W/2+80} 110 a34 34 0 1 0 34 44 a28 28 0 1 1 -34 -44z" fill="#FFF3B0"/>
    <line x1="${W/2}" y1="60" x2="${W/2}" y2="360" stroke="#E8DCC8" stroke-width="10"/>
    <path d="M${W/2-220} 40 Q${W/2-190} 220 ${W/2-210} 400 L${W/2-160} 400 Q${W/2-150} 220 ${W/2-170} 40Z" fill="#7C93C8"/>
    <path d="M${W/2+220} 40 Q${W/2+190} 220 ${W/2+210} 400 L${W/2+160} 400 Q${W/2+150} 220 ${W/2+170} 40Z" fill="#7C93C8"/>
    <rect x="${W/2-240}" y="32" width="480" height="10" rx="5" fill="#B08968"/>
    <!-- prateleira -->
    <rect x="40" y="250" width="180" height="12" rx="4" fill="#B08968"/>
    <rect x="60" y="190" width="30" height="60" fill="#E86A5C"/><rect x="94" y="200" width="26" height="50" fill="#6FA8DC"/>
    <g transform="translate(170 250) scale(.35)">${dino('roxo',0,0,1,{brilha:false})}</g>
    <!-- quadro -->
    <rect x="${W-200}" y="160" width="130" height="110" rx="6" fill="#F6EBDD" stroke="#B08968" stroke-width="8"/>
    <g transform="translate(${W-135} 255) scale(.4)">${dino('azul',0,0,1,{brilha:false})}</g>
    <!-- chão e tapete -->
    <rect y="${H*0.62}" width="${W}" height="${H*0.38}" fill="#5A4E7A"/>
    <ellipse cx="${W/2}" cy="${H*0.82}" rx="${W*0.46}" ry="${H*0.15}" fill="#8E86B8"/>
    <ellipse cx="${W/2}" cy="${H*0.82}" rx="${W*0.40}" ry="${H*0.12}" fill="none" stroke="#B3ABD8" stroke-width="6" stroke-dasharray="4 14"/>`;
}

function svg(W, H, inner) {
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${defs}${inner}</svg>`;
}

const W = 1000, H = 760;

const cenas = {
  capa: svg(W, 1000, `
    <rect width="${W}" height="1000" fill="url(#ceuNoite)"/>${ceuEstrelado(W, 1000, 140, 3)}
    <path d="M820 140 a60 60 0 1 0 60 78 a50 50 0 1 1 -60 -78z" fill="#FFF3B0"/>
    <ellipse cx="500" cy="960" rx="700" ry="220" fill="#2E6B5A"/>
    ${arvoreCristal(110, 860, .9, '#9FE0FF')}${arvoreCristal(900, 870, .8, '#FFB3D1')}
    ${dino('roxo', 230, 640, 1.0)}${dino('laranja', 180, 870, 1.15)}${dino('azul', 800, 880, 1.15, { flip: true })}
    ${dino('verde', 790, 650, 1.0, { flip: true })}${dino("rosa", 620, 990, .7)}
    ${cesar(500, 820, 1.55, { bracos: 'cima' })}`),

  h1p1a: svg(W, H, `${quartoNoite(W, H)}
    <rect x="0" y="0" width="${W}" height="${H}" fill="#0B0C2A" opacity=".25"/>
    ${blocos(500, 640, 1)}
    ${dino('laranja', 170, 600, .95, { brilha: false })}${dino('rosa', 220, 720, .85, { brilha: false })}
    ${dino('verde', 830, 610, .95, { flip: true, brilha: false })}${dino('azul', 790, 730, .85, { flip: true, brilha: false })}
    ${cesar(500, 560, 1.05)}
    <rect x="${W/2-160}" y="70" width="320" height="280" fill="#000" opacity="0"/>`),

  h1p1b: svg(W, H, `${quartoNoite(W, H)}
    <rect width="${W}" height="${H}" fill="#0B0C2A" opacity=".35"/>
    ${dino('laranja', 180, 600, 1.0)}${dino('rosa', 260, 730, .9)}
    ${dino('verde', 820, 610, 1.0, { flip: true })}${dino('azul', 760, 735, .9, { flip: true })}
    ${dino('roxo', 690, 470, .7, { flip: true })}
    ${cesar(500, 600, 1.1, { bracos: 'cima' })}
    <g fill="#FFF6C8">${estrelinha(400,260,8)}${estrelinha(620,300,6)}${estrelinha(320,420,5)}${estrelinha(700,200,7)}</g>`),

  h1p2a: svg(W, H, `<rect width="${W}" height="${H}" fill="url(#ceuNoite)"/>${ceuEstrelado(W, H, 90, 11)}
    <ellipse cx="500" cy="${H+40}" rx="700" ry="220" fill="#3B3F6E"/>
    <g transform="translate(860 150) scale(.45)">${dino('dourado', 0, 0, 1, { feliz: false })}</g>
    <path d="M820 130 q-10 -20 6 -26" stroke="#9FE0FF" stroke-width="4" fill="none"/>
    <text x="905" y="85" font-size="40" fill="#fff" font-family="Fredoka, sans-serif">?</text>
    ${blocos(500, 660, 1.05, true)}
    ${cesar(320, 640, 1.0, { pose: 'em pe', bracos: 'cima' })}
    ${dino('verde', 690, 690, .9, { flip: true })}${dino('azul', 140, 720, .8)}${dino('rosa', 850, 730, .75, { flip: true })}`),

  h1p2b: svg(W, H, `<rect width="${W}" height="${H}" fill="url(#ceuNoite)"/>${ceuEstrelado(W, H, 120, 19)}
    <path d="M140 140 a50 50 0 1 0 50 66 a42 42 0 1 1 -50 -66z" fill="#FFF3B0"/>
    <ellipse cx="500" cy="${H+40}" rx="700" ry="220" fill="#3B3F6E"/>
    ${dino('dourado', 560, 700, 1.0, { flip: true })}${dino('dourado', 700, 680, 1.35, { flip: true })}
    ${cesar(330, 680, 1.05)}
    ${dino('laranja', 120, 720, .75)}${dino('roxo', 880, 740, .7, { flip: true })}
    <path d="M330 470 q30 -40 60 0 q30 -40 60 0 q-60 70 -60 70 q0 0 -60 -70z" fill="#FF8FA3" opacity=".9" transform="translate(70 -30) scale(.7)"/>`),

  h2p1a: svg(W, H, `<rect width="${W}" height="${H}" fill="url(#floresta)"/>${ceuEstrelado(W, 330, 70, 23)}
    ${arvoreCristal(90, 640, 1.1, '#9FE0FF')}${arvoreCristal(260, 560, .8, '#D9C2FF')}${arvoreCristal(760, 570, .85, '#FFB3D1')}${arvoreCristal(920, 650, 1.1, '#B8FF8C')}
    <path d="M0 ${H} Q300 560 500 600 T${W} 580 L${W} ${H}Z" fill="#244E44"/>
    <path d="M380 ${H} Q480 640 520 600" stroke="#F7D35C" stroke-width="40" fill="none" opacity=".35" stroke-linecap="round"/>
    ${cogumelo(180, 720, 1, '#FFC46B')}${cogumelo(840, 730, 1.2, '#9FE0FF')}${cogumelo(640, 740, .8, '#FFB3D1')}
    ${dino('verde', 650, 700, 1.15, { flip: true })}
    ${cesar(440, 640, .85, { bracos: 'baixo' })}
    ${dino('azul', 300, 730, .8)}`),

  h2p1b: svg(W, H, `<rect width="${W}" height="${H}" fill="url(#floresta)"/>${ceuEstrelado(W, 360, 80, 29)}
    <rect y="470" width="${W}" height="${H-470}" fill="#1D5770"/>
    <g opacity=".5">${ceuEstrelado(W, 200, 40, 31).replace(/cy="([\d.]+)"/g, (m, b) => `cy="${490 + +b}"`)}</g>
    ${arvoreCristal(80, 480, .9, '#D9C2FF')}${arvoreCristal(930, 480, .9, '#9FE0FF')}
    ${[200,330,460,590,720,850].map((x,i)=>`<ellipse cx="${x}" cy="${620 + (i%2)*30}" rx="55" ry="18" fill="#7FA3B8"/><ellipse cx="${x}" cy="${612 + (i%2)*30}" rx="46" ry="10" fill="#B8D4E0"/>`).join('')}
    ${dino('roxo', 330, 615, .75)}${cesar(460, 590, .7, { pose: 'em pe', bracos: 'cima' })}${dino('laranja', 590, 615, .75, { flip: true })}
    <g fill="#FFF6C8">${[[150,520],[400,700],[700,690],[880,560]].map(([a,b])=>estrelinha(a,b,5)).join('')}</g>`),

  h2p2a: svg(W, H, `<rect width="${W}" height="${H}" fill="url(#floresta)"/>${ceuEstrelado(W, 380, 100, 37)}
    ${arvoreCristal(120, 600, 1, '#FFB3D1')}${arvoreCristal(880, 600, 1, '#B8FF8C')}
    <ellipse cx="500" cy="${H}" rx="650" ry="200" fill="#244E44"/>
    <ellipse cx="500" cy="620" rx="150" ry="40" fill="#5C4A3A"/>
    <ellipse cx="500" cy="560" rx="160" ry="160" fill="#FFF09A" opacity=".55" filter="url(#brilho)"/>
    <ellipse cx="500" cy="545" rx="70" ry="88" fill="#FFF8E1"/>
    ${[[480,520],[520,560],[470,580],[530,505]].map(([a,b])=>`<g fill="#F7D35C">${estrelinha(a,b,5)}</g>`).join('')}
    <path d="M460 520 l14 14 l-10 12 l16 10" stroke="#C9A24A" stroke-width="3" fill="none"/>
    ${cesar(270, 660, .95)}
    ${dino('verde', 730, 680, .85, { flip: true })}${dino('rosa', 860, 740, .7, { flip: true })}${dino('azul', 120, 745, .7)}`),

  h2p2b: svg(W, H, `<rect width="${W}" height="${H}" fill="url(#quartoNoite)"/>
    ${quartoNoite(W, H)}
    <rect width="${W}" height="${H}" fill="#0B0C2A" opacity=".3"/>
    <!-- cama -->
    <rect x="250" y="440" width="500" height="200" rx="30" fill="#B08968"/>
    <rect x="270" y="420" width="460" height="150" rx="30" fill="#DDE6F7"/>
    <path d="M300 470 Q500 430 720 470 L720 570 L280 570Z" fill="#7C93C8"/>
    <g fill="#F7D35C">${[[360,520],[460,500],[560,530],[660,505]].map(([a,b])=>estrelinha(a,b,6)).join('')}</g>
    <ellipse cx="350" cy="440" rx="70" ry="34" fill="#fff"/>
    <g transform="translate(350 520) scale(.62)">
      ${Array.from({length:9},(_, i)=>`<circle cx="${-50 + i*12}" cy="${-160 - Math.sin(i/8*Math.PI)*24}" r="20" fill="#E9BE5B"/>`).join('')}
      <ellipse cx="0" cy="-118" rx="56" ry="54" fill="#F9D2B4"/>
      <path d="M-30 -122 q10 8 20 0 M10 -122 q10 8 20 0" stroke="#3A2A1E" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="-34" cy="-100" rx="10" ry="6" fill="#FF9AA8" opacity=".55"/><ellipse cx="34" cy="-100" rx="10" ry="6" fill="#FF9AA8" opacity=".55"/>
      <path d="M-10 -96 Q0 -88 10 -96" stroke="#B5444F" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>
    <g transform="translate(460 480) scale(.45)">${dino('dourado', 0, 0, 1)}</g>
    ${dino('laranja', 150, 720, .7)}${dino('azul', 860, 720, .7, { flip: true })}${dino('verde', 230, 650, .55, { brilha: true })}${dino('rosa', 780, 650, .55, { flip: true })}
    <text x="440" y="400" font-size="34" fill="#fff" font-family="Fredoka, sans-serif" opacity=".85">z z z</text>`),
};

const paginas = [
  { tipo: 'capa' },
  { tipo: 'abertura', titulo: 'História 1', sub: 'A Torre de Luz' },
  { cena: 'h1p1a', parte: 'História 1 · Parte 1', titulo: 'Quando a lua acendeu',
    texto: [
      'Era uma vez um menino chamado <b>César</b>, de cabelinho cacheado cor de mel e sardinhas que pareciam estrelinhas no nariz.',
      'Naquela noite, vestido com seu pijama de dinossauros, César brincava no tapete com seus amigos favoritos: <b>Tito</b>, o laranja; <b>Bia</b>, a rosa; <b>Lelo</b>, o verde; e <b>Nino</b>, o azul.',
      'Ele empilhava bloquinhos coloridos, um em cima do outro: <i>vermelho, amarelo, azul…</i>',
    ] },
  { cena: 'h1p1b', parte: 'História 1 · Parte 1', titulo: '',
    texto: [
      'De repente, a lua espiou pela janela e — <b>plim!</b> — um raio prateado tocou os dinossauros.',
      'Tito piscou. Bia balançou o rabinho. E todos começaram a <b>brilhar</b>, como vaga-lumes gigantes e fofinhos!',
      '— Oi, César! — disse Lelo, com uma vozinha de gelatina. — Nós somos os <b>Dinossauros Brilhantes</b>. Só acordamos quando alguém brinca com muito carinho.',
      'César abriu um sorrisão do tamanho da lua. <i>Que noite mágica ia ser!</i>',
    ] },
  { cena: 'h1p2a', parte: 'História 1 · Parte 2', titulo: 'O dinossaurinho perdido',
    texto: [
      'Lá longe, no céu, uma luzinha dourada piscava triste. Era <b>Lumi</b>, um dinossaurinho que tinha se perdido entre as nuvens.',
      '— Ele não acha o caminho de casa! — disse Nino.',
      'César teve uma ideia: <b>— Vamos construir uma torre de luz!</b>',
      'Bloco por bloco, bem alto, bem alto… E no topo, os amigos sopraram todo o seu brilho. A torre virou um farol cheio de estrelas!',
    ] },
  { cena: 'h1p2b', parte: 'História 1 · Parte 2', titulo: '',
    texto: [
      'Lumi viu a luz e voou, voou, voou… até pousar no tapete, bem pertinho do César.',
      'Logo depois chegou a <b>mamãe Lumi</b>, brilhando de alegria, e deu um abraço quentinho no filhote.',
      '— Obrigada, César! Você tem um coração que brilha mais que qualquer estrela.',
      'César ficou vermelhinho — e feliz, muito feliz.',
      '<span class="fim">✦ Fim da primeira história ✦</span>',
    ] },
  { tipo: 'abertura', titulo: 'História 2', sub: 'O Ovo de Estrela' },
  { cena: 'h2p1a', parte: 'História 2 · Parte 1', titulo: 'A Floresta Cintilante',
    texto: [
      'Na noite seguinte, Lelo bateu na janela: <i>toc, toc, toc</i>.',
      '— César, quer conhecer onde moramos? Suba nas minhas costas!',
      'E lá foram eles, pulando por cima das nuvens, até a <b>Floresta Cintilante</b> — onde as árvores são de cristal e os cogumelos acendem feito lanterninhas.',
      'Tudo brilhava em rosa, azul, verde e dourado. César nunca tinha visto nada tão bonito!',
    ] },
  { cena: 'h2p1b', parte: 'História 2 · Parte 1', titulo: '',
    texto: [
      'Para chegar ao coração da floresta, era preciso atravessar o <b>Rio das Estrelas</b>.',
      'César segurou firme a patinha de Tito e a de Bia (a roxa Mel também veio ajudar!).',
      '— Um, dois, três… <b>pula!</b>',
      'De pedra em pedra, plic, ploc, plic — e as estrelinhas do rio faziam cócegas nos pés. César riu tanto que até os peixinhos brilharam!',
    ] },
  { cena: 'h2p2a', parte: 'História 2 · Parte 2', titulo: 'O ovo que brilhava',
    texto: [
      'No meio da floresta, num ninho macio, havia um <b>ovo enorme, todo pintado de estrelas</b>.',
      '— Ele precisa ouvir uma canção de amizade para nascer — sussurrou Bia.',
      'Então César cantou, baixinho: <i>“Brilha, brilha, amiguinho, você nunca está sozinho…”</i>',
      'O ovo tremeu… <b>crec… crec… CRAC!</b>',
    ] },
  { cena: 'h2p2b', parte: 'História 2 · Parte 2', titulo: '',
    texto: [
      'De dentro saiu uma dinossaurinha dourada, que espirrou purpurina: <i>atchim!</i> César deu a ela o nome de <b>Estrelinha</b>.',
      'Estrelinha quis ir junto para casa. E, quando César se deitou, ela se aninhou ao lado dele, brilhando bem fraquinho, como uma luz de dormir.',
      'Os amigos cochicharam: — Boa noite, César. Amanhã tem mais aventura!',
      'E César sonhou com estrelas, cristais e dinossauros brilhantes.',
      '<span class="fim">✦ Fim ✦</span>',
    ] },
  { tipo: 'final' },
];

function pagina(p, i) {
  if (p.tipo === 'capa') return `<section class="pg capa">${cenas.capa}
    <div class="capa-titulo"><div class="pre">As aventuras de</div><h1>César</h1><div class="sub">e os Dinossauros Brilhantes</div></div>
    <div class="capa-rodape">Duas histórias para ler antes de dormir</div></section>`;
  if (p.tipo === 'abertura') return `<section class="pg abertura"><div class="estrelas">${svg(W, 1400, `<rect width="${W}" height="1400" fill="url(#ceuNoite)"/>${ceuEstrelado(W, 1400, 160, i * 13)}`)}</div>
    <div class="ab-txt"><div class="pre">${p.titulo}</div><h2>${p.sub}</h2>
    <div class="ab-dinos">${svg(600, 260, `${dino('laranja',100,240,.9)}${dino('verde',300,240,1.1)}${dino('azul',500,240,.9,{flip:true})}`)}</div></div></section>`;
  if (p.tipo === 'final') return `<section class="pg abertura"><div class="estrelas">${svg(W, 1400, `<rect width="${W}" height="1400" fill="url(#ceuNoite)"/>${ceuEstrelado(W, 1400, 160, 99)}`)}</div>
    <div class="ab-txt"><h2>Este livro pertence a</h2><div class="linha"></div>
    <p class="dedic">Para o César, que faz qualquer noite brilhar. ✦</p>
    <div class="ab-dinos">${svg(600, 260, `${dino('rosa',120,240,.9)}${dino('dourado',300,240,1)}${dino('roxo',480,240,.9,{flip:true})}`)}</div></div></section>`;
  return `<section class="pg historia"><div class="ilustra">${cenas[p.cena]}</div>
    <div class="texto"><div class="parte">${p.parte}</div>${p.titulo ? `<h3>${p.titulo}</h3>` : ''}
    ${p.texto.map(t => `<p>${t}</p>`).join('')}<div class="num">${i}</div></div></section>`;
}

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>César e os Dinossauros Brilhantes</title>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@500;700;800&display=swap" rel="stylesheet">
<style>
@page { size: A4; margin: 0; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; background: #ddd; font-family: 'Nunito', sans-serif; color: #2B2340; }
.pg { width: 210mm; height: 297mm; position: relative; overflow: hidden; page-break-after: always; break-after: page; background: #FFF9F0; margin: 0 auto; }
@media screen { .pg { margin: 10mm auto; box-shadow: 0 4px 20px #0003; } }
.ab-dinos svg { overflow: visible; }
.pg > svg, .estrelas svg, .ilustra svg { display: block; width: 100%; height: 100%; }
.capa > svg { position: absolute; inset: 0; }
.capa-titulo { position: absolute; top: 14mm; left: 0; right: 0; text-align: center; color: #fff; font-family: 'Fredoka', sans-serif; text-shadow: 0 0 18px #9FE0FF, 0 3px 0 #1B1E4B; }
.capa-titulo .pre { font-size: 22pt; letter-spacing: 1px; }
.capa-titulo h1 { font-size: 78pt; margin: 0; line-height: 1; color: #FFF09A; }
.capa-titulo .sub { font-size: 28pt; font-weight: 600; }
.capa-rodape { position: absolute; bottom: 8mm; width: 100%; text-align: center; color: #fff; font: 600 14pt 'Fredoka', sans-serif; text-shadow: 0 2px 4px #0008; }
.abertura .estrelas { position: absolute; inset: 0; }
.ab-txt { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #fff; font-family: 'Fredoka', sans-serif; text-align: center; padding: 20mm; }
.ab-txt .pre { font-size: 24pt; color: #9FE0FF; }
.ab-txt h2 { font-size: 48pt; margin: 4mm 0 10mm; color: #FFF09A; text-shadow: 0 0 20px #FFF09A88; }
.ab-dinos { width: 150mm; height: 65mm; }
.linha { width: 120mm; border-bottom: 2px dashed #fff; height: 14mm; margin-bottom: 14mm; }
.dedic { font-size: 18pt; font-family: 'Nunito'; font-weight: 700; }
.historia .ilustra { height: 165mm; border-bottom: 6px solid #F7D35C; }
.texto { padding: 9mm 16mm 0; position: absolute; top: 165mm; bottom: 0; left: 0; right: 0; }
.parte { font: 600 11pt 'Fredoka', sans-serif; color: #8A6CC8; text-transform: uppercase; letter-spacing: 2px; }
h3 { font: 700 24pt 'Fredoka', sans-serif; color: #E07B39; margin: 1mm 0 3mm; }
.texto p { font-size: 14.5pt; line-height: 1.5; margin: 0 0 3mm; }
.texto b { color: #4F86C6; }
.fim { display: block; text-align: center; font: 700 16pt 'Fredoka', sans-serif; color: #D9668E; margin-top: 4mm; }
.num { position: absolute; bottom: 7mm; left: 0; right: 0; text-align: center; font: 600 12pt 'Fredoka'; color: #B49BE0; }
</style></head><body>
${paginas.map(pagina).join('\n')}
</body></html>`;

fs.writeFileSync(path.join(__dirname, 'livro.html'), html);
console.log('ok');
