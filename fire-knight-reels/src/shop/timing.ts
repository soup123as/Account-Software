/**
 * "Shop Owners" reel (the Protector) - VO cue sheet in SECONDS, synced to the client's
 * ElevenLabs VO (public/audio/vo-shop.mp3, 69.25 s). Phrase timecodes from silencedetect
 * (-38 dB, 0.18 s) + Whisper transcription; every cut sits in a VO pause.
 *
 *  0.00-1.63 Shutter gira ke ghar jaate ho? | 2.25-3.68 Andar abhi bhi kya chal raha hai | 4.17-4.75 kabhi socha hai?
 *  5.40-6.26 Dukaan band hai | 6.70-8.49 lekin andar sab kuch band nahi.
 *  8.95 Fridge | 9.75 Inverter | 10.75-11.57 Aur ek board par | 11.83-12.47 chaar plug.
 *  12.87-13.86 Aur inmein se ek | 14.18-15.53 raat bhar garam ho raha hai.
 *  16.12-18.98 Raat ke do baje, kisi unknown number se call aata hai: | 19.36 "Bhai, | 19.87-21.21 aapki dukaan mein aag lagi hai!"
 *  21.79-23.06 Lekin asli jhatka | 23.29-24.55 pahunchne ke baad lagta hai.
 *  25.04-26.31 Shutter garmi se jam. | 26.70-30.14 Gali itni tang, ki fire brigade andar tak nahi aa paati.
 *  30.62-33.14 Aur aag bujhne ke baad, insurance poochta hai: | 33.48-34.15 "Saboot kahan hai?"
 *  34.70-35.19 Ab sochiye | 35.66-38.47 agar us raat aapki dukaan khud jaag rahi hoti?
 *  39.00 Ceiling par, | 39.93 The Protector. | 41.03-43.48 Shutter girne ke baad bhi... jaagta hua.
 *  43.88-47.30 Flame, heat aur gas sensors milkar confirm karte hain. | 47.75 Siren, | 48.54 light | 49.19 aur suppression, | 50.21 apne aap.
 *  51.24-52.13 Aur usse pehle | 52.45 ek photo. | 53.44-55.54 Wahi saboot, jo insurance maangega.
 *  55.95-58.17 Is baar kisi unknown call ka intezaar nahi | 58.56-60.33 alert seedha aapke phone par.
 *  60.73-62.35 Kyunki taala chor ko rokta hai | 62.72-63.35 aag ko nahi.
 *  63.76-64.68 The Fire Knight. | 65.05-67.10 Yeh reel har us dukaandaar ko bhejiye | 67.35-69.01 jo aaj raat shutter giraayega.
 */
export const CUE = {
  shutter: 0.0,
  andar: 2.25,
  kabhi: 4.17,
  band: 5.4,
  lekinAndar: 6.7,
  fridge: 8.95,
  inverter: 9.75,
  board: 10.75,
  chaarPlug: 11.83,
  inmein: 12.87,
  garam: 14.18,
  raat: 16.12,
  unknown: 17.4,
  bhai: 19.36,
  aag: 20.55,
  asli: 21.79,
  pahunch: 23.29,
  jam: 25.04,
  gali: 26.7,
  brigade: 27.9,
  bujhne: 30.62,
  insurance: 31.9,
  saboot: 33.48,
  sochiye: 34.7,
  jaag: 37.2,
  ceiling: 39.0,
  protector: 39.93,
  girne: 41.03,
  jaagta: 42.6,
  flame: 43.88,
  heat: 44.35,
  gas: 44.85,
  confirm: 46.1,
  siren: 47.75,
  light: 48.54,
  suppression: 49.19,
  pehle: 51.24,
  photo: 52.45,
  wahiSaboot: 53.44,
  isBaar: 55.95,
  alert: 58.56,
  taala: 60.73,
  aagKo: 62.72,
  fk: 63.76,
  bhejiye: 65.05,
  end: 69.01,
} as const;

/** Scene cut points (seconds), each inside a VO pause. Reel = VO + 1.8 s logo hold. */
const CUTS = {
  hook: 0.0,
  inside: 5.05,
  call: 15.8,
  arrive: 21.5,
  proof: 30.38,
  turn: 34.42,
  product: 38.72,
  system: 43.68,
  alert: 55.74,
  hero: 60.53,
  end: 70.8,
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
