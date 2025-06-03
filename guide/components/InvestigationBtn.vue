<template>
  <button :class="computedClass" id="double-tap-target" @touchend="handleDoubleTap">
    <span class="flex-1 text-left">
      {{ props.investigationData.DispName }}
    </span>
    <img src="/icon/check.svg" alt="check" class="w-8 h-8 ml-auto" v-if="props.investigationData.Status === '1'" />
    <img src="/icon/task.svg" alt="check" class="w-8 h-8 ml-auto" v-if="props.investigationData.Active" />
  </button>
</template>
<script setup lang="ts">
import type { InvestigationData } from "../types/baseType";
// ダブルタップ検知用
const lastTap = ref(0);
const doubleTapThreshold = 300; // ダブルタップと認識する時間の間隔（ミリ秒）

const props = defineProps<{ investigationData: InvestigationData }>();
const emit = defineEmits<{
  (e: "doubletap", event: InvestigationData): void;
}>();

const baseClass = "w-full btn text-2xl font-medium";
const status0Class = "bg-secondary text-secondary-foreground ";
const active = "bg-green-400 text-secondary-foreground ";
const status9Class = "bg-gray-400 text-secondary-foreground ";
const computedClass = computed(() => {
  switch (true) {
    case props.investigationData.Active:
      return `${baseClass} ${active}`;
    case props.investigationData.Status == "1":
      return `${baseClass} ${status9Class}`;
    default:
      return `${baseClass} ${status0Class}`;
  }
});

const handleDoubleTap = (event: TouchEvent) => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap.value;

  if (tapLength < doubleTapThreshold && tapLength > 0) {
    // ダブルタップ時の処理
    emit("doubletap", props.investigationData);
    event.preventDefault();
  }

  lastTap.value = currentTime;
};
</script>
<style scoped>
#double-tap-target {
  touch-action: manipulation; /* ダブルタップのズームを無効化 */
}
</style>
