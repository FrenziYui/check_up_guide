<template>
  <ul class="list-disc pl-5 text-2xl mt-5 m-1 p-3 border rounded-xl border-gray-400 h-40 overflow-y-auto">
    <li
      v-for="(item, index) in items.filter((i) => i.status !== 'X' && i.type === 'i' && i.knsnm !== '')"
      :key="item.inpCd"
      class="ml-5"
    >
      {{ item.knsnm }} ({{ item.knstm }})
    </li>
  </ul>
</template>

<script setup lang="ts">
// 型
import type { DispCdItem } from "~/types/baseType";
// props
const props = defineProps<{
  items: DispCdItem[];
}>();
onMounted(async () => {});
</script>
