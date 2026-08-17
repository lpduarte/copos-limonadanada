// ── Conteúdo e configuração ─────────────────────────────
// Os três blocos de copo são idênticos em estrutura, por isso vivem aqui
// como dados e são construídos pelo engine. Os painéis do eixo horizontal
// (como obter, FAQ) são únicos e estão escritos no index.html.

const COLORS = {
  base:     '#0a5eb5',
  limao:    '#e8b000',
  morango:  '#d94452',
  maracuja: '#6b2fa0'
};

// NOTA: os campos `post` e `body` são placeholders neutros, à espera da
// copy do h3. O nome do sabor e a pílula são conteúdo real.
const PRODUCTS = [
  {
    id: 'limao',
    name: 'LIMÃO',
    color: COLORS.limao,
    img: 'img/limao.webp',
    alt: 'Copo h3 LimonadaNada de Limão',
    pre: 'O COPO',
    post: 'LOREM IPSUM DOLOR',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>Sed do eiusmod tempor incididunt ut labore.',
    pill: '1 copo = 3 pontos'
  },
  {
    id: 'morango',
    name: 'MORANGO',
    color: COLORS.morango,
    img: 'img/morango.webp',
    alt: 'Copo h3 LimonadaNada de Morango',
    pre: 'O COPO',
    post: 'LOREM IPSUM DOLOR',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>Sed do eiusmod tempor incididunt ut labore.',
    pill: '1 copo = 3 pontos'
  },
  {
    id: 'maracuja',
    name: 'MARACUJÁ',
    color: COLORS.maracuja,
    img: 'img/maracuja.webp',
    alt: 'Copo h3 LimonadaNada de Maracujá',
    pre: 'O COPO',
    post: 'LOREM IPSUM DOLOR',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>Sed do eiusmod tempor incididunt ut labore.',
    pill: '1 copo = 3 pontos'
  }
];

// ── Grafo de navegação ──────────────────────────────────
// Eixo vertical: os copos. Eixo horizontal: a informação da campanha.
// O hero é a bifurcação — o único nó com saída nos dois eixos.
//
// O FAQ não é um nó: vive dentro do painel "como obter", em baixo,
// alcançado por scroll normal do conteúdo.
//
//                        hero ──right──▶ comoobter
//                          │                 ⋮ (scroll)
//                        down               FAQ
//                          ▼
//              limao ─▶ morango ─▶ maracuja ──down──▶ hero (loop)

const NAV = {
  hero:      { down: 'limao',    right: 'comoobter' },
  limao:     { down: 'morango',  up: 'hero' },
  morango:   { down: 'maracuja', up: 'limao' },
  maracuja:  { down: 'hero',     up: 'morango' },
  comoobter: {                   left: 'hero' }
};

// Painéis do eixo horizontal, por ordem — define quanto a imagem
// do hero desliza em cada passo.
const PANELS = ['comoobter'];

// Texto dos hints de navegação, por nó e direcção.
// Uma direcção sem texto não mostra hint (mas continua navegável).
// A home não tem hints: sai-se de lá pelos três botões.
const HINTS = {
  hero:      {},
  limao:     { down: 'copo seguinte' },
  morango:   { down: 'copo seguinte' },
  maracuja:  { down: 'voltar ao início' },
  comoobter: {}
};

// Nós onde a navegação por gesto está desligada.
//   hero      — dali partem três caminhos e o gesto não sabe qual
//   comoobter — o gesto pertence ao scroll do conteúdo, não à navegação
const NO_GESTURE = ['hero', 'comoobter'];
