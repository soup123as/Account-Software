import { Easing, interpolate } from "remotion";

/** The Fire Knight brand palette (Control Room look). */
export const C = {
  black: "#0B0B0C",
  steel: "#1C1F22",
  steel2: "#272B30",
  line: "#3A4047",
  ash: "#8A9097",
  white: "#F4F4F2",
  paper: "#F1EFEA",
  ink: "#141414",
  ember: "#FF5A1F",
  heat: "#FFB13D",
  ok: "#1F9D55",
} as const;

export const FONT = {
  slam: "FK Slam", // Big Shoulders Bold - headlines
  sans: "FK Sans", // Inter 500-800 - lines
  mono: "FK Mono", // JetBrains Mono - HUD, labels
} as const;

/** Reel format. */
export const W = 1080;
export const H = 1920;
export const FPS = 30;

/** Instagram safe box: all text and cards stay inside. */
export const SAFE = { x0: 130, x1: 950, y0: 300, y1: 1460 } as const;

/** Scene lengths in frames (30 fps). Total = 600 = 20 s. */
export const SCENES = {
  hook: 90, // 0-3 s
  night: 120, // 3-7 s
  operator: 120, // 7-11 s
  system: 150, // 11-16 s
  hero: 120, // 16-20 s
} as const;
export const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);
export const STARTS = {
  hook: 0,
  night: SCENES.hook,
  operator: SCENES.hook + SCENES.night,
  system: SCENES.hook + SCENES.night + SCENES.operator,
  hero: SCENES.hook + SCENES.night + SCENES.operator + SCENES.system,
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
