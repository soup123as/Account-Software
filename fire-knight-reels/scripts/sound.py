"""Synthesise the Operator Akela score + SFX, cued to frames (30 fps).

usage: python3 scripts/sound.py public/audio/akela-raw.wav
Then loudness-normalise with ffmpeg (see scripts/render.sh).
"""
import sys
import wave
import numpy as np

SR = 48000
DUR = 20.0
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


# ---------------- score: dark pad Dm - Bb - F - C, 100 BPM ----------------
BAR = 2.4
chords = [[50, 57, 62, 65], [46, 53, 58, 62], [41, 53, 57, 60], [48, 55, 60, 64]]  # Dm Bb F C (low voicings)
pad = np.zeros(N)
for b in range(int(DUR / BAR) + 1):
    t0 = b * BAR
    for m in chords[b % 4]:
        x = note(hz(m), BAR + 0.9, a=0.9, r=1.0)
        i = int(t0 * SR)
        x = x[: max(0, N - i)]
        pad[i : i + len(x)] += x
pad = band(pad, 40, 1800)
pad = norm(pad)
# pad dynamics: in from 0.5 s, builds through scene 3, drops to sub alone before scene 4, warm in scene 5
tt = np.arange(N) / SR
pad_g = np.interp(tt, [0, 1.5, 7.0, 10.2, 10.6, 11.2, 13.5, 16.0, 17.3, 19.2, 20], [0, 0.45, 0.55, 0.7, 0.0, 0.0, 0.5, 0.45, 0.7, 0.55, 0])
L += pad * pad_g * 0.32
R += pad * pad_g * 0.32

# sub pulse on beats from scene 2
beat = 60 / 100
t = 3.0
while t < 16.0:
    if not (10.4 <= t < 11.0):
        put(thud(48, 34, 0.4, click=0.0), t, 0.32)
    t += beat

# drone under everything
drone = norm(np.sin(2 * np.pi * 36.7 * tt) + 0.5 * np.sin(2 * np.pi * 55 * tt + 0.7))
drone_g = np.interp(tt, [0, 1.2, 15.8, 16.4, 19, 20], [0, 0.22, 0.22, 0.1, 0.18, 0])
L += drone * drone_g
R += drone * drone_g

# ---------------- scene 1 ----------------
put(clank() * 0.5 + 0, F(3), 0.18, 0.4)  # lamp relay
put(thud(70, 40, 0.35), F(3), 0.45)
put(clank(), F(7), 0.14, 0.4)
put(thud(60, 36, 0.6), F(4), 0.75)  # 100-TONNE
put(whoosh(0.45, 600, 9000, 0.7), F(26), 0.35, -0.3)  # sweep line
put(boom(1.8), F(44), 0.85)  # SIRF OPERATOR?
put(thud(64, 36, 0.7, 0.4), F(44), 0.6)

# ---------------- scene 2 (starts f90) ----------------
S2 = 90
rt = t_(4.2)
rumble = band(rng.standard_normal(len(rt)), 25, 140) * (1 + 0.35 * np.sin(2 * np.pi * 7.5 * rt))
rumble = norm(rumble + 0.4 * np.sin(2 * np.pi * 34 * rt)) * adsr(len(rt), 0.4, 0.6)
put(rumble, F(S2) - 0.1, 0.35)
put(thud(60, 36, 0.6), F(S2 + 3), 0.7)  # RAAT 2 BAJE.
put(whoosh(1.4, 120, 2500, 0.85), F(S2 + 50), 0.4)  # push-in
put(thud(60, 36, 0.5), F(S2 + 68), 0.55)  # HEAT BADH
put(beep(1320, 0.06), F(S2 + 82), 0.12, 0.3)  # reticle
sw = t_(0.75)
put(np.sin(2 * np.pi * np.cumsum(500 + 2200 * (sw / 0.75)) / SR) * adsr(len(sw), 0.05, 0.2), F(S2 + 88), 0.07, 0.2)  # scan
put(riser(1.6), F(S2 + 72), 0.42)
put(boom(2.2), F(210), 0.9)  # heat flash
put(whoosh(0.4, 400, 9000, 0.3), F(206), 0.5, 0.4)

# ---------------- scene 3 (starts f210) ----------------
S3 = 210
put(thud(60, 36, 0.6), F(S3 + 2), 0.55)  # EK OPERATOR.
hb = 7.15
while hb < 10.9:
    put(thud(52, 32, 0.3, 0.05), hb, 0.42)
    put(thud(46, 30, 0.3, 0.05), hb + 0.17, 0.3)
    hb += 0.62
for k in range(4):
    put(whoosh(0.32, 500, 9000, 0.55), F(S3 + 12 + k * 26) - 0.12, 0.38, 0.5 - k * 0.3)
for k in range(5):
    put(beep(1000, 0.06), F(S3 + 22) + k * 0.2, 0.07, -0.2)  # warning lamp
put(clank(), F(S3 + 12 + 26 + 19), 0.2)  # park brake
put(clank(), F(S3 + 12 + 52 + 6), 0.3, 0.3)  # strap
put(hiss(0.9), F(S3 + 12 + 78 + 4), 0.16, -0.2)  # extinguisher attempt
rev = whoosh(0.5, 200, 6000, 0.95)
put(rev, F(330) - 0.45, 0.4)  # bloom in

# ---------------- scene 4 (starts f330) ----------------
S4 = 330
put(tick(1800, 0.05), F(S4 + 4), 0.12)
for k in range(3):
    put(tick(2400, 0.035), F(S4 + 14 + k * 4), 0.09, 0.2)
put(beep(880), F(S4 + 20), 0.2)  # detection double beep
put(beep(1320), F(S4 + 20) + 0.13, 0.2)
for k in range(6):
    put(beep(740 if k % 2 == 0 else 980, 0.16), F(S4 + 38) + k * 0.22, 0.11, 0.25)  # alarm
put(hiss(1.6), F(S4 + 60), 0.22)  # discharge (conceptual)
put(thud(50, 32, 0.8, 0.0), F(S4 + 60), 0.45)
put(thud(56, 34, 0.7, 0.1), F(S4 + 108), 0.45)  # ONE PERSON.
put(whoosh(0.9, 150, 4000, 0.8), F(S4 + 80), 0.35)  # product rises
mt2 = t_(1.4)
put(norm(sum(np.sin(2 * np.pi * f * mt2) * g for f, g in [(196, 1), (294, 0.5), (392, 0.3)])) * (mt2 / 1.4) ** 1.5 * adsr(len(mt2), 0.01, 0.3), F(S4 + 86), 0.12)  # steel swell

# ---------------- scene 5 (starts f480) ----------------
S5 = 480
put(whoosh(1.4, 100, 3000, 0.25), F(S5) - 0.05, 0.4)  # pull back
mt = t_(1.6)
metal = sum(np.sin(2 * np.pi * f * mt) * g for f, g in [(147, 1), (220.5, 0.5), (293, 0.35), (441, 0.15)])
put(norm(metal) * (mt / 1.6) ** 2 * adsr(len(mt), 0.01, 0.15), F(S5 + 14), 0.16)  # metallic swell
put(boom(3.0), F(S5 + 30), 0.9)  # logo
put(thud(52, 30, 1.2, 0.2), F(S5 + 30), 0.5)
et = t_(2.8)
tone = (np.sin(2 * np.pi * 73.4 * et) + 0.5 * np.sin(2 * np.pi * 110 * et) + 0.25 * np.sin(2 * np.pi * 146.8 * et)) * adsr(len(et), 0.3, 1.8)
put(norm(tone), F(S5 + 30), 0.3)
put(beep(2637, 0.5) * np.exp(-t_(0.5) * 6), F(S5 + 42), 0.05, 0.3)  # sheen on the emblem

# soft key clicks under the typed DM Sans lines
for fr, n in [(36, 9), (90 + 58, 13), (90 + 76, 8), (210 + 18, 19), (330 + 90, 20)]:
    for k in range(0, n, 2):
        put(tick(1900 + 300 * rng.random(), 0.03), F(fr + k * 1.05), 0.05, 0.3 * (rng.random() - 0.5))

# ---------------- out ----------------
mix = np.stack([L, R], axis=1)
fade = np.ones(N)
fo = int(0.4 * SR)
fade[-fo:] = np.linspace(1, 0, fo)
mix *= fade[:, None]
mix /= max(1e-6, np.max(np.abs(mix))) / 0.89
pcm = (mix * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", sys.argv[1])
