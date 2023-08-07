import { defineConfig } from "vite";

import solid from "solid-start/vite";
// @ts-expect-error
import netlify from "solid-start-netlify";

import unocss from "unocss/vite";

export default defineConfig({
  plugins: [
    unocss(),
    solid({ ssr: false, adapter: netlify() })
  ]
});

