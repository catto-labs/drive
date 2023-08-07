import { defineConfig, presetUno } from "unocss";

import presetRemToPx from "@unocss/preset-rem-to-px";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  presets: [
    presetUno(),
    presetRemToPx()
  ],

  transformers: [
    transformerVariantGroup()
  ]
});
