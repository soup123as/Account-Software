import React from "react";
import { REAL, noise1 } from "../fk/theme";

/**
 * A bedroom at night, seen straight down onto the head half of the bed (5 px = 1 cm).
 * Queen bed 150 x 200 cm with two pillows and a quilted duvet, a walnut bedside table on the right with a
 * lamp and a glass of water, the wall socket between them with a white charger, and the phone on charge.
 * World = frame coordinates; frame it with a CamView.
 *
 * Props: `pos` (where the phone lies), `under` (phone is under the pillow: drawn below it), `screen`
 * (screen brightness), `pct` (battery ring), `heat` (warmth trapped under the phone), `bank` / `laptop`
 * (a power bank and an open laptop on the duvet), `moon` (0..1: the window's moonlight band crossing the
 * bed, i.e. the night passing), `lamp` (bedside lamp), `lift` (phone in the hand, off the surface).
 */
export type Pos = { x: number; y: number; r: number };
export const P_BED: Pos = { x: 760, y: 1104, r: -14 };
export const P_UNDER: Pos = { x: 716, y: 1024, r: -6 };
export const P_TABLE: Pos = { x: 968, y: 978, r: 0 };
export const BANK = { x: 606, y: 1252 };
export const LAPTOP = { x: 336, y: 1336 };
export const TABLE = { x0: 885, x1: 1105, y0: 845, y1: 1050 };
export const SOCKET = { x: 868, y: 812 };
export const mixPos = (a: Pos, b: Pos, p: number): Pos => ({ x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, r: a.r + (b.r - a.r) * p });

export type BedTopProps = {
  t: number;
  pos?: Pos;
  under?: boolean;
  screen?: number;
  pct?: number;
  heat?: number;
  bank?: number;
  laptop?: number;
  moon?: number;
  lamp?: number;
  lift?: number;
  dark?: number;
};

const Pillow: React.FC<{ x: number; y: number; w: number; h: number; k: number }> = ({ x, y, w, h, k }) => (
  <g>
    <rect x={x + 5} y={y + 10} width={w} height={h} rx={38} fill="#000" opacity={0.4} filter="url(#btSoft)" />
    <rect x={x} y={y} width={w} height={h} rx={38} fill="url(#btPillow)" />
    <rect x={x + 9} y={y + 9} width={w - 18} height={h - 18} rx={30} fill="none" stroke="#fff" strokeOpacity={0.2} strokeWidth={1.4} />
    <ellipse cx={x + w * (0.42 + 0.1 * k)} cy={y + h * 0.46} rx={w * 0.3} ry={h * 0.26} fill="#fff" opacity={0.13} filter="url(#btSoft)" />
    <ellipse cx={x + w * (0.5 + 0.06 * k)} cy={y + h * 0.56} rx={w * 0.16} ry={h * 0.16} fill="#3b4250" opacity={0.2} filter="url(#btSoft)" />
    <path d={`M${x + 26} ${y + 30} q30 14 54 6 M${x + w - 30} ${y + h - 30} q-34 -16 -60 -4 M${x + w - 40} ${y + 28} q-20 20 -44 20`} stroke="#5c6472" strokeOpacity={0.4} strokeWidth={1.6} fill="none" strokeLinecap="round" />
  </g>
);

const PhoneTop: React.FC<{ pos: Pos; screen: number; pct: number; lift: number; t: number }> = ({ pos, screen, pct, lift, t }) => {
  const ring = 2 * Math.PI * 13;
  return (
    <g transform={`translate(${pos.x} ${pos.y}) rotate(${pos.r}) scale(${1 + lift * 0.14})`}>
      <rect x={-24} y={-50} width={48} height={100} rx={11} fill="#000" opacity={0.5 - lift * 0.2} transform={`translate(${3 + lift * 14} ${5 + lift * 22})`} filter="url(#btSoftS)" />
      <rect x={-23} y={-49} width={46} height={98} rx={10} fill="#202329" stroke="#8a9099" strokeWidth={1.3} />
      <rect x={-20.5} y={-46.5} width={41} height={93} rx={7.5} fill="#04060a" />
      <g opacity={screen}>
        <rect x={-20.5} y={-46.5} width={41} height={93} rx={7.5} fill="url(#btScr)" />
        <text x={0} y={-27} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={500} fontSize={9.5} fill="#ffffff" opacity={0.85}>
          11:47
        </text>
        <circle cx={0} cy={-2} r={13} fill="none" stroke="#17301f" strokeWidth={3.2} />
        <circle cx={0} cy={-2} r={13} fill="none" stroke="#3BEA6A" strokeWidth={3.2} strokeLinecap="round" strokeDasharray={`${ring * pct} ${ring}`} transform="rotate(-90 0 -2)" />
        <path d="M2 -11 L-5 -1 H-0.5 L-2 7 L5 -3 H0.5 Z" fill="#3BEA6A" opacity={0.75 + 0.25 * Math.sin(t * 0.16)} />
        <text x={0} y={27} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={700} fontSize={11} fill="#ffffff">
          {Math.round(pct * 100)}%
        </text>
        <text x={0} y={37} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={500} fontSize={5.6} fill="#9fe8b4">
          Charging
        </text>
      </g>
      <circle cx={0} cy={-41.5} r={1.7} fill="#0e1014" />
      <path d="M-18 -44 Q0 -47 18 -44" stroke="#fff" strokeOpacity={0.14} strokeWidth={1} fill="none" />
    </g>
  );
};

export const BedTop: React.FC<BedTopProps> = ({ t, pos = P_BED, under = false, screen = 1, pct = 0.42, heat = 0, bank = 0, laptop = 0, moon = 0.3, lamp = 0, lift = 0, dark = 1 }) => {
  // the plug end of the phone (bottom edge), for the cable
  const a = (pos.r * Math.PI) / 180;
  const bx = pos.x - Math.sin(a) * 52;
  const by = pos.y + Math.cos(a) * 52;
  const onTable = pos.x > 870;
  const cable = onTable
    ? `M${SOCKET.x} ${SOCKET.y + 16} C ${SOCKET.x + 6} ${SOCKET.y + 120}, ${bx - 30} ${by + 90}, ${bx} ${by}`
    : `M${SOCKET.x} ${SOCKET.y + 16} C ${SOCKET.x + 10} ${SOCKET.y + 190}, ${bx + 120} ${by + 150}, ${bx} ${by}`;
  const flick = 0.9 + 0.1 * noise1(t * 0.3, 4);
  const mx = -500 + moon * 1500; // moon band position
  const phone = <PhoneTop pos={pos} screen={screen} pct={pct} lift={lift} t={t} />;
  const b = Math.max(0, Math.min(1, bank));
  const l = Math.max(0, Math.min(1, laptop));
  return (
    <g>
      <defs>
        <filter id="btSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="btSoftS" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="btGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="30" />
        </filter>
        <linearGradient id="btFloor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a2c22" />
          <stop offset="1" stopColor="#2e231b" />
        </linearGradient>
        <pattern id="btPlank" width="96" height="640" patternUnits="userSpaceOnUse">
          <rect width="96" height="640" fill="none" />
          <line x1="0" y1="0" x2="0" y2="640" stroke="#120d0a" strokeWidth="2.5" />
          <line x1="2" y1="0" x2="2" y2="640" stroke="#5a4636" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="380" x2="96" y2="380" stroke="#120d0a" strokeWidth="2" />
          <path d="M20 40 q14 120 0 260 M60 420 q-12 90 4 200 M70 60 q10 100 -6 240" stroke="#20170f" strokeWidth="1.2" fill="none" opacity="0.6" />
        </pattern>
        <linearGradient id="btSheet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c5cad4" />
          <stop offset="1" stopColor="#a4aab6" />
        </linearGradient>
        <linearGradient id="btPillow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e3e6ec" />
          <stop offset="1" stopColor="#aab0bc" />
        </linearGradient>
        <linearGradient id="btDuvet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5a6f96" />
          <stop offset="1" stopColor="#3c4b6b" />
        </linearGradient>
        <pattern id="btQuilt" width="150" height="150" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="150" y2="0" stroke="#1f2a40" strokeWidth="3" opacity="0.55" />
          <line x1="0" y1="3" x2="150" y2="3" stroke="#9fb0d2" strokeWidth="1.4" opacity="0.35" />
          <line x1="0" y1="0" x2="0" y2="150" stroke="#1f2a40" strokeWidth="3" opacity="0.55" />
          <line x1="3" y1="0" x2="3" y2="150" stroke="#9fb0d2" strokeWidth="1.4" opacity="0.35" />
          <circle cx="75" cy="75" r="46" fill="#ffffff" opacity="0.05" />
        </pattern>
        <linearGradient id="btWood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a6144" />
          <stop offset="1" stopColor="#5d3f2b" />
        </linearGradient>
        <linearGradient id="btHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6c7079" />
          <stop offset="1" stopColor="#474a52" />
        </linearGradient>
        <linearGradient id="btScr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#16283a" />
          <stop offset="1" stopColor="#0a1016" />
        </linearGradient>
        <radialGradient id="btNight" gradientUnits="userSpaceOnUse" cx={pos.x} cy={pos.y} r={1050}>
          <stop offset="0" stopColor="#03050a" stopOpacity={0.12 * dark} />
          <stop offset="0.2" stopColor="#03050a" stopOpacity={0.5 * dark} />
          <stop offset="0.55" stopColor="#03050a" stopOpacity={0.78 * dark} />
          <stop offset="1" stopColor="#03050a" stopOpacity={0.93 * dark} />
        </radialGradient>
        <radialGradient id="btCool">
          <stop offset="0" stopColor="#cfe6ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#cfe6ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="btHot">
          <stop offset="0" stopColor={REAL.fireCore} stopOpacity="0.95" />
          <stop offset="0.3" stopColor={REAL.fireYellow} stopOpacity="0.75" />
          <stop offset="0.65" stopColor={REAL.fireOrange} stopOpacity="0.4" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="btLamp">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="btMoon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#bcd4ff" stopOpacity="0" />
          <stop offset="0.3" stopColor="#bcd4ff" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#bcd4ff" stopOpacity="0.06" />
          <stop offset="0.56" stopColor="#bcd4ff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#bcd4ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="btLapScr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bcd6ff" />
          <stop offset="1" stopColor="#6f9be0" />
        </linearGradient>
      </defs>

      {/* floor and the wall behind the bed */}
      <rect x={-700} y={700} width={2500} height={2400} fill="url(#btFloor)" />
      <rect x={-700} y={700} width={2500} height={2400} fill="url(#btPlank)" />
      <rect x={-700} y={300} width={2500} height={500} fill="#15171b" />
      <rect x={-700} y={792} width={2500} height={10} fill="#3d4047" />

      {/* bedside table */}
      <rect x={TABLE.x0 + 8} y={TABLE.y0 + 14} width={TABLE.x1 - TABLE.x0} height={TABLE.y1 - TABLE.y0} rx={14} fill="#000" opacity={0.5} filter="url(#btSoft)" />
      <rect x={TABLE.x0} y={TABLE.y0} width={TABLE.x1 - TABLE.x0} height={TABLE.y1 - TABLE.y0} rx={14} fill="url(#btWood)" />
      <path d={`M${TABLE.x0 + 14} ${TABLE.y0 + 40} q100 -16 200 4 M${TABLE.x0 + 10} ${TABLE.y0 + 96} q90 18 200 -6 M${TABLE.x0 + 12} ${TABLE.y0 + 150} q110 -14 198 8`} stroke="#3e2919" strokeWidth={1.6} fill="none" opacity={0.6} />
      <rect x={TABLE.x0 + 1} y={TABLE.y0 + 1} width={TABLE.x1 - TABLE.x0 - 2} height={TABLE.y1 - TABLE.y0 - 2} rx={13} fill="none" stroke="#c79a76" strokeOpacity={0.35} strokeWidth={1.4} />
      {/* lamp (shade from above) */}
      <circle cx={1046} cy={902} r={50} fill="#000" opacity={0.35} filter="url(#btSoftS)" transform="translate(4 8)" />
      <circle cx={1046} cy={902} r={48} fill="#cfc6b4" />
      <circle cx={1046} cy={902} r={48} fill="none" stroke="#f3ecdc" strokeWidth={2} opacity={0.6} />
      <circle cx={1046} cy={902} r={20} fill="#8f8674" />
      <circle cx={1046} cy={902} r={20} fill="#ffe2b0" opacity={lamp} />
      <circle cx={1046} cy={902} r={7} fill="#3b352c" />
      {/* glass of water */}
      <circle cx={922} cy={886} r={19} fill="#a9c6dc" opacity={0.2} />
      <circle cx={922} cy={886} r={19} fill="none" stroke="#dbe9f3" strokeWidth={2.2} opacity={0.6} />
      <path d="M908 878 a16 16 0 0 1 14 -8" stroke="#fff" strokeWidth={2} fill="none" opacity={0.6} strokeLinecap="round" />

      {/* bed: headboard, fitted sheet */}
      <rect x={96} y={844} width={762} height={1010} rx={22} fill="#000" opacity={0.55} filter="url(#btSoft)" transform="translate(8 14)" />
      <rect x={88} y={800} width={774} height={44} rx={10} fill="url(#btHead)" />
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={i} x1={124 + i * 70} y1={803} x2={124 + i * 70} y2={841} stroke="#2c2e34" strokeWidth={2} />
      ))}
      <rect x={100} y={838} width={750} height={1010} rx={20} fill="url(#btSheet)" />
      <path d="M130 1052 q200 14 380 -4 q160 -14 320 6" stroke="#7b8291" strokeWidth={1.6} fill="none" opacity={0.5} />

      {under && phone}
      <Pillow x={135} y={862} w={320} h={180} k={0} />
      <Pillow x={495} y={862} w={320} h={180} k={1} />

      {/* duvet with its turned-back edge */}
      <path d="M92 1090 Q300 1070 480 1084 T858 1082 V1860 H92 Z" fill="url(#btDuvet)" />
      <path d="M92 1090 Q300 1070 480 1084 T858 1082 V1860 H92 Z" fill="url(#btQuilt)" />
      <path d="M92 1090 Q300 1070 480 1084 T858 1082 V1150 Q660 1166 470 1152 T92 1160 Z" fill="#8494b6" />
      <path d="M92 1160 Q280 1146 470 1152 T858 1150" stroke="#1f2a40" strokeWidth={5} fill="none" opacity={0.45} filter="url(#btSoftS)" />
      <path d="M92 1090 Q300 1070 480 1084 T858 1082" stroke="#c6d0e6" strokeWidth={2} fill="none" opacity={0.6} />
      <path d="M200 1300 q140 60 120 240 M640 1240 q-40 160 60 330 M440 1500 q60 100 20 260" stroke="#1f2a40" strokeWidth={10} fill="none" opacity={0.22} filter="url(#btSoftS)" />

      {/* an open laptop on the duvet, on charge */}
      {l > 0 && (
        <g transform={`translate(${LAPTOP.x} ${LAPTOP.y}) rotate(-7) scale(${1.14 - 0.14 * l})`} opacity={Math.min(1, l * 1.6)}>
          <rect x={-160} y={-96} width={320} height={212} rx={14} fill="#000" opacity={0.5} filter="url(#btSoft)" transform="translate(6 12)" />
          {/* screen, leaning back */}
          <path d="M-152 -112 L152 -112 L160 -176 L-160 -176 Z" fill="#23262b" />
          <path d="M-146 -116 L146 -116 L152 -170 L-152 -170 Z" fill="url(#btLapScr)" opacity={0.9} />
          {/* deck */}
          <rect x={-160} y={-112} width={320} height={224} rx={14} fill="#aeb3bb" />
          <rect x={-160} y={-112} width={320} height={224} rx={14} fill="none" stroke="#e3e6ea" strokeWidth={1.5} opacity={0.7} />
          <rect x={-138} y={-92} width={276} height={104} rx={6} fill="#2a2d33" />
          {[0, 1, 2, 3].map((r) =>
            Array.from({ length: 12 }).map((_, c) => <rect key={`${r}-${c}`} x={-134 + c * 22.6} y={-88 + r * 25} width={19} height={21} rx={3} fill="#3c4048" />),
          )}
          <rect x={-58} y={30} width={116} height={66} rx={8} fill="#9ba0a8" stroke="#7d828a" strokeWidth={1.2} />
          {/* charger: cable and brick */}
          <path d="M-160 -60 C -230 -70, -250 20, -330 6" stroke="#e6e6e2" strokeWidth={4} fill="none" strokeLinecap="round" />
          <rect x={-380} y={-18} width={56} height={48} rx={8} fill="#e9e9e5" />
          <circle cx={-152} cy={-60} r={3.4} fill="#FFA41A" />
          <circle cx={-152} cy={-60} r={10} fill="#FFA41A" opacity={0.3 + 0.2 * Math.sin(t * 0.14)} />
        </g>
      )}

      {/* a power bank on the duvet, charging itself */}
      {b > 0 && (
        <g transform={`translate(${BANK.x} ${BANK.y}) rotate(22) scale(${1.2 - 0.2 * b})`} opacity={Math.min(1, b * 1.6)}>
          <rect x={-34} y={-66} width={68} height={132} rx={14} fill="#000" opacity={0.5} filter="url(#btSoftS)" transform="translate(5 9)" />
          <rect x={-34} y={-66} width={68} height={132} rx={14} fill="#2b2f36" stroke="#7b818b" strokeWidth={1.3} />
          <rect x={-28} y={-60} width={56} height={120} rx={10} fill="none" stroke="#fff" strokeOpacity={0.1} strokeWidth={1.2} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={-15 + i * 10} cy={-46} r={2.6} fill="#7fd0ff" opacity={i <= Math.floor((t / 14) % 4) ? 1 : 0.2} />
          ))}
          <path d="M0 66 C 0 130, 120 120, 150 40 S 250 -120 262 -330" stroke="#e6e6e2" strokeWidth={3.6} fill="none" strokeLinecap="round" opacity={0.95} />
        </g>
      )}

      {/* the phone's charger: adapter in the wall socket and the cable */}
      <path d={cable} stroke="#000" strokeWidth={6} fill="none" opacity={0.35} transform="translate(2 5)" filter="url(#btSoftS)" />
      <path d={cable} stroke="#ecece8" strokeWidth={3.6} fill="none" strokeLinecap="round" />
      <rect x={SOCKET.x - 30} y={794} width={60} height={10} rx={3} fill="#d9d9d4" />
      <rect x={SOCKET.x - 15} y={800} width={30} height={30} rx={6} fill="#f1f1ed" />
      <rect x={SOCKET.x - 15} y={800} width={30} height={8} rx={4} fill="#fff" />

      {/* night */}
      <rect x={-700} y={300} width={2500} height={2800} fill="url(#btNight)" />
      <g style={{ mixBlendMode: "screen" }}>
        {/* moonlight through the window bars, drifting across as the night passes */}
        <rect x={mx} y={300} width={620} height={2600} fill="url(#btMoon)" transform={`rotate(-24 ${mx + 310} 1300)`} />
        {!under && <ellipse cx={pos.x} cy={pos.y} rx={250} ry={250} fill="url(#btCool)" opacity={0.75 * screen * flick} />}
        {under && <ellipse cx={pos.x} cy={pos.y + 44} rx={150} ry={90} fill="url(#btCool)" opacity={0.6 * screen} />}
        {l > 0 && <ellipse cx={LAPTOP.x + 14} cy={LAPTOP.y - 150} rx={300} ry={200} fill="url(#btCool)" opacity={0.5 * l} />}
        {lamp > 0 && <ellipse cx={1046} cy={902} rx={420} ry={420} fill="url(#btLamp)" opacity={lamp} />}
        {heat > 0 && <ellipse cx={pos.x} cy={pos.y} rx={70 + 150 * heat} ry={70 + 150 * heat} fill="url(#btHot)" opacity={Math.min(1, heat * 1.15) * (0.88 + 0.12 * noise1(t * 0.25, 9))} />}
      </g>
      {!under && phone}
      {heat > 0 && !under && (
        <g transform={`translate(${pos.x} ${pos.y}) rotate(${pos.r})`} style={{ mixBlendMode: "screen" }}>
          <rect x={-23} y={-49} width={46} height={98} rx={10} fill={REAL.fireOrange} opacity={0.4 * heat} />
        </g>
      )}
    </g>
  );
};
