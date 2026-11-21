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
/** Scene windows follow the client's visual direction (0-5 / 5-10 / 10-16 / 16-23 / 23-29 / 29-35 / 35-43 s). */
export const CUE = {
  hook: 0.0,
  kya: 3.0,
  jawab: 5.4,
  seat: 6.6,
  cylinder: 8.4,
  lekin: 10.3,
  dekh: 11.6,
  engine: 12.8,
  battery: 13.9,
  cabin: 14.9,
  sentinel: 16.6,
  nazar: 19.5,
  aag: 23.4,
  discharge: 25.0,
  button: 29.4,
  alert: 31.6,
  kyunki: 35.3,
  dhoondhna: 37.6,
  comment: 39.2,
  end: 41.2,
} as const;

const CUTS = {
  hook: 0.0,
  passenger: 5.0,
  danger: 10.0,
  sentinel: 16.0,
  zones: 23.0,
  driver: 29.0,
  payoff: 35.0,
  end: 43.0,
} as const;

type K = Exclude<keyof typeof CUTS, "end">;
const ORDER: K[] = ["hook", "passenger", "danger", "sentinel", "zones", "driver", "payoff"];
const fr = (s: number) => Math.round(s * 30);
export const B_START = Object.fromEntries(ORDER.map((k) => [k, fr(CUTS[k])])) as Record<K, number>;
export const B_LEN = Object.fromEntries(
  ORDER.map((k, i) => [k, fr(i < ORDER.length - 1 ? CUTS[ORDER[i + 1]] : CUTS.end) - fr(CUTS[k])]),
) as Record<K, number>;
export const B_TOTAL = fr(CUTS.end);
export const at = (scene: K, cue: keyof typeof CUE) => fr(CUE[cue]) - B_START[scene];
