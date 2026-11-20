import React from "react";
import { REAL, noise1, rand } from "../fk/theme";
import { Smoke } from "./fx";

/**
 * A narrow market lane in one-point perspective (frame coordinates). Shutters both sides,
 * scooters parked along the walls, a mat of overhead wires, and at the far mouth of the lane a
 * fire tender that is wider than the gap - its beacons flashing, unable to come in.
 */
const VP = { x: 540, y: 1060 };
const FOC = 520; // px per metre at depth 1
const P = (X: number, Y: number, Z: number) => ({ x: VP.x + (X / Z) * FOC, y: VP.y + (Y / Z) * FOC });
const HALF = 1.7; // lane half-width (m)
const EYE = 1.6;

const quad = (a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }, d: { x: number; y: number }) =>
  `${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`;

export const Gali: React.FC<{ t: number; beacon?: number; smoke?: number; push?: number }> = ({ t, beacon = 1, smoke = 0, push = 0 }) => {
  const z0 = 0.9 - push * 0.25;
  const Zs = [z0, 2, 3.2, 4.6, 6.2, 8, 10.2, 13];
  const flashA = beacon * (Math.sin(t * 0.6) > 0.2 ? 1 : 0.1);
  const flashB = beacon * (Math.sin(t * 0.6 + Math.PI) > 0.2 ? 1 : 0.1);
  const truckZ = 12;
  const tw = 1.25; // tender half-width
  const tl = P(-tw, EYE, truckZ);
  const tr = P(tw, EYE - 2.9, truckZ);
  const walls: React.ReactNode[] = [];
  for (let i = Zs.length - 2; i >= 0; i--) {
    const za = Zs[i];
    const zb = Zs[i + 1];
    [-1, 1].forEach((side) => {
      const X = side * HALF;
      const tone = (i + (side > 0 ? 1 : 0)) % 3;
      const shutterC = ["#6f757c", "#4f6b56", "#5b6f8c"][tone];
      const wallC = ["#4a3f33", "#3e372f", "#463b30"][tone];
      walls.push(
        <g key={`${i}${side}`}>
          {/* wall above shutter */}
          <polygon points={quad(P(X, EYE - 5, za), P(X, EYE - 5, zb), P(X, EYE - 2.9, zb), P(X, EYE - 2.9, za))} fill={wallC} />
          {/* sign band */}
          <polygon points={quad(P(X, EYE - 2.9, za), P(X, EYE - 2.9, zb), P(X, EYE - 2.5, zb), P(X, EYE - 2.5, za))} fill={["#7a5a12", "#123a6b", "#6e1a16"][tone]} opacity={0.6} />
          {/* shutter */}
          <polygon points={quad(P(X, EYE - 2.5, za), P(X, EYE - 2.5, zb), P(X, EYE, zb), P(X, EYE, za))} fill={shutterC} />
          {Array.from({ length: 12 }).map((_, k) => {
            const y = EYE - 2.5 + (k / 12) * 2.5;
            const a = P(X, y, za);
            const b = P(X, y, zb);
            return <line key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#000" strokeWidth={1.2} opacity={0.35} />;
          })}
          {/* pillar */}
          <polygon points={quad(P(X, EYE - 5, za), P(X, EYE - 5, za + 0.25), P(X, EYE, za + 0.25), P(X, EYE, za))} fill="#4a4036" />
        </g>,
      );
    });
  }
  // scooters parked along both walls, narrowing the lane
  const scooters: React.ReactNode[] = [];
  [2.4, 3.5, 4.8, 6.2, 7.8, 9.6, 11].forEach((Z, i) => {
    const side = i % 2 ? 1 : -1;
    const X = side * (HALF - 0.55);
    const base = P(X, EYE, Z);
    const s = FOC / Z / 520;
    scooters.push(
      <g key={i} transform={`translate(${base.x} ${base.y}) scale(${s})`}>
        <ellipse cx={0} cy={0} rx={170} ry={22} fill="#000" opacity={0.55} />
        {/* rear tyre */}
        <rect x={-26} y={-130} width={52} height={130} rx={24} fill="#0b0b0b" />
        {/* rear cowl */}
        <path d="M-100 -110 L -150 -290 Q 0 -320 150 -290 L 100 -110 Q 0 -96 -100 -110 Z" fill={["#2a2d33", "#6a1f1a", "#22385a"][i % 3]} />
        <path d="M-140 -280 Q 0 -306 140 -280 L 132 -262 Q 0 -286 -132 -262 Z" fill="#fff" opacity={0.12} />
        {/* tail light + plate */}
        <rect x={-70} y={-258} width={140} height={30} rx={10} fill={REAL.tailRed} />
        <rect x={-62} y={-254} width={124} height={8} rx={4} fill="#ff7a6a" opacity={0.45} />
        <rect x={-46} y={-200} width={92} height={46} rx={4} fill="#e6e2d6" opacity={0.8} />
        {/* seat + handlebar */}
        <rect x={-120} y={-350} width={240} height={50} rx={24} fill="#111" />
        <rect x={-190} y={-420} width={380} height={10} rx={5} fill="#1a1a1a" />
        <rect x={-210} y={-424} width={40} height={18} rx={6} fill="#222" />
        <rect x={170} y={-424} width={40} height={18} rx={6} fill="#222" />
        <rect x={-150} y={-470} width={40} height={30} rx={6} fill="#2b2b2b" />
        <rect x={110} y={-470} width={40} height={30} rx={6} fill="#2b2b2b" />
      </g>,
    );
  });
  // overhead wire mat
  const wires: React.ReactNode[] = [];
  for (let i = 0; i < 34; i++) {
    const za = 1.2 + rand(i) * 12;
    const zb = za + (rand(i + 1) - 0.5) * 4;
    const a = P(-HALF, EYE - 4.2 - rand(i + 2) * 0.8, za);
    const b = P(HALF, EYE - 4.2 - rand(i + 3) * 0.8, Math.max(1, zb));
    const sag = (40 + rand(i + 4) * 90) / Math.min(za, zb);
    wires.push(<path key={i} d={`M${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${(a.y + b.y) / 2 + sag} ${b.x} ${b.y}`} stroke="#050505" strokeWidth={Math.max(1, 5 / za)} fill="none" />);
  }
  const g0 = P(-HALF, EYE, z0);
  const g1 = P(HALF, EYE, z0);
  const g2 = P(HALF, EYE, 30);
  const g3 = P(-HALF, EYE, 30);
  return (
    <g>
      <defs>
        <radialGradient id="gaBeacon" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${VP.x} ${tr.y}) scale(700 520)`}>
          <stop offset="0" stopColor={REAL.lampRed} stopOpacity="0.55" />
          <stop offset="1" stopColor={REAL.lampRed} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gaBeacon2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${VP.x} ${tr.y}) scale(700 520)`}>
          <stop offset="0" stopColor={REAL.beacon} stopOpacity="0.45" />
          <stop offset="1" stopColor={REAL.beacon} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gaHead" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF6E0" stopOpacity="1" />
          <stop offset="1" stopColor="#FFF6E0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={-200} y={0} width={1480} height={1920} fill="#060606" />
      {/* lane floor */}
      <polygon points={quad(g0, g1, g2, g3)} fill="#1d1b19" />
      <line x1={VP.x} y1={P(0, EYE, 30).y} x2={VP.x} y2={g0.y} stroke="#0e2a12" strokeWidth={10} opacity={0.4} />
      {/* fire tender at the mouth of the lane */}
      <g>
        <rect x={tl.x} y={tr.y} width={tr.x - tl.x} height={tl.y - tr.y} fill="#8e1610" />
        <rect x={tl.x + 4} y={tr.y + 6} width={tr.x - tl.x - 8} height={(tl.y - tr.y) * 0.32} fill="#0e1418" />
        <rect x={tl.x} y={tr.y + (tl.y - tr.y) * 0.62} width={tr.x - tl.x} height={4} fill="#f0f0f0" opacity={0.7} />
        <circle cx={tl.x + 14} cy={tl.y - 22} r={9} fill="url(#gaHead)" />
        <circle cx={tr.x - 14} cy={tl.y - 22} r={9} fill="url(#gaHead)" />
        <rect x={tl.x + 10} y={tr.y - 8} width={18} height={8} rx={3} fill={REAL.lampRed} opacity={0.3 + 0.7 * flashA} />
        <rect x={tr.x - 28} y={tr.y - 8} width={18} height={8} rx={3} fill={REAL.beacon} opacity={0.3 + 0.7 * flashB} />
      </g>
      <g style={{ mixBlendMode: "screen" }}>
        <rect x={-200} y={0} width={1480} height={1920} fill="url(#gaBeacon)" opacity={flashA} />
        <rect x={-200} y={0} width={1480} height={1920} fill="url(#gaBeacon2)" opacity={flashB * 0.8} />
        <ellipse cx={VP.x} cy={tl.y + 20} rx={260} ry={60} fill="#FFF6E0" opacity={0.12} />
      </g>
      {walls}
      {scooters}
      {wires}
      <Smoke id="gaSmoke" t={t} amount={smoke} emit={[{ x: VP.x, y: 900, w: 500 }]} rise={600} size={110} tone="#3d3d40" />
      {/* beacon light catching the near walls */}
      <rect x={-200} y={0} width={1480} height={1920} fill={REAL.lampRed} opacity={0.05 * flashA + 0.02 * noise1(t * 0.3, 1)} style={{ mixBlendMode: "screen" }} />
    </g>
  );
};
