import sys, glob, os
from PIL import Image, ImageDraw
d = sys.argv[1]; fs = sorted(glob.glob(d + '/*_f*.jpg'))
ims = [Image.open(f) for f in fs]; w, h = ims[0].size
cols = min(5, len(ims)); rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (cols * w, rows * (h + 28)), 'white'); dr = ImageDraw.Draw(S)
for k, (f, im) in enumerate(zip(fs, ims)):
    x = (k % cols) * w; y = (k // cols) * (h + 28)
    S.paste(im, (x, y + 28)); dr.text((x + 8, y + 8), os.path.basename(f), fill='black')
S.save(d + '/sheet.jpg', quality=85); print(d + '/sheet.jpg')
