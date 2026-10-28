// Animações da home: rolagem suave (Lenis) + entradas com GSAP/ScrollTrigger/SplitText.
// Sem JS ou com "reduzir movimento", todo o conteúdo aparece parado e legível.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initHomeMotion() {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    document.documentElement.classList.add('has-motion');

    // rolagem suave só para quem não pediu "reduzir movimento"; senão fica a rolagem nativa
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // títulos que entram linha a linha; autoSplit refaz as linhas se a largura mudar
    const revealLines = (sel: string, stagger = 0.08) =>
      document.querySelectorAll<HTMLElement>(sel).forEach((el) =>
        SplitText.create(el, {
          type: 'lines', mask: 'lines', autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, { yPercent: 105, stagger, duration: 1.05, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } }),
        }),
      );

    /* 1. topo: um único momento orquestrado */
    const big = document.querySelector<HTMLElement>('[data-hero-big]');
    const num = document.querySelector<HTMLElement>('[data-hero-num]');
    const lead = document.querySelector<HTMLElement>('[data-hero-lead]');
    const claim = document.querySelector<HTMLElement>('[data-hero-claim]');
    if (big && num && lead && claim) {
      const s1 = SplitText.create(lead, { type: 'words', mask: 'words', wordsClass: 'dt-word', aria: 'none' });
      const s2 = SplitText.create(claim, { type: 'words', mask: 'words', wordsClass: 'dt-word', aria: 'none' });
      const counter = { v: 0 };
      // o menu não entra: navegação fica pronta desde o primeiro quadro
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('[data-hero-tag]', { autoAlpha: 0, y: 12, duration: 0.6 })
        .from(s2.words, { yPercent: 110, stagger: 0.06, duration: 0.9 }, '<')
        .from(big, { autoAlpha: 0, x: -24, duration: 0.9 }, '-=.5')
        .to(counter, { v: Number(num.textContent) || 29, duration: 1.6, ease: 'power3.out', onUpdate: () => { num.textContent = String(Math.round(counter.v)); } }, '<')
        .from('[data-hero-bar]', { scaleX: 0, duration: 1.6, ease: 'power3.out' }, '<')
        .from(s1.words, { yPercent: 110, stagger: 0.04, duration: 0.8 }, '<.1')
        .from('.dt-years span', { autoAlpha: 0, duration: 0.5, stagger: 0.2 }, '<')
        .from('[data-hero-cta]', { autoAlpha: 0, y: 10, duration: 0.6 }, '-=.9')
        .from('[data-hero-caption]', { autoAlpha: 0, y: 10, duration: 0.6 }, '-=.6');

      // ao rolar: o mapa se afasta e os títulos sobem em velocidades diferentes
      gsap.timeline({ scrollTrigger: { trigger: '.dt-hero', start: 'top top', end: 'bottom top', scrub: 0.6 } })
        .to('.dt-map', { scale: 0.82, yPercent: 18, autoAlpha: 0.2, ease: 'none' }, 0)
        .to('.dt-hero__copy', { yPercent: -25, ease: 'none' }, 0);
    }

    /* 2. faça parte: o executivo "sobe" para o palco */
    gsap.timeline({ scrollTrigger: { trigger: '.dt-join', start: 'top 75%', end: 'top 20%', scrub: 0.8 } })
      .from('.dt-person__disc', { scale: 0.6, autoAlpha: 0, ease: 'none' }, 0)
      .from('.dt-person__arc', { rotate: -160, autoAlpha: 0, ease: 'none' }, 0)
      .from('.dt-person img', { yPercent: 35, ease: 'none' }, 0);
    revealLines('.dt-join h2');
    // os três pontos entram juntos: a cascata da página fica só no topo
    gsap.from('.dt-join__points', { autoAlpha: 0, y: 16, duration: 0.5, ease: 'expo.out', scrollTrigger: { trigger: '.dt-join__points', start: 'top 88%', once: true } });

    /* 3 a 5 (clientes, treinamento, soluções): sem animação de entrada, o conteúdo já está no lugar */

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      document.documentElement.classList.remove('has-motion');
    };
  });

  // recalcula as posições quando fontes e imagens terminam de carregar
  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
