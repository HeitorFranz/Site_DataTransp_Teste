// Animações da home: rolagem suave (Lenis) + entradas com GSAP/ScrollTrigger/SplitText.
// Sem JS ou com "reduzir movimento", todo o conteúdo aparece parado e legível.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initHomeMotion() {
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // luz que segue o cursor nos cards (efeito SpotlightCard do React Bits)
  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    document.documentElement.classList.add('has-motion');

    // títulos que entram linha a linha; autoSplit refaz as linhas se a largura mudar
    const revealLines = (sel: string, stagger = 0.08) =>
      document.querySelectorAll<HTMLElement>(sel).forEach((el) =>
        SplitText.create(el, {
          type: 'lines', mask: 'lines', autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, { yPercent: 105, stagger, duration: 1.05, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } }),
        }),
      );

    /* 1. topo: um único momento orquestrado */
    const lead = document.querySelector<HTMLElement>('[data-hero-lead]');
    const claim = document.querySelector<HTMLElement>('[data-hero-claim]');
    if (lead && claim) {
      const s1 = SplitText.create(lead, { type: 'words,chars', mask: 'words', wordsClass: 'dt-word' });
      const s2 = SplitText.create(claim, { type: 'words', mask: 'words', wordsClass: 'dt-word' });
      const num = s1.words[0] as HTMLElement;
      const counter = { v: 0 };
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.header', { y: -40, autoAlpha: 0, duration: 0.9 })
        .from(s1.chars, { yPercent: 115, rotationX: -70, transformOrigin: '50% 100%', stagger: 0.014, duration: 1 }, '-=.5')
        .to(counter, { v: 29, duration: 1.4, ease: 'power3.out', onUpdate: () => { num.textContent = String(Math.round(counter.v)); } }, '<+=.15')
        .from('[data-hero-tag]', { autoAlpha: 0, y: 12, duration: 0.6 }, '-=.6')
        .from(s2.words, { yPercent: 110, stagger: 0.06, duration: 0.9 }, '<')
        .from('[data-hero-caption]', { autoAlpha: 0, y: 10, duration: 0.6 }, '-=.3');

      // ao rolar: o mapa se afasta e os títulos sobem em velocidades diferentes
      gsap.timeline({ scrollTrigger: { trigger: '.dt-hero', start: 'top top', end: 'bottom top', scrub: 0.6 } })
        .to('.dt-map', { scale: 0.82, yPercent: 18, autoAlpha: 0.2, ease: 'none' }, 0)
        .to('.dt-lead', { yPercent: -40, ease: 'none' }, 0)
        .to('.dt-claim', { yPercent: -70, ease: 'none' }, 0);
    }

    /* 2. faça parte: o executivo "sobe" para o palco */
    gsap.timeline({ scrollTrigger: { trigger: '.dt-join', start: 'top 75%', end: 'top 20%', scrub: 0.8 } })
      .from('.dt-person__disc', { scale: 0.6, autoAlpha: 0, ease: 'none' }, 0)
      .from('.dt-person__arc', { rotate: -160, autoAlpha: 0, ease: 'none' }, 0)
      .from('.dt-person img', { yPercent: 35, ease: 'none' }, 0);
    revealLines('.dt-join h2');
    ScrollTrigger.batch('.dt-join__points li', { start: 'top 88%', once: true, onEnter: (b) => gsap.from(b, { autoAlpha: 0, x: 40, stagger: 0.12, duration: 0.9, ease: 'expo.out' }) });

    /* 3. clientes */
    revealLines('.dt-clients h2');
    ScrollTrigger.batch('.dt-quote', { start: 'top 88%', once: true, onEnter: (b) => gsap.from(b, { y: 50, autoAlpha: 0, stagger: 0.1, duration: 0.9, ease: 'expo.out' }) });

    /* 4. treinamento: foto revelada por cortina */
    gsap.timeline({ scrollTrigger: { trigger: '.dt-care', start: 'top 70%' }, defaults: { ease: 'expo.out' } })
      .from('.dt-care__photo img', { clipPath: 'inset(0 0 100% 0 round 16px)', duration: 1.3 })
      .from('.dt-care__float', { y: 30, autoAlpha: 0, duration: 0.8 }, '-=.6');
    revealLines('.dt-care h2');
    ScrollTrigger.batch('.dt-care__steps li', { start: 'top 88%', once: true, onEnter: (b) => gsap.from(b, { x: 40, autoAlpha: 0, stagger: 0.12, duration: 0.9, ease: 'expo.out' }) });

    /* 5. soluções */
    revealLines('.dt-solutions__title', 0.1);
    ScrollTrigger.batch('.dt-module', { start: 'top 90%', once: true, onEnter: (b) => gsap.from(b, { y: 40, autoAlpha: 0, scale: 0.96, stagger: 0.07, duration: 0.8, ease: 'expo.out' }) });

    return () => document.documentElement.classList.remove('has-motion');
  });

  // recalcula as posições quando fontes e imagens terminam de carregar
  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
