import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { World } from "../fk/World";
import { C, E, FONT, SAFE, ip, noise1, prog } from "../fk/theme";
import { Mono, RevealLine, Slam, SweepLine, TopShade } from "../fk/ui";

/** Scene 1 | 0-3 s - the dumper emerges from darkness; the question lands. */
export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();

  // headlights: two flickers, then on
  const lamps = f < 3 ? 0 : f < 5 ? 0.9 : f < 7 ? 0.1 : f < 9 ? 1 : 1;
  // exposure: darkness lifts from a light pool around the truck
  const lift = prog(f, 3, 46, E.out);
  const rim = ip(f, [10, 50], [0, 0.85], E.out);

  const cam = {
    z: ip(f, [0, 90], [0.8, 1], E.cam),
    cx: 540,
    cy: ip(f, [0, 90], [1060, 960], E.cam),
    sx: f >= 46 && f < 56 ? noise1(f * 3, 2) * 7 * (1 - (f - 46) / 10) : 0,
    sy: f >= 46 && f < 56 ? noise1(f * 3, 5) * 5 * (1 - (f - 46) / 10) : 0,
  };

  const outQ = 84; // question starts leaving at the cut into scene 2
  return (
    <AbsoluteFill>
      <World t={f} cam={cam} headlights={lamps} rim={rim} scroll={0} towers={ip(f, [14, 40], [0, 1])} dust={lift} />

      {/* darkness with a growing light pool */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${ip(lift, [0, 1], [260, 1300])}px ${ip(lift, [0, 1], [180, 900])}px at 640px 1110px, rgba(0,0,0,${ip(lift, [0, 1], [0.7, 0])}) 0%, rgba(0,0,0,${ip(lift, [0, 1], [0.98, 0.35])}) 100%)`,
        }}
      />
      <TopShade opacity={0.9} to={840} />

      {/* headline 1: 100-TONNE DUMPER. */}
      <div style={{ position: "absolute", left: SAFE.x0, top: 388 }}>
        <Slam at={4} out={31} size={176}>
          100-tonne
        </Slam>
        <Slam at={7} out={32} size={176}>
          dumper.
        </Slam>
      </div>

      <SweepLine at={32} y={404} dur={10} />

      {/* headline 2: FIRE PLAN? SIRF OPERATOR? */}
      <div style={{ position: "absolute", left: SAFE.x0, top: 380 }}>
        <div style={{ opacity: 1 - prog(f, outQ, outQ + 6) }}>
          <Mono style={{ fontSize: 24, color: C.ash, opacity: prog(f, 37, 45) }}>100-tonne dumper · night shift</Mono>
        </div>
        <div style={{ height: 22 }} />
        <RevealLine
          words={["FIRE", "PLAN?"]}
          start={37}
          end={outQ}
          stagger={3}
          style={{ fontFamily: FONT.slam, fontSize: 118, lineHeight: 0.92, color: C.white }}
        />
        <RevealLine
          words={["SIRF"]}
          start={42}
          end={outQ + 1}
          style={{ fontFamily: FONT.slam, fontSize: 176, lineHeight: 0.92, color: C.white }}
        />
        <RevealLine
          words={[{ w: "OPERATOR?", c: C.ember }]}
          start={46}
          end={outQ + 2}
          style={{ fontFamily: FONT.slam, fontSize: 176, lineHeight: 0.92 }}
        />
      </div>
    </AbsoluteFill>
  );
};
