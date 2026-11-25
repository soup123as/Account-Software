"""Synthesise the EV Owners (Sentinel) score + SFX, cued from src/ev/timing.ts.

usage: python3 scripts/sound_ev.py public/audio/ev-raw.wav
Then loudness-normalise with ffmpeg (see scripts/render.sh).
"""
import re
import sys

SFX_ONLY = "--sfx-only" in sys.argv  # no music: drop the pad, drone and tonal swells
import wave
import numpy as np

SR = 48000
# ---- read the cue sheet straight from the Remotion timing file ----
_ts = open(__file__.replace("scripts/sound_ev.py", "src/ev/timing.ts")).read()
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


def alarm_t3(d, f0=3100):
    """Smoke-alarm temporal-3 pattern: three beeps, then a pause."""
    out = np.zeros(int(d * SR))
    s = 0.0
    while s < d:
        for k in range(3):
            a = s + k * 0.42
            if a + 0.24 < d:
                x = beep(f0, 0.24) + 0.4 * beep(f0 * 1.005, 0.24)
                i = int(a * SR)
                out[i : i + len(x)] += x
        s += 0.42 * 3 + 0.75
    return out


def powerdown(d=1.6):
    tt = t_(d)
    f = 240 * np.exp(-tt * 1.6) + 38
    ph = np.cumsum(f) / SR
    x = np.sin(2 * np.pi * ph) + 0.4 * np.sin(4 * np.pi * ph)
    return norm(x) * adsr(len(tt), 0.02, 0.5) * (1 - tt / d) ** 0.6


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
pad_g = np.interp(
    tt,
    [0, 1.5, S("dash"), S("heat"), S("places"), S("gap"), Q["visible"] + 0.6, S("real"), Q["vis"] + 1.2, S("product") - 0.1, S("product") + 0.8, S("system"), S("wait"), S("ending"), Q["logo"], DUR],
    [0.1, 0.3, 0.42, 0.3, 0.42, 0.3, 0.12, 0.3, 0.0, 0.0, 0.5, 0.42, 0.55, 0.5, 0.7, 0],
)
if not SFX_ONLY:
    L += pad * pad_g * 0.32
    R += pad * pad_g * 0.32

drone = norm(np.sin(2 * np.pi * 36.7 * tt) + 0.5 * np.sin(2 * np.pi * 55 * tt + 0.7))
drone_g = np.interp(tt, [0, 1, S("heat"), S("gap"), S("real"), S("product"), Q["logo"], DUR], [0.14, 0.2, 0.28, 0.3, 0.34, 0.12, 0.1, 0])
if not SFX_ONLY:
    L += drone * drone_g
    R += drone * drone_g

# heartbeat through the problem half
hb = S("heat") + 0.3
while hb < S("product") - 0.6:
    if not (S("places") <= hb < S("gap")):
        put(thud(50, 32, 0.3, 0.0), hb, 0.28)
        put(thud(44, 30, 0.3, 0.0), hb + 0.17, 0.17)
    hb += 0.75 if hb < S("gap") else 0.6

# ---------------- 1 hook: a car on charge in a quiet basement ----------------
put(buzzhum(S("dash"), 100), 0.0, 0.035)
put(thud(58, 36, 0.6), 0.02, 0.42)
for k in range(3):
    put(beep(1760, 0.04), 0.9 + k * 1.9, 0.03, -0.3)  # the charger's status blip
put(whoosh(2.4, 90, 2500, 0.7), Q["yeh"] - 0.2, 0.26)
put(thud(60, 36, 0.6), Q["zyada"] + 0.33, 0.42)

# ---------------- 2 dash: what the car tells you ----------------
put(whoosh(0.7, 200, 4000, 0.6), S("dash") - 0.3, 0.24)
for k in ("battery", "range", "charging"):
    put(tick(2400, 0.035), Q[k], 0.09)
    put(beep(1320, 0.06), Q[k] + 0.06, 0.06, 0.2)
    put(thud(58, 36, 0.45), Q[k] + 0.27, 0.34)
put(thud(54, 34, 0.7), Q["bata"] + 0.53, 0.42)

# ---------------- 3 heat: what it does not ----------------
put(whoosh(1.4, 100, 3000, 0.6), Q["nahiD"] - 0.4, 0.28)
put(thud(52, 32, 0.8), Q["nahiD"], 0.44)
put(crackle(S("places") - Q["batArea"], 26), Q["batArea"], 0.06)
put(riser(1.6), Q["unusual"] - 1.6, 0.12)
put(boom(1.4), Q["unusual"], 0.5)
put(beep(880, 0.07), Q["unusual"] + 0.25, 0.07)
put(beep(880, 0.07), Q["unusual"] + 0.45, 0.07)

# ---------------- 4 places ----------------
put(thud(58, 36, 0.5), Q["kahan"] + 0.87, 0.36)
for k in ("office", "mall", "charger", "society"):
    put(whoosh(0.5, 200, 4000, 0.6), Q[k] - 0.25, 0.2)
    put(tick(2400, 0.035), Q[k], 0.09)
    put(thud(58, 36, 0.4), Q[k] + 0.13, 0.36)
put(thud(52, 32, 0.8), Q["baharW"], 0.45)

# ---------------- 5 gap ----------------
put(thud(58, 36, 0.5), Q["kaise"] + 0.33, 0.38)
put(click(2600, 0.04), Q["cctv"] - 0.05, 0.3)
put(thud(60, 36, 0.4), Q["cctv"], 0.4)
put(thud(60, 36, 0.4), Q["security"], 0.4)
put(riser(1.0), Q["visible"] - 0.6, 0.1)
put(crackle(S("real") - Q["visible"], 40), Q["visible"], 0.09)
put(boom(1.6), Q["visible"] + 0.4, 0.5)

# ---------------- 6 the real gap ----------------
put(tick(2000, 0.04), Q["risk"], 0.1)
put(thud(56, 34, 0.6), Q["risk"], 0.42)
put(riser(Q["vis"] - Q["risk"] - 0.2), Q["risk"] + 0.2, 0.07)
put(thud(52, 32, 0.9, 0.1), Q["vis"], 0.46)
put(tick(1600, 0.05), Q["vis"], 0.1)

# ---------------- 7 product ----------------
put(whoosh(1.0, 150, 4000, 0.7), S("product") - 0.1, 0.3)
mt2 = t_(1.6)
if not SFX_ONLY:
    put(norm(sum(np.sin(2 * np.pi * f * mt2) * g for f, g in [(196, 1), (294, 0.5), (392, 0.3)])) * (mt2 / 1.6) ** 1.5 * adsr(len(mt2), 0.01, 0.3), Q["yahin"], 0.14)
put(thud(56, 34, 0.7, 0.1), Q["sentinel"], 0.48)

# ---------------- 8 system ----------------
put(thud(58, 36, 0.5), Q["monitorW"], 0.38)
for k in ("flame", "heat2"):
    put(tick(2400, 0.035), Q[k], 0.09)
    put(beep(1320, 0.05), Q[k] + 0.05, 0.05, 0.2)
put(beep(880), Q["detect"] + 0.02, 0.12)
put(beep(1320), Q["detect"] + 0.15, 0.12)
put(thud(58, 36, 0.5), Q["detect"], 0.36)
put(crackle(Q["targeted"] + 0.8 - Q["heat2"], 30), Q["heat2"], 0.06)
put(thud(56, 34, 0.5), Q["threat"] + 0.4, 0.34)
put(hiss(S("wait") - 0.4 - Q["targeted"]), Q["targeted"] + 0.13, 0.2)
put(thud(50, 32, 0.8, 0.0), Q["targeted"], 0.42)
put(thud(56, 34, 0.5), Q["auto"], 0.34)

# ---------------- 9 wait ----------------
put(whoosh(1.0, 120, 3000, 0.5), S("wait") - 0.2, 0.2)
put(thud(56, 34, 0.6), Q["waitW"], 0.42)
put(thud(56, 34, 0.5), Q["monitor2"], 0.36)
put(beep(1568, 0.06), Q["monitor2"] + 0.3, 0.05, 0.2)
put(thud(52, 32, 0.8), Q["dekhW"], 0.44)

# ---------------- 10 ending ----------------
for k in ("insurance", "servicing", "dashcam"):
    put(whoosh(0.4, 300, 5000, 0.6), Q[k] - 0.1, 0.16)
    put(thud(60, 36, 0.35), Q[k] + 0.05, 0.3)
    put(tick(2600, 0.03), Q[k] + 0.55, 0.1)
    put(beep(1760, 0.05), Q[k] + 0.6, 0.05, 0.2)
put(thud(56, 34, 0.6), Q["because"] + 0.27, 0.42)
put(riser(1.0), Q["optW"] - 1.0, 0.1)
put(boom(1.6), Q["optW"], 0.52)
put(whoosh(1.2, 120, 3000, 0.5), Q["fk"] - 0.4, 0.26)
put(thud(54, 32, 0.9, 0.1), Q["fk"], 0.46)
put(whoosh(2.0, 100, 3000, 0.3), Q["logo"] - 0.6, 0.28)
put(boom(3.0), Q["logo"], 0.8)
put(thud(52, 30, 1.2, 0.2), Q["logo"], 0.42)
et = t_(DUR - Q["logo"])
tone = (np.sin(2 * np.pi * 73.4 * et) + 0.5 * np.sin(2 * np.pi * 110 * et) + 0.25 * np.sin(2 * np.pi * 146.8 * et)) * adsr(len(et), 0.4, 1.6)
if not SFX_ONLY:
    put(norm(tone), Q["logo"], 0.28)
put(thud(58, 36, 0.5), Q["consult"], 0.3)
put(beep(1568, 0.08), Q["dm"], 0.07, 0.2)
put(beep(2093, 0.12), Q["dm"] + 0.09, 0.07, 0.2)
put(thud(54, 34, 0.7, 0.1), Q["dm"], 0.4)

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
