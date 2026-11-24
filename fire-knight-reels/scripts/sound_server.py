"""Synthesise the Smoke Alarm (Comodo) score + SFX, cued from src/server/timing.ts.

usage: python3 scripts/sound_server.py public/audio/server-raw.wav
Then loudness-normalise with ffmpeg (see scripts/render.sh).
"""
import re
import sys

SFX_ONLY = "--sfx-only" in sys.argv  # no music: drop the pad, drone and tonal swells
import wave
import numpy as np

SR = 48000
# ---- read the cue sheet straight from the Remotion timing file ----
_ts = open(__file__.replace("scripts/sound_server.py", "src/server/timing.ts")).read()
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
    [0, 1.5, S("night"), S("alarm"), S("alarm") + 0.4, S("damage"), Q["ruk"], Q["ruk"] + 0.6, S("turn"), S("turn") + 1.2, S("product"), S("system"), Q["taaki"], S("hero"), Q["fk"], DUR],
    [0.08, 0.2, 0.42, 0.42, 0.08, 0.3, 0.42, 0.0, 0.0, 0.4, 0.55, 0.4, 0.55, 0.5, 0.7, 0],
)
if not SFX_ONLY:
    L += pad * pad_g * 0.32
    R += pad * pad_g * 0.32

drone = norm(np.sin(2 * np.pi * 36.7 * tt) + 0.5 * np.sin(2 * np.pi * 55 * tt + 0.7))
drone_g = np.interp(tt, [0, 1, S("alarm"), S("damage"), Q["ruk"], S("turn"), S("product"), Q["fk"], DUR], [0.16, 0.2, 0.24, 0.32, 0.36, 0.1, 0.16, 0.1, 0])
if not SFX_ONLY:
    L += drone * drone_g
    R += drone * drone_g

# heartbeat through the problem half
hb = S("alarm") + 0.4
while hb < Q["ruk"] - 0.2:
    put(thud(50, 32, 0.3, 0.0), hb, 0.3)
    put(thud(44, 30, 0.3, 0.0), hb + 0.17, 0.18)
    hb += 0.75 if hb < S("damage") else 0.58

# ---------------- 1 hook: the alarm is already ringing ----------------
al = alarm_t3(S("night") - 0.1)
al *= np.interp(np.arange(len(al)) / SR, [0, Q["par"], Q["abKya"] + 0.4, S("night") - 0.1], [1, 1, 0.35, 0.0])
put(band(al, 2400, 4200), 0.0, 0.1, -0.1)
put(thud(58, 36, 0.6), 0.02, 0.4)
put(whoosh(2.2, 90, 2500, 0.7), Q["par"] - 0.4, 0.3)
put(crackle(S("night") - Q["par"], 30), Q["par"], 0.07)
put(thud(60, 36, 0.6), Q["abKya"], 0.45)
put(boom(1.2), Q["abKya"] + 0.15, 0.3)

# ---------------- 2 night: an empty office ----------------
put(buzzhum(S("alarm") - S("night"), 50), S("night"), 0.045)
put(norm(band(rng.standard_normal(int((S("alarm") - S("night")) * SR)), 200, 1400)) * 0.5, S("night"), 0.02)  # server fans behind the door
put(thud(56, 34, 0.5), Q["raat"] + 0.27, 0.35)
put(tick(1800, 0.05), Q["office"], 0.08)
put(thud(52, 32, 0.7), Q["koi"] + 0.6, 0.4)

# ---------------- 3 alarm ----------------
a0 = Q["achanak"] + 0.13
al2 = alarm_t3(S("damage") + 2.6 - a0)
tl = np.arange(len(al2)) / SR + a0
al2 *= np.interp(tl, [a0, Q["lekin"] - 0.2, Q["lekin"] + 0.2, S("damage"), S("damage") + 2.6], [1, 1, 0.3, 0.3, 0.0])
put(band(al2, 2400, 4200), a0, 0.11, -0.1)
put(thud(60, 36, 0.5), Q["bajta"], 0.4)
put(whoosh(0.9, 150, 3500, 0.6), Q["lekin"] - 0.35, 0.28)
put(thud(52, 32, 0.8), Q["koiNahi"], 0.45)

# ---------------- 4 damage ----------------
put(crackle(Q["ruk"] + 1.0 - S("damage"), 45), S("damage"), 0.1)
put(norm(band(rng.standard_normal(int((Q["ruk"] - S("damage")) * SR)), 60, 500)) * np.linspace(0.2, 1, int((Q["ruk"] - S("damage")) * SR)), S("damage"), 0.07)  # fire roar
put(thud(56, 34, 0.5), Q["jabTak"] + 1.33, 0.35)
for k in ("servers", "network", "infra"):
    put(whoosh(0.6, 200, 4000, 0.6), Q[k] - 0.3, 0.2)
    put(tick(2400, 0.035), Q[k], 0.09)
    put(thud(58, 36, 0.45), Q[k] + 0.2, 0.36)
put(riser(1.4), Q["damage"] - 1.4, 0.14)
put(boom(1.6), Q["damage"], 0.55)
put(thud(50, 30, 0.9, 0.1), Q["damage"], 0.4)
for k, dt in enumerate((0.0, 0.5, 0.95)):
    put(powerdown(1.5 - k * 0.2), Q["ruk"] + dt, 0.2 - k * 0.04, (k - 1) * 0.4)  # racks going dark
put(thud(48, 30, 1.0), Q["ruk"], 0.5)

# ---------------- 5 turn ----------------
put(thud(60, 36, 0.5), Q["isiliye"] + 0.55, 0.38)
put(whoosh(1.2, 120, 3000, 0.6), Q["active"] - 0.5, 0.26)
put(thud(54, 34, 0.7, 0.1), Q["active"], 0.45)

# ---------------- 6 product ----------------
put(whoosh(1.0, 150, 4000, 0.7), S("product") - 0.1, 0.32)
mt2 = t_(1.6)
if not SFX_ONLY:
    put(norm(sum(np.sin(2 * np.pi * f * mt2) * g for f, g in [(196, 1), (294, 0.5), (392, 0.3)])) * (mt2 / 1.6) ** 1.5 * adsr(len(mt2), 0.01, 0.3), Q["intro"], 0.14)
put(thud(56, 34, 0.7, 0.1), Q["comodo"], 0.48)

# ---------------- 7 system ----------------
put(crackle(Q["protection"] + 1.2 - S("system"), 32), S("system"), 0.075)
for k in ("flame", "heat"):
    put(tick(2400, 0.035), Q[k], 0.09)
    put(beep(1320, 0.05), Q[k] + 0.05, 0.05, 0.2)
put(beep(880), Q["detect"] + 0.02, 0.12)
put(beep(1320), Q["detect"] + 0.15, 0.12)
put(thud(58, 36, 0.5), Q["detect"], 0.36)
put(whoosh(0.8, 200, 5000, 0.6), Q["auto"] - 0.3, 0.22)
put(thud(56, 34, 0.5), Q["auto"], 0.34)
put(hiss(Q["taaki"] - 0.3 - Q["activate"]), Q["activate"], 0.22)
put(thud(50, 32, 0.8, 0.0), Q["activate"], 0.4)
put(whoosh(1.6, 100, 2500, 0.5), Q["taaki"] - 0.8, 0.2)
put(buzzhum(S("cta") - Q["pahunchne"], 50), Q["pahunchne"], 0.035)
put(thud(54, 32, 0.8), Q["intezaar"], 0.45)

# ---------------- 8 cta ----------------
put(tick(2000, 0.04), Q["monitored"], 0.1)
put(thud(58, 36, 0.5), Q["monitored"] + 0.05, 0.36)
put(beep(1568, 0.08), Q["protected"], 0.09, 0.2)
put(beep(2093, 0.12), Q["protected"] + 0.09, 0.09, 0.2)
put(thud(54, 34, 0.7, 0.1), Q["protected"] + 0.05, 0.45)

# ---------------- 9 hero ----------------
put(thud(60, 36, 0.5), Q["discover"] + 0.35, 0.4)
put(whoosh(2.0, 100, 3000, 0.3), Q["fk"] - 0.6, 0.3)
put(boom(3.0), Q["fk"], 0.85)
put(thud(52, 30, 1.2, 0.2), Q["fk"], 0.45)
et = t_(DUR - Q["fk"])
tone = (np.sin(2 * np.pi * 73.4 * et) + 0.5 * np.sin(2 * np.pi * 110 * et) + 0.25 * np.sin(2 * np.pi * 146.8 * et)) * adsr(len(et), 0.4, 1.8)
if not SFX_ONLY:
    put(norm(tone), Q["fk"], 0.28)
put(beep(2637, 0.5) * np.exp(-t_(0.5) * 6), Q["fk"] + 0.4, 0.05, 0.3)
put(beep(1568, 0.08), Q["dm"], 0.08, 0.2)
put(beep(2093, 0.12), Q["dm"] + 0.09, 0.08, 0.2)

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
