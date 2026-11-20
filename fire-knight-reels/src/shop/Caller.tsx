import React from "react";
import { REAL, noise1 } from "../fk/theme";

/**
 * The stranger who calls at 2 a.m.: a man on the street, phone to his ear, pointing back at
 * the smoking shop. Facing left (towards the shop), standing ~1.7 m (feet at y 1700, head top
 * ~ y 944 at zoom 1). Night: the figure is mostly in shadow, rim-lit by the fire on the left,
 * with the cool glow of the phone on his cheek and hand. Real colours, no brand colours.
 */
export const CALLER = { x: 690, feet: 1700, ear: { x: 712, y: 1002 } };

type Fill = { skin: string; hair: string; shirt: string; pants: string; shoe: string };

const Figure: React.FC<{ c: Fill | "mask" | "cut"; point: number }> = ({ c, point }) => {
  const m = c === "mask" || c === "cut";
  const solid = c === "cut" ? "#000" : "#fff";
  const k = (v: keyof Fill) => (m ? solid : (c as Fill)[v]);
  // pointing arm swings up from the side as `point` goes 0 -> 1
  const hx = 640 - 150 * point;
  const hy = 1300 - 160 * point;
  const ex = 618 - 50 * point;
  const ey = 1220 - 60 * point;
  return (
    <g>
      {/* back leg + front leg (slight stride), sandals */}
      <path d="M700 1330 L 752 1330 L 748 1470 L 742 1640 L 712 1642 L 708 1470 Z" fill={k("pants")} />
      <path d="M640 1330 L 712 1330 L 700 1480 L 668 1652 L 634 1650 L 652 1480 Z" fill={k("pants")} />
      <path d="M706 1640 L 752 1640 Q 768 1660 756 1676 L 704 1676 Z" fill={k("shoe")} />
      <path d="M628 1648 L 672 1648 L 672 1684 L 600 1684 Q 600 1660 628 1648 Z" fill={k("shoe")} />
      <path d="M612 1660 L 640 1660 L 640 1684 L 604 1684 Z" fill={k("skin")} />
      {/* torso: half-sleeve shirt, untucked */}
      <path d="M622 1112 Q 690 1088 772 1110 Q 786 1180 770 1250 L 760 1346 Q 696 1360 632 1344 L 626 1250 Q 608 1180 622 1112 Z" fill={k("shirt")} />
      {/* neck + head */}
      <path d="M672 1046 L 714 1046 L 718 1100 L 668 1100 Z" fill={k("skin")} />
      <path d="M690 944 C 728 944 742 976 740 1008 C 738 1044 720 1068 694 1070 C 676 1071 664 1062 656 1048 L 650 1030 L 642 1020 L 650 1012 L 646 990 C 648 960 664 944 690 944 Z" fill={k("skin")} />
      <path d="M690 940 C 732 940 748 972 744 1012 L 732 1020 C 730 998 720 986 708 984 C 690 982 672 978 660 968 L 652 984 C 648 958 664 940 690 940 Z" fill={k("hair")} />
      {!m && (
        <g>
          {/* ear, brow, eye, moustache, stubble - kept in shadow */}
          <path d="M714 1000 Q 726 1004 724 1022 Q 720 1032 712 1030 Z" fill="#5e3a27" />
          <path d="M656 990 Q 668 984 680 988" stroke="#0d0a08" strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M660 1000 Q 668 997 674 1001" stroke="#1a110c" strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M648 1034 Q 660 1030 674 1036 L 672 1040 Q 660 1036 650 1039 Z" fill="#0d0a08" />
          <path d="M656 1048 Q 680 1072 714 1060 L 720 1040 Q 700 1054 676 1046 Z" fill="#1a120d" opacity={0.6} />
          <path d="M650 1012 L 642 1020 L 650 1024" stroke="#4a2e1f" strokeWidth={2} fill="none" />
        </g>
      )}
      {/* free arm: points back at the shop */}
      <path d={`M634 1118 Q 610 1150 ${ex} ${ey} L ${hx + 6} ${hy - 10} L ${hx + 4} ${hy + 14} L ${ex + 26} ${ey + 16} Q 650 1170 652 1132 Z`} fill={k("skin")} />
      <path d="M622 1112 Q 604 1150 606 1196 L 650 1196 Q 650 1150 652 1120 Z" fill={k("shirt")} />
      <path d={`M${hx + 6} ${hy - 10} L ${hx - 30} ${hy - 6} L ${hx - 30} ${hy + 2} L ${hx + 4} ${hy + 14} Z`} fill={k("skin")} />
      {/* phone arm: elbow out, hand + phone at the ear */}
      <path d="M760 1112 Q 806 1140 812 1200 L 790 1214 Q 776 1170 752 1150 Z" fill={k("shirt")} />
      <path d="M790 1200 Q 800 1150 760 1080 L 730 1030 L 708 1046 L 742 1100 Q 772 1160 772 1210 Z" fill={k("skin")} />
      <path d="M716 990 L 742 984 L 750 1040 L 722 1048 Z" fill={m ? solid : "#111214"} />
    </g>
  );
};

export const Caller: React.FC<{ t: number; fire?: number; point?: number; phoneGlow?: number }> = ({ t, fire = 1, point = 1, phoneGlow = 1 }) => {
  const flick = fire * (0.8 + 0.2 * noise1(t * 0.5, 4));
  const breathe = Math.sin(t * 0.08) * 1.5;
  const colors: Fill = { skin: "#7a5038", hair: "#0d0a08", shirt: "#4f6d8f", pants: "#272a30", shoe: "#1a1512" };
  return (
    <g transform={`translate(0 ${breathe})`}>
      <defs>
        <mask id="clRim">
          <Figure c="mask" point={point} />
          <g transform="translate(6 2)">
            <Figure c="cut" point={point} />
          </g>
        </mask>
        <mask id="clBody">
          <Figure c="mask" point={point} />
        </mask>
        <linearGradient id="clRimG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={REAL.fireYellow} />
          <stop offset="1" stopColor={REAL.fireOrange} />
        </linearGradient>
        <radialGradient id="clPhone" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(730 1015) scale(80 90)">
          <stop offset="0" stopColor="#cfe6ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#cfe6ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="clShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.25" />
          <stop offset="1" stopColor="#000" stopOpacity="0.72" />
        </linearGradient>
        <filter id="clSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>
      {/* ground shadow, thrown right by the fire */}
      <ellipse cx={720} cy={1684} rx={150} ry={14} fill="#000" opacity={0.55} />
      <Figure c={colors} point={point} />
      {/* shirt check pattern + folds */}
      <g mask="url(#clBody)" opacity={0.5}>
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={`v${i}`} x={600 + i * 16} y={1090} width={2} height={260} fill="#9fb6cf" opacity={0.35} />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <rect key={`h${i}`} x={590} y={1096 + i * 16} width={230} height={2} fill="#9fb6cf" opacity={0.3} />
        ))}
        <path d="M660 1200 Q 690 1240 700 1340 M 720 1150 Q 740 1220 730 1330" stroke="#000" strokeWidth={5} opacity={0.35} fill="none" />
      </g>
      {/* night shading: darker away from the fire */}
      <rect x={480} y={930} width={360} height={760} fill="url(#clShade)" mask="url(#clBody)" />
      {/* fire rim light on every left-facing edge */}
      <rect x={480} y={930} width={360} height={760} fill="url(#clRimG)" mask="url(#clRim)" opacity={0.7 * flick} filter="url(#clSoft)" />
      {/* phone glow on cheek and fingers */}
      <rect x={640} y={920} width={180} height={180} fill="url(#clPhone)" mask="url(#clBody)" opacity={phoneGlow} style={{ mixBlendMode: "screen" }} />
      <rect x={722} y={994} width={18} height={44} rx={3} fill="#9fc8ff" opacity={0.5 * phoneGlow} transform="rotate(-12 731 1016)" />
    </g>
  );
};
