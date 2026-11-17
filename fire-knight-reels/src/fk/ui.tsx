import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { C, E, FONT, SAFE, ip, prog, rand } from "./theme";

/* ------------------------------------------------------------------ */
/* Masked word reveal: each word rises out of its own clipping slot.   */
/* ------------------------------------------------------------------ */
export type Word = { w: string; c?: string };

export const RevealLine: React.FC<{
  words: (string | Word)[];
  start: number; // local frame
  end?: number; // local frame the line exits (optional)
  stagger?: number;
  dur?: number;
  style?: React.CSSProperties;
  exit?: "up" | "blur";
}> = ({ words, start, end, stagger = 2, dur = 14, style, exit = "up" }) => {
  const f = useCurrentFrame();
  const list = words.map((x) => (typeof x === "string" ? { w: x } : x));
  const outP = end !== undefined ? prog(f, end, end + 9, E.in) : 0;
  return (
    <div style={{ display: "flex", flexWrap: "nowrap", whiteSpace: "nowrap", ...style }}>
      {list.map((x, i) => {
        const p = prog(f, start + i * stagger, start + i * stagger + dur, E.out);
        const ty = (1 - p) * 118 - (exit === "up" ? outP * 118 : 0);
        const hidden = p <= 0 || (exit === "up" && outP >= 1);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: "0.08em",
              marginBottom: "-0.08em",
              marginRight: i < list.length - 1 ? "0.24em" : 0,
              verticalAlign: "top",
            }}
          >
            <span
              style={{
                display: "inline-block",
                translate: `0 ${ty}%`,
                color: x.c,
                filter: exit === "blur" && outP > 0 ? `blur(${outP * 14}px)` : p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
                opacity: hidden ? 0 : exit === "blur" ? 1 - outP : 1,
              }}
            >
              {x.w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Big condensed slam headline with a heavy-to-settled impact. */
export const Slam: React.FC<{
  children: React.ReactNode;
  at: number;
  out?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, at, out, size = 168, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 7, E.out);
  const o = out !== undefined ? prog(f, out, out + 8, E.in) : 0;
  if (f < at) return null;
  return (
    <div
      style={{
        fontFamily: FONT.slam,
        fontSize: size,
        lineHeight: 0.9,
        textTransform: "uppercase",
        color: C.white,
        whiteSpace: "nowrap",
        letterSpacing: "0.005em",
        opacity: Math.min(1, p * 3) * (1 - o),
        scale: `${1.22 - 0.22 * p}`,
        filter: p < 1 || o > 0 ? `blur(${(1 - p) * 14 + o * 16}px)` : undefined,
        transformOrigin: "0% 50%",
        translate: `0 ${-o * 40}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Mono micro label. */
export const Mono: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; bold?: boolean }> = ({
  children,
  style,
  bold = true,
}) => (
  <div
    style={{
      fontFamily: FONT.mono,
      fontWeight: bold ? 700 : 400,
      fontSize: 22,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: C.ash,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Persistent brand header                                             */
/* ------------------------------------------------------------------ */
export const Header: React.FC<{ scene: number; opacity: number }> = ({ scene, opacity }) => {
  const f = useCurrentFrame();
  const pulse = 0.6 + 0.4 * Math.abs(Math.sin(f * 0.11));
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.x0,
        width: SAFE.x1 - SAFE.x0,
        top: SAFE.y0,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 12, height: 12, borderRadius: 6, background: C.ember, opacity: pulse }} />
        <Mono style={{ color: C.white, opacity: 0.85 }}>The Fire Knight</Mono>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          border: `1.5px solid ${C.line}`,
          borderRadius: 999,
          padding: "8px 16px",
          background: "rgba(11,11,12,0.55)",
        }}
      >
        <Mono style={{ fontSize: 19, color: C.ash }}>Operator Akela</Mono>
        <div style={{ display: "flex", gap: 5 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                width: i === scene ? 18 : 7,
                height: 7,
                borderRadius: 4,
                background: i === scene ? C.ember : i < scene ? C.ash : C.line,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Film finish                                                          */
/* ------------------------------------------------------------------ */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const f = useCurrentFrame();
  const ox = Math.floor(rand(f * 1.7) * 512);
  const oy = Math.floor(rand(f * 3.3 + 9) * 512);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile("tex/grain.png")})`,
        backgroundPosition: `${ox}px ${oy}px`,
        backgroundSize: "512px 512px",
        mixBlendMode: "overlay",
        opacity: opacity * 2.2,
        pointerEvents: "none",
      }}
    />
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.75 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 85% 70% at 50% 52%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

/** Darkens the top band so headlines always sit on a calm field. */
export const TopShade: React.FC<{ opacity?: number; to?: number }> = ({ opacity = 1, to = 820 }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(11,11,12,0.92) 0px, rgba(11,11,12,0.75) ${to * 0.6}px, rgba(11,11,12,0) ${to}px)`,
      opacity,
      pointerEvents: "none",
    }}
  />
);

/** Instagram safe-area guide, for previews only (prop showSafe). */
export const SafeGuide: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 270, background: "rgba(255,0,80,0.22)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1470, bottom: 0, background: "rgba(255,0,80,0.22)" }} />
    <div style={{ position: "absolute", left: 960, width: 120, top: 270, height: 1200, background: "rgba(255,0,80,0.14)" }} />
    <div
      style={{
        position: "absolute",
        left: SAFE.x0,
        top: SAFE.y0,
        width: SAFE.x1 - SAFE.x0,
        height: SAFE.y1 - SAFE.y0,
        outline: "3px dashed #00E5FF",
      }}
    />
  </AbsoluteFill>
);

/** Corner-bracket reticle (thermal camera / detection frame). */
export const Reticle: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  p?: number; // 0..1 draw-in
  len?: number;
  thick?: number;
}> = ({ x, y, w, h, color = C.white, p = 1, len = 44, thick = 4 }) => {
  const L = len * p;
  const s: React.CSSProperties = { position: "absolute", background: color };
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: Math.min(1, p * 2) }}>
      <div style={{ ...s, left: 0, top: 0, width: L, height: thick }} />
      <div style={{ ...s, left: 0, top: 0, width: thick, height: L }} />
      <div style={{ ...s, right: 0, top: 0, width: L, height: thick }} />
      <div style={{ ...s, right: 0, top: 0, width: thick, height: L }} />
      <div style={{ ...s, left: 0, bottom: 0, width: L, height: thick }} />
      <div style={{ ...s, left: 0, bottom: 0, width: thick, height: L }} />
      <div style={{ ...s, right: 0, bottom: 0, width: L, height: thick }} />
      <div style={{ ...s, right: 0, bottom: 0, width: thick, height: L }} />
    </div>
  );
};

/** A thin ember line that sweeps across, used to "cut" a reveal. */
export const SweepLine: React.FC<{ at: number; y: number; dur?: number; width?: number }> = ({
  at,
  y,
  dur = 10,
  width = 820,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.inOut);
  if (p <= 0 || p >= 1) return null;
  const a = ip(p, [0, 0.5, 1], [0, 1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.x0 - 40 + p * (width + 80) - 260,
        top: y,
        width: 260,
        height: 3,
        background: `linear-gradient(90deg, rgba(255,90,31,0), ${C.ember}, #FFE0C8)`,
        opacity: a,
      }}
    />
  );
};
