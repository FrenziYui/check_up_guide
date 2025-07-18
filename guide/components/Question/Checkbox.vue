<template>
  <div>
    <p v-if="label" class="font-semibold mb-2">{{ label }}</p>
    <label class="label cursor-pointer space-x-2">
      <input type="checkbox" class="checkbox checkbox-success" :checked="modelValue" @change="onChange" />
      <span :class="optionFontClass">{{ options }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  options: string;
  modelValue: boolean;
  optionFontClass?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const optionFontClass = computed(() => props.optionFontClass ?? "font-semibold");

function onChange(e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  emit("update:modelValue", checked);
}
</script>
