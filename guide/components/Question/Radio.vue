<template>
  <div>
    <p class="label mb-2 text-3xl">{{ label }}</p>
    <div class="flex gap-4 mb-2">
      <label v-for="option in options" :key="option" class="label text-3xl cursor-pointer space-x-2">
        <input
          type="radio"
          class="radio radio-success"
          :value="option"
          :checked="localValue === option"
          @click="handleClick(option)"
        />
        <span>{{ option }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  options: string[];
  modelValue: string;
}
const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const localValue = ref(props.modelValue);
watch(localValue, (val) => emit("update:modelValue", val));

// ★ クリック時のカスタム処理
const handleClick = (option: string) => {
  if (localValue.value === option) {
    // 同じの押したらクリア
    localValue.value = "";
  } else {
    // 違うの押したら選択
    localValue.value = option;
  }
};
</script>
