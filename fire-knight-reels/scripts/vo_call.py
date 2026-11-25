"""Generate the voiceover for the "Raat ka call" reel with a local open-source Hindi voice (Piper).

usage: python3 scripts/vo_call.py <piper model.onnx> <work dir> public/audio/vo-call.wav
Writes the assembled VO (48 kHz mono) and <work dir>/vo-call.json with the start/end of every phrase.
Each phrase is synthesised on its own, trimmed, then laid out with the pauses below, so the cue sheet
in src/call/timing.ts comes straight from this file's output.
"""
import json
import subprocess
import sys

import numpy as np
import soundfile as sf

MODEL, WORK, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
SR = 48000
LEAD = 0.15

# (key, Hinglish line as scripted, Devanagari for the voice, pause after in seconds)
PHRASES = [
    ("raat", "Raat do baje server room ka alarm bajta hai.", "रात दो बजे सर्वर रूम का अलार्म बजता है।", 0.35),
    ("phone", "Aur phir aapka phone.", "और फिर आपका फ़ोन।", 0.45),
    ("abKya", "Ab aap kya karenge?", "अब आप क्या करेंगे?", 0.75),
    ("call1", "Pehla call, guard ko.", "पहला कॉल, गार्ड को।", 0.3),
    ("chaabi", "Server room ki chaabi uske paas nahi hai.", "सर्वर रूम की चाबी उसके पास नहीं है।", 0.65),
    ("call2", "Doosra call, IT team ko.", "दूसरा कॉल, आई टी टीम को।", 0.3),
    ("silent", "Phone silent par hai.", "फ़ोन साइलेंट पर है।", 0.65),
    ("khud", "Toh aap khud nikalte hain.", "तो आप ख़ुद निकलते हैं।", 0.35),
    ("kone", "Office shehar ke doosre kone mein hai.", "ऑफ़िस शहर के दूसरे कोने में है।", 0.75),
    ("kaam", "Alarm ne apna kaam kar diya.", "अलार्म ने अपना काम कर दिया।", 0.4),
    ("andar", "Room ke andar ab tak kisi ne kuch nahi kiya.", "रूम के अंदर अब तक किसी ने कुछ नहीं किया।", 0.95),
    ("tareeka", "Ek aur tareeka hai.", "एक और तरीक़ा है।", 0.5),
    ("unit", "Deewar par ek unit,", "दीवार पर एक यूनिट,", 0.25),
    ("sense", "jo flame aur garmi khud sense karta hai", "जो फ़्लेम और गर्मी ख़ुद सेंस करता है", 0.3),
    ("activate", "aur khud activate hota hai.", "और ख़ुद ऐक्टिवेट होता है।", 0.5),
    ("naChaabi", "Na chaabi chahiye, na call.", "ना चाबी चाहिए, ना कॉल।", 0.65),
    ("alert", "Alert aapke phone par,", "अलर्ट आपके फ़ोन पर,", 0.3),
    ("app", "aur aap app se bhi unit chala sakte hain.", "और आप ऐप से भी यूनिट चला सकते हैं।", 0.75),
    ("zaroori", "Alarm zaroori hai.", "अलार्म ज़रूरी है।", 0.4),
    ("awaaz", "Lekin alarm sirf awaaz deta hai.", "लेकिन अलार्म सिर्फ़ आवाज़ देता है।", 0.4),
    ("jawaab", "Jawaab kisi ko dena padta hai.", "जवाब किसी को देना पड़ता है।", 0.85),
    ("jinke", "Jinke paas raat ko yeh call aata hai,", "जिनके पास रात को यह कॉल आता है,", 0.3),
    ("bhejiye", "yeh reel unhe bhejiye.", "यह रील उन्हें भेजिए।", 0.0),
]


def trim(x, sr, thr=0.012, pad=0.03):
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(pad * sr))
    b = min(len(x), idx[-1] + int(pad * sr))
    return x[a:b]


cues, parts, t = {}, [np.zeros(int(LEAD * SR), dtype=np.float32)], LEAD
for key, _roman, deva, gap in PHRASES:
    raw = f"{WORK}/{key}.wav"
    subprocess.run([sys.executable, "-m", "piper", "-m", MODEL, "-c", MODEL + ".json", "-f", raw, "--sentence-silence", "0"], input=deva.encode(), check=True, capture_output=True)
    up = f"{WORK}/{key}.48k.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-ar", str(SR), "-ac", "1", up], check=True)
    x, sr = sf.read(up, dtype="float32")
    x = trim(x, sr)
    fade = int(0.008 * sr)
    x[:fade] *= np.linspace(0, 1, fade)
    x[-fade:] *= np.linspace(1, 0, fade)
    cues[key] = {"start": round(t, 3), "end": round(t + len(x) / SR, 3)}
    parts += [x, np.zeros(int(gap * SR), dtype=np.float32)]
    t += len(x) / SR + gap
vo = np.concatenate(parts)
vo = vo / max(1e-6, np.abs(vo).max()) * 0.89
sf.write(OUT, vo, SR, subtype="PCM_16")
json.dump({"duration": round(len(vo) / SR, 3), "cues": cues}, open(f"{WORK}/vo-call.json", "w"), indent=1)
print("VO", round(len(vo) / SR, 2), "s")
for k, v in cues.items():
    print(f"  {v['start']:6.2f}-{v['end']:6.2f}  {k}")
