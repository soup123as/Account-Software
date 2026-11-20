import React from "react";
import { REAL, noise1, rand } from "../fk/theme";
import { Flame, Mist, Smoke } from "./fx";

/**
 * Inside the closed kirana shop at night (world = frame coordinates at zoom 1). Real proportions:
 * back wall y 700-1465 (about 3 m), slotted-angle steel racks of stock (x 104-522), a single-door
 * visi-cooler (x 556-784), a home inverter + tubular battery (x 806-992), a wall clock at 2:03, and
 * on the vitrified-tile floor a 4-socket extension board with a piggyback adapter on one socket -
 * the socket that overheats (BOARD.hot). The Protector is on the POP ceiling at (540, 612).
 * Colours are the real ones; the night is a darkness pass plus the actual light sources.
 */
export const BOARD = { x: 500, y: 1584, hot: 548 };
export const FRIDGE = { x: 670, y: 1180 };
export const INVERTER = { x: 852, y: 1385 };
export const PROTECTOR = { x: 540, y: 612, nozzles: [452, 628] };

export type InteriorProps = {
  t: number;
  fridge?: number;
  led?: number;
  boardHeat?: number;
  flame?: number;
  protector?: number;
  awake?: number;
  sense?: number;
  strobe?: number;
  mist?: number;
  flash?: number;
  burnt?: number;
  smoke?: number;
  highlight?: "fridge" | "inverter" | "board" | null;
  hl?: number;
};

const PACK = ["#c8372d", "#2f5aa8", "#e2a91f", "#2f8a4a", "#efe9dc", "#7d3c98", "#e46f1f", "#1f6f8b"];
const CARTON = ["#a57a4a", "#b88c59", "#94683b"];

/** A box with a front face and (below eye level) a visible top face. */
const Box: React.FC<{ x: number; y: number; w: number; h: number; c: string; top: boolean; carton: boolean; s: number }> = ({ x, y, w, h, c, top, carton, s }) => (
  <g>
    {top && <polygon points={`${x},${y - h} ${x + 10},${y - h - 9} ${x + w + 10},${y - h - 9} ${x + w},${y - h}`} fill={c} />}
    {top && <polygon points={`${x},${y - h} ${x + 10},${y - h - 9} ${x + w + 10},${y - h - 9} ${x + w},${y - h}`} fill="#fff" opacity={0.22} />}
    <polygon points={`${x + w},${y} ${x + w + 10},${y - 9} ${x + w + 10},${y - h - 9} ${x + w},${y - h}`} fill={c} />
    <polygon points={`${x + w},${y} ${x + w + 10},${y - 9} ${x + w + 10},${y - h - 9} ${x + w},${y - h}`} fill="#000" opacity={0.35} />
    <rect x={x} y={y - h} width={w} height={h} fill={c} />
    <rect x={x} y={y - h} width={w} height={h * 0.18} fill="#fff" opacity={0.1} />
    {carton ? (
      <g>
        <rect x={x} y={y - h * 0.55} width={w} height={6} fill="#d8b56f" opacity={0.7} />
        <rect x={x + w * 0.15} y={y - h * 0.85} width={w * 0.5} height={5} fill="#3a2a17" opacity={0.6} />
        <rect x={x + w * 0.15} y={y - h * 0.75} width={w * 0.3} height={3} fill="#3a2a17" opacity={0.45} />
      </g>
    ) : (
      <g>
        <rect x={x + 4} y={y - h * 0.62} width={w - 8} height={h * 0.3} rx={3} fill={rand(s) > 0.5 ? "#ffffff" : "#ffd84a"} opacity={0.75} />
        <rect x={x + 8} y={y - h * 0.55} width={(w - 16) * 0.7} height={4} fill={c} opacity={0.9} />
        <rect x={x + 8} y={y - h * 0.45} width={(w - 16) * 0.45} height={3} fill="#222" opacity={0.6} />
      </g>
    )}
    <rect x={x} y={y - 3} width={w + 10} height={3} fill="#000" opacity={0.45} />
  </g>
);

/** Slotted-angle steel rack (the standard Indian shop rack), loaded with stock. */
const Rack: React.FC<{ burnt: number }> = ({ burnt }) => {
  const rows = [860, 1040, 1220, 1400];
  const items: React.ReactNode[] = [];
  rows.forEach((y, r) => {
    let x = 122;
    let k = 0;
    while (x < 500) {
      const s = r * 50 + k++;
      const carton = rand(s + 9) < (r === 3 ? 0.7 : 0.25);
      const w = carton ? 70 + rand(s) * 40 : 30 + rand(s) * 36;
      const h = carton ? 90 + rand(s + 1) * 60 : 60 + rand(s + 1) * 80;
      if (x + w > 505) break;
      const c = carton ? CARTON[Math.floor(rand(s + 2) * 3)] : PACK[Math.floor(rand(s + 2) * PACK.length)];
      items.push(<Box key={`${r}-${k}`} x={x} y={y} w={w} h={Math.min(h, 160)} c={c} top={y > 1150} carton={carton} s={s} />);
      x += w + 4;
    }
  });
  return (
    <g>
      <defs>
        <pattern id="rkSlots" width="12" height="22" patternUnits="userSpaceOnUse">
          <rect width="12" height="22" fill="#8d9399" />
          <rect x="4" y="4" width="4" height="12" rx="2" fill="#1d2023" />
        </pattern>
        <linearGradient id="rkShelf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4c9ce" />
          <stop offset="1" stopColor="#6c7277" />
        </linearGradient>
      </defs>
      {/* back panel shadow */}
      <rect x={104} y={680} width={418} height={790} fill="#000" opacity={0.18} />
      {items}
      {rows.map((y) => (
        <g key={y}>
          <rect x={100} y={y} width={428} height={10} fill="url(#rkShelf)" />
          <rect x={100} y={y + 10} width={428} height={8} fill="#000" opacity={0.35} />
        </g>
      ))}
      {[100, 516].map((x) => (
        <g key={x}>
          <rect x={x} y={672} width={12} height={800} fill="url(#rkSlots)" />
          <rect x={x} y={672} width={2} height={800} fill="#e7ebee" opacity={0.4} />
        </g>
      ))}
      <rect x={96} y={680} width={436} height={800} fill="#0a0806" opacity={burnt * 0.82} />
    </g>
  );
};

/** Single-door visi-cooler with depth, lit interior and glass reflections. */
const Cooler: React.FC<{ on: number; t: number; burnt: number }> = ({ on, t, burnt }) => {
  const hum = on * (0.97 + 0.03 * noise1(t * 0.4, 5));
  const shelves = [1060, 1170, 1280, 1390];
  const cols = ["#2f7a3a", "#5b2f12", "#e0761c", "#d6e2ea", "#1f4f8a", "#b0201c", "#f2c230"];
  const bottles: React.ReactNode[] = [];
  shelves.forEach((y, r) => {
    for (let i = 0; i < 8; i++) {
      const c = cols[Math.floor(rand(r * 9 + i) * cols.length)];
      const x = 586 + i * 21.5;
      const tall = rand(r * 7 + i) > 0.4;
      const h = tall ? 72 : 52;
      bottles.push(
        <g key={`${r}-${i}`}>
          <rect x={x} y={y - h} width={16} height={h} rx={5} fill={c} />
          <path d={`M${x + 3} ${y - h} Q ${x + 4} ${y - h - 12} ${x + 6} ${y - h - 18} h4 Q ${x + 12} ${y - h - 12} ${x + 13} ${y - h} Z`} fill={c} />
          <rect x={x + 5} y={y - h - 22} width={6} height={5} rx={1} fill={rand(i + r) > 0.5 ? "#d81e1e" : "#e8e8e8"} />
          <rect x={x} y={y - h * 0.62} width={16} height={h * 0.3} fill="#fff" opacity={0.55} />
          <rect x={x + 2} y={y - h + 6} width={3} height={h - 14} rx={1.5} fill="#fff" opacity={0.45} />
        </g>,
      );
    }
  });
  return (
    <g>
      <defs>
        <linearGradient id="clBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9edf0" />
          <stop offset="1" stopColor="#b9c0c6" />
        </linearGradient>
        <linearGradient id="clInside" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f2fbff" />
          <stop offset="0.5" stopColor="#d4ecfb" />
          <stop offset="1" stopColor="#b5d9f2" />
        </linearGradient>
        <linearGradient id="clGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.47" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.53" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.62" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.66" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* side panel (depth) */}
      <polygon points="784,900 812,884 812,1450 784,1466" fill="#8c949a" />
      <polygon points="784,900 812,884 812,1450 784,1466" fill="#000" opacity={0.3} />
      <rect x={556} y={896} width={228} height={570} rx={8} fill="url(#clBody)" />
      {/* header light box */}
      <rect x={564} y={902} width={212} height={50} rx={4} fill="#0f3d78" />
      <rect x={564} y={902} width={212} height={50} rx={4} fill="#9fd0ff" opacity={0.35 * hum} />
      <rect x={576} y={918} width={120} height={8} rx={4} fill="#ffffff" opacity={0.85} />
      <rect x={576} y={932} width={80} height={6} rx={3} fill="#ffffff" opacity={0.55} />
      {/* door: aluminium frame + lit interior */}
      <rect x={566} y={960} width={208} height={448} rx={6} fill="#a8b0b6" />
      <rect x={574} y={968} width={192} height={432} fill="url(#clInside)" opacity={0.15 + 0.85 * hum} />
      <rect x={574} y={968} width={6} height={432} fill="#ffffff" opacity={0.9 * hum} />
      {bottles}
      {shelves.map((y) => (
        <g key={y}>
          <rect x={576} y={y} width={188} height={4} fill="#e9f3fa" opacity={0.85} />
          <rect x={576} y={y + 4} width={188} height={3} fill="#5b7184" opacity={0.4} />
        </g>
      ))}
      <rect x={574} y={968} width={192} height={432} fill="#08121c" opacity={0.18 + (1 - hum) * 0.6} />
      <rect x={574} y={968} width={192} height={432} fill="url(#clGlass)" />
      <rect x={748} y={1110} width={10} height={130} rx={4} fill="#d9dee2" />
      <rect x={748} y={1110} width={3} height={130} rx={1.5} fill="#ffffff" opacity={0.8} />
      {/* compressor grille + feet */}
      <rect x={566} y={1414} width={208} height={42} rx={4} fill="#2b3035" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={574} y={1419 + i * 5.4} width={192} height={2.4} fill="#0d0f11" />
      ))}
      <rect x={566} y={1458} width={22} height={10} fill="#111" />
      <rect x={752} y={1458} width={22} height={10} fill="#111" />
      <rect x={550} y={890} width={270} height={580} fill="#0a0806" opacity={burnt * 0.78} />
    </g>
  );
};

/** Home inverter + tubular battery on the floor. */
const Power: React.FC<{ led: number; t: number; burnt: number }> = ({ led, t, burnt }) => {
  const blink = Math.pow(Math.max(0, Math.sin(t * 0.12)), 18);
  return (
    <g>
      <defs>
        <linearGradient id="pwInv" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#efece4" />
          <stop offset="1" stopColor="#bdb8ac" />
        </linearGradient>
        <linearGradient id="pwBat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e4e0d3" />
          <stop offset="0.6" stopColor="#cfc9b9" />
          <stop offset="1" stopColor="#9d9787" />
        </linearGradient>
      </defs>
      {/* inverter */}
      <polygon points="898,1294 912,1286 912,1454 898,1462" fill="#8f8a7e" />
      <rect x={806} y={1290} width={92} height={172} rx={6} fill="url(#pwInv)" />
      <rect x={816} y={1304} width={72} height={40} rx={4} fill="#1a1d1b" />
      <rect x={821} y={1309} width={62} height={30} rx={2} fill="#3BEA6A" opacity={0.12 + 0.22 * led} />
      <text x={852} y={1332} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={700} fontSize={18} fill="#3BEA6A" opacity={0.35 + 0.6 * led}>
        230V
      </text>
      <circle cx={826} cy={1360} r={5} fill="#3BEA6A" opacity={0.25 + 0.75 * led * (0.35 + 0.65 * blink)} />
      <circle cx={826} cy={1360} r={16} fill="#3BEA6A" opacity={0.25 * led * blink} />
      <circle cx={846} cy={1360} r={5} fill="#e2a91f" opacity={0.6} />
      <circle cx={866} cy={1360} r={5} fill="#5a1a14" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={818} y={1388 + i * 10} width={68} height={3.5} rx={1.5} fill="#5e5a50" opacity={0.6} />
      ))}
      <rect x={806} y={1290} width={92} height={4} rx={2} fill="#fff" opacity={0.5} />
      {/* tubular battery: cream body, green band, handle, terminals */}
      <rect x={914} y={1266} width={84} height={196} rx={8} fill="url(#pwBat)" />
      <rect x={914} y={1320} width={84} height={42} fill="#1f7a3f" />
      <rect x={924} y={1332} width={44} height={6} fill="#ffffff" opacity={0.75} />
      <rect x={924} y={1344} width={30} height={4} fill="#ffffff" opacity={0.5} />
      <rect x={914} y={1266} width={84} height={14} rx={6} fill="#bcb6a6" />
      <path d="M936 1266 v -14 h40 v 14" stroke="#2b2b2b" strokeWidth={5} fill="none" />
      <rect x={918} y={1250} width={16} height={18} rx={3} fill="#c9302c" />
      <rect x={980} y={1250} width={16} height={18} rx={3} fill="#1a1a1a" />
      <circle cx={958} cy={1274} r={4} fill="#3BEA6A" opacity={0.8} />
      <path d="M926 1250 C 926 1215, 880 1235, 872 1290" stroke="#c9302c" strokeWidth={6} fill="none" />
      <path d="M988 1250 C 988 1205, 892 1228, 886 1290" stroke="#151515" strokeWidth={6} fill="none" />
      <ellipse cx={900} cy={1466} rx={110} ry={10} fill="#000" opacity={0.5} />
      <rect x={800} y={1240} width={210} height={230} fill="#0a0806" opacity={burnt * 0.72} />
    </g>
  );
};

/** 4-socket extension board on the floor, seen from above-front; a piggyback adapter on socket 3. */
const Board: React.FC<{ heat: number; t: number; burnt: number }> = ({ heat, t, burnt }) => {
  const g = heat * (0.8 + 0.2 * noise1(t * 0.5, 8));
  const socks = [410, 466, 522, 578];
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
        <linearGradient id="bdTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f2ec" />
          <stop offset="1" stopColor="#d5d1c7" />
        </linearGradient>
      </defs>
      {/* cords to every load, tangled on the floor */}
      <g fill="none" strokeLinecap="round">
        <path d="M410 1556 C 380 1500, 300 1490, 140 1470" stroke="#141414" strokeWidth={7} />
        <path d="M466 1556 C 480 1500, 600 1500, 640 1462" stroke="#ebe8e1" strokeWidth={7} />
        <path d="M534 1540 C 600 1500, 760 1500, 830 1460" stroke="#141414" strokeWidth={7} />
        <path d="M562 1540 C 640 1580, 780 1630, 1100 1650" stroke="#ebe8e1" strokeWidth={7} />
        <path d="M578 1556 C 660 1530, 860 1520, 950 1462" stroke="#141414" strokeWidth={6} />
        <path d="M372 1596 C 300 1606, 150 1566, 60 1526" stroke="#ebe8e1" strokeWidth={8} />
      </g>
      <ellipse cx={500} cy={1616} rx={150} ry={12} fill="#000" opacity={0.5} />
      {/* body: top face + front face */}
      <polygon points="378,1566 388,1554 628,1554 618,1566" fill="url(#bdTop)" />
      <rect x={372} y={1566} width={252} height={44} rx={6} fill="#e6e2d9" />
      <rect x={372} y={1592} width={252} height={18} rx={6} fill="#000" opacity={0.18} />
      <rect x={380} y={1574} width={26} height={14} rx={3} fill="#c9302c" />
      <rect x={383} y={1576} width={20} height={5} rx={2} fill="#ff7a6a" opacity={0.6} />
      {socks.map((x, i) => (
        <g key={i}>
          <rect x={x - 22} y={1570} width={44} height={30} rx={4} fill="#f2efe8" stroke="#bdb8ad" strokeWidth={1} />
          <circle cx={x - 7} cy={1581} r={2.6} fill="#2a2a2a" />
          <circle cx={x + 7} cy={1581} r={2.6} fill="#2a2a2a" />
          <rect x={x - 2} y={1588} width={4} height={7} rx={1} fill="#2a2a2a" />
          <circle cx={x + 16} cy={1574} r={2.4} fill="#ff3b2b" opacity={0.7} />
        </g>
      ))}
      {/* plugs in sockets 1, 2, 4 */}
      {[0, 1, 3].map((i) => (
        <g key={i}>
          <rect x={socks[i] - 14} y={1546} width={28} height={30} rx={5} fill={i === 1 ? "#ebe8e1" : "#161616"} />
          <rect x={socks[i] - 11} y={1548} width={22} height={4} rx={2} fill="#fff" opacity={0.25} />
          <rect x={socks[i] - 5} y={1538} width={10} height={10} rx={3} fill={i === 1 ? "#ebe8e1" : "#161616"} />
        </g>
      ))}
      {/* piggyback multi-plug adapter in socket 3 with two more plugs on it */}
      <g>
        <rect x={socks[2] - 20} y={1534} width={40} height={42} rx={5} fill="#f0ede6" />
        <rect x={socks[2] - 20} y={1534} width={40} height={6} rx={3} fill="#fff" opacity={0.5} />
        <rect x={socks[2] - 26} y={1514} width={22} height={24} rx={4} fill="#161616" />
        <rect x={socks[2] + 4} y={1514} width={22} height={24} rx={4} fill="#ebe8e1" />
        <rect x={socks[2] - 19} y={1504} width={8} height={12} rx={3} fill="#161616" />
        <rect x={socks[2] + 11} y={1504} width={8} height={12} rx={3} fill="#ebe8e1" />
      </g>
      {/* scorch + glow at the overloaded socket */}
      <ellipse cx={BOARD.hot} cy={1580} rx={30} ry={16} fill="#1a0c04" opacity={Math.min(1, heat * 1.2) * 0.75} />
      <g style={{ mixBlendMode: "screen" }}>
        <ellipse cx={BOARD.hot} cy={1570} rx={60 + 90 * g} ry={30 + 46 * g} fill="url(#bdHot)" opacity={g} />
        <ellipse cx={BOARD.hot} cy={1570} rx={10 + 8 * g} ry={6 + 4 * g} fill={REAL.fireCore} opacity={0.75 * g} filter="url(#bdGlow)" />
      </g>
      <Smoke id="bdWisp" t={t} amount={Math.max(0, heat - 0.5) * 1.4} emit={[{ x: BOARD.hot, y: 1540, w: 30 }]} rise={260} size={22} tone="#8a8a8c" />
      <rect x={360} y={1500} width={280} height={130} fill="#0a0806" opacity={burnt * 0.8} />
    </g>
  );
};

/** The Protector seen from below on the ceiling: matte black oval plate, two nozzles, sensor + LED. */
export const ProtectorUnit: React.FC<{ awake: number; alarm: number; t: number }> = ({ awake, alarm, t }) => {
  const { x, y } = PROTECTOR;
  const ledC = alarm > 0 ? (Math.sin(t * 0.55) > 0 ? REAL.lampRed : REAL.beacon) : "#3BEA6A";
  const ledO = alarm > 0 ? 1 : awake * (0.55 + 0.45 * Math.sin(t * 0.1));
  return (
    <g>
      <ellipse cx={x} cy={y + 8} rx={200} ry={26} fill="#000" opacity={0.35} />
      <ellipse cx={x} cy={y} rx={190} ry={20} fill="#0f0f11" />
      <ellipse cx={x} cy={y - 3} rx={186} ry={15} fill="#1c1d20" />
      <path d={`M${x - 186} ${y} A 186 18 0 0 0 ${x + 186} ${y}`} stroke="#5a5e63" strokeWidth={1.6} fill="none" opacity={0.75} />
      <path d={`M${x - 120} ${y - 10} Q ${x} ${y - 16} ${x + 120} ${y - 10}`} stroke="#ffffff" strokeWidth={1.2} fill="none" opacity={0.12} />
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
  const spot = highlight === "fridge" ? { x: 670, y: 1180 } : highlight === "inverter" ? { x: 900, y: 1360 } : highlight === "board" ? { x: BOARD.hot - 40, y: 1570 } : null;
  const cool = fridge * (1 - burnt);
  return (
    <g>
      <defs>
        <linearGradient id="inWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3330" />
          <stop offset="1" stopColor="#1d2422" />
        </linearGradient>
        <filter id="inPlasterF" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="3" seed={11} />
          <feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.09  0 0 0 0 0.07  0 0 0 1.5 -0.6" />
        </filter>
        <pattern id="inPlaster" width="500" height="500" patternUnits="userSpaceOnUse">
          <rect width="500" height="500" filter="url(#inPlasterF)" />
        </pattern>
        <linearGradient id="inFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2824" />
          <stop offset="1" stopColor="#121110" />
        </linearGradient>
        <linearGradient id="inCeil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#151514" />
          <stop offset="1" stopColor="#262624" />
        </linearGradient>
        {/* night: everything falls off away from the cooler */}
        <radialGradient id="inDark" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(670 1180) scale(${700 + 260 * cool} ${820 + 260 * cool})`}>
          <stop offset="0" stopColor="#020304" stopOpacity={0.55 - 0.45 * cool} />
          <stop offset="0.45" stopColor="#020304" stopOpacity={0.72 - 0.25 * cool} />
          <stop offset="1" stopColor="#020304" stopOpacity="0.93" />
        </radialGradient>
        <radialGradient id="inCool" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(670 1180) scale(520 620)">
          <stop offset="0" stopColor="#BFE3FF" stopOpacity="0.4" />
          <stop offset="1" stopColor="#BFE3FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="inFire" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${BOARD.hot} 1560) scale(700 600)`}>
          <stop offset="0" stopColor={REAL.fireOrange} stopOpacity="0.75" />
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
          <stop offset="1" stopColor="#050403" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="inRackLight" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#BFE3FF" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#BFE3FF" stopOpacity="0.06" />
          <stop offset="1" stopColor="#BFE3FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="inRefl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE8FF" stopOpacity="0.5" />
          <stop offset="1" stopColor="#CFE8FF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* POP ceiling, walls, floor */}
      <polygon points="-400,420 1480,420 1000,700 80,700" fill="url(#inCeil)" />
      <polygon points="-120,470 1200,470 960,672 120,672" fill="none" stroke="#000" strokeWidth={2} opacity={0.15} />
      <rect x={80} y={700} width={920} height={765} fill="url(#inWall)" />
      
      <polygon points="80,700 80,1465 -400,1920 -400,420" fill="#18201d" />
      <polygon points="1000,700 1000,1465 1480,1920 1480,420" fill="#141a18" />
      <polygon points="80,700 80,1465 -400,1920 -400,420" fill="#000" opacity={0.3} />
      <polygon points="1000,700 1000,1465 1480,1920 1480,420" fill="#000" opacity={0.38} />
      <polygon points="80,1465 1000,1465 1480,1920 -400,1920" fill="url(#inFloor)" />
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1={80 + i * 115} y1={1465} x2={-400 + i * 235} y2={1920} stroke="#000" strokeWidth={2} opacity={0.5} />
      ))}
      {[1528, 1610, 1720, 1860].map((y) => (
        <line key={y} x1={-400} y1={y} x2={1480} y2={y} stroke="#000" strokeWidth={2} opacity={0.45} />
      ))}
      <rect x={80} y={1438} width={920} height={27} fill="#2c2a27" />
      <rect x={80} y={1438} width={920} height={3} fill="#cfc6b6" opacity={0.5} />
      {/* tube light (off), wall clock at 2:03, switchboard */}
      <rect x={366} y={724} width={348} height={16} rx={4} fill="#e9ecee" />
      <rect x={372} y={729} width={336} height={6} rx={3} fill="#ffffff" opacity={0.6} />
      <g transform="translate(900 820)">
        <circle r={44} fill="#2a2a2a" />
        <circle r={39} fill="#f3f1ea" />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={-1.2} y={-36} width={2.4} height={6} fill="#333" transform={`rotate(${i * 30})`} />
        ))}
        <rect x={-2} y={-22} width={4} height={24} rx={2} fill="#111" transform="rotate(61)" />
        <rect x={-1.5} y={-32} width={3} height={34} rx={1.5} fill="#111" transform="rotate(18)" />
        <circle r={3} fill="#c9302c" />
      </g>
      <rect x={40} y={1470} width={46} height={64} rx={4} fill="#efede6" />
      <rect x={48} y={1480} width={12} height={20} rx={2} fill="#d8d4ca" />
      <rect x={66} y={1480} width={12} height={20} rx={2} fill="#d8d4ca" />

      <Rack burnt={burnt} />
      <rect x={96} y={672} width={436} height={800} fill="url(#inRackLight)" style={{ mixBlendMode: "screen" }} opacity={cool} />
      <Cooler on={fridge} t={t} burnt={burnt} />
      <Power led={led} t={t} burnt={burnt} />
      {/* cooler light on the floor tiles */}
      <polygon points="574,1470 766,1470 820,1760 520,1760" fill="url(#inRefl)" opacity={cool} style={{ mixBlendMode: "screen" }} />
      <g transform="translate(0 2932) scale(1 -1)" opacity={0.12 * cool}>
        <rect x={574} y={1180} width={192} height={220} fill="#DCEFFF" />
      </g>
      <Board heat={boardHeat} t={t} burnt={burnt} />

      {protector > 0 && (
        <g opacity={protector}>
          <ProtectorUnit awake={awake} alarm={strobe} t={t} />
        </g>
      )}

      {/* the night: darkness pass, then the light sources */}
      <rect x={-400} y={420} width={1880} height={1500} fill="url(#inDark)" />
      <g style={{ mixBlendMode: "screen" }}>
        <rect x={-400} y={420} width={1880} height={1500} fill="url(#inCool)" opacity={cool} />
        <rect x={-400} y={420} width={1880} height={1500} fill="url(#inFire)" opacity={fireLight} />
        <rect x={-400} y={420} width={1880} height={1500} fill="url(#inStrobe)" opacity={st} />
      </g>
      {/* the LED and the cooler interior stay bright on top of the darkness */}
      <g style={{ mixBlendMode: "screen" }} opacity={cool * 0.55}>
        <rect x={574} y={968} width={192} height={432} fill="#bfe3ff" opacity={0.25} />
        <rect x={564} y={902} width={212} height={50} fill="#9fd0ff" opacity={0.25} />
      </g>
      {protector > 0 && awake > 0 && (
        <circle cx={PROTECTOR.x} cy={PROTECTOR.y + 9} r={4} fill={strobe > 0 ? stColor : "#3BEA6A"} opacity={protector * (strobe > 0 ? 1 : awake * (0.55 + 0.45 * Math.sin(t * 0.1)))} />
      )}

      {burnt > 0 && (
        <g>
          <rect x={-400} y={420} width={1880} height={1500} fill="url(#inSoot)" opacity={burnt * 0.7} />
          {Array.from({ length: 26 }).map((_, i) => {
            const x = 80 + rand(i * 3) * 920;
            const y = 1460 - ((t * (0.6 + rand(i) * 0.8) + rand(i + 2) * 700) % 760);
            return <circle key={i} cx={x + noise1(t * 0.05 + i, 2) * 20} cy={y} r={1.6 + rand(i + 5) * 1.6} fill={REAL.fireOrange} opacity={burnt * 0.8 * rand(i + 7)} />;
          })}
        </g>
      )}

      <Flame id="inFlame" x={BOARD.hot} y={1560} h={fh} t={t} w={0.42} />

      {sense > 0 &&
        [0, 1, 2].map((i) => {
          const ph = (t * 0.025 + i / 3) % 1;
          return (
            <ellipse key={i} cx={PROTECTOR.x} cy={PROTECTOR.y + 20 + ph * 520} rx={40 + ph * 330} ry={10 + ph * 80} fill="none" stroke="#E9F3FA" strokeWidth={2.4} opacity={sense * (1 - ph) * 0.7} />
          );
        })}

      {PROTECTOR.nozzles.map((nx, i) => (
        <Mist key={nx} id={`inMist${i}`} x={nx} y={PROTECTOR.y + 32} floor={1600} spread={330} t={t + i * 13} amount={mist} />
      ))}
      <Smoke id="inSmoke" t={t} amount={smoke} emit={[{ x: BOARD.hot, y: 1560, w: 80 }, { x: 540, y: 1200, w: 700 }]} rise={700} size={90} tone="#5d5d60" />

      {flash > 0 && <rect x={-400} y={420} width={1880} height={1500} fill="#ffffff" opacity={flash * 0.85} style={{ mixBlendMode: "screen" }} />}
      {spot && hl > 0 && <rect x={-400} y={420} width={1880} height={1500} fill="url(#inSpot)" opacity={hl} />}
    </g>
  );
};
