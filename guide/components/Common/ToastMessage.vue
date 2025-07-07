<template>
  <div :class="containerClass">
    <div v-if="visible" :class="alertClass" class="alert shadow-lg flex items-center">
      <img v-if="props.type === 'error'" src="/icon/error.svg" alt="ErrorIcon" class="h-6 w-6 shrink-0" />
      <img v-if="props.type === 'warning'" src="/icon/error.svg" alt="WarningIcon" class="h-6 w-6 shrink-0" />
      <img v-if="props.type === 'info'" src="/icon/error.svg" alt="InfoIcon" class="h-6 w-6 shrink-0" />
      <img v-if="props.type === 'success'" src="/icon/error.svg" alt="SuccessIcon" class="h-6 w-6 shrink-0" />
      <span class="flex-1">{{ props.message }}</span>
      <div v-if="props.hPos === 'center'" class="w-6"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ToastProps } from "~/types/toastType";

// デフォルト値を設定（省略時 or 空文字の場合の挙動）
const props = withDefaults(defineProps<ToastProps>(), {
  type: "info",
  duration: 3000,
  vPos: "top",
  hPos: "end",
});

const emit = defineEmits<{ (e: "update:modelValue", value: boolean): void }>();
const visible = ref(props.modelValue);

// トーストを閉じる関数
const closeToast = () => {
  visible.value = false;
  emit("update:modelValue", false);
};

// 指定時間後に非表示にする
watch(
  () => visible.value,
  (newValue) => {
    if (newValue && props.duration > 0) {
      setTimeout(closeToast, props.duration);
    }
  }
);

// 親からの modelValue の変化に応じて visible を更新
watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal;
  }
);

// タイプごとのスタイル（alert クラス）
const alertClass = computed(() => {
  return `alert ${
    {
      error: "alert-error text-white",
      warning: "alert-warning text-white",
      info: "alert-info text-white",
      success: "alert-success text-white",
    }[props.type] || "alert-info"
  }`;
});

// vPos と hPos に基づいて、コンテナのクラスを生成
const containerClass = computed(() => {
  const verticalMap: Record<string, string> = {
    top: "toast-top",
    middle: "toast-middle",
    bottom: "toast-bottom",
  };
  const horizontalMap: Record<string, string> = {
    start: "toast-start",
    center: "toast-center",
    end: "toast-end",
  };

  return `toast ${verticalMap[props.vPos]} ${horizontalMap[props.hPos]} z-[2147483647]`;
});
</script>
