import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { METRICS } from "./metrics";
import { C, E, FONT, SAFE, TYPE, ip, prog, rand } from "./theme";

/**
 * Caption lines never leave the safe box: shrink this line's font size until it fits.
 * Widths come from the fonts' own glyph advances (src/fk/metrics.ts), so every render tab
 * computes the same size on every frame - no dependence on font-load timing.
 */
const MAX_W = SAFE.x1 - SAFE.x0;
const textWidthEm = (text: string, face: string, letterSpacingEm: number) => {
  const m = METRICS[face];
  let w = 0;
  for (const ch of text) w += (m[ch] ?? m["n"] ?? 0.55) + letterSpacingEm;
  return w;
};
const fitSize = (text: string, size: number, face: string, letterSpacingEm: number, maxW = MAX_W) => {
  const w = textWidthEm(text, face, letterSpacingEm) * size * 1.02;
  return w > maxW ? Math.floor((size * maxW) / w) : size;
};

export type Word = { w: string; c?: string };
const norm = (words: (string | Word)[]) => words.map((x) => (typeof x === "string" ? { w: x } : x));

/* ------------------------------------------------------------------ */
/* Lead line: DM Sans, typed on letter by letter.                      */
/* Each letter: x+18px -> 0, blur 14 -> 0 over 4 frames, ~1 frame apart.*/
/* ------------------------------------------------------------------ */
export const TypeOn: React.FC<{
  words: (string | Word)[];
  at: number;
  out?: number;
  size?: number;
  weight?: number;
  color?: string;
  perLetter?: number; // frames between letters
  style?: React.CSSProperties;
  maxWidth?: number;
}> = ({ words, at, out, size: size0 = TYPE.lead, weight = 600, color = C.white, perLetter = 1.05, style, maxWidth }) => {
  const f = useCurrentFrame();
  const list = norm(words);
  const size = fitSize(list.map((x) => x.w).join(" "), size0, `dm${weight >= 650 ? 700 : weight >= 550 ? 600 : weight >= 450 ? 500 : 400}`, -0.02, maxWidth);
  const o = out !== undefined ? prog(f, out, out + 7, E.in) : 0;
  if (f < at - 1) return null;
  // after the exit, keep the line's space so the lines below never jump up
  if (o >= 1) return <div style={{ fontSize: size, lineHeight: 1.16, visibility: "hidden", ...style }}>.</div>;
  let k = 0;
  return (
    <div
      style={{
        fontFamily: FONT.sans,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.16,
        letterSpacing: "-0.02em",
        color,
        whiteSpace: "nowrap",
        opacity: 1 - o,
        filter: o > 0 ? `blur(${o * 12}px)` : undefined,
        translate: `0 ${-o * 24}px`,
        ...style,
      }}
    >
      {list.map((x, wi) => (
        <span key={wi} style={{ color: x.c, display: "inline-block", marginRight: wi < list.length - 1 ? "0.26em" : 0 }}>
          {x.w.split("").map((ch, ci) => {
            const t0 = at + k++ * perLetter;
            const p = prog(f, t0, t0 + 4, E.out);
            return (
              <span
                key={ci}
                style={{
                  display: "inline-block",
                  opacity: p,
                  translate: `${(1 - p) * 18}px 0`,
                  filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
                }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Display hit: Anton caps, each word rises out of a mask.             */
/* ------------------------------------------------------------------ */
export const Display: React.FC<{
  words: (string | Word)[];
  at: number;
  out?: number;
  size?: number;
  stagger?: number;
  color?: string;
  style?: React.CSSProperties;
  maxWidth?: number;
}> = ({ words, at, out, size: size0 = TYPE.display, stagger = 3, color = C.white, style, maxWidth }) => {
  const f = useCurrentFrame();
  const list = norm(words);
  // Anton caps; word gaps are 0.22em margins (~ a space)
  // word gaps are 0.22em margins, about one space each
  const size = fitSize(list.map((x) => x.w.toUpperCase()).join(" "), size0, "anton", 0.01, maxWidth);
  const o = out !== undefined ? prog(f, out, out + 7, E.in) : 0;
  if (f < at - 1) return null;
  if (o >= 1) return <div style={{ fontFamily: FONT.display, fontSize: size, lineHeight: 1.02, visibility: "hidden", ...style }}>.</div>;
  return (
    <div
      style={{
        fontFamily: FONT.display,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: "0.01em",
        textTransform: "uppercase",
        color,
        whiteSpace: "nowrap",
        display: "flex",
        ...style,
      }}
    >
      {list.map((x, i) => {
        const p = prog(f, at + i * stagger, at + i * stagger + 9, E.out);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: "0.06em",
              marginBottom: "-0.06em",
              marginRight: i < list.length - 1 ? "0.22em" : 0,
            }}
          >
            <span
              style={{
                display: "inline-block",
                color: x.c,
                opacity: p > 0 ? 1 : 0,
                translate: `0 ${(1 - p) * 110 - o * 110}%`,
                scale: `${1.06 - 0.06 * p}`,
                filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
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

/** Small spaced caps label (DM Sans). */
export const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      fontFamily: FONT.sans,
      fontWeight: 600,
      fontSize: TYPE.label,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: C.ash,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Text block anchored to the safe box, left aligned. */
export const Stack: React.FC<{ top?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  top = 360,
  children,
  style,
}) => (
  <div style={{ position: "absolute", left: SAFE.x0, top, width: SAFE.x1 - SAFE.x0, ...style }}>{children}</div>
);

/* ------------------------------------------------------------------ */
/* Film finish                                                          */
/* ------------------------------------------------------------------ */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
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

/** Calm black field behind the text stack at the top. */
export const TopShade: React.FC<{ opacity?: number; to?: number }> = ({ opacity = 1, to = 820 }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(0,0,0,0.94) 0px, rgba(0,0,0,0.78) ${to * 0.6}px, rgba(0,0,0,0) ${to}px)`,
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

/** Hairline corner brackets (thermal viewfinder / detection lock). */
export const Reticle: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  p?: number;
  len?: number;
  thick?: number;
}> = ({ x, y, w, h, color = "rgba(250,250,250,0.7)", p = 1, len = 36, thick = 2 }) => {
  const L = len * p;
  const s: React.CSSProperties = { position: "absolute", background: color };
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: ip(p, [0, 0.4], [0, 1]) }}>
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

/* ------------------------------------------------------------------ */
/* THERMAL SCAN REVEAL - the signature text animation (v6).            */
/* A thin gold scanner line sweeps down through the block; text above  */
/* the line is revealed, letters inside the scan band glow gold and    */
/* cool to white. Exit: the scanner sweeps down again and wipes it.    */
/* A soft black plate sits behind so text stays legible over machines. */
/* ------------------------------------------------------------------ */
const GOLD_CSS = `.fk-gold, .fk-gold * { color: ${C.gold} !important; }`;

export const ScanReveal: React.FC<{
  at: number;
  out?: number;
  dur?: number;
  outDur?: number;
  plate?: boolean;
  /** Frame for an extra scanner pass over already-visible text (first-frame poster). */
  glintAt?: number;
  children: React.ReactNode;
}> = ({ at, out, dur = 16, outDur = 12, plate = true, glintAt, children }) => {
  const f = useCurrentFrame();
  const g = glintAt !== undefined ? prog(f, glintAt, glintAt + dur + 4, E.inOut) : 0;
  const pIn = prog(f, at, at + dur, E.inOut);
  const glinting = g > 0 && g < 1 && pIn >= 1;
  const p = glinting ? g : pIn;
  const o = out !== undefined ? prog(f, out, out + outDur, E.inOut) : 0;
  if (f < at - 1 || o >= 1) return null;
  const band = 0.22;
  const inScan = p > 0 && p < 1;
  const outScan = o > 0 && o < 1;
  const bandFade = p < 1 ? 1 : 1 - prog(f, at + dur, at + dur + 8);
  const beamY = inScan ? p : outScan ? o : -1;
  const clipIn = `inset(${o * 100}% -40px ${(glinting ? 0 : 1 - p) * 100}% -40px)`;
  const goldTop = inScan ? Math.max(0, p - band) : outScan ? o : 0;
  const goldBot = inScan ? 1 - p : outScan ? 1 - Math.min(1, o + band) : 1;
  return (
    <div style={{ position: "relative" }}>
      <style>{GOLD_CSS}</style>
      {plate && (
        <div
          style={{
            position: "absolute",
            left: -160,
            right: -120,
            top: -90,
            bottom: -90,
            background: "radial-gradient(ellipse 60% 62% at 38% 50%, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0) 100%)",
            opacity: Math.min(1, pIn * 1.6) * (1 - o),
          }}
        />
      )}
      <div style={{ position: "relative", clipPath: clipIn }}>{children}</div>
      {(inScan || outScan || bandFade > 0) && (
        <div
          className="fk-gold"
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `inset(${goldTop * 100}% -40px ${goldBot * 100}% -40px)`,
            opacity: inScan || outScan ? 1 : bandFade * 0,
            filter: "blur(0.4px)",
          }}
        >
          {children}
        </div>
      )}
      {beamY >= 0 && (
        <div
          style={{
            position: "absolute",
            left: -28,
            right: -28,
            top: `${beamY * 100}%`,
            height: 2,
            background: `linear-gradient(90deg, rgba(240,178,66,0) 0%, ${C.gold} 12%, #FFE7B0 50%, ${C.gold} 88%, rgba(240,178,66,0) 100%)`,
            boxShadow: "0 0 14px 2px rgba(240,178,66,0.55)",
          }}
        />
      )}
    </div>
  );
};

const words = (list: (string | Word)[]) =>
  norm(list).map((x, i, a) => (
    <span key={i} style={{ color: x.c }}>
      {x.w}
      {i < a.length - 1 ? " " : ""}
    </span>
  ));

/** Static DM Sans lead line (animate it with ScanReveal). */
export const Line: React.FC<{ w: (string | Word)[]; size?: number; color?: string; weight?: number }> = ({
  w,
  size = TYPE.lead,
  color = C.fa,
  weight = 600,
}) => (
  <div style={{ fontFamily: FONT.sans, fontWeight: weight, fontSize: size, lineHeight: 1.16, letterSpacing: "-0.02em", color, whiteSpace: "nowrap" }}>
    {words(w)}
  </div>
);

/** Static Anton display hit (animate it with ScanReveal). */
export const Hit: React.FC<{ w: (string | Word)[]; size?: number; color?: string }> = ({ w, size = TYPE.display, color = C.white }) => (
  <div style={{ fontFamily: FONT.display, fontSize: size, lineHeight: 1.04, letterSpacing: "0.01em", textTransform: "uppercase", color, whiteSpace: "nowrap" }}>
    {words(w)}
  </div>
);
