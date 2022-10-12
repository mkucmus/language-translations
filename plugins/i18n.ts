import { createI18n } from "vue-i18n";
import en from "../locales/en-GB.json";
import de from "../locales/de-DE.json";
import pl from "../locales/pl-PL.json";
import es from "../locales/es-ES.json";

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    allowComposition: true,
    legacy: false,
    globalInjection: true,
    locale: "en-GB",
    messages: {
      "en-GB": en,
      "de-DE": de,
      "pl-PL": pl,
      "es-ES": es,
    },
  });

  // addRouteMiddleware(
  //   "routing-i18n",
  //   () => {
  //     const routePath = vueApp.$nuxt.$route.path;
  //     const { locale } = i18n.global;
  //     if (routePath.startsWith("/en")) {
  //       locale.value = "en-GB";
  //     }
  //     if (routePath.startsWith("/de")) {
  //       locale.value = "de-DE";
  //     }
  //     if (routePath.startsWith("/es")) {
  //       locale.value = "es-ES";
  //     }
  //     if (routePath.startsWith("/pl")) {
  //       locale.value = "pl-PL";
  //     }
  //   },
  //   { global: true }
  // );

  vueApp.use(i18n);
});
