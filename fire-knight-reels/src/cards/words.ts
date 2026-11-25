import type { CapWord } from "./kit";

/**
 * Caption words for the "Raat ka call" voiceover (public/audio/vo-call.wav). Phrase starts and ends
 * are exact (scripts/vo_call.py); the words inside a phrase are spread by syllable weight.
 * A leading * marks the key word of a group (gold pill).
 */
const PHRASES: [number, number, string][] = [
  [0.15, 3.298, "Raat do baje server room ka *alarm bajta hai."],
  [3.648, 5.022, "Aur phir aapka *phone."],
  [5.472, 6.746, "Ab aap kya *karenge?"],
  [7.496, 9.154, "Pehla call, *guard ko."],
  [9.454, 12.079, "Server room ki chaabi uske paas *nahi hai."],
  [12.729, 15.037, "Doosra call, *IT team ko."],
  [15.337, 16.641, "Phone *silent par hai."],
  [17.291, 18.735, "Toh aap *khud nikalte hain."],
  [19.085, 21.148, "Office shehar ke doosre *kone mein hai."],
  [21.898, 23.668, "Alarm ne apna *kaam kar diya."],
  [24.068, 26.863, "Room ke andar ab tak kisi ne kuch *nahi kiya."],
  [27.813, 29.221, "Ek aur *tareeka hai."],
  [29.721, 31.245, "Deewar par ek *unit,"],
  [31.495, 34.117, "jo flame aur garmi khud *sense karta hai"],
  [34.417, 36.117, "aur khud *activate hota hai."],
  [36.617, 38.687, "Na chaabi chahiye, na *call."],
  [39.337, 40.82, "Alert aapke *phone par,"],
  [41.12, 43.589, "aur aap app se bhi unit *chala sakte hain."],
  [44.339, 45.46, "Alarm *zaroori hai."],
  [45.86, 48.162, "Lekin alarm sirf *awaaz deta hai."],
  [48.562, 50.505, "*Jawaab kisi ko dena padta hai."],
  [51.355, 53.488, "Jinke paas raat ko yeh *call aata hai,"],
  [53.788, 55.196, "yeh reel unhe *bhejiye."],
];

const syl = (w: string) => Math.max(1, (w.toLowerCase().match(/[aeiou]+/g) ?? []).length) + 0.6;

/** Split n words into groups of 2-3 (never a lone last word). */
const split = (n: number) => {
  const out: number[] = [];
  let left = n;
  while (left > 0) {
    if (left <= 3) {
      out.push(left);
      left = 0;
    } else if (left === 4) {
      out.push(2, 2);
      left = 0;
    } else {
      out.push(3);
      left -= 3;
    }
  }
  return out;
};

export const WORDS: CapWord[] = (() => {
  const all: CapWord[] = [];
  let g = 0;
  for (const [s, e, text] of PHRASES) {
    const raw = text.split(" ");
    const ws = raw.map((w) => w.replace("*", ""));
    const wt = ws.map(syl);
    const tot = wt.reduce((a, b) => a + b, 0);
    let acc = 0;
    const sizes = split(ws.length);
    let k = 0;
    sizes.forEach((n) => {
      for (let i = 0; i < n; i++) {
        const a = s + (acc / tot) * (e - s);
        acc += wt[k];
        const b = s + (acc / tot) * (e - s);
        all.push({ w: ws[k], s: a, e: b, g, key: raw[k].startsWith("*") });
        k++;
      }
      g++;
    });
  }
  return all;
})();
