import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FONT } from "./theme";

const faces: { family: string; file: string; weight: string }[] = [
  { family: FONT.slam, file: "BigShoulders-Bold.ttf", weight: "700" },
  { family: FONT.mono, file: "JetBrainsMono-Regular.ttf", weight: "400" },
  { family: FONT.mono, file: "JetBrainsMono-Bold.ttf", weight: "700" },
  { family: FONT.sans, file: "inter-latin-500-normal.woff2", weight: "500" },
  { family: FONT.sans, file: "inter-latin-600-normal.woff2", weight: "600" },
  { family: FONT.sans, file: "inter-latin-700-normal.woff2", weight: "700" },
  { family: FONT.sans, file: "inter-latin-800-normal.woff2", weight: "800" },
];

// loadFont() holds the render (delayRender) until every face is ready,
// so no frame is ever drawn in a fallback font.
export const fontsReady = Promise.all(
  faces.map((f) =>
    loadFont({
      family: f.family,
      url: staticFile(`fonts/${f.file}`),
      weight: f.weight,
      display: "block",
    }),
  ),
);
