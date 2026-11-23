"""Synthesise the Bus Owners (Sentinel) score + SFX, cued from src/bus/timing.ts.

usage: python3 scripts/sound_bus.py public/audio/bus-raw.wav [--sfx-only]
Then loudness-normalise with ffmpeg (see scripts/render.sh).
"""
import re
import sys

SFX_ONLY = "--sfx-only" in sys.argv  # no music: drop the pad, drone and tonal swells
import wave
import numpy as np

SR = 48000
# ---- read the cue sheet straight from the Remotion timing file ----
import os
_ts = open(os.environ.get("BUS_TIMING") or __file__.replace("scripts/sound_bus.py", "src/bus/timing.ts")).read()  # BUS_TIMING: cue sheet of another cut
def _block(name):
    body = re.search(name + r" = \{(.*?)\} as const", _ts, re.S).group(1)
    return {k: float(v) for k, v in re.findall(r"(\w+): ([0-9.]+)", body)}
Q = _block("CUE")
CUT = _block("CUTS")
DUR = round(CUT["end"] * 30) / 30.0
N = int(SR * DUR)
rng = np.random.default_rng(11)
L = np.zeros(N)
R = np.zeros(N)
F = lambda frame: frame / 30.0  # frame -> seconds


def t_(d):
    return np.arange(int(d * SR)) / SR


def band(x, lo, hi):
    """Static FFT band-pass."""
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(len(x), 1 / SR)
    m = ((fr >= lo) & (fr <= hi)).astype(float)
    # soft edges
    m = np.convolve(m, np.hanning(31) / np.hanning(31).sum(), mode="same")
    return np.fft.irfft(X * m, n=len(x))


def norm(x):
    p = np.max(np.abs(x)) or 1
    return x / p


def put(x, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    x = x[: N - i]
    gl = gain * np.sqrt((1 - pan) / 2) * np.sqrt(2)
    gr = gain * np.sqrt((1 + pan) / 2) * np.sqrt(2)
    L[i : i + len(x)] += x * gl
    R[i : i + len(x)] += x * gr


def env(n, a, d, curve=4.0):
    """attack seconds, exp decay seconds."""
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-4), np.exp(-(t - a) / max(d, 1e-4) * curve / 4))
    return e


def adsr(n, a, r):
    t = np.arange(n) / SR
    d = n / SR
    return np.clip(np.minimum(t / max(a, 1e-4), (d - t) / max(r, 1e-4)), 0, 1)


# ---------------- instruments ----------------
def thud(f0=58, f1=36, d=0.55, click=0.25):
    t = t_(d)
    fr = f1 + (f0 - f1) * np.exp(-t * 18)
    ph = 2 * np.pi * np.cumsum(fr) / SR
    x = np.sin(ph) * np.exp(-t * 7)
    n = band(rng.standard_normal(len(t)), 200, 3000) * np.exp(-t * 80)
    return norm(x + click * norm(n))


def boom(d=2.6):
    t = t_(d)
    fr = 30 + 30 * np.exp(-t * 6)
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 1.6)
    n = band(rng.standard_normal(len(t)), 20, 220) * np.exp(-t * 2.2)
    return norm(x + 0.6 * norm(n))


def whoosh(d=0.7, lo=300, hi=6000, peak=0.6):
    t = t_(d)
    n = rng.standard_normal(len(t))
    e = np.where(t < d * peak, (t / (d * peak)) ** 2, np.exp(-(t - d * peak) * 9))
    a = band(n, lo, lo * 3) * np.clip(1 - t / d * 1.3, 0, 1)
    b = band(n, lo * 3, hi) * np.clip(t / d * 1.4, 0, 1)
    return norm((a + b) * e)


def tick(f=3200, d=0.05):
    t = t_(d)
    return norm(np.sin(2 * np.pi * f * t) * np.exp(-t * 120) + 0.4 * band(rng.standard_normal(len(t)), 3000, 9000) * np.exp(-t * 200))


def beep(f, d=0.1):
    t = t_(d)
    x = np.sin(2 * np.pi * f * t) + 0.15 * np.sin(2 * np.pi * 2 * f * t)
    return x * adsr(len(t), 0.005, 0.03)


def clank():
    t = t_(0.5)
    x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, a, k in [(523, 1, 9), (1371, 0.6, 14), (2210, 0.4, 20), (3300, 0.2, 30)])
    return norm(x + 0.3 * band(rng.standard_normal(len(t)), 2000, 8000) * np.exp(-t * 90))


def hiss(d):
    t = t_(d)
    return norm(band(rng.standard_normal(len(t)), 1800, 11000)) * adsr(len(t), 0.08, d * 0.5)


def riser(d):
    t = t_(d)
    n = rng.standard_normal(len(t))
    x = np.zeros_like(t)
    k = 5
    for i in range(k):
        lo = 200 * (2 ** i)
        seg = band(n, lo, lo * 2)
        w = np.clip((t / d) * k - i, 0, 1)
        x += seg * w
    tone = np.sin(2 * np.pi * np.cumsum(110 + 330 * (t / d) ** 2) / SR) * 0.35
    return norm(x * (t / d) ** 1.5 + tone * (t / d))


def note(f, d, a=0.6, r=0.8, partials=((1, 1), (2, 0.35), (3, 0.18), (4, 0.08))):
    t = t_(d)
    x = sum(g * (np.sin(2 * np.pi * f * k * t) + np.sin(2 * np.pi * f * k * 1.004 * t + 1.3)) for k, g in partials)
    return x * adsr(len(t), a, r)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)



# ---------------- extra instruments ----------------
def ring(d=1.6):
    """phone ringtone: two-tone marimba-ish pattern + vibration buzz"""
    out = np.zeros(int(d * SR))
    seq = [(1318.5, 0.0), (1046.5, 0.14), (1318.5, 0.28), (1568, 0.42)]
    for f0, s in seq:
        x = np.sin(2 * np.pi * f0 * t_(0.22)) * np.exp(-t_(0.22) * 18)
        i = int(s * SR)
        out[i : i + len(x)] += x
    vt = t_(d)
    buzz = band(rng.standard_normal(len(vt)), 120, 260) * (np.sin(2 * np.pi * 0.0 * vt) + 1) * ((vt % 0.8) < 0.5)
    return norm(out) * 0.8 + norm(buzz) * 0.35


def siren(d):
    tt = t_(d)
    f = np.where((tt % 0.7) < 0.35, 960, 760)
    ph = np.cumsum(f) / SR
    x = np.sign(np.sin(2 * np.pi * ph)) * 0.4 + np.sin(2 * np.pi * ph)
    return band(x, 300, 3000) * adsr(len(tt), 0.05, 0.2)


def rattle(d=0.9):
    """steel shutter rattle"""
    tt = t_(d)
    x = rng.standard_normal(len(tt)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 22 * tt)))
    return norm(band(x, 400, 5000)) * adsr(len(tt), 0.01, 0.5)


def click(f=4000, d=0.03):
    return norm(band(rng.standard_normal(int(d * SR)), f * 0.5, f * 2)) * np.exp(-t_(d) * 120)


def crackle(d, dens=40):
    x = np.zeros(int(d * SR))
    for _ in range(int(d * dens)):
        i = rng.integers(0, len(x) - 400)
        x[i : i + 400] += rng.standard_normal(400) * np.exp(-np.arange(400) / 60) * rng.uniform(0.2, 1)
    return norm(band(x, 800, 9000))


def buzzhum(d, f0=100):
    tt = t_(d)
    x = np.sin(2 * np.pi * f0 * tt) + 0.6 * np.sin(2 * np.pi * 2 * f0 * tt) + 0.3 * np.sign(np.sin(2 * np.pi * f0 * tt))
    return norm(x) * adsr(len(tt), 0.3, 0.3)


S = lambda k: CUT[k]  # scene start (s)

# ---------------- score: dark pad Dm - Bb - F - C ----------------
BAR = 2.4
chords = [[50, 57, 62, 65], [46, 53, 58, 62], [41, 53, 57, 60], [48, 55, 60, 64]]
pad = np.zeros(N)
for b in range(int(DUR / BAR) + 1):
    for m in chords[b % 4]:
        x = note(hz(m), BAR + 0.9, a=0.9, r=1.0)
        i = int(b * BAR * SR)
        x = x[: max(0, N - i)]
        pad[i : i + len(x)] += x
pad = norm(band(pad, 40, 1800))
tt = np.arange(N) / SR
pad_g = np.interp(tt, [0, 1.5, S("passenger"), S("danger") - 0.2, S("danger") + 0.3, S("sentinel"), S("zones"), S("payoff"), S("payoff") + 0.4, S("payoff") + 3.6, Q["comment"] + 2.2, DUR],
                  [0.15, 0.4, 0.45, 0.5, 0.0, 0.55, 0.5, 0.6, 0.2, 0.45, 0.7, 0])
if not SFX_ONLY:
    L += pad * pad_g * 0.32
    R += pad * pad_g * 0.32
drone = norm(np.sin(2 * np.pi * 36.7 * tt) + 0.5 * np.sin(2 * np.pi * 55 * tt + 0.7))
drone_g = np.interp(tt, [0, 1, S("danger"), S("sentinel"), S("zones"), S("payoff"), DUR], [0.14, 0.22, 0.3, 0.15, 0.25, 0.15, 0])
if not SFX_ONLY:
    L += drone * drone_g
    R += drone * drone_g

# ---------------- bus on the road: diesel rumble + tyre hiss (stops in the punch) ----------------
rt = t_(S("payoff") + 1.4)
rum = band(rng.standard_normal(len(rt)), 30, 180) * (1 + 0.25 * np.sin(2 * np.pi * 7 * rt))
rum = norm(rum + 0.35 * np.sin(2 * np.pi * 38 * rt)) * adsr(len(rt), 0.6, 1.4)
put(rum, 0.0, 0.2)
put(norm(band(rng.standard_normal(len(rt)), 800, 5000)) * adsr(len(rt), 0.6, 1.4), 0.0, 0.035)
for k in range(int(S("payoff") / 2.6)):
    put(whoosh(0.9, 200, 3000, 0.5), 1.0 + k * 2.6, 0.07, 0.6)  # passing poles

# ---------------- 1 hook ----------------
put(thud(60, 36, 0.5), 0.15, 0.35)
put(whoosh(2.0, 90, 2500, 0.7), Q["kya"] - 0.4, 0.3)
put(thud(56, 34, 0.6), Q["kya"] + 0.75, 0.45)  # KYA?
for k in range(4):
    put(thud(50, 32, 0.3, 0.0), Q["kya"] + 1.0 + k * 0.7, 0.28)

# ---------------- 2 answer: x-ray + the cylinder ----------------
sw = t_(0.8)
put(np.sin(2 * np.pi * np.cumsum(400 + 2400 * (sw / 0.8)) / SR) * adsr(len(sw), 0.05, 0.3), Q["jawab"], 0.05, 0.2)
put(norm(band(rng.standard_normal(int(0.8 * SR)), 300, 6000)) * adsr(int(0.8 * SR), 0.05, 0.5), Q["jawab"], 0.12)
put(thud(60, 36, 0.6), Q["cylinder"] + 0.1, 0.5)
put(clank() * 0.6, Q["cylinder"] + 0.12, 0.12, -0.3)

# ---------------- 3 hidden danger: engine fire, battery sparks, smoky cabin ----------------
put(boom(1.4), S("danger") + 0.05, 0.4)
put(crackle(Q["battery"] - S("danger"), 60), S("danger") + 0.3, 0.14)
put(norm(band(rng.standard_normal(int(2.6 * SR)), 60, 700)) * adsr(int(2.6 * SR), 0.6, 0.4), S("danger") + 0.6, 0.18)  # fire roar
for k in range(6):
    put(click(5000, 0.015), Q["battery"] + 0.1 + k * 0.13, 0.2, 0.3)  # sparks
put(hiss(1.0), Q["battery"] + 0.1, 0.08)
put(riser(1.2), Q["dekh"] - 0.2, 0.22)
put(thud(56, 34, 0.6), Q["dekh"] + 0.4, 0.42)
for k in ("engine", "battery", "cabin"):
    put(whoosh(0.45, 400, 7000, 0.6), Q[k] - 0.15, 0.22)
    put(tick(2200, 0.04), Q[k] + 0.08, 0.08)
    put(thud(60, 36, 0.4, 0.1), Q[k] + 0.1, 0.3)
put(crackle(2.6, 18), Q["engine"] + 0.4, 0.05)

# ---------------- 4 product ----------------
put(whoosh(1.0, 150, 4000, 0.7), S("sentinel") - 0.1, 0.35)
mt2 = t_(1.6)
if not SFX_ONLY:
    put(norm(sum(np.sin(2 * np.pi * f * mt2) * g for f, g in [(196, 1), (294, 0.5), (392, 0.3)])) * (mt2 / 1.6) ** 1.5 * adsr(len(mt2), 0.01, 0.3), Q["sentinel"], 0.14)
put(thud(56, 34, 0.7, 0.1), Q["sentinel"] + 0.9, 0.45)

# ---------------- 5 system ----------------
for k in range(4):
    put(tick(2400, 0.035), Q["nazar"] + k * 0.12, 0.08, 0.2)
put(beep(880), Q["nazar"] + 0.5, 0.1)
put(beep(1320), Q["nazar"] + 0.63, 0.1)
put(crackle(Q["discharge"] - Q["aag"] + 1.2, 35), Q["aag"], 0.1)
put(beep(880), Q["aag"] + 0.4, 0.12)
put(beep(1320), Q["aag"] + 0.53, 0.12)
put(hiss(2.4), Q["discharge"], 0.22)
put(thud(50, 32, 0.8, 0.0), Q["discharge"], 0.36)
put(click(3000, 0.04), Q["button"] + 0.5, 0.35)  # button press
put(thud(80, 50, 0.2, 0.4), Q["button"] + 0.5, 0.3)
put(beep(1568, 0.1), Q["alert"] + 0.35, 0.12, -0.1)
put(beep(2093, 0.16), Q["alert"] + 0.46, 0.12, -0.1)

# ---------------- 6 driver + alert / 7 payoff: air brakes, hazards, door, footsteps ----------------
for k in range(0 if os.environ.get("BUS_NO_STEPS") else 14):  # evacuation footsteps (cinematic cut only)
    put(thud(120, 70, 0.1, 0.5), S("payoff") + 0.4 + k * 0.36, 0.1, (k % 2) * 0.4 - 0.2)
put(norm(band(rng.standard_normal(int(1.0 * SR)), 1500, 8000)) * np.exp(-t_(1.0) * 3), S("payoff") + 0.9, 0.18)  # air brake psst
for k in range(int((S("payoff") + 3.6 + 2 - S("payoff")) / 0.75)):
    put(tick(1500, 0.03), S("payoff") + 0.3 + k * 0.75, 0.06, 0.3)  # hazard relay
put(norm(band(rng.standard_normal(int(0.7 * SR)), 400, 4000)) * adsr(int(0.7 * SR), 0.05, 0.4), Q["kyunki"] + 0.7, 0.12, -0.2)  # door
put(thud(56, 34, 0.6), Q["kyunki"] + 1.0, 0.42)  # PASSENGERS

# ---------------- 7 hero ----------------
put(whoosh(1.6, 100, 3000, 0.3), S("payoff") + 3.6 - 0.2, 0.25)
put(thud(56, 34, 0.6), Q["comment"] + 0.6, 0.35)
LG = Q["comment"] + 2.2
put(boom(3.0), LG, 0.8)
put(thud(52, 30, 1.2, 0.2), LG, 0.42)
et = t_(4.0)
tone = (np.sin(2 * np.pi * 73.4 * et) + 0.5 * np.sin(2 * np.pi * 110 * et) + 0.25 * np.sin(2 * np.pi * 146.8 * et)) * adsr(len(et), 0.4, 2.4)
if not SFX_ONLY:
    put(norm(tone), LG, 0.26)
put(beep(1568, 0.08), LG + 1.15, 0.08, 0.2)
put(beep(2093, 0.12), LG + 1.24, 0.08, 0.2)

# ---------------- out ----------------
mix = np.stack([L, R], axis=1)
fade = np.ones(N)
fo = int(0.5 * SR)
fade[-fo:] = np.linspace(1, 0, fo)
mix *= fade[:, None]
mix /= max(1e-6, np.max(np.abs(mix))) / 0.89
pcm = (mix * 32767).astype("<i2")
with wave.open([a for a in sys.argv[1:] if not a.startswith("--")][0], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", [a for a in sys.argv[1:] if not a.startswith("--")][0], round(DUR, 2), "s", "(sfx only)" if SFX_ONLY else "")
