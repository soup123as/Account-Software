import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { World } from "../fk/World";
import { C, E, FONT, SAFE, TYPE, ip, prog } from "../fk/theme";
import { Label } from "../fk/ui";
import { S4_CAM } from "./S4System";

/** Hero framing: machine low in frame, logo above it. */
const HERO = { z: 0.74, cx: 547, cy: 1100, ax: 540, ay: 1262 };

const T_LOGO = 30;
const EMBLEM_H = 330; // emblem.png is 762 x 909
const EMBLEM_W = Math.round((EMBLEM_H * 762) / 909);
const WORD_W = 470; // wordmark-light.png is 1077 x 104
const WORD_H = Math.round((WORD_W * 104) / 1077);

/** Scene 5 | 16-20 s - hero dumper and the official logo end frame. */
export const S5Hero: React.FC<{ logoSrc?: string | null }> = () => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 44, E.cam);
  const settle = prog(f, 44, 120);
  const cam = {
    z: ip(p, [0, 1], [S4_CAM.z, HERO.z]) + settle * 0.02,
    cx: ip(p, [0, 1], [S4_CAM.cx, HERO.cx]),
    cy: ip(p, [0, 1], [S4_CAM.cy, HERO.cy]),
    ax: 540,
    ay: ip(p, [0, 1], [S4_CAM.ay, HERO.ay]),
  };
  const accent = prog(f, 20, 50, E.out);

  const em = prog(f, T_LOGO, T_LOGO + 16, E.out);
  const sheen = ip(f, [T_LOGO + 12, T_LOGO + 40], [-30, 130], E.inOut);
  const wm = prog(f, T_LOGO + 14, T_LOGO + 28, E.out);
  const tag = prog(f, T_LOGO + 30, T_LOGO + 42, E.out);
  const url = prog(f, T_LOGO + 44, T_LOGO + 54, E.out);

  const emblemSrc = staticFile("brand/emblem.png");
  const top = 420;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: ip(f, [0, 12], [0.4, 1]) }}>
        <World t={f + 480} cam={cam} headlights={1} rim={ip(f, [0, 40], [0.5, 1])} accent={accent} towers={1} crush={ip(f, [0, 30], [0.5, 0])} />
      </AbsoluteFill>
      {/* restrained gold spill under the engine bay */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 300px 90px at 860px 1440px, rgba(240,178,66,${0.12 * accent}) 0%, rgba(240,178,66,0) 100%)`,
        }}
      />
      {/* black field for the logo */}
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.96) 0px, rgba(0,0,0,0.9) 900px, rgba(0,0,0,0) 1150px)", opacity: prog(f, 16, 34) }}
      />

      {/* emblem: rises, then a light sweep runs across the steel */}
      <div
        style={{
          position: "absolute",
          left: 540 - EMBLEM_W / 2,
          top,
          width: EMBLEM_W,
          height: EMBLEM_H,
          opacity: em,
          translate: `0 ${(1 - em) * 40}px`,
          scale: `${0.94 + 0.06 * em}`,
          filter: em < 1 ? `blur(${(1 - em) * 12}px)` : undefined,
        }}
      >
        <Img src={emblemSrc} style={{ width: "100%", height: "100%", display: "block" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(115deg, rgba(255,255,255,0) ${sheen - 14}%, rgba(255,255,255,0.55) ${sheen}%, rgba(255,255,255,0) ${sheen + 14}%)`,
            WebkitMaskImage: `url(${emblemSrc})`,
            WebkitMaskSize: "100% 100%",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* wordmark: unmasks left to right */}
      <div
        style={{
          position: "absolute",
          left: 540 - WORD_W / 2,
          top: top + EMBLEM_H + 44,
          width: WORD_W,
          height: WORD_H,
          clipPath: `inset(0 ${(1 - wm) * 100}% 0 0)`,
          opacity: wm > 0 ? 1 : 0,
        }}
      >
        <Img src={staticFile("brand/wordmark-light.png")} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>

      <div
        style={{
          position: "absolute",
          left: SAFE.x0,
          width: SAFE.x1 - SAFE.x0,
          top: top + EMBLEM_H + 44 + WORD_H + 46,
          textAlign: "center",
          fontFamily: FONT.sans,
          fontWeight: 500,
          fontSize: TYPE.support,
          letterSpacing: "-0.01em",
          color: C.fa,
          opacity: tag,
          translate: `0 ${(1 - tag) * 14}px`,
          filter: tag < 1 ? `blur(${(1 - tag) * 8}px)` : undefined,
        }}
      >
        Because every <span style={{ color: C.gold }}>second</span> matters.
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.x0,
          width: SAFE.x1 - SAFE.x0,
          top: top + EMBLEM_H + 44 + WORD_H + 46 + 70,
          display: "flex",
          justifyContent: "center",
          opacity: url,
        }}
      >
        <Label style={{ fontSize: 22 }}>thefireknight.in</Label>
      </div>
    </AbsoluteFill>
  );
};
