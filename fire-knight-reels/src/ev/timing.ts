/**
 * "EV Owners" reel (the Sentinel) - cue sheet in SECONDS. No voiceover yet: the times are ESTIMATED from
 * the client's script at a natural speaking pace (about 2.5 words a second with pauses). The script is
 * about 190 words, so it runs about 80 s, not the 45 s pencilled on the script. When the VO arrives,
 * replace these numbers with its timecodes and rerun scripts/sound_ev.py.
 *
 *  0.0 EV owner ho? | 1.7 Toh yeh 30 seconds shayad | 3.6 aapke liye zyada important hain | 5.3 than you think.
 *  6.6 Aap battery percentage check karte ho. | 8.7 Range dekhte ho. | 10.0 Charging status dekhte ho.
 *  11.6 Basically, gaadi kaafi kuch bata deti hai.
 *  13.7 But ek cheez usually screen par nahi dikhti- | 16.7 battery area ya electrical system mein
 *  18.8 unusual heat build-up ho raha ho toh?
 *  21.2 Aur daily use mein car kahan-kahan hoti hai? | 23.7 Office parking. | 24.7 Mall basement.
 *  25.7 Charging station. | 26.7 Society parking. | 27.6 Mostly, aapki direct nazar se bahar.
 *  29.4 Toh agar kuch unusual start ho... | 31.3 aapko pehle kaise pata chalega? | 33.2 CCTV? | 33.9 Security?
 *  34.6 Ya tab, jab problem visible ho?
 *  36.0 The real gap is simple: | 37.6 risk pehle start hota hai, | 39.4 visibility baad mein aati hai.
 *  41.6 Yahin The Sentinel ka role start hota hai.
 *  45.6 Yeh vehicle ke critical zones ko continuously monitor karta hai | 49.3 flame | 50.0 aur rapidly rising heat
 *  51.2 detect karne ke liye. | 52.6 Aur threat detect hote hi, | 54.3 system targeted suppression response
 *  56.1 automatically trigger kar sakta hai.
 *  58.0 Matlab aapko smoke ya visible problem ka wait nahi karna.
 *  61.4 System already us area ko monitor kar raha hota hai | 64.2 jahan aap normally dekh hi nahi sakte.
 *  66.6 Aap insurance lete ho. | 68.0 Regular servicing karvate ho. | 69.6 Dashcam lagvate ho.
 *  71.1 Because the car matters. | 72.8 Toh fire protection ko optional kyun treat karein? | 75.8 The Sentinel.
 */
export const CUE = {
  ev: 0.0,
  yeh: 1.7,
  zyada: 3.6,
  than: 5.3,
  battery: 6.6,
  range: 8.7,
  charging: 10.0,
  bata: 11.6,
  but: 13.7,
  nahiD: 15.4,
  batArea: 16.7,
  unusual: 18.8,
  kahan: 21.2,
  office: 23.7,
  mall: 24.7,
  charger: 25.7,
  society: 26.7,
  nazar: 27.6,
  baharW: 28.3,
  agar: 29.4,
  kaise: 31.3,
  cctv: 33.2,
  security: 33.9,
  visible: 34.6,
  realGap: 36.0,
  risk: 37.6,
  vis: 39.4,
  yahin: 41.6,
  sentinel: 42.1,
  zones: 45.6,
  monitorW: 47.6,
  flame: 49.3,
  heat2: 50.0,
  detect: 51.2,
  threat: 52.6,
  targeted: 54.3,
  auto: 56.1,
  matlab: 58.0,
  waitW: 60.0,
  already: 61.4,
  monitor2: 62.8,
  jahan: 64.2,
  dekhW: 65.2,
  insurance: 66.6,
  servicing: 68.0,
  dashcam: 69.6,
  because: 71.1,
  optional: 72.8,
  optW: 73.9,
  fk: 75.8,
  logo: 77.0,
  end: 80.0,
} as const;

/** Scene cut points (seconds), each inside a pause. */
const CUTS = {
  hook: 0.0,
  dash: 6.4,
  heat: 13.5,
  places: 21.0,
  gap: 29.2,
  real: 35.8,
  product: 41.4,
  system: 45.4,
  wait: 57.8,
  ending: 66.4,
  end: 80.0,
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
