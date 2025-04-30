<template>
  <img
    v-if="isVisible"
    @click="handleClick"
    src="@/assets/icon/close.svg"
    :alt="alt"
    :class="computedClass"
  />
</template>

<script lang="ts" setup>
import type { MemoData } from "../types/basetype";

interface Props {
  isVisible: boolean;
  alt?: string;
  clickEvent: keyof MemoData;
  customClass?: string;
}

const props = defineProps<Props>();

const defaultClass = "w-5 h-5 opacity-70 hover:opacity-100 hover:bg-accent hover:rounded-full";

// `customClass`が指定されていない場合はデフォルトクラスを使用する
const computedClass = computed(() => {
  return props.customClass ? props.customClass : defaultClass;
});

const emit = defineEmits<{ (e: "click", event: keyof MemoData): void }>();

const handleClick = () => {
  emit("click", props.clickEvent);
};
</script>
