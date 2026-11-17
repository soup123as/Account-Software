import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BAY_W, World } from "../fk/World";
import { C, E, ip, noise1, prog } from "../fk/theme";
import { Display, Stack, TypeOn } from "../fk/ui";

/**
 * Re-hook | 15.20-18.60 s.
 * VO: "Lekin..." 15.46 (local 8) | "agar woh waqt par na pahunch paaye?" 16.34-18.14 (local 34-88)
 * The engine bay sits unattended while the heat keeps building - the open loop is asked again.
 */
const CAM0 = { z: 2.0, cx: BAY_W.x, cy: BAY_W.y, ax: 540, ay: 1300 };

export const S4Rehook: React.FC = () => {
  const f = useCurrentFrame();
  const cam = { ...CAM0, z: CAM0.z + prog(f, 0, 102, E.inOut) * 0.14, sx: noise1(f * 0.6, 4) * 1.5, sy: noise1(f * 0.6, 7) * 1 };
  const heat = ip(f, [0, 102], [0.8, 1.15], E.in);
  const flare = 0.85 + 0.15 * Math.sin(f * 0.5) + noise1(f * 0.9, 3) * 0.08;
  const gx = 540 + (BAY_W.x - cam.cx) * cam.z;
  const gy = cam.ay + (BAY_W.y - cam.cy) * cam.z;

  return (
    <AbsoluteFill>
      <World t={f + 456} cam={cam} headlights={0.7} rim={0.7} heat={heat} thermal={0.55} towers={0.5} />
      {/* the heat keeps growing with nobody there */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${ip(f, [0, 102], [260, 420]) * flare}px ${ip(f, [0, 102], [190, 300]) * flare}px at ${gx}px ${gy}px, rgba(255,106,26,${ip(f, [0, 102], [0.18, 0.34])}) 0%, rgba(226,54,26,0) 100%)`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.93) 0px, rgba(0,0,0,0.65) 600px, rgba(0,0,0,0) 840px)" }}
      />
      {/* a slow dim red pulse at the frame edge - time running out */}
      <AbsoluteFill
        style={{
          boxShadow: `inset 0 0 160px 40px rgba(226,54,26,${0.1 + 0.1 * Math.max(0, Math.sin(f * 0.21))})`,
          opacity: prog(f, 30, 60),
        }}
      />

      <Stack top={380}>
        <TypeOn words={["Lekin..."]} at={8} out={94} color={C.fa} />
        <TypeOn words={["agar", "woh", "waqt", "par", "na"]} at={34} out={95} perLetter={0.8} color={C.fa} />
        <Display words={[{ w: "PAHUNCH", c: C.gold }, "PAAYE?"]} at={60} out={96} />
      </Stack>
    </AbsoluteFill>
  );
};
