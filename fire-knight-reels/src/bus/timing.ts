/**
 * "Bus Owners" reel (the Sentinel) - VO cue sheet in SECONDS.
 * PRE-VO ESTIMATES (~2.6 words/s with the script's pauses). When the client's VO arrives,
 * replace these with the real timecodes (silencedetect + Whisper) - every scene and the
 * sound script read from this table.
 *
 *  L1 Apni bus mein passengers ki safety ka toh poora khayal rakhte hain... par engine aur battery ki safety ka kya?
 *  L2 Shayad jawab hai... driver ki seat ke peeche lagaa, ek laal cylinder.
 *  L3 Lekin aag wahan lagti hai, jahan koi dekh nahi raha.
 *  L4 Engine bay ke andar. Battery box mein. Ya cabin mein, passengers ke beech.
 *  L5 The Fire Knight ka Sentinel... har zone par nazar rakhta hai.
 *  L6 Aag jis zone mein, discharge sirf usi zone mein.
 *  L7 Driver ke paas dashboard button. Aapke phone par alert.
 *  L8 Kyunki driver ka pehla kaam passengers ko utaarna hai... cylinder dhoondhna nahi.
 *  L9 Aapki bus mein kitne zone covered hain? Comment kijiye.
 */
export const CUE = {
  hook: 0.0,
  kya: 3.8,
  jawab: 6.9,
  seat: 8.1,
  cylinder: 9.6,
  lekin: 11.0,
  dekh: 12.6,
  engine: 14.2,
  battery: 15.5,
  cabin: 16.8,
  sentinel: 19.0,
  nazar: 21.1,
  aag: 23.2,
  discharge: 24.6,
  button: 26.4,
  alert: 28.3,
  kyunki: 30.0,
  dhoondhna: 32.9,
  comment: 34.6,
  end: 37.4,
} as const;

const CUTS = {
  hook: 0.0,
  answer: 6.7,
  zones: 10.8,
  product: 18.85,
  system: 21.0,
  punch: 29.85,
  hero: 34.45,
  end: 39.2,
} as const;

type K = Exclude<keyof typeof CUTS, "end">;
const ORDER: K[] = ["hook", "answer", "zones", "product", "system", "punch", "hero"];
const fr = (s: number) => Math.round(s * 30);
export const B_START = Object.fromEntries(ORDER.map((k) => [k, fr(CUTS[k])])) as Record<K, number>;
export const B_LEN = Object.fromEntries(
  ORDER.map((k, i) => [k, fr(i < ORDER.length - 1 ? CUTS[ORDER[i + 1]] : CUTS.end) - fr(CUTS[k])]),
) as Record<K, number>;
export const B_TOTAL = fr(CUTS.end);
export const at = (scene: K, cue: keyof typeof CUE) => fr(CUE[cue]) - B_START[scene];
