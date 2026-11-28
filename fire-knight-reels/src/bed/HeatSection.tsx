import React from "react";
import { REAL, noise1, rand } from "../fk/theme";

/**
 * The charging phone seen from the side, close (about 3.6 px = 1 mm), on two surfaces:
 *  - "table": a hard walnut top. The warmth rises off the phone and leaves.
 *  - "pillow": sunk into a pillow on the mattress with the chadar pulled over it. The warmth has
 *    nowhere to go and collects in the foam.
 * The phone sits at the same place in both, so the two shots match-cut. `heat` 0..1.
 */
export const PH = { x0: 250, x1: 830, y0: 1262, y1: 1292 };

const Phone: React.FC<{ warm: number; t: number }> = ({ warm, t }) => (
  <g>
    <rect x={PH.x0} y={PH.y0} width={PH.x1 - PH.x0} height={PH.y1 - PH.y0} rx={13} fill="#1d2025" />
    <rect x={PH.x0} y={PH.y0} width={PH.x1 - PH.x0} height={PH.y1 - PH.y0} rx={13} fill="none" stroke="#8d939c" strokeWidth={1.6} />
    <rect x={PH.x0 + 14} y={PH.y0 + 12} width={PH.x1 - PH.x0 - 28} height={3} rx={1.5} fill="#5d636c" />
    {/* the lit screen, edge on */}
    <rect x={PH.x0 + 16} y={PH.y0 - 1} width={PH.x1 - PH.x0 - 32} height={3.4} rx={1.7} fill="#cfe6ff" opacity={0.9} />
    <rect x={PH.x0 + 16} y={PH.y0 - 22} width={PH.x1 - PH.x0 - 32} height={22} fill="url(#hsScreen)" opacity={0.5 * (1 - warm * 0.5)} />
    {/* side buttons, camera bump */}
    <rect x={PH.x0 + 96} y={PH.y0 + 7} width={46} height={4} rx={2} fill="#3a3e45" />
    <rect x={PH.x0 + 160} y={PH.y0 + 7} width={26} height={4} rx={2} fill="#3a3e45" />
    {/* charging connector and cable */}
    <rect x={PH.x1 - 2} y={PH.y0 + 7} width={34} height={16} rx={5} fill="#f0f0ec" />
    <rect x={PH.x1 + 30} y={PH.y0 + 11} width={12} height={8} rx={3} fill="#d6d6d2" />
    <rect x={PH.x0} y={PH.y0} width={PH.x1 - PH.x0} height={PH.y1 - PH.y0} rx={13} fill={REAL.fireOrange} opacity={0.45 * warm * (0.9 + 0.1 * noise1(t * 0.3, 2))} style={{ mixBlendMode: "screen" }} />
  </g>
);

/** Short wavy heat strokes. `free`: they rise and spread away. Otherwise they stall and curl back. */
const Waves: React.FC<{ t: number; amount: number; free: boolean }> = ({ t, amount, free }) => {
  if (amount <= 0) return null;
  const out: React.ReactNode[] = [];
  const n = free ? 28 : 16;
  for (let i = 0; i < n; i++) {
    const s = i * 9.13;
    const life = free ? 64 + rand(s) * 30 : 80 + rand(s) * 30;
    const age = ((t + rand(s + 1) * life) % life) / life;
    const x0 = PH.x0 + 40 + rand(s + 2) * (PH.x1 - PH.x0 - 80);
    let x: number;
    let y: number;
    let o: number;
    if (free) {
      x = x0 + (x0 - 540) * age * 0.55 + Math.sin(age * 7 + s) * 14;
      y = PH.y0 - 14 - age * 330;
      o = Math.sin(Math.PI * Math.min(1, age * 1.2)) * 0.95;
    } else {
      // rises a little, hits the fabric, slides sideways and sinks back
      const up = Math.sin(Math.PI * age) * 34;
      x = x0 + (rand(s + 3) - 0.5) * 240 * age;
      y = PH.y0 - 6 - up + age * 26;
      o = Math.sin(Math.PI * age) * 0.6;
    }
    const w = free ? 46 : 30;
    const d = `M${x} ${y} q${-8} ${-w * 0.25} 0 ${-w * 0.5} q8 ${-w * 0.25} 0 ${-w * 0.5}`;
    out.push(<path key={i} d={d} stroke={free ? "#FFD9A0" : REAL.fireYellow} strokeWidth={free ? 4 : 3.2} fill="none" strokeLinecap="round" opacity={o * amount} />);
  }
  return <g>{out}</g>;
};

export const HeatSection: React.FC<{ surface: "table" | "pillow"; t: number; heat?: number }> = ({ surface, t, heat = 0 }) => {
  const glow = heat * (0.9 + 0.1 * noise1(t * 0.22, 5));
  return (
    <g>
      <defs>
        <linearGradient id="hsScreen" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#cfe6ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#cfe6ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hsWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1f26" />
          <stop offset="1" stopColor="#2a303a" />
        </linearGradient>
        <linearGradient id="hsWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f6648" />
          <stop offset="0.5" stopColor="#6b4a33" />
          <stop offset="1" stopColor="#3f2a1c" />
        </linearGradient>
        <linearGradient id="hsPillow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e4e7ed" />
          <stop offset="1" stopColor="#9aa1ae" />
        </linearGradient>
        <linearGradient id="hsMatt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9bec9" />
          <stop offset="1" stopColor="#6f7684" />
        </linearGradient>
        <linearGradient id="hsDuvet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6379a4" />
          <stop offset="1" stopColor="#35435f" />
        </linearGradient>
        <radialGradient id="hsHot">
          <stop offset="0" stopColor={REAL.fireCore} stopOpacity="0.95" />
          <stop offset="0.25" stopColor={REAL.fireYellow} stopOpacity="0.8" />
          <stop offset="0.6" stopColor={REAL.fireOrange} stopOpacity="0.45" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hsNight" gradientUnits="userSpaceOnUse" cx={540} cy={1270} r={900}>
          <stop offset="0" stopColor="#03050a" stopOpacity="0" />
          <stop offset="0.35" stopColor="#03050a" stopOpacity="0.22" />
          <stop offset="0.7" stopColor="#03050a" stopOpacity="0.62" />
          <stop offset="1" stopColor="#03050a" stopOpacity="0.92" />
        </radialGradient>
        <filter id="hsSoft" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <clipPath id="hsBedClip">
          <path d="M-200 1640 V1240 Q200 1120 540 1150 T1280 1150 V1640 Z" />
        </clipPath>
      </defs>
      <rect x={-400} y={200} width={1900} height={1800} fill="url(#hsWall)" />
      {/* a soft pool of night light on the wall behind, so the warmth reads against it */}
      <ellipse cx={540} cy={1120} rx={560} ry={330} fill="#6f86b3" opacity={0.2} filter="url(#hsSoft)" />

      {surface === "table" && (
        <g>
          <rect x={-200} y={PH.y1} width={1500} height={62} fill="url(#hsWood)" />
          <rect x={-200} y={PH.y1} width={1500} height={3} fill="#c9a07e" opacity={0.7} />
          <path d="M-100 1316 q300 10 640 -4 t700 6 M-100 1338 q260 -8 560 2 t760 -4" stroke="#3a2617" strokeWidth={1.6} fill="none" opacity={0.6} />
          <rect x={-200} y={PH.y1 + 62} width={1500} height={34} fill="#2f1f15" />
          <rect x={880} y={PH.y1 + 96} width={56} height={600} fill="#3a281b" />
          <rect x={880} y={PH.y1 + 96} width={8} height={600} fill="#5d4330" opacity={0.6} />
          {/* contact shadow, and the cable running off the edge */}
          <ellipse cx={540} cy={PH.y1 + 3} rx={310} ry={7} fill="#000" opacity={0.5} />
          <path d={`M${PH.x1 + 40} ${PH.y0 + 15} C ${PH.x1 + 150} ${PH.y0 + 10}, ${PH.x1 + 200} ${PH.y1 - 4}, ${PH.x1 + 330} ${PH.y1 - 6}`} stroke="#ecece8" strokeWidth={6} fill="none" strokeLinecap="round" />
          <Phone warm={glow * 0.25} t={t} />
          <Waves t={t} amount={Math.min(1, heat * 1.4)} free />
        </g>
      )}

      {surface === "pillow" && (
        <g>
          {/* mattress */}
          <rect x={-200} y={1352} width={1500} height={300} rx={30} fill="url(#hsMatt)" />
          <rect x={-200} y={1372} width={1500} height={5} fill="#4f5562" opacity={0.6} />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1={-120 + i * 160} y1={1380} x2={-120 + i * 160} y2={1640} stroke="#565c69" strokeWidth={2} opacity={0.5} />
          ))}
          {/* pillow, with the dent the phone has made */}
          <path
            d="M96 1360 C 60 1290, 110 1216, 210 1212 C 250 1210, 250 1282, 300 1284 L780 1284 C 830 1282, 836 1206, 884 1208 C 990 1212, 1030 1296, 990 1360 Z"
            fill="url(#hsPillow)"
          />
          <path d="M120 1340 q40 -90 100 -112 M960 1338 q-30 -80 -84 -106 M330 1310 q200 14 420 0" stroke="#737b8a" strokeWidth={2} fill="none" opacity={0.5} strokeLinecap="round" />
          {/* trapped warmth, inside the bedding only */}
          <g clipPath="url(#hsBedClip)" style={{ mixBlendMode: "screen" }}>
            <ellipse cx={540} cy={1300} rx={150 + 300 * glow} ry={70 + 170 * glow} fill="url(#hsHot)" opacity={Math.min(1, glow * 1.2)} />
          </g>
          <Phone warm={glow} t={t} />
          <Waves t={t} amount={Math.min(1, heat * 1.6)} free={false} />
          {/* the pillow's lip in front of the phone: it has sunk in */}
          <path d="M236 1300 C 250 1276, 290 1280, 330 1281 L760 1281 C 800 1280, 836 1276, 846 1300 Z" fill="#c9cdd6" />
          <path d="M240 1296 C 256 1279, 290 1281, 330 1282 L760 1282 C 800 1281, 830 1279, 842 1296" stroke="#eef0f4" strokeWidth={1.6} fill="none" opacity={0.7} />
          {/* the chadar pulled across */}
          <path
            d="M1300 1180 C 1100 1150, 960 1150, 860 1190 C 780 1222, 700 1232, 590 1232 C 548 1232, 536 1262, 574 1266 C 700 1272, 820 1262, 900 1240 C 1000 1214, 1120 1220, 1300 1250 Z"
            fill="url(#hsDuvet)"
          />
          <path d="M1300 1180 C 1100 1150, 960 1150, 860 1190 C 780 1222, 700 1232, 590 1232 C 548 1232, 536 1262, 574 1266" stroke="#aab8d6" strokeWidth={2.4} fill="none" opacity={0.7} />
          <path d="M1300 1250 C 1120 1220, 1000 1214, 900 1240 C 880 1300, 900 1340, 880 1362 H1300 Z" fill="#3a4866" />
          <path d="M940 1200 q60 20 80 70 M1100 1180 q40 30 50 80" stroke="#1f2a40" strokeWidth={8} fill="none" opacity={0.3} filter="url(#hsSoft)" />
          <g clipPath="url(#hsBedClip)" style={{ mixBlendMode: "screen" }}>
            <ellipse cx={600} cy={1270} rx={120 + 240 * glow} ry={50 + 110 * glow} fill="url(#hsHot)" opacity={Math.min(1, glow) * 0.55} />
          </g>
        </g>
      )}
      <rect x={-400} y={200} width={1900} height={1800} fill="url(#hsNight)" />
    </g>
  );
};
