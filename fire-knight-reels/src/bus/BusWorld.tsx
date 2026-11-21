import React from "react";
import { REAL, rand } from "../fk/theme";
import { Bus, BusProps, GROUND } from "./Bus";

/** Bus placement in world (frame) coordinates. */
export const BUS = { x: -60, y: 900 };
export const ROAD_Y = BUS.y + GROUND; // 1282

/** Night highway around the coach: dark sky, distant town lights, sodium poles, lane dashes. */
export const BusWorld: React.FC<BusProps & { scroll?: number; poles?: number }> = ({ scroll = 0, poles = 1, ...bus }) => (
  <g>
    <defs>
      <linearGradient id="bwSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#020203" />
        <stop offset="0.75" stopColor="#0b0e11" />
        <stop offset="1" stopColor="#141a1f" />
      </linearGradient>
      <linearGradient id="bwRoad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1b1d1f" />
        <stop offset="1" stopColor="#070808" />
      </linearGradient>
      <radialGradient id="bwPole">
        <stop offset="0" stopColor={REAL.sodium} stopOpacity="0.55" />
        <stop offset="1" stopColor={REAL.sodium} stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x={-1500} y={-600} width={4000} height={ROAD_Y + 600} fill="url(#bwSky)" />
    {/* distant town lights (slow parallax) */}
    <g transform={`translate(${-((scroll * 0.08) % 1400)} 0)`}>
      {Array.from({ length: 80 }).map((_, i) => (
        <circle key={i} cx={-1500 + (i * 97) % 4200} cy={ROAD_Y - 160 - rand(i) * 60} r={1.4 + rand(i + 3) * 1.6} fill={rand(i + 7) > 0.5 ? REAL.sodium : "#d8e6f0"} opacity={0.25 + rand(i + 9) * 0.35} />
      ))}
      <rect x={-1500} y={ROAD_Y - 120} width={5600} height={120} fill="#07090b" />
    </g>
    {/* road */}
    <rect x={-1500} y={ROAD_Y} width={4000} height={900} fill="url(#bwRoad)" />
    <rect x={-1500} y={ROAD_Y} width={4000} height={3} fill="#3a3d40" />
    <g transform={`translate(${-((scroll) % 220)} 0)`}>
      {Array.from({ length: 22 }).map((_, i) => (
        <rect key={i} x={-1500 + i * 220} y={ROAD_Y + 120} width={110} height={8} fill="#d9d9d9" opacity={0.4} />
      ))}
    </g>
    {/* sodium poles on the far side */}
    {poles > 0 && (
      <g transform={`translate(${-((scroll * 0.6) % 900)} 0)`} opacity={poles}>
        {Array.from({ length: 6 }).map((_, i) => {
          const x = -1200 + i * 900;
          return (
            <g key={i}>
              <rect x={x} y={ROAD_Y - 520} width={6} height={520} fill="#15181b" />
              <path d={`M${x + 3} ${ROAD_Y - 520} q 4 -20 46 -18`} stroke="#15181b" strokeWidth={5} fill="none" />
              <rect x={x + 38} y={ROAD_Y - 542} width={26} height={8} rx={3} fill="#2a2e33" />
              <circle cx={x + 50} cy={ROAD_Y - 534} r={130} fill="url(#bwPole)" />
              <ellipse cx={x + 60} cy={ROAD_Y + 30} rx={260} ry={30} fill={REAL.sodium} opacity={0.08} />
            </g>
          );
        })}
      </g>
    )}
    <g transform={`translate(${BUS.x} ${BUS.y})`}>
      <Bus {...bus} />
    </g>
    {/* soft road reflection of the cabin glow */}
    <rect x={BUS.x + 150} y={ROAD_Y + 6} width={860} height={40} fill="#ffcf8a" opacity={0.05 * (bus.cabinLight ?? 0.7)} />
  </g>
);
