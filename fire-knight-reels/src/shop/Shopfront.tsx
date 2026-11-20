import React from "react";
import { REAL, noise1, rand } from "../fk/theme";
import { Smoke } from "./fx";

/**
 * A typical Indian market shopfront at night, in world = frame coordinates (zoom 1):
 * a rolling steel shutter (x 200-880, y 955-1468) with a perforated vision strip and a brass
 * padlock, a flex signboard above, neighbours either side, a pole and a tangle of overhead wires.
 * Real-world colours only; the brand palette never touches objects.
 */
export const SHOP = { x0: 200, x1: 880, top: 955, bottom: 1468 };
export const LOCK = { x: 540, y: 1452 };
export const VISION = { x0: 300, x1: 780, y0: 1168, y1: 1194 };

export type ShopfrontProps = {
  t: number;
  /** light seen through the gaps: cool fridge spill, green inverter LED blink, fire orange */
  cool?: number;
  green?: number;
  fire?: number;
  /** red / amber strobe from the Protector's siren light, leaking out */
  strobe?: number;
  smoke?: number;
  heat?: number; // shutter heating + shimmer + buckle
  street?: number; // street light level
  neighbours?: number;
};

const Shutter: React.FC<{ x0: number; x1: number; y0: number; y1: number; tone: [string, string, string]; id: string; glint?: number }> = ({
  x0,
  x1,
  y0,
  y1,
  tone,
  id,
  glint = 0.25,
}) => (
  <g>
    <defs>
      <linearGradient id={`${id}Slat`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={tone[0]} />
        <stop offset="0.45" stopColor={tone[1]} />
        <stop offset="1" stopColor={tone[2]} />
      </linearGradient>
      <pattern id={`${id}Pat`} width="20" height="13" patternUnits="userSpaceOnUse" y={y0}>
        <rect width="20" height="13" fill={`url(#${id}Slat)`} />
        <rect y="0" width="20" height="1.2" fill="#ffffff" opacity={glint} />
        <rect y="11.6" width="20" height="1.4" fill="#000" opacity="0.55" />
      </pattern>
    </defs>
    <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={`url(#${id}Pat)`} />
    {/* side guide channels */}
    <rect x={x0 - 8} y={y0 - 4} width={12} height={y1 - y0 + 4} fill="#2a2d31" />
    <rect x={x1 - 4} y={y0 - 4} width={12} height={y1 - y0 + 4} fill="#2a2d31" />
    {/* bottom bar */}
    <rect x={x0} y={y1 - 26} width={x1 - x0} height={26} fill="#3b3f44" />
    <rect x={x0} y={y1 - 26} width={x1 - x0} height={2} fill="#9aa1a8" opacity="0.4" />
  </g>
);

const Padlock: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* hasp plates */}
    <rect x={-30} y={-26} width={22} height={14} rx={2} fill="#555b61" />
    <rect x={8} y={-26} width={22} height={14} rx={2} fill="#555b61" />
    <rect x={-8} y={-30} width={16} height={22} rx={3} fill="#6c737a" />
    {/* shackle */}
    <path d="M-9 -14 V -24 a 9 9 0 0 1 18 0 V -14" stroke="#B9C0C6" strokeWidth={4} fill="none" />
    {/* brass body */}
    <defs>
      <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#E9C46A" />
        <stop offset="0.4" stopColor="#B88A2E" />
        <stop offset="1" stopColor="#6E4F14" />
      </linearGradient>
    </defs>
    <rect x={-15} y={-15} width={30} height={30} rx={5} fill="url(#brass)" />
    <rect x={-13} y={-13} width={6} height={26} rx={3} fill="#fff4cf" opacity={0.25 + 0.1 * Math.sin(t * 0.05)} />
    <circle cx={0} cy={2} r={3} fill="#3a2a08" />
    <rect x={-1} y={3} width={2} height={7} fill="#3a2a08" />
  </g>
);

/** Catenary between two points with sag. */
const wire = (x1: number, y1: number, x2: number, y2: number, sag: number) => `M${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 + sag} ${x2} ${y2}`;

const Unit: React.FC<{ x0: number; x1: number; sign: string; signInk: string; shutter: [string, string, string]; id: string; lit: number }> = ({
  x0,
  x1,
  sign,
  signInk,
  shutter,
  id,
  lit,
}) => (
  <g>
    <rect x={x0 - 10} y={830} width={x1 - x0 + 20} height={95} fill={sign} />
    <rect x={x0 + 40} y={858} width={(x1 - x0) * 0.5} height={22} rx={4} fill={signInk} opacity={0.5} />
    <rect x={x0 + 40} y={890} width={(x1 - x0) * 0.32} height={12} rx={3} fill={signInk} opacity={0.35} />
    <rect x={x0 - 6} y={925} width={x1 - x0 + 12} height={30} fill="#26292d" />
    <Shutter x0={x0} x1={x1} y0={955} y1={1468} tone={shutter} id={id} glint={0.12 + lit * 0.1} />
  </g>
);

export const Shopfront: React.FC<ShopfrontProps> = ({
  t,
  cool = 0.5,
  green = 1,
  fire = 0,
  strobe = 0,
  smoke = 0,
  heat = 0,
  street = 1,
  neighbours = 1,
}) => {
  const blink = Math.pow(Math.max(0, Math.sin(t * 0.12)), 18) * green; // short LED blink every ~1.7 s
  const flick = fire * (0.75 + 0.25 * noise1(t * 0.6, 2));
  const st = strobe * (Math.sin(t * 0.55) > 0 ? 1 : 0.15);
  const stColor = Math.sin(t * 0.275) > 0 ? REAL.lampRed : REAL.beacon;
  const shimmer = heat * 7;
  return (
    <g>
      <defs>
        <linearGradient id="sfWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d0c0b" />
          <stop offset="0.75" stopColor="#2a241d" />
          <stop offset="1" stopColor="#3a3127" />
        </linearGradient>
        <linearGradient id="sfPath" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2b2c" />
          <stop offset="1" stopColor="#0f0f10" />
        </linearGradient>
        <radialGradient id="sfSodium" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-160 600) scale(1500 1300)">
          <stop offset="0" stopColor={REAL.sodium} stopOpacity="0.38" />
          <stop offset="0.5" stopColor={REAL.sodium} stopOpacity="0.1" />
          <stop offset="1" stopColor={REAL.sodium} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sfInner" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#CFE8FF" />
          <stop offset="1" stopColor="#9CC9F0" />
        </linearGradient>
        <pattern id="sfHoles" width="10" height="9" patternUnits="userSpaceOnUse" x={VISION.x0} y={VISION.y0}>
          <circle cx="5" cy="4.5" r="2.5" fill="#fff" />
        </pattern>
        <mask id="sfHoleMask">
          <rect x={VISION.x0} y={VISION.y0} width={VISION.x1 - VISION.x0} height={VISION.y1 - VISION.y0} fill="url(#sfHoles)" />
        </mask>
        <linearGradient id="sfHeat" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={REAL.fireOrange} stopOpacity="0.75" />
          <stop offset="0.5" stopColor={REAL.fireRed} stopOpacity="0.25" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </linearGradient>
        <filter id="sfShimmer" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves="2" seed={Math.floor(t / 2)} />
          <feDisplacementMap in="SourceGraphic" scale={shimmer} />
        </filter>
        <filter id="sfBloom" x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* building */}
      <rect x={-1400} y={-1400} width={3900} height={2900} fill="url(#sfWall)" />
      {/* upper-floor window with grille */}
      <rect x={330} y={540} width={420} height={220} fill="#0a0b0c" stroke="#3a3128" strokeWidth={10} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={340 + i * 60} y={545} width={4} height={210} fill="#4a4036" />
      ))}
      <rect x={335} y={645} width={410} height={4} fill="#4a4036" />
      {/* AC outdoor unit */}
      <rect x={800} y={600} width={150} height={110} rx={6} fill="#bfc1bd" opacity={0.35} />
      <circle cx={850} cy={655} r={36} fill="#2a2b2c" opacity={0.6} />

      {/* neighbours */}
      <g opacity={neighbours}>
        <Unit x0={-560} x1={140} sign="#7a5a12" signInk="#1b1405" shutter={["#4f6b56", "#3f5a45", "#22322a"]} id="nL" lit={street} />
        <Unit x0={940} x1={1640} sign="#6e1a16" signInk="#f3e7d0" shutter={["#4d6a8a", "#34506e", "#1c2c40"]} id="nR" lit={street} />
      </g>
      {/* pillars */}
      {[140, 880, 910].map((x, i) => (
        <rect key={i} x={i === 1 ? 880 : x} y={830} width={i === 1 ? 30 : 30} height={640} fill="#4a4036" />
      ))}
      <rect x={170} y={830} width={30} height={640} fill="#4a4036" />

      {/* the shop: flex sign (unlit at night) */}
      <rect x={190} y={830} width={700} height={95} fill="#123a6b" />
      <rect x={190} y={830} width={700} height={95} fill="#000" opacity={0.35} />
      <text x={540} y={893} textAnchor="middle" fontFamily="FK Anton" fontSize={50} letterSpacing="4" fill="#e9eef5" opacity={0.6}>
        GENERAL STORE
      </text>
      <rect x={194} y={925} width={692} height={30} fill="#26292d" />
      <rect x={194} y={950} width={692} height={4} fill="#000" opacity={0.6} />

      {/* the shutter (shimmers when hot) */}
      <g filter={heat > 0.02 ? "url(#sfShimmer)" : undefined}>
        <Shutter x0={SHOP.x0} x1={SHOP.x1} y0={SHOP.top} y1={SHOP.bottom} tone={["#9aa0a6", "#6f757c", "#3c4146"]} id="sh" glint={0.12 + 0.12 * street} />
        {/* buckle: a heat-warped bulge across the middle slats */}
        {heat > 0 && (
          <path
            d={`M${SHOP.x0} 1300 C 380 ${1300 - 30 * heat}, 700 ${1300 - 30 * heat}, ${SHOP.x1} 1300 L ${SHOP.x1} 1330 C 700 ${1330 - 18 * heat}, 380 ${1330 - 18 * heat}, ${SHOP.x0} 1330 Z`}
            fill="#000"
            opacity={0.35 * heat}
          />
        )}
        <rect x={SHOP.x0} y={SHOP.top} width={SHOP.x1 - SHOP.x0} height={SHOP.bottom - SHOP.top} fill="url(#sfHeat)" opacity={heat * flick} style={{ mixBlendMode: "screen" }} />
        {/* vision strip: dark holes, then whatever light is inside */}
        <rect x={VISION.x0} y={VISION.y0} width={VISION.x1 - VISION.x0} height={VISION.y1 - VISION.y0} fill="#050505" mask="url(#sfHoleMask)" />
        <g mask="url(#sfHoleMask)">
          <rect x={VISION.x0} y={VISION.y0} width={VISION.x1 - VISION.x0} height={VISION.y1 - VISION.y0} fill="url(#sfInner)" opacity={cool * 0.55} />
          <rect x={640} y={VISION.y0} width={60} height={VISION.y1 - VISION.y0} fill="#3BEA6A" opacity={blink} />
          <rect x={VISION.x0} y={VISION.y0} width={VISION.x1 - VISION.x0} height={VISION.y1 - VISION.y0} fill={REAL.fireOrange} opacity={flick} />
          <rect x={VISION.x0} y={VISION.y0} width={VISION.x1 - VISION.x0} height={VISION.y1 - VISION.y0} fill={stColor} opacity={st} />
        </g>
        <Padlock x={LOCK.x} y={LOCK.y} t={t} />
      </g>

      {/* gap under the shutter */}
      <rect x={SHOP.x0} y={SHOP.bottom - 1} width={SHOP.x1 - SHOP.x0} height={4} fill="#000" />
      <g style={{ mixBlendMode: "screen" }}>
        <rect x={SHOP.x0 + 10} y={SHOP.bottom} width={SHOP.x1 - SHOP.x0 - 20} height={3} fill="#BFE3FF" opacity={cool * 0.5} />
        <rect x={SHOP.x0 + 10} y={SHOP.bottom} width={SHOP.x1 - SHOP.x0 - 20} height={3} fill={REAL.fireYellow} opacity={flick} />
        <rect x={SHOP.x0 + 10} y={SHOP.bottom} width={SHOP.x1 - SHOP.x0 - 20} height={3} fill={stColor} opacity={st} />
        <ellipse cx={540} cy={SHOP.bottom + 14} rx={330} ry={16} fill="#BFE3FF" opacity={cool * 0.18} filter="url(#sfBloom)" />
        <ellipse cx={540} cy={SHOP.bottom + 14} rx={340} ry={22} fill={REAL.fireOrange} opacity={flick * 0.8} filter="url(#sfBloom)" />
        <ellipse cx={540} cy={VISION.y0 + 12} rx={260} ry={18} fill={REAL.fireOrange} opacity={flick * 0.5} filter="url(#sfBloom)" />
        <ellipse cx={540} cy={SHOP.bottom + 14} rx={340} ry={22} fill={stColor} opacity={st * 0.7} filter="url(#sfBloom)" />
      </g>

      {/* plinth + footpath */}
      <rect x={-1400} y={1468} width={3900} height={34} fill="#55504a" />
      <rect x={-1400} y={1468} width={3900} height={3} fill="#8a8178" opacity={0.6} />
      <rect x={-1400} y={1502} width={3900} height={1300} fill="url(#sfPath)" />
      {Array.from({ length: 18 }).map((_, i) => (
        <line key={i} x1={-800 + i * 160} y1={1502} x2={-800 + i * 160 - 60 + (i - 9) * 30} y2={1920} stroke="#000" strokeWidth={2} opacity={0.35} />
      ))}

      {/* pole + wires */}
      <rect x={1000} y={-600} width={22} height={2110} fill="#3a3a3b" />
      <rect x={1000} y={-600} width={5} height={2110} fill="#6a6a6b" opacity={0.6} />
      <rect x={985} y={740} width={52} height={70} rx={4} fill="#4a4c4e" />
      <g stroke="#0c0c0c" fill="none" strokeWidth={3}>
        {Array.from({ length: 11 }).map((_, i) => {
          const y1 = 640 + rand(i) * 120;
          const y2 = 700 + rand(i + 9) * 120;
          return <path key={i} d={wire(-800, y1, 1011, y2, 60 + rand(i + 3) * 90)} />;
        })}
        {Array.from({ length: 7 }).map((_, i) => (
          <path key={`r${i}`} d={wire(1011, 720 + i * 14, 1900, 650 + rand(i + 20) * 160, 50 + rand(i + 30) * 70)} />
        ))}
        <path d={wire(1011, 780, 560, 935, 40)} strokeWidth={4} />
      </g>

      {/* sodium street light wash */}
      <rect x={-1400} y={-1400} width={3900} height={4200} fill="url(#sfSodium)" opacity={street} style={{ mixBlendMode: "screen" }} />

      {/* smoke out of every gap */}
      <Smoke
        id="sfSmoke"
        t={t}
        amount={smoke}
        emit={[
          { x: 540, y: 950, w: 640 },
          { x: 540, y: 1180, w: 420 },
          { x: 540, y: 1470, w: 600 },
        ]}
        rise={620}
        size={80}
      />
    </g>
  );
};
