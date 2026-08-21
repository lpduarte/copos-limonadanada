// ── Conteúdo e configuração ─────────────────────────────
// Os três blocos de copo são idênticos em estrutura, por isso vivem aqui
// como dados e são construídos pelo engine. Os painéis do eixo horizontal
// (como obter, FAQ) são únicos e estão escritos no index.html.

// Os fundos são os das fotografias, medidos nelas (média de nove pontos, fora
// do copo e da sombra): o fundo do ecrã tem de continuar a fotografia onde ela
// não chega, e nota-se na transição se destoar.
//
// O azul de marca — #0a5eb5, o dos botões — NÃO está aqui: é tinta e não
// fundo, vive no CSS junto de `.pill-action`. `base` é o azul da fotografia
// do hero, que é outro.
const COLORS = {
  base:     '#08a3e9',
  limao:    '#deb82f',
  morango:  '#d44947',
  maracuja: '#742d8b',
  marca:    '#0a5eb5'
};

// NOTA: os campos `post` e `body` são placeholders neutros, à espera da
// copy do h3. O nome do sabor e a pílula são conteúdo real.
const PRODUCTS = [
  {
    id: 'limao',
    name: 'LIMÃO',
    color: COLORS.limao,
    // O amarelo é claro: o texto branco desaparecia nele, e a pílula
    // branca com texto amarelo era ilegível. Ambos passam ao azul de marca.
    tinta: COLORS.marca,
    corPilula: COLORS.marca,
    img: 'img/limao.webp',
    art: 'img/ilustracoes/limao.svg',
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
    tinta: '#ffffff',
    corPilula: COLORS.morango,
    img: 'img/morango.webp',
    art: 'img/ilustracoes/morango.svg',
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
    tinta: '#ffffff',
    corPilula: COLORS.maracuja,
    img: 'img/maracuja.webp',
    art: 'img/ilustracoes/maracuja.svg',
    alt: 'Copo h3 LimonadaNada de Maracujá',
    pre: 'O COPO',
    post: 'LOREM IPSUM DOLOR',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>Sed do eiusmod tempor incididunt ut labore.',
    pill: '1 copo = 3 pontos'
  }
];

// ── FAQ ─────────────────────────────────────────────────
// Texto do h3. São 23 perguntas: as 25 que enviou, com duas fusões — "App ou
// Kiosk" era duas perguntas com a mesma resposta, e "stock limitado" repetia
// "os três modelos estarão sempre disponíveis".
//
// A resposta sobre a Teresa Rego é a que já cá estava, escrita a partir do
// site dela e mais completa do que a versão enviada. Continua por validar
// com o h3 e com a própria — é texto sobre uma pessoa real.
//
// É uma lista corrida, sem secções: chegaram a estar agrupadas por tema, mas
// havia perguntas que serviam dois grupos ao mesmo tempo e a arrumação criava
// uma ordem que não existe. Os comentários abaixo marcam a sequência de
// leitura — do geral para o particular — e são só isso.
//
// Fechadas por omissão: 23 respostas abertas davam quase sete ecrãs de scroll.
const FAQ = [
  // A campanha
  {
    q: 'O que é a campanha dos copos h3?',
    a: 'É uma campanha exclusiva para clientes h3 fidelizados, que permite trocar pontos por copos personalizados do h3, ilustrados pela artista Teresa Rego.'
  },
  {
    q: 'Quando decorre a campanha?',
    a: 'A campanha decorre entre 8 de setembro e 31 de outubro de 2026, limitada ao stock existente.'
  },
  {
    q: 'A campanha está disponível em todos os restaurantes h3?',
    a: 'Sim. A campanha está disponível em todos os restaurantes h3 de Portugal Continental e Ilhas, limitada ao stock existente em cada restaurante.'
  },
  {
    q: 'Quem é a Teresa Rego?',
    a: 'É a ilustradora dos copos. Formou-se em Arquitetura e, mais tarde, em Ilustração na University of the Arts London. Tem estúdio no Porto, e as suas ilustrações — coloridas, de formas ousadas e inspiradas na natureza — já vestiram marcas como a Prada e a Scotch&nbsp;&amp;&nbsp;Soda.'
  },

  // Os copos
  {
    q: 'Que copos estão disponíveis?',
    a: 'Existem três modelos diferentes, todos ilustrados pela Teresa Rego: Limão, Morango e Maracujá.'
  },
  {
    q: 'Posso escolher o modelo do meu copo?',
    a: 'Sim. No momento da troca podes escolher entre os modelos Limão, Morango e Maracujá, mediante o stock disponível no restaurante.'
  },
  {
    q: 'Os copos têm stock limitado?',
    a: 'Sim. Todos os modelos têm stock limitado e estão disponíveis apenas enquanto houver unidades. Não podemos garantir a disponibilidade permanente dos três modelos: a escolha está sujeita ao stock existente em cada restaurante no momento da troca.'
  },
  {
    q: 'Posso reservar um copo ou um modelo específico para levantar mais tarde?',
    a: 'Não. Não são aceites reservas de copos. A troca e a escolha do modelo são efetuadas no momento, de acordo com o stock disponível no restaurante.'
  },
  {
    q: 'Posso trocar ou devolver o meu copo depois do resgate?',
    a: 'A troca ou devolução de um copo apenas poderá ser realizada em caso de defeito.'
  },
  {
    q: 'Posso comprar o copo sem utilizar pontos?',
    a: 'Não. Os copos desta campanha não estão disponíveis para venda e apenas podem ser obtidos através da troca de pontos h3.'
  },

  // Trocar pontos
  {
    q: 'Quantos pontos preciso para trocar por um copo?',
    a: 'Precisas de 3 pontos h3 para trocar por 1 copo.'
  },
  {
    q: 'Onde posso trocar os meus pontos por um copo?',
    a: 'A troca é feita exclusivamente ao balcão dos restaurantes h3, com a ajuda de um colaborador.'
  },
  {
    q: 'Posso trocar os meus pontos na App h3 ou num Kiosk?',
    a: 'Não. Apesar de ser necessário estares registado na App h3, a troca dos pontos por copos tem de ser efetuada ao balcão de um restaurante h3 — não é possível na App nem nos Kiosks.'
  },
  {
    q: 'Posso pedir o copo através de Delivery?',
    a: 'Não. A campanha não está disponível através dos canais de Delivery.'
  },
  {
    q: 'Tenho de fazer uma compra para trocar os meus pontos?',
    a: 'Não. Podes dirigir-te ao balcão e trocar os teus pontos por um copo, mesmo sem efetuares qualquer compra.'
  },
  {
    q: 'Preciso de ter conta na App h3 para participar?',
    a: 'Sim. A campanha é exclusiva para clientes fidelizados e registados na App h3.'
  },
  {
    q: 'Como sei quantos pontos tenho?',
    a: 'Podes consultar o teu saldo de pontos na App h3.'
  },

  // Pontos e benefícios
  {
    q: 'Posso usar os pontos que acabei de ganhar numa compra para pedir um copo?',
    a: 'Sim. Os pontos acumulados nessa compra ficam disponíveis para utilização imediata. Se, após a compra, tiveres pelo menos 3 pontos, podes utilizá-los logo para trocar por um copo.'
  },
  {
    q: 'Posso trocar pontos por mais do que um copo de uma vez?',
    a: 'Sim. Desde que tenhas pontos suficientes, podes trocar por vários copos na mesma operação. Por exemplo, com 6 pontos podes trocar por até 2 copos e com 9 pontos por até 3 copos.'
  },
  {
    q: 'Se trocar por vários copos, têm de ser todos iguais?',
    a: 'Não. Podes escolher diferentes modelos na mesma troca, mediante o stock disponível no restaurante.'
  },
  {
    q: 'Posso trocar apenas parte dos meus pontos?',
    a: 'Sim. Por exemplo, se tiveres 9 pontos, podes optar por trocar apenas 3 pontos por 1 copo, 6 pontos por 2 copos ou os 9 pontos por 3 copos.'
  },
  {
    q: 'Se utilizar pontos para um copo, continuo a poder utilizar outros benefícios da minha conta?',
    a: 'Sim. A troca de pontos por copos não elimina outros benefícios que tenhas disponíveis, como refeições gratuitas ou vouchers, desde que cumpras as respetivas condições de utilização.'
  },
  {
    q: 'Posso trocar uma refeição gratuita por um copo?',
    a: 'Não. Os copos são resgatados exclusivamente através de pontos: 3 pontos correspondem a 1 copo.'
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
// A home não tem hints: sai-se de lá pelos botões.
const HINTS = {
  hero:      {},
  limao:     { down: 'copo seguinte' },
  morango:   { down: 'copo seguinte' },
  maracuja:  { down: 'voltar ao início' },
  comoobter: {}
};

// Nós onde a navegação por gesto está desligada.
//   hero      — dali partem dois caminhos e o gesto não sabe qual
//   comoobter — o gesto pertence ao scroll do conteúdo, não à navegação
const NO_GESTURE = ['hero', 'comoobter'];
