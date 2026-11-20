import React from "react";
import { REAL, noise1, rand } from "../fk/theme";
import { Smoke } from "./fx";

/**
 * Night drone view straight down into the gali (world = frame coords at zoom 1, 100 px = 1 m).
 * Lane x 380-700 (3.2 m wall to wall) runs up from the main road (y > 1450). Scooters on both
 * sides and tarpaulin awnings leave a gap of ~1.6 m; the fire tender (2.5 m wide, mirrors ~3 m)
 * noses into the mouth and stops. The shop's fire glows at the top of the lane.
 */
export const LANE = { x0: 380, x1: 700, mouth: 1450 };
const GAP = { x0: 462, x1: 618 };

/** Scooter seen from above (cm units, nose up, origin at centre). ~180 x 70 cm. */
const ScooterTop: React.FC<{ body: string; beam: string; rim: number }> = ({ body, beam, rim }) => (
  <g>
    <ellipse cx={4} cy={6} rx={40} ry={96} fill="#000" opacity={0.55} />
    {/* tyres peeking out front and back */}
    <rect x={-6} y={-92} width={12} height={22} rx={5} fill="#0b0b0b" />
    <rect x={-7} y={72} width={14} height={22} rx={5} fill="#0b0b0b" />
    {/* front apron + headlamp cowl */}
    <path d="M-20 -78 Q 0 -90 20 -78 L 24 -40 L -24 -40 Z" fill={body} />
    <path d="M-16 -80 Q 0 -88 16 -80 L 14 -72 Q 0 -78 -14 -72 Z" fill="#fff" opacity={0.35} />
    {/* handlebar, grips, mirrors on stalks */}
    <rect x={-36} y={-62} width={72} height={6} rx={3} fill="#1b1b1b" />
    <rect x={-40} y={-63} width={10} height={8} rx={3} fill="#2a2a2a" />
    <rect x={30} y={-63} width={10} height={8} rx={3} fill="#2a2a2a" />
    <path d="M-24 -60 L -32 -74 M24 -60 L 32 -74" stroke="#222" strokeWidth={2} />
    <ellipse cx={-34} cy={-78} rx={6} ry={4} fill="#111" />
    <ellipse cx={34} cy={-78} rx={6} ry={4} fill="#111" />
    <ellipse cx={0} cy={-58} rx={12} ry={6} fill="#151515" />
    {/* floorboard */}
    <path d="M-22 -40 L 22 -40 L 20 0 L -20 0 Z" fill="#161616" />
    <path d="M-22 -40 L 22 -40 L 20 0 L -20 0 Z" fill="none" stroke="#3a3a3a" strokeWidth={1.2} />
    {/* rear body (glossy) + seat + grab rail + tail lamp */}
    <path d="M-26 -4 Q -32 40 -22 74 Q 0 86 22 74 Q 32 40 26 -4 Z" fill={body} />
    <path d="M-24 4 Q -28 38 -20 66 L -14 66 Q -22 38 -18 4 Z" fill="#fff" opacity={0.28} />
    <path d="M20 4 Q 26 38 18 66 L 22 70 Q 32 40 26 -4 Z" fill="#000" opacity={0.3} />
    <rect x={-16} y={-8} width={32} height={66} rx={14} fill="#121212" />
    <rect x={-12} y={-4} width={8} height={56} rx={4} fill="#ffffff" opacity={0.08} />
    <path d="M-18 60 Q 0 70 18 60" stroke="#b9c0c6" strokeWidth={2.4} fill="none" />
    <path d="M-14 78 Q 0 84 14 78" stroke={REAL.tailRed} strokeWidth={4} fill="none" />
    {/* beacon light catching the glossy panels */}
    <path d="M-26 -4 Q -32 40 -22 74" stroke={beam} strokeWidth={2.4} fill="none" opacity={rim} />
    <path d="M-20 -78 Q 0 -90 20 -78" stroke={beam} strokeWidth={2} fill="none" opacity={rim * 0.7} />
  </g>
);

/** Fire tender from above (cm units, nose up, origin at the front bumper centre). 250 x 800 cm. */
const TenderTop: React.FC<{ a: number; b: number }> = ({ a, b }) => (
  <g>
    <defs>
      <linearGradient id="ttRed" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7c0c10" />
        <stop offset="0.3" stopColor="#c81b22" />
        <stop offset="0.7" stopColor="#b5151b" />
        <stop offset="1" stopColor="#6a0a0d" />
      </linearGradient>
      <linearGradient id="ttGlass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2e3a44" />
        <stop offset="1" stopColor="#0d1114" />
      </linearGradient>
    </defs>
    <rect x={-120} y={10} width={240} height={800} rx={10} fill="#000" opacity={0.5} transform="translate(10 12)" />
    {/* cab */}
    <rect x={-125} y={0} width={250} height={210} rx={18} fill="url(#ttRed)" />
    <rect x={-112} y={6} width={224} height={46} rx={8} fill="url(#ttGlass)" />
    <rect x={-104} y={10} width={60} height={6} rx={3} fill="#ffffff" opacity={0.18} />
    {/* roof light bar */}
    <rect x={-96} y={70} width={192} height={22} rx={8} fill="#1a1a1a" />
    <rect x={-92} y={73} width={88} height={16} rx={6} fill={REAL.lampRed} opacity={0.35 + 0.65 * a} />
    <rect x={4} y={73} width={88} height={16} rx={6} fill="#2f6bff" opacity={0.35 + 0.65 * b} />
    <text x={0} y={160} textAnchor="middle" fontFamily="FK Anton" fontSize={44} letterSpacing="8" fill="#ffffff" opacity={0.9}>
      FIRE
    </text>
    {/* mirrors on arms */}
    {[-1, 1].map((s) => (
      <g key={s}>
        <path d={`M${s * 122} 40 L ${s * 150} 36`} stroke="#1a1a1a" strokeWidth={5} />
        <rect x={s > 0 ? 146 : -160} y={22} width={14} height={34} rx={4} fill="#151515" />
      </g>
    ))}
    {/* body: roof with ladder + hose reel + lockers */}
    <rect x={-125} y={220} width={250} height={590} rx={8} fill="url(#ttRed)" />
    <rect x={-125} y={220} width={250} height={590} rx={8} fill="#000" opacity={0.12} />
    <rect x={-120} y={232} width={8} height={566} fill="#f2f2f2" opacity={0.8} />
    <rect x={112} y={232} width={8} height={566} fill="#f2f2f2" opacity={0.8} />
    <rect x={-60} y={250} width={8} height={520} fill="#c9cfd4" />
    <rect x={52} y={250} width={8} height={520} fill="#c9cfd4" />
    {Array.from({ length: 17 }).map((_, i) => (
      <rect key={i} x={-52} y={262 + i * 30} width={104} height={5} fill="#aeb5bb" />
    ))}
    <circle cx={-88} cy={720} r={26} fill="#1d1d1d" />
    <circle cx={-88} cy={720} r={16} fill="#c9a227" />
    <rect x={70} y={680} width={40} height={90} rx={4} fill="#5d0a0d" />
  </g>
);

const Awning: React.FC<{ x: number; y: number; w: number; h: number; c: string; side: number }> = ({ x, y, w, h, c, side }) => (
  <g>
    <rect x={x + side * 6} y={y + 8} width={w} height={h} fill="#000" opacity={0.45} />
    <rect x={x} y={y} width={w} height={h} fill={c} />
    {Array.from({ length: Math.floor(h / 14) }).map((_, i) => (
      <rect key={i} x={x} y={y + i * 14} width={w} height={2} fill="#000" opacity={0.18} />
    ))}
    <rect x={side < 0 ? x + w - 3 : x} y={y} width={3} height={h} fill="#fff" opacity={0.3} />
  </g>
);

export const GaliTop: React.FC<{ t: number; creep?: number; jolt?: number; bars?: number; fire?: number }> = ({ t, creep = 1, jolt = 0, bars = 0, fire = 1 }) => {
  const a = Math.sin(t * 0.55) > 0 ? 1 : 0.1;
  const b = Math.sin(t * 0.55 + Math.PI) > 0 ? 1 : 0.1;
  const beam = a > 0.5 ? REAL.lampRed : "#2f6bff";
  const ty = 1420 + (1 - creep) * 220; // tender nose y
  const s = 1; // 100 px per metre -> 1 px per cm
  const flick = fire * (0.8 + 0.2 * noise1(t * 0.6, 3));
  const scooters = [
    { x: 424, y: 520, r: 6, c: "#22385a" },
    { x: 656, y: 600, r: -8, c: "#e8e5de" },
    { x: 428, y: 760, r: -5, c: "#6a1f1a" },
    { x: 652, y: 860, r: 7, c: "#2a2d33" },
    { x: 422, y: 1010, r: 8, c: "#9aa1a8" },
    { x: 658, y: 1110, r: -6, c: "#1f4a2e" },
    { x: 426, y: 1270, r: -7, c: "#e8e5de" },
    { x: 654, y: 1330, r: 5, c: "#22385a" },
  ];
  return (
    <g transform={jolt ? `translate(0 ${noise1(t * 2, 3) * 3 * jolt})` : undefined}>
      <defs>
        <radialGradient id="gtFire" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(540 120) scale(520 520)">
          <stop offset="0" stopColor={REAL.fireOrange} stopOpacity="0.6" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gtRed" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(500 ${ty + 80}) scale(520 520)`}>
          <stop offset="0" stopColor={REAL.lampRed} stopOpacity="0.5" />
          <stop offset="1" stopColor={REAL.lampRed} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gtBlue" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(580 ${ty + 80}) scale(520 520)`}>
          <stop offset="0" stopColor="#2f6bff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gtLamp" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(880 1700) scale(700 420)">
          <stop offset="0" stopColor={REAL.sodium} stopOpacity="0.32" />
          <stop offset="1" stopColor={REAL.sodium} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gtRoof" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#24221f" />
          <stop offset="1" stopColor="#171614" />
        </linearGradient>
      </defs>
      {/* lane floor + main road */}
      <rect x={-600} y={-600} width={2280} height={3200} fill="#0e0d0c" />
      <rect x={LANE.x0} y={-600} width={LANE.x1 - LANE.x0} height={LANE.mouth + 600} fill="#1e1c1a" />
      <rect x={530} y={-600} width={20} height={LANE.mouth + 600} fill="#0a0a0a" opacity={0.6} />
      <rect x={-600} y={LANE.mouth} width={2280} height={1200} fill="#181818" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={-560 + i * 340} y={1880} width={180} height={10} fill="#d9d9d9" opacity={0.35} />
      ))}
      <rect x={-600} y={LANE.mouth} width={2280} height={14} fill="#3a3733" />
      {/* rooftops either side: parapets, water tanks, AC units */}
      {[
        [-600, LANE.x0],
        [LANE.x1, 1680],
      ].map(([x0, x1], k) => (
        <g key={k}>
          <rect x={x0} y={-600} width={x1 - x0} height={LANE.mouth + 600} fill="url(#gtRoof)" />
          {[-200, 300, 820, 1220].map((y, i) => (
            <g key={i}>
              <rect x={x0 + 10} y={y} width={x1 - x0 - 20} height={10} fill="#3a3632" />
              <rect x={x0 + 10} y={y} width={x1 - x0 - 20} height={2} fill="#8d857a" opacity={0.4} />
            </g>
          ))}
          <rect x={k ? x0 : x1 - 12} y={-600} width={12} height={LANE.mouth + 600} fill="#3d3934" />
          <rect x={k ? x0 : x1 - 3} y={-600} width={3} height={LANE.mouth + 600} fill="#a39a8d" opacity={0.35} />
          {[60, 520, 1000].map((y, i) => {
            const cx = k ? x0 + 140 + rand(i + k * 5) * 120 : x1 - 140 - rand(i + 3) * 120;
            return (
              <g key={`t${i}`}>
                <circle cx={cx + 8} cy={y + 10} r={56} fill="#000" opacity={0.5} />
                <circle cx={cx} cy={y} r={56} fill="#161616" />
                <circle cx={cx} cy={y} r={46} fill="#1f1f1f" />
                <circle cx={cx} cy={y} r={18} fill="#0f0f0f" />
                <path d={`M${cx - 40} ${y - 26} A 48 48 0 0 1 ${cx + 10} ${y - 46}`} stroke="#5a5a5a" strokeWidth={3} fill="none" />
              </g>
            );
          })}
          <rect x={k ? x0 + 60 : x1 - 180} y={1260} width={110} height={70} rx={4} fill="#4a4c4a" opacity={0.7} />
        </g>
      ))}
      {/* tarpaulin and tin awnings over the shopfronts */}
      {[
        [LANE.x0 - 4, 380, 46, 240, "#1f5fa8", 1],
        [LANE.x0 - 4, 700, 40, 220, "#7d8287", 1],
        [LANE.x0 - 4, 1040, 48, 260, "#1f5fa8", 1],
        [LANE.x1 - 44, 460, 44, 260, "#2f7a3a", -1],
        [LANE.x1 - 40, 820, 40, 200, "#7d8287", -1],
        [LANE.x1 - 46, 1160, 46, 230, "#1f5fa8", -1],
      ].map(([x, y, w, h, c, side], i) => (
        <Awning key={i} x={x as number} y={y as number} w={w as number} h={h as number} c={c as string} side={side as number} />
      ))}
      {scooters.map((sc, i) => (
        <g key={i} transform={`translate(${sc.x} ${sc.y}) rotate(${sc.r}) scale(${s})`}>
          <ScooterTop body={sc.c} beam={beam} rim={0.3 + 0.5 * Math.max(a, b)} />
        </g>
      ))}
      {/* the tender, nosed into the mouth */}
      <g transform={`translate(540 ${ty})`}>
        <TenderTop a={a} b={b} />
      </g>
      {/* light: fire up the lane, beacons at the mouth, street lamp on the road */}
      <g style={{ mixBlendMode: "screen" }}>
        <rect x={-600} y={-600} width={2280} height={3200} fill="url(#gtFire)" opacity={flick} />
        <rect x={-600} y={-600} width={2280} height={3200} fill="url(#gtRed)" opacity={a} />
        <rect x={-600} y={-600} width={2280} height={3200} fill="url(#gtBlue)" opacity={b} />
        <rect x={-600} y={-600} width={2280} height={3200} fill="url(#gtLamp)" />
      </g>
      <Smoke id="gtSmoke" t={t} amount={0.7 * fire} emit={[{ x: 540, y: 200, w: 260 }]} rise={300} size={110} tone="#4a4a4d" />
      {/* overhead wires between the roofs, with their shadows */}
      <g fill="none">
        {Array.from({ length: 6 }).map((_, i) => {
          const y1 = 160 + i * 210 + rand(i) * 60;
          const y2 = y1 + (rand(i + 7) - 0.5) * 160;
          return (
            <g key={i}>
              <path d={`M${LANE.x0 - 60} ${y1 + 26} Q 540 ${(y1 + y2) / 2 + 60} ${LANE.x1 + 60} ${y2 + 26}`} stroke="#000" strokeWidth={3} opacity={0.4} />
              <path d={`M${LANE.x0 - 60} ${y1} Q 540 ${(y1 + y2) / 2 + 30} ${LANE.x1 + 60} ${y2}`} stroke="#050505" strokeWidth={2.2} opacity={0.85} />
            </g>
          );
        })}
      </g>
      {/* measurement: free gap (gold) vs tender width (white) */}
      {bars > 0 && (
        <g opacity={bars}>
          <line x1={GAP.x0} y1={1250} x2={GAP.x0 + (GAP.x1 - GAP.x0) * Math.min(1, bars * 1.3)} y2={1250} stroke="#F0B242" strokeWidth={5} />
          <line x1={GAP.x0} y1={1232} x2={GAP.x0} y2={1268} stroke="#F0B242" strokeWidth={5} />
          <line x1={GAP.x1} y1={1232} x2={GAP.x1} y2={1268} stroke="#F0B242" strokeWidth={5} opacity={bars > 0.75 ? 1 : 0} />
          <line x1={540 - 125} y1={ty - 34} x2={540 - 125 + 250 * Math.min(1, bars * 1.3)} y2={ty - 34} stroke="#FAFAFA" strokeWidth={5} />
          <line x1={540 - 125} y1={ty - 52} x2={540 - 125} y2={ty - 16} stroke="#FAFAFA" strokeWidth={5} />
          <line x1={540 + 125} y1={ty - 52} x2={540 + 125} y2={ty - 16} stroke="#FAFAFA" strokeWidth={5} opacity={bars > 0.75 ? 1 : 0} />
        </g>
      )}
    </g>
  );
};
