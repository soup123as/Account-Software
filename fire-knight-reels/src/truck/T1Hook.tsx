import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TBAY_W, World } from "../fk/World";
import { C, E, REAL, ip, noise1, prog } from "../fk/theme";
import { Display, Stack, TypeOn } from "../fk/ui";

/**
 * Hook | 0-3.67 s - negative, curiosity-driven, poster first frame.
 * VO P1: "Truck owners, aapka sabse bada nuksaan accident nahi... yeh ho sakta hai."
 * Frame 0: the line's first half is on screen over a dark truck with a heat glow behind the
 * cab's engine vent. "...yeh ho sakta hai" lands as the glow flares - "yeh" is the fire.
 */
const TIGHT = { z: 2.0, cx: TBAY_W.x, cy: TBAY_W.y, ay: 1300 };

const ring = (cx: number, cy: number, r: number, t: number, seed: number) => {
  let d = "";
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const k = 1 + 0.08 * noise1(a * 1.4 + t * 0.08 + seed * 5, seed);
    d += `${i ? "L" : "M"}${(cx + Math.cos(a) * r * k * 1.3).toFixed(1)} ${(cy + Math.sin(a) * r * k * 0.78).toFixed(1)}`;
  }
  return d + "Z";
};

export const T1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const pull = prog(f, 24, 150, E.cam);
  const cam = {
    z: ip(pull, [0, 1], [TIGHT.z + prog(f, 0, 24) * 0.03, 1.1]),
    cx: ip(pull, [0, 1], [TIGHT.cx, 560]),
    cy: ip(pull, [0, 1], [TIGHT.cy, 1010]),
    ax: 540,
    ay: ip(pull, [0, 1], [TIGHT.ay, 1010]),
  };
  const lamps = f < 14 ? 0 : f < 16 ? 0.9 : f < 19 ? 0.15 : 1;
  const lift = ip(f, [0, 16, 110], [0.3, 0.32, 1], E.out);
  const flare = 1 + 0.35 * prog(f, 125, 135, E.out) * (1 - prog(f, 135, 155)); // flares on "yeh" (4.25 s)
  const pulse = (0.72 + 0.28 * Math.pow(Math.abs(Math.sin(f * 0.17)), 3)) * flare;
  const gx = 540 + (TBAY_W.x - cam.cx) * cam.z;
  const gy = cam.ay + (TBAY_W.y - cam.cy) * cam.z;
  const gz = cam.z / TIGHT.z;

  return (
    <AbsoluteFill>
      <World
        t={f}
        cam={cam}
        machine="truck"
        setting="highway"
        headlights={lamps}
        rim={ip(f, [0, 60], [0.6, 0.9], E.out)}
        heat={0.55}
        towers={ip(f, [40, 100], [0, 1])}
        dust={ip(f, [16, 60], [0, 1])}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${ip(lift, [0.3, 1], [520, 1400])}px ${ip(lift, [0.3, 1], [380, 950])}px at ${gx}px ${gy}px, rgba(0,0,0,${ip(lift, [0.3, 1], [0.45, 0])}) 0%, rgba(0,0,0,${ip(lift, [0.3, 1], [0.86, 0.3])}) 100%)`,
        }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: ip(f, [0, 100, 160], [1, 1, 0.55]), mixBlendMode: "screen" }}>
        <defs>
          <radialGradient id="tmysteryG">
            <stop offset="0" stopColor={REAL.fireCore} stopOpacity="1" />
            <stop offset="0.22" stopColor={REAL.fireYellow} stopOpacity="0.95" />
            <stop offset="0.55" stopColor={REAL.fireOrange} stopOpacity="0.5" />
            <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={gx} cy={gy} rx={170 * gz * pulse} ry={115 * gz * pulse} fill="url(#tmysteryG)" />
        {[1, 0.72, 0.48].map((k, i) => (
          <path
            key={i}
            d={ring(gx, gy, 130 * gz * k * (0.9 + 0.1 * pulse), f, i)}
            fill="none"
            stroke={i === 2 ? REAL.fireYellow : i === 1 ? REAL.fireOrange : REAL.fireRed}
            strokeWidth={1.8}
            opacity={(0.3 + i * 0.15) * ip(f, [0, 100, 160], [1, 1, 0.4])}
          />
        ))}
      </svg>

      {/* poster: first half on screen at frame 0, the twist types on */}
      <Stack top={380}>
        <TypeOn words={["Truck", "owners,", "aapka", "sabse", "bada"]} at={-40} out={150} color={C.fa} />
        <Display words={[{ w: "NUKSAAN", c: C.gold }]} at={-40} out={150} />
        <TypeOn words={["accident", "nahi..."]} at={78} out={150} perLetter={0.8} color={C.fa} />
        <TypeOn words={["yeh", "ho", "sakta", "hai."]} at={126} out={150} perLetter={0.6} color={C.white} />
      </Stack>
    </AbsoluteFill>
  );
};
