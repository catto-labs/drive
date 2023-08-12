import { defineConfig } from "vite";
import path from "node:path";

import solid from "solid-start/vite";
import vercel from "solid-start-vercel";
import deno from "solid-start-deno";

import Icons from "unplugin-icons/vite";

import unocss from "unocss/vite";

export default defineConfig({
  plugins: [
    unocss(),
    solid({ ssr: false, adapter: deno() }),
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
