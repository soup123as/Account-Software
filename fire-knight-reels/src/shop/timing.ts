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
 *  L5  Raat ke do baje... kisi unknown number se call aata hai: "Bhai, aapki dukaan mein aag lagi hai!"
 *  L6  Lekin asli jhatka... pahunchne ke baad lagta hai.
 *  L7  Shutter garmi se jam. Gali itni tang, ki fire brigade andar tak nahi aa paati.
 *  L8  Aur aag bujhne ke baad, insurance poochta hai: "Saboot kahan hai?"
 *  L9  Ab sochiye... agar us raat aapki dukaan khud jaag rahi hoti?
 *  L10 Ceiling par, The Protector. Shutter girne ke baad bhi... jaagta hua.
 *  L11 Flame, heat aur gas sensors milkar confirm karte hain. Siren, light... aur suppression, apne aap.
 *  L12 Aur usse pehle... ek photo. Wahi saboot, jo insurance maangega.
 *  L13 Is baar kisi unknown call ka intezaar nahi... alert seedha aapke phone par.
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
  unknown: 17.9,
  bhai: 19.9,
  aag: 21.2,
  // L6
  asli: 22.6,
  pahunch: 23.9,
  // L7
  jam: 25.8,
  gali: 27.5,
  brigade: 28.8,
  // L8
  bujhne: 31.0,
  insurance: 32.3,
  saboot: 33.5,
  // L9
  sochiye: 35.2,
  jaag: 36.6,
  // L10
  ceiling: 39.0,
  protector: 39.9,
  girne: 41.0,
  jaagta: 42.2,
  // L11
  flame: 43.4,
  heat: 43.9,
  gas: 44.5,
  confirm: 45.3,
  siren: 46.6,
  light: 47.2,
  suppression: 48.0,
  // L12
  pehle: 49.6,
  photo: 50.8,
  wahiSaboot: 51.7,
  // L13
  isBaar: 53.8,
  alert: 56.1,
  // L14
  taala: 58.1,
  aagKo: 59.9,
  // L15
  fk: 61.3,
  bhejiye: 62.5,
  end: 66.1,
} as const;

/** Scene cut points (seconds); every cut sits in a VO pause. */
const CUTS = {
  hook: 0.0,
  inside: 5.2,
  call: 16.35,
  arrive: 22.4,
  proof: 30.75,
  turn: 35.0,
  product: 38.75,
  system: 43.15,
  alert: 53.55,
  hero: 57.9,
  end: 67.6,
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
