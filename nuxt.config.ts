import PostCSSOptions from "./postcss.config";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "url";
import VueI18nVitePlugin from "@intlify/unplugin-vue-i18n/vite";

export default defineNuxtConfig({
  modules: ["@vueuse/nuxt", "@shopware-pwa/nuxt3-module"],
  css: ["@/assets/css/main.css"],
  build: {
    postcss: {
      postcssOptions: PostCSSOptions,
    },
  },
  vite: {
    plugins: [
      VueI18nVitePlugin({
        include: [
          resolve(dirname(fileURLToPath(import.meta.url)), "./locales/*.json"),
        ],
      }),
    ],
  },
});
