"use client";

import React, { useEffect, useRef, useCallback } from "react";

const COLORS = [
  "#ff4b4b", "#ff7d36", "#ffa828", "#ffcc2a", "#b7ff54",
  "#8dff55", "#00ffaa", "#26f2d5", "#05dbe9", "#4d9cff",
  "#7c85ff", "#c06ddf", "#e962bf", "#ff718b",
];

interface Dot {
  x: number;
  y: number;
  col: number;
  row: number;
  baseR: number;
  r: number;
  color: string;
  alpha: number;
  targetAlpha: number;
  targetR: number;
  phase: number;
  hue: number;
}

export default function AnimatedDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const tRef = useRef(0);
  const wavesRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const GAP = 28;

  const init = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.offsetWidth;
    const h = c.offsetHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    const ctx = c.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.ceil(w / GAP) + 1;
    const rows = Math.ceil(h / GAP) + 1;
    const ox = (w - (cols - 1) * GAP) / 2;
    const oy = (h - (rows - 1) * GAP) / 2;

    dotsRef.current = [];
    for (let r = 0; r < rows; r++) {
      for (let cl = 0; cl < cols; cl++) {
        const ci = (cl + r) % COLORS.length;
        dotsRef.current.push({
          x: ox + cl * GAP,
          y: oy + r * GAP,
          col: cl, row: r,
          baseR: 1.8,
          r: 1.8,
          color: COLORS[ci],
          alpha: 0.08,
          targetAlpha: 0.08,
          targetR: 1.8,
          phase: (cl + r) * 0.3,
          hue: ci / COLORS.length,
        });
      }
    }
  }, []);

  useEffect(() => {
    init();
    window.addEventListener("resize", init);

    const c = canvasRef.current;
    const onMove = (e: MouseEvent) => {
      if (!c) return;
      const rect = c.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onTouch = (e: TouchEvent) => {
      if (!c || e.touches.length === 0) return;
      const rect = c.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    c?.addEventListener("mousemove", onMove);
    c?.addEventListener("mouseleave", onLeave);
    c?.addEventListener("touchstart", onTouch, { passive: true });
    c?.addEventListener("touchmove", onTouch, { passive: true });
    c?.addEventListener("touchend", onLeave);

    // Periodic radial wave bursts
    let waveTimer: NodeJS.Timeout;
    const scheduleWave = () => {
      waveTimer = setTimeout(() => {
        if (c) {
          const w = c.offsetWidth;
          const h = c.offsetHeight;
          wavesRef.current.push({
            x: Math.random() * w,
            y: Math.random() * h,
            t: tRef.current,
          });
          if (wavesRef.current.length > 3) wavesRef.current.shift();
        }
        scheduleWave();
      }, 2500 + Math.random() * 3000);
    };
    scheduleWave();

    // Color sweep — a diagonal line that sweeps across, re-coloring dots
    let sweepPhase = 0;

    function frame() {
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const w = c.offsetWidth;
      const h = c.offsetHeight;
      tRef.current += 0.016;
      sweepPhase += 0.002;

      ctx.clearRect(0, 0, w * dpr, h * dpr);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mRadius = 140;

      // Connection lines for nearby dots near mouse
      const nearMouse: Dot[] = [];

      for (const dot of dotsRef.current) {
        const dx = dot.x - mx;
        const dy = dot.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let tR = dot.baseR;
        let tA = 0.08;

        // Mouse proximity
        if (dist < mRadius) {
          const p = 1 - dist / mRadius;
          const easedP = p * p; // quadratic ease for smoother falloff
          tR = dot.baseR + easedP * 6;
          tA = 0.15 + easedP * 0.85;
          nearMouse.push(dot);
        }

        // Radial waves
        for (const wave of wavesRef.current) {
          const wdx = dot.x - wave.x;
          const wdy = dot.y - wave.y;
          const wDist = Math.sqrt(wdx * wdx + wdy * wdy);
          const elapsed = tRef.current - wave.t;
          const wavePos = elapsed * 280;
          const waveDelta = Math.abs(wDist - wavePos);
          if (waveDelta < 50) {
            const wp = 1 - waveDelta / 50;
            tA = Math.max(tA, 0.3 + wp * 0.7);
            tR = Math.max(tR, dot.baseR + wp * 4);
          }
        }

        // Diagonal color sweep
        const diagPos = (dot.x + dot.y) / (w + h);
        const sweepDist = Math.abs(diagPos - (sweepPhase % 1));
        if (sweepDist < 0.06) {
          const sp = 1 - sweepDist / 0.06;
          tA = Math.max(tA, 0.2 + sp * 0.5);
          tR = Math.max(tR, dot.baseR + sp * 2);
          // Shift color index
          const newIdx = Math.floor((tRef.current * 2 + dot.phase) % COLORS.length);
          dot.color = COLORS[newIdx];
        }

        // Ambient pulse
        tA += Math.sin(tRef.current * 0.8 + dot.phase) * 0.02;

        // Smooth lerp
        dot.r += (tR - dot.r) * 0.12;
        dot.alpha += (tA - dot.alpha) * 0.08;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, Math.max(0.5, dot.r), 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, dot.alpha));
        ctx.fill();
      }

      // Draw connecting lines between nearby dots close to mouse
      if (nearMouse.length > 1) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < nearMouse.length; i++) {
          for (let j = i + 1; j < nearMouse.length; j++) {
            const a = nearMouse[i];
            const b = nearMouse[j];
            const d = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
            if (d < GAP * 2) {
              const lineAlpha = (1 - d / (GAP * 2)) * 0.25;
              ctx.globalAlpha = lineAlpha;
              ctx.strokeStyle = a.color;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(frame);
    }

    frameRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameRef.current);
      clearTimeout(waveTimer);
      window.removeEventListener("resize", init);
      c?.removeEventListener("mousemove", onMove);
      c?.removeEventListener("mouseleave", onLeave);
      c?.removeEventListener("touchstart", onTouch);
      c?.removeEventListener("touchmove", onTouch);
      c?.removeEventListener("touchend", onLeave);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="hero-grid-canvas"
      style={{ pointerEvents: "auto" }}
    />
  );
}
