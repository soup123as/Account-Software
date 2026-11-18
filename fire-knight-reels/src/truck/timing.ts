/**
 * "Truck Owners" reel - scene lengths (30 fps) cut to the revised VO script.
 * Phrase times below are ESTIMATED (natural Hinglish pace, ~2.3 words/s) until the client's
 * voiceover arrives; then re-time from silencedetect + transcript (see skill 7b).
 *
 * P1 0.10-3.40  Truck owners, aapka sabse bada nuksaan accident nahi... yeh ho sakta hai.
 * P2 3.80-8.00  Raat ke do baje. Highway par. Engine bay mein heat badh rahi hai.
 * P3 8.50-15.30 Aur driver ke paas chaar kaam hain: khatra dekhna, truck rokna, extinguisher lana, aur aag se ladna.
 * P4 15.80-20.70 Lekin agar woh waqt par na pahunche... toh nuksaan sirf truck ka nahi, maal aur kamaai ka bhi.
 * P5 21.20-22.90 Yahin kaam aata hai Ranger.
 * P6 23.40-28.10 Heat detect hote hi alarm bajta hai, aur suppression automatically activate ho jaata hai.
 * P7 28.60-31.90 Kyunki aapka business ek driver ke bharose nahi chalna chahiye.
 * P8 32.40-38.20 The Fire Knight. Because every second matters. Free consultation ke liye WhatsApp karein.
 */
export const T_SCENES = {
  hook: 110, // 0.00-3.67
  night: 140, // 3.67-8.33
  driver: 219, // 8.33-15.63
  loss: 162, // 15.63-21.03
  product: 69, // 21.03-23.33
  system: 153, // 23.33-28.43
  hero: 348, // 28.43-40.03
} as const;
export const T_TOTAL = Object.values(T_SCENES).reduce((a, b) => a + b, 0);
