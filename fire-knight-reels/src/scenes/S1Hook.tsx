import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BAY_W, World } from "../fk/World";
import { C, E, REAL, ip, noise1, prog } from "../fk/theme";
import { Display, Stack, TypeOn } from "../fk/ui";

/**
 * Scene 1 | 0-4 s - CURIOSITY HOOK, poster first frame.
 * Frame 0 already reads as a finished poster: the hook line is on screen, a fire-orange
 * heat signature pulses in the dark engine bay, and the dumper's silhouette is rim-lit.
 * A gold scanner passes over the line, the camera pulls back to reveal the whole machine,
 * then "OPERATOR NAHI." The answer ("ek cheez") arrives with the product in scene 5.
 */
const TIGHT = { z: 2.0, cx: BAY_W.x, cy: BAY_W.y, ay: 1250 };

const ring = (cx: number, cy: number, r: number, t: number, seed: number) => {
  let d = "";
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const k = 1 + 0.08 * noise1(a * 1.4 + t * 0.08 + seed * 5, seed);
    d += `${i ? "L" : "M"}${(cx + Math.cos(a) * r * k * 1.25).toFixed(1)} ${(cy + Math.sin(a) * r * k * 0.82).toFixed(1)}`;
  }
  return d + "Z";
};

export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();

  const pull = prog(f, 24, 100, E.cam);
  const cam = {
    z: ip(pull, [0, 1], [TIGHT.z + prog(f, 0, 24) * 0.04, 1]),
    cx: ip(pull, [0, 1], [TIGHT.cx, 540]),
    cy: ip(pull, [0, 1], [TIGHT.cy, 960]),
    ax: 540,
    ay: ip(pull, [0, 1], [TIGHT.ay, 960]),
    sx: f >= 66 && f < 76 ? noise1(f * 3, 2) * 5 * (1 - (f - 66) / 10) : 0,
    sy: f >= 66 && f < 76 ? noise1(f * 3, 5) * 3 * (1 - (f - 66) / 10) : 0,
  };

  const lamps = f < 16 ? 0 : f < 18 ? 0.9 : f < 21 ? 0.15 : 1; // two flickers
  const lift = ip(f, [0, 18, 80], [0.3, 0.32, 1], E.out);
  const pulse = 0.72 + 0.28 * Math.pow(Math.abs(Math.sin(f * 0.17)), 3);

  const gx = 540 + (BAY_W.x - cam.cx) * cam.z;
  const gy = (cam.ay ?? 960) + (BAY_W.y - cam.cy) * cam.z;
  const gz = cam.z / TIGHT.z;
  const mystery = ip(f, [0, 40, 90], [1, 1, 0.5]);

  return (
    <AbsoluteFill>
      <World
        t={f}
        cam={cam}
        headlights={lamps}
        rim={ip(f, [0, 60], [0.6, 0.9], E.out)}
        heat={0.5}
        towers={ip(f, [36, 70], [0, 1])}
        dust={ip(f, [18, 60], [0, 1])}
      />

      {/* night exposure: the silhouette reads from frame 0, the light pool opens with the lamps */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${ip(lift, [0.3, 1], [520, 1400])}px ${ip(lift, [0.3, 1], [380, 950])}px at ${gx}px ${gy}px, rgba(0,0,0,${ip(lift, [0.3, 1], [0.45, 0])}) 0%, rgba(0,0,0,${ip(lift, [0.3, 1], [0.86, 0.3])}) 100%)`,
        }}
      />

      {/* heat signature in the engine bay */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: mystery, mixBlendMode: "screen" }}>
        <defs>
          <radialGradient id="mysteryG">
            <stop offset="0" stopColor={REAL.fireCore} stopOpacity="1" />
            <stop offset="0.22" stopColor={REAL.fireYellow} stopOpacity="0.95" />
            <stop offset="0.55" stopColor={REAL.fireOrange} stopOpacity="0.5" />
            <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={gx} cy={gy} rx={190 * gz * pulse} ry={135 * gz * pulse} fill="url(#mysteryG)" />
        {[1, 0.72, 0.48].map((k, i) => (
          <path
            key={i}
            d={ring(gx, gy, 150 * gz * k * (0.9 + 0.1 * pulse), f, i)}
            fill="none"
            stroke={i === 2 ? REAL.fireYellow : i === 1 ? REAL.fireOrange : REAL.fireRed}
            strokeWidth={1.8}
            opacity={(0.3 + i * 0.15) * ip(f, [0, 50, 90], [1, 1, 0.35])}
          />
        ))}
      </svg>

      {/* open loop, part 1 - already on screen at frame 0 (poster) */}
      <Stack top={380}>
        <TypeOn words={["Ek", "cheez", "is", "dumper", "ko"]} at={-40} out={58} color={C.fa} />
        <Display words={[{ w: "BACHA", c: C.gold }, "SAKTI", "HAI."]} at={-40} out={59} size={112} />
      </Stack>

      {/* open loop, part 2 - the twist on the full machine */}
      <Stack top={380}>
        <Display words={["OPERATOR", { w: "NAHI.", c: C.gold }]} at={68} out={106} />
      </Stack>
    </AbsoluteFill>
  );
};
