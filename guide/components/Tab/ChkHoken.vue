<template>
  <form @submit.prevent="submitForm" v-if="result">
    <!-- 入力フォーム -->
    <div class="max-h-[75vh] overflow-y-auto p-4 space-y-2">
      <div class="text-2xl font-semibold mb-3">保健師チェック</div>
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
import type { Hoken } from "~/types/tabType";
interface CheckboxItem {
  key: keyof Hoken;
  label: string;
  option: string[];
  optionFontClass?: string;
}

// チェックボックスリスト
const checkboxItems: CheckboxItem[] = [
  { key: "question", label: "問診", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "meal", label: "食事", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "moisture", label: "水分", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "drug", label: "内服薬", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "anesthesia", label: "局麻(胃のみ)", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "pain", label: "鎮痛(第のみ)", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "spasmolytic", label: "鎮痙", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "biopsy", label: "生検", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "rivalry", label: "拮抗", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "academic", label: "学会", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "car", label: "車", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
];

// reactiveデータ
const result = ref<Hoken>();
// props
const props = defineProps<{
  data: Hoken;
}>();
// emits
const emit = defineEmits<{
  (e: "update:data", value: Hoken): void;
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
