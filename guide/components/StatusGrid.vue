<template>
  <div class="grid grid-cols-7 gap-2 max-w-full w-full">
    <template v-for="item in items" :key="item.label">
      <StatusButton v-if="item.visible" :label="item.label" :status="item.status" :param="item.param" />
    </template>
  </div>
</template>

<script setup lang="ts">
const items = [
  { label: "パニック値", status: 8, param: "panic", visible: false },
  { label: "尿/便検査", status: 0, param: "urine", visible: true },
  { label: "事務", status: 0, param: "checkjim", visible: true },
  { label: "問診票", status: 0, param: "checkmon", visible: true },
  { label: "保健師", status: 0, param: "checkhkn", visible: true },
  { label: "医師", status: 0, param: "checkish", visible: true },
  { label: "その他 情報", status: 1, param: "other", visible: true },
];
</script>
