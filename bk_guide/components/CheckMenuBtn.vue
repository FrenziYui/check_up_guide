<template>
  <button :class="computedClass" @click="handleClick">
    <span class="flex-1 text-left">
      {{ props.menuData.DispName }}
    </span>
    <img
      src="@/assets/icon/check.svg"
      alt="check"
      class="w-8 h-8 ml-auto"
      v-if="props.menuData.Status === '9'"
    />
  </button>
</template>
<script setup lang="ts">
import type { MenuData } from "../types/basetype";

const props = defineProps<{ menuData: MenuData }>();
const emit = defineEmits<{
  (e: "menuClick", event: MenuData): void;
}>();

const baseClass = "w-full btn text-2xl font-medium mb-5";
const status0Class = "bg-secondary text-secondary-foreground ";
const status9Class = "bg-gray-400 text-secondary-foreground ";
const computedClass = computed(() => {
  switch (true) {
    case props.menuData.Status == "9":
      return `${baseClass} ${status9Class}`;
    default:
      return `${baseClass} ${status0Class}`;
  }
});
const handleClick = () => {
  emit("menuClick", props.menuData);
};
</script>
<style scoped></style>
