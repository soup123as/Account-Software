import React from "react";
import { C, REAL } from "../fk/theme";

/**
 * A two-bedroom flat at night, seen as a plan from above (about 1 px = 1.1 cm), lights off.
 * `points` 0..5 lights the things on charge around the home, one by one: the phone by the pillow,
 * a second phone on the other side, a tablet on the child's bed, a laptop on the sofa, a power bank
 * by the TV. `nights` 0..7 lights the row of nights underneath (the week), then it keeps cycling.
 */
export const PLAN = { x0: 130, x1: 950, y0: 820, y1: 1330 };
export const POINTS = [
  { x: 214, y: 916, w: 12, h: 24, r: -12 },
  { x: 318, y: 912, w: 12, h: 24, r: 8 },
  { x: 664, y: 960, w: 26, h: 36, r: 14 },
  { x: 250, y: 1206, w: 44, h: 30, r: -10 },
  { x: 548, y: 1296, w: 14, h: 26, r: 80 },
];
const WALL = "#6a717c";
const F = "#2b3038"; // furniture fill
const FS = "#4a515b"; // furniture outline

const Furn: React.FC<{ d?: string; children?: React.ReactNode }> = ({ children }) => (
  <g fill={F} stroke={FS} strokeWidth={1.6}>
    {children}
  </g>
);

export const FlatPlan: React.FC<{ t: number; points?: number; nights?: number }> = ({ t, points = 0, nights = 0 }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const TW = 104;
  const GAP = (PLAN.x1 - PLAN.x0 - 7 * TW) / 6;
  const NY = 1392;
  return (
    <g>
      <defs>
        <radialGradient id="fpWarm">
          <stop offset="0" stopColor={REAL.fireYellow} stopOpacity="0.85" />
          <stop offset="0.4" stopColor={REAL.fireOrange} stopOpacity="0.4" />
          <stop offset="1" stopColor={REAL.fireOrange} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fpFloor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1c2026" />
          <stop offset="1" stopColor="#13161a" />
        </linearGradient>
        <pattern id="fpTile" width="38" height="38" patternUnits="userSpaceOnUse">
          <path d="M38 0 H0 V38" stroke="#1c2026" strokeWidth="1" fill="none" />
        </pattern>
        <filter id="fpBlur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {/* floor */}
      <rect x={PLAN.x0} y={PLAN.y0} width={PLAN.x1 - PLAN.x0} height={PLAN.y1 - PLAN.y0} fill="url(#fpFloor)" />
      <rect x={760} y={820} width={190} height={510} fill="url(#fpTile)" />

      {/* master bedroom */}
      <Furn>
        <rect x={168} y={846} width={196} height={204} rx={8} />
        <rect x={180} y={856} width={78} height={44} rx={12} fill="#2f343c" />
        <rect x={274} y={856} width={78} height={44} rx={12} fill="#2f343c" />
        <path d="M168 930 H364" />
        <rect x={140} y={850} width={24} height={34} rx={4} />
        <rect x={368} y={850} width={24} height={34} rx={4} />
        <rect x={428} y={900} width={42} height={170} rx={3} />
        <path d="M428 985 H470" />
      </Furn>
      {/* second bedroom */}
      <Furn>
        <rect x={622} y={846} width={120} height={200} rx={8} />
        <rect x={634} y={856} width={96} height={42} rx={12} fill="#2f343c" />
        <path d="M622 928 H742" />
        <rect x={496} y={836} width={104} height={50} rx={4} />
        <circle cx={548} cy={912} r={17} />
        <rect x={496} y={1010} width={90} height={56} rx={3} />
      </Furn>
      {/* bath */}
      <Furn>
        <rect x={890} y={836} width={48} height={34} rx={10} />
        <ellipse cx={914} cy={884} rx={17} ry={20} />
        <rect x={776} y={836} width={52} height={36} rx={8} />
        <circle cx={802} cy={854} r={9} fill="#14171b" />
        <rect x={776} y={916} width={80} height={54} rx={4} />
      </Furn>
      {/* kitchen */}
      <Furn>
        <path d="M898 996 H938 V1318 H776 V1276 H898 Z" />
        <circle cx={918} cy={1056} r={11} fill="#14171b" />
        <circle cx={918} cy={1092} r={11} fill="#14171b" />
        <rect x={904} y={1150} width={28} height={50} rx={4} fill="#14171b" />
        <rect x={776} y={996} width={58} height={62} rx={5} />
      </Furn>
      {/* living and dining */}
      <Furn>
        <path d="M160 1118 H206 V1262 H400 V1308 H160 Z" />
        <path d="M172 1130 H194 V1274 H388 V1296 H172 Z" fill="#2f343c" />
        <rect x={258} y={1150} width={110} height={70} rx={8} />
        <rect x={452} y={1304} width={190} height={16} rx={3} />
        <rect x={476} y={1296} width={142} height={7} rx={2} fill="#3d434c" />
        <circle cx={652} cy={1196} r={50} />
        {[0, 1, 2, 3].map((i) => {
          const a = (i * Math.PI) / 2 + 0.6;
          return <rect key={i} x={652 + Math.cos(a) * 68 - 14} y={1196 + Math.sin(a) * 68 - 14} width={28} height={28} rx={7} />;
        })}
      </Furn>

      {/* walls, with door openings */}
      <g stroke={WALL} strokeWidth={11} strokeLinecap="square" fill="none">
        <path d={`M${PLAN.x0} ${PLAN.y0} H${PLAN.x1} V${PLAN.y1} H410 M330 ${PLAN.y1} H${PLAN.x0} V${PLAN.y0}`} />
        <path d="M480 820 V900 M480 970 V1080 M130 1080 H300 M370 1080 H560 M630 1080 H760" />
        <path d="M760 820 V980 H820 M890 980 H950 M760 980 V1120 M760 1200 V1330" />
      </g>
      <g stroke="#7b828d" strokeWidth={1.6} fill="none" opacity={0.7}>
        <path d="M300 1080 a70 70 0 0 1 70 70" />
        <path d="M560 1080 a70 70 0 0 0 70 70" />
        <path d="M330 1330 a80 80 0 0 1 80 -80" />
        <path d="M820 980 a70 70 0 0 0 70 -70" />
      </g>
      {/* windows */}
      <g stroke="#9fb9d8" strokeWidth={4} opacity={0.7}>
        <path d="M200 820 H330 M560 820 H680 M130 1160 V1260 M950 1100 V1220" />
      </g>

      {/* the things on charge */}
      {POINTS.map((p, i) => {
        const on = Math.max(0, Math.min(1, points - i));
        if (on <= 0) return null;
        const pulse = 0.75 + 0.25 * Math.sin(t * 0.2 + i * 1.7);
        return (
          <g key={i}>
            <g style={{ mixBlendMode: "screen" }}>
              <circle cx={p.x} cy={p.y} r={(34 + 26 * pulse) * (1.6 - 0.6 * on)} fill="url(#fpWarm)" opacity={on * (0.75 + 0.25 * pulse)} />
            </g>
            <circle cx={p.x} cy={p.y} r={30 + ((t * 0.9 + i * 13) % 40)} fill="none" stroke={REAL.fireYellow} strokeWidth={1.6} opacity={on * (1 - ((t * 0.9 + i * 13) % 40) / 40) * 0.6} />
            <g transform={`translate(${p.x} ${p.y}) rotate(${p.r}) scale(${1.6 - 0.6 * on})`}>
              <rect x={-p.w / 2} y={-p.h / 2} width={p.w} height={p.h} rx={3} fill="#0b0d10" stroke="#e8edf4" strokeWidth={1.4} />
              <rect x={-p.w / 2 + 2} y={-p.h / 2 + 2} width={p.w - 4} height={p.h - 4} rx={2} fill="#cfe6ff" opacity={0.75} />
            </g>
          </g>
        );
      })}

      {/* the nights */}
      {days.map((d, i) => {
        const on = Math.max(0, Math.min(1, nights - i));
        const x = PLAN.x0 + i * (TW + GAP);
        const cyc = nights >= 7 ? Math.floor((t / 9) % 7) === i : false;
        const lit = on > 0;
        return (
          <g key={d} opacity={0.35 + 0.65 * on}>
            <rect x={x} y={NY} width={TW} height={92} rx={16} fill={lit ? "#12151a" : "#0c0e11"} stroke={cyc ? C.gold : lit ? "rgba(250,250,250,0.3)" : "rgba(250,250,250,0.12)"} strokeWidth={cyc ? 2.4 : 1.4} />
            {/* crescent */}
            <g transform={`translate(${x + TW / 2} ${NY + 34}) scale(${1.3 - 0.3 * on})`}>
              <path d="M6 -15 A16 16 0 1 0 14 9 A12.5 12.5 0 1 1 6 -15 Z" fill={lit ? "#f1e9d2" : "#3a3d42"} />
            </g>
            <text x={x + TW / 2} y={NY + 76} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={600} fontSize={20} letterSpacing="0.14em" fill={lit ? "#c8ccd6" : "#4a4e56"}>
              {d.toUpperCase()}
            </text>
          </g>
        );
      })}
    </g>
  );
};
