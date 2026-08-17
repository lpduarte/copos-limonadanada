// ── Arranque ────────────────────────────────────────────

buildProducts();

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

revealIn(document.getElementById('hero-text'), introTl, 0);

// O deslocamento do copo é calculado a partir da largura da imagem e da
// janela — ao redimensionar, o copo visível tem de acompanhar.
window.addEventListener('resize', () => {
  if (busy) return;
  const p = productOf(current);
  if (p) gsap.set('#' + p.id + '-layer img', cupRest());
});
