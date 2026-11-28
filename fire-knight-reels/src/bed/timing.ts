/**
 * "Takiye ke paas" reel (phone charging on the bed; the Protector) - cue sheet in SECONDS.
 * No voiceover exists yet: these are ESTIMATES at an ElevenLabs Hinglish pace (about 2.3 words a second
 * with pauses). When the client's VO arrives, replace the numbers with its phrase timecodes; scenes read
 * their beats with at(scene, cue) and scripts/sound_bed.py parses this same file.
 *
 *  Aaj raat bhi phone takiye ke paas charging par lagakar soyenge?
 *  Hum sab yahi karte hain. Phone, power bank, kabhi laptop bhi. Bistar par, chadar ke upar, raat bhar.
 *  Charging mein phone garam hota hai. Table par woh garmi nikal jaati hai. Takiye aur gadde mein wahin
 *  ruk jaati hai. Isiliye fire services kehti hain: bistar par ya takiye ke neeche charging nahi.
 *  Aaj se phone table par rakhiye. Aadat hai, badal jayegi.
 *  Lekin ghar mein charger ek nahi hai. Aur raat bhi ek nahi.
 *  Protector kamre ki ceiling par lagta hai. Flame, garmi aur gas sense karta hai, siren bajata hai,
 *  aur khud activate hota hai. Alert aapke phone par.
 *  Yeh reel family group mein bhejiye. Aaj raat se pehle.
 */
export const CUE = {
  aaj: 0.0,
  takiye: 1.16,
  charging: 2.08,
  soyenge: 3.1,
  hum: 4.35,
  phone: 6.2,
  bank: 6.89,
  laptop: 7.91,
  bistar: 9.44,
  chadar: 10.27,
  raatBhar: 11.38,
  garam: 12.67,
  garamW: 13.74,
  table: 15.17,
  nikal: 16.37,
  takiye2: 18.04,
  ruk: 19.7,
  isiliye: 21.18,
  services: 21.74,
  bistar2: 23.31,
  neeche: 24.23,
  nahi: 25.16,
  aajSe: 26.46,
  tableW: 27.47,
  aadat: 28.95,
  badal: 29.69,
  lekin: 30.99,
  ekNahi: 32.47,
  raat: 33.76,
  ekNahi2: 34.78,
  protector: 35.89,
  ceiling: 36.72,
  flame: 38.66,
  garmi: 39.31,
  gas: 39.96,
  sense: 40.61,
  siren: 41.72,
  khud: 43.11,
  activate: 43.66,
  alert: 45.33,
  aapke: 45.79,
  reel: 47.27,
  family: 47.91,
  aajRaat: 49.49,
  logo: 50.88,
  share: 51.8,
  end: 54.21,
} as const;

/** Scene cut points (seconds); each will sit in a VO pause once the VO exists. */
const CUTS = {
  hook: 0.0,
  habit: 4.16,
  heat: 12.49,
  rule: 21.0,
  fix: 26.27,
  turn: 30.8,
  product: 35.71,
  system: 38.48,
  cta: 47.08,
  end: 54.21,
} as const;

type K = Exclude<keyof typeof CUTS, "end">;
const ORDER: K[] = ["hook", "habit", "heat", "rule", "fix", "turn", "product", "system", "cta"];
const fr = (s: number) => Math.round(s * 30);

export const P_START = Object.fromEntries(ORDER.map((k) => [k, fr(CUTS[k])])) as Record<K, number>;
export const P_LEN = Object.fromEntries(
  ORDER.map((k, i) => [k, fr(i < ORDER.length - 1 ? CUTS[ORDER[i + 1]] : CUTS.end) - fr(CUTS[k])]),
) as Record<K, number>;
export const P_TOTAL = fr(CUTS.end);

/** Frame of a cue, local to a scene. */
export const at = (scene: K, cue: keyof typeof CUE) => fr(CUE[cue]) - P_START[scene];
