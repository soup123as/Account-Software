import React from "react";
import { useCurrentFrame } from "remotion";
import { METRICS } from "../fk/metrics";
import { C, E, FONT, REAL, SAFE, ip, prog } from "../fk/theme";

/**
 * "Cards" kit: the fast, card-by-card reel grammar (headline stack, flat cards that build on the
 * spoken word, stamps, a meter, word-by-word captions) in The Fire Knight's own system:
 * black ground, DM Sans + Anton, gold as the one accent. Red is only used as a real warning colour.
 */
export const RED = REAL.lampRed;
export const STEEL = "#111316";
export const LINE = "rgba(250,250,250,0.1)";
const W = SAFE.x1 - SAFE.x0;

const width = (text: string, face: string, size: number, ls = 0) => {
  const m = METRICS[face];
  let w = 0;
  for (const ch of text) w += ((m[ch] ?? m["n"] ?? 0.5) + ls) * size;
  return w;
};

export type Wd = string | { w: string; c?: string };
const norm = (l: Wd[]) => l.map((x) => (typeof x === "string" ? { w: x } : x));

/* ------------------------------------------------------------------ */
/* Entrances: every element arrives on its word.                        */
/* ------------------------------------------------------------------ */
type Kind = "blur" | "pop" | "slide" | "drop" | "slam" | "stamp";
const fxStyle = (f: number, at: number, kind: Kind, out?: number, dx = 0, dy = 40, rot = -6): React.CSSProperties | null => {
  if (f < at) return null;
  const o = out !== undefined ? prog(f, out, out + 4, E.in) : 0;
  if (o >= 1) return null;
  const base: React.CSSProperties = {};
  const lt = f - at;
  if (kind === "blur") {
    const p = prog(lt, 0, 6, E.out);
    Object.assign(base, { opacity: p, filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined, translate: `0 ${(1 - p) * 14}px` });
  } else if (kind === "slam") {
    const p = prog(lt, 0, 5, E.out);
    Object.assign(base, { opacity: Math.min(1, p * 3), filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined, scale: `${1.28 - 0.28 * p}` });
  } else if (kind === "pop") {
    const p = prog(lt, 0, 9);
    const back = 1 + 2.9 * Math.pow(p - 1, 3) + 1.9 * Math.pow(p - 1, 2);
    Object.assign(base, { opacity: Math.min(1, lt / 2.5), scale: `${0.6 + 0.4 * back}` });
  } else if (kind === "slide") {
    const p = prog(lt, 0, 11, E.out);
    Object.assign(base, { opacity: Math.min(1, p * 1.8), translate: `${(1 - p) * dx}px ${(1 - p) * dy}px` });
  } else if (kind === "drop") {
    const p = prog(lt, 0, 12);
    const back = 1 + 2.9 * Math.pow(p - 1, 3) + 1.9 * Math.pow(p - 1, 2);
    Object.assign(base, { opacity: Math.min(1, p * 2.5), translate: `0 ${(1 - back) * -60}px` });
  } else {
    const p = prog(lt, 0, 5, E.out);
    const q = lt - 5;
    const sh = q > 0 && q < 6 ? Math.sin(q * 3.1) * 6 * (1 - q / 6) : 0;
    Object.assign(base, { opacity: Math.min(1, p * 2), translate: `${sh}px ${sh * 0.4}px`, rotate: `${rot}deg`, scale: `${1.9 - 0.9 * p}` });
  }
  if (o > 0) {
    base.opacity = ((base.opacity as number) ?? 1) * (1 - o);
    base.filter = `blur(${o * 10}px)`;
  }
  return base;
};

export const Fx: React.FC<{ at: number; kind?: Kind; out?: number; dx?: number; dy?: number; rot?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  at,
  kind = "slide",
  out,
  dx,
  dy,
  rot,
  style,
  children,
}) => {
  const f = useCurrentFrame();
  const s = fxStyle(f, at, kind, out, dx, dy, rot);
  if (!s) return null;
  return <div style={{ position: "absolute", ...style, ...s }}>{children}</div>;
};

/* ------------------------------------------------------------------ */
/* Headline stack: one small line, then Anton lines that slam in.       */
/* ------------------------------------------------------------------ */
export const Head: React.FC<{ small?: string; lines: Wd[][]; at: number; ats?: number[]; out?: number; size?: number; top?: number }> = ({ small, lines, at, ats, out, size = 128, top = 368 }) => {
  const f = useCurrentFrame();
  const o = out !== undefined ? prog(f, out, out + 4, E.in) : 0;
  if (f < at || o >= 1) return null;
  const ps = prog(f, at, at + 6, E.out);
  return (
    <div style={{ position: "absolute", left: SAFE.x0, top, width: W, opacity: 1 - o, filter: o > 0 ? `blur(${o * 10}px)` : undefined }}>
      {small && (
        <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 42, letterSpacing: "-0.02em", color: C.fa, opacity: 0.72 * ps, filter: ps < 1 ? `blur(${(1 - ps) * 10}px)` : undefined, translate: `0 ${(1 - ps) * 12}px`, whiteSpace: "nowrap", marginBottom: 6 }}>
          {small}
        </div>
      )}
      {lines.map((ln, i) => {
        const list = norm(ln);
        const text = list.map((x) => x.w.toUpperCase()).join(" ");
        const w = width(text, "anton", size, 0.01) * 1.02;
        const sz = w > W ? Math.floor((size * W) / w) : size;
        const t0 = ats?.[i] ?? at + 3 + i * 4;
        if (f < t0) return <div key={i} style={{ height: sz * 0.98 }} />;
        const p = prog(f, t0, t0 + 5, E.out);
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT.display,
              fontSize: sz,
              lineHeight: 0.98,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              color: C.white,
              whiteSpace: "nowrap",
              transformOrigin: "0 60%",
              opacity: Math.min(1, p * 3),
              scale: `${1.24 - 0.24 * p}`,
              filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
            }}
          >
            {list.map((x, k) => (
              <span key={k} style={{ color: x.c }}>
                {x.w}
                {k < list.length - 1 ? " " : ""}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Cards, tags, stamps, rows                                            */
/* ------------------------------------------------------------------ */
export const Card: React.FC<{ w: number; h: number; gold?: boolean; red?: boolean; paper?: boolean; pad?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, h, gold, red, paper, pad = 22, style, children }) => (
  <div
    style={{
      position: "relative",
      width: w,
      height: h,
      boxSizing: "border-box",
      padding: pad,
      borderRadius: 26,
      background: paper ? "#F4F2EC" : `linear-gradient(180deg, #15181c 0%, ${STEEL} 100%)`,
      border: `1.5px solid ${gold ? C.gold : red ? "rgba(227,40,28,0.8)" : paper ? "transparent" : LINE}`,
      boxShadow: gold ? "0 0 34px rgba(240,178,66,0.18), 0 24px 60px rgba(0,0,0,0.6)" : "0 24px 60px rgba(0,0,0,0.6)",
      color: paper ? "#141414" : C.fa,
      fontFamily: FONT.sans,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Tag: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = C.ash, size = 19, style }) => (
  <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: size, letterSpacing: "0.16em", textTransform: "uppercase", color, whiteSpace: "nowrap", ...style }}>{children}</div>
);

export const Chip: React.FC<{ children: React.ReactNode; color?: string; fill?: boolean; size?: number }> = ({ children, color = C.fa, fill, size = 20 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 14px",
      borderRadius: 9,
      border: `1.5px solid ${color}`,
      background: fill ? color : "transparent",
      color: fill ? "#111" : color,
      fontFamily: FONT.sans,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

export const Stamp: React.FC<{ at: number; x: number; y: number; color?: string; rot?: number; size?: number; children: React.ReactNode }> = ({ at, x, y, color = RED, rot = -6, size = 46, children }) => (
  <Fx at={at} kind="stamp" rot={rot} style={{ left: x, top: y }}>
    <div
      style={{
        padding: "8px 20px 4px",
        border: `4px solid ${color}`,
        borderRadius: 8,
        background: "rgba(0,0,0,0.78)",
        color,
        fontFamily: FONT.display,
        fontSize: size,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        lineHeight: 1.05,
      }}
    >
      {children}
    </div>
  </Fx>
);

/** One line of a checklist: name, note, and a verdict tag that flips at `flip`. */
export const Row: React.FC<{ w: number; name: string; note: string; flip: number; ok?: boolean; before?: string; after: string }> = ({ w, name, note, flip, ok, before = "…", after }) => {
  const f = useCurrentFrame();
  const on = f >= flip;
  const col = ok ? C.gold : RED;
  const p = prog(f, flip, flip + 6, E.out);
  return (
    <Card w={w} h={74} pad={0} red={on && !ok} gold={on && ok} style={{ borderRadius: 18, display: "flex", alignItems: "center", padding: "0 20px" }}>
      <div style={{ fontWeight: 700, fontSize: 30, letterSpacing: "-0.01em", width: 200 }}>{name}</div>
      <div style={{ fontWeight: 500, fontSize: 26, opacity: 0.66, flex: 1 }}>{note}</div>
      <div style={{ scale: `${on ? 1.25 - 0.25 * p : 1}` }}>
        <Chip color={on ? col : "rgba(250,250,250,0.3)"} fill={on} size={18}>
          {on ? after : before}
        </Chip>
      </div>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Flat icons (drawn, never stock). Real colours for real things.       */
/* ------------------------------------------------------------------ */
export const IcoDetector: React.FC<{ t: number; ring?: number; size?: number }> = ({ t, ring = 1, size = 200 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 200 160">
    <line x1={10} y1={34} x2={190} y2={34} stroke="#3a3f45" strokeWidth={4} />
    <rect x={56} y={34} width={88} height={16} rx={5} fill="#cfd4d9" />
    <path d="M62 50 L70 78 Q100 92 130 78 L138 50 Z" fill="#aeb4ba" />
    <ellipse cx={100} cy={78} rx={30} ry={9} fill="#dfe3e6" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={72 + i * 10} y={56} width={4} height={14} rx={2} fill="#3b3f44" />
    ))}
    <circle cx={116} cy={80} r={5} fill="#FF2A1E" opacity={ring > 0 ? (Math.sin(t * 0.9) > 0 ? 1 : 0.2) : 0.25} />
    {ring > 0 &&
      [0, 1, 2].map((i) => {
        const ph = (t * 0.04 + i / 3) % 1;
        const r = 40 + ph * 54;
        return (
          <g key={i} opacity={(1 - ph) * ring}>
            <path d={`M${100 - r} 84 A ${r} ${r * 0.62} 0 0 0 ${100 - r * 0.62} ${84 + r * 0.48}`} stroke={C.fa} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d={`M${100 + r} 84 A ${r} ${r * 0.62} 0 0 1 ${100 + r * 0.62} ${84 + r * 0.48}`} stroke={C.fa} strokeWidth={4} fill="none" strokeLinecap="round" />
          </g>
        );
      })}
  </svg>
);

export const IcoPhone: React.FC<{ t: number; ring?: number; size?: number; struck?: number }> = ({ t, ring = 0, size = 150, struck = 0 }) => {
  const b = ring > 0 ? Math.sin(t * 2.4) * 4 * (Math.sin(t * 0.2) > 0 ? 1 : 0) : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 150 150">
      <g transform={`rotate(${b} 75 75)`}>
        <rect x={46} y={14} width={58} height={122} rx={13} fill="#0c0d0f" stroke="#c9ced3" strokeWidth={4} />
        <rect x={64} y={21} width={22} height={6} rx={3} fill="#c9ced3" />
        <circle cx={62} cy={112} r={9} fill="#E5383B" opacity={ring > 0 ? 1 : 0.25} />
        <circle cx={88} cy={112} r={9} fill="#30C85A" opacity={ring > 0 ? 1 : 0.25} />
        <rect x={56} y={44} width={38} height={6} rx={3} fill="#c9ced3" opacity={0.8} />
        <rect x={60} y={58} width={30} height={5} rx={2.5} fill="#c9ced3" opacity={0.4} />
      </g>
      {ring > 0 &&
        [0, 1].map((i) => {
          const ph = (t * 0.045 + i / 2) % 1;
          return (
            <g key={i} opacity={1 - ph}>
              <path d={`M${36 - ph * 18} 50 Q ${26 - ph * 22} 75 ${36 - ph * 18} 100`} stroke={C.fa} strokeWidth={4} fill="none" strokeLinecap="round" />
              <path d={`M${114 + ph * 18} 50 Q ${124 + ph * 22} 75 ${114 + ph * 18} 100`} stroke={C.fa} strokeWidth={4} fill="none" strokeLinecap="round" />
            </g>
          );
        })}
      {struck > 0 && <line x1={24} y1={126} x2={24 + 102 * struck} y2={126 - 102 * struck} stroke={C.gold} strokeWidth={8} strokeLinecap="round" />}
    </svg>
  );
};

export const IcoDoor: React.FC<{ size?: number; t: number }> = ({ size = 220, t }) => (
  <svg width={size} height={size} viewBox="0 0 220 220">
    <line x1={10} y1={208} x2={210} y2={208} stroke="#3a3f45" strokeWidth={4} />
    <rect x={46} y={22} width={104} height={186} fill="#1b1e22" stroke="#c9ced3" strokeWidth={4} />
    <rect x={112} y={44} width={22} height={66} rx={3} fill="#0d2238" stroke="#5c6670" strokeWidth={2} />
    <rect x={58} y={40} width={44} height={22} rx={3} fill="#e9edf2" />
    <rect x={63} y={47} width={34} height={3} fill="#141414" />
    <rect x={63} y={53} width={22} height={3} fill="#141414" />
    <rect x={56} y={110} width={8} height={30} rx={4} fill="#c9ced3" />
    <rect x={164} y={98} width={30} height={48} rx={6} fill="#17191c" stroke="#c9ced3" strokeWidth={3} />
    <circle cx={179} cy={110} r={5} fill="#FF2A1E" opacity={0.6 + 0.4 * Math.sin(t * 0.25)} />
    <rect x={171} y={122} width={16} height={16} rx={3} fill="#2a2e33" />
  </svg>
);

export const IcoKey: React.FC<{ size?: number; cross?: number; struck?: number }> = ({ size = 200, cross = 0, struck = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <g transform="rotate(-28 100 100)">
      <circle cx={62} cy={100} r={34} fill="none" stroke="#d9c07a" strokeWidth={14} />
      <rect x={94} y={93} width={86} height={14} rx={4} fill="#d9c07a" />
      <rect x={150} y={107} width={12} height={22} fill="#d9c07a" />
      <rect x={168} y={107} width={12} height={16} fill="#d9c07a" />
    </g>
    {cross > 0 && (
      <g stroke={RED} strokeWidth={12} strokeLinecap="round">
        <line x1={40} y1={40} x2={40 + 120 * Math.min(1, cross * 2)} y2={40 + 120 * Math.min(1, cross * 2)} />
        {cross > 0.5 && <line x1={160} y1={40} x2={160 - 120 * (cross * 2 - 1)} y2={40 + 120 * (cross * 2 - 1)} />}
      </g>
    )}
    {struck > 0 && <line x1={30} y1={170} x2={30 + 140 * struck} y2={170 - 140 * struck} stroke={C.gold} strokeWidth={10} strokeLinecap="round" />}
  </svg>
);

/** The Comodo as a flat icon: wall plate, black cylinder in a silver cradle, antenna, gauge, nozzles, sensor. */
export const IcoComodo: React.FC<{ w?: number; led?: string }> = ({ w = 170, led = "#3BEA6A" }) => (
  <svg width={w} height={w * 0.72} viewBox="0 0 250 180">
    <rect x={30} y={34} width={200} height={66} rx={5} fill="#c9ced3" />
    <rect x={8} y={14} width={8} height={62} rx={4} fill="#0c0c0d" stroke="#5a5f66" strokeWidth={1.5} />
    <rect x={6} y={50} width={218} height={44} rx={22} fill="#101113" stroke="#3a3d41" strokeWidth={2} />
    <rect x={22} y={56} width={170} height={4} rx={2} fill="#fff" opacity={0.3} />
    <path d="M92 50 h56 q10 0 14 10 l4 12 h-18 l-4 -8 h-52 z" fill="#dfe3e6" />
    <path d="M28 80 q0 16 16 16 h168 q16 0 16 -16 v10 q0 14 -16 14 h-168 q-16 0 -16 -14 z" fill="#dfe3e6" />
    <circle cx={200} cy={72} r={13} fill="#f6f6f2" stroke="#c9ced3" strokeWidth={3} />
    <line x1={200} y1={72} x2={194} y2={64} stroke="#111" strokeWidth={2} />
    {[66, 184].map((x) => (
      <polygon key={x} points={`${x - 8},100 ${x + 8},100 ${x + 5},118 ${x - 5},118`} fill="#aeb4ba" />
    ))}
    <rect x={102} y={106} width={56} height={36} rx={6} fill="#0e0f10" stroke="#3a3d41" strokeWidth={2} />
    <circle cx={122} cy={124} r={8} fill="#1d1f22" stroke="#5a5f66" strokeWidth={2} />
    <circle cx={144} cy={118} r={4} fill={led} />
  </svg>
);

export const Mark: React.FC<{ ok?: boolean; size?: number }> = ({ ok, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    {ok ? <path d="M4 12.5 10 18 20 6" fill="none" stroke="currentColor" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /> : <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth={3.4} strokeLinecap="round" />}
  </svg>
);

/**
 * The server room as a flat diagram: ceiling line with the detector, three racks, the electrical
 * panel on the right, and on the wall above it the slot / the unit. Drawn 820 x 250.
 */
export const RoomDiagram: React.FC<{ t: number; w?: number; h?: number; ring?: number; fire?: number; slot?: number; unit?: number; sense?: number; mist?: number; dark?: [number, number, number] }> = ({
  t,
  w = 776,
  h = 206,
  ring = 0,
  fire = 0,
  slot = 0,
  unit = 0,
  sense = 0,
  mist = 0,
  dark = [0, 0, 0],
}) => {
  const fl = 0.85 + 0.15 * Math.sin(t * 0.7);
  return (
    <svg width={w} height={h} viewBox="0 0 776 206">
      <line x1={0} y1={8} x2={776} y2={8} stroke="#3a3f45" strokeWidth={4} />
      <line x1={0} y1={198} x2={776} y2={198} stroke="#3a3f45" strokeWidth={4} />
      {/* detector */}
      <rect x={96} y={8} width={52} height={10} rx={3} fill="#cfd4d9" />
      <path d="M100 18 L106 32 Q122 40 138 32 L144 18 Z" fill="#aeb4ba" />
      <circle cx={131} cy={32} r={4} fill="#FF2A1E" opacity={ring > 0 ? (Math.sin(t * 0.9) > 0 ? 1 : 0.2) : 0.3} />
      {ring > 0 &&
        [0, 1].map((i) => {
          const ph = (t * 0.045 + i / 2) % 1;
          const r = 26 + ph * 34;
          return (
            <g key={i} opacity={(1 - ph) * ring}>
              <path d={`M${122 - r} 36 A ${r} ${r * 0.6} 0 0 0 ${122 - r * 0.6} ${36 + r * 0.46}`} stroke={C.fa} strokeWidth={3} fill="none" strokeLinecap="round" />
              <path d={`M${122 + r} 36 A ${r} ${r * 0.6} 0 0 1 ${122 + r * 0.6} ${36 + r * 0.46}`} stroke={C.fa} strokeWidth={3} fill="none" strokeLinecap="round" />
            </g>
          );
        })}
      {/* racks */}
      {[236, 322, 408].map((x, r) => (
        <g key={x}>
          <rect x={x} y={62} width={74} height={136} rx={5} fill="#0c0d0f" stroke="#c9ced3" strokeWidth={3} />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const on = Math.sin(t * (0.2 + ((i + r) % 3) * 0.13) + i * 2 + r) > -0.3 ? 1 : 0.25;
            const d = dark[r];
            return (
              <g key={i}>
                <rect x={x + 9} y={72 + i * 20} width={56} height={13} rx={2} fill="#1b1e22" />
                <circle cx={x + 52} cy={78.5 + i * 20} r={3} fill={d > 0.5 ? RED : "#35E06A"} opacity={d >= 1 ? (i % 3 === 0 ? 0.8 : 0) : on} />
                <circle cx={x + 60} cy={78.5 + i * 20} r={3} fill={d > 0.2 ? "#FFB020" : "#35E06A"} opacity={d >= 1 ? 0 : on * (i % 2 ? 1 : 0.5)} />
              </g>
            );
          })}
        </g>
      ))}
      {/* electrical panel */}
      <rect x={598} y={104} width={96} height={94} rx={5} fill="#aab0b5" stroke="#e3e6e9" strokeWidth={3} />
      <polygon points="646,120 662,148 630,148" fill="#F2C230" stroke="#1a1a1a" strokeWidth={2.5} strokeLinejoin="round" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={612} y={164 + i * 9} width={68} height={4} rx={2} fill="#4c5156" />
      ))}
      {/* slot on the wall */}
      {slot > 0 && unit <= 0 && <rect x={574} y={26} width={148} height={64} rx={8} fill="rgba(240,178,66,0.08)" stroke={C.gold} strokeWidth={3} strokeDasharray="10 8" strokeDashoffset={-t * 0.5} opacity={slot} />}
      {unit > 0 && (
        <g opacity={unit} transform="translate(586 22) scale(0.5)">
          <rect x={30} y={34} width={200} height={66} rx={5} fill="#c9ced3" />
          <rect x={8} y={14} width={8} height={62} rx={4} fill="#0c0c0d" stroke="#5a5f66" strokeWidth={1.5} />
          <rect x={6} y={50} width={218} height={44} rx={22} fill="#101113" stroke="#3a3d41" strokeWidth={2} />
          <path d="M92 50 h56 q10 0 14 10 l4 12 h-18 l-4 -8 h-52 z" fill="#dfe3e6" />
          <path d="M28 80 q0 16 16 16 h168 q16 0 16 -16 v10 q0 14 -16 14 h-168 q-16 0 -16 -14 z" fill="#dfe3e6" />
          {[66, 184].map((x) => (
            <polygon key={x} points={`${x - 8},100 ${x + 8},100 ${x + 5},118 ${x - 5},118`} fill="#aeb4ba" />
          ))}
          <rect x={102} y={106} width={56} height={30} rx={6} fill="#0e0f10" stroke="#3a3d41" strokeWidth={2} />
          <circle cx={144} cy={118} r={5} fill={mist > 0 ? RED : "#3BEA6A"} />
        </g>
      )}
      {sense > 0 && <polygon points="650,90 600,196 700,196" fill={C.fa} opacity={0.1 * sense * (0.7 + 0.3 * Math.sin(t * 0.3))} />}
      {mist > 0 && (
        <g opacity={Math.min(1, mist * 1.4)}>
          <polygon points="619,82 683,82 716,198 584,198" fill="#E9F3FA" opacity={0.16} />
          {Array.from({ length: 34 }).map((_, i) => {
            const s = i * 1.37;
            const a = ((t * 0.045 * (0.7 + (i % 5) * 0.12) + ((i * 37) % 100) / 100) % 1) * Math.min(1, mist * 1.3);
            const sx = i % 2 ? 683 : 619;
            return <circle key={i} cx={sx + (((i * 53) % 100) / 100 - 0.5) * 70 * a + (i % 2 ? 10 : -10) * a} cy={84 + a * 112} r={2 + (s % 2)} fill="#E9F3FA" opacity={0.8 * (1 - a * 0.6)} />;
          })}
        </g>
      )}
      {/* the fire at the panel */}
      {fire > 0 && (
        <g>
          <circle cx={646} cy={178} r={54 * fire * fl} fill={REAL.fireRed} opacity={0.2} />
          <circle cx={646} cy={180} r={34 * fire * fl} fill={REAL.fireOrange} opacity={0.5} />
          <path d={`M${646 - 20 * fire} 196 Q ${646 - 22 * fire} ${196 - 34 * fire} ${646 + 4 * Math.sin(t * 0.5)} ${196 - 70 * fire * fl} Q ${646 + 22 * fire} ${196 - 34 * fire} ${646 + 20 * fire} 196 Z`} fill={REAL.fireOrange} />
          <path d={`M${646 - 11 * fire} 196 Q ${646 - 12 * fire} ${196 - 20 * fire} ${646 + 2 * Math.sin(t * 0.6)} ${196 - 42 * fire * fl} Q ${646 + 12 * fire} ${196 - 20 * fire} ${646 + 11 * fire} 196 Z`} fill={REAL.fireYellow} />
          <ellipse cx={646} cy={194} rx={7 * fire} ry={5 * fire} fill={REAL.fireCore} />
        </g>
      )}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Header: a small brand line and the meter pill.                       */
/* ------------------------------------------------------------------ */
export const Header: React.FC<{ o?: number; children?: React.ReactNode }> = ({ o = 1, children }) => (
  <div style={{ position: "absolute", left: SAFE.x0, top: 298, width: W, height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: o }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 11, height: 11, borderRadius: "50%", background: C.gold }} />
      <Tag color="rgba(250,250,250,0.72)" size={20}>
        The Fire Knight
      </Tag>
    </div>
    {children}
  </div>
);

export const Pill: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = LINE }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, height: 44, padding: "0 18px", borderRadius: 22, background: "#121417", border: `1.5px solid ${color}` }}>{children}</div>
);

/* ------------------------------------------------------------------ */
/* Captions: the spoken words, a pill hopping from word to word.        */
/* ------------------------------------------------------------------ */
export type CapWord = { w: string; s: number; e: number; g: number; key?: boolean };

export const Captions: React.FC<{ words: CapWord[]; fps?: number; top?: number; hideAfter?: number }> = ({ words, fps = 30, top = 1372, hideAfter = 1e9 }) => {
  const f = useCurrentFrame();
  const t = f / fps;
  let i = -1;
  for (let k = 0; k < words.length; k++) {
    if (words[k].s <= t) i = k;
    else break;
  }
  if (i < 0 || t > hideAfter) return null;
  const cur = words[i];
  const grp = words.filter((x) => x.g === cur.g);
  const gEnd = grp[grp.length - 1].e;
  if (t - gEnd > 0.55) return null;
  const SIZE0 = 56;
  const face = "dm700";
  const gapEm = 0.3;
  const total0 = grp.reduce((a, x) => a + width(x.w, face, SIZE0, -0.01), 0) + gapEm * SIZE0 * (grp.length - 1);
  const size = total0 > 780 ? Math.floor((SIZE0 * 780) / total0) : SIZE0;
  const ws = grp.map((x) => width(x.w, face, size, -0.01));
  const gap = gapEm * size;
  const total = ws.reduce((a, b) => a + b, 0) + gap * (grp.length - 1);
  const xs: number[] = [];
  let x = 540 - total / 2;
  ws.forEach((w) => {
    xs.push(x);
    x += w + gap;
  });
  const idx = grp.indexOf(cur);
  const prev = Math.max(0, idx - 1);
  const h = prog(t, cur.s, cur.s + 0.07, E.out);
  const px = ip(h, [0, 1], [xs[prev], xs[idx]]);
  const pw = ip(h, [0, 1], [ws[prev], ws[idx]]);
  const gin = prog(t, grp[0].s, grp[0].s + 0.13, E.out);
  const padX = 12;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1080, height: size * 1.4, opacity: gin, filter: gin < 1 ? `blur(${(1 - gin) * 8}px)` : undefined, translate: `0 ${(1 - gin) * 12}px` }}>
      <div style={{ position: "absolute", left: px - padX, top: 0, width: pw + padX * 2, height: size * 1.36, borderRadius: 13, background: cur.key ? C.gold : C.fa }} />
      {[0, 1].map((layer) => (
        <div
          key={layer}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: size * 1.36,
            // the top layer is the same text in black, visible only inside the pill, so every frame of the hop reads
            clipPath: layer ? `inset(0 ${1080 - (px + pw + padX)}px 0 ${px - padX}px round 13px)` : undefined,
          }}
        >
          {grp.map((wd, k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                left: xs[k],
                top: 0,
                height: size * 1.36,
                lineHeight: `${size * 1.36}px`,
                fontFamily: FONT.sans,
                fontWeight: 700,
                fontSize: size,
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                color: layer ? "#0b0b0b" : C.fa,
                opacity: layer || k <= idx ? 1 : 0.42,
              }}
            >
              {wd.w}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
