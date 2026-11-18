import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TBAY_W, World } from "../fk/World";
import { C, E, ip, prog } from "../fk/theme";
import { Display, Reticle, Stack, TypeOn } from "../fk/ui";

/**
 * Night highway | 5.33-9.83 s.
 * VO: "Raat ke do baje." 5.56 (local 7) | "Highway par." 7.00 (local 50) |
 *     "Engine bay mein heat badh rahi hai." 8.02-9.59 (local 81-127)
 */
const RX = { x: 190, y: 1040, w: 700, h: 400 };
export const T_ZOOM = { z: 2.2, cx: TBAY_W.x, cy: TBAY_W.y, ay: 1290 };

export const t2Camera = (f: number) => {
  const p = prog(f, 62, 110, E.cam);
  const late = prog(f, 110, 132);
  return {
    z: ip(p, [0, 1], [1.1, T_ZOOM.z]) + late * 0.03,
    cx: ip(p, [0, 1], [560 + prog(f, 0, 62) * 14, T_ZOOM.cx]),
    cy: ip(p, [0, 1], [1010, T_ZOOM.cy]),
    ax: 540,
    ay: ip(p, [0, 1], [1010, T_ZOOM.ay]),
  };
};

export const T2Night: React.FC = () => {
  const f = useCurrentFrame();
  const cam = t2Camera(f);
  const scroll = f * 16 - Math.max(0, f - 64) * 5;
  const wheelAngle = scroll * 1.15; // smaller tyres turn faster
  const bob = Math.sin(f * 0.7) * 1.2;
  const heat = ip(f, [20, 100, 132], [0.15, 0.65, 0.95], E.inOut);
  const ret = prog(f, 94, 106, E.out);
  const scanY = ip(f, [98, 120], [RX.y, RX.y + RX.h], E.inOut);
  const thermalOn = f >= 98;
  const common = { t: f + 158, cam, scroll, wheelAngle, bob, machine: "truck" as const, setting: "highway" as const };

  return (
    <AbsoluteFill>
      <World {...common} rim={ip(f, [50, 110], [0.9, 0.6])} heat={heat} />
      {thermalOn && (
        <AbsoluteFill style={{ clipPath: `inset(${RX.y}px ${1080 - RX.x - RX.w}px ${1920 - scanY}px ${RX.x}px round 18px)` }}>
          <World
            {...common}
            headlights={0}
            rim={0.25}
            heat={heat}
            thermal={1}
            crush={1}
            towers={0}
            dust={0}
            truckFilter="grayscale(1) brightness(0.95) contrast(1.25)"
          />
        </AbsoluteFill>
      )}
      {thermalOn && scanY < RX.y + RX.h - 2 && (
        <div
          style={{
            position: "absolute",
            left: RX.x,
            width: RX.w,
            top: scanY - 1,
            height: 2,
            background: C.gold,
            boxShadow: "0 0 16px 3px rgba(240,178,66,0.45)",
          }}
        />
      )}
      <Reticle x={RX.x} y={RX.y} w={RX.w} h={RX.h} p={ret} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.6) 560px, rgba(0,0,0,0) 760px)" }} />

      <Stack top={380}>
        <Display words={["RAAT", "KE", { w: "2", c: C.gold }, "BAJE."]} at={7} out={70} />
        <TypeOn words={["Highway", "par."]} at={47} out={70} color={C.fa} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Engine", "bay", "mein"]} at={77} out={124} perLetter={0.8} color={C.fa} />
        <Display words={[{ w: "HEAT", c: C.gold }, "BADH"]} at={94} out={124} />
        <TypeOn words={["rahi", "hai."]} at={106} out={124} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};
