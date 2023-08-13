import { type Preset, defineConfig, presetUno } from "unocss";
import { extendCatppuccin } from "unocss-catppuccin";

import presetRemToPx from "@unocss/preset-rem-to-px";
import { presetKobalte } from "unocss-preset-primitives";

import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  presets: [
    presetUno(),
    presetRemToPx(),
    presetKobalte() as Preset,
    extendCatppuccin({ prefix: "", defaultVariant: "latte" }),
  ],

  transformers: [transformerVariantGroup()],

  theme: {
    animation: {
      keyframes: {
        "scale-in": "{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}",
        "scale-out": "{from{opacity:1;transform:scale(&)}to{opacity:0;transform:scale(0.96)}}"
      }
    }
  }
});
