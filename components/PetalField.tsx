"use client";

import { useEffect, useRef } from "react";

/**
 * Falling petals on two transparent canvases: one behind the content and one in
 * front of it. Petals are drawn from pre-rendered sprites (no gradients or
 * filters per frame), the count adapts to the device, and the loop pauses when
 * the tab is hidden. Scrolling briefly speeds the petals up, which reinforces
 * the "camera moving forward" feel.
 */

type Petal = {
  x: number; y: number; size: number; vy: number;
  sway: number; freq: number; phase: number;
  rot: number; vr: number; flip: number; vf: number;
  sprite: number; alpha: number;
};

const COLORS: Array<[string, string]> = [
  ["#fbd5da", "#e48a9b"], // blush
  ["#f4a9b8", "#d1667e"], // rose
  ["#ffd98a", "#f0a11f"], // marigold
  ["#fff7ec", "#e6d0b0"], // ivory
];

function makeSprites(px: number, blur: boolean): HTMLCanvasElement[] {
  return COLORS.map(([light, dark]) => {
    const w = px;
    const h = Math.round(px * 1.3);
    const pad = blur ? Math.ceil(px * 0.08) : 0;
    const c = document.createElement("canvas");
    c.width = w + pad * 2;
    c.height = h + pad * 2;
    const g = c.getContext("2d");
    if (!g) return c;
    if (blur) g.filter = `blur(${Math.max(1, Math.round(px * 0.035))}px)`; // ignored where unsupported
    g.translate(pad, pad);
    const grad = g.createLinearGradient(0, 0, w * 0.4, h);
    grad.addColorStop(0, light);
    grad.addColorStop(1, dark);
    g.fillStyle = grad;
    g.beginPath();
    g.moveTo(w * 0.5, h * 0.02);
    g.bezierCurveTo(w * 1.08, h * 0.22, w * 0.98, h * 0.8, w * 0.5, h * 0.98);
    g.bezierCurveTo(w * 0.02, h * 0.8, w * -0.08, h * 0.22, w * 0.5, h * 0.02);
    g.fill();
    g.strokeStyle = "rgba(120,50,59,.18)";
    g.lineWidth = Math.max(1, px * 0.03);
    g.beginPath();
    g.moveTo(w * 0.5, h * 0.12);
    g.quadraticCurveTo(w * 0.52, h * 0.5, w * 0.5, h * 0.88);
    g.stroke();
    return c;
  });
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function spawn(layer: "back" | "front", w: number, h: number, scatter: boolean): Petal {
  const front = layer === "front";
  const size = front ? rand(22, 38) : rand(10, 18);
  return {
    x: rand(0, w),
    y: scatter ? rand(-h, 0) : -size * 1.4,
    size,
    vy: front ? rand(60, 105) : rand(30, 62),
    sway: front ? rand(18, 34) : rand(8, 18),
    freq: rand(0.6, 1.4),
    phase: rand(0, Math.PI * 2),
    rot: rand(0, Math.PI * 2),
    vr: rand(-1.1, 1.1),
    flip: rand(0, Math.PI * 2),
    vf: rand(1.2, 2.6),
    sprite: Math.floor(Math.random() * COLORS.length),
    alpha: front ? rand(0.8, 0.95) : rand(0.5, 0.75),
  };
}

export function PetalField({ active }: { active: boolean }) {
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const backCanvas = backRef.current;
    const frontCanvas = frontRef.current;
    const backCtx = backCanvas?.getContext("2d");
    const frontCtx = frontCanvas?.getContext("2d");
    if (!backCanvas || !frontCanvas || !backCtx || !frontCtx) return;

    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowEnd = (nav.hardwareConcurrency ?? 4) <= 4 || (nav.deviceMemory ?? 4) <= 2;
    let dpr = lowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    let w = window.innerWidth;
    let h = window.innerHeight;
    const wide = w > 900 ? 1.6 : 1;
    let counts = {
      back: Math.round((lowEnd ? 8 : 14) * wide),
      front: Math.round((lowEnd ? 4 : 6) * wide),
    };
    let level = 0; // how many times we have had to reduce quality
    let frontOn = true;

    let backSprites: HTMLCanvasElement[] = [];
    let frontSprites: HTMLCanvasElement[] = [];
    let back: Petal[] = [];
    let front: Petal[] = [];

    const build = () => {
      backSprites = makeSprites(Math.round(20 * dpr), false);
      frontSprites = makeSprites(Math.round(44 * dpr), true);
    };
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      for (const c of [backCanvas, frontCanvas]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
    };
    const fill = () => {
      while (back.length < counts.back) back.push(spawn("back", w, h, true));
      while (front.length < counts.front) front.push(spawn("front", w, h, true));
      back.length = Math.min(back.length, counts.back);
      front.length = Math.min(front.length, counts.front);
    };
    build();
    resize();
    fill();

    let raf = 0;
    let last = performance.now();
    let clock = 0;
    let avg = 1 / 60;
    let slowFrames = 0;
    let boost = 0;
    let lastY = window.scrollY;

    const drawLayer = (
      ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, list: Petal[],
      sprites: HTMLCanvasElement[], layer: "back" | "front", dt: number,
    ) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const speed = 1 + boost;
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        p.y += p.vy * speed * dt;
        p.x += Math.cos(clock * p.freq + p.phase) * p.sway * p.freq * dt + 6 * dt;
        p.rot += p.vr * dt;
        p.flip += p.vf * dt;
        if (p.y > h + p.size * 1.5 || p.x > w + p.size * 2) {
          list[i] = spawn(layer, w, h, false);
          continue;
        }
        const flat = Math.abs(Math.cos(p.flip));
        const sx = 0.2 + 0.8 * flat;
        const cos = Math.cos(p.rot);
        const sin = Math.sin(p.rot);
        ctx.setTransform(cos * sx * dpr, sin * sx * dpr, -sin * dpr, cos * dpr, p.x * dpr, p.y * dpr);
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * flat);
        const sw = p.size;
        const sh = p.size * 1.3;
        ctx.drawImage(sprites[p.sprite], -sw / 2, -sh / 2, sw, sh);
      }
      ctx.globalAlpha = 1;
    };

    const degrade = () => {
      level += 1;
      counts = { back: Math.max(4, Math.floor(counts.back * 0.6)), front: Math.max(2, Math.floor(counts.front * 0.6)) };
      if (dpr > 1) {
        dpr = 1;
        build();
        resize();
      }
      if (level >= 3 && frontOn) {
        frontOn = false;
        frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
        front = [];
        counts.front = 0;
      }
      fill();
      slowFrames = 0;
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      avg = avg * 0.92 + dt * 0.08;
      if (avg > 0.034 && level < 4) {
        if (++slowFrames > 45) degrade();
      } else {
        slowFrames = 0;
      }
      const y = window.scrollY;
      const v = dt > 0 ? Math.abs(y - lastY) / dt : 0;
      lastY = y;
      boost += (Math.min(1.6, v / 1000) - boost) * Math.min(1, dt * 5);

      drawLayer(backCtx, backCanvas, back, backSprites, "back", dt);
      if (frontOn) drawLayer(frontCtx, frontCanvas, front, frontSprites, "front", dt);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    const onResize = () => {
      if (window.innerWidth === w && Math.abs(window.innerHeight - h) < h * 0.25) return;
      resize();
      back = [];
      front = [];
      fill();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    start();
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, [active]);

  return (
    <>
      <canvas ref={backRef} className={`petals petals-back ${active ? "is-on" : ""}`} aria-hidden="true" />
      <canvas ref={frontRef} className={`petals petals-front ${active ? "is-on" : ""}`} aria-hidden="true" />
    </>
  );
}
