<template>
  <form @submit.prevent="submitForm" v-if="result">
    <!-- 入力フォーム -->
    <div class="max-h-[75vh] overflow-y-auto p-4 space-y-2">
      <div class="text-2xl font-semibold mb-3">医師チェック</div>
      <div v-for="item in checkboxItems" :key="item.key" class="form-control border border-accent p-4 rounded-lg">
        <QuestionRadio
          :label="item.label"
          :options="item.option"
          v-model="result[item.key]"
          :optionFontClass="item.optionFontClass"
        />
      </div>

      <QuestionTextarea label="備考" v-model="result.biko" :maxLength="100" />
    </div>
    <!-- ボタン -->
    <div class="modal-action mt-6 flex justify-end space-x-2">
      <button type="submit" class="btn btn-info">更新</button>
      <button @click="close" type="button" class="btn btn-primary">キャンセル</button>
    </div>
  </form>
</template>

<script setup lang="ts">
// 型
import type { Ishi } from "~/types/tabType";
interface CheckboxItem {
  key: keyof Ishi;
  label: string;
  option: string[];
  optionFontClass?: string;
}
// チェックボックスリスト
const checkboxItems: CheckboxItem[] = [
  { key: "auscultation", label: "聴打診", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "intermediate", label: "途中説明", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "general", label: "総合説明", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "dJudgment", label: "D判定", option: ["有", "無"], optionFontClass: "text-xl font-semibold" },
];

// reactiveデータ
const result = ref<Ishi>();
// props
const props = defineProps<{
  data: Ishi;
}>();
// emits
const emit = defineEmits<{
  (e: "update:data", value: Ishi): void;
}>();

const close = () => {
  navigateTo("/");
};

const submitForm = () => {
  if (result.value) {
    emit("update:data", result.value);
  }
};

watch(
  () => props.data,
  (newVal) => {
    if (newVal) {
      result.value = { ...newVal };
    }
  },
  { immediate: true, deep: true }
);
</script>
