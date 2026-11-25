import React from "react";
import { C, REAL, noise1, rand } from "../fk/theme";
import { Smoke } from "../shop/fx";

/**
 * A modern compact electric SUV in side view, nose to the left (world = frame coordinates, 190 px = 1 m).
 * 4.0 m long, 1.63 m tall, 2.46 m wheelbase, 17-inch wheels: high bonnet, raked screen, rising belt line,
 * blacked-out pillars under a floating roof, black cladding with a silver skid, a closed EV nose with a
 * full-width light bar and a charge port on the front wing. Pearl white. No badge: it is a generic car.
 * `xray` opens the body to show what an owner never sees: the floor battery pack (8 modules), the
 * front motor and inverter and the orange high-voltage cable. `heat` warms one module (HOT).
 * `sentinel` fits the Sentinel: a sensor module per zone, a steel cylinder in the boot, braided hoses.
 */
export const GROUND = 1300;
export const WHEELS = [318, 786];
export const PACK = { x0: 418, x1: 688, y0: 1190, y1: 1238 };
export const HOT = { x: 620, y: 1214 };
export const PORT = { x: 290, y: 1128 };
export const ZONES = {
  motor: { x: 250, y: 1150 },
  battery: { x: 552, y: 1182 },
  cabin: { x: 560, y: 1020 },
};

export type CarProps = {
  t: number;
  xray?: number;
  heat?: number;
  lights?: number;
  charging?: number;
  sentinel?: number;
  sense?: number;
  mist?: number;
  smoke?: number;
  accent?: number; // gold hairline along the protected floor
  wheel?: number;
  glow?: number; // faint unexplained warmth under the floor (hook)
};

const BODY =
  "M160 1250 L152 1196 Q150 1150 166 1122 Q240 1094 332 1082 L452 988 Q560 968 690 974 Q770 980 806 998 L866 1062 Q900 1080 908 1108 Q916 1150 914 1204 L904 1250 L874 1250 A88 88 0 0 0 698 1250 L406 1250 A88 88 0 0 0 230 1250 Z";

const Wheel: React.FC<{ cx: number; angle: number }> = ({ cx, angle }) => {
  const cy = 1232;
  return (
    <g>
      <ellipse cx={cx} cy={GROUND + 2} rx={66} ry={7} fill="#000" opacity={0.7} />
      <circle cx={cx} cy={cy} r={68} fill="url(#evTyre)" />
      <circle cx={cx} cy={cy} r={61} fill="none" stroke="#24272b" strokeWidth={3} />
      <circle cx={cx} cy={cy} r={49} fill="#0b0c0d" />
      <g transform={`rotate(${angle} ${cx} ${cy})`}>
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={a} transform={`rotate(${a} ${cx} ${cy})`}>
            <path d={`M${cx - 8} ${cy - 8} L${cx - 19} ${cy - 47} L${cx - 3} ${cy - 47} L${cx} ${cy - 14} L${cx + 3} ${cy - 47} L${cx + 19} ${cy - 47} L${cx + 8} ${cy - 8} Z`} fill="url(#evAlloy)" />
            <path d={`M${cx - 15} ${cy - 44} L${cx - 6} ${cy - 44} L${cx - 3} ${cy - 16} Z`} fill="#15171a" opacity={0.55} />
          </g>
        ))}
      </g>
      <circle cx={cx} cy={cy} r={48.5} fill="none" stroke="url(#evAlloy)" strokeWidth={4} />
      <circle cx={cx} cy={cy} r={11} fill="url(#evAlloy)" stroke="#3a3f46" strokeWidth={1.5} />
      <ellipse cx={cx - 14} cy={cy - 22} rx={16} ry={6} fill="#fff" opacity={0.1} transform={`rotate(-32 ${cx - 14} ${cy - 22})`} />
    </g>
  );
};

/** A Sentinel sensor module: small brushed-steel capsule with one black lens. */
const Module: React.FC<{ x: number; y: number; t: number; on?: number }> = ({ x, y, t, on = 0 }) => (
  <g>
    <rect x={x - 17} y={y - 9} width={34} height={18} rx={9} fill="url(#evAlloy)" stroke="#5a6068" strokeWidth={1} />
    <circle cx={x - 4} cy={y} r={5.4} fill="#0b0b0c" />
    <circle cx={x - 5.4} cy={y - 1.4} r={1.4} fill="#fff" opacity={0.6} />
    <circle cx={x + 9} cy={y} r={2.2} fill={on > 0 ? REAL.lampRed : "#3BEA6A"} opacity={on > 0 ? 1 : 0.6 + 0.4 * Math.sin(t * 0.1 + x)} />
  </g>
);

export const Car: React.FC<CarProps> = ({ t, xray = 0, heat = 0, lights = 0.6, charging = 0, sentinel = 0, sense = 0, mist = 0, smoke = 0, accent = 0, wheel = 0, glow = 0 }) => {
  const shell = 1 - xray * 0.86;
  const hf = heat * (0.85 + 0.15 * noise1(t * 0.5, 4));
  const cells = Array.from({ length: 6 }, (_, i) => PACK.x0 + 4 + i * 44.6);
  const hotI = 4;
  return (
    <g>
      <defs>
        <linearGradient id="evBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbfcfd" />
          <stop offset="0.35" stopColor="#dfe4e8" />
          <stop offset="0.7" stopColor="#a9b1b8" />
          <stop offset="1" stopColor="#5f676e" />
        </linearGradient>
        <linearGradient id="evGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2c3a4a" />
          <stop offset="0.5" stopColor="#0f151c" />
          <stop offset="1" stopColor="#06090c" />
        </linearGradient>
        <radialGradient id="evTyre">
          <stop offset="0.6" stopColor="#0c0d0e" />
          <stop offset="0.92" stopColor="#1d2023" />
          <stop offset="1" stopColor="#0a0b0c" />
        </radialGradient>
        <linearGradient id="evAlloy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1f3f5" />
          <stop offset="0.5" stopColor="#aab1b8" />
          <stop offset="1" stopColor="#5d646b" />
        </linearGradient>
        <radialGradient id="evHot">
          <stop offset="0" stopColor={REAL.fireCore} stopOpacity="1" />
          <stop offset="0.3" stopColor={REAL.fireYellow} stopOpacity="0.9" />
          <stop offset="0.65" stopColor={REAL.fireOrange} stopOpacity="0.5" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="evGlow">
          <stop offset="0" stopColor={REAL.fireYellow} stopOpacity="1" />
          <stop offset="0.4" stopColor={REAL.fireOrange} stopOpacity="0.8" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="evBeam" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#EAF4FF" stopOpacity="0.5" />
          <stop offset="1" stopColor="#EAF4FF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="evClip">
          <path d={BODY} />
        </clipPath>
        <filter id="evSoft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* contact shadow and the faint warmth under the floor */}
      <ellipse cx={540} cy={GROUND + 4} rx={420} ry={16} fill="#000" opacity={0.75} />

      {/* ---------- what is under the skin (seen in x-ray) ---------- */}
      {xray > 0 && (
        <g opacity={xray}>
          {/* cabin: two rows of seats, wheel */}
          {[462, 630].map((sx) => (
            <g key={sx}>
              <path d={`M${sx + 44} 1052 q14 0 14 16 l8 86 h-28 z`} fill="#39424b" />
              <rect x={sx - 34} y={1146} width={96} height={24} rx={9} fill="#39424b" />
              <rect x={sx + 42} y={1028} width={24} height={28} rx={8} fill="#4a545e" />
            </g>
          ))}
          <ellipse cx={412} cy={1098} rx={8} ry={30} fill="none" stroke="#5a646e" strokeWidth={5} transform="rotate(-24 412 1098)" />
          {/* front motor + inverter */}
          <rect x={190} y={1140} width={96} height={50} rx={8} fill="#39424b" stroke="#6b7682" strokeWidth={2} />
          <circle cx={318} cy={1202} r={30} fill="#2d353d" stroke="#6b7682" strokeWidth={2} />
          <rect x={200} y={1148} width={74} height={10} rx={3} fill="#55606b" />
          {/* high-voltage cable: orange in every real EV */}
          <path d={`M286 1166 C 330 1166, 360 1214, ${PACK.x0} 1214`} stroke="#FF8A1E" strokeWidth={6} fill="none" strokeLinecap="round" />
          {/* the floor battery pack */}
          <rect x={PACK.x0 - 6} y={PACK.y0 - 6} width={PACK.x1 - PACK.x0 + 12} height={PACK.y1 - PACK.y0 + 12} rx={8} fill="#161b21" stroke="#7b8792" strokeWidth={2.5} />
          {cells.map((cx, i) => (
            <g key={i}>
              <rect x={cx} y={PACK.y0} width={39} height={PACK.y1 - PACK.y0} rx={4} fill="#2a3644" stroke="#46566a" strokeWidth={1.2} />
              <rect x={cx + 5} y={PACK.y0 + 5} width={29} height={4} rx={2} fill="#6f8296" opacity={0.7} />
              <rect x={cx + 5} y={PACK.y0 + 14} width={29} height={24} rx={2} fill="#1d2630" />
            </g>
          ))}
        </g>
      )}
      {/* the warming module (real heat colours) */}
      {heat > 0 && xray > 0 && (
        <g opacity={xray}>
          <rect x={cells[hotI]} y={PACK.y0} width={39} height={PACK.y1 - PACK.y0} rx={4} fill={REAL.fireOrange} opacity={0.75 * hf} />
          <ellipse cx={HOT.x} cy={HOT.y} rx={30 + 70 * hf} ry={20 + 34 * hf} fill="url(#evHot)" opacity={hf} style={{ mixBlendMode: "screen" }} />
        </g>
      )}

      {/* ---------- the body shell ---------- */}
      <g opacity={shell}>
        <path d={BODY} fill="url(#evBody)" />
        <g clipPath="url(#evClip)">
          {/* crisp shoulder line with the light on it, darker flank below */}
          <path d="M166 1126 Q260 1104 345 1094 L800 1070 L908 1112 L914 1150 Q520 1130 160 1168 Z" fill="#fff" opacity={0.2} />
          <path d="M152 1170 Q520 1134 916 1154 L916 1260 L150 1260 Z" fill="#000" opacity={0.1} />
          {/* black lower cladding, silver skid, sill line */}
          <path d="M150 1212 L916 1206 L916 1260 L150 1260 Z" fill="#0d0e10" />
          <path d="M150 1213 L916 1207" stroke="#34383d" strokeWidth={2} />
          <rect x={420} y={1238} width={264} height={10} rx={3} fill="#9aa1a8" opacity={0.8} />
        </g>
        {/* glasshouse: front and rear door glass, quarter glass, all under a black roof band */}
        <path d="M356 1086 L454 996 Q520 982 584 980 L584 1078 Z" fill="url(#evGlass)" />
        <path d="M598 980 Q690 978 742 990 L792 1038 L790 1070 L598 1078 Z" fill="url(#evGlass)" />
        <path d="M802 1040 L850 1062 L806 1068 Z" fill="url(#evGlass)" />
        <path d="M342 1084 L446 986 L458 988 L358 1086 Z" fill="#0b0d10" />
        <path d="M584 980 h14 v98 h-14 z" fill="#0b0d10" />
        <path d="M742 990 L806 998 L866 1062 L850 1062 L792 1038 Z" fill="#0b0d10" />
        <path d="M452 988 Q560 968 690 974 Q770 980 806 998 L742 990 Q690 978 598 980 L584 980 Q520 982 454 996 Z" fill="#0b0d10" />
        <path d="M380 1076 L462 1002 L498 996 L414 1076 Z" fill="#fff" opacity={0.08} />
        <path d="M616 1072 L652 986 L684 984 L648 1072 Z" fill="#fff" opacity={0.06} />
        {/* roof rail */}
        <path d="M470 976 Q580 962 760 976" stroke="#c9ced3" strokeWidth={4} fill="none" strokeLinecap="round" />
        {/* door seams, handles, mirror */}
        <path d="M591 1080 L591 1212 M352 1090 Q346 1150 352 1212 M790 1072 Q812 1140 800 1212" stroke="#737b82" strokeWidth={1.6} fill="none" opacity={0.7} />
        {[528, 734].map((hx) => (
          <rect key={hx} x={hx} y={1104} width={44} height={9} rx={4.5} fill="#8f979e" />
        ))}
        <path d="M344 1076 q-26 -6 -32 10 q0 12 16 12 h18 z" fill="#111315" />
        {/* wheel-arch cladding */}
        {WHEELS.map((wx) => (
          <path key={wx} d={`M${wx + 88} 1250 A88 88 0 0 0 ${wx - 88} 1250`} stroke="#0d0e10" strokeWidth={20} fill="none" />
        ))}
        {/* closed EV nose: light bar, lower lamp, intake; tail lamp bar */}
        <path d="M156 1136 Q160 1126 170 1122 L236 1104 L238 1112 L172 1132 Q162 1136 160 1146 Z" fill="#EAF4FF" opacity={0.3 + 0.7 * lights} />
        <rect x={156} y={1158} width={26} height={20} rx={5} fill="#EAF4FF" opacity={0.2 + 0.5 * lights} />
        <rect x={154} y={1192} width={38} height={30} rx={6} fill="#0b0c0d" />
        <path d="M878 1078 Q904 1090 908 1112 L896 1116 Q890 1098 868 1088 Z" fill={REAL.tailRed} opacity={0.5 + 0.5 * lights} />
        {/* charge port on the front wing */}
        <circle cx={PORT.x} cy={PORT.y} r={15} fill={charging > 0 ? "#0b0c0d" : "#d5dadf"} stroke="#8f979e" strokeWidth={1.5} />
        {/* rim light along the top edges: the key light is above */}
        <path d="M166 1122 Q240 1094 332 1082" stroke="#fff" strokeWidth={2.6} fill="none" opacity={0.85} />
        <path d="M452 988 Q560 968 690 974 Q770 980 806 998" stroke="#fff" strokeWidth={2} fill="none" opacity={0.35} />
      </g>
      {/* x-ray keeps a hairline of the body so the car still reads */}
      {xray > 0 && <path d={BODY} fill="none" stroke="#c9d2da" strokeWidth={2.4} opacity={xray * 0.8} />}

      {WHEELS.map((wx) => (
        <Wheel key={wx} cx={wx} angle={wheel} />
      ))}

      {/* lamp glow and beam */}
      {lights > 0 && (
        <g style={{ mixBlendMode: "screen" }} opacity={lights}>
          <polygon points="160,1122 160,1150 -200,1290 -200,1060" fill="url(#evBeam)" opacity={0.5} />
          <ellipse cx={186} cy={1124} rx={56} ry={22} fill="#EAF4FF" opacity={0.35} filter="url(#evSoft)" />
          <ellipse cx={896} cy={1098} rx={30} ry={24} fill={REAL.tailRed} opacity={0.4} filter="url(#evSoft)" />
        </g>
      )}

      {/* charging: cable off to the left, pulsing green ring */}
      {charging > 0 && (
        <g opacity={charging}>
          <path d={`M${PORT.x - 8} ${PORT.y + 4} C ${PORT.x - 70} ${PORT.y + 90}, 150 1290, 60 1210`} stroke="#15171a" strokeWidth={11} fill="none" strokeLinecap="round" />
          <path d={`M${PORT.x - 8} ${PORT.y + 4} C ${PORT.x - 70} ${PORT.y + 90}, 150 1290, 60 1210`} stroke="#3a3f45" strokeWidth={2} fill="none" strokeLinecap="round" />
          <rect x={PORT.x - 22} y={PORT.y - 10} width={30} height={22} rx={6} fill="#1b1e22" stroke="#4a5058" strokeWidth={1.5} />
          <circle cx={PORT.x + 2} cy={PORT.y} r={17} fill="none" stroke="#35E06A" strokeWidth={3} opacity={0.5 + 0.5 * Math.sin(t * 0.14)} />
          <circle cx={PORT.x + 2} cy={PORT.y} r={30} fill="#35E06A" opacity={0.12 + 0.1 * Math.sin(t * 0.14)} />
        </g>
      )}

      {/* ---------- the Sentinel ---------- */}
      {sentinel > 0 && (
        <g opacity={sentinel}>
          {/* braided hoses from the cylinder to each zone */}
          <path d={`M800 1160 C 760 1166, 720 1178, ${ZONES.battery.x + 96} 1180 M800 1156 C 690 1130, 420 1132, ${ZONES.motor.x + 20} ${ZONES.motor.y - 8} M816 1148 C 790 1070, 660 1024, ${ZONES.cabin.x + 18} ${ZONES.cabin.y - 6}`} stroke="#d9dee3" strokeWidth={3} fill="none" strokeDasharray="5 3" opacity={0.85} />
          {/* stainless cylinder in the boot floor */}
          <rect x={794} y={1148} width={86} height={24} rx={12} fill="url(#evAlloy)" stroke="#5a6068" strokeWidth={1.2} />
          <rect x={794} y={1148} width={86} height={5} rx={2.5} fill="#fff" opacity={0.6} />
          <rect x={834} y={1146} width={6} height={28} fill="#6b727a" />
          {/* nozzles over the pack */}
          {[480, 630].map((nx) => (
            <polygon key={nx} points={`${nx - 6},1174 ${nx + 6},1174 ${nx + 4},1186 ${nx - 4},1186`} fill="#c9ced3" />
          ))}
          <path d={`M480 1178 L648 1178`} stroke="#d9dee3" strokeWidth={3} strokeDasharray="5 3" opacity={0.85} />
          <Module x={ZONES.battery.x} y={ZONES.battery.y - 6} t={t} on={mist} />
          <Module x={ZONES.motor.x} y={ZONES.motor.y - 16} t={t} />
          <Module x={ZONES.cabin.x} y={ZONES.cabin.y - 10} t={t} />
        </g>
      )}
      {sense > 0 &&
        sentinel > 0 &&
        [
          [ZONES.battery.x, ZONES.battery.y, 130, 48],
          [ZONES.motor.x, ZONES.motor.y - 10, 64, 56],
          [ZONES.cabin.x, ZONES.cabin.y, 120, 110],
        ].map(([x, y, w, h], i) => {
          const ph = (t * 0.03 + i / 3) % 1;
          return <ellipse key={i} cx={x} cy={y + h * 0.5 * ph + 6} rx={12 + w * ph} ry={5 + h * 0.5 * ph} fill="none" stroke="#E9F3FA" strokeWidth={2.2} opacity={sense * sentinel * (1 - ph) * 0.7} />;
        })}
      {mist > 0 && (
        <g opacity={Math.min(1, mist * 1.5)}>
          <rect x={PACK.x0 - 4} y={1180} width={PACK.x1 - PACK.x0 + 8} height={62} rx={10} fill="#E9F3FA" opacity={0.42} filter="url(#evSoft)" />
          {Array.from({ length: 70 }).map((_, i) => {
            const s = i * 1.37;
            const a = (t * 0.04 * (0.6 + rand(s) * 0.7) + rand(s + 1)) % 1;
            const nx = i % 2 ? 630 : 480;
            const dir = (rand(s + 2) - 0.5) * 2;
            return <circle key={i} cx={nx + dir * 110 * a * Math.min(1, mist * 1.3)} cy={1186 + a * 46 * (0.5 + rand(s + 3))} r={2 + rand(s + 4) * 2.2} fill="#F4FAFF" opacity={0.95 * (1 - a * 0.6)} />;
          })}
        </g>
      )}
      {accent > 0 && <path d={`M${PACK.x0 - 6} 1258 L${PACK.x1 + 6} 1258`} stroke={C.gold} strokeWidth={4} strokeLinecap="round" opacity={accent * (0.6 + 0.4 * Math.sin(t * 0.12))} />}

      {glow > 0 && (
        <g style={{ mixBlendMode: "screen" }} opacity={Math.min(1, glow * (0.8 + 0.2 * Math.sin(t * 0.16)))}>
          <ellipse cx={HOT.x - 30} cy={GROUND - 22} rx={250} ry={54} fill="url(#evGlow)" />
          <ellipse cx={HOT.x - 30} cy={GROUND + 30} rx={300} ry={46} fill="url(#evGlow)" opacity={0.6} />
        </g>
      )}

      <Smoke id="evSmoke" t={t} amount={smoke} emit={[{ x: HOT.x, y: GROUND - 16, w: 160 }]} rise={420} size={56} tone="#6e6f72" />
    </g>
  );
};
