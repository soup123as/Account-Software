import React from "react";
import { REAL, noise1 } from "../fk/theme";
import { Flame, Mist } from "../shop/fx";

/**
 * Indian intercity AC coach, left (door) side, front facing left. 100 px = 1 m:
 * 12 m long (x 0-1200), 3.6 m tall to the AC pod (y 22-382), ground at y 382, wheels r 0.5 m.
 * Rear engine bay (x 1000-1192), battery box just behind the front wheel (x 322-412),
 * luggage bays between the axles, front door ahead of the front wheel. The driver sits at the
 * front, with the red extinguisher mounted behind his seat (EXT).
 * `xray` fades the body to show the interior: seats, driver seat, extinguisher, batteries, engine.
 */
export const BUS_W = 1200;
export const GROUND = 382;
export const ZONE = {
  engine: { x: 1004, y: 212, w: 188, h: 112 },
  battery: { x: 320, y: 228, w: 96, h: 92 },
  cabin: { x: 150, y: 60, w: 846, h: 146 },
};
export const EXT = { x: 112, y: 176 };
export const MOD = { engine: { x: 1096, y: 220 }, battery: { x: 368, y: 236 }, cabin1: { x: 430, y: 66 }, cabin2: { x: 760, y: 66 } };
export const CYL = { x: 560, y: 300 };

export type BusProps = {
  t: number;
  wheelAngle?: number;
  headlights?: number;
  cabinLight?: number;
  xray?: number;
  heatEngine?: number; // glow behind the engine louvres
  fire?: number; // flame in the engine bay
  sentinel?: number; // modules + cylinder + hoses visible
  sense?: number; // sensor cones
  mist?: number; // engine-zone discharge only
  hazard?: number;
  door?: number; // 0 closed .. 1 open
  extGlow?: number; // highlight the red extinguisher
};

const Wheel: React.FC<{ cx: number; a: number }> = ({ cx, a }) => (
  <g transform={`translate(${cx} 330)`}>
    <circle r={62} fill="#050505" />
    <circle r={50} fill="#151515" />
    <circle r={46} fill="#1d1d1d" />
    <circle r={30} fill="url(#bsRim)" />
    <g transform={`rotate(${a})`}>
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={i} cx={20 * Math.cos((i * Math.PI) / 4)} cy={20 * Math.sin((i * Math.PI) / 4)} r={3} fill="#3d4247" />
      ))}
    </g>
    <circle r={11} fill="#8d949a" />
    <circle r={5} fill="#2a2d30" />
    <path d="M-44 -18 A 48 48 0 0 1 -18 -44" stroke="#ffffff" strokeWidth={2} fill="none" opacity={0.12} />
  </g>
);

const Seat: React.FC<{ x: number; c?: string }> = ({ x, c = "#2c3b58" }) => (
  <g transform={`translate(${x} 0)`}>
    <path d="M0 200 L 34 200 L 36 176 L 6 176 Z" fill={c} />
    <path d="M28 178 L 40 108 Q 42 100 50 100 L 54 100 Q 58 102 56 110 L 44 180 Z" fill={c} />
    <rect x={44} y={92} width={16} height={14} rx={4} fill="#d9d9d4" opacity={0.85} />
    <path d="M30 176 L 42 110" stroke="#fff" strokeWidth={1.5} opacity={0.12} />
    <rect x={8} y={200} width={4} height={6} fill="#555" />
  </g>
);

export const Bus: React.FC<BusProps> = ({
  t,
  wheelAngle = 0,
  headlights = 1,
  cabinLight = 0.7,
  xray = 0,
  heatEngine = 0,
  fire = 0,
  sentinel = 0,
  sense = 0,
  mist = 0,
  hazard = 0,
  door = 0,
  extGlow = 0,
}) => {
  const body = 1 - xray * 0.82;
  const hz = hazard * (Math.sin(t * 0.42) > 0 ? 1 : 0.08);
  const flick = Math.max(heatEngine, fire) * (0.78 + 0.22 * noise1(t * 0.6, 3));
  const seats = Array.from({ length: 11 }).map((_, i) => 178 + i * 74);
  const bodyPath =
    "M14 330 C 6 318, 2 296, 4 252 L 8 190 L 38 64 C 42 50, 56 42, 76 40 L 1166 40 C 1186 40, 1196 54, 1197 76 L 1198 322 C 1198 328, 1194 332, 1188 332 L 14 332 Z";
  return (
    <g>
      <defs>
        <linearGradient id="bsBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6f7f8" />
          <stop offset="0.45" stopColor="#e1e5e8" />
          <stop offset="0.62" stopColor="#c7cdd2" />
          <stop offset="1" stopColor="#8a9197" />
        </linearGradient>
        <linearGradient id="bsGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c262d" />
          <stop offset="1" stopColor="#070a0c" />
        </linearGradient>
        <linearGradient id="bsCabin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffdca6" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ff9f4a" stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id="bsRim">
          <stop offset="0" stopColor="#d9dee2" />
          <stop offset="0.7" stopColor="#8d949a" />
          <stop offset="1" stopColor="#4b5056" />
        </radialGradient>
        <linearGradient id="bsBeam" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#fff6dd" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff6dd" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="bsHeat">
          <stop offset="0" stopColor={REAL.fireYellow} stopOpacity="0.95" />
          <stop offset="0.4" stopColor={REAL.fireOrange} stopOpacity="0.55" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bsCyl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2f4f6" />
          <stop offset="0.5" stopColor="#a9b0b6" />
          <stop offset="1" stopColor="#5d6368" />
        </linearGradient>
        <linearGradient id="bsExt" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={REAL.extRedLo} />
          <stop offset="0.35" stopColor={REAL.extRedHi} />
          <stop offset="1" stopColor={REAL.extRedLo} />
        </linearGradient>
        <clipPath id="bsClip">
          <path d={bodyPath} />
        </clipPath>
      </defs>

      {/* ground shadow + headlight beam */}
      <ellipse cx={600} cy={GROUND + 4} rx={640} ry={16} fill="#000" opacity={0.7} />
      <polygon points={`6,282 -620,250 -620,382 6,300`} fill="url(#bsBeam)" opacity={headlights * 0.8} />

      {/* ---------- interior (seen through the glass, or fully in x-ray) ---------- */}
      <g clipPath="url(#bsClip)">
        <rect x={0} y={40} width={1200} height={300} fill="#0b0d0f" />
        <rect x={60} y={44} width={1130} height={162} fill="url(#bsCabin)" opacity={cabinLight * (0.35 + 0.4 * xray)} />
        <rect x={40} y={204} width={1150} height={6} fill="#2b2b2b" />
        {/* luggage bays + battery box + engine bay (inside) */}
        <rect x={420} y={212} width={560} height={110} fill="#141414" />
        <g opacity={xray}>
          {/* batteries */}
          {[0, 1].map((i) => (
            <g key={i} transform={`translate(${328 + i * 42} 248)`}>
              <rect width={38} height={64} rx={3} fill="#151617" />
              <rect y={10} width={38} height={14} fill="#2f6b3a" opacity={0.8} />
              <rect x={5} y={-6} width={8} height={7} rx={1.5} fill="#c9302c" />
              <rect x={25} y={-6} width={8} height={7} rx={1.5} fill="#222" />
            </g>
          ))}
          {/* engine block, turbo, exhaust */}
          <rect x={1024} y={230} width={140} height={84} rx={8} fill="#3a3f44" />
          <rect x={1024} y={230} width={140} height={6} rx={3} fill="#8d949a" opacity={0.6} />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={1034 + i * 21} y={242} width={12} height={40} rx={3} fill="#262a2e" />
          ))}
          <circle cx={1150} cy={300} r={14} fill="#5d6368" />
          <path d="M1060 230 C 1060 214, 1090 214, 1100 224" stroke="#6b7177" strokeWidth={8} fill="none" />
        </g>
        {/* driver seat, steering, red extinguisher behind the seat */}
        <g>
          <path d="M44 198 L 84 198 L 86 172 L 50 172 Z" fill="#1d1f22" />
          <path d="M78 176 L 92 104 Q 94 96 102 96 L 106 96 Q 110 98 108 106 L 94 178 Z" fill="#1d1f22" />
          <ellipse cx={40} cy={140} rx={6} ry={22} fill="none" stroke="#1a1a1a" strokeWidth={5} transform="rotate(-24 40 140)" />
          <g transform={`translate(${EXT.x} ${EXT.y})`}>
            <rect x={-9} y={-34} width={18} height={44} rx={6} fill="url(#bsExt)" />
            <rect x={-4} y={-42} width={8} height={9} rx={2} fill="#1a1a1a" />
            <circle cx={0} cy={-38} r={4} fill="#e8e8e8" />
            <path d="M6 -40 C 18 -40, 16 -20, 10 -10" stroke="#111" strokeWidth={2.4} fill="none" />
            <rect x={-10} y={-8} width={20} height={4} fill="#c9cfd4" />
            {extGlow > 0 && <circle r={40} fill={REAL.extRed} opacity={0.25 * extGlow} />}
          </g>
        </g>
        {seats.map((x) => (
          <Seat key={x} x={x} />
        ))}
      </g>

      {/* ---------- body ---------- */}
      <g opacity={body}>
        <path d={bodyPath} fill="url(#bsBody)" />
        {/* AC pod */}
        <rect x={380} y={24} width={390} height={20} rx={9} fill="#d9dde0" />
        <rect x={380} y={24} width={390} height={4} rx={2} fill="#ffffff" opacity={0.8} />
        {/* windows, door glass, windscreen: cut to show the lit cabin */}
        <g>
          <rect x={150} y={66} width={858} height={120} rx={8} fill="url(#bsGlass)" opacity={0.9} />
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={150 + (i + 1) * 107 - 5} y={64} width={10} height={124} fill="#20262b" />
          ))}
        </g>
        <polygon points="10,188 40,62 84,54 76,188" fill="url(#bsGlass)" opacity={0.92} />
        {/* glass reflections */}
        <polygon points="22,170 46,70 58,68 34,170" fill="#ffffff" opacity={0.1} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <polygon key={`r${i}`} points={`${166 + i * 107},184 ${206 + i * 107},70 ${226 + i * 107},70 ${186 + i * 107},184`} fill="#ffffff" opacity={0.05} />
        ))}
        <rect x={150} y={66} width={858} height={4} rx={2} fill="#ffffff" opacity={0.18} />
        {/* side body highlight */}
        <rect x={60} y={216} width={1130} height={3} fill="#ffffff" opacity={0.45} />
        <rect x={88} y={64} width={56} height={124} rx={4} fill="url(#bsGlass)" opacity={0.9} />
        {/* livery */}
        <rect x={52} y={194} width={1146} height={14} fill="#0f5d6b" />
        <rect x={52} y={209} width={1146} height={3} fill="#c0262d" />
        {/* front door (folds open) */}
        <g transform={`translate(${148 - 56 * (1 - door * 0.85)} 0)`}>
          <rect x={0} y={66} width={56 * (1 - door * 0.85)} height={260} fill="#1a2228" opacity={0.95} />
          <rect x={0} y={66} width={56 * (1 - door * 0.85)} height={260} fill="none" stroke="#9aa1a7" strokeWidth={3} />
          <rect x={0} y={190} width={56 * (1 - door * 0.85)} height={3} fill="#9aa1a7" />
        </g>
        <rect x={88} y={212} width={60} height={114} fill="#20262b" opacity={1 - door} />
        {/* bay doors, battery box vent, engine louvres */}
        {[430, 570, 710, 850].map((x) => (
          <g key={x}>
            <rect x={x} y={222} width={130} height={96} rx={4} fill="none" stroke="#7d848a" strokeWidth={2} />
            <rect x={x + 54} y={262} width={22} height={5} rx={2} fill="#5d6368" />
          </g>
        ))}
        <rect x={322} y={232} width={90} height={86} rx={4} fill="none" stroke="#7d848a" strokeWidth={2} />
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} x={334} y={244 + i * 9} width={66} height={4} rx={2} fill="#4b5157" />
        ))}
        <rect x={1006} y={216} width={184} height={104} rx={6} fill="#5c6268" />
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={1016} y={224 + i * 9.4} width={164} height={5} rx={2} fill="#22262a" />
        ))}
        {/* wheel arches */}
        <path d="M188 332 A 67 67 0 0 1 322 332 Z" fill="#070707" />
        <path d="M813 332 A 67 67 0 0 1 947 332 Z" fill="#070707" />
        {/* lights: head, tail, markers, mirror */}
        <rect x={8} y={276} width={30} height={14} rx={4} fill="#fff6dd" opacity={0.35 + 0.65 * headlights} />
        <rect x={6} y={300} width={60} height={30} rx={4} fill="#2a2d30" />
        <rect x={1188} y={244} width={10} height={56} rx={3} fill={REAL.tailRed} />
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx={90 + i * 94} cy={46} r={2.6} fill={REAL.beacon} opacity={0.85} />
        ))}
        <path d="M30 66 L -14 74 L -14 112" stroke="#1a1a1a" strokeWidth={4} fill="none" />
        <rect x={-24} y={96} width={16} height={36} rx={4} fill="#161616" />
        {/* destination board */}
        <rect x={44} y={46} width={40} height={10} rx={2} fill="#140d02" />
        <rect x={48} y={49} width={30} height={4} rx={1} fill="#ffb33a" opacity={0.85} />
        {/* roof highlight */}
        <path d="M76 42 L 1166 42" stroke="#ffffff" strokeWidth={2} opacity={0.7} />
      </g>

      {/* the cabin glow reads through the glass even with the body on */}
      <rect x={150} y={66} width={858} height={120} rx={8} fill="url(#bsCabin)" opacity={cabinLight * 0.35 * body} style={{ mixBlendMode: "screen" }} />

      {/* x-ray outline */}
      {xray > 0 && <path d={bodyPath} fill="none" stroke="#9fb4c4" strokeWidth={2} opacity={xray * 0.8} />}

      {/* engine heat behind the louvres / in the bay */}
      {flick > 0 && (
        <g style={{ mixBlendMode: "screen" }}>
          <ellipse cx={1098} cy={272} rx={150 + 40 * flick} ry={90 + 20 * flick} fill="url(#bsHeat)" opacity={flick} />
        </g>
      )}
      <Flame id="bsFlame" x={1080} y={318} h={fire * 70} t={t} w={0.45} />

      {/* Sentinel: modules per zone, cylinder in the bay, braided hoses */}
      {sentinel > 0 && (
        <g opacity={sentinel}>
          <g stroke="#b9c0c6" strokeWidth={2.4} fill="none" opacity={0.85}>
            <path d={`M${CYL.x - 40} ${CYL.y} C 470 300, 400 260, ${MOD.battery.x} ${MOD.battery.y + 6}`} />
            <path d={`M${CYL.x + 40} ${CYL.y} C 800 300, 1000 240, ${MOD.engine.x} ${MOD.engine.y + 6}`} />
            <path d={`M${CYL.x} ${CYL.y - 10} C 560 200, 460 120, ${MOD.cabin1.x} ${MOD.cabin1.y + 6}`} />
            <path d={`M${CYL.x} ${CYL.y - 10} C 600 200, 720 120, ${MOD.cabin2.x} ${MOD.cabin2.y + 6}`} />
          </g>
          <rect x={CYL.x - 70} y={CYL.y - 12} width={140} height={24} rx={12} fill="url(#bsCyl)" />
          <rect x={CYL.x - 70} y={CYL.y - 12} width={140} height={5} rx={2.5} fill="#fff" opacity={0.6} />
          {Object.values(MOD).map((m, i) => (
            <g key={i} transform={`translate(${m.x} ${m.y})`}>
              <rect x={-11} y={-6} width={22} height={14} rx={6} fill="#cfd5da" />
              <circle cx={0} cy={1} r={3.6} fill="#0b0b0b" />
              <circle cx={6} cy={5} r={1.4} fill="#e8e8e8" />
            </g>
          ))}
          {sense > 0 &&
            Object.values(MOD).map((m, i) => (
              <polygon
                key={`c${i}`}
                points={`${m.x - 6},${m.y + 8} ${m.x + 6},${m.y + 8} ${m.x + 70},${m.y + 110} ${m.x - 70},${m.y + 110}`}
                fill="#e9f3fa"
                opacity={sense * (0.1 + 0.06 * Math.sin(t * 0.25 + i))}
              />
            ))}
        </g>
      )}
      <Mist id="bsMist" x={MOD.engine.x} y={MOD.engine.y + 8} floor={322} spread={80} t={t} amount={mist} />

      <Wheel cx={255} a={wheelAngle} />
      <Wheel cx={880} a={wheelAngle} />

      {/* hazard lights */}
      {hazard > 0 && (
        <g style={{ mixBlendMode: "screen" }}>
          <circle cx={14} cy={268} r={8} fill={REAL.beacon} opacity={hz} />
          <circle cx={14} cy={268} r={46} fill={REAL.beacon} opacity={hz * 0.35} />
          <circle cx={1194} cy={236} r={8} fill={REAL.beacon} opacity={hz} />
          <circle cx={1194} cy={236} r={46} fill={REAL.beacon} opacity={hz * 0.35} />
        </g>
      )}
    </g>
  );
};
