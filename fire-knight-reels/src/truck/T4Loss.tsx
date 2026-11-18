import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TBAY_W, TRUCK, World } from "../fk/World";
import { C, E, ip, noise1, prog } from "../fk/theme";
import { Display, Stack, TypeOn } from "../fk/ui";

/**
 * Re-hook + loss | 16.77-22.57 s.
 * VO: "Lekin agar woh waqt par na pahunche..." 17.01-18.79 (local 7-61)
 *     "toh nuksaan sirf truck ka nahi," 19.13 (local 71) | "maal aur kamaai ka bhi." 20.91-22.27 (local 124-165)
 * Close on the unattended heat, then pull back so the whole truck and its cargo are at stake.
 */
const CLOSE = { z: 2.0, cx: TBAY_W.x, cy: TBAY_W.y, ay: 1300 };
const WIDE = { z: 1.05, cx: TRUCK.x + 500, cy: TRUCK.y + 330, ay: 1140 };

export const T4Loss: React.FC = () => {
  const f = useCurrentFrame();
  const pull = prog(f, 70, 120, E.cam);
  const cam = {
    z: ip(pull, [0, 1], [CLOSE.z + prog(f, 0, 70) * 0.12, WIDE.z]) + prog(f, 120, 174) * 0.03,
    cx: ip(pull, [0, 1], [CLOSE.cx, WIDE.cx]),
    cy: ip(pull, [0, 1], [CLOSE.cy, WIDE.cy]),
    ax: 540,
    ay: ip(pull, [0, 1], [CLOSE.ay, WIDE.ay]),
    sx: noise1(f * 0.6, 4) * 1.5,
    sy: noise1(f * 0.6, 7),
  };
  const heat = ip(f, [0, 174], [0.85, 1.2], E.in);
  const flare = 0.85 + 0.15 * Math.sin(f * 0.5) + noise1(f * 0.9, 3) * 0.08;
  const gx = 540 + (TBAY_W.x - cam.cx) * cam.z;
  const gy = cam.ay + (TBAY_W.y - cam.cy) * cam.z;
  const r = 300 * cam.z;

  return (
    <AbsoluteFill>
      <World t={f + 503} cam={cam} machine="truck" setting="highway" headlights={0.7} rim={0.7} heat={heat} thermal={0.5} towers={0.6} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${r * flare}px ${r * 0.7 * flare}px at ${gx}px ${gy}px, rgba(255,106,26,${ip(f, [0, 174], [0.2, 0.36])}) 0%, rgba(226,54,26,0) 100%)`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.93) 0px, rgba(0,0,0,0.65) 620px, rgba(0,0,0,0) 860px)" }} />
      <AbsoluteFill
        style={{
          boxShadow: `inset 0 0 160px 40px rgba(226,54,26,${0.1 + 0.1 * Math.max(0, Math.sin(f * 0.21))})`,
          opacity: prog(f, 20, 50),
        }}
      />

      <Stack top={380}>
        <TypeOn words={["Lekin", "agar", "woh", "waqt", "par", "na"]} at={7} out={66} perLetter={0.8} color={C.fa} />
        <Display words={[{ w: "PAHUNCHE...", c: C.gold }]} at={40} out={66} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Toh", "nuksaan", "sirf", "truck", "ka", "nahi,"]} at={74} out={164} perLetter={0.8} color={C.fa} />
        <Display words={["MAAL", "AUR", { w: "KAMAAI", c: C.gold }]} at={124} out={164} size={112} />
        <TypeOn words={["ka", "bhi."]} at={146} out={164} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};
