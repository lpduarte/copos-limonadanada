// ── Arranque ────────────────────────────────────────────

buildProducts();
buildFaq();

// ── FAQ ─────────────────────────────────────────────────
// O FAQ está sempre aberto e vive no fim do painel "como obter".
// O botão leva-o à âncora com scroll do conteúdo, sem mudar de nó.
//
// A animação é do GSAP e não do scroll-behavior nativo: aquele arranca
// de repente e não aceita curva. Aqui usa-se a mesma curva das
// transições entre ecrãs, para o movimento pertencer ao mesmo site.
document.getElementById('action-faq').addEventListener('click', () => {
  const scroller = document.getElementById('comoobter-scroll');
  const faq = document.getElementById('faq-section');

  // Distância a percorrer, limitada ao fim do conteúdo
  const alvo = Math.min(
    scroller.scrollTop + faq.getBoundingClientRect().top - window.innerHeight * 0.02,
    scroller.scrollHeight - scroller.clientHeight
  );

  gsap.to(scroller, {
    scrollTop: alvo,
    duration: 1.2,
    ease: 'power2.inOut',
    overwrite: true
  });
});

// ── Entrada ─────────────────────────────────────────────
const introTl = gsap.timeline({
  delay: 0.6,
  onComplete: showHints
});

// As ilustrações chegam do bordo antes do texto: primeiro monta-se o
// cenário, depois entra a mensagem. Deslocam-se em percentagem da própria
// peça, por isso o valor vale em qualquer ecrã.
introTl.from('#hero-art .art-top',    { yPercent: -18, opacity: 0, duration: 1.6, ease: EASE_MOVE }, 0)
       .from('#hero-art .art-bottom', { yPercent:  18, opacity: 0, duration: 1.6, ease: EASE_MOVE }, 0.12);

revealIn(document.getElementById('hero-text'), introTl, 0);

// O deslocamento do copo é calculado a partir da largura da imagem e da
// janela — ao redimensionar, o copo visível tem de acompanhar.
window.addEventListener('resize', () => {
  if (busy) return;
  const p = productOf(current);
  if (p) gsap.set('#' + p.id + '-layer .cup-photo', cupRest());
});
