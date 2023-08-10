import { defineConfig, presetUno } from "unocss";
import { extendCatppuccin } from "unocss-catppuccin";

import presetRemToPx from "@unocss/preset-rem-to-px";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  presets: [
    presetUno(),
    presetRemToPx(),
    extendCatppuccin({ prefix: "", defaultVariant: "latte" }),
  ],

  transformers: [transformerVariantGroup()],
});
