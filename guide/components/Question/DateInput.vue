<template>
  <p :class="['font-semibold', 'mb-2']">{{ label }}</p>
  <div class="relative">
    <input
      type="date"
      :class="['input', 'input-bordered', 'w-full', fontSize, { 'text-red-500': hasError }]"
      v-model="localValue"
      @blur="validateInput"
    />
    <ClearIcon
      v-if="localValue"
      :isVisible="true"
      clickEvent="userId"
      class="absolute right-12 top-1/2 transform -translate-y-1/2 cursor-pointer"
      @click="onClickClear"
    />
  </div>

  <ToastMessage v-model="toastVisible" :message="toastMessage" type="error" vPos="middle" hPos="center" />
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

interface Props {
  label: string;
  modelValue: string;
  fontSize?: string;
  minDate?: string;
  maxDate?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue", "confirm", "clear"]);

const localValue = ref(props.modelValue);
const fontSize = computed(() => props.fontSize || "text-base");
const hasError = ref(false);

// トースト状態
const toastVisible = ref(false);
const toastMessage = ref("");

// トースト表示
const showToast = (message: string) => {
  toastMessage.value = message;
  toastVisible.value = true;
  hasError.value = true;
};

// バリデーション（遅延実行）
const validateInput = useDebounceFn(() => {
  hasError.value = false;
  toastMessage.value = "";

  const value = localValue.value;

  // 日付チェック（最小/最大）
  if (props.minDate && value < props.minDate) {
    return showToast(`選択可能な最小日付は ${props.minDate} です`);
  }
  if (props.maxDate && value > props.maxDate) {
    return showToast(`選択可能な最大日付は ${props.maxDate} です`);
  }
  if (value) {
    emit("confirm");
  }
}, 300);

// 値変更監視
watch(localValue, (val) => emit("update:modelValue", val));

// クリアアイコンで日付を消去
const onClickClear = () => {
  localValue.value = "";
  emit("clear");
};
</script>
