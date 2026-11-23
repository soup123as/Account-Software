"""Contact sheet from snap.mjs output. usage: python3 tools/sheet.py <shotsDir> <out.jpg> [cols]"""
import glob, os, sys
from PIL import Image, ImageDraw

d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
fs = sorted(glob.glob(os.path.join(d, "*.png")), key=lambda f: float(os.path.basename(f)[1:-4].replace("_", ".")))
ims = [Image.open(f) for f in fs]
w, h = ims[0].size
rows = (len(ims) + cols - 1) // cols
S = Image.new("RGB", (cols * w, rows * (h + 18)), "white")
dr = ImageDraw.Draw(S)
for i, im in enumerate(ims):
    x, y = (i % cols) * w, (i // cols) * (h + 18)
    S.paste(im, (x, y + 18))
    dr.text((x + 4, y + 3), os.path.basename(fs[i])[1:-4].replace("_", ".") + "s", fill="black")
S.save(out, quality=88)
print(out, S.size)
