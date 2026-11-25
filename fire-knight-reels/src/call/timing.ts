/**
 * "Raat ka call" reel (the Comodo) for facility managers and IT heads - cue sheet in SECONDS, synced to
 * the generated voiceover public/audio/vo-call.wav (55.2 s, scripts/vo_call.py). Phrase starts are exact
 * (the VO is assembled phrase by phrase); the word cues inside a phrase are estimated.
 *
 *  0.15-3.30 Raat do baje server room ka alarm bajta hai. | 3.65-5.02 Aur phir aapka phone. | 5.47-6.75 Ab aap kya karenge?
 *  7.50-9.15 Pehla call, guard ko. | 9.45-12.08 Server room ki chaabi uske paas nahi hai.
 *  12.73-15.04 Doosra call, IT team ko. | 15.34-16.64 Phone silent par hai.
 *  17.29-18.73 Toh aap khud nikalte hain. | 19.09-21.15 Office shehar ke doosre kone mein hai.
 *  21.90-23.67 Alarm ne apna kaam kar diya. | 24.07-26.86 Room ke andar ab tak kisi ne kuch nahi kiya.
 *  27.81-29.22 Ek aur tareeka hai. | 29.72-31.25 Deewar par ek unit,
 *  31.50-34.12 jo flame aur garmi khud sense karta hai | 34.42-36.12 aur khud activate hota hai.
 *  36.62-38.69 Na chaabi chahiye, na call.
 *  39.34-40.82 Alert aapke phone par, | 41.12-43.59 aur aap app se bhi unit chala sakte hain.
 *  44.34-45.46 Alarm zaroori hai. | 45.86-48.16 Lekin alarm sirf awaaz deta hai. | 48.56-50.51 Jawaab kisi ko dena padta hai.
 *  51.35-53.49 Jinke paas raat ko yeh call aata hai, | 53.79-55.20 yeh reel unhe bhejiye.
 */
export const CUE = {
  raat: 0.15,
  alarmW: 2.05,
  phone: 3.65,
  abKya: 5.47,
  kyaW: 5.85,
  call1: 7.5,
  guardW: 8.35,
  chaabi: 9.45,
  nahiW: 10.75,
  call2: 12.73,
  itW: 13.7,
  silent: 15.34,
  khud: 17.29,
  nikalteW: 18.0,
  kone: 19.09,
  koneW: 19.95,
  kaam: 21.9,
  kaamW: 22.75,
  andar: 24.07,
  kisiW: 25.3,
  kiyaW: 26.1,
  tareeka: 27.81,
  unit: 29.72,
  unitW: 30.5,
  sense: 31.5,
  flameW: 31.75,
  garmiW: 32.35,
  senseW: 32.95,
  activate: 34.42,
  activateW: 34.95,
  naChaabi: 36.62,
  naCallW: 37.9,
  alert: 39.34,
  alertPhoneW: 39.85,
  app: 41.12,
  chalaW: 42.2,
  zaroori: 44.34,
  awaaz: 45.86,
  awaazW: 47.05,
  jawaab: 48.56,
  jinke: 51.35,
  yehCallW: 52.3,
  bhejiye: 53.79,
  end: 55.2,
} as const;

/** Scene cut points (seconds), each inside a VO pause. Reel = VO + 2.3 s logo hold. */
const CUTS = {
  hook: 0.0,
  call1: 7.15,
  call2: 12.4,
  drive: 16.95,
  inside: 21.5,
  turn: 27.35,
  product: 29.5,
  system: 34.27,
  alert: 38.95,
  punch: 43.95,
  hero: 50.9,
  end: 57.5,
} as const;

type K = Exclude<keyof typeof CUTS, "end">;
const ORDER: K[] = ["hook", "call1", "call2", "drive", "inside", "turn", "product", "system", "alert", "punch", "hero"];
const fr = (s: number) => Math.round(s * 30);

export const N_START = Object.fromEntries(ORDER.map((k) => [k, fr(CUTS[k])])) as Record<K, number>;
export const N_LEN = Object.fromEntries(
  ORDER.map((k, i) => [k, fr(i < ORDER.length - 1 ? CUTS[ORDER[i + 1]] : CUTS.end) - fr(CUTS[k])]),
) as Record<K, number>;
export const N_TOTAL = fr(CUTS.end);

/** Frame of a VO cue, local to a scene. */
export const at = (scene: K, cue: keyof typeof CUE) => fr(CUE[cue]) - N_START[scene];
