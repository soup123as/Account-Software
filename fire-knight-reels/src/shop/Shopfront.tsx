import React from "react";
import { REAL, noise1, rand } from "../fk/theme";
import { Smoke } from "./fx";

/**
 * An Indian market shopfront at night (world = frame coordinates at zoom 1). Real proportions:
 * a 3.4 m wide galvanised rolling shutter (x 200-880, y 955-1468) with a perforated vision strip,
 * a brass padlock on the bottom bar, a flex sign in an aluminium frame, plaster pillars with
 * granite cladding, a kota-stone plinth, an interlocking-tile footpath, an electricity pole with a
 * wire tangle and a sodium street light from the left. Real-world colours only.
 */
export const SHOP = { x0: 200, x1: 880, top: 955, bottom: 1468 };
export const LOCK = { x: 540, y: 1452 };
export const VISION = { x0: 300, x1: 780, y0: 1168, y1: 1194 };

export type ShopfrontProps = {
  t: number;
  cool?: number; // cooler light leaking through the gaps
  green?: number; // inverter LED blink
  fire?: number; // fire light inside
  strobe?: number; // Protector siren light inside
  smoke?: number;
  heat?: number; // shutter heating: shimmer, buckle, scorched paint
  street?: number;
  neighbours?: number;
};

/** One galvanised rolling shutter with real slat profile, grime and a light falloff. */
const Shutter: React.FC<{ id: string; x0: number; x1: number; y0: number; y1: number; tint?: string; paint?: number }> = ({
  id,
  x0,
  x1,
  y0,
  y1,
  tint = "#8f969d",
  paint = 0,
}) => {
  const w = x1 - x0;
  const h = y1 - y0;
  return (
    <g>
      <defs>
        {/* slat profile: rolled crest highlight, flat face, crease shadow */}
        <linearGradient id={`${id}Slat`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.12" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="0.45" stopColor="#000000" stopOpacity="0" />
          <stop offset="0.82" stopColor="#000000" stopOpacity="0.28" />
          <stop offset="0.92" stopColor="#000000" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.12" />
        </linearGradient>
        <pattern id={`${id}Pat`} width="40" height="14" patternUnits="userSpaceOnUse" y={y0}>
          <rect width="40" height="14" fill={`url(#${id}Slat)`} />
        </pattern>
        {/* light falloff: street light from the left, darker to the right and at the bottom */}
        <linearGradient id={`${id}Fall`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.22" />
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={`${id}Grime`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c140c" stopOpacity="0.35" />
          <stop offset="0.12" stopColor="#1c140c" stopOpacity="0" />
          <stop offset="0.78" stopColor="#2a1b0e" stopOpacity="0" />
          <stop offset="1" stopColor="#2a1b0e" stopOpacity="0.55" />
        </linearGradient>
        <filter id={`${id}Dirt`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.012" numOctaves="3" seed={7} />
          <feColorMatrix values="0 0 0 0 0.12  0 0 0 0 0.09  0 0 0 0 0.06  0 0 0 1.4 -0.55" />
        </filter>
      </defs>
      <rect x={x0} y={y0} width={w} height={h} fill={tint} />
      {paint > 0 && <rect x={x0} y={y0} width={w} height={h} fill="#2b1a10" opacity={paint} />}
      <rect x={x0} y={y0} width={w} height={h} fill={`url(#${id}Pat)`} />
      <rect x={x0} y={y0} width={w} height={h} filter={`url(#${id}Dirt)`} opacity={0.55} />
      <rect x={x0} y={y0} width={w} height={h} fill={`url(#${id}Grime)`} />
      <rect x={x0} y={y0} width={w} height={h} fill={`url(#${id}Fall)`} />
      {/* rust runs from the guide rails */}
      {[0.08, 0.31, 0.62, 0.9].map((k, i) => (
        <rect key={i} x={x0 + w * k} y={y0 + h * (0.2 + rand(i + 4) * 0.3)} width={3 + rand(i) * 4} height={h * (0.3 + rand(i + 1) * 0.4)} fill="#6b3a17" opacity={0.18} />
      ))}
      {/* guide channels with depth */}
      <rect x={x0 - 14} y={y0 - 6} width={16} height={h + 6} fill="#2d3135" />
      <rect x={x0 - 14} y={y0 - 6} width={3} height={h + 6} fill="#8d949b" opacity={0.5} />
      <rect x={x1 - 2} y={y0 - 6} width={16} height={h + 6} fill="#1d2023" />
      <rect x={x1 + 11} y={y0 - 6} width={3} height={h + 6} fill="#5d6369" opacity={0.5} />
      {/* bottom bar (angle iron) with handles */}
      <rect x={x0} y={y1 - 30} width={w} height={30} fill="#41464b" />
      <rect x={x0} y={y1 - 30} width={w} height={3} fill="#c3c9cf" opacity={0.45} />
      <rect x={x0} y={y1 - 6} width={w} height={6} fill="#15171a" />
      {[x0 + w * 0.22, x0 + w * 0.78].map((hx) => (
        <g key={hx}>
          <path d={`M${hx - 26} ${y1 - 30} v -12 a 6 6 0 0 1 6 -6 h 40 a 6 6 0 0 1 6 6 v 12`} stroke="#9aa1a7" strokeWidth={5} fill="none" />
          <path d={`M${hx - 26} ${y1 - 30} v -12 a 6 6 0 0 1 6 -6 h 40`} stroke="#e7ebee" strokeWidth={1.5} fill="none" opacity={0.6} />
        </g>
      ))}
    </g>
  );
};

/** Brass padlock on a welded hasp. */
const Padlock: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <defs>
      <linearGradient id="plBrass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F3D27A" />
        <stop offset="0.35" stopColor="#C49433" />
        <stop offset="0.7" stopColor="#8A6418" />
        <stop offset="1" stopColor="#4E370B" />
      </linearGradient>
      <linearGradient id="plSteel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#6f767c" />
        <stop offset="0.4" stopColor="#e3e7ea" />
        <stop offset="1" stopColor="#5d6368" />
      </linearGradient>
    </defs>
    <rect x={-34} y={-30} width={26} height={16} rx={2} fill="#4b5056" />
    <rect x={8} y={-30} width={26} height={16} rx={2} fill="#4b5056" />
    <rect x={-34} y={-30} width={26} height={3} fill="#a9b0b6" opacity={0.6} />
    <rect x={-9} y={-34} width={18} height={26} rx={3} fill="#5c6268" />
    <path d="M-10 -14 V -26 a 10 10 0 0 1 20 0 V -14" stroke="url(#plSteel)" strokeWidth={5} fill="none" />
    <rect x={-17} y={-15} width={34} height={34} rx={6} fill="url(#plBrass)" />
    <rect x={-15} y={-13} width={7} height={30} rx={3} fill="#fff6d6" opacity={0.3 + 0.08 * Math.sin(t * 0.05)} />
    <rect x={-17} y={13} width={34} height={6} rx={3} fill="#3a2a08" opacity={0.35} />
    <circle cx={0} cy={2} r={3.4} fill="#2b1f06" />
    <path d="M-1.4 3 h2.8 l1 9 h-4.8z" fill="#2b1f06" />
    <ellipse cx={0} cy={26} rx={20} ry={4} fill="#000" opacity={0.45} />
  </g>
);

const wire = (x1: number, y1: number, x2: number, y2: number, sag: number) => `M${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 + sag} ${x2} ${y2}`;

/** Flex sign in an aluminium box frame. Unlit at night. */
const Sign: React.FC<{ x0: number; x1: number; bg: string; ink: string; title: string; sub: string; id: string }> = ({ x0, x1, bg, ink, title, sub, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}Flex`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.35" />
      </linearGradient>
    </defs>
    <rect x={x0 - 14} y={822} width={x1 - x0 + 28} height={110} fill="#6d7378" />
    <rect x={x0 - 14} y={822} width={x1 - x0 + 28} height={3} fill="#d9dee2" opacity={0.6} />
    <rect x={x0 - 6} y={830} width={x1 - x0 + 12} height={94} fill={bg} />
    <rect x={x0 - 6} y={830} width={x1 - x0 + 12} height={94} fill={`url(#${id}Flex)`} />
    <text x={(x0 + x1) / 2} y={884} textAnchor="middle" fontFamily="FK Anton" fontSize={46} letterSpacing="3" fill={ink}>
      {title}
    </text>
    <text x={(x0 + x1) / 2} y={911} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={600} fontSize={17} letterSpacing="2" fill={ink} opacity={0.8}>
      {sub}
    </text>
    {/* shadow the sign box throws on the shutter housing */}
    <rect x={x0 - 14} y={932} width={x1 - x0 + 28} height={26} fill="#000" opacity={0.5} />
  </g>
);

const Pillar: React.FC<{ x: number; w?: number }> = ({ x, w = 30 }) => (
  <g>
    <rect x={x} y={812} width={w} height={660} fill="#5b4e3f" />
    <rect x={x} y={812} width={w} height={660} fill="url(#sfPlaster)" opacity={0.5} />
    <rect x={x} y={812} width={4} height={660} fill="#c9a77a" opacity={0.25} />
    {/* granite cladding at the base */}
    <rect x={x - 2} y={1330} width={w + 4} height={140} fill="#2a2523" />
    <rect x={x - 2} y={1330} width={w + 4} height={2} fill="#9a8f86" opacity={0.6} />
    {[1365, 1402, 1440].map((y) => (
      <rect key={y} x={x} y={y} width={w} height={1} fill="#000" opacity={0.6} />
    ))}
  </g>
);

const Unit: React.FC<{ x0: number; x1: number; id: string; sign: [string, string, string, string]; tint: string; paint: number }> = ({ x0, x1, id, sign, tint, paint }) => (
  <g>
    <Sign x0={x0} x1={x1} bg={sign[0]} ink={sign[1]} title={sign[2]} sub={sign[3]} id={`${id}S`} />
    <rect x={x0 - 6} y={930} width={x1 - x0 + 12} height={28} fill="#26292d" />
    <Shutter id={id} x0={x0} x1={x1} y0={958} y1={1468} tint={tint} paint={paint} />
  </g>
);

export const Shopfront: React.FC<ShopfrontProps> = ({ t, cool = 0.5, green = 1, fire = 0, strobe = 0, smoke = 0, heat = 0, street = 1, neighbours = 1 }) => {
  const blink = Math.pow(Math.max(0, Math.sin(t * 0.12)), 18) * green;
  const flick = fire * (0.75 + 0.25 * noise1(t * 0.6, 2));
  const st = strobe * (Math.sin(t * 0.55) > 0 ? 1 : 0.15);
  const stColor = Math.sin(t * 0.275) > 0 ? REAL.lampRed : REAL.beacon;
  return (
    <g>
      <defs>
        <linearGradient id="sfWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b0a09" />
          <stop offset="0.72" stopColor="#3a3027" />
          <stop offset="1" stopColor="#4a3d30" />
        </linearGradient>
        <filter id="sfPlasterF" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed={3} />
          <feColorMatrix values="0 0 0 0 0.05  0 0 0 0 0.04  0 0 0 0 0.03  0 0 0 1.6 -0.6" />
        </filter>
        <pattern id="sfPlaster" width="600" height="600" patternUnits="userSpaceOnUse">
          <rect width="600" height="600" filter="url(#sfPlasterF)" />
        </pattern>
        <linearGradient id="sfPath" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3734" />
          <stop offset="1" stopColor="#121110" />
        </linearGradient>
        <pattern id="sfPavers" width="64" height="40" patternUnits="userSpaceOnUse" y={1502}>
          <rect width="64" height="40" fill="none" />
          <path d="M0 0 H64 M0 20 H64 M0 0 V20 M32 20 V40" stroke="#000" strokeWidth="2" opacity="0.4" />
        </pattern>
        <radialGradient id="sfSodium" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-160 600) scale(1500 1300)">
          <stop offset="0" stopColor={REAL.sodium} stopOpacity="0.42" />
          <stop offset="0.5" stopColor={REAL.sodium} stopOpacity="0.12" />
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
          <stop offset="0" stopColor={REAL.fireOrange} stopOpacity="0.7" />
          <stop offset="0.5" stopColor={REAL.fireRed} stopOpacity="0.22" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </linearGradient>
        <filter id="sfShimmer" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves="2" seed={Math.floor(t / 2)} />
          <feDisplacementMap in="SourceGraphic" scale={heat * 7} />
        </filter>
        <filter id="sfBloom" x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <radialGradient id="sfPuddle" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
      </defs>

      {/* building and upper floor */}
      <rect x={-1400} y={-1400} width={3900} height={2900} fill="url(#sfWall)" />
      <rect x={-1400} y={-1400} width={3900} height={2900} fill="url(#sfPlaster)" opacity={0.4} />
      <rect x={-1400} y={790} width={3900} height={22} fill="#2b241d" />
      <rect x={-1400} y={790} width={3900} height={3} fill="#a08463" opacity={0.25} />
      {/* window with MS grille + a curtain behind */}
      <rect x={326} y={536} width={428} height={228} fill="#3a3128" />
      <rect x={336} y={546} width={408} height={208} fill="#0b0c0d" />
      <rect x={336} y={546} width={408} height={208} fill="#3d2a24" opacity={0.35} />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={340 + i * 57} y={546} width={5} height={208} fill="#2a2420" />
      ))}
      <rect x={336} y={648} width={408} height={5} fill="#2a2420" />
      <rect x={316} y={764} width={448} height={10} fill="#4a3f33" />
      {/* split-AC outdoor unit on a bracket */}
      <g opacity={0.9}>
        <rect x={800} y={596} width={156} height={112} rx={6} fill="#a9aba6" />
        <rect x={800} y={596} width={156} height={112} rx={6} fill="#000" opacity={0.45} />
        <circle cx={852} cy={652} r={38} fill="#1d1e1f" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={814} y1={622 + i * 15} x2={890} y2={622 + i * 15} stroke="#3a3b3c" strokeWidth={2} />
        ))}
        <rect x={906} y={612} width={40} height={80} fill="#7b7d79" opacity={0.6} />
        <path d="M800 708 L 790 730 M956 708 L 966 730" stroke="#3a3a3a" strokeWidth={4} />
      </g>

      {/* neighbours */}
      <g opacity={neighbours}>
        <Unit x0={-560} x1={140} id="nL" sign={["#E3B81D", "#1d1606", "SAI MOBILE", "REPAIR · ACCESSORIES"]} tint="#557a5e" paint={0.15} />
        <Unit x0={940} x1={1640} id="nR" sign={["#8E1D18", "#f6ead2", "NEW FASHION", "LADIES · KIDS WEAR"]} tint="#4f6f92" paint={0.15} />
      </g>
      <Pillar x={140} />
      <Pillar x={170} />
      <Pillar x={880} />
      <Pillar x={910} />

      {/* the shop */}
      <Sign x0={200} x1={880} bg="#16457e" ink="#f2f5f9" title="SHARMA GENERAL STORE" sub="KIRANA · DAIRY · COLD DRINKS" id="sMain" />
      <rect x={194} y={930} width={692} height={28} fill="#2b2f33" />
      <rect x={194} y={930} width={692} height={4} fill="#8a9096" opacity={0.4} />

      <g filter={heat > 0.02 ? "url(#sfShimmer)" : undefined}>
        <Shutter id="sh" x0={SHOP.x0} x1={SHOP.x1} y0={SHOP.top} y1={SHOP.bottom} paint={heat * 0.35} />
        {heat > 0 && (
          <path
            d={`M${SHOP.x0} 1300 C 380 ${1300 - 30 * heat}, 700 ${1300 - 30 * heat}, ${SHOP.x1} 1300 L ${SHOP.x1} 1330 C 700 ${1330 - 18 * heat}, 380 ${1330 - 18 * heat}, ${SHOP.x0} 1330 Z`}
            fill="#000"
            opacity={0.35 * heat}
          />
        )}
        <rect x={SHOP.x0} y={SHOP.top} width={SHOP.x1 - SHOP.x0} height={SHOP.bottom - SHOP.top} fill="url(#sfHeat)" opacity={heat * flick} style={{ mixBlendMode: "screen" }} />
        <rect x={VISION.x0} y={VISION.y0} width={VISION.x1 - VISION.x0} height={VISION.y1 - VISION.y0} fill="#050505" mask="url(#sfHoleMask)" />
        <g mask="url(#sfHoleMask)">
          <rect x={VISION.x0} y={VISION.y0} width={VISION.x1 - VISION.x0} height={VISION.y1 - VISION.y0} fill="url(#sfInner)" opacity={cool * 0.55} />
          <rect x={640} y={VISION.y0} width={60} height={VISION.y1 - VISION.y0} fill="#3BEA6A" opacity={blink} />
          <rect x={VISION.x0} y={VISION.y0} width={VISION.x1 - VISION.x0} height={VISION.y1 - VISION.y0} fill={REAL.fireOrange} opacity={flick} />
          <rect x={VISION.x0} y={VISION.y0} width={VISION.x1 - VISION.x0} height={VISION.y1 - VISION.y0} fill={stColor} opacity={st} />
        </g>
        <Padlock x={LOCK.x} y={LOCK.y} t={t} />
      </g>

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

      {/* kota-stone plinth + interlocking footpath */}
      <rect x={-1400} y={1468} width={3900} height={34} fill="#5e5850" />
      <rect x={-1400} y={1468} width={3900} height={34} fill="url(#sfPlaster)" opacity={0.5} />
      <rect x={-1400} y={1468} width={3900} height={3} fill="#a79c8f" opacity={0.6} />
      <rect x={-1400} y={1498} width={3900} height={4} fill="#000" opacity={0.6} />
      <rect x={-1400} y={1502} width={3900} height={1300} fill="url(#sfPath)" />
      <rect x={-1400} y={1502} width={3900} height={1300} fill="url(#sfPavers)" />
      <rect x={-1400} y={1502} width={3900} height={1300} fill="url(#sfPlaster)" opacity={0.6} />
      {/* puddle catching the light from under the shutter */}
      <ellipse cx={560} cy={1590} rx={300} ry={26} fill={REAL.fireOrange} opacity={flick * 0.22} filter="url(#sfBloom)" style={{ mixBlendMode: "screen" }} />
      <ellipse cx={560} cy={1600} rx={250} ry={30} fill="#BFE3FF" opacity={cool * 0.1} style={{ mixBlendMode: "screen" }} />

      {/* electricity pole with junction box, meters and the wire tangle */}
      <rect x={1000} y={-600} width={24} height={2110} fill="#46484a" />
      <rect x={1000} y={-600} width={6} height={2110} fill="#8a8c8e" opacity={0.5} />
      <rect x={1018} y={-600} width={6} height={2110} fill="#000" opacity={0.4} />
      <rect x={984} y={736} width={56} height={76} rx={4} fill="#5a5d60" />
      <rect x={984} y={736} width={56} height={4} fill="#b9bdc0" opacity={0.4} />
      <ellipse cx={1012} cy={1505} rx={40} ry={8} fill="#000" opacity={0.5} />
      <g stroke="#090909" fill="none" strokeWidth={3}>
        {Array.from({ length: 13 }).map((_, i) => (
          <path key={i} d={wire(-1400, 620 + rand(i) * 140, 1012, 690 + rand(i + 9) * 130, 60 + rand(i + 3) * 100)} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={`r${i}`} d={wire(1012, 710 + i * 14, 2500, 640 + rand(i + 20) * 170, 50 + rand(i + 30) * 80)} />
        ))}
        <path d={wire(1012, 790, 560, 935, 40)} strokeWidth={4} />
        <path d={wire(1012, 800, 880, 980, 20)} strokeWidth={3} />
      </g>
      <g stroke="#3a3a3a" fill="none" strokeWidth={1.2} opacity={0.6}>
        {Array.from({ length: 6 }).map((_, i) => (
          <path key={i} d={wire(-1400, 660 + rand(i + 40) * 120, 1012, 720 + rand(i + 50) * 100, 80)} />
        ))}
      </g>

      {/* sodium street light wash */}
      <rect x={-1400} y={-1400} width={3900} height={4200} fill="url(#sfSodium)" opacity={street} style={{ mixBlendMode: "screen" }} />

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
