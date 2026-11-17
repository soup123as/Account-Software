import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { World } from "../fk/World";
import { C, E, FONT, SAFE, TYPE, ip, prog } from "../fk/theme";
import { Display, Label, Stack, TypeOn } from "../fk/ui";

/** Hero framing: machine low in frame, logo above it. */
const HERO = { z: 0.74, cx: 547, cy: 1100, ax: 540, ay: 1262 };

/** Emblem rises at 30.20 s so the wordmark unmasks on "The Fire Knight" (VO 30.56-31.42). */
const T_LOGO = 112;
const EMBLEM_H = 330; // emblem.png is 762 x 909
const EMBLEM_W = Math.round((EMBLEM_H * 762) / 909);
const WORD_W = 470; // wordmark-light.png is 1077 x 104
const WORD_H = Math.round((WORD_W * 104) / 1077);

/**
 * Hero | 26.47-35.53 s.
 * VO: "Kyunki fire response kisi ek insaan par depend nahi hona chahiye." 26.67-30.07 (local 6-108)
 *     "The Fire Knight." 30.56-31.42 (local 123-148) | "Because every second matters." 31.76-33.72 (local 159-217)
 */
export const S5Hero: React.FC<{ logoSrc?: string | null }> = () => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 110, E.cam);
  const settle = prog(f, 110, 272);
  const cam = {
    z: ip(p, [0, 1], [0.95, HERO.z]) + settle * 0.025,
    cx: HERO.cx,
    cy: ip(p, [0, 1], [1060, HERO.cy]),
    ax: 540,
    ay: ip(p, [0, 1], [1120, HERO.ay]),
  };
  const accent = prog(f, 30, 80, E.out);

  const em = prog(f, T_LOGO, T_LOGO + 16, E.out);
  const sheen = ip(f, [T_LOGO + 12, T_LOGO + 40], [-30, 130], E.inOut);
  const wm = prog(f, T_LOGO + 14, T_LOGO + 28, E.out);
  const tag = prog(f, T_LOGO + 45, T_LOGO + 57, E.out);
  const url = prog(f, T_LOGO + 64, T_LOGO + 74, E.out);

  const emblemSrc = staticFile("brand/emblem.png");
  const top = 420;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: ip(f, [0, 12], [0.4, 1]) }}>
        <World t={f + 794} cam={cam} headlights={1} rim={ip(f, [0, 40], [0.5, 1])} accent={accent} towers={1} crush={0} />
      </AbsoluteFill>
      {/* restrained gold spill under the engine bay */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 300px 90px at 860px 1440px, rgba(240,178,66,${0.12 * accent}) 0%, rgba(240,178,66,0) 100%)`,
        }}
      />
      {/* black field for the logo */}
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.96) 0px, rgba(0,0,0,0.9) 900px, rgba(0,0,0,0) 1150px)", opacity: Math.max(prog(f, 0, 12) * 0.75, prog(f, 100, 116)) }}
      />

      {/* the line, above the machine */}
      <Stack top={380}>
        <TypeOn words={["Kyunki", "fire", "response"]} at={6} out={102} perLetter={0.8} color={C.fa} />
        <TypeOn words={["kisi", "ek", "insaan", "par"]} at={36} out={103} perLetter={0.8} color={C.fa} />
        <Display words={["DEPEND", { w: "NAHI", c: C.gold }]} at={66} out={104} />
        <TypeOn words={["hona", "chahiye."]} at={86} out={105} perLetter={0.8} color={C.fa} />
      </Stack>

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
