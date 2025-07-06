<template>
  <div class="grid grid-cols-7 gap-2 max-w-full w-full">
    <template v-for="item in items" :key="item.label">
      <StatusButton v-if="item.visible" :item="item" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { DispItem } from "~/types/baseType";
const props = defineProps<{
  items?: DispItem[];
}>();
</script>
