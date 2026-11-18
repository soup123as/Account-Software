import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { TRUCK, World } from "../fk/World";
import { C, E, FONT, SAFE, TYPE, ip, prog } from "../fk/theme";
import { Display, Label, Stack, TypeOn } from "../fk/ui";

/**
 * Truck reel - Hero + logo + CTA | 28.43-40.03 s.
 * Line (text only, VO removed): "Kyunki aapka business sirf regular safety ke bharose nahi chalna chahiye." (local 7-86)
 * VO P8: "The Fire Knight." 32.40 (local 119) | "Because every second matters." 33.60 (local 155) |
 *        "Free consultation ke liye WhatsApp karein." 35.90-38.20 (local 224-293)
 */
const HERO = { z: 0.8, cx: TRUCK.x + 500, cy: TRUCK.y + 360, ax: 540, ay: 1296 };
const T_LOGO = 92; // wordmark unmasks on "The Fire Knight" (33.15 s)
const T_CTA = 164; // "Free consultation ke liye WhatsApp karein" (36.55 s)
const EMBLEM_H = 300;
const EMBLEM_W = Math.round((EMBLEM_H * 762) / 909);
const WORD_W = 450;
const WORD_H = Math.round((WORD_W * 104) / 1077);
/** Official WhatsApp number from thefireknight.in (read Nov 2026). */
const WHATSAPP = "+91 79080 54311";

export const T7Hero: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 100, E.cam);
  const cam = {
    z: ip(p, [0, 1], [0.95, HERO.z]) + prog(f, 100, 323) * 0.025,
    cx: HERO.cx,
    cy: ip(p, [0, 1], [TRUCK.y + 310, HERO.cy]),
    ax: 540,
    ay: ip(p, [0, 1], [1150, HERO.ay]),
  };
  const scroll = f * 3; // the truck keeps rolling, slowly
  const accent = prog(f, 30, 80, E.out);
  const em = prog(f, T_LOGO, T_LOGO + 16, E.out);
  const sheen = ip(f, [T_LOGO + 12, T_LOGO + 40], [-30, 130], E.inOut);
  const wm = prog(f, T_LOGO + 14, T_LOGO + 28, E.out);
  const tag = prog(f, T_LOGO + 41, T_LOGO + 53, E.out); // "Because every second matters" 34.40 s
  const cta = prog(f, T_CTA, T_CTA + 14, E.out);
  const ctaPulse = f > T_CTA + 14 ? 0.5 + 0.5 * Math.sin((f - T_CTA) * 0.12) : 0;
  const emblemSrc = staticFile("brand/emblem.png");
  const top = 400;
  const tagTop = top + EMBLEM_H + 40 + WORD_H + 40;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: ip(f, [0, 12], [0.4, 1]) }}>
        <World
          t={f + 883}
          cam={cam}
          machine="truck"
          setting="highway"
          scroll={scroll}
          wheelAngle={scroll * 1.15}
          headlights={1}
          rim={ip(f, [0, 40], [0.6, 1])}
          accent={accent}
          towers={1}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.96) 0px, rgba(0,0,0,0.9) 900px, rgba(0,0,0,0) 1130px)", opacity: Math.max(prog(f, 0, 12) * 0.75, prog(f, 84, 98)) }}
      />

      {/* the line */}
      <Stack top={380}>
        <TypeOn words={["Kyunki", "aapka", "business"]} at={7} out={86} perLetter={0.8} color={C.fa} />
        <TypeOn words={["sirf", "regular", "safety", "ke"]} at={34} out={86} perLetter={0.7} color={C.fa} />
        <Display words={[{ w: "BHAROSE", c: C.gold }]} at={56} out={86} />
        <TypeOn words={["nahi", "chalna", "chahiye."]} at={68} out={86} perLetter={0.6} color={C.fa} />
      </Stack>

      {/* emblem + sheen */}
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
      <div
        style={{
          position: "absolute",
          left: 540 - WORD_W / 2,
          top: top + EMBLEM_H + 40,
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
          top: tagTop,
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

      {/* CTA: free consultation on WhatsApp */}
      <div
        style={{
          position: "absolute",
          left: SAFE.x0,
          width: SAFE.x1 - SAFE.x0,
          top: tagTop + 74,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          opacity: cta,
          translate: `0 ${(1 - cta) * 24}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 30px",
            borderRadius: 999,
            border: `2px solid ${C.gold}`,
            background: `rgba(240,178,66,${0.1 + 0.08 * ctaPulse})`,
            boxShadow: `0 0 ${18 * ctaPulse}px rgba(240,178,66,0.35)`,
            fontFamily: FONT.sans,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontWeight: 500, fontSize: 30, color: C.fa }}>WhatsApp</span>
          <span style={{ fontWeight: 700, fontSize: 32, color: C.gold, letterSpacing: "0.01em" }}>{WHATSAPP}</span>
        </div>
        <Label style={{ fontSize: 22 }}>Free consultation · thefireknight.in</Label>
      </div>
    </AbsoluteFill>
  );
};
