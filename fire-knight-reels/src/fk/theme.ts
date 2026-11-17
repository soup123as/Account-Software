import { Easing, interpolate } from "remotion";

/**
 * The Fire Knight brand palette (v3, from thefireknight.in + brand brief).
 * Background is black. Text is white / #fafafa. The only accent is gold #f0b242.
 * Steel greys are for drawing machines and products only, never for text blocks.
 */
export const C = {
  black: "#000000",
  bg: "#080808", // site primary
  panel: "#0E0F10",
  steel: "#1C1F22",
  steel2: "#272B30",
  line: "#2A2D33",
  ash: "#9C9CA4", // site accent silver (labels, muted text)
  silver: "#C8CCD6",
  white: "#FFFFFF",
  fa: "#FAFAFA",
  gold: "#F0B242", // brand accent: key words, heat, alerts
  goldL: "#F7D58F", // tint of gold for the heat core only
  // legacy aliases used by the machine illustrations
  ember: "#F0B242",
  heat: "#F7D58F",
  ok: "#FAFAFA",
  paper: "#FAFAFA",
  ink: "#080808",
} as const;

/**
 * Real-world colours for physical things (machines, fire, lamps, extinguishers).
 * Brand colours (C) are for text, background and UI graphics only - objects keep
 * the colours they have in reality.
 */
export const REAL = {
  // mining haul truck yellow, graded for a night key light from above
  yellowHi: "#F2B630",
  yellow: "#D39A1C",
  yellowMid: "#A87512",
  yellowLo: "#5C3F08",
  yellowDeep: "#2E2004",
  // fire / heat
  fireCore: "#FFF4DC",
  fireYellow: "#FFB33A",
  fireOrange: "#FF6A1A",
  fireRed: "#E2361A",
  // lamps and safety kit
  lampRed: "#E3281C",
  tailRed: "#C8221A",
  beacon: "#FFA41A",
  sodium: "#FFBE6A",
  extRed: "#C61F1A",
  extRedHi: "#EE4A3A",
  extRedLo: "#7A120E",
  gaugeGreen: "#2FA84F",
} as const;

export const FONT = {
  sans: "FK DM Sans", // primary: DM Sans 400-700
  display: "FK Anton", // secondary: Anton, caps hits only
  slam: "FK Anton",
  mono: "FK DM Sans",
} as const;

/** Type scale (1080 wide). Display/lead jump is always >= 2.2x. */
export const TYPE = {
  display: 120, // Anton caps, 1 line ideally, max 2; never above 132
  lead: 52, // DM Sans 600, the main sentence voice
  support: 40, // DM Sans 500, #fafafa @ 75%
  label: 24, // DM Sans 600 caps, tracking .18em, silver
};

/** Reel format. */
export const W = 1080;
export const H = 1920;
export const FPS = 30;

/** Instagram safe box: all text and cards stay inside. */
export const SAFE = { x0: 130, x1: 950, y0: 300, y1: 1460 } as const;

/** Scene lengths in frames (30 fps). v6 pacing: slower, readable. Total = 762 = 25.4 s. */
export const SCENES = {
  hook: 120, // 0-4 s       curiosity hook (open loop), poster first frame
  night: 135, // 4-8.5 s    night haul, push to engine bay, thermal scan
  operator: 135, // 8.5-13 s  one operator, four tasks (grid)
  system: 156, // 13-18.2 s re-hook + three-step response graphic
  product: 96, // 18.2-21.4 s the answer: the Ranger
  hero: 120, // 21.4-25.4 s hero + logo end frame
} as const;
export const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);
export const STARTS = {
  hook: 0,
  night: SCENES.hook,
  operator: SCENES.hook + SCENES.night,
  system: SCENES.hook + SCENES.night + SCENES.operator,
  product: SCENES.hook + SCENES.night + SCENES.operator + SCENES.system,
  hero: SCENES.hook + SCENES.night + SCENES.operator + SCENES.system + SCENES.product,
} as const;

/** Easings. */
export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-like out
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  cam: Easing.bezier(0.45, 0, 0.15, 1), // cinematic camera move
};

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Clamped interpolate with optional easing. */
export const ip = (
  f: number,
  input: number[],
  output: number[],
  easing?: (t: number) => number,
) => interpolate(f, input, output, { ...CL, easing });

/** 0..1 progress of f across [a,b]. */
export const prog = (f: number, a: number, b: number, easing?: (t: number) => number) =>
  ip(f, [a, b], [0, 1], easing);

/** Deterministic pseudo-random in [0,1). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Smooth deterministic noise in [-1,1] for handheld drift and flicker. */
export const noise1 = (t: number, seed = 0) => {
  const i = Math.floor(t);
  const f = t - i;
  const a = rand(i + seed * 101) * 2 - 1;
  const b = rand(i + 1 + seed * 101) * 2 - 1;
  const u = f * f * (3 - 2 * f);
  return a + (b - a) * u;
};
