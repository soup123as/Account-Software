import React from "react";
import { REAL, noise1, rand } from "../fk/theme";
import { Flame, Mist, Smoke } from "./fx";

/**
 * Inside the closed shop at night (world = frame coordinates at zoom 1).
 * Back wall y 700-1460, floor below. Shelves of stock (x 110-520), a glass-door cooler
 * (x 560-780), inverter + battery (x 805-990), and a 4-socket extension board on the floor
 * (x 380-620, y ~1580) feeding all of them. The Protector sits on the ceiling at (540, 612).
 */
export const BOARD = { x: 500, y: 1584, hot: 548 }; // hot = x of the overheating socket
export const FRIDGE = { x: 670, y: 1180 };
export const INVERTER = { x: 852, y: 1385 };
export const PROTECTOR = { x: 540, y: 612, nozzles: [452, 628] };

export type InteriorProps = {
  t: number;
  fridge?: number; // cooler light
  led?: number; // inverter LED
  boardHeat?: number; // 0..1 glow at the hot socket
  flame?: number; // 0..1 flame height at the board
  protector?: number; // 0 = not installed, 1 = installed
  awake?: number; // Protector status LED
  sense?: number; // sensing rings (flame / heat / gas)
  strobe?: number; // siren light
  mist?: number; // suppression
  flash?: number; // camera flash
  burnt?: number; // aftermath: soot, charred stock, haze
  smoke?: number;
  highlight?: "fridge" | "inverter" | "board" | null;
  hl?: number;
};

const STOCK = ["#9b7448", "#b48a58", "#876238", "#b8322a", "#2f5aa8", "#d8a425", "#2f8a4a", "#e8e2d5", "#a2672f", "#c9b48a"];

const Shelves: React.FC<{ burnt: number }> = ({ burnt }) => {
  const rows = [860, 1040, 1220, 1400];
  const items: React.ReactNode[] = [];
  rows.forEach((y, r) => {
    let x = 122;
    let k = 0;
    while (x < 505) {
      const s = r * 50 + k++;
      const w = 34 + rand(s) * 52;
      const h = 60 + rand(s + 1) * 95;
      if (x + w > 508) break;
      const c = STOCK[Math.floor(rand(s + 2) * STOCK.length)];
      items.push(
        <g key={`${r}-${k}`}>
          <rect x={x} y={y - h} width={w} height={h} fill={c} />
          <rect x={x} y={y - h} width={w} height={6} fill="#fff" opacity={0.12} />
          <rect x={x + w - 6} y={y - h} width={6} height={h} fill="#000" opacity={0.25} />
          {rand(s + 4) > 0.5 && <rect x={x + 6} y={y - h * 0.6} width={w - 12} height={h * 0.22} fill="#fff" opacity={0.3} />}
        </g>,
      );
      x += w + 3;
    }
  });
  return (
    <g>
      <rect x={104} y={690} width={12} height={790} fill="#4b3420" />
      <rect x={510} y={690} width={12} height={790} fill="#4b3420" />
      {items}
      {rows.map((y) => (
        <rect key={y} x={104} y={y} width={418} height={12} fill="#6b4a2e" />
      ))}
      <rect x={100} y={690} width={426} height={790} fill="#0b0805" opacity={burnt * 0.8} />
    </g>
  );
};

const Cooler: React.FC<{ on: number; t: number; burnt: number }> = ({ on, t, burnt }) => {
  const bottles: React.ReactNode[] = [];
  const shelves = [1050, 1160, 1270, 1380];
  const cols = ["#2f7a3a", "#6b3a16", "#d8701e", "#c9d4dc", "#1f4f8a", "#b0201c"];
  shelves.forEach((y, r) => {
    for (let i = 0; i < 8; i++) {
      const c = cols[Math.floor(rand(r * 9 + i) * cols.length)];
      const x = 590 + i * 21.5;
      bottles.push(
        <g key={`${r}-${i}`}>
          <rect x={x} y={y - 70} width={15} height={70} rx={4} fill={c} />
          <rect x={x + 4} y={y - 88} width={7} height={20} rx={2} fill={c} />
          <rect x={x + 3} y={y - 62} width={3} height={50} fill="#fff" opacity={0.35} />
        </g>,
      );
    }
  });
  const hum = on * (0.97 + 0.03 * noise1(t * 0.4, 5));
  return (
    <g>
      <rect x={556} y={896} width={228} height={570} rx={10} fill="#c9ced2" />
      <rect x={556} y={896} width={228} height={570} rx={10} fill="#000" opacity={0.45} />
      <rect x={566} y={902} width={208} height={48} rx={4} fill="#1d2c44" />
      <rect x={566} y={902} width={208} height={48} rx={4} fill="#BFE3FF" opacity={0.25 * hum} />
      {/* glass door + lit interior */}
      <rect x={572} y={962} width={196} height={440} rx={4} fill="#DCEFFF" opacity={0.12 + 0.75 * hum} />
      {bottles}
      {shelves.map((y) => (
        <rect key={y} x={574} y={y} width={192} height={4} fill="#e9f3fa" opacity={0.7} />
      ))}
      <rect x={572} y={962} width={196} height={440} rx={4} fill="#08121c" opacity={0.25 + (1 - hum) * 0.55} />
      <rect x={572} y={962} width={196} height={440} rx={4} fill="none" stroke="#e8edf0" strokeWidth={6} opacity={0.7} />
      <rect x={580} y={970} width={30} height={420} fill="#fff" opacity={0.1} />
      <rect x={750} y={1120} width={8} height={110} rx={3} fill="#e8edf0" opacity={0.8} />
      <rect x={556} y={896} width={228} height={570} rx={10} fill="#0a0806" opacity={burnt * 0.75} />
    </g>
  );
};

const Inverter: React.FC<{ led: number; t: number; burnt: number }> = ({ led, t, burnt }) => {
  const blink = Math.pow(Math.max(0, Math.sin(t * 0.12)), 18);
  return (
    <g>
      {/* inverter */}
      <rect x={806} y={1290} width={92} height={172} rx={6} fill="#cfcabc" />
      <rect x={806} y={1290} width={92} height={172} rx={6} fill="#000" opacity={0.42} />
      <rect x={820} y={1310} width={62} height={30} rx={3} fill="#0e1a12" />
      <rect x={824} y={1314} width={54} height={22} rx={2} fill="#3BEA6A" opacity={0.18 * led} />
      <circle cx={834} cy={1360} r={5} fill="#3BEA6A" opacity={0.25 + 0.75 * led * (0.35 + 0.65 * blink)} />
      <circle cx={834} cy={1360} r={16} fill="#3BEA6A" opacity={0.25 * led * blink} />
      <circle cx={854} cy={1360} r={5} fill="#5a1a14" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={820} y={1390 + i * 10} width={62} height={3} fill="#000" opacity={0.3} />
      ))}
      {/* tall tubular battery */}
      <rect x={906} y={1268} width={86} height={194} rx={8} fill="#1d1f22" />
      <rect x={912} y={1300} width={74} height={34} fill="#d34b1e" opacity={0.55} />
      <rect x={922} y={1252} width={16} height={18} rx={3} fill="#c9302c" />
      <rect x={960} y={1252} width={16} height={18} rx={3} fill="#222" />
      <path d="M930 1252 C 930 1220, 880 1240, 870 1290" stroke="#c9302c" strokeWidth={5} fill="none" />
      <path d="M968 1252 C 968 1210, 890 1230, 884 1290" stroke="#111" strokeWidth={5} fill="none" />
      <rect x={800} y={1250} width={200} height={215} fill="#0a0806" opacity={burnt * 0.7} />
    </g>
  );
};

const Board: React.FC<{ heat: number; t: number; burnt: number }> = ({ heat, t, burnt }) => {
  const g = heat * (0.8 + 0.2 * noise1(t * 0.5, 8));
  const plugs = [418, 468, 548, 598];
  return (
    <g>
      <defs>
        <filter id="bdGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <radialGradient id="bdHot">
          <stop offset="0" stopColor={REAL.fireYellow} stopOpacity="0.95" />
          <stop offset="0.3" stopColor={REAL.fireOrange} stopOpacity="0.6" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* cables to the loads */}
      <g fill="none" strokeLinecap="round">
        <path d={`M418 1572 C 380 1520, 300 1500, 140 1470`} stroke="#151515" strokeWidth={7} />
        <path d={`M468 1572 C 480 1520, 600 1510, 640 1462`} stroke="#e4e1da" strokeWidth={7} opacity={0.75} />
        <path d={`M548 1572 C 600 1540, 760 1520, 820 1462`} stroke="#151515" strokeWidth={7} />
        <path d={`M598 1572 C 660 1600, 760 1640, 1100 1660`} stroke="#e4e1da" strokeWidth={7} opacity={0.75} />
        <path d={`M372 1590 C 300 1600, 150 1560, 60 1520`} stroke="#e4e1da" strokeWidth={8} opacity={0.75} />
      </g>
      {/* the board */}
      <rect x={372} y={1570} width={256} height={42} rx={10} fill="#e9e6df" />
      <rect x={372} y={1570} width={256} height={42} rx={10} fill="#000" opacity={0.42} />
      <rect x={376} y={1572} width={248} height={6} rx={3} fill="#fff" opacity={0.25} />
      <circle cx={390} cy={1591} r={6} fill="#b0201c" />
      {plugs.map((x, i) => (
        <g key={i}>
          <rect x={x - 5} y={1536} width={10} height={24} rx={3} fill={i % 2 ? "#e4e1da" : "#1a1a1a"} opacity={i % 2 ? 0.78 : 1} />
          <rect x={x - 18} y={1556} width={36} height={30} rx={6} fill={i % 2 ? "#e4e1da" : "#1a1a1a"} opacity={i % 2 ? 0.78 : 1} />
          <rect x={x - 14} y={1558} width={28} height={4} rx={2} fill="#fff" opacity={0.2} />
        </g>
      ))}
      {/* overheating socket: scorch + glow */}
      <ellipse cx={BOARD.hot} cy={1586} rx={34} ry={18} fill="#1a0c04" opacity={Math.min(1, heat * 1.2) * 0.8} />
      <g style={{ mixBlendMode: "screen" }}>
        <ellipse cx={BOARD.hot} cy={1580} rx={60 + 90 * g} ry={30 + 46 * g} fill="url(#bdHot)" opacity={g} />
        <ellipse cx={BOARD.hot} cy={1574} rx={10 + 8 * g} ry={6 + 4 * g} fill={REAL.fireCore} opacity={0.8 * g} filter="url(#bdGlow)" />
      </g>
      <Smoke id="bdWisp" t={t} amount={Math.max(0, heat - 0.5) * 1.4} emit={[{ x: BOARD.hot, y: 1560, w: 30 }]} rise={260} size={22} tone="#8a8a8c" />
      <rect x={360} y={1540} width={280} height={90} fill="#0a0806" opacity={burnt * 0.8} />
    </g>
  );
};

/** The Protector, seen from below on the ceiling: a matte black oval plate, two nozzles, a sensor dome. */
export const ProtectorUnit: React.FC<{ awake: number; alarm: number; t: number }> = ({ awake, alarm, t }) => {
  const { x, y } = PROTECTOR;
  const ledC = alarm > 0 ? (Math.sin(t * 0.55) > 0 ? REAL.lampRed : REAL.beacon) : "#3BEA6A";
  const ledO = alarm > 0 ? 1 : awake * (0.55 + 0.45 * Math.sin(t * 0.1));
  return (
    <g>
      <ellipse cx={x} cy={y - 4} rx={240} ry={44} fill="#cfd6dc" opacity={0.08} />
      <ellipse cx={x} cy={y + 6} rx={196} ry={24} fill="#000" opacity={0.45} />
      <ellipse cx={x} cy={y} rx={190} ry={20} fill="#121214" />
      <ellipse cx={x} cy={y - 3} rx={186} ry={15} fill="#1d1e21" />
      <path d={`M${x - 186} ${y} A 186 18 0 0 0 ${x + 186} ${y}`} stroke="#4a4d52" strokeWidth={1.6} fill="none" opacity={0.7} />
      {PROTECTOR.nozzles.map((nx) => (
        <g key={nx}>
          <rect x={nx - 6} y={y + 4} width={12} height={22} rx={2} fill="#0b0b0c" />
          <rect x={nx - 7} y={y + 22} width={14} height={10} rx={3} fill="#b9c0c6" />
          <rect x={nx - 6} y={y + 23} width={4} height={8} fill="#fff" opacity={0.5} />
        </g>
      ))}
      <ellipse cx={x} cy={y + 8} rx={14} ry={7} fill="#2a2c30" />
      <circle cx={x} cy={y + 9} r={3.2} fill={ledC} opacity={ledO} />
      <circle cx={x} cy={y + 9} r={12} fill={ledC} opacity={ledO * 0.35} />
      <circle cx={x + 40} cy={y + 4} r={4} fill="#0a0a0a" stroke="#555" strokeWidth={1} />
    </g>
  );
};

export const Interior: React.FC<InteriorProps> = ({
  t,
  fridge = 1,
  led = 1,
  boardHeat = 0,
  flame = 0,
  protector = 0,
  awake = 0,
  sense = 0,
  strobe = 0,
  mist = 0,
  flash = 0,
  burnt = 0,
  smoke = 0,
  highlight = null,
  hl = 0,
}) => {
  const st = strobe * (Math.sin(t * 0.55) > 0 ? 1 : 0.25);
  const stColor = Math.sin(t * 0.275) > 0 ? REAL.lampRed : REAL.beacon;
  const fh = flame * (90 + 20 * noise1(t * 0.3, 2));
  const fireLight = Math.max(boardHeat * 0.4, flame) * (0.8 + 0.2 * noise1(t * 0.7, 6));
  const spot = highlight === "fridge" ? FRIDGE : highlight === "inverter" ? INVERTER : highlight === "board" ? { x: BOARD.hot - 40, y: 1585 } : null;
  return (
    <g>
      <defs>
        <linearGradient id="inWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b4a42" />
          <stop offset="1" stopColor="#26302b" />
        </linearGradient>
        <linearGradient id="inFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a352f" />
          <stop offset="1" stopColor="#15130f" />
        </linearGradient>
        <radialGradient id="inCool" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${FRIDGE.x} ${FRIDGE.y}) scale(560 640)`}>
          <stop offset="0" stopColor="#BFE3FF" stopOpacity="0.42" />
          <stop offset="1" stopColor="#BFE3FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="inFire" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${BOARD.hot} 1560) scale(620 520)`}>
          <stop offset="0" stopColor={REAL.fireOrange} stopOpacity="0.6" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="inStrobe" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${PROTECTOR.x} ${PROTECTOR.y}) scale(900 1100)`}>
          <stop offset="0" stopColor={stColor} stopOpacity="0.85" />
          <stop offset="1" stopColor={stColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="inSpot" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${spot?.x ?? 0} ${spot?.y ?? 0}) scale(260 260)`}>
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.72" />
        </radialGradient>
        <linearGradient id="inSoot" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#050403" stopOpacity="0.95" />
          <stop offset="1" stopColor="#050403" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* room shell */}
      <polygon points="-400,420 1480,420 1000,700 80,700" fill="#22231f" />
      <rect x={80} y={700} width={920} height={765} fill="url(#inWall)" />
      <polygon points="80,700 80,1465 -400,1920 -400,420" fill="#1b211e" />
      <polygon points="1000,700 1000,1465 1480,1920 1480,420" fill="#1b211e" />
      <polygon points="80,1465 1000,1465 1480,1920 -400,1920" fill="url(#inFloor)" />
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1={80 + i * 115} y1={1465} x2={-400 + i * 235} y2={1920} stroke="#000" strokeWidth={2} opacity={0.3} />
      ))}
      {[1540, 1640, 1770].map((y) => (
        <line key={y} x1={-400} y1={y} x2={1480} y2={y} stroke="#000" strokeWidth={2} opacity={0.25} />
      ))}
      <rect x={80} y={1440} width={920} height={25} fill="#2e2a24" />
      {/* tube light (off) and wall socket */}
      <rect x={370} y={728} width={340} height={10} rx={5} fill="#d6dadc" opacity={0.35} />
      <rect x={52} y={1490} width={30} height={40} rx={4} fill="#d8d4cc" opacity={0.5} />

      <Shelves burnt={burnt} />
      <Cooler on={fridge} t={t} burnt={burnt} />
      <Inverter led={led} t={t} burnt={burnt} />
      <Board heat={boardHeat} t={t} burnt={burnt} />

      {protector > 0 && (
        <g opacity={protector}>
          <ProtectorUnit awake={awake} alarm={strobe} t={t} />
        </g>
      )}

      {/* lighting */}
      <g style={{ mixBlendMode: "screen" }}>
        <rect x={-400} y={420} width={1880} height={1500} fill="url(#inCool)" opacity={fridge * (1 - burnt)} />
        <rect x={-400} y={420} width={1880} height={1500} fill="url(#inFire)" opacity={fireLight} />
        <rect x={-400} y={420} width={1880} height={1500} fill="url(#inStrobe)" opacity={st} />
      </g>
      {/* overall night darkness */}
      <rect x={-400} y={420} width={1880} height={1500} fill="#000" opacity={0.28} />

      {/* aftermath */}
      {burnt > 0 && (
        <g>
          <rect x={-400} y={420} width={1880} height={1500} fill="url(#inSoot)" opacity={burnt * 0.75} />
          {Array.from({ length: 26 }).map((_, i) => {
            const x = 80 + rand(i * 3) * 920;
            const y = 1460 - ((t * (0.6 + rand(i) * 0.8) + rand(i + 2) * 700) % 760);
            return <circle key={i} cx={x + noise1(t * 0.05 + i, 2) * 20} cy={y} r={1.6 + rand(i + 5) * 1.6} fill={REAL.fireOrange} opacity={burnt * 0.8 * rand(i + 7)} />;
          })}
        </g>
      )}

      <Flame id="inFlame" x={BOARD.hot} y={1580} h={fh} t={t} w={0.42} />

      {/* sensing: flame / heat / gas rings from the ceiling unit */}
      {sense > 0 &&
        [0, 1, 2].map((i) => {
          const ph = ((t * 0.025 + i / 3) % 1);
          return (
            <ellipse
              key={i}
              cx={PROTECTOR.x}
              cy={PROTECTOR.y + 20 + ph * 520}
              rx={40 + ph * 330}
              ry={10 + ph * 80}
              fill="none"
              stroke="#E9F3FA"
              strokeWidth={2.4}
              opacity={sense * (1 - ph) * 0.7}
            />
          );
        })}

      {PROTECTOR.nozzles.map((nx, i) => (
        <Mist key={nx} id={`inMist${i}`} x={nx} y={PROTECTOR.y + 32} floor={1600} spread={330} t={t + i * 13} amount={mist} />
      ))}
      <Smoke id="inSmoke" t={t} amount={smoke} emit={[{ x: BOARD.hot, y: 1560, w: 80 }, { x: 540, y: 1200, w: 700 }]} rise={700} size={90} tone="#5d5d60" />

      {/* camera flash from the unit */}
      {flash > 0 && (
        <g style={{ mixBlendMode: "screen" }}>
          <rect x={-400} y={420} width={1880} height={1500} fill="#ffffff" opacity={flash * 0.85} />
        </g>
      )}

      {/* focus a single object */}
      {spot && hl > 0 && <rect x={-400} y={420} width={1880} height={1500} fill="url(#inSpot)" opacity={hl} />}
    </g>
  );
};
