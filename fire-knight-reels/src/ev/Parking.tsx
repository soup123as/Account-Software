import React from "react";
import { REAL, rand } from "../fk/theme";
import { GROUND } from "./Car";

/**
 * Where an EV spends its day, at night (world = frame coordinates; the floor line is GROUND = 1300):
 *  - "basement": a mall basement. Low slab with ducts and tube lights, hazard-striped columns, a B2 sign,
 *    a CCTV dome on the ceiling.
 *  - "office": an open office car park. A tower with a few lit floors, a sodium lamp post, a boundary wall.
 *  - "charger": a charging station. A lit canopy, the charger pedestal, a green bay.
 *  - "society": stilt parking under a housing block. Balconies above, plain columns, one warm bulb.
 * The car is drawn by the scene on top of this. Each place has one motivated key light.
 */
export type Place = "basement" | "office" | "charger" | "society";
export const CCTV = { x: 770, y: 712 };

const Night: React.FC<{ id: string; cx: number; cy: number; color: string; o?: number; rx?: number; ry?: number }> = ({ id, cx, cy, color, o = 0.5, rx = 760, ry = 760 }) => (
  <g>
    <defs>
      <radialGradient id={`${id}D`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${cx} ${cy + 260}) scale(${rx * 1.25} ${ry * 1.25})`}>
        <stop offset="0" stopColor="#020304" stopOpacity="0.42" />
        <stop offset="0.55" stopColor="#020304" stopOpacity="0.72" />
        <stop offset="1" stopColor="#020304" stopOpacity="0.95" />
      </radialGradient>
      <radialGradient id={`${id}L`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${cx} ${cy}) scale(${rx} ${ry})`}>
        <stop offset="0" stopColor={color} stopOpacity={o} />
        <stop offset="1" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x={-400} y={200} width={1880} height={1720} fill={`url(#${id}D)`} />
    <rect x={-400} y={200} width={1880} height={1720} fill={`url(#${id}L)`} style={{ mixBlendMode: "screen" }} />
  </g>
);

const Floor: React.FC<{ tone?: string; lines?: string }> = ({ tone = "#34383c", lines = "#d9dde1" }) => (
  <g>
    <defs>
      <linearGradient id="pkFloor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={tone} />
        <stop offset="1" stopColor="#0e0f10" />
      </linearGradient>
    </defs>
    <rect x={-400} y={GROUND} width={1880} height={620} fill="url(#pkFloor)" />
    {/* painted bay lines running toward the camera */}
    <polygon points={`96,${GROUND} 110,${GROUND} -40,1920 -90,1920`} fill={lines} opacity={0.5} />
    <polygon points={`970,${GROUND} 984,${GROUND} 1170,1920 1120,1920`} fill={lines} opacity={0.5} />
    <rect x={-400} y={GROUND} width={1880} height={5} fill="#000" opacity={0.5} />
  </g>
);

const Column: React.FC<{ x: number; top: number; hazard?: boolean }> = ({ x, top, hazard }) => (
  <g>
    <rect x={x} y={top} width={92} height={GROUND - top} fill="#5a5e62" />
    <rect x={x} y={top} width={10} height={GROUND - top} fill="#fff" opacity={0.12} />
    <rect x={x + 72} y={top} width={20} height={GROUND - top} fill="#000" opacity={0.3} />
    {hazard && (
      <g>
        <rect x={x} y={GROUND - 230} width={92} height={230} fill="#E8C22A" />
        {Array.from({ length: 7 }).map((_, i) => (
          <polygon key={i} points={`${x},${GROUND - 230 + i * 40} ${x + 92},${GROUND - 270 + i * 40} ${x + 92},${GROUND - 250 + i * 40} ${x},${GROUND - 210 + i * 40}`} fill="#17181a" />
        ))}
        <rect x={x} y={GROUND - 230} width={92} height={230} fill="#000" opacity={0.25} />
      </g>
    )}
  </g>
);

/** `children` (the car) are drawn inside the set, under its night pass, so they sit in the same light. */
export const Parking: React.FC<{ place: Place; t: number; cctv?: number; children?: React.ReactNode }> = ({ place, t, cctv = 0, children }) => {
  if (place === "basement") {
    return (
      <g>
        <defs>
          <linearGradient id="pkWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3d4144" />
            <stop offset="1" stopColor="#2b2e31" />
          </linearGradient>
        </defs>
        <rect x={-400} y={560} width={1880} height={150} fill="#232527" />
        <rect x={-400} y={700} width={1880} height={600} fill="url(#pkWall)" />
        {/* painted dado: grey-blue band with a yellow line, like every basement */}
        <rect x={-400} y={1060} width={1880} height={240} fill="#2d3a45" />
        <rect x={-400} y={1052} width={1880} height={10} fill="#E8C22A" opacity={0.85} />
        {/* slab beams, ducts, a cable tray */}
        {[60, 520, 980].map((x) => (
          <rect key={x} x={x - 30} y={690} width={60} height={34} fill="#1b1d1f" />
        ))}
        <rect x={-400} y={742} width={1880} height={30} rx={6} fill="#8d949a" />
        <rect x={-400} y={742} width={1880} height={5} fill="#fff" opacity={0.35} />
        <rect x={-400} y={790} width={1880} height={8} fill="#5e6469" />
        {/* tube lights: the key light */}
        {[300, 760].map((x) => (
          <g key={x}>
            <rect x={x - 110} y={716} width={220} height={12} rx={5} fill="#F1F7FF" />
            <rect x={x - 130} y={708} width={260} height={10} fill="#3a3d40" />
          </g>
        ))}
        {/* level sign */}
        <rect x={410} y={860} width={250} height={110} rx={8} fill="#14263f" />
        <text x={470} y={940} fontFamily="FK Anton" fontSize={84} fill="#e9edf2">
          B2
        </text>
        <path d="M580 915 h46 m-18 -18 l18 18 l-18 18" stroke="#e9edf2" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Column x={-10} top={700} hazard />
        <Column x={996} top={700} hazard />
        <Floor />
        {/* CCTV dome on the slab */}
        <g>
          <rect x={CCTV.x - 26} y={CCTV.y - 12} width={52} height={12} rx={3} fill="#d9dde1" />
          <path d={`M${CCTV.x - 22} ${CCTV.y} a22 22 0 0 0 44 0 z`} fill="#16181b" stroke="#8d949a" strokeWidth={2} />
          <circle cx={CCTV.x - 6} cy={CCTV.y + 9} r={5} fill="#0a0a0a" stroke="#5a6068" strokeWidth={1.5} />
          <circle cx={CCTV.x + 10} cy={CCTV.y + 5} r={2.4} fill="#FF2A1E" opacity={0.5 + 0.5 * Math.sin(t * 0.2)} />
          {cctv > 0 && <polygon points={`${CCTV.x - 6},${CCTV.y + 10} 300,${GROUND} 860,${GROUND}`} fill="#EAF4FF" opacity={0.06 * cctv} />}
        </g>
        {children}
        <Night id="pkB" cx={540} cy={780} color="#CFE3FF" o={0.36} rx={760} ry={700} />
      </g>
    );
  }
  if (place === "office") {
    return (
      <g>
        <defs>
          <linearGradient id="pkSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#060a12" />
            <stop offset="1" stopColor="#152033" />
          </linearGradient>
          <linearGradient id="pkTower" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#27303b" />
            <stop offset="1" stopColor="#161c24" />
          </linearGradient>
        </defs>
        <rect x={-400} y={200} width={1880} height={1100} fill="url(#pkSky)" />
        {/* the office tower, a few floors still lit */}
        <rect x={470} y={330} width={640} height={850} fill="url(#pkTower)" />
        {Array.from({ length: 11 }).map((_, r) =>
          Array.from({ length: 8 }).map((__, c) => {
            const s = r * 13 + c * 7;
            const lit = rand(s) > 0.72 || r === 3;
            return <rect key={s} x={496 + c * 76} y={360 + r * 72} width={60} height={46} fill={lit ? "#BFE3FF" : "#0f141a"} opacity={lit ? 0.5 + 0.4 * rand(s + 1) : 1} />;
          }),
        )}
        <rect x={-400} y={1150} width={1880} height={150} fill="#3b3f43" />
        <rect x={-400} y={1150} width={1880} height={8} fill="#6a7077" />
        {/* P sign and the lamp post */}
        <rect x={980} y={980} width={12} height={170} fill="#8d949a" />
        <rect x={946} y={900} width={80} height={90} rx={8} fill="#1d4f9c" />
        <text x={986} y={972} textAnchor="middle" fontFamily="FK Anton" fontSize={70} fill="#fff">
          P
        </text>
        <rect x={70} y={520} width={14} height={780} fill="#5e6469" />
        <path d="M77 520 q0 -40 60 -40 h70" stroke="#5e6469" strokeWidth={12} fill="none" />
        <rect x={180} y={470} width={80} height={22} rx={8} fill="#FFE2B0" />
        <polygon points="190,492 250,492 620,1300 -120,1300" fill={REAL.sodium} opacity={0.1} />
        <Floor tone="#2f3336" />
        {children}
        <Night id="pkO" cx={230} cy={620} color={REAL.sodium} o={0.5} rx={900} ry={900} />
      </g>
    );
  }
  if (place === "charger") {
    return (
      <g>
        <defs>
          <linearGradient id="pkSky2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#05080d" />
            <stop offset="1" stopColor="#101822" />
          </linearGradient>
        </defs>
        <rect x={-400} y={200} width={1880} height={1100} fill="url(#pkSky2)" />
        <rect x={-400} y={1120} width={1880} height={180} fill="#252a2f" />
        {/* canopy with a light strip */}
        <rect x={-60} y={690} width={1200} height={46} rx={8} fill="#e9edf2" />
        <rect x={-60} y={736} width={1200} height={10} fill="#F1FFF6" />
        <rect x={-60} y={690} width={1200} height={8} fill="#35E06A" />
        {[20, 1010].map((x) => (
          <rect key={x} x={x} y={736} width={26} height={564} fill="#aab1b8" />
        ))}
        {/* the charger pedestal */}
        <rect x={-6} y={1010} width={120} height={290} rx={12} fill="#eef1f4" />
        <rect x={-6} y={1010} width={120} height={56} rx={12} fill="#1F9D55" />
        <rect x={10} y={1086} width={88} height={64} rx={6} fill="#0b1118" />
        <rect x={18} y={1096} width={50} height={8} rx={4} fill="#35E06A" />
        <rect x={18} y={1112} width={70} height={6} rx={3} fill="#6f8296" />
        <rect x={18} y={1126} width={40} height={6} rx={3} fill="#6f8296" />
        <circle cx={54} cy={1040} r={10} fill="#eafff1" />
        <rect x={84} y={1170} width={26} height={60} rx={6} fill="#15171a" />
        {/* green EV bay */}
        <Floor tone="#1f3a2b" lines="#eafff1" />
        <polygon points={`180,${GROUND + 60} 900,${GROUND + 60} 1000,${GROUND + 260} 80,${GROUND + 260}`} fill="#1F9D55" opacity={0.35} />
        <text x={540} y={GROUND + 210} textAnchor="middle" fontFamily="FK Anton" fontSize={130} fill="#eafff1" opacity={0.55} letterSpacing={10}>
          EV
        </text>
        {children}
        <Night id="pkC" cx={540} cy={760} color="#E6FFF0" o={0.5} rx={900} ry={800} />
      </g>
    );
  }
  return (
    <g>
      <defs>
        <linearGradient id="pkFlat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3530" />
          <stop offset="1" stopColor="#2a2622" />
        </linearGradient>
      </defs>
      {/* the housing block above the stilts */}
      <rect x={-400} y={200} width={1880} height={520} fill="url(#pkFlat)" />
      {Array.from({ length: 3 }).map((_, r) =>
        Array.from({ length: 5 }).map((__, c) => {
          const s = r * 9 + c * 5;
          const lit = rand(s + 3) > 0.6;
          return (
            <g key={s}>
              <rect x={30 + c * 216} y={250 + r * 150} width={150} height={96} fill={lit ? "#FFD9A0" : "#15130f"} opacity={lit ? 0.55 : 1} />
              <rect x={20 + c * 216} y={346 + r * 150} width={170} height={14} fill="#5a5148" />
              {Array.from({ length: 7 }).map((___, k) => (
                <rect key={k} x={26 + c * 216 + k * 24} y={318 + r * 150} width={4} height={30} fill="#5a5148" />
              ))}
            </g>
          );
        }),
      )}
      <rect x={-400} y={700} width={1880} height={40} fill="#1d1b18" />
      <rect x={-400} y={740} width={1880} height={560} fill="#3d3a36" />
      <rect x={-400} y={1100} width={1880} height={200} fill="#2b2926" />
      <text x={700} y={980} fontFamily="FK Anton" fontSize={76} fill="#d8d1c4" opacity={0.6} letterSpacing={4}>
        A-304
      </text>
      <Column x={-10} top={740} />
      <Column x={996} top={740} />
      {/* one warm bulb */}
      <rect x={338} y={740} width={4} height={70} fill="#111" />
      <circle cx={340} cy={822} r={14} fill="#FFE2B0" />
      <Floor tone="#35322e" />
      {children}
      <Night id="pkS" cx={340} cy={830} color="#FFD9A0" o={0.5} rx={860} ry={820} />
    </g>
  );
};
