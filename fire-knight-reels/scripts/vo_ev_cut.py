"""Shorten the EV Owners voiceover by dropping whole phrases at their pauses and tightening the gaps.

usage: python3 scripts/vo_ev_cut.py <vo.mp3> <silences.txt> <out.wav> [--dry]
silences.txt holds "start end" pairs from ffmpeg silencedetect (-38 dB, 0.18 s).
Prints the new start/end of every kept phrase, for src/ev/timing.ts.
"""
import subprocess
import sys

import numpy as np
import soundfile as sf

SRC, SIL, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
GMAX = 0.34  # longest pause left between two phrases
LEAD = 0.12

# phrase index (in order of the recording) -> label; a leading "-" drops the phrase
PHRASES = [
    "ev", "yeh", "battery", "range", "charging", "-bata", "but", "batArea", "kahan", "office", "mall", "charger", "society",
    "nazar", "-agar", "kaise", "cctv", "security", "yaTab", "visible", "-realGap", "risk", "vis", "yahin", "zones", "flame",
    "threat", "targeted", "-matlab", "-already", "-jahan", "insurance", "servicing", "dashcam", "because", "optional", "fk",
    "byFk", "consult", "dm",
]

tmp = OUT + ".src.wav"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", SRC, "-ar", "48000", "-ac", "1", tmp], check=True)
x, sr = sf.read(tmp, dtype="float32")
sil = [tuple(map(float, l.split())) for l in open(SIL) if l.strip()]
segs, t = [], 0.0
for a, b in sil:
    if a - t > 0.12:
        segs.append((t, a))
    t = b
if len(x) / sr - t > 0.12:
    segs.append((t, len(x) / sr))
assert len(segs) == len(PHRASES), (len(segs), len(PHRASES))

parts, cur, rows = [np.zeros(int(LEAD * sr), dtype=np.float32)], LEAD, []
for i, ((a, b), name) in enumerate(zip(segs, PHRASES)):
    if name.startswith("-"):
        continue
    gb = a - (segs[i - 1][1] if i else 0.0)
    ga = (segs[i + 1][0] if i + 1 < len(segs) else len(x) / sr) - b
    a2 = max(0.0, a - min(gb, GMAX) / 2)
    b2 = min(len(x) / sr, b + min(ga, GMAX) / 2)
    y = x[int(a2 * sr): int(b2 * sr)].copy()
    f = int(0.012 * sr)
    y[:f] *= np.linspace(0, 1, f)
    y[-f:] *= np.linspace(1, 0, f)
    rows.append((name, cur + (a - a2), cur + (a - a2) + (b - a)))
    parts.append(y)
    cur += len(y) / sr
out = np.concatenate(parts)
print("kept %d of %d phrases, %.2f s -> %.2f s" % (len(rows), len(segs), len(x) / sr, len(out) / sr))
for n, s, e in rows:
    print("%-10s %6.2f %6.2f" % (n, s, e))
if "--dry" not in sys.argv:
    sf.write(OUT, out, sr, subtype="PCM_16")
import os
os.remove(tmp)
