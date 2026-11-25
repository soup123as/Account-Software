/**
 * "EV Owners" reel (the Sentinel) - VO cue sheet in SECONDS, synced to the client's ElevenLabs voiceover
 * (public/audio/vo-ev.mp3, 78.99 s). Phrase timecodes from silencedetect (-38 dB, 0.18 s) + Whisper
 * transcription; every cut sits in a VO pause. Word cues inside a phrase are estimated.
 *
 *  0.00-0.49 EV | 0.67-1.12 owner ho? | 1.72-5.29 Toh yeh 30 seconds shayad aapke liye zyada important hain than you think.
 *  5.90-7.57 Aap battery percentage check karte ho. | 7.81-10.12 Range dekhte ho. Charging status dekhte ho.
 *  10.60-12.59 Basically, gaadi kaafi kuch bata deti hai.
 *  13.11-15.46 But ek cheez usually screen par nahi dikhti- | 16.00-20.20 battery area ya electrical system mein unusual heat build-up ho raha ho toh?
 *  20.83-22.89 Aur daily use mein car kahan-kahan hoti hai? | 23.42 Office parking. | 24.50 Mall basement.
 *  25.59-27.51 Charging station. Society parking. | 27.99-30.15 Mostly, aapki direct nazar se bahar.
 *  30.72-32.44 Toh agar kuch unusual start ho... | 32.87-34.25 aapko pehle kaise pata chalega? | 34.78 CCTV? | 35.88 Security?
 *  36.88 Ya tab, | 37.61-38.70 jab problem visible ho?
 *  39.27-40.66 The real gap is simple: | 41.14-42.63 risk pehle start hota hai, | 42.88-44.36 visibility baad mein aati hai.
 *  44.89-46.97 Yahin The Sentinel ka role start hota hai.
 *  47.50-50.70 Yeh vehicle ke critical zones ko continuously monitor karta hai | 50.96-53.66 flame aur rapidly rising heat detect karne ke liye.
 *  54.20-59.33 Aur threat detect hote hi, system targeted suppression response automatically trigger kar sakta hai.
 *  59.89-62.75 Matlab aapko smoke ya visible problem ka wait nahi karna.
 *  63.19-68.09 System already us area ko monitor kar raha hota hai jahan aap normally dekh hi nahi sakte.
 *  68.70 Aap insurance lete ho. | 70.08 Regular servicing karvate ho. | 71.66 Dashcam lagvate ho.
 *  73.04-74.71 Because the car matters. | 75.18-77.48 Toh fire protection ko optional kyun treat karein? | 78.07-78.75 The Sentinel.
 */
export const CUE = {
  ev: 0.0,
  yeh: 1.72,
  zyada: 3.67,
  than: 4.47,
  battery: 5.9,
  range: 7.81,
  charging: 8.8,
  bata: 10.6,
  but: 13.11,
  nahiD: 14.6,
  batArea: 16.0,
  unusual: 18.0,
  kahan: 20.83,
  office: 23.42,
  mall: 24.5,
  charger: 25.59,
  society: 26.55,
  nazar: 27.99,
  baharW: 29.4,
  agar: 30.72,
  kaise: 32.87,
  cctv: 34.78,
  security: 35.88,
  visible: 36.88,
  visW: 38.0,
  realGap: 39.27,
  risk: 41.14,
  vis: 42.88,
  yahin: 44.89,
  sentinel: 45.2,
  zones: 47.5,
  monitorW: 49.7,
  flame: 50.96,
  heat2: 51.5,
  detect: 52.7,
  threat: 54.2,
  targeted: 56.4,
  auto: 57.5,
  matlab: 59.89,
  waitW: 61.9,
  already: 63.19,
  monitor2: 64.7,
  jahan: 65.95,
  dekhW: 66.87,
  insurance: 68.7,
  servicing: 70.08,
  dashcam: 71.66,
  because: 73.04,
  optional: 75.18,
  optW: 76.33,
  fk: 78.07,
  logo: 79.2,
  end: 82.2,
} as const;

/** Scene cut points (seconds), each inside a VO pause. Reel = VO + 3.2 s logo hold. */
const CUTS = {
  hook: 0.0,
  dash: 5.6,
  heat: 12.85,
  places: 20.5,
  gap: 30.43,
  real: 39.0,
  product: 44.62,
  system: 47.23,
  wait: 59.6,
  ending: 68.4,
  end: 82.2,
} as const;

type K = Exclude<keyof typeof CUTS, "end">;
const ORDER: K[] = ["hook", "dash", "heat", "places", "gap", "real", "product", "system", "wait", "ending"];
const fr = (s: number) => Math.round(s * 30);

export const E_START = Object.fromEntries(ORDER.map((k) => [k, fr(CUTS[k])])) as Record<K, number>;
export const E_LEN = Object.fromEntries(
  ORDER.map((k, i) => [k, fr(i < ORDER.length - 1 ? CUTS[ORDER[i + 1]] : CUTS.end) - fr(CUTS[k])]),
) as Record<K, number>;
export const E_TOTAL = fr(CUTS.end);

/** Frame of a cue, local to a scene. */
export const at = (scene: K, cue: keyof typeof CUE) => fr(CUE[cue]) - E_START[scene];
