<template>
  <div class="h-20 mt-3 m-1 p-3 border rounded-xl border-gray-400 flex justify-between items-center">
    <span class="text-4xl text-blue-600 mt-[-7px]"> {{ nextMessage }} {{ activeData }} </span>
    <button
      class="text-xl font-medium px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out"
      :class="[
        isDisabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
          : 'bg-accent text-black hover:bg-accent hover:bg-opacity-50',
      ]"
      @click="openModal"
      :disabled="isDisabled"
      :aria-disabled="isDisabled"
    >
      MAP
    </button>
  </div>
  <NextModal :images="imageUrls" />
</template>

<script setup lang="ts">
import type { LangStr } from "~/types/langType";

const props = defineProps<{
  item: string | undefined;
  langDt: LangStr | undefined;
}>();

const imageUrls = ref<string[]>([]);

const nextMessage = ref("");
const activeData = ref("");
const isDisabled = ref(false);
const nextMessageVal = "t0100";

watch(
  () => [props.item, props.langDt],
  async ([newActive, newLangDt]) => {
    if (
      typeof newActive === "string" &&
      typeof newLangDt === "object" &&
      newLangDt !== null &&
      newActive in newLangDt
    ) {
      const { data, error } = await useStorageFileList("medical_guide_map", newActive + "/");
      imageUrls.value = data.value ?? [];
      activeData.value = (newLangDt as LangStr)[newActive] || "";
      nextMessage.value = (newLangDt as LangStr)[nextMessageVal] + ":" || "";
      isDisabled.value = imageUrls.value.length === 0;
    } else {
      imageUrls.value = [];
      activeData.value = "";
      nextMessage.value = "";
      isDisabled.value = true;
    }
  },
  { immediate: true }
);

const openModal = () => {
  const modal = document.getElementById("img-modal") as HTMLInputElement;
  if (modal) modal.checked = true;
};
</script>
