import { defineConfig } from "vite";
import path from "node:path";
import fs from "node:fs";

import solid from "solid-start/vite";
import vercel from "solid-start-vercel";

import Icons from "unplugin-icons/vite";

import unocss from "unocss/vite";

export default defineConfig({
  plugins: [
    unocss(),
    solid({ ssr: false, adapter: vercel() }),
    Icons({ compiler: "solid" }),
  ],

  server: {
    strictPort: true,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
