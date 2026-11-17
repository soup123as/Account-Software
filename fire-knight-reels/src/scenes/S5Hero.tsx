import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { World } from "../fk/World";
import { C, E, FONT, SAFE, ip, prog } from "../fk/theme";
import { S4_CAM } from "./S4System";
import { RevealLine } from "../fk/ui";

const HERO = { z: 0.96, cx: 547, cy: 1100, ax: 540, ay: 838 };

/** Scene 5 | 16-20 s - hero dumper, ember accent, brand lockup. */
export const S5Hero: React.FC<{ logoSrc?: string | null }> = ({ logoSrc }) => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 48, E.cam);
  const settle = prog(f, 48, 120);
  const cam = {
    z: ip(p, [0, 1], [S4_CAM.z + 0.12, HERO.z]) + settle * 0.035,
    cx: ip(p, [0, 1], [S4_CAM.cx - 10, HERO.cx]),
    cy: ip(p, [0, 1], [S4_CAM.cy, HERO.cy]),
    ax: 540,
    ay: ip(p, [0, 1], [S4_CAM.ay, HERO.ay]),
  };
  const accent = prog(f, 26, 56, E.out);

  // wordmark letters rise in, tracking tightens
  const name = "THE FIRE KNIGHT";
  const track = ip(f, [40, 76], [0.22, 0.04], E.out);

  return (
    <AbsoluteFill>
      <World
        t={f + 480}
        cam={cam}
        headlights={1}
        rim={ip(f, [0, 40], [0.5, 1])}
        accent={accent}
        towers={1}
        crush={ip(f, [0, 30], [0.5, 0])}
      />
      {/* restrained ember key light raking the front of the truck + ground spill */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 420px 160px at 900px 1040px, rgba(255,90,31,${0.16 * accent}) 0%, rgba(255,90,31,0) 100%)`,
          mixBlendMode: "screen",
        }}
      />
      {/* floor fade for the lockup */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(11,11,12,0) 1040px, rgba(11,11,12,0.86) 1160px, rgba(11,11,12,0.95) 1920px)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(11,11,12,0.85) 0px, rgba(11,11,12,0) 560px)",
        }}
      />

      {/* lockup */}
      <div
        style={{
          position: "absolute",
          left: SAFE.x0,
          width: SAFE.x1 - SAFE.x0,
          top: 1150,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {logoSrc ? (
          <Img
            src={logoSrc.startsWith("http") ? logoSrc : staticFile(logoSrc)}
            style={{
              height: 150,
              objectFit: "contain",
              opacity: prog(f, 40, 52),
              scale: `${ip(f, [40, 60], [1.08, 1], E.out)}`,
              filter: f < 54 ? `blur(${(1 - prog(f, 40, 54)) * 12}px)` : undefined,
            }}
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                background: C.ember,
                scale: `${ip(f, [36, 46], [0, 1], E.out)}`,
                boxShadow: `0 0 ${24 * prog(f, 40, 60)}px rgba(255,90,31,0.7)`,
              }}
            />
            <div
              style={{
                fontFamily: FONT.slam,
                fontSize: 124,
                lineHeight: 1,
                color: C.white,
                letterSpacing: `${track}em`,
                whiteSpace: "nowrap",
                display: "flex",
              }}
            >
              {name.split("").map((ch, i) => {
                const q = prog(f, 40 + i * 1.2, 52 + i * 1.2, E.out);
                return (
                  <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: 6, marginBottom: -6 }}>
                    <span
                      style={{
                        display: "inline-block",
                        translate: `0 ${(1 - q) * 110}%`,
                        opacity: q > 0 ? 1 : 0,
                        minWidth: ch === " " ? "0.28em" : undefined,
                      }}
                    >
                      {ch === " " ? " " : ch}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
        {/* ember rule */}
        <div
          style={{
            marginTop: 22,
            height: 3,
            width: 560 * prog(f, 54, 74, E.out),
            background: `linear-gradient(90deg, rgba(255,90,31,0), ${C.ember}, rgba(255,90,31,0))`,
          }}
        />
        <div style={{ marginTop: 26 }}>
          <RevealLine
            words={["Because", "every", { w: "second", c: C.heat }, "matters."]}
            start={64}
            stagger={3}
            style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 54, color: C.white, justifyContent: "center" }}
          />
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: "0.22em",
            color: C.ash,
            opacity: prog(f, 80, 92),
          }}
        >
          THEFIREKNIGHT.IN
        </div>
      </div>
    </AbsoluteFill>
  );
};
