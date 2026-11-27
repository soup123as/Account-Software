/**
 * "EV Owners" reel (the Sentinel) - VO cue sheet in SECONDS for the SHORT cut. The voiceover is the client's
 * second ElevenLabs take with six phrases removed at their pauses and the gaps tightened to 0.34 s
 * (scripts/vo_ev_cut.py -> public/audio/vo-ev-short.wav, 64.77 s; the full take is vo-ev-full.mp3, 81.87 s).
 * Removed: "Basically, gaadi kaafi kuch bata deti hai." / "Toh agar kuch unusual start ho..." /
 * "The real gap is simple." / "Matlab aapko smoke ya visible problem ka wait nahi karna." /
 * "System already us area ko monitor kar raha hota hai..." / "jahan aap normally dekh hi nahi sakte."
 * Phrase starts are exact (printed by the cut script); word cues inside a phrase are estimated.
 *
 *  0.12-0.89 EV owner ho? | 1.23-5.14 Toh yeh thirty seconds shayad aapke liye zyada important hain... than you think.
 *  5.48-7.13 Aap battery percentage check karte ho. | 7.46-8.30 Range dekhte ho. | 8.54-9.65 Charging status dekhte ho.
 *  9.99-12.35 But ek cheez usually screen par nahi dikhti... | 12.69-17.10 battery area ya electrical system mein unusual heat build-up ho raha ho toh?
 *  17.44-19.41 Aur daily use mein car kahan-kahan hoti hai? | 19.75 Office parking. | 20.71 Mall basement.
 *  21.73 Charging station. | 22.71 Society parking. | 23.85-26.08 Mostly, aapki direct nazar se bahar.
 *  26.42-27.83 Aapko pehle kaise pata chalega? | 28.17 CCTV? | 29.13 Security? | 30.05 Ya tab... | 30.80-31.90 jab problem visible ho?
 *  32.24-33.65 Risk pehle start hota hai. | 33.99-35.43 Visibility baad mein aati hai.
 *  35.77-38.01 Yahin The Sentinel ka role start hota hai.
 *  38.35-41.61 Yeh vehicle ke critical zones ko continuously monitor karta hai... | 41.88-44.61 flame aur rapidly rising heat detect karne ke liye.
 *  44.95-46.30 Aur threat detect hote hi, | 46.52-50.06 system targeted suppression response automatically trigger kar sakta hai.
 *  50.40 Aap insurance lete ho. | 51.70 Regular servicing karvate ho. | 53.23 Dashcam lagvate ho.
 *  54.58-56.13 Because the car matters. | 56.47-58.72 Toh fire protection ko optional kyun treat karein?
 *  59.06-59.73 The Sentinel... | 60.05-60.99 by The Fire Knight. | 61.33-63.48 Apni EV ke liye free consultation chahiye? | 63.82-64.67 Humein DM kijiye.
 */
export const CUE = {
  ev: 0.0,
  yeh: 1.23,
  zyada: 3.33,
  than: 4.24,
  battery: 5.48,
  range: 7.46,
  charging: 8.54,
  but: 9.99,
  nahiD: 11.48,
  batArea: 12.69,
  unusual: 14.72,
  kahan: 17.44,
  office: 19.75,
  mall: 20.71,
  charger: 21.73,
  society: 22.71,
  nazar: 23.85,
  baharW: 25.38,
  kaise: 26.42,
  cctv: 28.17,
  security: 29.13,
  visible: 30.05,
  visW: 31.24,
  risk: 32.24,
  vis: 33.99,
  yahin: 35.77,
  sentinel: 36.09,
  zones: 38.35,
  monitorW: 40.63,
  flame: 41.88,
  heat2: 42.42,
  detect: 43.62,
  threat: 44.95,
  targeted: 46.91,
  auto: 48.09,
  insurance: 50.4,
  servicing: 51.7,
  dashcam: 53.23,
  because: 54.58,
  optional: 56.47,
  optW: 57.59,
  fk: 59.06,
  logo: 60.05,
  consult: 61.33,
  dm: 63.82,
  end: 66.6,
} as const;

/** Scene cut points (seconds), each inside a VO pause. Reel = VO + 1.8 s logo hold. */
const CUTS = {
  hook: 0.0,
  dash: 5.31,
  heat: 9.82,
  places: 17.27,
  gap: 26.25,
  real: 32.07,
  product: 35.6,
  system: 38.18,
  ending: 50.23,
  end: 66.6,
} as const;

type K = Exclude<keyof typeof CUTS, "end">;
const ORDER: K[] = ["hook", "dash", "heat", "places", "gap", "real", "product", "system", "ending"];
const fr = (s: number) => Math.round(s * 30);

export const E_START = Object.fromEntries(ORDER.map((k) => [k, fr(CUTS[k])])) as Record<K, number>;
export const E_LEN = Object.fromEntries(
  ORDER.map((k, i) => [k, fr(i < ORDER.length - 1 ? CUTS[ORDER[i + 1]] : CUTS.end) - fr(CUTS[k])]),
) as Record<K, number>;
export const E_TOTAL = fr(CUTS.end);

/** Frame of a cue, local to a scene. */
export const at = (scene: K, cue: keyof typeof CUE) => fr(CUE[cue]) - E_START[scene];
