/**
 * "Truck Owners" reel - scene lengths (30 fps) cut to the client's ElevenLabs VO v2 (38.77 s).
 * Every cut sits in a VO pause. Total 1212 frames = 40.4 s (VO + 1.6 s hold).
 *
 * 0.00-0.79 Truck owners, | 1.21-3.73 aapka sabse bada nuksaan accident nahi... | 4.30-5.04 yeh ho sakta hai.
 * 5.53-6.47 Raat ke do baje. | 6.85-7.43 Highway par. | 7.86-9.50 Engine bay mein heat badh rahi hai.
 * 9.87-11.51 Aur driver ke paas chaar kaam hain: | 11.96 khatra dekhna | 13.02 truck rokna |
 *   14.03 extinguisher lana | 15.26-16.35 aur aag se ladna.
 * 16.79-18.58 Lekin agar woh waqt par na pahunche... | 18.85-20.38 toh nuksaan sirf truck ka nahi, |
 *   20.71 maal | 21.36-22.14 aur kamaai ka bhi.
 * 22.57-24.19 Yahin kaam aata hai Ranger.
 * 24.56-26.49 Heat detect hote hi alarm bajta hai, | 26.76-29.13 aur suppression automatically activate ho jaata hai.
 * 29.50-33.04 Kyunki aapka business sirf regular safety ke bharose nahi chalna chahiye.
 * 33.44-34.33 The Fire Knight. | 34.65-36.35 Because every second matters. | 36.69-38.51 Free consultation ke liye WhatsApp karein.
 */
export const T_SCENES = {
  hook: 158, // 0.00-5.27
  night: 132, // 5.27-9.67
  driver: 207, // 9.67-16.57
  loss: 173, // 16.57-22.33
  product: 61, // 22.33-24.37
  system: 148, // 24.37-29.30
  hero: 333, // 29.30-40.40
} as const;
export const T_TOTAL = Object.values(T_SCENES).reduce((a, b) => a + b, 0);
