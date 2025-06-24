<template>
  <div :class="['flex-none p-6 overflow-y-auto', false ? 'h-[16rem]' : 'h-[20rem]']">
    <div class="flex flex-wrap gap-4">
      <div
        v-if="langDt"
        v-for="(item, index) in items.filter((i) => i.status !== 'X')"
        :key="item.inpCd"
        class="w-[calc(50%-0.5rem)]"
      >
        <InvestigationBtn
          v-if="item.type == 'i'"
          :investigationData="{
            InpCd: item.inpCd,
            DispName: langDt[item.inpCd] || item.name,
            Status: item.status,
            Active: false,
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 型
import type { DispCdItem } from "../types/baseType";
import type { LangStr } from "../types/langType";

// props
const props = defineProps<{
  items: DispCdItem[];
  langDt: LangStr | undefined;
}>();
onMounted(async () => {});
</script>
