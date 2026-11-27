/**
 * "EV Owners" reel (the Sentinel) - VO cue sheet in SECONDS for the 50-SECOND cut. The voiceover is the
 * client's second ElevenLabs take with 17 of its 40 phrases removed at their pauses and the gaps tightened
 * to 0.34 s (scripts/vo_ev_cut.py -> public/audio/vo-ev-short.wav, 48.09 s; full take: vo-ev-full.mp3, 81.87 s).
 * Phrase starts are exact (printed by the cut script); word cues inside a phrase are estimated.
 *
 *  0.12-0.89 EV owner ho? | 1.23-5.14 Toh yeh thirty seconds shayad aapke liye zyada important hain... than you think.
 *  5.48-7.13 Aap battery percentage check karte ho. | 7.42-8.53 Charging status dekhte ho.
 *  8.87-11.23 But ek cheez usually screen par nahi dikhti... | 11.57-15.97 battery area ya electrical system mein unusual heat build-up ho raha ho toh?
 *  16.31-17.72 Aapko pehle kaise pata chalega? | 18.06 CCTV? | 19.02 Security?
 *  19.95-21.36 Risk pehle start hota hai. | 21.70-23.14 Visibility baad mein aati hai.
 *  23.48-25.72 Yahin The Sentinel ka role start hota hai.
 *  26.06-29.32 Yeh vehicle ke critical zones ko continuously monitor karta hai... | 29.59-32.32 flame aur rapidly rising heat detect karne ke liye.
 *  32.66-34.01 Aur threat detect hote hi, | 34.23-37.77 system targeted suppression response automatically trigger kar sakta hai.
 *  38.11 Aap insurance lete ho. | 39.40 Regular servicing karvate ho. | 40.94 Dashcam lagvate ho.
 *  42.29-44.54 Toh fire protection ko optional kyun treat karein?
 *  44.88-45.55 The Sentinel... | 45.86-46.81 by The Fire Knight. | 47.15-48.00 Humein DM kijiye.
 *
 * Removed from the full take: "Range dekhte ho." / "Basically, gaadi kaafi kuch bata deti hai." /
 * "Aur daily use mein car kahan-kahan hoti hai? Office parking. Mall basement. Charging station. Society
 * parking. Mostly, aapki direct nazar se bahar." / "Toh agar kuch unusual start ho..." / "Ya tab... jab
 * problem visible ho?" / "The real gap is simple." / "Matlab aapko smoke ya visible problem ka wait nahi
 * karna. System already us area ko monitor kar raha hota hai... jahan aap normally dekh hi nahi sakte." /
 * "Because the car matters." / "Apni EV ke liye free consultation chahiye?"
 */
export const CUE = {
  ev: 0.0,
  yeh: 1.23,
  zyada: 3.33,
  than: 4.24,
  battery: 5.48,
  charging: 7.42,
  but: 8.87,
  nahiD: 10.36,
  batArea: 11.57,
  unusual: 13.6,
  kaise: 16.31,
  cctv: 18.06,
  security: 19.02,
  risk: 19.95,
  vis: 21.7,
  yahin: 23.48,
  sentinel: 23.8,
  zones: 26.06,
  monitorW: 28.34,
  flame: 29.59,
  heat2: 30.13,
  detect: 31.33,
  threat: 32.66,
  targeted: 34.62,
  auto: 35.8,
  insurance: 38.11,
  servicing: 39.4,
  dashcam: 40.94,
  optional: 42.29,
  optW: 43.41,
  fk: 44.88,
  logo: 45.86,
  consult: 47.0,
  dm: 47.15,
  end: 50.0,
} as const;

/** Scene cut points (seconds), each inside a VO pause. Reel = VO + 1.9 s logo hold. */
const CUTS = {
  hook: 0.0,
  dash: 5.31,
  heat: 8.7,
  gap: 16.14,
  real: 19.78,
  product: 23.31,
  system: 25.89,
  ending: 37.94,
  end: 50.0,
} as const;

type K = Exclude<keyof typeof CUTS, "end">;
const ORDER: K[] = ["hook", "dash", "heat", "gap", "real", "product", "system", "ending"];
const fr = (s: number) => Math.round(s * 30);

export const E_START = Object.fromEntries(ORDER.map((k) => [k, fr(CUTS[k])])) as Record<K, number>;
export const E_LEN = Object.fromEntries(
  ORDER.map((k, i) => [k, fr(i < ORDER.length - 1 ? CUTS[ORDER[i + 1]] : CUTS.end) - fr(CUTS[k])]),
) as Record<K, number>;
export const E_TOTAL = fr(CUTS.end);

/** Frame of a cue, local to a scene. */
export const at = (scene: K, cue: keyof typeof CUE) => fr(CUE[cue]) - E_START[scene];
