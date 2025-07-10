<template>
  <button
    @click="toggleVisibile"
    type="button"
    class="ml-2 hover:opacity-100 hover:bg-accent hover:rounded-full cursor-pointer"
    tabindex="-1"
  >
    <span v-if="modelValue">
      <img src="/icon/visibility.svg" alt="Visible" />
    </span>
    <span v-else>
      <img src="/icon/visibility_off.svg" alt="Hidden" />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits(["update:modelValue"]);

const toggleVisibile = () => {
  emit("update:modelValue", !props.modelValue);
};
</script>
