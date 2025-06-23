<template>
  <p :class="['font-semibold', 'mb-2']">{{ label }}</p>
  <div class="relative">
    <input
      type="text"
      :class="['input', 'input-bordered', 'w-full', fontSize, { 'text-red-500': hasError }]"
      v-model="localValue"
      :maxlength="props.maxLength || props.exactLength"
      @input="limitInput"
      @blur="validateInput"
    />
    <ClearIcon
      v-if="localValue"
      :isVisible="true"
      clickEvent="userId"
      class="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
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
  minLength?: number;
  maxLength?: number;
  exactLength?: number;
  fontSize?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue", "confirm", "clear", "changed"]);

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

// 入力制限
const limitInput = () => {
  if (props.exactLength) {
    localValue.value = localValue.value.slice(0, props.exactLength);
  } else if (props.maxLength) {
    localValue.value = localValue.value.slice(0, props.maxLength);
  }
};

// バリデーション
const validateInput = useDebounceFn(() => {
  hasError.value = false;
  toastMessage.value = "";

  const value = localValue.value;

  // 文字数チェック（最小）
  if (props.minLength && value.length < props.minLength) {
    return showToast(`最低 ${props.minLength} 文字が必要です`);
  }
  if (value.length > 0) {
    emit("confirm");
  }
}, 300);

watch(localValue, (val, oldVal) => {
  emit("update:modelValue", val);
  if (val !== oldVal) {
    emit("changed");
  }
});

const onClickClear = () => {
  localValue.value = "";
  emit("clear");
};
</script>
