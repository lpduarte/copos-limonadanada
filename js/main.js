// ── Arranque ────────────────────────────────────────────

buildProducts();

// ── FAQ ─────────────────────────────────────────────────
// O FAQ está sempre aberto e vive no fim do painel "como obter".
// O botão leva-o à âncora com scroll do conteúdo, sem mudar de nó.
document.getElementById('action-faq').addEventListener('click', () => {
  document.getElementById('faq-section').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
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
