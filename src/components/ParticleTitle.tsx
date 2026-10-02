import { useEffect, useRef } from 'react';

type Dot = { x: number; y: number; homeX: number; homeY: number; vx: number; vy: number };
type Wave = { x: number; y: number; started: number };

export function ParticleTitle({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const root = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = root.current;
    const surface = canvas.current;
    if (!element || !surface) return;
    const context = surface.getContext('2d');
    const mask = document.createElement('canvas');
    const ink = mask.getContext('2d', { willReadFrequently: true });
    if (!context || !ink) return;

    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let waves: Wave[] = [];
    let frame = 0;
    let previous = 0;
    let visible = false;
    let vertical = true;
    let gap = 3;
    const pointer = { x: Infinity, y: Infinity };
    const clearPointer = () => { pointer.x = Infinity; pointer.y = Infinity; };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; };

    const paint = () => {
      context.clearRect(0, 0, width, height);
      for (const active of [false, true]) {
        context.beginPath();
        for (const dot of dots) {
          const displaced = Math.abs(dot.x - dot.homeX) + Math.abs(dot.y - dot.homeY) > 2;
          if (displaced !== active) continue;
          context.moveTo(dot.x + gap * .29, dot.y);
          context.arc(dot.x, dot.y, gap * .29, 0, Math.PI * 2);
        }
        context.fillStyle = active ? '#cefe46' : '#ececec';
        context.fill();
      }
    };

    const animate = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || reducedMotion) return;
      const dt = previous ? Math.min(2, (now - previous) / (1000 / 60)) : 1;
      previous = now;
      waves = waves.filter(wave => now - wave.started < 1000);
      let moving = waves.length > 0;
      const reach = vertical ? 68 : 44;
      dots.forEach((dot, index) => {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < reach) {
          const angle = distance > .01 ? Math.atan2(dy, dx) : index * 2.39996;
          const force = (1 - distance / reach) ** 2 * 2.8 * dt;
          dot.vx += Math.cos(angle) * force;
          dot.vy += Math.sin(angle) * force;
        }
        for (const wave of waves) {
          const dx = dot.homeX - wave.x;
          const dy = dot.homeY - wave.y;
          const distance = Math.hypot(dx, dy);
          const age = (now - wave.started) / 1000;
          const ring = 1 - Math.abs(distance - age * 720) / 35;
          if (ring > 0) {
            const angle = distance > .01 ? Math.atan2(dy, dx) : index * 2.39996;
            const impulse = ring * (1 - age) * 3.8 * dt;
            dot.vx += Math.cos(angle) * impulse;
            dot.vy += Math.sin(angle) * impulse;
          }
        }
        dot.vx += (dot.homeX - dot.x) * .075 * dt;
        dot.vy += (dot.homeY - dot.y) * .075 * dt;
        const damping = .8 ** dt;
        dot.vx *= damping; dot.vy *= damping;
        dot.x += dot.vx * dt; dot.y += dot.vy * dt;
        if (Math.abs(dot.x - dot.homeX) + Math.abs(dot.y - dot.homeY) + Math.abs(dot.vx) + Math.abs(dot.vy) < .12) {
          dot.x = dot.homeX; dot.y = dot.homeY; dot.vx = 0; dot.vy = 0;
        } else moving = true;
      });
      paint();
      if (moving) frame = requestAnimationFrame(animate);
      else previous = 0;
    };
    const wake = () => {
      if (!frame && visible && !document.hidden && !reducedMotion) frame = requestAnimationFrame(animate);
    };

    const resize = () => {
      stop(); clearPointer(); waves = [];
      width = element.clientWidth; height = element.clientHeight;
      if (!width || !height) return;
      vertical = matchMedia('(min-width: 768px)').matches;
      gap = vertical ? 3 : 2.4;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      surface.width = Math.round(width * ratio); surface.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      mask.width = Math.round(width); mask.height = Math.round(height);
      const family = getComputedStyle(element).fontFamily;
      ink.font = `900 100px ${family}`;
      const available = Math.max(1, (vertical ? height : width) - (vertical ? 88 : 32));
      const fontSize = Math.min(vertical ? 60 : 32, available / ink.measureText('CREATIVE PORTFOLIO').width * 100);
      ink.font = `900 ${fontSize}px ${family}`;
      ink.textAlign = 'center'; ink.textBaseline = 'middle'; ink.fillStyle = '#fff';
      ink.translate(width / 2, height / 2);
      if (vertical) ink.rotate(-Math.PI / 2);
      ink.fillText('CREATIVE PORTFOLIO', 0, 0);
      const pixels = ink.getImageData(0, 0, mask.width, mask.height).data;
      dots = [];
      for (let y = gap / 2, row = 0; y < height; y += gap, row++) {
        for (let x = gap / 2 + row % 2 * gap / 2; x < width; x += gap) {
          const alpha = pixels[(Math.floor(y) * mask.width + Math.floor(x)) * 4 + 3];
          if (alpha > 110) dots.push({ x, y, homeX: x, homeY: y, vx: 0, vy: 0 });
        }
      }
      paint();
      if (dots.length) element.dataset.ready = 'true';
      else delete element.dataset.ready;
    };
    const move = (event: PointerEvent) => {
      if (reducedMotion || event.pointerType === 'touch') return;
      const rect = element.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) * width / rect.width;
      pointer.y = (event.clientY - rect.top) * height / rect.height;
      wake();
    };
    const leave = () => { clearPointer(); wake(); };
    const press = (event: MouseEvent) => {
      if (reducedMotion) return;
      const rect = element.getBoundingClientRect();
      const keyboard = event.detail === 0;
      const x = keyboard ? width / 2 : (event.clientX - rect.left) * width / rect.width;
      const y = keyboard ? height / 2 : (event.clientY - rect.top) * height / rect.height;
      waves.push({ x, y, started: performance.now() });
      if (waves.length > 4) waves.shift();
      wake();
    };
    const visibility = () => { if (document.hidden) { clearPointer(); stop(); } else wake(); };
    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake(); else { clearPointer(); stop(); }
    });
    resize(); observer.observe(element); intersection.observe(element);
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', leave);
    element.addEventListener('pointercancel', leave);
    element.addEventListener('click', press);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      stop(); observer.disconnect(); intersection.disconnect();
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
      element.removeEventListener('pointercancel', leave);
      element.removeEventListener('click', press);
      document.removeEventListener('visibilitychange', visibility);
      delete element.dataset.ready;
    };
  }, [reducedMotion]);

  return <button ref={root} type="button" className="portfolio-particle-title" disabled={reducedMotion}
    aria-label="CREATIVE PORTFOLIO — interactive particles" title={reducedMotion ? 'CREATIVE PORTFOLIO' : 'Move over the letters or press for a wave'}>
    <span className="portfolio-particle-fallback" aria-hidden="true">CREATIVE PORTFOLIO</span>
    <canvas ref={canvas} aria-hidden="true" />
  </button>;
}
