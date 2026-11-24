/**
 * Sound cue sheet (seconds) for the "Nazar" film; read by fire-knight-reels/scripts/sound_bus.py
 * (BUS_TIMING=<this file>). Mirrors the frame table F in src/film.src.html. Estimated until the
 * client's voiceover arrives.
 */
export const CUE = {
  hook: 0.0,
  kya: 5.0,
  jawab: 7.6,
  cylinder: 10.3,
  dekh: 13.9,
  engine: 15.6,
  battery: 17.2,
  cabin: 18.6,
  sentinel: 22.0,
  nazar: 23.2,
  aag: 24.8,
  discharge: 26.1,
  button: 29.5,
  alert: 30.5,
  kyunki: 32.6,
  comment: 37.8,
  end: 41.5,
} as const;

const CUTS = {
  hook: 0.0,
  passenger: 7.4,
  danger: 11.8,
  sentinel: 20.8,
  zones: 24.8,
  driver: 28.6,
  payoff: 32.6,
  end: 42.0,
} as const;
