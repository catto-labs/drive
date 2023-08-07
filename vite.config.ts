import { defineConfig } from "vite";
import path from "node:path";
import fs from "node:fs";

import solid from "solid-start/vite";
// @ts-expect-error
import netlify from "solid-start-netlify";

import unocss from "unocss/vite";

export default defineConfig({
  plugins: [
    unocss(),
    solid({ ssr: false, adapter: netlify() })
  ],

  server: {
    strictPort: true
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});

