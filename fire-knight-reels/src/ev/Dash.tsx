import React from "react";
import { C } from "../fk/theme";

/**
 * The car's driver display, close (world = frame coordinates): a wide screen in a dark binnacle, the top
 * of the steering wheel below it. It shows what the car tells you: battery percentage, range, charging
 * status. `hl` spotlights one of them (0 battery, 1 range, 2 charging; -1 none). Values are illustrative.
 */
export const DASH = { battery: { x: 300, y: 1010 }, range: { x: 610, y: 950 }, charging: { x: 700, y: 1090 } };

export const Dash: React.FC<{ t: number; hl?: number; on?: number }> = ({ t, hl = -1, on = 1 }) => {
  const o = (i: number) => (hl < 0 ? 1 : hl === i ? 1 : 0.32);
  const pct = 82;
  const R = 108;
  const circ = 2 * Math.PI * R;
  return (
    <g>
      <defs>
        <linearGradient id="dsBin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1e22" />
          <stop offset="1" stopColor="#0a0b0d" />
        </linearGradient>
        <linearGradient id="dsScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0d1420" />
          <stop offset="1" stopColor="#05080d" />
        </linearGradient>
        <radialGradient id="dsGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(540 1030) scale(760 520)">
          <stop offset="0" stopColor="#6FB4FF" stopOpacity="0.22" />
          <stop offset="1" stopColor="#6FB4FF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dsWheel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3f45" />
          <stop offset="1" stopColor="#0e0f11" />
        </linearGradient>
      </defs>
      {/* windscreen dark, dashboard top, binnacle */}
      <rect x={-400} y={300} width={1880} height={520} fill="#04060a" />
      <path d="M-400 800 Q540 730 1480 800 L1480 1920 L-400 1920 Z" fill="#0c0d0f" />
      <path d="M-400 800 Q540 730 1480 800" stroke="#2a2e33" strokeWidth={3} fill="none" />
      <rect x={60} y={820} width={960} height={430} rx={46} fill="url(#dsBin)" />
      <rect x={60} y={820} width={960} height={6} rx={3} fill="#fff" opacity={0.12} />
      <rect x={92} y={852} width={896} height={366} rx={28} fill="url(#dsScreen)" opacity={on} />
      <rect x={-400} y={300} width={1880} height={1620} fill="url(#dsGlow)" style={{ mixBlendMode: "screen" }} opacity={on} />

      <g opacity={on}>
        {/* battery ring */}
        <g opacity={o(0)}>
          <circle cx={DASH.battery.x} cy={DASH.battery.y + 26} r={R} fill="none" stroke="#1d2938" strokeWidth={20} />
          <circle
            cx={DASH.battery.x}
            cy={DASH.battery.y + 26}
            r={R}
            fill="none"
            stroke="#35E06A"
            strokeWidth={20}
            strokeLinecap="round"
            strokeDasharray={`${(circ * pct) / 100} ${circ}`}
            transform={`rotate(-90 ${DASH.battery.x} ${DASH.battery.y + 26})`}
          />
          <text x={DASH.battery.x} y={DASH.battery.y + 46} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={700} fontSize={78} fill="#F4F8FF" letterSpacing={-2}>
            {pct}
            <tspan fontSize={40} dx={4}>
              %
            </tspan>
          </text>
          <text x={DASH.battery.x} y={DASH.battery.y + 86} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={600} fontSize={22} fill="#8fa3b8" letterSpacing={3}>
            BATTERY
          </text>
        </g>
        {/* range */}
        <g opacity={o(1)}>
          <text x={470} y={DASH.range.y - 34} fontFamily="FK DM Sans" fontWeight={600} fontSize={24} fill="#8fa3b8" letterSpacing={3}>
            RANGE
          </text>
          <text x={470} y={DASH.range.y + 54} fontFamily="FK DM Sans" fontWeight={700} fontSize={98} fill="#F4F8FF" letterSpacing={-3}>
            312
            <tspan fontSize={40} dx={10} fill="#8fa3b8" fontWeight={600}>
              km
            </tspan>
          </text>
        </g>
        <rect x={470} y={1036} width={480} height={2} fill="#1d2938" />
        {/* charging status */}
        <g opacity={o(2)}>
          <path d="M486 1066 l-14 28 h14 l-6 26 l24 -34 h-14 l8 -20 z" fill="#35E06A" opacity={0.7 + 0.3 * Math.sin(t * 0.14)} />
          <text x={524} y={1094} fontFamily="FK DM Sans" fontWeight={700} fontSize={42} fill="#F4F8FF" letterSpacing={-1}>
            Charging
          </text>
          <text x={524} y={1132} fontFamily="FK DM Sans" fontWeight={600} fontSize={24} fill="#8fa3b8" letterSpacing={2}>
            7.2 kW · AC
          </text>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect key={i} x={760 + i * 24} y={1080} width={16} height={40} rx={4} fill="#35E06A" opacity={i < 6 ? 0.9 : ((t * 0.05) % 1 > 0.5 ? 0.7 : 0.15)} />
          ))}
        </g>
        <text x={118} y={1196} fontFamily="FK DM Sans" fontWeight={600} fontSize={22} fill="#5d7086" letterSpacing={3}>
          P · READY
        </text>
      </g>
      {/* steering wheel top */}
      <path d="M120 1920 Q140 1330 540 1320 Q940 1330 960 1920" stroke="url(#dsWheel)" strokeWidth={86} fill="none" />
      <path d="M150 1900 Q170 1368 540 1358 Q910 1368 930 1900" stroke="#fff" strokeWidth={2} fill="none" opacity={0.1} />
      <rect x={-400} y={1500} width={1880} height={420} fill={C.black} opacity={0.5} />
    </g>
  );
};
