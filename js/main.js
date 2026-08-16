// ── Arranque ────────────────────────────────────────────

buildProducts();

// ── FAQ: acordeão ───────────────────────────────────────
// Uma resposta aberta de cada vez — a lista fechada cabe sempre
// no ecrã, que é o que o formato sem scroll exige.
function setupFaq() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');

    q.addEventListener('click', () => {
      const isOpen = q.getAttribute('aria-expanded') === 'true';

      items.forEach(other => {
        if (other === item) return;
        const oq = other.querySelector('.faq-q');
        if (oq.getAttribute('aria-expanded') !== 'true') return;
        oq.setAttribute('aria-expanded', 'false');
        gsap.to(other.querySelector('.faq-a'), { height: 0, duration: 0.4, ease: 'power2.inOut' });
      });

      q.setAttribute('aria-expanded', String(!isOpen));
      gsap.to(a, { height: isOpen ? 0 : 'auto', duration: 0.4, ease: 'power2.inOut' });
    });
  });
}

setupFaq();

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
