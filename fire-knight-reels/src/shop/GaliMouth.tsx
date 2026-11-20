import React from "react";
import { REAL, noise1, rand } from "../fk/theme";
import { Smoke } from "./fx";

/**
 * Inside a narrow market gali, looking out at the main road (one-point perspective, frame coords).
 * The lane is ~3.2 m wall to wall, but scooters parked on both sides, shop steps and a handcart
 * leave a gap of about a metre. At the mouth a fire tender (2.5 m wide, mirrors ~3 m) noses in,
 * beacons flashing, and stops: it cannot enter. Real proportions (1 m = FOC / Z px).
 */
const VP = { x: 540, y: 1080 };
const FOC = 700;
const EYE = 1.55;
const HALF = 1.6;
const P = (X: number, Y: number, Z: number) => ({ x: VP.x + (X / Z) * FOC, y: VP.y + ((Y + EYE) / Z) * FOC });
const pts = (...p: { x: number; y: number }[]) => p.map((q) => `${q.x},${q.y}`).join(" ");
export const TENDER_Z = 5.2;

/** Scooter seen from behind (cm units; origin at the tyre contact point). */
const Scooter: React.FC<{ body: string; rim: number; flash: string }> = ({ body, rim, flash }) => (
  <g>
    <ellipse cx={0} cy={0} rx={46} ry={6} fill="#000" opacity={0.55} />
    {/* rear tyre, mostly hidden by the skirt */}
    <rect x={-7} y={-22} width={14} height={22} rx={5} fill="#0b0b0b" />
    {/* floorboard sides, low */}
    <path d="M-34 -16 L 34 -16 L 30 -10 L -30 -10 Z" fill="#141414" />
    {/* rear cowl, glossy, skirt down to the floorboard */}
    <path d="M-22 -14 C -32 -40, -33 -62, -28 -78 Q 0 -86 28 -78 C 33 -62, 32 -40, 22 -14 Q 0 -10 -22 -14 Z" fill={body} />
    <path d="M-24 -74 Q 0 -82 24 -74 L 22 -68 Q 0 -74 -22 -68 Z" fill="#fff" opacity={0.28} />
    <path d="M-28 -70 C -31 -52, -28 -32, -20 -16 L -15 -16 C -23 -32, -25 -52, -22 -70 Z" fill="#fff" opacity={0.14} />
    <path d="M22 -14 C 32 -40, 33 -62, 28 -78 L 22 -76 C 27 -62, 26 -40, 16 -16 Z" fill="#000" opacity={0.3} />
    {/* tail lamp cluster with amber indicators */}
    <path d="M-20 -66 Q 0 -70 20 -66 L 18 -58 Q 0 -61 -18 -58 Z" fill={REAL.tailRed} />
    <path d="M-18 -65 Q 0 -68 18 -65 L 17 -63 Q 0 -66 -17 -63 Z" fill="#ff9a8a" opacity={0.5} />
    <rect x={-26} y={-66} width={7} height={6} rx={2} fill="#e28a1a" />
    <rect x={19} y={-66} width={7} height={6} rx={2} fill="#e28a1a" />
    {/* number plate */}
    <rect x={-12} y={-46} width={24} height={12} rx={1.5} fill="#e9e6dc" />
    <rect x={-9} y={-42} width={18} height={2.6} fill="#222" opacity={0.7} />
    {/* seat, grab rail, front panel, handlebar, mirrors */}
    <path d="M-22 -80 Q -22 -92 0 -93 Q 22 -92 22 -80 Z" fill="#111" />
    <path d="M-16 -90 Q 0 -94 16 -90" stroke="#555" strokeWidth={1.2} fill="none" />
    <path d="M-24 -82 Q -26 -88 -20 -88 M24 -82 Q 26 -88 20 -88" stroke="#b9c0c6" strokeWidth={2.4} fill="none" />
    <path d="M-20 -95 L -24 -112 L 24 -112 L 20 -95 Z" fill={body} />
    <path d="M-20 -95 L -24 -112 L 24 -112 L 20 -95 Z" fill="#000" opacity={0.25} />
    <rect x={-38} y={-116} width={76} height={4} rx={2} fill="#1a1a1a" />
    <rect x={-42} y={-117} width={10} height={6} rx={2} fill="#222" />
    <rect x={32} y={-117} width={10} height={6} rx={2} fill="#222" />
    <path d="M-28 -116 L -30 -124 M28 -116 L 30 -124" stroke="#2a2a2a" strokeWidth={1.6} />
    <ellipse cx={-32} cy={-127} rx={4.5} ry={3} fill="#141414" />
    <ellipse cx={32} cy={-127} rx={4.5} ry={3} fill="#141414" />
    {/* beacon light catching the top edges */}
    <path d="M-28 -78 Q 0 -86 28 -78" stroke={flash} strokeWidth={2.2} fill="none" opacity={rim} />
    <path d="M-22 -93 Q 0 -96 22 -93" stroke={flash} strokeWidth={1.6} fill="none" opacity={rim * 0.8} />
  </g>
);

/** Head-on Indian fire tender (cm units; origin at ground centre). Width 250 cm. */
const Tender: React.FC<{ a: number; b: number; t: number }> = ({ a, b, t }) => (
  <g>
    <defs>
      <linearGradient id="tdRed" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7e0c10" />
        <stop offset="0.25" stopColor="#c41a20" />
        <stop offset="0.6" stopColor="#b3141a" />
        <stop offset="1" stopColor="#6a0a0d" />
      </linearGradient>
      <linearGradient id="tdGlass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3b4650" />
        <stop offset="1" stopColor="#0d1114" />
      </linearGradient>
      <radialGradient id="tdHead">
        <stop offset="0" stopColor="#fffbea" />
        <stop offset="0.35" stopColor="#fff1c4" stopOpacity="0.9" />
        <stop offset="1" stopColor="#ffe9b0" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={0} cy={0} rx={150} ry={10} fill="#000" opacity={0.6} />
    {/* body box behind the cab + ladder */}
    <rect x={-124} y={-385} width={248} height={90} fill="url(#tdRed)" />
    <rect x={-124} y={-385} width={248} height={90} fill="#000" opacity={0.3} />
    <rect x={-110} y={-400} width={220} height={8} fill="#c9cfd4" />
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={-106 + i * 26} y={-404} width={3} height={16} fill="#aeb5bb" />
    ))}
    {/* tyres */}
    <rect x={-112} y={-62} width={34} height={62} rx={8} fill="#0b0b0b" />
    <rect x={78} y={-62} width={34} height={62} rx={8} fill="#0b0b0b" />
    {/* cab */}
    <path d="M-122 -300 L 122 -300 L 126 -70 L -126 -70 Z" fill="url(#tdRed)" />
    <rect x={-122} y={-300} width={244} height={30} fill="#9c0f14" />
    <text x={0} y={-277} textAnchor="middle" fontFamily="FK Anton" fontSize={24} letterSpacing="6" fill="#ffffff">
      FIRE
    </text>
    <path d="M-110 -266 L 110 -266 L 114 -178 L -114 -178 Z" fill="url(#tdGlass)" />
    <rect x={-3} y={-266} width={6} height={88} fill="#2a0607" />
    <path d="M-100 -262 L -40 -262 L -86 -182 L -108 -182 Z" fill="#ffffff" opacity={0.08} />
    <path d="M30 -262 L 60 -262 L 20 -182 L -6 -182 Z" fill="#ffffff" opacity={0.05} />
    <rect x={-126} y={-172} width={252} height={8} fill="#f2f2f2" />
    <rect x={-126} y={-160} width={252} height={4} fill="#e2b322" />
    {/* grille + headlights */}
    <rect x={-58} y={-150} width={116} height={64} rx={4} fill="#121212" />
    {Array.from({ length: 6 }).map((_, i) => (
      <rect key={i} x={-54} y={-145 + i * 10} width={108} height={3} fill="#3c3c3c" />
    ))}
    {[-1, 1].map((s) => (
      <g key={s}>
        <rect x={s > 0 ? 70 : -112} y={-140} width={42} height={30} rx={6} fill="#e9e6dc" />
        <circle cx={s * 91} cy={-125} r={70} fill="url(#tdHead)" opacity={0.65} />
        <rect x={s > 0 ? 70 : -112} y={-104} width={42} height={8} rx={3} fill="#e8a020" opacity={0.7} />
      </g>
    ))}
    {/* bumper + plate */}
    <rect x={-130} y={-84} width={260} height={24} rx={4} fill="#d8dcdf" />
    <rect x={-130} y={-84} width={260} height={4} fill="#ffffff" opacity={0.6} />
    <rect x={-24} y={-80} width={48} height={16} fill="#f2f0e6" />
    {/* mirrors on arms */}
    {[-1, 1].map((s) => (
      <g key={`m${s}`}>
        <path d={`M${s * 122} -250 L ${s * 150} -258 L ${s * 150} -236`} stroke="#1a1a1a" strokeWidth={4} fill="none" />
        <rect x={s > 0 ? 146 : -164} y={-262} width={18} height={50} rx={4} fill="#151515" />
      </g>
    ))}
    {/* roof light bar: red / blue */}
    <rect x={-92} y={-316} width={184} height={16} rx={6} fill="#1a1a1a" />
    {[-1, 1].map((s) => (
      <g key={`b${s}`}>
        <rect x={s > 0 ? 6 : -88} y={-314} width={82} height={12} rx={5} fill={s < 0 ? REAL.lampRed : "#2f6bff"} opacity={0.35 + 0.65 * (s < 0 ? a : b)} />
        <ellipse cx={s * 47} cy={-308} rx={140} ry={60} fill={s < 0 ? REAL.lampRed : "#2f6bff"} opacity={0.35 * (s < 0 ? a : b)} style={{ mixBlendMode: "screen" }} />
      </g>
    ))}
    <rect x={-126} y={-300} width={6} height={230} fill="#ffffff" opacity={0.08 + 0.04 * noise1(t * 0.2, 1)} />
  </g>
);

export const GaliMouth: React.FC<{ t: number; creep?: number; jolt?: number; bars?: number; smoke?: number }> = ({ t, creep = 1, jolt = 0, bars = 0, smoke = 0 }) => {
  const a = Math.sin(t * 0.55) > 0 ? 1 : 0.12; // red
  const b = Math.sin(t * 0.55 + Math.PI) > 0 ? 1 : 0.12; // blue
  const flash = a > 0.5 ? REAL.lampRed : "#2f6bff";
  const tz = TENDER_Z + (1 - creep) * 1.4;
  const ts = FOC / tz / 100; // px per cm at the tender
  const tb = P(0, 0, tz);
  const wallC = ["#4f4336", "#463c31", "#53473a"];
  const walls: React.ReactNode[] = [];
  const Zs = [0.8, 1.6, 2.5, 3.5, 4.6, 5.6];
  for (let i = Zs.length - 2; i >= 0; i--) {
    const za = Zs[i];
    const zb = Zs[i + 1];
    [-1, 1].forEach((side) => {
      const X = side * HALF;
      const k = (i + (side > 0 ? 1 : 0)) % 3;
      walls.push(
        <g key={`${i}${side}`}>
          <polygon points={pts(P(X, -6, za), P(X, -6, zb), P(X, -2.9, zb), P(X, -2.9, za))} fill={wallC[k]} />
          <polygon points={pts(P(X, -2.9, za), P(X, -2.9, zb), P(X, -2.45, zb), P(X, -2.45, za))} fill={["#E3B81D", "#16457e", "#8E1D18"][k]} opacity={0.75} />
          <polygon points={pts(P(X, -2.45, za), P(X, -2.45, zb), P(X, 0, zb), P(X, 0, za))} fill={["#8f969d", "#557a5e", "#4f6f92"][k]} />
          {Array.from({ length: 14 }).map((_, j) => {
            const y = -2.45 + (j / 14) * 2.45;
            const p1 = P(X, y, za);
            const p2 = P(X, y, zb);
            return <line key={j} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#000" strokeWidth={1.4} opacity={0.35} />;
          })}
          {/* step in front of each shop */}
          <polygon points={pts(P(X, 0, za), P(X, 0, zb), P(X - side * 0.35, 0, zb), P(X - side * 0.35, 0, za))} fill="#5e5850" />
          <polygon points={pts(P(X - side * 0.35, 0, za), P(X - side * 0.35, 0, zb), P(X - side * 0.35, 0.18, zb), P(X - side * 0.35, 0.18, za))} fill="#3a3530" />
          <polygon points={pts(P(X, -6, za), P(X, -6, za + 0.18), P(X, 0, za + 0.18), P(X, 0, za))} fill="#5b4e3f" />
        </g>,
      );
    });
  }
  // main road beyond the mouth, lit by sodium light
  const m0 = P(-HALF, -6, 5.6);
  const m1 = P(HALF, 0.2, 5.6);
  // scooters parked along both walls, from near to the mouth
  const parked: { side: number; z: number; c: string }[] = [
    { side: -1, z: 1.9, c: "#22385a" },
    { side: 1, z: 2.3, c: "#e8e5de" },
    { side: -1, z: 3.0, c: "#6a1f1a" },
    { side: 1, z: 3.4, c: "#2a2d33" },
    { side: -1, z: 4.1, c: "#9aa1a8" },
    { side: 1, z: 4.6, c: "#22385a" },
  ];
  // gap left between the scooters at the mouth vs the tender's width
  const gapL = P(-HALF + 0.35 + 0.75, 0, tz - 0.4);
  const gapR = P(HALF - 0.35 - 0.75, 0, tz - 0.4);
  const tdL = tb.x - 125 * ts;
  const tdR = tb.x + 125 * ts;
  return (
    <g transform={jolt ? `translate(${noise1(t * 2, 3) * 3 * jolt} 0)` : undefined}>
      <defs>
        <linearGradient id="gmRoad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1510" />
          <stop offset="1" stopColor="#5e4a33" />
        </linearGradient>
        <linearGradient id="gmFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2d2924" />
          <stop offset="1" stopColor="#141210" />
        </linearGradient>
        <radialGradient id="gmRed" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${tb.x} ${tb.y - 300 * ts}) scale(900 700)`}>
          <stop offset="0" stopColor={REAL.lampRed} stopOpacity="0.5" />
          <stop offset="1" stopColor={REAL.lampRed} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gmBlue" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${tb.x} ${tb.y - 300 * ts}) scale(900 700)`}>
          <stop offset="0" stopColor="#2f6bff" stopOpacity="0.42" />
          <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={-200} y={-200} width={1480} height={2400} fill="#050505" />
      {/* the road and the buildings across it */}
      <rect x={m0.x - 400} y={m0.y - 300} width={m1.x - m0.x + 800} height={m1.y - m0.y + 300} fill="url(#gmRoad)" />
      <rect x={m0.x} y={P(0, -3.4, 7).y} width={m1.x - m0.x} height={P(0, 0, 7).y - P(0, -3.4, 7).y} fill="#3a2f25" />
      <rect x={m0.x + 20} y={P(0, -2.6, 7).y} width={m1.x - m0.x - 40} height={P(0, 0, 7).y - P(0, -2.6, 7).y} fill="#5d646b" opacity={0.6} />
      {/* lane floor (worn concrete) */}
      <polygon points={pts(P(-HALF, 0, 0.8), P(HALF, 0, 0.8), P(HALF, 0, 5.6), P(-HALF, 0, 5.6))} fill="url(#gmFloor)" />
      <polygon points={pts(P(-0.25, 0, 0.8), P(0.25, 0, 0.8), P(0.06, 0, 5.6), P(-0.06, 0, 5.6))} fill="#000" opacity={0.25} />
      {/* the tender at the mouth */}
      <g transform={`translate(${tb.x} ${tb.y}) scale(${ts})`}>
        <Tender a={a} b={b} t={t} />
      </g>
      <g style={{ mixBlendMode: "screen" }}>
        <rect x={-200} y={-200} width={1480} height={2400} fill="url(#gmRed)" opacity={a} />
        <rect x={-200} y={-200} width={1480} height={2400} fill="url(#gmBlue)" opacity={b} />
      </g>
      {walls}
      {parked
        .slice()
        .sort((p, q) => q.z - p.z)
        .map((sc, i) => {
          const p = P(sc.side * (HALF - 0.62), 0, sc.z);
          const s = FOC / sc.z / 100;
          return (
            <g key={i} transform={`translate(${p.x} ${p.y}) scale(${s})`}>
              <Scooter body={sc.c} rim={0.4 + 0.6 * Math.max(a, b)} flash={flash} />
            </g>
          );
        })}
      {/* low wire mat over the lane */}
      <g fill="none" stroke="#050505">
        {Array.from({ length: 30 }).map((_, i) => {
          const za = 0.9 + rand(i) * 4.8;
          const zb = Math.max(0.9, za + (rand(i + 1) - 0.5) * 2.4);
          const p1 = P(-HALF, -4.2 - rand(i + 2) * 0.9, za);
          const p2 = P(HALF, -4.2 - rand(i + 3) * 0.9, zb);
          const sag = (40 + rand(i + 4) * 90) / Math.min(za, zb);
          return <path key={i} d={`M${p1.x} ${p1.y} Q ${(p1.x + p2.x) / 2} ${(p1.y + p2.y) / 2 + sag} ${p2.x} ${p2.y}`} strokeWidth={Math.max(1.2, 6 / za)} />;
        })}
      </g>
      <Smoke id="gmSmoke" t={t} amount={smoke} emit={[{ x: 540, y: 1000, w: 600 }]} rise={600} size={120} tone="#3d3d40" />

      {/* measurement: the gap that is left vs the tender's width (UI hairlines) */}
      {bars > 0 && (
        <g opacity={bars}>
          <line x1={tdL} y1={tb.y - 430 * ts} x2={tdL + (tdR - tdL) * Math.min(1, bars * 1.3)} y2={tb.y - 430 * ts} stroke="#FAFAFA" strokeWidth={3} />
          <line x1={tdL} y1={tb.y - 445 * ts} x2={tdL} y2={tb.y - 415 * ts} stroke="#FAFAFA" strokeWidth={3} />
          <line x1={tdR} y1={tb.y - 445 * ts} x2={tdR} y2={tb.y - 415 * ts} stroke="#FAFAFA" strokeWidth={3} opacity={bars > 0.75 ? 1 : 0} />
          <line x1={gapL.x} y1={gapL.y + 30} x2={gapL.x + (gapR.x - gapL.x) * Math.min(1, bars * 1.3)} y2={gapL.y + 30} stroke="#F0B242" strokeWidth={4} />
          <line x1={gapL.x} y1={gapL.y + 16} x2={gapL.x} y2={gapL.y + 44} stroke="#F0B242" strokeWidth={4} />
          <line x1={gapR.x} y1={gapL.y + 16} x2={gapR.x} y2={gapL.y + 44} stroke="#F0B242" strokeWidth={4} opacity={bars > 0.75 ? 1 : 0} />
        </g>
      )}
    </g>
  );
};
