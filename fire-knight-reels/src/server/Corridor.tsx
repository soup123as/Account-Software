import React from "react";
import { REAL, noise1, rand } from "../fk/theme";
import { Smoke } from "../shop/fx";

/**
 * The office corridor outside the server room, at night (world = frame coordinates, 280 px = 1 m).
 * A grey steel door with a glass vision panel (the racks' LEDs glow through it), a "SERVER ROOM"
 * plate and an access-card reader, a wall clock showing 02:00, a green EXIT sign, a sounder-beacon,
 * and on the left an unattended desk with a dark monitor and an empty chair. Nobody is here.
 */
export const DOOR = { x0: 420, x1: 700, y0: 910, y1: 1500 };
export const GLASS = { x0: 586, x1: 664, y0: 990, y1: 1300 };
export const CHAIR = { x: 318, y: 1500 };
export const BEACON = { x: 836, y: 800 };

export type CorridorProps = {
  t: number;
  glow?: number; // blue light from the racks through the glass
  alarm?: number; // red strobe inside the room + corridor beacon
  leak?: number; // smoke leaking from the top of the door
  haze?: number; // pale mist behind the glass (after suppression)
  desk?: number; // lift the unattended desk out of the dark (0..1)
};

export const Corridor: React.FC<CorridorProps> = ({ t, glow = 1, alarm = 0, leak = 0, haze = 0, desk = 0 }) => {
  const flash = Math.sin(t * 0.5) > 0 ? 1 : 0.12;
  const st = alarm * flash;
  const glassC = alarm > 0 && flash > 0.5 ? "#7a1410" : "#0d2238";
  return (
    <g>
      <defs>
        <linearGradient id="coWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4f54" />
          <stop offset="1" stopColor="#33373b" />
        </linearGradient>
        <linearGradient id="coFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2d31" />
          <stop offset="1" stopColor="#0c0d0e" />
        </linearGradient>
        <linearGradient id="coDoor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#59626b" />
          <stop offset="0.5" stopColor="#474f57" />
          <stop offset="1" stopColor="#363d44" />
        </linearGradient>
        <linearGradient id="coDesk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b5a47" />
          <stop offset="1" stopColor="#3a3027" />
        </linearGradient>
        <radialGradient id="coDark" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${600 - 330 * desk} ${1150 + 110 * desk}) scale(900 900)`}>
          <stop offset="0" stopColor="#020304" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#020304" stopOpacity="0.76" />
          <stop offset="1" stopColor="#020304" stopOpacity="0.95" />
        </radialGradient>
        <radialGradient id="coBlue" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(625 1180) scale(420 520)">
          <stop offset="0" stopColor="#8FC2FF" stopOpacity="0.5" />
          <stop offset="1" stopColor="#8FC2FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="coRed" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${BEACON.x} ${BEACON.y}) scale(1500 1300)`}>
          <stop offset="0" stopColor={REAL.lampRed} stopOpacity="0.36" />
          <stop offset="1" stopColor={REAL.lampRed} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="coRedDoor" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(625 1180) scale(460 560)">
          <stop offset="0" stopColor="#FF3B2F" stopOpacity="0.42" />
          <stop offset="1" stopColor="#FF3B2F" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="coDeskL" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(230 1250) scale(460 420)">
          <stop offset="0" stopColor="#CFE0FF" stopOpacity="0.34" />
          <stop offset="1" stopColor="#CFE0FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="coExit" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(150 760) scale(420 360)">
          <stop offset="0" stopColor="#3BEA6A" stopOpacity="0.32" />
          <stop offset="1" stopColor="#3BEA6A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="coPool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.0" />
          <stop offset="1" stopColor="#FFE9C4" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="coGlassRefl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9CC8FF" stopOpacity="0.4" />
          <stop offset="1" stopColor="#9CC8FF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ceiling, wall, skirting, floor */}
      <rect x={-400} y={420} width={1880} height={240} fill="#141618" />
      <rect x={-400} y={650} width={1880} height={12} fill="#202326" />
      <rect x={-400} y={660} width={1880} height={840} fill="url(#coWall)" />
      <rect x={-400} y={1470} width={1880} height={30} fill="#24272a" />
      <rect x={-400} y={1470} width={1880} height={2.5} fill="#fff" opacity={0.18} />
      <rect x={-400} y={1500} width={1880} height={420} fill="url(#coFloor)" />
      {[1540, 1610, 1720, 1870].map((y) => (
        <line key={y} x1={-400} y1={y} x2={1480} y2={y} stroke="#000" strokeWidth={2} opacity={0.5} />
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={i} x1={i * 108} y1={1500} x2={-540 + i * 216} y2={1920} stroke="#000" strokeWidth={2} opacity={0.45} />
      ))}
      {/* a glass partition of the dark office on the far right */}
      <rect x={930} y={760} width={560} height={710} fill="#101417" />
      <rect x={930} y={760} width={10} height={710} fill="#6a7077" />
      <rect x={930} y={760} width={560} height={8} fill="#6a7077" />
      <rect x={960} y={1210} width={110} height={70} rx={4} fill="#191d21" />
      <rect x={1004} y={1280} width={22} height={40} fill="#191d21" />
      <rect x={940} y={1320} width={200} height={10} fill="#20252a" />
      <polygon points="940,768 1060,768 980,1470 940,1470" fill="#fff" opacity={0.03} />

      {/* downlight above the door: the one light left on */}
      <polygon points="520,662 600,662 760,1500 360,1500" fill="url(#coPool)" />
      <rect x={520} y={654} width={80} height={10} rx={3} fill="#FFE9C4" opacity={0.7} />

      {/* door frame, leaf, glass */}
      <rect x={DOOR.x0 - 16} y={DOOR.y0 - 16} width={DOOR.x1 - DOOR.x0 + 32} height={DOOR.y1 - DOOR.y0 + 16} fill="#23272b" />
      <rect x={DOOR.x0} y={DOOR.y0} width={DOOR.x1 - DOOR.x0} height={DOOR.y1 - DOOR.y0} fill="url(#coDoor)" />
      <rect x={DOOR.x0} y={DOOR.y0} width={4} height={DOOR.y1 - DOOR.y0} fill="#fff" opacity={0.14} />
      <rect x={DOOR.x0} y={DOOR.y0} width={DOOR.x1 - DOOR.x0} height={3} fill="#fff" opacity={0.18} />
      <rect x={DOOR.x0} y={DOOR.y1 - 46} width={DOOR.x1 - DOOR.x0} height={46} fill="#8d949b" opacity={0.5} />
      <rect x={GLASS.x0 - 8} y={GLASS.y0 - 8} width={GLASS.x1 - GLASS.x0 + 16} height={GLASS.y1 - GLASS.y0 + 16} rx={4} fill="#1c2024" />
      <rect x={GLASS.x0} y={GLASS.y0} width={GLASS.x1 - GLASS.x0} height={GLASS.y1 - GLASS.y0} fill={glassC} opacity={0.4 + 0.6 * Math.max(glow, st)} />
      {/* the racks' LEDs seen through the glass */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = GLASS.x0 + 8 + rand(i * 3) * (GLASS.x1 - GLASS.x0 - 16);
        const y = GLASS.y0 + 60 + rand(i * 5 + 1) * (GLASS.y1 - GLASS.y0 - 80);
        const on = Math.sin(t * (0.2 + rand(i) * 0.5) + i) > -0.1 ? 1 : 0.15;
        return <circle key={i} cx={x} cy={y} r={1.8} fill={rand(i + 9) > 0.3 ? "#35E06A" : "#4FA8FF"} opacity={glow * on * 0.9} />;
      })}
      {haze > 0 && <rect x={GLASS.x0} y={GLASS.y0} width={GLASS.x1 - GLASS.x0} height={GLASS.y1 - GLASS.y0} fill="#DCE9F2" opacity={haze * (0.35 + 0.1 * noise1(t * 0.05, 3))} />}
      <polygon points={`${GLASS.x0},${GLASS.y0} ${GLASS.x0 + 30},${GLASS.y0} ${GLASS.x0 + 6},${GLASS.y1} ${GLASS.x0},${GLASS.y1}`} fill="#fff" opacity={0.08} />
      {/* lever handle, kick plate edge */}
      <rect x={DOOR.x0 + 30} y={1196} width={20} height={64} rx={5} fill="#b9bfc5" />
      <rect x={DOOR.x0 + 34} y={1214} width={76} height={12} rx={6} fill="#cfd4d9" />
      <rect x={DOOR.x0 + 34} y={1214} width={76} height={3} rx={1.5} fill="#fff" opacity={0.7} />

      {/* plate, card reader, clock, exit sign, beacon */}
      <rect x={738} y={1060} width={170} height={52} rx={5} fill="#14263f" />
      <rect x={738} y={1060} width={170} height={3} fill="#fff" opacity={0.3} />
      <text x={823} y={1094} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={600} fontSize={20} letterSpacing={2.4} fill="#e9edf2">
        SERVER ROOM
      </text>
      <rect x={748} y={1170} width={62} height={104} rx={8} fill="#17191c" />
      <rect x={748} y={1170} width={62} height={3} fill="#fff" opacity={0.2} />
      <rect x={760} y={1206} width={38} height={46} rx={4} fill="#22262a" />
      <circle cx={779} cy={1188} r={4.2} fill="#FF2A1E" />
      <circle cx={779} cy={1188} r={13} fill="#FF2A1E" opacity={0.3} />
      <rect x={484} y={806} width={152} height={62} rx={8} fill="#0b0b0c" />
      <rect x={484} y={806} width={152} height={3} fill="#fff" opacity={0.2} />
      <text x={560} y={852} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={700} fontSize={42} letterSpacing={2} fill="#FF3B2F">
        02:00
      </text>
      <rect x={70} y={724} width={160} height={66} rx={6} fill="#0d2b17" />
      <rect x={76} y={730} width={148} height={54} rx={4} fill="#1F9D55" />
      <text x={150} y={770} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={700} fontSize={34} letterSpacing={4} fill="#eafff1">
        EXIT
      </text>
      <rect x={BEACON.x - 40} y={BEACON.y - 30} width={80} height={60} rx={8} fill="#B5201A" />
      <rect x={BEACON.x - 28} y={BEACON.y - 20} width={56} height={22} rx={5} fill="#FFD9D4" opacity={alarm > 0 ? 0.5 + 0.5 * flash : 0.5} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={BEACON.x - 24 + i * 14} y={BEACON.y + 8} width={7} height={13} rx={3} fill="#5d0e0b" />
      ))}

      {/* the unattended desk: dark monitor, keyboard, phone, register; the chair is empty */}
      <rect x={-60} y={1290} width={330} height={16} rx={3} fill="url(#coDesk)" />
      <rect x={-60} y={1290} width={330} height={3} fill="#fff" opacity={0.25} />
      <rect x={-40} y={1306} width={290} height={194} fill="#2c2620" />
      <rect x={-40} y={1306} width={290} height={194} fill="#000" opacity={0.25} />
      <rect x={30} y={1150} width={170} height={108} rx={6} fill="#0c0d0e" />
      <rect x={38} y={1158} width={154} height={92} rx={2} fill="#14181c" />
      <polygon points="38,1158 96,1158 60,1250 38,1250" fill="#fff" opacity={0.04} />
      <rect x={104} y={1258} width={22} height={24} fill="#1a1c1f" />
      <rect x={76} y={1280} width={78} height={10} rx={3} fill="#1a1c1f" />
      <rect x={212} y={1268} width={50} height={22} rx={4} fill="#17191c" />
      <rect x={214} y={1262} width={46} height={10} rx={5} fill="#22252a" />
      <g>
        {/* office chair, side view, facing the desk */}
        <path d={`M${CHAIR.x + 54} ${CHAIR.y - 330} q18 4 16 30 l-10 150 q-2 14 -16 14 h-8 l14 -180 q0 -12 4 -14 z`} fill="#1c1f23" />
        <path d={`M${CHAIR.x + 56} ${CHAIR.y - 322} q8 4 8 22 l-9 140`} stroke="#fff" strokeWidth={2} fill="none" opacity={0.14} />
        <rect x={CHAIR.x - 50} y={CHAIR.y - 150} width={112} height={24} rx={10} fill="#22262b" />
        <rect x={CHAIR.x - 50} y={CHAIR.y - 150} width={112} height={4} rx={2} fill="#fff" opacity={0.14} />
        <rect x={CHAIR.x + 24} y={CHAIR.y - 206} width={10} height={58} rx={4} fill="#2a2e33" />
        <rect x={CHAIR.x - 10} y={CHAIR.y - 212} width={50} height={10} rx={5} fill="#2a2e33" />
        <rect x={CHAIR.x} y={CHAIR.y - 126} width={10} height={86} fill="#8f959b" />
        <rect x={CHAIR.x} y={CHAIR.y - 126} width={3} height={86} fill="#fff" opacity={0.4} />
        <path d={`M${CHAIR.x - 58} ${CHAIR.y - 16} L${CHAIR.x + 5} ${CHAIR.y - 44} L${CHAIR.x + 68} ${CHAIR.y - 16}`} stroke="#2a2e33" strokeWidth={10} fill="none" strokeLinecap="round" />
        {[CHAIR.x - 58, CHAIR.x + 5, CHAIR.x + 68].map((x) => (
          <circle key={x} cx={x} cy={CHAIR.y - 9} r={9} fill="#101113" />
        ))}
      </g>

      {/* the night */}
      <rect x={-400} y={420} width={1880} height={1500} fill="url(#coDark)" />
      <g style={{ mixBlendMode: "screen" }}>
        <rect x={-400} y={420} width={1880} height={1500} fill="url(#coBlue)" opacity={glow * (1 - st * 0.7)} />
        <rect x={-400} y={420} width={1880} height={1500} fill="url(#coRedDoor)" opacity={st} />
        <rect x={-400} y={420} width={1880} height={1500} fill="url(#coRed)" opacity={st} />
        <rect x={-400} y={420} width={1880} height={1500} fill="url(#coExit)" />
        <rect x={-400} y={420} width={1880} height={1500} fill="url(#coDeskL)" opacity={desk} />
        <polygon points={`${GLASS.x0},1500 ${GLASS.x1},1500 ${GLASS.x1 + 60},1800 ${GLASS.x0 - 60},1800`} fill="url(#coGlassRefl)" opacity={glow * 0.8} />
      </g>
      {/* lit signs stay bright */}
      <text x={560} y={852} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={700} fontSize={42} letterSpacing={2} fill="#FF3B2F" opacity={0.95}>
        02:00
      </text>
      <rect x={76} y={730} width={148} height={54} rx={4} fill="#1F9D55" opacity={0.75} />
      <text x={150} y={770} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={700} fontSize={34} letterSpacing={4} fill="#eafff1">
        EXIT
      </text>
      <circle cx={779} cy={1188} r={4.2} fill="#FF2A1E" />
      <text x={823} y={1094} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={600} fontSize={20} letterSpacing={2.4} fill="#e9edf2" opacity={0.75}>
        SERVER ROOM
      </text>
      {alarm > 0 && <rect x={BEACON.x - 28} y={BEACON.y - 20} width={56} height={22} rx={5} fill="#FFD9D4" opacity={flash} />}

      <Smoke id="coSmoke" t={t} amount={leak} emit={[{ x: 560, y: DOOR.y0 + 6, w: 260 }]} rise={300} size={60} tone="#6a6b6e" />
    </g>
  );
};
