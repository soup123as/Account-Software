import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { World } from "../fk/World";
import { C, E, ip, noise1, prog } from "../fk/theme";
import { Display, Stack, TopShade, TypeOn } from "../fk/ui";

/** Scene 1 | 0-3 s - the dumper emerges from darkness; the question lands. */
export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();

  const lamps = f < 3 ? 0 : f < 5 ? 0.9 : f < 7 ? 0.1 : 1; // two flickers, then on
  const lift = prog(f, 3, 46, E.out);
  const rim = ip(f, [10, 50], [0, 0.85], E.out);
  const hit = f >= 44 && f < 52 ? 1 - (f - 44) / 8 : 0;

  const cam = {
    z: ip(f, [0, 90], [0.8, 1], E.cam),
    cx: 540,
    cy: ip(f, [0, 90], [1060, 960], E.cam),
    sx: noise1(f * 3, 2) * 5 * hit,
    sy: noise1(f * 3, 5) * 3 * hit,
  };

  return (
    <AbsoluteFill>
      <World t={f} cam={cam} headlights={lamps} rim={rim} towers={ip(f, [14, 40], [0, 1])} dust={lift} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${ip(lift, [0, 1], [260, 1300])}px ${ip(lift, [0, 1], [180, 900])}px at 640px 1110px, rgba(0,0,0,${ip(lift, [0, 1], [0.7, 0])}) 0%, rgba(0,0,0,${ip(lift, [0, 1], [0.98, 0.35])}) 100%)`,
        }}
      />
      <TopShade opacity={0.9} to={820} />

      {/* 100-TONNE / dumper. */}
      <Stack top={380}>
        <Display words={["100-TONNE"]} at={4} out={31} />
        <TypeOn words={["dumper."]} at={10} out={32} color={C.fa} />
      </Stack>

      {/* Fire plan? / SIRF OPERATOR? */}
      <Stack top={380}>
        <TypeOn words={["Fire", "plan?"]} at={36} out={84} color={C.fa} />
        <Display words={["SIRF", { w: "OPERATOR?", c: C.gold }]} at={44} out={85} />
      </Stack>
    </AbsoluteFill>
  );
};
