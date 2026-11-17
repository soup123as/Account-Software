import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, E, SAFE, ip, prog } from "../fk/theme";
import { Hit, Label, Line, ScanReveal, Stack } from "../fk/ui";

/** Scene 5 | 18.2-21.4 s - the answer to the hook: the real Ranger. */
export const S5Product: React.FC = () => {
  const f = useCurrentFrame();
  const pr = prog(f, 2, 26, E.out);
  const sweep = ip(f, [24, 60], [-40, 140], E.inOut);
  const src = staticFile("product/ranger-cylinder.png");
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 760px 520px at 540px 1000px, #16181B 0%, ${C.black} 70%)` }}>
      <div
        style={{
          position: "absolute",
          left: 170,
          top: 1170,
          width: 740,
          height: 60,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(250,250,250,0.12) 0%, rgba(0,0,0,0) 70%)",
          opacity: pr,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: SAFE.x0,
          top: 810,
          width: 820,
          opacity: pr,
          translate: `0 ${(1 - pr) * 70}px`,
          scale: `${0.96 + 0.04 * pr + prog(f, 0, 96) * 0.03}`,
          filter: pr < 1 ? `blur(${(1 - pr) * 12}px)` : undefined,
        }}
      >
        <Img src={src} style={{ width: "100%", display: "block" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep - 12}%, rgba(255,255,255,0.4) ${sweep}%, rgba(255,255,255,0) ${sweep + 12}%)`,
            WebkitMaskImage: `url(${src})`,
            WebkitMaskSize: "100% 100%",
            mixBlendMode: "screen",
          }}
        />
      </div>
      <div style={{ position: "absolute", left: SAFE.x0, top: 1250, opacity: prog(f, 24, 36) }}>
        <Label style={{ color: C.silver }}>
          The Ranger <span style={{ color: C.gold }}>·</span> fire suppression aid
        </Label>
      </div>

      <Stack top={380}>
        <ScanReveal at={14} dur={20} plate={false}>
          <Line w={["Fire", "response", "shouldn't"]} />
          <Line w={["depend", "on"]} />
          <Hit w={[{ w: "ONE", c: C.gold }, { w: "PERSON.", c: C.gold }]} />
        </ScanReveal>
      </Stack>
    </AbsoluteFill>
  );
};
