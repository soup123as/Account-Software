import React from "react";
import { REAL, ip, noise1 } from "../fk/theme";

/**
 * The stranger who calls at 2 a.m. Drawn at real proportions (7.5 heads, ~1.7 m) in profile,
 * facing left towards the burning shop: phone at his left ear, right arm pointing at the shop.
 * Local units: head top y 0, soles y 1000. Lighting like the truck reel: a warm key from the
 * fire on the left, a cool fill from the phone screen, the back of the figure falls to shadow.
 */
export const CALLER = { x: 600, y: 944, s: 0.756 };

type Mode = "color" | "white" | "black";
const COL = {
  skin: "#8d5c3e",
  skinDark: "#5e3a26",
  hair: "#141110",
  shirt: "#4a5f78",
  collar: "#33465c",
  pants: "#262a30",
  belt: "#141414",
  shoe: "#1c1714",
};

const Shapes: React.FC<{ mode: Mode; point: number }> = ({ mode, point }) => {
  const c = (k: keyof typeof COL) => (mode === "white" ? "#fff" : mode === "black" ? "#000" : COL[k]);
  // far (right) arm: hangs, then lifts to point at the shop
  const elbow = { x: ip(point, [0, 1], [42, -12]), y: ip(point, [0, 1], [305, 258]) };
  const wrist = { x: ip(point, [0, 1], [48, -96]), y: ip(point, [0, 1], [410, 246]) };
  const tip = { x: ip(point, [0, 1], [52, -138]), y: ip(point, [0, 1], [452, 236]) };
  return (
    <g>
      <g transform="translate(92 0) scale(1.38 1) translate(-92 0)">
      {/* far arm, behind the body */}
      <path d={`M48 196 L ${elbow.x} ${elbow.y}`} stroke={c("shirt")} strokeWidth={34} strokeLinecap="round" fill="none" />
      <path d={`M${(48 + elbow.x) / 2 + 2} ${(196 + elbow.y) / 2 + 6} L ${elbow.x} ${elbow.y} L ${wrist.x} ${wrist.y}`} stroke={c("skinDark")} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <ellipse cx={wrist.x - 8} cy={wrist.y} rx={15} ry={13} fill={c("skinDark")} />
      <path d={`M${wrist.x - 16} ${wrist.y - 5} L ${tip.x} ${tip.y - 2}`} stroke={c("skinDark")} strokeWidth={8} strokeLinecap="round" />
      <path d={`M${wrist.x - 12} ${wrist.y + 4} L ${wrist.x - 26} ${wrist.y + 2}`} stroke={c("skinDark")} strokeWidth={7} strokeLinecap="round" />
      {/* back leg */}
      <path d="M100 470 L 150 470 C 156 560, 160 640, 160 720 C 162 800, 168 880, 172 950 L 140 956 C 134 880, 126 800, 122 720 C 116 640, 106 560, 100 470 Z" fill={c("pants")} />
      <path d="M134 952 L 176 948 C 182 962, 184 980, 180 994 L 108 996 C 108 978, 120 960, 134 952 Z" fill={c("shoe")} />
      {/* front leg */}
      <path d="M34 468 L 114 468 C 110 560, 98 640, 90 720 C 84 800, 76 880, 68 950 L 34 952 C 36 880, 40 800, 44 720 C 46 640, 34 560, 34 468 Z" fill={c("pants")} />
      <path d="M26 946 L 72 944 C 76 960, 76 980, 72 994 L -8 996 C -10 978, 6 958, 26 946 Z" fill={c("shoe")} />
      {/* torso: half-sleeve check shirt, worn untucked over the belt */}
      <path d="M54 160 C 36 168, 28 192, 30 222 C 26 262, 30 302, 36 342 C 40 392, 42 432, 38 478 L 148 482 C 148 420, 152 360, 152 300 C 154 242, 152 196, 138 172 C 122 162, 92 158, 54 160 Z" fill={c("shirt")} />
      <path d="M56 160 L 72 196 L 94 164 Z" fill={c("collar")} />
      {/* near arm: sleeve, elbow down, forearm up, hand + phone at the ear */}
      </g>
      {/* neck */}
      <path d="M48 116 L 58 172 L 114 172 L 112 104 Z" fill={c("skin")} />
      {/* near arm: elbow forward and down, forearm up to the ear */}
      <path d="M122 188 L 72 300" stroke={c("skin")} strokeWidth={34} strokeLinecap="round" fill="none" />
      <path d="M122 188 L 96 248" stroke={c("shirt")} strokeWidth={48} strokeLinecap="round" fill="none" />
      <path d="M72 300 L 94 128" stroke={c("skin")} strokeWidth={30} strokeLinecap="round" fill="none" />
      <rect x={80} y={52} width={16} height={64} rx={4} fill={mode === "color" ? "#0e0f11" : c("hair")} />
      <path d="M84 84 C 82 70, 92 62, 104 66 C 114 70, 116 84, 112 100 C 110 112, 104 124, 96 126 C 88 126, 84 110, 84 84 Z" fill={c("skin")} />
      {/* head (profile) */}
      <path
        d="M70 2 C 46 4, 30 14, 26 34 C 24 40, 22 44, 22 48 C 22 52, 25 54, 24 58 C 18 66, 10 72, 8 78 C 8 82, 12 84, 18 84 C 18 88, 14 90, 15 93 C 16 95, 19 96, 19 97 C 15 99, 15 102, 19 104 C 22 106, 24 108, 22 112 C 21 118, 26 124, 36 126 C 52 128, 66 124, 84 108 C 96 100, 108 104, 112 110 C 126 92, 134 64, 128 38 C 122 14, 98 0, 70 2 Z"
        fill={c("skin")}
      />
      {/* hair: short, side parting, sideburn */}
      <path d="M24 38 C 26 12, 50 -6, 80 -4 C 112 -2, 136 24, 132 58 C 130 76, 124 92, 112 106 C 108 96, 102 86, 96 82 C 94 70, 88 60, 80 56 L 72 54 C 62 46, 52 32, 44 30 C 36 30, 30 34, 24 38 Z" fill={c("hair")} />
    </g>
  );
};

export const Caller: React.FC<{ t: number; fire?: number; point?: number; phoneGlow?: number }> = ({ t, fire = 1, point = 1, phoneGlow = 1 }) => {
  const flick = fire * (0.82 + 0.18 * noise1(t * 0.5, 4));
  const breathe = Math.sin(t * 0.08) * 2;
  return (
    <g transform={`translate(${CALLER.x} ${CALLER.y + breathe * 0.3}) scale(${CALLER.s})`}>
      <defs>
        <mask id="clBody" maskUnits="userSpaceOnUse" x={-300} y={-100} width={700} height={1200}>
          <Shapes mode="white" point={point} />
        </mask>
        <mask id="clRim" maskUnits="userSpaceOnUse" x={-300} y={-100} width={700} height={1200}>
          <Shapes mode="white" point={point} />
          <g transform="translate(5 2)">
            <Shapes mode="black" point={point} />
          </g>
        </mask>
        <linearGradient id="clKeyU" gradientUnits="userSpaceOnUse" x1={-160} y1={0} x2={120} y2={0}>
          <stop offset="0" stopColor={REAL.fireOrange} stopOpacity="0.6" />
          <stop offset="0.6" stopColor={REAL.fireOrange} stopOpacity="0.12" />
          <stop offset="1" stopColor={REAL.fireOrange} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="clShadeU" gradientUnits="userSpaceOnUse" x1={20} y1={0} x2={170} y2={0}>
          <stop offset="0" stopColor="#05070b" stopOpacity="0.15" />
          <stop offset="1" stopColor="#05070b" stopOpacity="0.78" />
        </linearGradient>
        <linearGradient id="clDown" gradientUnits="userSpaceOnUse" x1={0} y1={300} x2={0} y2={1000}>
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="clRimU" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={1000}>
          <stop offset="0" stopColor={REAL.fireYellow} />
          <stop offset="1" stopColor={REAL.fireOrange} />
        </linearGradient>
        <radialGradient id="clPhoneU" gradientUnits="userSpaceOnUse" cx={78} cy={86} r={90}>
          <stop offset="0" stopColor="#d7ebff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#d7ebff" stopOpacity="0" />
        </radialGradient>
        <pattern id="clCheck" width="22" height="22" patternUnits="userSpaceOnUse">
          <rect width="22" height="22" fill="none" />
          <rect width="22" height="3" fill="#9fb6cf" opacity="0.28" />
          <rect width="3" height="22" fill="#9fb6cf" opacity="0.28" />
          <rect x="11" width="1.5" height="22" fill="#1d2a38" opacity="0.4" />
        </pattern>
        <filter id="clSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <filter id="clShadowBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* long shadow thrown to the right by the fire */}
      <path d="M-10 996 L 180 996 L 520 1030 L 300 1040 Z" fill="#000" opacity={0.6 * fire} filter="url(#clShadowBlur)" />
      <ellipse cx={90} cy={996} rx={130} ry={12} fill="#000" opacity={0.6} />

      <Shapes mode="color" point={point} />

      {/* detail: shirt check, belt, folds, face features */}
      <g mask="url(#clBody)">
        <rect x={-20} y={150} width={240} height={340} fill="url(#clCheck)" />
                <rect x={0} y={462} width={200} height={10} fill={COL.belt} opacity={0.7} />
        <path d="M44 300 Q 70 320 92 300 M 40 380 Q 80 400 120 384 M 120 210 Q 132 260 128 320" stroke="#000" strokeWidth={4} opacity={0.3} fill="none" />
        <path d="M60 560 Q 72 640 80 700 M 52 740 Q 64 760 82 744 M 130 600 Q 140 660 142 720 M 128 760 Q 140 776 156 764" stroke="#000" strokeWidth={4} opacity={0.35} fill="none" />
      </g>
      <path d="M28 46 Q 37 42 46 45" stroke="#120c08" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d="M31 55 Q 37 52 43 55 Q 37 57.5 31 55 Z" fill="#1a110c" />
      <path d="M13 87 Q 20 85 30 89 L 28 92 Q 20 89 15 91 Z" fill="#1a110c" />
      <path d="M18 100 C 22 118, 40 128, 60 124 C 72 120, 80 112, 86 104 L 84 96 C 70 108, 50 112, 34 106 Z" fill="#2a1a12" opacity={0.45} />
      <path d="M17 84 C 22 82, 26 78, 26 72" stroke="#5e3a26" strokeWidth={1.6} fill="none" />

      {/* lighting: shadow side, ground falloff, warm key, cool phone fill, rim */}
      <g mask="url(#clBody)">
        <rect x={-300} y={-100} width={700} height={1200} fill="url(#clShadeU)" />
        <rect x={-300} y={-100} width={700} height={1200} fill="url(#clDown)" />
        <rect x={-300} y={-100} width={700} height={1200} fill="url(#clKeyU)" opacity={flick} style={{ mixBlendMode: "screen" }} />
        <rect x={-300} y={-100} width={700} height={1200} fill="url(#clPhoneU)" opacity={phoneGlow} style={{ mixBlendMode: "screen" }} />
      </g>
      <rect x={-300} y={-100} width={700} height={1200} fill="url(#clRimU)" mask="url(#clRim)" opacity={0.6 * flick} filter="url(#clSoft)" />
      {/* phone screen edge glowing past the hand */}
      <rect x={80} y={56} width={2} height={50} rx={1} fill="#cfe6ff" opacity={0.45 * phoneGlow} />
    </g>
  );
};
