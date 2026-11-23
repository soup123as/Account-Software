/**
 * Cue sheet (seconds) for the Bang Motion cut of the Bus Owners reel — read by
 * fire-knight-reels/scripts/sound_bus.py (BUS_TIMING=<this file>). Mirrors the absolute
 * seconds written in tools/template.html. Estimated until the client's voiceover arrives.
 */
export const CUE = {
  hook: 0.0,
  kya: 3.0,
  jawab: 5.6,
  cylinder: 7.6,
  dekh: 9.9,
  engine: 11.6,
  battery: 12.95,
  cabin: 14.1,
  sentinel: 15.4,
  nazar: 18.0,
  aag: 20.5,
  discharge: 22.0,
  button: 26.85,
  alert: 28.4,
  kyunki: 30.3,
  comment: 32.0,
  end: 36.0,
} as const;

const CUTS = {
  hook: 0.0,
  passenger: 5.0,
  danger: 9.2,
  sentinel: 15.2,
  zones: 20.2,
  driver: 26.0,
  payoff: 30.0,
  end: 37.0,
} as const;
