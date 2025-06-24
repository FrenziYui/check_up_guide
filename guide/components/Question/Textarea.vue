<template>
  <div class="relative">
    <p class="label text-3xl mb-2">{{ label }}</p>
    <textarea
      class="text-2xl textarea w-full resize-y pr-10"
      :class="heightClass"
      v-model="proxyValue"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :readonly="readonly"
    ></textarea>
    <CommonClearIcon
      :isVisible="!readonly && Boolean(proxyValue) && proxyValue.length > 0"
      alt="クリア"
      :customClass="clearClassComputed"
      @click="clearValue"
    />
  </div>
</template>

<script setup lang="ts">
// props
interface Props {
  label: string;
  modelValue: string | null;
  placeholder?: string;
  maxLength?: number;
  readonly?: boolean;
  heightClass?: string;
  clearClass?: string;
}
const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  maxLength: 50,
  readonly: false,
  heightClass: "h-40",
  clearClass: "pt-20",
});

// emit
const emit = defineEmits(["update:modelValue"]);

// パラメータによりカスタムクラス設定
const clearClassComputed = computed(() => {
  return `absolute top-10 right-2 cursor-pointer pr-2 ${props.clearClass}`;
});

// 値の取得&更新
const proxyValue = computed({
  get: () => props.modelValue ?? "",
  set: (val) => emit("update:modelValue", val),
});

// 値をクリア
function clearValue() {
  proxyValue.value = "";
}
</script>
