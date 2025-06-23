<template>
  <div>
    <p class="font-semibold mb-2">{{ label }}</p>
    <label class="label cursor-pointer space-x-2">
      <input type="checkbox" class="checkbox checkbox-success" :checked="modelValue == 1" @change="onChange" />
      <span>{{ options[0] }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  options: string[];
  modelValue: number;
}
const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

function onChange(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.checked ? 1 : 0);
}
</script>
