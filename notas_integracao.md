# Notas de integração — Copos Colecionáveis h3

## Estrutura

```
index.html          hero, painéis (como funciona, FAQ), hints
css/styles.css
js/content.js       conteúdo e configuração — é aqui que se mexe
js/engine.js        motor de navegação, transições
js/main.js          arranque, acordeão da FAQ
img/
```

A separação é intencional: **`content.js` é o único ficheiro que precisa de ser
tocado para mudar copy, cores, ordem dos blocos ou texto dos hints.** Os três
blocos de copo são gerados a partir de `PRODUCTS[]` — não há HTML repetido.

## Navegação

O site não tem scroll. O estado é um nó do grafo `NAV` em `content.js`:

```
                  hero ──right──▶ comofunciona ──right──▶ faq
                    │
                  down
                    ▼
        limao ─▶ morango ─▶ maracuja ──down──▶ hero (fecha o ciclo)
```

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

`NO_GESTURE` (em `content.js`) lista os nós onde roda e swipe estão
desligados. Só lá está o `hero`: dali partem três caminhos e um gesto não
sabe qual deles o utilizador quer. Sai-se da home pelos três botões:

| Botão | Destino |
|---|---|
| conhece os copos | eixo vertical, para o copo de limão |
| como funciona | eixo horizontal, para o painel da mecânica |
| **conhece as limonadas** | **por ligar** — ver secção seguinte |

### Posição do copo entre blocos

As três imagens de copo estão sempre na mesma posição. Ao passar de um copo
para o seguinte **não há reposicionamento**: o wipe revela a imagem que já
está no sítio, e a silhueta do copo mantém-se contínua na linha de corte.

A imagem só se desloca nas fronteiras com o hero — ao entrar no primeiro copo
(centro → posição de leitura) e ao sair do último (posição de leitura →
centro). Alterar isto é mexer nas condições `fromHero` / `toHero` em
`enterProduct()` e `leaveProduct()`.

## O que falta antes de publicar

- **Botão "conhece as limonadas"** (`#action-limonadas`) — está sem acção por
  decisão. É o CTA que o briefing pede para remeter à landing page das
  LimonadaNada; falta o URL de destino. Ligar em `engine.js`, junto dos outros
  dois botões da home.
- **`og:url`** — falta em `index.html`. Adicionar com o URL final.
- **Imagens OG/Twitter** — os caminhos são relativos (`img/3_copos.webp`).
  Passar a absolutos no deploy final.
- **Imagens dos copos** — as quatro `.webp` em `img/` são ainda as limonadas da
  1ª vaga, usadas como placeholder. Ver secção seguinte.

## Imagens

As imagens de produto são 6825×2880 (~2.37:1). O posicionamento do copo
depende desta proporção:

- **Desktop**: o copo desloca-se `15vw` para a direita (limitado à margem da
  imagem por `cupOffset()`), sobe `5vh` e escala 1.28.
- **Mobile**: escala 1.3 com `transform-origin: top 48%`.

Ao trocar pelas imagens finais dos copos, manter a proporção. Se mudar, os
valores a afinar estão em `cupRest()` (`engine.js`).

**Importante**: as três imagens têm de ter o copo enquadrado da mesma maneira.
A transição entre copos assenta em as silhuetas coincidirem na linha do wipe —
se uma das fotografias tiver o copo noutra posição, a passagem parte.

## Cores

Vivem só em `COLORS` (`js/content.js`). O fundo de cada bloco e a cor do texto
da pílula são aplicados por JS a partir de `PRODUCTS[].color` — não há cores de
produto no CSS.

## Datas

O briefing tinha duas datas de fim (31 de outubro no enquadramento, 30 de
outubro na FAQ). Está implementado **30 de outubro de 2026**, em dois sítios do
`index.html`: a nota do painel "Como Funciona" e a resposta "Até quando decorre
a campanha?".

## Header

Não há header, por decisão: tal como na landing das LimonadaNada, o header é
elemento do site que aloja, não desta página. A entrada "Copos Colecionáveis"
pedida no briefing é para o menu do h3.com.

## Notas técnicas

- **Sem blur.** A 1ª vaga usava `filter: blur()` nos reveals e no hero; aqui os
  reveals são `opacity` + subida de 12px, e o escurecimento do hero é feito por
  um scrim. Menos repaints, sem os problemas de Safari da 1ª vaga.
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
painéis, `aria-expanded` na FAQ, navegação por setas do teclado.

Falta: foco visível nos elementos interactivos e ordem de tabulação — o site
não foi pensado para navegação exclusivamente por teclado.
