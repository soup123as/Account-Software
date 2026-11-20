/**
 * "Shop Owners" reel (the Protector) - VO cue sheet in SECONDS.
 *
 * PRE-VO ESTIMATES: these are paced at ~2.6 words/s with the script's pauses. When the
 * client's ElevenLabs VO arrives, transcribe it (silencedetect + sherpa-onnx) and replace
 * the numbers below - every scene reads its beats from this table, so re-syncing is a
 * data edit, not a rewrite.
 *
 * Script:
 *  L1  Shutter gira ke ghar jaate ho? Andar abhi bhi kya chal raha hai... kabhi socha hai?
 *  L2  Dukaan band hai... lekin andar sab kuch band nahi.
 *  L3  Fridge. Inverter. Aur ek board par... chaar plug.
 *  L4  Aur inmein se ek... raat bhar garam ho raha hai.
 *  L5  Raat ke do baje, padosi ka phone: "Bhai, aapke shutter se dhuaan nikal raha hai."
 *  L6  Lekin asli jhatka... pahunchne ke baad lagta hai.
 *  L7  Shutter garmi se jam. Gali itni tang, ki fire brigade andar tak nahi aa paati.
 *  L8  Aur aag bujhne ke baad, insurance poochta hai: "Saboot kahan hai?"
 *  L9  Ab sochiye... agar us raat aapki dukaan khud jaag rahi hoti?
 *  L10 Ceiling par, The Protector. Shutter girne ke baad bhi... jaagta hua.
 *  L11 Flame, heat aur gas sensors milkar confirm karte hain. Siren, light... aur suppression, apne aap.
 *  L12 Aur usse pehle... ek photo. Wahi saboot, jo insurance maangega.
 *  L13 Is baar padosi ka phone nahi... alert seedha aapke phone par.
 *  L14 Kyunki taala chor ko rokta hai... aag ko nahi.
 *  L15 The Fire Knight. Yeh reel har us dukaandaar ko bhejiye... jo aaj raat shutter giraayega.
 */
export const CUE = {
  // L1
  shutter: 0.0,
  andar: 2.0,
  kabhi: 3.9,
  // L2
  band: 5.4,
  lekinAndar: 6.9,
  // L3
  fridge: 8.8,
  inverter: 9.6,
  board: 10.5,
  chaarPlug: 11.6,
  // L4
  inmein: 13.0,
  garam: 14.6,
  // L5
  raat: 16.6,
  padosi: 18.0,
  bhai: 19.0,
  dhuaan: 20.6,
  // L6
  asli: 22.0,
  pahunch: 23.3,
  // L7
  jam: 25.2,
  gali: 26.9,
  brigade: 28.2,
  // L8
  bujhne: 30.4,
  insurance: 31.7,
  saboot: 32.9,
  // L9
  sochiye: 34.6,
  jaag: 36.0,
  // L10
  ceiling: 38.4,
  protector: 39.3,
  girne: 40.4,
  jaagta: 41.6,
  // L11
  flame: 42.8,
  heat: 43.3,
  gas: 43.9,
  confirm: 44.7,
  siren: 46.0,
  light: 46.6,
  suppression: 47.4,
  // L12
  pehle: 49.0,
  photo: 50.2,
  wahiSaboot: 51.1,
  // L13
  isBaar: 53.2,
  alert: 55.0,
  // L14
  taala: 57.0,
  aagKo: 58.8,
  // L15
  fk: 60.2,
  bhejiye: 61.4,
  end: 65.0,
} as const;

/** Scene cut points (seconds); every cut sits in a VO pause. */
const CUTS = {
  hook: 0,
  inside: 5.2,
  call: 16.35,
  arrive: 21.8,
  proof: 30.15,
  turn: 34.4,
  product: 38.15,
  system: 42.55,
  alert: 52.95,
  hero: 56.8,
  end: 66.5,
} as const;

type K = Exclude<keyof typeof CUTS, "end">;
const ORDER: K[] = ["hook", "inside", "call", "arrive", "proof", "turn", "product", "system", "alert", "hero"];
const fr = (s: number) => Math.round(s * 30);

export const S_START = Object.fromEntries(ORDER.map((k) => [k, fr(CUTS[k])])) as Record<K, number>;
export const S_LEN = Object.fromEntries(
  ORDER.map((k, i) => [k, fr(i < ORDER.length - 1 ? CUTS[ORDER[i + 1]] : CUTS.end) - fr(CUTS[k])]),
) as Record<K, number>;
export const S_TOTAL = fr(CUTS.end);

/** Frame of a VO cue, local to a scene. */
export const at = (scene: K, cue: keyof typeof CUE) => fr(CUE[cue]) - S_START[scene];
