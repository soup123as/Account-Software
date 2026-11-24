/**
 * "Smoke Alarm" reel (the Comodo) for facility managers and IT heads - cue sheet in SECONDS.
 * No voiceover yet: the times are ESTIMATED from the script at about 2.2 words a second with pauses.
 * When the VO arrives, replace these numbers with its timecodes and rerun scripts/sound_server.py.
 *
 *  0.0 Smoke alarm baj raha hai. | 1.9 Warning mil chuki hai. | 3.5 Par fire ko rokne ke liye | 4.9 ab kya?
 *  6.2 Raat ke 2 baje hain. | 7.8 Office band hai. | 9.2 Server room mein koi nahi.
 *  11.4 Achanak smoke alarm bajta hai. | 13.8 Lekin alarm sunne wala | 15.4 wahan koi nahi.
 *  17.0 Aur jab tak koi response dene pahunche, | 19.4 aag critical servers, | 20.9 networking equipment
 *  22.3 aur poore IT infrastructure ko | 24.2 damage kar sakti hai.
 *  26.0 Ek chhoti si incident... | 27.6 aur business operations | 28.9 ruk sakte hain.
 *  30.7 Isiliye sirf alarm nahi, | 32.6 active fire protection | 34.3 bhi zaroori hai.
 *  35.7 Introducing | 36.5 The Comodo.
 *  39.0 Yeh flame | 40.0 aur heat | 40.6 detect karta hai | 41.8 aur automatically | 42.8 activate hokar
 *  43.9 fire protection provide karta hai.
 *  46.4 Taaki server room mein danger detect hone ke baad | 49.6 protection ke liye sirf kisi ke pahunchne ka
 *  51.2 intezaar na karna pade.
 *  53.5 Aapke office ka server room | 55.2 sirf monitored hai, | 56.7 ya protected bhi?
 *  58.6 Discover The Comodo. | 59.9 logo | 60.9 DM us
 */
export const CUE = {
  smoke: 0.0,
  warning: 1.9,
  par: 3.5,
  abKya: 4.9,
  raat: 6.2,
  office: 7.8,
  koi: 9.2,
  achanak: 11.4,
  bajta: 12.5,
  lekin: 13.8,
  koiNahi: 15.4,
  jabTak: 17.0,
  servers: 19.4,
  network: 20.9,
  infra: 22.3,
  damage: 24.2,
  chhoti: 26.0,
  business: 27.6,
  ruk: 28.9,
  isiliye: 30.7,
  active: 32.6,
  zaroori: 34.3,
  intro: 35.7,
  comodo: 36.5,
  yeh: 39.0,
  flame: 39.4,
  heat: 40.0,
  detect: 40.6,
  auto: 41.8,
  activate: 42.8,
  protection: 43.9,
  taaki: 46.4,
  pahunchne: 49.6,
  intezaar: 51.2,
  aapke: 53.5,
  monitored: 55.2,
  protected: 56.7,
  discover: 58.6,
  fk: 59.9,
  dm: 60.9,
  end: 63.5,
} as const;

/** Scene cut points (seconds), each inside a pause. */
const CUTS = {
  hook: 0.0,
  night: 6.0,
  alarm: 11.2,
  damage: 16.8,
  turn: 30.5,
  product: 35.5,
  system: 38.8,
  cta: 53.3,
  hero: 58.4,
  end: 63.5,
} as const;

type K = Exclude<keyof typeof CUTS, "end">;
const ORDER: K[] = ["hook", "night", "alarm", "damage", "turn", "product", "system", "cta", "hero"];
const fr = (s: number) => Math.round(s * 30);

export const V_START = Object.fromEntries(ORDER.map((k) => [k, fr(CUTS[k])])) as Record<K, number>;
export const V_LEN = Object.fromEntries(
  ORDER.map((k, i) => [k, fr(i < ORDER.length - 1 ? CUTS[ORDER[i + 1]] : CUTS.end) - fr(CUTS[k])]),
) as Record<K, number>;
export const V_TOTAL = fr(CUTS.end);

/** Frame of a cue, local to a scene. */
export const at = (scene: K, cue: keyof typeof CUE) => fr(CUE[cue]) - V_START[scene];
