/**
 * "EV Owners" reel (the Sentinel) - VO cue sheet in SECONDS, synced to the client's second ElevenLabs take
 * (public/audio/vo-ev.mp3, 81.87 s, with the DM call to action). Phrase timecodes from silencedetect
 * (-38 dB, 0.18 s) + Whisper transcription; every cut sits in a VO pause. Word cues inside a phrase are estimated.
 *
 *  0.00-0.77 EV owner ho? | 1.32-5.23 Toh yeh thirty seconds shayad aapke liye zyada important hain... than you think.
 *  5.80-7.45 Aap battery percentage check karte ho. | 7.78-8.62 Range dekhte ho. | 8.86-9.97 Charging status dekhte ho.
 *  10.45-12.58 Basically, gaadi kaafi kuch bata deti hai.
 *  13.01-15.37 But ek cheez usually screen par nahi dikhti... | 15.83-20.23 battery area ya electrical system mein unusual heat build-up ho raha ho toh?
 *  20.75-22.72 Aur daily use mein car kahan-kahan hoti hai? | 23.18 Office parking. | 24.15 Mall basement.
 *  25.16 Charging station. | 26.15 Society parking. | 27.37-29.59 Mostly, aapki direct nazar se bahar.
 *  30.04-31.68 Toh agar kuch unusual start ho... | 32.15-33.56 aapko pehle kaise pata chalega? | 33.93 CCTV? | 34.89 Security?
 *  35.81 Ya tab... | 36.56-37.66 jab problem visible ho?
 *  38.10-39.50 The real gap is simple. | 39.93-41.34 Risk pehle start hota hai. | 41.72-43.16 Visibility baad mein aati hai.
 *  43.58-45.82 Yahin The Sentinel ka role start hota hai.
 *  46.28-49.54 Yeh vehicle ke critical zones ko continuously monitor karta hai... | 49.81-52.54 flame aur rapidly rising heat detect karne ke liye.
 *  52.91-54.26 Aur threat detect hote hi, | 54.48-58.02 system targeted suppression response automatically trigger kar sakta hai.
 *  58.44-61.35 Matlab aapko smoke ya visible problem ka wait nahi karna.
 *  61.68-64.42 System already us area ko monitor kar raha hota hai... | 64.71-66.60 jahan aap normally dekh hi nahi sakte.
 *  67.08 Aap insurance lete ho. | 68.38 Regular servicing karvate ho. | 69.91 Dashcam lagvate ho.
 *  71.28-72.83 Because the car matters. | 73.18-75.42 Toh fire protection ko optional kyun treat karein?
 *  75.89-76.56 The Sentinel... | 76.88-77.82 by The Fire Knight. | 78.27-80.43 Apni EV ke liye free consultation chahiye? | 80.80-81.65 Humein DM kijiye.
 */
export const CUE = {
  ev: 0.0,
  yeh: 1.32,
  zyada: 3.42,
  than: 4.33,
  battery: 5.8,
  range: 7.78,
  charging: 8.86,
  bata: 10.45,
  but: 13.01,
  nahiD: 14.5,
  batArea: 15.83,
  unusual: 17.86,
  kahan: 20.75,
  office: 23.18,
  mall: 24.15,
  charger: 25.16,
  society: 26.15,
  nazar: 27.37,
  baharW: 28.9,
  agar: 30.04,
  kaise: 32.15,
  cctv: 33.93,
  security: 34.89,
  visible: 35.81,
  visW: 37.0,
  realGap: 38.1,
  risk: 39.93,
  vis: 41.72,
  yahin: 43.58,
  sentinel: 43.9,
  zones: 46.28,
  monitorW: 48.56,
  flame: 49.81,
  heat2: 50.35,
  detect: 51.55,
  threat: 52.91,
  targeted: 54.87,
  auto: 56.05,
  matlab: 58.44,
  waitW: 60.48,
  already: 61.68,
  monitor2: 63.2,
  jahan: 64.71,
  dekhW: 65.52,
  insurance: 67.08,
  servicing: 68.38,
  dashcam: 69.91,
  because: 71.28,
  optional: 73.18,
  optW: 74.3,
  fk: 75.89,
  logo: 76.88,
  consult: 78.27,
  dm: 80.8,
  end: 84.2,
} as const;

/** Scene cut points (seconds), each inside a VO pause. Reel = VO + 2.3 s logo hold. */
const CUTS = {
  hook: 0.0,
  dash: 5.52,
  heat: 12.8,
  places: 20.5,
  gap: 29.82,
  real: 37.88,
  product: 43.37,
  system: 46.05,
  wait: 58.23,
  ending: 66.84,
  end: 84.2,
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
