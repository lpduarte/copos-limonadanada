// ── Conteúdo e configuração ─────────────────────────────
// Os três blocos de copo são idênticos em estrutura, por isso vivem aqui
// como dados e são construídos pelo engine. Os painéis do eixo horizontal
// (como funciona, FAQ) são únicos e estão escritos no index.html.

const COLORS = {
  base:     '#0a5eb5',
  limao:    '#e8b000',
  morango:  '#d94452',
  maracuja: '#6b2fa0'
};

// Link para a landing page das LimonadaNada (CTA da bifurcação).
// Substituir pelo URL final antes de publicar — ver notas_integracao.md
const LIMONADAS_URL = 'https://www.h3.com/limonadanada';

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
//                        hero ──right──▶ comofunciona ──right──▶ faq
//                          │
//                        down
//                          ▼
//              limao ─▶ morango ─▶ maracuja ──down──▶ hero (loop)

const NAV = {
  hero:         { down: 'limao',    right: 'comofunciona' },
  limao:        { down: 'morango',  up: 'hero' },
  morango:      { down: 'maracuja', up: 'limao' },
  maracuja:     { down: 'hero',     up: 'morango' },
  comofunciona: { right: 'faq',     left: 'hero' },
  faq:          {                   left: 'comofunciona' }
};

// Ordem dos painéis no eixo horizontal — define quanto a imagem
// do hero desliza em cada passo.
const PANELS = ['comofunciona', 'faq'];

// Texto dos hints de navegação, por nó e direcção.
// Uma direcção sem texto não mostra hint (mas continua navegável).
const HINTS = {
  hero:         { down: 'conhece os copos', right: 'como funciona' },
  limao:        { down: 'copo seguinte' },
  morango:      { down: 'copo seguinte' },
  maracuja:     { down: 'voltar ao início' },
  comofunciona: { right: 'perguntas frequentes' },
  faq:          {}
};
