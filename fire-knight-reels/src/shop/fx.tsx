import React from "react";
import { AbsoluteFill } from "remotion";
import { REAL, noise1, rand } from "../fk/theme";

/** Camera: world = frame coordinates at z 1. The world point (cx, cy) lands on the screen anchor (ax, ay). */
export type Cam = { z: number; cx: number; cy: number; ax?: number; ay?: number; sx?: number; sy?: number };

export const CamView: React.FC<{ cam: Cam; children: React.ReactNode; style?: React.CSSProperties }> = ({ cam, children, style }) => {
  const ax = cam.ax ?? 540;
  const ay = cam.ay ?? 960;
  const tx = ax - cam.cx * cam.z + (cam.sx ?? 0);
  const ty = ay - cam.cy * cam.z + (cam.sy ?? 0);
  return (
    <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${cam.z})`, ...style }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ overflow: "visible", position: "absolute", inset: 0 }}>
        {children}
      </svg>
    </AbsoluteFill>
  );
};

/** World point -> screen point for a camera. */
export const toScreen = (cam: Cam, x: number, y: number) => ({
  x: (cam.ax ?? 540) + (x - cam.cx) * cam.z + (cam.sx ?? 0),
  y: (cam.ay ?? 960) + (y - cam.cy) * cam.z + (cam.sy ?? 0),
});

/**
 * Rising smoke from a set of emitters (real grey smoke, never brand-coloured).
 * `amount` 0..1 sets density, `t` is the frame.
 */
export const Smoke: React.FC<{
  id: string;
  t: number;
  amount: number;
  emit: { x: number; y: number; w: number }[];
  rise?: number;
  size?: number;
  tone?: string;
}> = ({ id, t, amount, emit, rise = 520, size = 70, tone = "#7d7d80" }) => {
  if (amount <= 0) return null;
  const puffs: React.ReactNode[] = [];
  const per = 16;
  emit.forEach((e, ei) => {
    for (let i = 0; i < per; i++) {
      const seed = ei * 31 + i * 7.3;
      const life = 70 + rand(seed) * 40;
      const age = ((t + rand(seed + 1) * life) % life) / life; // 0..1
      const x0 = e.x + (rand(seed + 2) - 0.5) * e.w;
      const drift = noise1(t * 0.02 + seed, 3) * 60 * age + age * 40;
      const r = size * (0.5 + age * 1.6) * (0.8 + rand(seed + 3) * 0.4);
      const o = Math.sin(Math.PI * Math.min(1, age * 1.15)) * 0.32 * amount;
      puffs.push(<ellipse key={`${ei}-${i}`} cx={x0 + drift} cy={e.y - age * rise} rx={r} ry={r * 0.78} fill={tone} opacity={o} />);
    }
  });
  return (
    <g filter={`url(#${id}Blur)`}>
      <defs>
        <filter id={`${id}Blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={size * 0.55} />
        </filter>
      </defs>
      {puffs}
    </g>
  );
};

/** A small real fire: layered tongues, flickering. Base centre (x, y), height h. */
export const Flame: React.FC<{ id: string; x: number; y: number; h: number; t: number; w?: number }> = ({ id, x, y, h, t, w = 0.5 }) => {
  if (h <= 1) return null;
  const tongue = (k: number, scale: number, color: string, op: number) => {
    const hh = h * scale * (0.85 + 0.25 * noise1(t * 0.35 + k * 3, k));
    const ww = h * w * scale;
    const lean = noise1(t * 0.22 + k, k + 4) * ww * 0.5;
    const d = `M${x - ww} ${y} C ${x - ww} ${y - hh * 0.45}, ${x - ww * 0.2 + lean} ${y - hh * 0.6}, ${x + lean} ${y - hh}
      C ${x + ww * 0.25 + lean} ${y - hh * 0.6}, ${x + ww} ${y - hh * 0.42}, ${x + ww} ${y} Z`;
    return <path key={k} d={d} fill={color} opacity={op} />;
  };
  return (
    <g>
      <defs>
        <radialGradient id={`${id}Glow`}>
          <stop offset="0" stopColor={REAL.fireOrange} stopOpacity="0.55" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}Soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={Math.max(1, h * 0.04)} />
        </filter>
      </defs>
      <ellipse cx={x} cy={y - h * 0.35} rx={h * 1.6} ry={h * 1.3} fill={`url(#${id}Glow)`} />
      <g filter={`url(#${id}Soft)`}>
        {tongue(1, 1, REAL.fireRed, 0.85)}
        {tongue(2, 0.82, REAL.fireOrange, 0.95)}
        {tongue(3, 0.58, REAL.fireYellow, 1)}
        {tongue(4, 0.32, REAL.fireCore, 1)}
      </g>
    </g>
  );
};

/** Fine water mist from a nozzle: a cone of droplets falling to the floor. */
export const Mist: React.FC<{ id: string; x: number; y: number; floor: number; spread: number; t: number; amount: number }> = ({
  id,
  x,
  y,
  floor,
  spread,
  t,
  amount,
}) => {
  if (amount <= 0) return null;
  const drops: React.ReactNode[] = [];
  const H = floor - y;
  for (let i = 0; i < 90; i++) {
    const s = i * 1.37 + x;
    const sp = 0.6 + rand(s) * 0.6;
    const age = ((t * 0.035 * sp + rand(s + 1)) % 1);
    const a = (rand(s + 2) - 0.5) * 2; // -1..1 across the cone
    const reach = Math.min(1, age / Math.max(0.05, amount));
    const py = y + age * H * reach;
    const px = x + a * spread * age;
    drops.push(<circle key={i} cx={px} cy={py} r={1.4 + rand(s + 3) * 1.8} fill="#E9F3FA" opacity={0.55 * (1 - age * 0.6) * Math.min(1, amount * 1.5)} />);
  }
  return (
    <g>
      <defs>
        <linearGradient id={`${id}Cone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9F3FA" stopOpacity="0.5" />
          <stop offset="1" stopColor="#E9F3FA" stopOpacity="0.04" />
        </linearGradient>
        <filter id={`${id}Haze`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <polygon
        points={`${x - 6},${y} ${x + 6},${y} ${x + spread},${y + H * Math.min(1, amount)} ${x - spread},${y + H * Math.min(1, amount)}`}
        fill={`url(#${id}Cone)`}
        filter={`url(#${id}Haze)`}
        opacity={Math.min(1, amount * 1.4)}
      />
      {drops}
    </g>
  );
};
