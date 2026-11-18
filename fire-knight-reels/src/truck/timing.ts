/**
 * "Truck Owners" reel - scene lengths (30 fps) cut to the client's ElevenLabs VO (38.6 s).
 * Every cut sits in a VO pause. Total 1206 frames = 40.2 s (VO + 1.6 s hold).
 *
 * 0.00-0.77 Truck owners, | 1.15-3.71 aapka sabse bada nuksaan accident nahi... | 4.25-5.09 yeh ho sakta hai.
 * 5.56-6.61 Raat ke do baje. | 7.00-7.58 Highway par. | 8.02-9.59 Engine bay mein heat badh rahi hai.
 * 10.04-11.67 Aur driver ke paas chaar kaam hain: | 12.11 khatra dekhna | 13.18 truck rokna |
 *   14.18 extinguisher lana | 15.39-16.52 aur aag se ladna.
 * 17.01-18.79 Lekin agar woh waqt par na pahunche... | 19.13-20.58 toh nuksaan sirf truck ka nahi, |
 *   20.91-22.27 maal aur kamaai ka bhi.
 * 22.83-24.47 Yahin kaam aata hai Ranger.
 * 24.88-26.64 Heat detect hote hi alarm bajta hai, | 26.90-29.21 aur suppression automatically activate ho jaata hai.
 * 29.65-32.73 Kyunki aapka business ek driver ke bharose nahi chalna chahiye.
 * 33.15-34.04 The Fire Knight. | 34.40-36.17 Because every second matters. | 36.55-38.31 Free consultation ke liye WhatsApp karein.
 */
export const T_SCENES = {
  hook: 160, // 0.00-5.33
  night: 135, // 5.33-9.83
  driver: 208, // 9.83-16.77
  loss: 174, // 16.77-22.57
  product: 63, // 22.57-24.67
  system: 143, // 24.67-29.43
  hero: 323, // 29.43-40.20
} as const;
export const T_TOTAL = Object.values(T_SCENES).reduce((a, b) => a + b, 0);
