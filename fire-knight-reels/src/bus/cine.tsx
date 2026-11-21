import React from "react";
import { REAL, noise1, rand } from "../fk/theme";
import { Flame, Smoke } from "../shop/fx";

/* =====================================================================
 * Cinematic sets for the Bus Owners reel (all frame coordinates, 1080x1920).
 * Real colours, low-key light, people only as hands / from behind / silhouettes.
 * ===================================================================== */

/* ---------------- Driver POV: hands on the wheel, night road ---------------- */
export const DriverPOV: React.FC<{ t: number; speed?: number }> = ({ t, speed = 1 }) => {
  const VP = { x: 540, y: 820 };
  const dash = (i: number) => {
    const z = ((i * 6 - t * 0.9 * speed) % 60 + 60) % 60 + 2; // metres ahead
    const k = 340 / z;
    return { y: VP.y + 1.4 * k * 6, w: Math.max(2, 0.15 * k * 6), h: Math.max(2, 3 * k * 1.2), z };
  };
  const sway = noise1(t * 0.05, 2) * 6;
  return (
    <g>
      <defs>
        <linearGradient id="dpSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020304" />
          <stop offset="1" stopColor="#10161b" />
        </linearGradient>
        <radialGradient id="dpBeam" cx="0.5" cy="1" r="0.8">
          <stop offset="0" stopColor="#fff3d6" stopOpacity="0.38" />
          <stop offset="1" stopColor="#fff3d6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dpDash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1c1f" />
          <stop offset="1" stopColor="#060607" />
        </linearGradient>
        <linearGradient id="dpRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2c2f" />
          <stop offset="1" stopColor="#0d0e10" />
        </linearGradient>
        <linearGradient id="dpSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2619" />
          <stop offset="0.6" stopColor="#24160e" />
          <stop offset="1" stopColor="#5a3a28" />
        </linearGradient>
      </defs>
      {/* outside: sky, road, beams, lane marks */}
      <rect x={-200} y={-200} width={1480} height={1300} fill="url(#dpSky)" />
      <polygon points={`${VP.x - 6},${VP.y} ${VP.x + 6},${VP.y} 1500,1400 -420,1400`} fill="#15171a" />
      <ellipse cx={VP.x} cy={1250} rx={760} ry={420} fill="url(#dpBeam)" />
      {Array.from({ length: 12 }).map((_, i) => {
        const d = dash(i);
        return <rect key={i} x={VP.x - d.w / 2 + sway * (1 - d.z / 60)} y={d.y} width={d.w} height={d.h} fill="#e6e6e6" opacity={Math.min(0.7, 1.2 - d.z / 60)} />;
      })}
      {Array.from({ length: 10 }).map((_, i) => {
        const z = ((i * 7 - t * 0.9 * speed) % 70 + 70) % 70 + 3;
        const k = 340 / z;
        return <rect key={`p${i}`} x={VP.x + 4.2 * k * 6 - 3} y={VP.y + 1.4 * k * 6 - 0.9 * k * 6} width={Math.max(2, 0.12 * k * 6)} height={0.9 * k * 6} fill={REAL.beacon} opacity={0.35 * Math.min(1, 1.3 - z / 70)} />;
      })}
      {/* windscreen frame: A-pillars + header */}
      <polygon points="-200,-200 140,-200 40,1300 -200,1300" fill="#060708" />
      <polygon points="1280,-200 940,-200 1040,1300 1280,1300" fill="#060708" />
      <rect x={-200} y={-200} width={1480} height={330} fill="#060708" />
      <rect x={140} y={128} width={800} height={4} fill="#3a3f44" opacity={0.6} />
      {/* dashboard + cluster glow */}
      <path d="M-200 1240 Q 540 1120 1280 1240 L 1280 2200 L -200 2200 Z" fill="url(#dpDash)" />
      <path d="M-200 1240 Q 540 1120 1280 1240" stroke="#4a4f55" strokeWidth={3} fill="none" opacity={0.6} />
      <ellipse cx={540} cy={1330} rx={300} ry={90} fill="#5fb6ff" opacity={0.08} />
      {[380, 700].map((x, i) => (
        <g key={x} transform={`translate(${x} 1340)`}>
          <circle r={70} fill="#0b1016" stroke="#2a3a48" strokeWidth={3} />
          <circle r={70} fill="#5fb6ff" opacity={0.06} />
          {Array.from({ length: 9 }).map((_, k) => (
            <rect key={k} x={-1.5} y={-64} width={3} height={10} fill="#9fd0ff" opacity={0.6} transform={`rotate(${-120 + k * 30})`} />
          ))}
          <rect x={-2} y={-56} width={4} height={58} rx={2} fill="#ff5a3c" transform={`rotate(${(i ? 10 : -30) + noise1(t * 0.1, i) * 4})`} />
        </g>
      ))}
      {/* steering wheel (seen from behind the driver) */}
      <g transform={`translate(540 1560) rotate(${noise1(t * 0.04, 5) * 2})`}>
        <ellipse rx={380} ry={330} fill="none" stroke="url(#dpRim)" strokeWidth={54} />
        <ellipse rx={380} ry={330} fill="none" stroke="#5b6066" strokeWidth={3} opacity={0.4} transform="translate(0 -22)" />
        <path d="M-360 40 Q 0 120 360 40" stroke="#121315" strokeWidth={60} fill="none" />
        <ellipse rx={120} ry={90} cy={60} fill="#141518" />
        <ellipse rx={60} ry={40} cy={50} fill="#1d1f22" />
      </g>
      {/* hands at ten-to-two: knuckles over the rim, under-lit by the cluster */}
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${540 + s * 330} 1290) scale(${s} 1) rotate(${-14})`}>
          {/* sleeve + forearm going out of frame */}
          <path d="M-10 90 C -20 200, 0 420, 60 640 L 240 640 C 190 420, 140 220, 110 100 Z" fill="#151d27" />
          <path d="M-10 90 C -20 200, 0 420, 60 640" stroke="#3d5a7a" strokeWidth={2.5} fill="none" opacity={0.45} />
          <path d="M0 70 C 0 40, 110 40, 112 72 L 116 110 L -6 110 Z" fill="#202a36" />
          {/* back of the hand + four fingers curled over the rim */}
          <path d="M-8 72 C -16 30, -4 -6, 26 -14 L 96 -14 C 116 -10, 126 20, 120 72 Z" fill="url(#dpSkin)" />
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M${4 + k * 28} -12 C ${0 + k * 28} -44, ${30 + k * 28} -52, ${32 + k * 28} -14`} fill="#2a1a10" stroke="#120a06" strokeWidth={2} />
          ))}
          {[0, 1, 2, 3].map((k) => (
            <path key={`n${k}`} d={`M${8 + k * 28} -30 q 10 -10 20 0`} stroke="#6a4630" strokeWidth={2} fill="none" opacity={0.6} />
          ))}
          {/* thumb along the rim */}
          <path d="M112 20 C 140 10, 162 -10, 170 -34 C 172 -44, 160 -48, 152 -40 C 140 -22, 124 -8, 104 -2 Z" fill="#2e1d12" />
          {/* under-light from the instrument cluster */}
          <path d="M-8 72 L 120 72" stroke="#7fb8e8" strokeWidth={3} opacity={0.35} />
          <path d="M-8 72 C -16 30, -4 -6, 26 -14" stroke="#c98a62" strokeWidth={2} fill="none" opacity={0.35} />
        </g>
      ))}
    </g>
  );
};

/* ---------------- Cabin aisle, looking forward (one-point perspective) ---------------- */
const AVP = { x: 540, y: 860 };
const AF = 900;
const EYE = 1.55;
const AP = (X: number, Y: number, Z: number) => ({ x: AVP.x + (X / Z) * AF, y: AVP.y + ((Y - EYE) / Z) * -AF });
const q4 = (...p: { x: number; y: number }[]) => p.map((v) => `${v.x},${v.y}`).join(" ");
const FRONT = 9.6;

/** Seats + passengers (from behind), luggage racks, mood light, driver partition with the extinguisher. */
export const Aisle: React.FC<{ t: number; dolly?: number; ext?: number; smoke?: number; dim?: number; heads?: number }> = ({
  t,
  dolly = 0,
  ext = 0,
  smoke = 0,
  dim = 0,
  heads = 1,
}) => {
  const Z = (z: number) => z - dolly;
  const rows: number[] = [];
  for (let z = 1.0; z < FRONT - 0.6; z += 0.85) rows.push(z);
  const flick = smoke > 0 ? 0.75 + 0.25 * noise1(t * 0.9, 4) : 1;
  const lamp = (1 - dim * 0.6) * flick;
  const fz = Z(FRONT);
  const items: React.ReactNode[] = [];
  // far -> near
  [...rows].reverse().forEach((zr, ri) => {
    const z = Z(zr);
    if (z < 0.45) return;
    [-1, 1].forEach((side) => {
      [0, 1].forEach((k) => {
        const x0 = side * (0.32 + k * 0.46);
        const x1 = side * (0.32 + k * 0.46 + 0.42);
        const a = AP(Math.min(x0, x1), 1.15, z);
        const b = AP(Math.max(x0, x1), 0.45, z);
        const w = b.x - a.x;
        const h = b.y - a.y;
        const seed = ri * 7 + k * 3 + (side > 0 ? 1 : 0);
        const occupied = rand(seed) < 0.78 * heads;
        items.push(
          <g key={`${zr}${side}${k}`}>
            {occupied && (
              <g>
                <ellipse cx={a.x + w * (0.5 + (rand(seed + 2) - 0.5) * 0.14)} cy={a.y - h * 0.08} rx={w * 0.17} ry={h * 0.17} fill="#0c0b0a" />
                <ellipse cx={a.x + w * (0.46 + (rand(seed + 2) - 0.5) * 0.14)} cy={a.y - h * 0.2} rx={w * 0.08} ry={h * 0.04} fill="#4a4038" opacity={0.5} />
              </g>
            )}
            <rect x={a.x} y={a.y} width={w} height={h} rx={w * 0.08} fill="#2a3a57" />
            <rect x={a.x} y={a.y} width={w} height={h} rx={w * 0.08} fill="url(#aiSeat)" />
            <rect x={a.x + w * 0.08} y={a.y + h * 0.02} width={w * 0.84} height={h * 0.26} rx={w * 0.05} fill="#e9e6dc" opacity={0.92} />
            <rect x={a.x + w * 0.08} y={a.y + h * 0.02} width={w * 0.84} height={h * 0.05} fill="#ffffff" opacity={0.5} />
            <rect x={a.x} y={a.y + h * 0.62} width={w} height={h * 0.05} fill="#000" opacity={0.35} />
          </g>,
        );
      });
    });
    // reading lights under the racks
    [-1, 1].forEach((side) => {
      const p = AP(side * 0.9, 2.05, z);
      items.push(<circle key={`l${zr}${side}`} cx={p.x} cy={p.y} r={Math.max(1.5, 14 / z)} fill="#ffd9a0" opacity={0.75 * lamp} />);
    });
  });
  const ex = AP(0.62, 0.95, fz - 0.05);
  const exH = (0.55 / (fz - 0.05)) * AF;
  const exW = (0.17 / (fz - 0.05)) * AF;
  return (
    <g>
      <defs>
        <linearGradient id="aiSeat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="aiMood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a6fd8" stopOpacity="0" />
          <stop offset="0.5" stopColor="#3a6fd8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#3a6fd8" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="aiExt">
          <stop offset="0" stopColor={REAL.extRed} stopOpacity="0.55" />
          <stop offset="1" stopColor={REAL.extRed} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="aiExtG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={REAL.extRedLo} />
          <stop offset="0.35" stopColor={REAL.extRedHi} />
          <stop offset="1" stopColor={REAL.extRedLo} />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={1480} height={2400} fill="#07080a" />
      {/* ceiling, walls, floor */}
      <polygon points={q4(AP(-1.25, 2.2, 0.4), AP(1.25, 2.2, 0.4), AP(1.25, 2.2, fz), AP(-1.25, 2.2, fz))} fill="#14171b" />
      <polygon points={q4(AP(-0.25, 2.19, 0.4), AP(0.25, 2.19, 0.4), AP(0.25, 2.19, fz), AP(-0.25, 2.19, fz))} fill="url(#aiMood)" opacity={lamp} />
      {[-1, 1].map((s) => (
        <g key={s}>
          <polygon points={q4(AP(s * 1.25, 2.2, 0.4), AP(s * 1.25, 0, 0.4), AP(s * 1.25, 0, fz), AP(s * 1.25, 2.2, fz))} fill="#101317" />
          {/* windows with passing street-light streaks */}
          <polygon points={q4(AP(s * 1.25, 1.85, 0.4), AP(s * 1.25, 1.0, 0.4), AP(s * 1.25, 1.0, fz), AP(s * 1.25, 1.85, fz))} fill="#05070a" />
          {Array.from({ length: 4 }).map((_, i) => {
            const zz = ((i * 3 + t * 0.12) % 12) + 0.6;
            if (zz > fz) return null;
            const a = AP(s * 1.25, 1.8, zz);
            const b = AP(s * 1.25, 1.05, zz + 0.5);
            return <polygon key={i} points={q4(a, AP(s * 1.25, 1.8, zz + 0.5), b, AP(s * 1.25, 1.05, zz))} fill={REAL.sodium} opacity={0.12 * lamp} />;
          })}
          {/* luggage rack */}
          <polygon points={q4(AP(s * 1.25, 2.05, 0.4), AP(s * 0.82, 2.05, 0.4), AP(s * 0.82, 2.05, fz), AP(s * 1.25, 2.05, fz))} fill="#1d2126" />
          <polygon points={q4(AP(s * 0.82, 2.05, 0.4), AP(s * 0.82, 1.95, 0.4), AP(s * 0.82, 1.95, fz), AP(s * 0.82, 2.05, fz))} fill="#3a3f45" />
        </g>
      ))}
      <polygon points={q4(AP(-1.25, 0, 0.4), AP(1.25, 0, 0.4), AP(1.25, 0, fz), AP(-1.25, 0, fz))} fill="#121315" />
      <polygon points={q4(AP(-0.3, 0.001, 0.4), AP(0.3, 0.001, 0.4), AP(0.3, 0.001, fz), AP(-0.3, 0.001, fz))} fill="#1c1d20" />
      {/* front partition: driver's cabin, windscreen beyond */}
      <g>
        <polygon points={q4(AP(-1.25, 2.2, fz), AP(1.25, 2.2, fz), AP(1.25, 0, fz), AP(-1.25, 0, fz))} fill="#0b0e12" />
        <polygon points={q4(AP(-1.2, 2.0, fz + 0.6), AP(1.2, 2.0, fz + 0.6), AP(1.2, 1.15, fz + 0.6), AP(-1.2, 1.15, fz + 0.6))} fill="#121a22" />
        <ellipse cx={AP(0, 1.3, fz + 0.6).x} cy={AP(0, 1.3, fz + 0.6).y} rx={(1.0 / fz) * AF} ry={(0.25 / fz) * AF} fill="#fff3d6" opacity={0.12} />
        {/* driver from behind (seat + head) */}
        <rect x={AP(0.35, 1.6, fz + 0.3).x} y={AP(0.35, 1.6, fz + 0.3).y} width={(0.5 / (fz + 0.3)) * AF} height={(0.9 / (fz + 0.3)) * AF} rx={6} fill="#14171b" />
        <ellipse cx={AP(0.6, 1.55, fz + 0.3).x} cy={AP(0.6, 1.55, fz + 0.3).y} rx={(0.11 / (fz + 0.3)) * AF} ry={(0.14 / (fz + 0.3)) * AF} fill="#090807" />
        {/* lower partition panel */}
        <polygon points={q4(AP(0.1, 1.15, fz - 0.02), AP(1.25, 1.15, fz - 0.02), AP(1.25, 0, fz - 0.02), AP(0.1, 0, fz - 0.02))} fill="#1a1d21" />
        <polygon points={q4(AP(0.1, 1.15, fz - 0.02), AP(1.25, 1.15, fz - 0.02), AP(1.25, 1.12, fz - 0.02), AP(0.1, 1.12, fz - 0.02))} fill="#6b7177" />
      </g>
      {/* the red extinguisher behind the driver's seat */}
      <g>
        {ext > 0 && <ellipse cx={ex.x} cy={ex.y} rx={exW * 3 * ext} ry={exH * 1.1 * ext} fill="url(#aiExt)" />}
        <rect x={ex.x - exW / 2} y={ex.y - exH / 2} width={exW} height={exH} rx={exW * 0.4} fill="url(#aiExtG)" />
        <rect x={ex.x - exW * 0.22} y={ex.y - exH * 0.62} width={exW * 0.44} height={exH * 0.14} rx={2} fill="#151515" />
        <circle cx={ex.x + exW * 0.1} cy={ex.y - exH * 0.6} r={exW * 0.2} fill="#e8e8e8" />
        <rect x={ex.x - exW * 0.55} y={ex.y - exH * 0.1} width={exW * 1.1} height={exH * 0.06} fill="#c9cfd4" />
        <rect x={ex.x - exW * 0.3} y={ex.y - exH * 0.4} width={exW * 0.12} height={exH * 0.7} rx={2} fill="#ffffff" opacity={0.3} />
      </g>
      {items}
      {/* smoke haze creeping in */}
      {smoke > 0 && (
        <g>
          <rect x={-200} y={-200} width={1480} height={2400} fill="#3a3a3d" opacity={smoke * 0.25} />
          <Smoke id="aiSmoke" t={t} amount={smoke} emit={[{ x: 540, y: 1500, w: 1200 }, { x: 540, y: 1100, w: 800 }]} rise={700} size={140} tone="#55555a" />
        </g>
      )}
      <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={dim * 0.4} />
    </g>
  );
};

/* ---------------- Engine bay close-up (rear hatch open) ---------------- */
export const EngineClose: React.FC<{ t: number; fire: number; smoke?: number }> = ({ t, fire, smoke = 0 }) => {
  const fl = fire * (0.8 + 0.2 * noise1(t * 0.6, 7));
  return (
    <g>
      <defs>
        <pattern id="ecQuilt" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill="#5d6266" />
          <path d="M0 0 L60 60 M60 0 L0 60" stroke="#3b3f43" strokeWidth={2} />
          <rect width="60" height="60" fill="url(#ecFoil)" />
        </pattern>
        <linearGradient id="ecFoil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="ecBlock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a6066" />
          <stop offset="1" stopColor="#24282c" />
        </linearGradient>
        <radialGradient id="ecFire" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(780 1260) scale(900 800)">
          <stop offset="0" stopColor={REAL.fireOrange} stopOpacity="0.8" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ecTurbo">
          <stop offset="0" stopColor="#ffb33a" />
          <stop offset="0.5" stopColor="#d4501c" />
          <stop offset="1" stopColor="#5a2a14" />
        </radialGradient>
      </defs>
      <rect x={-200} y={-200} width={1480} height={2400} fill="#050505" />
      <rect x={60} y={640} width={960} height={1060} fill="url(#ecQuilt)" opacity={0.35} />
      {/* engine block + valve cover */}
      <rect x={180} y={980} width={720} height={520} rx={26} fill="url(#ecBlock)" />
      <rect x={210} y={880} width={660} height={120} rx={20} fill="#1b1d20" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={232 + i * 52} y={896} width={30} height={88} rx={6} fill="#2a2d31" />
      ))}
      <rect x={210} y={880} width={660} height={8} rx={4} fill="#ffffff" opacity={0.12} />
      {/* pulleys + belt */}
      <circle cx={300} cy={1220} r={120} fill="#1a1c1f" stroke="#3a3e43" strokeWidth={8} />
      <circle cx={300} cy={1220} r={40} fill="#8d949a" />
      <circle cx={470} cy={1420} r={70} fill="#1a1c1f" stroke="#3a3e43" strokeWidth={6} />
      <path d="M190 1180 A 120 120 0 0 1 410 1180 L 530 1380 A 70 70 0 0 1 410 1460 L 180 1260" stroke="#0c0c0c" strokeWidth={22} fill="none" />
      {/* intake hose + harness */}
      <path d="M520 870 C 520 760, 760 720, 820 820" stroke="#121212" strokeWidth={70} fill="none" strokeLinecap="round" />
      <path d="M520 870 C 520 760, 760 720, 820 820" stroke="#3a3a3a" strokeWidth={4} fill="none" opacity={0.6} />
      <path d="M240 1010 C 400 1060, 620 1000, 860 1060" stroke="#0e0e0e" strokeWidth={14} fill="none" />
      <path d="M240 1018 C 400 1068, 620 1008, 860 1068" stroke="#d48a1a" strokeWidth={3} fill="none" opacity={0.8} />
      {/* turbo + exhaust manifold */}
      <circle cx={780} cy={1260} r={110} fill="url(#ecTurbo)" opacity={0.35 + 0.65 * fl} />
      <circle cx={780} cy={1260} r={110} fill="#2a2d31" opacity={1 - fl} />
      <circle cx={780} cy={1260} r={44} fill="#141414" />
      <path d="M640 1380 L 900 1380 L 900 1440 L 640 1440 Z" fill="#3a2a22" />
      {/* oil grime */}
      <ellipse cx={600} cy={1480} rx={200} ry={30} fill="#000" opacity={0.5} />
      {/* night: the bay is dark until the fire lights it */}
      <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={0.62 - 0.25 * fl} />
      {/* fire light + flames + smoke */}
      <rect x={-200} y={-200} width={1480} height={2400} fill="url(#ecFire)" opacity={fl} style={{ mixBlendMode: "screen" }} />
      <defs>
        <filter id="ecLick" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.045" numOctaves="2" seed={Math.floor(t / 2) % 50} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={60} xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <g filter="url(#ecLick)">
        <Flame id="ecF1" x={760} y={1360} h={fire * 420} t={t} w={0.55} />
        <Flame id="ecF2" x={880} y={1390} h={fire * 260} t={t + 17} w={0.45} />
        <Flame id="ecF3" x={640} y={1400} h={fire * 180} t={t + 31} w={0.5} />
        <Flame id="ecF4" x={720} y={1380} h={fire * 300} t={t + 43} w={0.35} />
      </g>
      {Array.from({ length: 18 }).map((_, i) => {
        const age = (t * 0.03 + rand(i)) % 1;
        return <circle key={`e${i}`} cx={760 + (rand(i + 2) - 0.5) * 300 + age * 40} cy={1300 - age * 700} r={2 + rand(i + 4) * 2} fill="#ffb33a" opacity={fire * (1 - age)} />;
      })}
      <Smoke id="ecSmoke" t={t} amount={Math.max(smoke, fire * 0.8)} emit={[{ x: 780, y: 1150, w: 300 }]} rise={900} size={160} tone="#3a3a3d" />
    </g>
  );
};

/* ---------------- Battery box close-up ---------------- */
export const BatteryClose: React.FC<{ t: number; smoke: number }> = ({ t, smoke }) => (
  <g>
    <defs>
      <linearGradient id="bcBat" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a2c2f" />
        <stop offset="1" stopColor="#0c0d0e" />
      </linearGradient>
    </defs>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#040404" />
    <rect x={90} y={820} width={900} height={760} rx={16} fill="#1a1c1e" stroke="#3a3e42" strokeWidth={6} />
    {[0, 1].map((i) => (
      <g key={i} transform={`translate(${140 + i * 420} 980)`}>
        <rect width={380} height={520} rx={14} fill="url(#bcBat)" />
        <rect width={380} height={16} rx={8} fill="#ffffff" opacity={0.1} />
        <rect x={30} y={180} width={320} height={80} fill="#e9e6dc" opacity={0.85} />
        <rect x={50} y={200} width={180} height={18} fill="#1f6f8b" />
        <rect x={50} y={228} width={120} height={10} fill="#333" />
        <rect x={40} y={-40} width={60} height={44} rx={8} fill="#c9302c" />
        <rect x={280} y={-40} width={60} height={44} rx={8} fill="#1a1a1a" />
        <ellipse cx={310} cy={-14} rx={40} ry={14} fill="#dfe7d8" opacity={0.25} />
      </g>
    ))}
    <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={0.35} />
    <path d="M210 940 C 210 820, 420 800, 450 700" stroke="#b0201c" strokeWidth={30} fill="none" strokeLinecap="round" />
    <path d="M870 940 C 870 820, 700 780, 660 680" stroke="#111" strokeWidth={30} fill="none" strokeLinecap="round" />
    {/* sparks + smoke from the corroded terminal */}
    {Array.from({ length: 10 }).map((_, i) => {
      const age = ((t * 0.08 + rand(i)) % 1);
      return <circle key={i} cx={870 + (rand(i + 3) - 0.5) * 80 + age * (rand(i + 5) - 0.5) * 160} cy={940 - age * 220} r={2.5} fill="#ffd27a" opacity={smoke * (1 - age) * (rand(i + 9) > 0.4 ? 1 : 0)} />;
    })}
    <ellipse cx={870} cy={950} rx={120} ry={60} fill={REAL.fireOrange} opacity={0.18 * smoke} style={{ mixBlendMode: "screen" }} />
    <Smoke id="bcSmoke" t={t} amount={smoke} emit={[{ x: 870, y: 930, w: 80 }, { x: 640, y: 960, w: 300 }]} rise={800} size={130} tone="#5a5a5e" />
  </g>
);

/* ---------------- Dashboard close-up: the Sentinel button + the driver's finger ---------------- */
export const DashPress: React.FC<{ t: number; press: number; reach: number }> = ({ t, press, reach }) => {
  const lit = press > 0.6;
  return (
    <g>
      <defs>
        <radialGradient id="dkBtn" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor={lit ? "#ff8a76" : "#ff6b5a"} />
          <stop offset="0.5" stopColor="#d4231a" />
          <stop offset="1" stopColor="#6e0d09" />
        </radialGradient>
        <linearGradient id="dkPanel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1e21" />
          <stop offset="1" stopColor="#0a0b0c" />
        </linearGradient>
        <linearGradient id="dkSkin" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5a3a28" />
          <stop offset="1" stopColor="#24160e" />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={1480} height={2400} fill="#050505" />
      <rect x={60} y={760} width={960} height={900} rx={30} fill="url(#dkPanel)" />
      <rect x={60} y={760} width={960} height={6} rx={3} fill="#ffffff" opacity={0.08} />
      {/* neighbouring switches */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${170 + i * 110} 900)`}>
          <rect width={70} height={110} rx={10} fill="#141517" stroke="#2c2f33" strokeWidth={3} />
          <rect x={10} y={12} width={50} height={42} rx={6} fill="#26292d" />
          <rect x={26} y={86} width={18} height={6} rx={3} fill={i === 1 ? "#3BEA6A" : "#e2a91f"} opacity={0.7} />
        </g>
      ))}
      {/* the Sentinel control: guarded red button */}
      <g transform="translate(700 1220)">
        <rect x={-200} y={-200} width={400} height={400} rx={40} fill="#121315" stroke="#3a3d41" strokeWidth={4} />
        <circle r={130} fill="none" stroke="#e2b322" strokeWidth={10} />
        <circle r={110 - press * 6} fill="url(#dkBtn)" />
        <ellipse cx={-34} cy={-40} rx={40} ry={22} fill="#ffffff" opacity={0.35 - press * 0.15} />
        <circle cx={150} cy={-150} r={14} fill={lit ? REAL.lampRed : "#3BEA6A"} />
        <circle cx={150} cy={-150} r={40} fill={lit ? REAL.lampRed : "#3BEA6A"} opacity={0.3 + (lit ? 0.3 * Math.sin(t * 0.6) : 0)} />
        {lit && <circle r={180} fill={REAL.lampRed} opacity={0.12} />}
      </g>
      {/* the driver's hand: index finger reaching in from the right */}
      <g transform={`translate(${700 + (1 - reach) * 520} ${1250 + (1 - reach) * 300 + press * 10})`}>
        <path d="M40 -10 L 320 30 C 380 40, 520 120, 640 260 L 640 520 L 260 520 C 200 400, 120 300, 60 220 Z" fill="#1b2a3c" />
        <path d="M-20 -30 C -40 -40, -60 -20, -40 -2 L 120 30 C 170 40, 200 20, 210 0 C 240 -20, 260 10, 250 50 C 300 60, 320 110, 300 150 C 330 180, 320 230, 280 240 L 120 230 C 60 220, 30 180, 40 120 L 60 40 Z" fill="url(#dkSkin)" />
        <path d="M-20 -30 C -40 -40, -60 -20, -40 -2 L 120 30" stroke="#c98a62" strokeWidth={4} fill="none" opacity={0.6} />
        <path d="M150 60 Q 200 70 240 60 M150 120 Q 210 130 270 110 M150 180 Q 210 190 260 180" stroke="#2a180e" strokeWidth={4} fill="none" opacity={0.6} />
      </g>
    </g>
  );
};

/* ---------------- Evacuation silhouettes ---------------- */
export const Walker: React.FC<{ x: number; y: number; s: number; phase: number; rim?: string; walk?: number; bag?: boolean }> = ({ x, y, s, phase, rim = "#ffcf8a", walk = 1, bag }) => {
  const a = Math.sin(phase) * 22 * walk;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`rotate(${a} 0 -96)`}>
        <path d="M-12 -98 L 10 -98 L 8 -6 L 22 0 L -10 0 Z" fill="#08090a" />
      </g>
      <g transform={`rotate(${-a} 0 -96)`}>
        <path d="M-12 -98 L 10 -98 L 8 -6 L 22 0 L -10 0 Z" fill="#08090a" />
      </g>
      <path d="M-24 -96 C -30 -140, -34 -170, -30 -192 Q 0 -206 30 -192 C 34 -170, 30 -140, 24 -96 Z" fill="#0b0c0e" />
      <g transform={`rotate(${-a * 0.8} -24 -188)`}>
        <path d="M-32 -190 C -38 -160, -36 -130, -30 -112 L -20 -112 C -24 -134, -24 -160, -20 -186 Z" fill="#0b0c0e" />
      </g>
      <g transform={`rotate(${a * 0.8} 24 -188)`}>
        <path d="M32 -190 C 38 -160, 36 -130, 30 -112 L 20 -112 C 24 -134, 24 -160, 20 -186 Z" fill="#0b0c0e" />
      </g>
      <rect x={-7} y={-214} width={14} height={14} fill="#0b0c0e" />
      <ellipse cx={0} cy={-230} rx={17} ry={21} fill="#0b0c0e" />
      {bag && <rect x={16} y={-176} width={28} height={50} rx={6} fill="#141618" />}
      <path d="M-24 -96 C -30 -140, -34 -170, -30 -192 Q 0 -206 30 -192" stroke={rim} strokeWidth={2.5} fill="none" opacity={0.7} />
      <path d="M-20 -230 A 20 20 0 0 1 0 -242" stroke={rim} strokeWidth={2.5} fill="none" opacity={0.7} />
    </g>
  );
};
