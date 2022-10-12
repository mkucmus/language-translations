<script setup lang="ts">
import type {
  EntityResult,
  Language,
  ProductResponse,
} from "@shopware-pwa/types";
import {
  getProductThumbnailUrl,
  getProductRealPrice,
} from "@shopware-pwa/helpers-next";
import {
  getAvailableLanguages,
  setCurrentLanguage,
  getProduct,
} from "@shopware-pwa/api-client";
import { useI18n } from "vue-i18n";
const { refreshSessionContext, sessionContext } = useSessionContext();
const { apiInstance } = useShopwareContext();
const languages = ref<EntityResult<"language", Language[]>>();
const language = ref<Language>();
const languageId = computed(
  () => sessionContext.value?.salesChannel?.languageId
);
const languageIdChain = computed(
  () => sessionContext.value?.context?.languageIdChain?.[0]
);
const productResponse = ref<ProductResponse>();
const { locale } = useI18n();
watch(language, () => {
  locale.value = language.value.locale.code;
});

watch(
  () => sessionContext.value?.salesChannel?.languageId,
  async (newLanguageId) => {
    syncLanguageData(newLanguageId);
    productResponse.value = await getProduct(
      "f5cdc1a027ba4f48947eb2fe3de1b4d4",
      null,
      apiInstance
    );
  }
);

const setLanguage = async (languageId: string) => {
  await setCurrentLanguage(languageId, apiInstance);
  refreshSessionContext();
};

const syncLanguageData = async (languageId: string) => {
  const response = await apiInstance.invoke.post<
    EntityResult<"language", Language[]>
  >("/store-api/language", {
    filter: [
      {
        type: "equals",
        field: "id",
        value: languageId,
      },
    ],
    associations: {
      locale: {},
    },
  });
  language.value = response.data.elements?.[0];
};

onMounted(async () => {
  refreshSessionContext();

  languages.value = await getAvailableLanguages(apiInstance);
  productResponse.value = await getProduct(
    "f5cdc1a027ba4f48947eb2fe3de1b4d4",
    null,
    apiInstance
  );
});
</script>

<template>
  <div class="container mx-auto">
    <div
      class="p-4 w-full text-center bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700"
    >
      <h2 class="text-4xl font-extrabold dark:text-white mb-4">
        {{ $t("Context") }}
      </h2>
      <transition name="fade">
        <pre v-show="language">
      sales channel language id: {{ languageId }}
      context language id chain: {{ languageIdChain }} 
      name: {{ language?.name }}
      translation code: {{ language?.translationCode?.code }}
      locale code: {{ language?.locale?.code }}
    </pre
        >
      </transition>
    </div>

    <div
      class="p-4 w-full text-center bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700 mt-4"
    >
      <h2 class="text-4xl font-extrabold dark:text-white mb-4">
        {{ $t("Available languages") }}
      </h2>
      <transition name="fade">
        <div v-if="languages?.elements?.length">
          <button
            v-for="element in languages?.elements"
            :key="element.id"
            :class="{
              'cursor-not-allowed': element.id === languageId,
            }"
            class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
            @click="setLanguage(element.id)"
          >
            <span
              :class="{
                'text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200':
                  element.id === languageId,
              }"
              class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
            >
              {{ element.name }}
            </span>
          </button>
        </div>
      </transition>
    </div>
    <div
      class="p-4 w-full text-center bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700 mt-4"
    >
      <h3 class="text-4xl font-extrabold dark:text-white">
        {{ $t("Preview Product Data") }}
      </h3>
      <transition name="fade">
        <div class="bg-white" v-if="productResponse?.product">
          <div
            class="mx-auto max-w-2xl py-16 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            <div
              class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
            >
              <div class="group relative">
                <div
                  class="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80"
                >
                  <img
                    :src="getProductThumbnailUrl(productResponse.product)"
                    class="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div class="mt-4 flex justify-between">
                  <div>
                    <h3 class="text-sm text-gray-700">
                      <span>
                        <span
                          aria-hidden="true"
                          class="absolute inset-0"
                        ></span>
                        {{ productResponse.product.translated.name }}
                      </span>
                    </h3>
                  </div>
                  <p class="text-sm font-medium text-gray-900">
                    $
                    {{ getProductRealPrice(productResponse.product).unitPrice }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
