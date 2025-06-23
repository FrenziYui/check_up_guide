<template>
  <div>
    <p class="font-semibold mb-2">{{ label }}</p>
    <textarea class="textarea textarea-bordered w-full h-28 resize-y" v-model="localValue"></textarea>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  modelValue: string | null;
}
const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const localValue = ref(props.modelValue);
watch(localValue, (val) => emit("update:modelValue", val));
</script>
