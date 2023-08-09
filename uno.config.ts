import { defineConfig, presetUno } from "unocss";

import presetRemToPx from "@unocss/preset-rem-to-px";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import { presetForms } from "@julr/unocss-preset-forms";
import { extendCatppuccin } from "unocss-catppuccin";

export default defineConfig({
  presets: [
    presetUno(),
    presetRemToPx(),
    extendCatppuccin({ defaultVariant: "macchiato" }),
    presetForms(),
  ],

  transformers: [transformerVariantGroup()],
});
