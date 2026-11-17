import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BAY_W, World } from "../fk/World";
import { C, E, REAL, ip, noise1, prog } from "../fk/theme";
import { Display, Stack, TopShade, TypeOn } from "../fk/ui";

/**
 * Scene 1 | 0-3.5 s - CURIOSITY HOOK (open loop).
 * Frame 0 is black with one unexplained gold glow, pulsing like a heartbeat.
 * Line: "Ek cheez is dumper ko BACHA SAKTI HAI." while the camera pulls back from
 * the glow and reveals it sits in the engine bay of a 100-tonne dumper.
 * Then: "OPERATOR NAHI." - the viewer now has to wait to learn what "ek cheez" is
 * (paid off by the product reveal in scene 4).
 */
const TIGHT = { z: 2.3, cx: BAY_W.x, cy: BAY_W.y, ay: 1080 };

/** Wobbly closed ring for the mystery heat contours (screen space). */
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

  // camera: hold tight on the glow, then pull back to reveal the whole machine
  const pull = prog(f, 18, 82, E.cam);
  const cam = {
    z: ip(pull, [0, 1], [TIGHT.z + prog(f, 0, 18) * 0.06, 1]),
    cx: ip(pull, [0, 1], [TIGHT.cx, 540]),
    cy: ip(pull, [0, 1], [TIGHT.cy, 960]),
    ax: 540,
    ay: ip(pull, [0, 1], [TIGHT.ay, 960]),
    sx: f >= 57 && f < 65 ? noise1(f * 3, 2) * 5 * (1 - (f - 57) / 8) : 0,
    sy: f >= 57 && f < 65 ? noise1(f * 3, 5) * 3 * (1 - (f - 57) / 8) : 0,
  };

  const lamps = f < 12 ? 0 : f < 14 ? 0.9 : f < 16 ? 0.1 : 1; // two flickers
  const lift = prog(f, 14, 64, E.out);
  const pulse = 0.72 + 0.28 * Math.pow(Math.abs(Math.sin(f * 0.17)), 3);

  // the glow on screen follows the engine bay through the camera move
  const gx = (cam.ax ?? 540) + (BAY_W.x - cam.cx) * cam.z;
  const gy = (cam.ay ?? 960) + (BAY_W.y - cam.cy) * cam.z;
  const gz = cam.z / TIGHT.z;
  const mystery = ip(f, [0, 30, 70], [1, 1, 0.55]);

  return (
    <AbsoluteFill>
      <World t={f} cam={cam} headlights={lamps} rim={ip(f, [16, 60], [0, 0.85], E.out)} heat={0.45} towers={ip(f, [30, 60], [0, 1])} dust={lift} />

      {/* darkness lifting from a light pool */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${ip(lift, [0, 1], [220, 1300])}px ${ip(lift, [0, 1], [160, 900])}px at ${gx}px ${gy}px, rgba(0,0,0,${ip(lift, [0, 1], [0.96, 0])}) 0%, rgba(0,0,0,${ip(lift, [0, 1], [1, 0.35])}) 100%)`,
        }}
      />

      {/* the unexplained glow, above the darkness */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: mystery, mixBlendMode: "screen" }}>
        <defs>
          <radialGradient id="mysteryG">
            <stop offset="0" stopColor={REAL.fireCore} stopOpacity="1" />
            <stop offset="0.22" stopColor={REAL.fireYellow} stopOpacity="0.95" />
            <stop offset="0.55" stopColor={REAL.fireOrange} stopOpacity="0.5" />
            <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={gx} cy={gy} rx={170 * gz * pulse} ry={120 * gz * pulse} fill="url(#mysteryG)" />
        {[1, 0.7, 0.45].map((k, i) => (
          <path
            key={i}
            d={ring(gx, gy, 130 * gz * k * (0.9 + 0.1 * pulse), f, i)}
            fill="none"
            stroke={i === 2 ? REAL.fireYellow : i === 1 ? REAL.fireOrange : REAL.fireRed}
            strokeWidth={1.6}
            opacity={(0.25 + i * 0.15) * ip(f, [0, 40, 80], [1, 1, 0.4])}
          />
        ))}
      </svg>

      <TopShade opacity={0.9} to={820} />

      {/* open loop, part 1 */}
      <Stack top={370}>
        <TypeOn words={["Ek", "cheez", "is", "dumper", "ko"]} at={4} out={52} perLetter={0.8} color={C.fa} />
        <Display words={["BACHA", "SAKTI", "HAI."]} at={16} out={53} size={112} />
      </Stack>

      {/* open loop, part 2 - the twist */}
      <Stack top={370}>
        <Display words={["OPERATOR", { w: "NAHI.", c: C.gold }]} at={57} out={98} />
      </Stack>
    </AbsoluteFill>
  );
};
