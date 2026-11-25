import React from "react";
import { C, REAL, rand } from "../fk/theme";

/**
 * The city at night from straight above (world = frame coordinates). Dark blocks with a few lit
 * windows, a street grid with sodium lamps on the main roads, a river with two bridges. HOME is
 * bottom-left, OFFICE is top-right: the far corner. `route` draws the way across (0..1) and `car`
 * moves a car with headlights along it (0..1). The route line is a UI graphic, so it is gold.
 */
export const HOME = { x: 196, y: 1452 };
export const OFFICE = { x: 884, y: 792 };
const PATH: [number, number][] = [
  [196, 1452],
  [196, 1356],
  [424, 1356],
  [424, 1168],
  [652, 1168],
  [652, 976],
  [884, 976],
  [884, 792],
];
const SEG = PATH.slice(1).map((p, i) => Math.hypot(p[0] - PATH[i][0], p[1] - PATH[i][1]));
const LEN = SEG.reduce((a, b) => a + b, 0);

/** Point and heading at fraction q of the route. */
export const along = (q: number) => {
  let d = Math.max(0, Math.min(1, q)) * LEN;
  for (let i = 0; i < SEG.length; i++) {
    if (d <= SEG[i] || i === SEG.length - 1) {
      const k = Math.min(1, d / SEG[i]);
      const [ax, ay] = PATH[i];
      const [bx, by] = PATH[i + 1];
      return { x: ax + (bx - ax) * k, y: ay + (by - ay) * k, a: (Math.atan2(by - ay, bx - ax) * 180) / Math.PI };
    }
    d -= SEG[i];
  }
  return { x: PATH[0][0], y: PATH[0][1], a: 0 };
};

const XS = [-40, 82, 196, 310, 424, 538, 652, 768, 884, 998, 1120];
const YS = [640, 716, 792, 884, 976, 1072, 1168, 1262, 1356, 1452, 1548, 1640];
const MAIN_X = [196, 424, 652, 884];
const MAIN_Y = [792, 976, 1168, 1356];

export const CityMap: React.FC<{ t: number; route?: number; car?: number; alarm?: number }> = ({ t, route = 0, car = 0, alarm = 1 }) => {
  const blocks: React.ReactNode[] = [];
  for (let i = 0; i < XS.length - 1; i++) {
    for (let j = 0; j < YS.length - 1; j++) {
      const s = i * 17 + j * 5;
      const x = XS[i] + 9;
      const y = YS[j] + 9;
      const w = XS[i + 1] - XS[i] - 18;
      const h = YS[j + 1] - YS[j] - 18;
      const park = rand(s + 3) < 0.09;
      blocks.push(<rect key={`b${s}`} x={x} y={y} width={w} height={h} rx={5} fill={park ? "#12241a" : rand(s) > 0.5 ? "#171c23" : "#141920"} />);
      if (!park) {
        // roof plan: two or three buildings per block, a few lit windows / roof lights
        const n = 2 + Math.floor(rand(s + 1) * 2);
        for (let k = 0; k < n; k++) {
          const bw = (w - 10) / n - 4;
          blocks.push(<rect key={`r${s}-${k}`} x={x + 5 + k * (bw + 4)} y={y + 6} width={bw} height={h - 12} rx={3} fill="#1d232b" stroke="#2b333d" strokeWidth={1} />);
          for (let d = 0; d < 3; d++) {
            if (rand(s * 3 + k * 7 + d) > 0.62) {
              blocks.push(
                <circle
                  key={`l${s}-${k}-${d}`}
                  cx={x + 9 + k * (bw + 4) + rand(s + k + d * 2) * (bw - 8)}
                  cy={y + 12 + rand(s + k * 3 + d) * (h - 24)}
                  r={1.8}
                  fill={rand(s + d) > 0.7 ? "#BFE3FF" : REAL.sodium}
                  opacity={0.5 + 0.3 * rand(s + d + k)}
                />,
              );
            }
          }
        }
      }
    }
  }
  const lamps: React.ReactNode[] = [];
  MAIN_Y.forEach((y, a) => {
    for (let x = -20; x < 1100; x += 57) lamps.push(<circle key={`h${a}-${x}`} cx={x} cy={y} r={2} fill={REAL.sodium} opacity={0.5} />);
  });
  MAIN_X.forEach((x, a) => {
    for (let y = 650; y < 1640; y += 57) lamps.push(<circle key={`v${a}-${y}`} cx={x} cy={y} r={2} fill={REAL.sodium} opacity={0.5} />);
  });
  const d = PATH.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  const c = along(car);
  const pulse = (t * 0.03) % 1;
  return (
    <g clipPath="url(#cmClip)">
      <defs>
        <clipPath id="cmClip">
          <rect x={-60} y={620} width={1200} height={1040} />
        </clipPath>
        <radialGradient id="cmVig" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(540 1130) scale(720 640)">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="0.75" stopColor="#000" stopOpacity="0.2" />
          <stop offset="1" stopColor="#000" stopOpacity="0.95" />
        </radialGradient>
        <linearGradient id="cmBeam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFF1CF" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FFF1CF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="cmAlarm">
          <stop offset="0" stopColor={REAL.lampRed} stopOpacity="0.55" />
          <stop offset="1" stopColor={REAL.lampRed} stopOpacity="0" />
        </radialGradient>
        <filter id="cmGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <rect x={-60} y={620} width={1200} height={1040} fill="#2a323d" />
      {blocks}
      {/* main roads read a little lighter, with lamps */}
      {MAIN_Y.map((y) => (
        <rect key={y} x={-60} y={y - 11} width={1200} height={22} fill="#3d4856" />
      ))}
      {MAIN_X.map((x) => (
        <rect key={x} x={x - 11} y={620} width={22} height={1040} fill="#3d4856" />
      ))}
      {/* the river, crossing the city between home and the office */}
      <path d="M-80 1010 C 180 1050, 300 1240, 560 1250 S 900 1180, 1160 1300 L1160 1380 C 900 1260, 800 1330, 560 1330 S 180 1130, -80 1090 Z" fill="#0e2438" />
      <path d="M-80 1010 C 180 1050, 300 1240, 560 1250 S 900 1180, 1160 1300" stroke="#1d3b55" strokeWidth={2} fill="none" opacity={0.7} />
      {/* bridges where the main roads cross */}
      <rect x={424 - 13} y={1168} width={26} height={110} fill="#2c3540" />
      <rect x={652 - 13} y={1150} width={26} height={190} fill="#2c3540" />
      {lamps}

      {/* the office is the alarm */}
      <circle cx={OFFICE.x} cy={OFFICE.y} r={130} fill="url(#cmAlarm)" opacity={alarm * (Math.sin(t * 0.5) > 0 ? 1 : 0.35)} />
      <circle cx={OFFICE.x} cy={OFFICE.y} r={24 + pulse * 70} fill="none" stroke={REAL.lampRed} strokeWidth={3} opacity={alarm * (1 - pulse)} />

      {/* the way across */}
      <path d={d} stroke={C.gold} strokeWidth={14} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={0.25} pathLength={1} strokeDasharray={`${route} 1`} filter="url(#cmGlow)" />
      <path d={d} stroke={C.gold} strokeWidth={5} fill="none" strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={`${route} 1`} />

      {/* the car: roof, glass, headlight beams */}
      <g transform={`translate(${c.x} ${c.y}) rotate(${c.a}) scale(1.7)`}>
        <polygon points="14,-8 120,-34 120,34 14,8" fill="url(#cmBeam)" opacity={0.55} />
        <rect x={-20} y={-11} width={40} height={22} rx={7} fill="#e9ecef" />
        <rect x={-8} y={-9} width={17} height={18} rx={4} fill="#11161c" />
        <rect x={16} y={-10} width={4} height={6} rx={2} fill="#FFF7DE" />
        <rect x={16} y={4} width={4} height={6} rx={2} fill="#FFF7DE" />
        <rect x={-20} y={-10} width={3} height={5} rx={1.5} fill={REAL.tailRed} />
        <rect x={-20} y={5} width={3} height={5} rx={1.5} fill={REAL.tailRed} />
      </g>

      {/* pins */}
      {[HOME, OFFICE].map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y})`}>
          <circle r={17} fill="#0b0d10" stroke={i ? REAL.lampRed : C.fa} strokeWidth={4} />
          <circle r={6} fill={i ? REAL.lampRed : C.fa} />
        </g>
      ))}
      <rect x={-60} y={620} width={1200} height={1040} fill="url(#cmVig)" />
    </g>
  );
};
