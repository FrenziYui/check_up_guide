<template>
  <button :class="computedClass" type="button">
    <span class="flex-1 text-left">
      {{ props.inData.index }} {{ props.inData.val }}</span
    >
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ inData: { val: string; index: string } }>();
const baseClass = "w-full btn text-2xl font-medium";
const deactive = "no-animation bg-gray-400 text-secondary-foreground ";
const active = "bg-green-300 text-secondary-foreground hover:bg-green-500";
const computedClass = computed(() => {
  if (props.inData.index === "") {
    return `${baseClass} ${deactive}`;
  } else {
    return `${baseClass} ${active}`;
  }
});
</script>
