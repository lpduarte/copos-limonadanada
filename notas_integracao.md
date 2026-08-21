# Notas de integração — Copos Colecionáveis h3

## Estrutura

```
index.html          hero, painel "como obter", hints
css/styles.css
js/content.js       conteúdo e configuração — é aqui que se mexe
js/engine.js        motor de navegação, transições, construção dos blocos
js/main.js          arranque e salto para o FAQ
img/
img/ilustracoes/    as três bandas .svg de Teresa Rego
```

A separação é intencional: **`content.js` é o único ficheiro que precisa de ser
tocado para mudar copy, cores, ordem dos blocos ou texto dos hints.** Os três
blocos de copo são gerados a partir de `PRODUCTS[]` e as 23 perguntas do FAQ a
partir de `FAQ[]` — não há HTML repetido.

## Navegação

O site não tem scroll. O estado é um nó do grafo `NAV` em `content.js`:

```
                  hero ──right──▶ comoobter
                    │                 ⋮  (scroll do conteúdo)
                  down               FAQ
                    ▼
        limao ─▶ morango ─▶ maracuja ──down──▶ hero (fecha o ciclo)
```

O **FAQ não é um nó do grafo**: vive no fim do painel "como obter" e chega-se
lá por scroll normal do conteúdo, com o fundo quieto. O botão "Saber mais? Lê o
FAQ" leva à âncora (`#faq-section`) e o botão voltar mantém-se fixo enquanto se
rola.

Esse botão leva o mesmo tratamento dos da home (`.pill-nav`, disco com seta a
apontar para baixo, que é para onde o conteúdo rola). Era antes uma pílula só de
contorno, para se distinguir das acções da home; o h3 preferiu igualar, e a
classe `.pill-outline` foi removida por já não ter uso.

O painel divide-se em dois: `.panel-screen` ocupa exactamente uma janela
(`min-height: 100%`) com o bloco centrado, e o FAQ vem a seguir — é isto que
o mantém abaixo da dobra. O contentor que rola (`.panel-content`) ocupa a
largura toda para o elevador ficar na margem do ecrã e não na do texto; a
largura de leitura é imposta pelos filhos.

Cada movimento resolve-se em `go(direcção, porBotão)`. O tipo de transição é
escolhido pelo tipo dos dois nós, não por índices:

| Movimento | Transição |
|---|---|
| entrar num copo | wipe por `clip-path` de baixo para cima + cor de fundo |
| sair de um copo | wipe de volta para baixo |
| último copo → hero | wipe para cima (lê-se como regresso, não como mais um copo) |
| eixo horizontal | pan lateral da imagem + painéis a deslizar |

Entradas: roda do rato, trackpad (vertical e horizontal), swipe, setas do
teclado, clique nos hints, nos botões da home e no botão voltar.

### A home não navega por gesto

`NO_GESTURE` (em `content.js`) lista os nós onde roda e swipe não navegam:

- **`hero`** — dali partem dois caminhos, um por eixo, e um gesto não sabe qual
  deles o utilizador quer. Sai-se pelos botões.
- **`comoobter`** — o gesto pertence ao scroll do conteúdo, não à navegação.
  Sai-se pelo botão voltar.

As teclas de seta só são interceptadas quando existe destino no grafo; caso
contrário passam para o scroll do painel.

Os dois botões da home:

| Botão | Seta | Destino |
|---|---|---|
| conhece os copos | para baixo | eixo vertical, para o copo de limão |
| como obter | para a direita | eixo horizontal, para o painel da mecânica |

Houve um terceiro, "conhece as limonadas", que remetia para a landing page das
LimonadaNada — o h3 decidiu tirá-lo. Foi removido com o ícone de "abre fora do
site" que o acompanhava; se voltar, o desenho é o `square-arrow-out-up-right`
do lucide e o destino tem de abrir noutro separador.

O h3 achava que estes botões não pareciam botões, e a razão era concreta: a pílula
branca é também o elemento de **informação** do site ("1 copo = 3 pontos" nos
copos, o destaque no painel). O mesmo objecto a dizer "isto é um facto" e
"carrega aqui". O que os separa agora é o disco com a seta — e a seta aponta
para onde a página vai mesmo, o que faz dela navegação e não ornamento.

O desenho da seta é o do botão de voltar do painel (traço de 1,5, pontas
redondas).

No hover o botão **não sobe**: o disco esvazia-se para contorno azul, a seta passa a
azul e avança 3px na direcção que anuncia — o mesmo gesto do botão de voltar. O
contorno já existe no estado cheio, com a mesma espessura, para o disco não
mudar de medida ao passar de um estado para o outro.

O azul sai de `currentColor`, herdado do `.pill-action`: a cor continua a
viver num sítio só.

Três detalhes de medida, todos aferidos por leitura de píxeis:

- **O rótulo tem elemento próprio** (`.rotulo`) com uma correcção óptica em
  `--optico`, aplicada por `translateY` — em translate e não em padding, para
  poder corrigir nos dois sentidos. **O valor depende do que está escrito**, e
  não há um número que sirva os dois casos:

  | rótulo | o que o olho equilibra | `--optico` |
  |---|---|---|
  | minúsculas ("conhece os copos") | entre a x-height e as ascendentes | `-0.08em` (sobe) |
  | com maiúsculas ("Saber mais? Lê o FAQ") | a altura das maiúsculas | `0.085em` (desce) |

  Para medir isto, contas com o *bounding box* do texto enganam: a cauda do Q
  conta para a caixa e não conta para o olho, e o rect de um `<span>` não é a
  caixa de linha. O que funciona é marcar a linha de base com um
  `inline-block` de altura zero (`vertical-align: baseline`), tirar a
  cap-height e a x-height de `measureText` num canvas, e comparar o meio dessa
  faixa com o meio da cápsula.

  Nota: os `<button>` levam `line-height: normal` do próprio browser, que
  ganha à herança — por isso os dois botões estão no mesmo contexto, mesmo
  vivendo em zonas do site com line-heights diferentes.
- **O disco é concêntrico com a cápsula.** O `padding-right` de 0,42em é
  exactamente a diferença entre o raio da cápsula (1,47em) e o do disco
  (1,05em), por isso a folga é igual em cima, em baixo e à direita — 9,4px a
  1440. Mexer no padding vertical obriga a mexer no direito pelo mesmo valor.
- **A seta de sair do site não se move** no hover: o ícone já aponta para fora
  e o deslocamento diagonal lia-se como tremor.

**Armadilha de cascata**: `.pill-nav` e `.pill` têm a mesma especificidade, por
isso o bloco dos botões da home **tem de vir depois de `.pill`** no ficheiro.
Estava antes, e o botão herdava o `padding: 0.6em 1.5em` da pílula genérica —
o disco ficava a 30px da margem direita contra 12px em cima e em baixo, e o
`font-size` não pegava.

### Posição do copo entre blocos

As três imagens de copo estão sempre na mesma posição. Ao passar de um copo
para o seguinte **não há reposicionamento**: o wipe revela a imagem que já
está no sítio, e a silhueta do copo mantém-se contínua na linha de corte.

A imagem só se desloca nas fronteiras com o hero — ao entrar no primeiro copo
(centro → posição de leitura) e ao sair do último (posição de leitura →
centro). Alterar isto é mexer nas condições `fromHero` / `toHero` em
`enterProduct()` e `leaveProduct()`.

## O que falta antes de publicar

- **`og:url`** — falta em `index.html`. Adicionar com o URL final.
- **Imagens OG/Twitter** — os caminhos são relativos (`img/3_copos.webp`).
  Passar a absolutos no deploy final.

## Imagens

As quatro fotografias em `img/` são as da 2ª entrega: os copos verdadeiros, com
a ilustração já impressa. Chegaram em JPG (~10 MB cada) e foram convertidas para
WebP com qualidade 80:

```
npx sharp-cli -i original.jpg -o img/ -f webp -q 80
```

Ficam em 346–476 KB, na mesma ordem de grandeza das anteriores. A 80 não há
banding visível no degradé do fundo — a 75 já aparecem blocos. Os originais são
sRGB e o WebP sai sem perfil embutido, que é o que os browsers assumem: as cores
não se deslocam.

São 6825×2880 (~2,37:1) e o posicionamento do copo depende dessa proporção:

- **Desktop**: o copo desloca-se `15vw` para a direita (limitado à margem da
  imagem por `cupOffset()`), sobe `5vh` e escala 1.28.
- **Mobile**: escala 1.3 com `transform-origin: top 48%`.

Ao trocar por novas fotografias, manter a proporção. Se mudar, os valores a
afinar estão em `cupRest()` (`engine.js`).

**Importante**: as três imagens têm de ter o copo enquadrado da mesma maneira. A
transição entre copos assenta em as silhuetas coincidirem na linha do wipe — se
uma das fotografias tiver o copo noutra posição, a passagem parte. Nesta entrega
as posições não coincidem ao pixel (foram aproximadas em Photoshop) e ficou
assim por decisão: não se mexeu em `cupRest()` para compensar.

### As cores dos fundos

A 3ª entrega das fotografias trouxe os fundos certos: um por sabor. (A entrega
anterior tinha vindo toda em azul, por um mal-entendido no briefing ao
pós-produtor — houve um interruptor no código para lidar com isso, entretanto
removido.)

Os valores em `COLORS` **são medidos nas fotografias**, não escolhidos: média
de nove pontos do fundo, fora do copo e da sombra. O fundo do ecrã tem de
continuar a fotografia onde ela não chega, e qualquer desvio aparece na
transição.

| | fundo |
|---|---|
| hero | `#08a3e9` |
| limão | `#deb82f` |
| morango | `#d44947` |
| maracujá | `#742d8b` |

Ao trocar as fotografias, **voltar a medir**. O método está em
`scratchpad/`: desenhar amostras de 1px num canvas e ler o `getImageData`.

### Duas tintas por copo

São dois problemas de contraste diferentes, por isso são dois campos em
`PRODUCTS`:

| | `tinta` (texto sobre o fundo) | `corPilula` (texto sobre branco) |
|---|---|---|
| limão | azul de marca | azul de marca |
| morango | branco | o vermelho do fundo |
| maracujá | branco | o roxo do fundo |

**O limão é o caso especial**: o amarelo é claro, o texto branco desaparecia
nele e a pílula branca com texto amarelo era ilegível. Ambos passam ao azul de
marca (`COLORS.marca`, `#0a5eb5`) — que é tinta e não fundo, e por isso é
também o único azul que vive no CSS, junto de `.pill-action`.

Duas coisas seguem a tinta e é preciso lembrar-se delas ao mexer nas cores:

- **O hint de navegação** ("copo seguinte") vive fora das camadas dos copos, por
  isso não herda nada — o engine acerta-lhe a cor em `showHints()`. Sobre o
  amarelo, um hint branco desaparecia.
- **O halo do texto em mobile.** Aí o corpo de texto cai por cima do copo e é a
  sombra que o separa; ela tem de ser o **contrário** da tinta — escura por
  baixo de texto branco, clara por baixo de texto escuro. Vem do engine em
  `--halo`, porque depende da tinta.

**Nota em aberto**: mesmo com o halo, o corpo de texto do limão em mobile
assenta sobre a zona clara e multicolor do copo e lê-se com esforço. Com a copy
definitiva (mais curta que o lorem ipsum) talvez deixe de ser problema; se não
for, a decisão é de desenho e não de cor.

## Ilustrações de Teresa Rego

As três bandas em `img/ilustracoes/` são ficheiros **originais, por tocar** —
não passaram por optimizador. Comprimidas pelo servidor ficam em 41–90 KB, menos
do que qualquer uma das fotografias (346–548 KB), por isso não compensava o risco
de as mexer. O `svgo` com `convertPathData` ligado, já agora, rebenta nestes
paths.

Cada peça tem ~2,2:1 e as **quatro margens cortadas a direito**. Daí a regra que
governa toda a composição: **a arte só pode ser cortada pelas bordas do ecrã**.
Qualquer recorte nosso dentro do ecrã — uma caixa num canto, uma faixa de altura
fixa — deixa uma aresta recta à vista e lê-se como banner colado. Quem faz a
fronteira com o centro do ecrã é a silhueta irregular da própria ilustração; as
laterais saem sempre para fora.

Também não emendam nas pontas (testado): são peças fechadas, não padrões — não
se pode repetir uma em mosaico ao longo do ecrã.

### Como se compõe

Uma peça em cima e outra em baixo, controladas por três variáveis em `.art`
(`styles.css`):

| | o que é |
|---|---|
| `--zoom` | largura da peça, em % da largura do ecrã. Acima de 100 — as laterais têm de sair |
| `--entra` | quanto dela entra no ecrã, em % da altura **dela**. Medir na peça e não na janela mantém a conta independente do formato do ecrã |
| `--fx` | que zona da banda fica visível: 0 esquerda, 1 direita |

Valores por contexto:

| | topo | rodapé |
|---|---|---|
| hero (desktop) | — | 175 / 13 / 0,92 |
| copos (desktop) | 200 / 13 / 0 | 210 / 15 / 1 |
| hero (mobile) | — | 320 / 15 |
| copos (mobile) | 330 / 13 | 360 / 20 |

No hero há **uma só peça**, no rodapé (o limão): a de cima competia com o
título e saiu a pedido do h3. Nos copos é a **mesma peça nos dois sítios**, e é por isso
que ali a ampliação é maior: a `--zoom` do hero, as duas janelas apanhavam a
mesma zona da banda e as formas repetiam-se à vista. A 200%/210% vê-se pouco
mais de metade da banda de cada vez — a metade esquerda em cima, a direita em
baixo, sem sobreposição.

Em retrato a peça é muito mais alta em relação ao ecrã, por isso a ampliação
sobe. **Atenção à cascata**: as regras dos copos são `.product-layer .art-top`
e ganham por especificidade à media query de mobile — o bloco mobile tem de
repetir o mesmo selector, senão os copos ficam nos valores de desktop.

### Onde vive cada coisa

O ficheiro de cada sabor é dado do produto (`PRODUCTS[].art`, em
`content.js`) e o engine constrói as duas peças dentro da camada do copo — o
mesmo `clip-path` do wipe leva a ilustração com ele. A do hero está no
`index.html`, numa camada à parte (`#hero-art`) porque tem movimento próprio:
**pertence ao hero e sai com ele**. Ao passar para o painel, desce até sair de
vista (`yPercent` ∓20 — um pouco mais do
que o `--entra`, por isso vale em qualquer formato de ecrã); ao voltar, entram
outra vez. O painel é texto denso e não as quer por trás.

Cada peça tem **dois elementos**: o `div.art` é do movimento (é nele que o
GSAP escreve o transform) e o `img` lá dentro é da composição. Com tudo no
mesmo elemento, a primeira animação apagava o enquadramento — e ele deixava de
responder ao redimensionar a janela.

### Contraste

Cada peça assenta agora sobre o fundo da sua própria cor, e o caso difícil é o
**limão**: as formas amarelas da ilustração perdem-se contra o fundo amarelo e o
que sustenta a peça são os azuis e os vermelhos. Aguenta-se, mas se incomodar a
saída é baixar o `--entra` desse ecrã — não trocar as peças de sítio, que cada
copo mostra a sua.

Nota do que mudou com estas fotografias: a ilustração das bordas passou a ser a
mesma arte que está impressa no copo, ampliada. Lê-se como coerência e não como
repetição, mas é uma relação nova — vale a pena olhar para isso quando entrar a
copy definitiva.

## FAQ

As 23 perguntas vivem em `FAQ[]` (`content.js`), como lista corrida, e são
construídas por `buildFaq()` (`engine.js`). **A copy mexe-se sem tocar em
estrutura** — era HTML escrito à mão enquanto foram três perguntas.

O h3 enviou 25; ficaram 23, com duas fusões de perguntas que tinham a mesma
resposta:

- *Posso trocar na App h3?* + *Posso trocar num Kiosk?* → uma só, porque a
  resposta era a mesma ("só ao balcão").
- *Os três modelos estarão sempre disponíveis?* + *Os copos têm stock
  limitado?* → uma só, pela mesma razão.

Continuam três perguntas diferentes a dizer que a troca é só ao balcão (*onde
trocar*, *App ou Kiosk*, *Delivery*). É de propósito: num FAQ cada pessoa
procura pela pergunta que tem na cabeça.

**Sem secções.** Chegaram a estar agrupadas por tema, com títulos, e saíram: há
perguntas que servem dois grupos ao mesmo tempo — o stock é dos copos e é da
troca; a conta na App é da campanha e é de trocar pontos — e a arrumação
impunha uma ordem que não existe. Sem títulos, a sequência continua a ir do
geral para o particular, e os comentários em `content.js` marcam-na para quem
edita. Ao acrescentar perguntas, é aí que se decide onde entram.

A resposta **"Quem é a Teresa Rego?"** não é a que o h3 enviou — é a que já cá
estava, escrita a partir do site dela, com a formação, o estúdio e as marcas.
A do h3 dizia apenas que é a artista das ilustrações. Continua por validar (ver
**Texto sobre a ilustradora**).

### Porque é acordeão

| | altura do painel | ecrãs de scroll |
|---|---|---|
| tudo fechado | 2.990px | 3,7 |
| tudo aberto | ~5.200px | 6,4 |

Com três perguntas estavam sempre abertas e o CSS dizia-o. Com 23 deixou de
dar. Abrem-se **de forma independente** e não uma-de-cada-vez: há respostas que
se comparam entre si (as das quantidades de pontos, por exemplo).

### A animação

A altura vai de 0 até `auto` com o GSAP, como o resto do site, e no fim
**larga-se a altura** (`clearProps`). Sem isso o painel ficava preso à altura
medida no momento da abertura e o texto transbordava ao redimensionar a janela
ou ao rodar o telemóvel.

A resposta tem `max-width: 62ch`: à largura dos cartões, estas respostas davam
linhas de mais de 100 caracteres. A pergunta e a linha divisória continuam à
largura toda.

## Números dos passos

Os círculos ficam a cavalo na borda de cima do cartão. Para a linha não
atravessar o algarismo, o cartão leva uma **máscara** (`radial-gradient`) que
abre um buraco no sítio do círculo. Por isso o círculo é **irmão** do cartão e
não filho — a máscara aplica-se também aos descendentes, e cortaria o número
com ela.

O tamanho é controlado por `--dia` em `.step` (diâmetro do círculo). O buraco
tem exactamente esse raio, para as duas linhas se encontrarem sem folga.

O algarismo leva `padding-top: 0.13em`. Centrado só pela caixa fica alto,
porque não tem descendentes e a métrica da fonte reserva espaço em baixo que
ele não usa. Com `align-items: center`, o padding desloca **metade** do seu
valor. O valor foi aferido por leitura de pixels do ecrã, não por métricas da
fonte — a posição da mancha quantiza ao pixel, por isso o melhor possível é
ficar dentro de ±0.5px do centro.

## Texto sobre a ilustradora

A resposta "Quem é a Teresa Rego?" foi escrita a partir do site dela
(teresaregostudio.com): formação em Arquitetura e depois Ilustração na
University of the Arts London, estúdio no Porto, trabalho para marcas como
Prada e Scotch & Soda. **Convém validar com o h3 e com a própria** antes de
publicar — é texto sobre uma pessoa real.

## Cores

Vivem só em `COLORS` (`js/content.js`): os fundos (medidos nas fotografias) e o
azul de marca. O fundo de cada bloco, a tinta do texto e a cor do texto da
pílula são aplicados por JS a partir de `PRODUCTS[]` — não há cores de produto
no CSS. Ver **As cores dos fundos** e **Duas tintas por copo**.

Há duas excepções, ambas de tinta e não de fundo: o azul de marca nos botões
(`.pill-action { color: #0a5eb5 }`, de onde `currentColor` o leva ao disco da
seta) e o mesmo azul no destaque "1 copo = 3 pontos" do painel.

## Datas

O briefing tinha duas datas de fim: 31 de outubro no enquadramento, 30 de
outubro na FAQ. O texto do FAQ que o h3 enviou depois diz **31 de outubro de
2026**, e é essa que está implementada — em dois sítios: o passo 3 do painel
"Como Obter" (`index.html`) e a resposta "Quando decorre a campanha?"
(`content.js`).

## Header

Não há header, por decisão: tal como na landing das LimonadaNada, o header é
elemento do site que aloja, não desta página. A entrada "Copos Colecionáveis"
pedida no briefing é para o menu do h3.com.

## Notas técnicas

- **Blur nos reveals, não nas letras.** Os reveals entram de `blur(14px)` para
  nítido, como na 1ª vaga, e a imagem do hero desfoca no eixo horizontal para
  os painéis se lerem. O que **não** existe aqui são os efeitos por letra da
  1ª vaga (o NADA e o AÇÚCAR a desvanecer). Vale a pena testar o eixo
  horizontal num telemóvel real: desfocar uma imagem grande era o que dava
  problemas de repaint em Safari na 1ª vaga.
- **Espaço óptico no hero.** As margens do `.hero-sub` são assimétricas de
  propósito. A caixa de uma linha de texto estende-se para lá dos glifos, e em
  "COPOS" — caixa alta, sem descendentes — essa folga morta é de 0.218em do
  título. Margens iguais dariam um espaço que *mede* igual mas *parece* o
  dobro em cima. Os valores em `styles.css` já descontam essa folga.
- **Hints**: o centramento é feito por `xPercent`/`yPercent` via GSAP e não por
  `transform` no CSS — senão o GSAP reescrevia-o ao animar o bounce.
- **`overscroll-behavior: none`** no body impede o swipe-to-go-back do Safari e
  do Chrome, que colidia com o eixo horizontal.
- **GSAP 3.12.7** por CDN (`cdn.jsdelivr.net`). Considerar bundlar localmente ou
  adicionar SRI se houver requisitos de disponibilidade.
- **Breakpoint** mobile a 768px. Tablets em landscape usam o layout desktop.
- **Threshold de swipe**: 40px (`engine.js`). Subir se houver toques acidentais.
- Não há persistência de sessão — ao recarregar, volta ao hero. A 1ª vaga
  guardava o bloco em `sessionStorage`; aqui, com dois eixos, o ganho não
  compensava a complexidade.

## Acessibilidade

Feito: `aria-hidden` nos decorativos, `aria-label` no botão voltar e nos
painéis, navegação por setas do teclado. No FAQ, cada pergunta é um `<button>`
com `aria-expanded` e `aria-controls`, dentro de um `h3` para a lista ser
navegável por títulos, com `:focus-visible` desenhado.

Falta: foco visível no resto dos elementos interactivos e ordem de tabulação —
fora do FAQ, o site não foi pensado para navegação exclusivamente por teclado.
