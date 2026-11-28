import React from "react";
import { C, REAL, noise1 } from "../fk/theme";
import { Flame, Mist, Smoke } from "../shop/fx";
import { ProtectorUnit } from "../shop/Interior";

/**
 * The bedroom at night, seen from the foot of the bed (about 4.3 px = 1 cm): upholstered headboard, two
 * pillows, quilted duvet, a bedside table each side (lamp on the left; the phone now lies on the right
 * one), a socket above it with a cable running onto the bed to a power bank, and the Protector on the
 * ceiling over the bed (drawn like the site render: black oval plate, two nozzles, status LED).
 *
 * Props: `heat` / `flame` / `smoke` at the device on the bed (`DEV`), `protector`, `awake`, `sense`
 * (gold sensing arcs from the unit), `alarm` (siren strobe + sound arcs), `mist`, `phone` (the phone on
 * the table lights up with the alert).
 */
export const CEIL = 900;
export const UNIT = { x: 540, y: CEIL, s: 0.82 };
export const DEV = { x: 676, y: 1452 };
export const TPHONE = { x: 940, y: 1434 };
const NOZ = [UNIT.x - 88 * UNIT.s, UNIT.x + 88 * UNIT.s];

export type BedRoomProps = {
  t: number;
  heat?: number;
  flame?: number;
  smoke?: number;
  protector?: number;
  awake?: number;
  sense?: number;
  alarm?: number;
  mist?: number;
  phone?: number;
};

export const BedRoom: React.FC<BedRoomProps> = ({ t, heat = 0, flame = 0, smoke = 0, protector = 1, awake = 1, sense = 0, alarm = 0, mist = 0, phone = 0 }) => {
  const st = alarm * (Math.sin(t * 0.5) > 0 ? 1 : 0.25);
  const stColor = Math.sin(t * 0.25) > 0 ? REAL.lampRed : REAL.beacon;
  const fh = flame * (64 + 14 * noise1(t * 0.3, 2));
  const fire = Math.max(heat * 0.5, flame) * (0.82 + 0.18 * noise1(t * 0.7, 6));
  return (
    <g>
      <defs>
        <linearGradient id="brWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4250" />
          <stop offset="1" stopColor="#2a303b" />
        </linearGradient>
        <linearGradient id="brCeil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1c20" />
          <stop offset="1" stopColor="#474c55" />
        </linearGradient>
        <linearGradient id="brFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b2d22" />
          <stop offset="1" stopColor="#17110c" />
        </linearGradient>
        <linearGradient id="brHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d6877" />
          <stop offset="1" stopColor="#3a424e" />
        </linearGradient>
        <linearGradient id="brPillow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6e9ee" />
          <stop offset="1" stopColor="#9aa1ae" />
        </linearGradient>
        <linearGradient id="brDuvetTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5f75a0" />
          <stop offset="1" stopColor="#6d83ad" />
        </linearGradient>
        <linearGradient id="brDuvet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#566b94" />
          <stop offset="1" stopColor="#2c3852" />
        </linearGradient>
        <linearGradient id="brWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#86603f" />
          <stop offset="1" stopColor="#4a3221" />
        </linearGradient>
        <radialGradient id="brNight" gradientUnits="userSpaceOnUse" cx={540} cy={1180} r={980}>
          <stop offset="0" stopColor="#03050a" stopOpacity="0.16" />
          <stop offset="0.5" stopColor="#03050a" stopOpacity="0.46" />
          <stop offset="1" stopColor="#03050a" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id="brHot">
          <stop offset="0" stopColor={REAL.fireCore} stopOpacity="0.9" />
          <stop offset="0.3" stopColor={REAL.fireYellow} stopOpacity="0.7" />
          <stop offset="0.65" stopColor={REAL.fireOrange} stopOpacity="0.35" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="brStrobe">
          <stop offset="0" stopColor={stColor} stopOpacity="0.8" />
          <stop offset="1" stopColor={stColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="brCool">
          <stop offset="0" stopColor="#cfe6ff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#cfe6ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="brMoon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bcd4ff" stopOpacity="0.36" />
          <stop offset="1" stopColor="#bcd4ff" stopOpacity="0.1" />
        </linearGradient>
        <filter id="brSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <filter id="brSoftS" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* ceiling, wall, floor */}
      <rect x={-500} y={CEIL - 400} width={2080} height={400} fill="url(#brCeil)" />
      <rect x={-500} y={CEIL} width={2080} height={680} fill="url(#brWall)" />
      <rect x={-500} y={CEIL} width={2080} height={5} fill="#565d6a" />
      <rect x={-500} y={CEIL + 5} width={2080} height={26} fill="#000" opacity={0.25} />
      <rect x={-500} y={1562} width={2080} height={16} fill="#4b5260" />
      <rect x={-500} y={1578} width={2080} height={500} fill="url(#brFloor)" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <line key={i} x1={540 + (i - 5.5) * 150} y1={1578} x2={540 + (i - 5.5) * 300} y2={2000} stroke="#120d09" strokeWidth={2} opacity={0.7} />
      ))}
      {/* moonlight from a window off to the left, crossed by its bars */}
      <g style={{ mixBlendMode: "screen" }}>
        <polygon points="690,960 920,936 920,1200 690,1236" fill="url(#brMoon)" />
        <polygon points="800,948 808,947 808,1218 800,1219" fill="#2a303b" opacity={0.6} />
        <polygon points="690,1090 920,1062 920,1070 690,1098" fill="#2a303b" opacity={0.6} />
      </g>

      {/* curtain at the window, far left */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={-70 + i * 30} y={CEIL + 22} width={30} height={640} fill={i % 2 ? "#4d5a70" : "#3a4558"} />
          <rect x={-70 + i * 30} y={CEIL + 22} width={3} height={640} fill="#8fa3c4" opacity={0.3} />
        </g>
      ))}
      <rect x={-80} y={CEIL + 12} width={180} height={12} rx={4} fill="#22262d" />
      {/* headboard */}
      <rect x={228} y={1196} width={624} height={250} rx={26} fill="#000" opacity={0.4} filter="url(#brSoft)" transform="translate(8 6)" />
      <rect x={228} y={1196} width={624} height={250} rx={26} fill="url(#brHead)" />
      {Array.from({ length: 9 }).map((_, i) => (
        <g key={i}>
          <line x1={290 + i * 62.5} y1={1204} x2={290 + i * 62.5} y2={1440} stroke="#252b34" strokeWidth={3} />
          <line x1={293 + i * 62.5} y1={1204} x2={293 + i * 62.5} y2={1440} stroke="#8490a2" strokeWidth={1} opacity={0.4} />
        </g>
      ))}
      <path d="M254 1198 H826" stroke="#a9b4c4" strokeWidth={1.6} opacity={0.5} />

      {/* bedside tables */}
      {[84, 884].map((x, i) => (
        <g key={i}>
          <rect x={x} y={1440} width={112} height={8} rx={3} fill="#a67b56" />
          <rect x={x + 4} y={1448} width={104} height={124} fill="url(#brWood)" />
          <rect x={x + 12} y={1458} width={88} height={46} rx={4} fill="none" stroke="#2f1f14" strokeWidth={2} />
          <circle cx={x + 56} cy={1481} r={4} fill="#c9a985" />
          <rect x={x + 12} y={1512} width={88} height={50} rx={4} fill="none" stroke="#2f1f14" strokeWidth={2} />
          <rect x={x + 10} y={1572} width={8} height={30} fill="#2f1f14" />
          <rect x={x + 94} y={1572} width={8} height={30} fill="#2f1f14" />
        </g>
      ))}
      {/* lamp, left */}
      <rect x={128} y={1424} width={24} height={16} rx={3} fill="#8d8474" />
      <rect x={137} y={1378} width={6} height={48} fill="#a79d8b" />
      <path d="M104 1380 L176 1380 L164 1318 L116 1318 Z" fill="#b9b09d" />
      <path d="M116 1318 H164" stroke="#e6dfcf" strokeWidth={1.6} opacity={0.6} />
      {/* socket and charger, right; the cable runs onto the bed */}
      <rect x={918} y={1322} width={44} height={44} rx={6} fill="#d9d9d4" />
      <rect x={929} y={1330} width={22} height={28} rx={4} fill="#f4f4f0" />
      <path d={`M940 1358 C 936 1420, 860 1392, 820 1432 S ${DEV.x + 70} ${DEV.y - 8} ${DEV.x + 34} ${DEV.y - 6}`} stroke="#ecece8" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      {/* the phone on the table */}
      <rect x={TPHONE.x - 32} y={TPHONE.y - 1} width={64} height={7} rx={3.5} fill="#1d2025" stroke="#8d939c" strokeWidth={1} />
      <rect x={TPHONE.x - 28} y={TPHONE.y - 2.4} width={56} height={2.4} rx={1.2} fill="#cfe6ff" opacity={0.25 + 0.75 * phone} />

      {/* bed: pillows, sheet, duvet */}
      <rect x={278} y={1318} width={244} height={122} rx={36} fill="url(#brPillow)" />
      <rect x={558} y={1318} width={244} height={122} rx={36} fill="url(#brPillow)" />
      <path d="M300 1340 q60 20 110 8 M580 1342 q70 22 130 4" stroke="#6f7786" strokeWidth={1.6} fill="none" opacity={0.5} />
      <polygon points="246,1424 834,1424 866,1474 214,1474" fill="#b3b9c4" />
      <polygon points="238,1440 842,1440 866,1474 214,1474" fill="url(#brDuvetTop)" />
      <path d="M238 1440 H842" stroke="#c6d0e6" strokeWidth={2} opacity={0.6} />
      <path d="M214 1474 H866 V1596 Q866 1622 840 1622 H240 Q214 1622 214 1596 Z" fill="url(#brDuvet)" />
      <path d="M214 1474 H866" stroke="#9fb0d2" strokeWidth={2} opacity={0.55} />
      {Array.from({ length: 7 }).map((_, i) => (
        <path key={i} d={`M${260 + i * 96} 1476 q${(i % 2 ? -1 : 1) * 14} 70 ${(i % 2 ? 1 : -1) * 6} 144`} stroke="#1c2538" strokeWidth={3} fill="none" opacity={0.4} />
      ))}
      <rect x={236} y={1622} width={16} height={22} fill="#1c1611" />
      <rect x={828} y={1622} width={16} height={22} fill="#1c1611" />
      <ellipse cx={540} cy={1650} rx={430} ry={22} fill="#000" opacity={0.5} filter="url(#brSoft)" />

      {/* the device on charge on the bed */}
      <ellipse cx={DEV.x} cy={DEV.y} rx={54} ry={12} fill="#1a0c04" opacity={Math.min(1, heat * 1.2) * 0.7} />
      <rect x={DEV.x - 34} y={DEV.y - 10} width={68} height={10} rx={4} fill="#262a31" stroke="#8d939c" strokeWidth={1} />
      <circle cx={DEV.x - 22} cy={DEV.y - 5} r={1.6} fill="#7fd0ff" />
      <circle cx={DEV.x - 15} cy={DEV.y - 5} r={1.6} fill="#7fd0ff" opacity={0.5 + 0.5 * Math.sin(t * 0.3)} />

      {/* night */}
      <rect x={-500} y={CEIL - 400} width={2080} height={1600} fill="url(#brNight)" />

      <g style={{ mixBlendMode: "screen" }}>
        {fire > 0 && <ellipse cx={DEV.x} cy={DEV.y - 20} rx={90 + 260 * fire} ry={70 + 200 * fire} fill="url(#brHot)" opacity={Math.min(1, fire * 1.1)} />}
        {phone > 0 && <ellipse cx={TPHONE.x} cy={TPHONE.y - 30} rx={150} ry={130} fill="url(#brCool)" opacity={phone * 0.8} />}
        {st > 0 && <ellipse cx={UNIT.x} cy={CEIL + 60} rx={900} ry={760} fill="url(#brStrobe)" opacity={0.42 * st} />}
      </g>
      <Smoke id="brSmoke" t={t} amount={smoke} emit={[{ x: DEV.x, y: DEV.y - 20, w: 50 }]} rise={500} size={44} />
      <Flame id="brFlame" x={DEV.x} y={DEV.y - 6} h={fh} t={t} />

      {/* the Protector on the ceiling */}
      {protector > 0 && (
        <g opacity={protector}>
          {/* its own soft pool on the ceiling so it reads in the dark */}
          <ellipse cx={UNIT.x} cy={CEIL - 4} rx={300} ry={70} fill="#c3cede" opacity={0.2} filter="url(#brSoft)" />
          <g transform={`translate(${UNIT.x} ${UNIT.y + 2}) scale(${UNIT.s}) translate(-540 -612)`}>
            <ProtectorUnit awake={awake} alarm={alarm} t={t} />
          </g>
        </g>
      )}
      {/* sensing: gold arcs falling from the unit */}
      {sense > 0 &&
        [0, 1, 2, 3].map((i) => {
          const ph = ((t * 0.016 + i / 4) % 1 + 1) % 1;
          const r = 60 + ph * 560;
          return <path key={i} d={`M${UNIT.x - r} ${CEIL + 26} A ${r} ${r * 0.92} 0 0 0 ${UNIT.x + r} ${CEIL + 26}`} stroke={C.gold} strokeWidth={2.4} fill="none" opacity={sense * (1 - ph) * 0.7} />;
        })}
      {/* siren: sound arcs either side of the unit */}
      {alarm > 0 &&
        [0, 1, 2].map((i) => {
          const ph = ((t * 0.05 + i / 3) % 1 + 1) % 1;
          const r = 150 + ph * 150;
          return (
            <g key={i} opacity={alarm * (1 - ph) * 0.85} stroke="#fafafa" strokeWidth={3.4} fill="none" strokeLinecap="round">
              <path d={`M${UNIT.x - r} ${CEIL + 20 - 26} A 60 60 0 0 0 ${UNIT.x - r} ${CEIL + 20 + 46}`} />
              <path d={`M${UNIT.x + r} ${CEIL + 20 - 26} A 60 60 0 0 1 ${UNIT.x + r} ${CEIL + 20 + 46}`} />
            </g>
          );
        })}
      {NOZ.map((nx, i) => (
        <Mist key={i} id={`brMist${i}`} x={nx} y={CEIL + 24} floor={1470} spread={i === 0 ? 150 : 190} t={t + i * 40} amount={mist} />
      ))}
    </g>
  );
};
