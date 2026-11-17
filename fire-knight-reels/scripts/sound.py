"""Synthesise the Operator Akela score + SFX, cued to frames (30 fps).

usage: python3 scripts/sound.py public/audio/akela-raw.wav
Then loudness-normalise with ffmpeg (see scripts/render.sh).
"""
import sys
import wave
import numpy as np

SR = 48000
DUR = 1066 / 30.0  # v8: 35.53 s, cut to the client's voiceover
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
pad_g = np.interp(tt, [0, 1.5, 6.9, 14.6, 15.1, 18.6, 19.4, 26.4, 30.3, 33.5, DUR], [0.1, 0.45, 0.55, 0.65, 0.0, 0.0, 0.5, 0.5, 0.65, 0.55, 0])
L += pad * pad_g * 0.32
R += pad * pad_g * 0.32

# sub pulse on beats from scene 2
beat = 60 / 100
t = 3.0
while t < 30.3:
    if not (15.0 <= t < 18.6):
        put(thud(48, 34, 0.4, click=0.0), t, 0.32)
    t += beat

# drone under everything
drone = norm(np.sin(2 * np.pi * 36.7 * tt) + 0.5 * np.sin(2 * np.pi * 55 * tt + 0.7))
drone_g = np.interp(tt, [0, 1.0, 15.0, 16.0, 18.4, 26.4, 30.3, 33.5, DUR], [0.12, 0.22, 0.22, 0.3, 0.3, 0.2, 0.1, 0.18, 0])
L += drone * drone_g
R += drone * drone_g

# ---------------- scene starts (frames) - v8, cut to the voiceover ----------------
HOOK, NIGHT, OPER, REHOOK, PROD, SYS, HERO = 0, 81, 208, 456, 558, 632, 794

# hook: heartbeat on the glow, lamps, slow pull-back
for k in range(4):
    put(thud(48, 30, 0.35, 0.0), F(HOOK + 1 + k * 18.5), 0.45 - k * 0.05)
    put(thud(42, 28, 0.3, 0.0), F(HOOK + 1 + k * 18.5) + 0.16, 0.26 - k * 0.03)
put(clank() * 0.5, F(HOOK + 10), 0.16, 0.4)
put(thud(70, 40, 0.35), F(HOOK + 10), 0.4)
put(clank(), F(HOOK + 15), 0.12, 0.4)
put(whoosh(2.2, 90, 2500, 0.55), F(HOOK + 12), 0.4)

# night haul + thermal
rt = t_(4.4)
rumble = band(rng.standard_normal(len(rt)), 25, 140) * (1 + 0.35 * np.sin(2 * np.pi * 7.5 * rt))
rumble = norm(rumble + 0.4 * np.sin(2 * np.pi * 34 * rt)) * adsr(len(rt), 0.4, 0.8)
put(rumble, F(NIGHT) - 0.1, 0.32)
put(thud(60, 36, 0.6), F(NIGHT + 3), 0.5)
put(whoosh(1.9, 120, 2500, 0.85), F(NIGHT + 44), 0.35)
put(thud(60, 36, 0.5), F(NIGHT + 74), 0.42)  # HEAT BADH
put(beep(1320, 0.06), F(NIGHT + 84), 0.1, 0.3)
sw = t_(0.75)
put(np.sin(2 * np.pi * np.cumsum(500 + 2200 * (sw / 0.75)) / SR) * adsr(len(sw), 0.05, 0.2), F(NIGHT + 88), 0.06, 0.2)
put(riser(1.6), F(NIGHT + 78), 0.38)
put(boom(2.2), F(OPER), 0.8)  # heat flash
put(whoosh(0.7, 300, 8000, 0.5), F(OPER) - 0.35, 0.4, 0.4)

# operator: cab, then tiles land on the words
put(thud(60, 36, 0.6), F(OPER + 8), 0.42)
hb = F(OPER + 40)
while hb < F(REHOOK) - 0.4:
    put(thud(52, 32, 0.3, 0.05), hb, 0.34)
    put(thud(46, 30, 0.3, 0.05), hb + 0.17, 0.24)
    hb += 0.62
for k, at in enumerate([102, 133, 167, 205]):
    put(whoosh(0.4, 400, 7000, 0.6), F(OPER + at) - 0.15, 0.26, 0.5 - k * 0.3)
    put(tick(2200, 0.04), F(OPER + at) + 0.2, 0.07)
for k in range(5):
    put(beep(1000, 0.06), F(OPER + 110) + k * 0.2, 0.05, -0.2)
put(clank(), F(OPER + 133 + 45), 0.16)
put(clank(), F(OPER + 167 + 14), 0.22, 0.3)
put(hiss(0.9), F(OPER + 205 + 12), 0.12, -0.2)
put(whoosh(0.7, 200, 6000, 0.95), F(REHOOK) - 0.6, 0.35)

# re-hook: pad drops out, low tension, a clock-like pulse
put(boom(1.6), F(REHOOK + 6), 0.55)
for k in range(9):
    put(tick(900, 0.06), F(REHOOK + 10) + k * 0.36, 0.08 + k * 0.006)
put(riser(2.6), F(REHOOK + 20), 0.32)

# product answer
put(whoosh(1.0, 150, 4000, 0.7), F(PROD) - 0.1, 0.35)
mt2 = t_(1.6)
put(norm(sum(np.sin(2 * np.pi * f * mt2) * g for f, g in [(196, 1), (294, 0.5), (392, 0.3)])) * (mt2 / 1.6) ** 1.5 * adsr(len(mt2), 0.01, 0.3), F(PROD + 6), 0.14)
put(thud(56, 34, 0.7, 0.1), F(PROD + 38), 0.42)  # RANGER.

# system steps on the words
put(tick(1800, 0.05), F(SYS + 4), 0.1)
for k in range(3):
    put(tick(2400, 0.035), F(SYS + 8 + k * 5), 0.07, 0.2)
put(beep(880), F(SYS + 20), 0.14)
put(beep(1320), F(SYS + 20) + 0.13, 0.14)
for k in range(6):
    put(beep(740 if k % 2 == 0 else 980, 0.16), F(SYS + 36) + k * 0.2, 0.07, 0.25)
put(hiss(2.2), F(SYS + 76), 0.18)
put(thud(50, 32, 0.8, 0.0), F(SYS + 76), 0.36)

# hero + logo
put(whoosh(2.0, 100, 3000, 0.3), F(HERO) - 0.2, 0.3)
put(thud(56, 34, 0.7, 0.1), F(HERO + 66), 0.36)  # DEPEND NAHI
mt = t_(1.6)
metal = sum(np.sin(2 * np.pi * f * mt) * g for f, g in [(147, 1), (220.5, 0.5), (293, 0.35), (441, 0.15)])
put(norm(metal) * (mt / 1.6) ** 2 * adsr(len(mt), 0.01, 0.15), F(HERO + 96), 0.12)
put(boom(3.0), F(HERO + 112), 0.85)  # logo
put(thud(52, 30, 1.2, 0.2), F(HERO + 112), 0.45)
et = t_(4.5)
tone = (np.sin(2 * np.pi * 73.4 * et) + 0.5 * np.sin(2 * np.pi * 110 * et) + 0.25 * np.sin(2 * np.pi * 146.8 * et)) * adsr(len(et), 0.4, 2.5)
put(norm(tone), F(HERO + 112), 0.28)
put(beep(2637, 0.5) * np.exp(-t_(0.5) * 6), F(HERO + 124), 0.05, 0.3)

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
