// Mapa do topo da home: pontos do Brasil em canvas, onda saindo da sede,
// rotas com "caminhões" de luz e reação ao cursor (inclinação 3D e brilho).
import { brasilOutline as BR, destinos, sede } from '../data/brasil';

type Route = { x: number; y: number; cx: number; cy: number; off: number };

export function initHomeMap(box: HTMLElement) {
  const cv = box.querySelector<HTMLCanvasElement>('canvas');
  const tilt = box.querySelector<HTMLElement>('[data-tilt]');
  const ctx = cv?.getContext('2d');
  if (!cv || !tilt || !ctx) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [hqX, hqY] = sede;

  const inside = (x: number, y: number) => {
    let c = false;
    for (let i = 0, j = BR.length - 1; i < BR.length; j = i++) {
      const [xi, yi] = BR[i], [xj, yj] = BR[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };

  const STEP = 1.55;
  const dots: { x: number; y: number; d: number; seed: number }[] = [];
  for (let y = 0; y <= 100; y += STEP)
    for (let x = 0; x <= 100; x += STEP)
      if (inside(x, y)) dots.push({ x, y, d: Math.hypot(x - hqX, y - hqY), seed: Math.random() });

  const routes: Route[] = destinos.map(([x, y]) => {
    const dx = x - hqX, dy = y - hqY, k = 0.22 * (dx >= 0 ? 1 : -1);
    return { x, y, cx: (hqX + x) / 2 - dy * k, cy: (hqY + y) / 2 + dx * k, off: Math.random() };
  });
  const bez = (r: Route, t: number) => {
    const u = 1 - t;
    return [u * u * hqX + 2 * u * t * r.cx + t * t * r.x, u * u * hqY + 2 * u * t * r.cy + t * t * r.y] as const;
  };

  let W = 0, H = 0, S = 1, OX = 0, OY = 0, dpr = 1;
  let mouse: [number, number] | null = null;
  const t0 = performance.now();

  const size = () => {
    dpr = Math.min(2, devicePixelRatio || 1);
    const r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    S = Math.min(W, H) / 104; OX = (W - 100 * S) / 2; OY = (H - 100 * S) / 2;
  };
  size();
  addEventListener('resize', size);
  const P = (x: number, y: number) => [OX + x * S, OY + y * S] as const;

  box.addEventListener('pointermove', (e) => {
    const r = box.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    mouse = [mx, my];
    if (!reduce) tilt.style.transform = `rotateX(${(my / r.height - 0.5) * -10}deg) rotateY(${(mx / r.width - 0.5) * 12}deg)`;
  });
  box.addEventListener('pointerleave', () => { mouse = null; tilt.style.transform = ''; });

  let onScreen = true, running = true;

  const draw = (now: number) => {
    const t = (now - t0) / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const intro = reduce ? 999 : t * 42;              // frente da onda inicial
    const ripple = reduce ? -99 : ((t - 2.2) % 3.6) * 40; // onda que sai da sede a cada 3,6 s

    for (const p of dots) {
      if (p.d > intro) continue;
      const born = Math.min(1, (intro - p.d) / 8);
      let r = S * 0.33 * born, a = 0.32 + 0.18 * p.seed, col = '169,196,238';
      const dr = Math.abs(p.d - ripple);
      if (t > 2.2 && dr < 5) { const k = 1 - dr / 5; a += 0.55 * k; r += S * 0.22 * k; }
      const [px, py] = P(p.x, p.y);
      if (mouse) {
        const dm = Math.hypot(px - mouse[0], py - mouse[1]);
        if (dm < 70) { const k = 1 - dm / 70; r += S * 0.4 * k; a += 0.6 * k; if (k > 0.5) col = '255,120,118'; }
      }
      ctx.fillStyle = `rgba(${col},${Math.min(1, a) * born})`;
      ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill();
    }

    if (t > 0.6 || reduce) {
      ctx.globalAlpha = reduce ? 1 : Math.min(1, (t - 0.6) * 1.5);
      ctx.strokeStyle = 'rgba(143,178,230,.55)'; ctx.lineWidth = 1;
      ctx.beginPath();
      BR.forEach(([x, y], i) => { const [a, b] = P(x, y); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); });
      ctx.closePath(); ctx.stroke(); ctx.globalAlpha = 1;
    }

    routes.forEach((r, i) => {
      const start = 1.2 + i * 0.08;
      const grow = reduce ? 1 : Math.min(1, Math.max(0, (t - start) / 1.1));
      if (grow <= 0) return;
      ctx.setLineDash([S * 1.1, S * 0.9]); ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(242,245,250,.55)';
      ctx.beginPath();
      for (let s = 0; s <= grow + 1e-6; s += 0.02) { const [x, y] = bez(r, Math.min(s, grow)); const [a, b] = P(x, y); s ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }
      ctx.stroke(); ctx.setLineDash([]);
      if (grow < 1) return;
      const [ex, ey] = P(r.x, r.y);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex, ey, S * 0.55, 0, 7); ctx.fill();
      if (reduce) return;
      const q = (t * 0.28 + r.off) % 1;
      for (let k = 0; k < 10; k++) {
        const tt = q - k * 0.012; if (tt < 0) continue;
        const [x, y] = bez(r, tt); const [a, b] = P(x, y);
        ctx.fillStyle = `rgba(255,${80 + k * 12},${78 + k * 12},${1 - k / 10})`;
        ctx.beginPath(); ctx.arc(a, b, S * (0.75 - k * 0.05), 0, 7); ctx.fill();
      }
      if (q > 0.96) {
        const k = (q - 0.96) / 0.04;
        ctx.strokeStyle = `rgba(255,255,255,${1 - k})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(ex, ey, S * (0.6 + k * 2.6), 0, 7); ctx.stroke();
      }
    });

    const [hx, hy] = P(hqX, hqY);
    const pulse = reduce ? 0 : (t % 1.8) / 1.8;
    ctx.strokeStyle = `rgba(233,7,5,${1 - pulse})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(hx, hy, S * (1.2 + pulse * 3.5), 0, 7); ctx.stroke();
    ctx.fillStyle = '#e90705'; ctx.beginPath(); ctx.arc(hx, hy, S * 1.25, 0, 7); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

    if (!reduce && onScreen) requestAnimationFrame(draw);
    else running = false;
  };

  // só anima enquanto o mapa está na tela
  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen && !running && !reduce) { running = true; requestAnimationFrame(draw); }
  }).observe(box);
  requestAnimationFrame(draw);
}
