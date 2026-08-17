// ── Motor de navegação em cruz ──────────────────────────
// Estado = um nó do grafo NAV. Cada gesto resolve-se em go(direcção),
// que procura o vizinho e escolhe a transição pelo tipo dos dois nós.
//
//   eixo vertical   → copos: wipe por clip-path + cor de fundo
//   eixo horizontal → informação: pan lateral da imagem + painéis

const CLIP_HIDDEN_BOTTOM = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)';
const CLIP_HIDDEN_TOP    = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)';
const CLIP_VISIBLE       = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';

const EASE      = 'power2.out';
const EASE_MOVE = 'power2.inOut';

const isDesktop = window.matchMedia('(min-width: 769px)').matches;

let current = 'hero';
let busy = false;
let ready = false;

// ── Identificação de nós ────────────────────────────────
function productOf(id)  { return PRODUCTS.find(p => p.id === id); }
function isProduct(id)  { return PRODUCTS.some(p => p.id === id); }
function isPanel(id)    { return PANELS.includes(id); }

// Posição no eixo horizontal: hero = 0, painéis a seguir.
function axisIndex(id)  { return id === 'hero' ? 0 : PANELS.indexOf(id) + 1; }

// ── Construção dos blocos de copo ───────────────────────
function buildProducts() {
  const host = document.getElementById('products');

  PRODUCTS.forEach((p, i) => {
    const layer = document.createElement('div');
    layer.className = 'product-layer';
    layer.id = p.id + '-layer';
    layer.style.zIndex = 15 + i;
    layer.style.background = p.color;
    layer.innerHTML = '<img src="' + p.img + '" alt="' + p.alt + '">';
    host.appendChild(layer);

    const text = document.createElement('div');
    text.className = 'product-text-layer';
    text.id = p.id + '-text';
    text.innerHTML =
      '<div class="product-text-wrapper">' +
        '<div class="product-pre rv">' + p.pre + '</div>' +
        '<div class="product-name rv">' + p.name + '</div>' +
        '<div class="product-post rv">' + p.post + '</div>' +
        '<div class="product-body rv">' + p.body + '</div>' +
        '<div class="pill product-pill rv" style="color:' + p.color + '">' + p.pill + '</div>' +
      '</div>';
    host.appendChild(text);
  });
}

// ── Posição do copo ─────────────────────────────────────
// Em desktop o copo desloca-se para a direita para abrir espaço ao texto;
// em mobile cresce e o texto empilha por cima.
function cupOffset() {
  if (!isDesktop) return 0;
  const img = document.querySelector('.product-layer img');
  if (!img) return 0;
  const maxSafe = (img.offsetWidth - window.innerWidth) / 2;
  return Math.max(0, Math.min(window.innerWidth * 0.15, maxSafe));
}

function cupHome() {
  return isDesktop
    ? { x: 0, y: 0, scale: 1, transformOrigin: 'center center' }
    : { x: 0, y: 0, scale: 1, transformOrigin: 'top 48%' };
}

function cupRest() {
  return isDesktop
    ? { x: cupOffset(), y: '-5vh', scale: 1.28, transformOrigin: 'center center' }
    : { x: 0, y: 0, scale: 1.3, transformOrigin: 'top 48%' };
}

// Pan máximo do hero sem descobrir a margem da imagem.
function maxPan() {
  const img = document.querySelector('.hero-img');
  if (!img) return 0;
  return Math.max(0, (img.offsetWidth - window.innerWidth) / 2);
}

// ── Reveal em cascata ───────────────────────────────────
// Linha a linha, a ganhar foco. É a assinatura da 1ª vaga.
function revealIn(scope, tl, at) {
  tl.fromTo(scope.querySelectorAll('.rv'),
    { opacity: 0, filter: 'blur(14px)', y: 18 },
    { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8, stagger: 0.28, ease: EASE }, at);
}

function revealOut(scope, tl, at) {
  tl.to(scope.querySelectorAll('.rv'),
    { opacity: 0, filter: 'blur(24px)', y: -10, duration: 0.6, ease: 'power2.in' }, at);
}

// ── Transição: entrar num copo (descer) ─────────────────
// O copo só muda de posição na fronteira com o hero. Entre copos as
// imagens estão todas no mesmo sítio e o wipe limita-se a revelar a
// que já lá está — sem reposicionamento, sem salto.
function enterProduct(fromId, toId, tl) {
  const p = productOf(toId);
  const layer = '#' + toId + '-layer';
  const imgEl = layer + ' img';
  const fromHero = fromId === 'hero';

  gsap.set(layer, { clipPath: CLIP_HIDDEN_BOTTOM });
  gsap.set(imgEl, fromHero ? cupHome() : cupRest());
  gsap.set('#' + toId + '-text', { opacity: 1 });

  // Sai o que estava
  if (fromHero) {
    revealOut(document.getElementById('hero-text'), tl, 0);
  } else {
    tl.to('#' + fromId + '-text', { opacity: 0, duration: 0.7, ease: 'none' }, 0);
  }

  tl.to(layer, { clipPath: CLIP_VISIBLE, duration: 1.8, ease: EASE_MOVE }, 0.35)
    .to('body', { backgroundColor: p.color, duration: 1.8, ease: EASE_MOVE }, 0.35);

  if (fromHero) {
    // O copo só arranca com o wipe quase concluído (2.15 = fim). Assim
    // vê-se o copo do meio dos três tornar-se o copo de limão, parado no
    // mesmo sítio, antes de partir para a direita. A arrancar antes, o
    // movimento comia esse momento.
    tl.to(imgEl, Object.assign({ duration: 1.2, ease: EASE_MOVE }, cupRest()), 1.85);
  }

  revealIn(document.getElementById(toId + '-text'), tl, fromHero ? 2.0 : 1.6);
}

// ── Transição: sair de um copo (subir) ──────────────────
function leaveProduct(fromId, toId, tl) {
  const layer = '#' + fromId + '-layer';
  const imgEl = layer + ' img';
  const toHero = toId === 'hero';
  const backColor = toHero ? COLORS.base : productOf(toId).color;

  revealOut(document.getElementById(fromId + '-text'), tl, 0);

  // Só recentra o copo se o destino for o hero — e nesse caso o wipe
  // espera que ele chegue ao centro antes de descer.
  const wipeAt = toHero ? 1.45 : 0.5;
  if (toHero) {
    tl.to(imgEl, Object.assign({ duration: 1.2, ease: EASE_MOVE }, cupHome()), 0.2);
  }

  tl.to(layer, { clipPath: CLIP_HIDDEN_BOTTOM, duration: 1.5, ease: EASE_MOVE }, wipeAt)
    .to('body', { backgroundColor: backColor, duration: 1.5, ease: EASE_MOVE }, wipeAt);

  if (toHero) {
    revealIn(document.getElementById('hero-text'), tl, wipeAt + 1.1);
  } else {
    tl.to('#' + toId + '-text', { opacity: 1, duration: 0.7, ease: 'none' }, wipeAt + 1.1);
  }
}

// ── Transição: último copo → hero (fecha o ciclo) ───────
// Colapsa para cima, ao contrário do wipe de entrada, para se ler
// como regresso e não como mais um copo.
function loopToHero(fromId, tl) {
  const layer = '#' + fromId + '-layer';
  const imgEl = layer + ' img';

  // Os copos anteriores continuavam revelados por baixo deste. Ao
  // levantar o wipe apareciam de lado antes do reset — o salto.
  // Escondem-se já, tapados pelo copo actual que ocupa o ecrã todo.
  PRODUCTS.forEach(p => {
    if (p.id === fromId) return;
    gsap.set('#' + p.id + '-layer', { clipPath: CLIP_HIDDEN_BOTTOM });
    gsap.set('#' + p.id + '-text .rv', { opacity: 0 });
  });

  // Simétrico da entrada: o copo recentra-se primeiro e só depois o wipe
  // levanta, já com ele alinhado com o copo do meio dos três.
  revealOut(document.getElementById(fromId + '-text'), tl, 0);
  tl.to(imgEl, Object.assign({ duration: 1.2, ease: EASE_MOVE }, cupHome()), 0.2)
    .to(layer, { clipPath: CLIP_HIDDEN_TOP, duration: 1.5, ease: EASE_MOVE }, 1.45)
    .to('body', { backgroundColor: COLORS.base, duration: 1.5, ease: EASE_MOVE }, 1.45);

  revealIn(document.getElementById('hero-text'), tl, 2.5);

  tl.add(() => {
    // Repõe os copos por baixo, prontos para nova volta.
    // O contentor volta a 1 e as linhas a 0: os textos dos copos que
    // ficaram para trás tinham o contentor escondido mas as linhas
    // visíveis, e apareceriam por cima do hero.
    PRODUCTS.forEach(p => {
      gsap.set('#' + p.id + '-layer', { clipPath: CLIP_HIDDEN_BOTTOM });
      gsap.set('#' + p.id + '-layer img', cupHome());
      gsap.set('#' + p.id + '-text', { opacity: 1 });
      gsap.set('#' + p.id + '-text .rv', { opacity: 0 });
    });
  }, 2.7);
}

// ── Transição: pan horizontal ───────────────────────────
function panTo(fromId, toId, tl) {
  const fromIdx = axisIndex(fromId);
  const toIdx   = axisIndex(toId);
  const fwd     = toIdx > fromIdx;
  const step    = maxPan() / PANELS.length;
  const D       = 1.8;

  // A imagem desliza e recua para segundo plano: os painéis são texto
  // denso e não competem bem com os copos nítidos por trás.
  tl.to('.hero-img', { x: -step * toIdx, duration: D, ease: EASE_MOVE }, 0)
    .to('.hero-img', { filter: toIdx > 0 ? 'blur(14px)' : 'blur(0px)', duration: D, ease: EASE_MOVE }, 0)
    .to('#scrim', { opacity: toIdx > 0 ? 1 : 0, duration: D, ease: EASE_MOVE }, 0);

  // O hero desliza inteiro — no eixo horizontal não há cascata
  if (fromIdx === 0) {
    tl.to('#hero-text', { x: '-100vw', opacity: 0, duration: D, ease: EASE_MOVE }, 0);
  }
  if (toIdx === 0) {
    tl.to('#hero-text', { x: 0, opacity: 1, duration: D, ease: EASE_MOVE }, 0);
  }

  if (isPanel(fromId)) {
    const el = document.getElementById(fromId + '-panel');
    el.style.pointerEvents = 'none';
    tl.to(el, { x: fwd ? '-100vw' : '100vw', opacity: 0, duration: D, ease: EASE_MOVE }, 0);
  }

  if (isPanel(toId)) {
    const el = document.getElementById(toId + '-panel');
    tl.fromTo(el,
      { x: fwd ? '100vw' : '-100vw', opacity: 0 },
      { x: 0, opacity: 1, duration: D, ease: EASE_MOVE,
        onComplete: () => { el.style.pointerEvents = 'auto'; } }, 0);
    revealIn(el, tl, 0.6);
  }

  // Botão voltar acompanha o eixo
  tl.to('#panel-back', {
    opacity: toIdx > 0 ? 1 : 0,
    duration: 0.5,
    ease: EASE,
    onComplete: () => {
      document.getElementById('panel-back').style.pointerEvents = toIdx > 0 ? 'auto' : 'none';
    }
  }, toIdx > 0 ? 0.8 : 0);
}

// ── Despacho ────────────────────────────────────────────
// byButton distingue clique de gesto: nos nós em NO_GESTURE só o
// clique passa.
function go(dir, byButton) {
  if (busy || !ready) return;
  if (!byButton && NO_GESTURE.includes(current)) return;
  const dest = NAV[current] && NAV[current][dir];
  if (!dest) return;

  busy = true;
  ready = false;
  hideHints();

  const from = current;
  const tl = gsap.timeline({
    onComplete: () => {
      busy = false;
      current = dest;
      showHints();
    }
  });

  if (isProduct(dest) && dir === 'down')      enterProduct(from, dest, tl);
  else if (isProduct(from) && dir === 'up')   leaveProduct(from, dest, tl);
  else if (isProduct(from) && dir === 'down') loopToHero(from, tl);
  else                                        panTo(from, dest, tl);
}

// ── Hints ───────────────────────────────────────────────
const hintDown  = document.getElementById('hint-down');
const hintRight = document.getElementById('hint-right');
let hintTweens = [];

function hideHints() {
  hintTweens.forEach(t => t.kill());
  hintTweens = [];
  [hintDown, hintRight].forEach(h => {
    gsap.to(h, { opacity: 0, duration: 0.3 });
    // Repõe o bounce a zero — sem isto o próximo hint arranca
    // de onde o anterior foi interrompido
    gsap.set(h, { x: 0, y: 0 });
    h.style.pointerEvents = 'none';
  });
}

function showHints() {
  const map = HINTS[current] || {};

  showHint(hintDown, map.down, '.hint-label', { y: -10 });
  showHint(hintRight, map.right, '.hint-script', { x: 10 });

  ready = true;
}

function showHint(el, label, labelSel, motion) {
  if (!label) return;
  el.querySelector(labelSel).textContent = label;
  el.style.pointerEvents = 'auto';

  hintTweens.push(gsap.to(el, { opacity: 1, duration: 0.6, delay: 0.6 }));
  hintTweens.push(gsap.to(el, Object.assign(
    { duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.6 }, motion)));
}

// O centramento dos hints é feito por xPercent/yPercent e não por
// translate no CSS, para o GSAP poder animar y/x sem os reescrever.
// Em mobile o hint da direita encosta ao fundo, sem centrar.
gsap.set(hintDown, { xPercent: -50 });
if (isDesktop) gsap.set(hintRight, { yPercent: -50 });

// ── Input ───────────────────────────────────────────────
window.addEventListener('wheel', (e) => {
  if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
    go(e.deltaY > 0 ? 'down' : 'up');
  } else {
    go(e.deltaX > 0 ? 'right' : 'left');
  }
}, { passive: true });

let touchX = 0, touchY = 0;
window.addEventListener('touchstart', (e) => {
  touchX = e.touches[0].clientX;
  touchY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  const dx = touchX - e.changedTouches[0].clientX;
  const dy = touchY - e.changedTouches[0].clientY;
  const THRESHOLD = 40;

  if (Math.abs(dy) >= Math.abs(dx)) {
    if (dy > THRESHOLD) go('down');
    else if (dy < -THRESHOLD) go('up');
  } else {
    if (dx > THRESHOLD) go('right');
    else if (dx < -THRESHOLD) go('left');
  }
}, { passive: true });

hintDown.addEventListener('click', () => go('down', true));
hintRight.addEventListener('click', () => go('right', true));
document.getElementById('panel-back').addEventListener('click', () => go('left', true));

// Botões da home
document.getElementById('action-copos').addEventListener('click', () => go('down', true));
document.getElementById('action-como').addEventListener('click', () => go('right', true));
// "conhece as limonadas" ainda não liga a lado nenhum — ver notas

window.addEventListener('keydown', (e) => {
  const keys = { ArrowDown: 'down', ArrowUp: 'up', ArrowRight: 'right', ArrowLeft: 'left' };
  if (keys[e.key]) { e.preventDefault(); go(keys[e.key], true); }
});
