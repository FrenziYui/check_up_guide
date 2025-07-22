<template>
  <form @submit.prevent="submitForm" v-if="result">
    <!-- 入力フォーム -->
    <div class="max-h-[75vh] overflow-y-auto p-4 space-y-2">
      <div class="text-2xl font-semibold mb-3">事務チェック</div>
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
import type { Jimu } from "~/types/tabType";
interface CheckboxItem {
  key: keyof Jimu;
  label: string;
  option: string[];
  optionFontClass?: string;
}
// チェックボックスリスト
const checkboxItems: CheckboxItem[] = [
  {
    key: "hknType",
    label: "保険証の種類",
    option: ["後期高齢者", "健保組合", "国保（大阪）", "国保（他）"],
    optionFontClass: "text-xl font-semibold",
  },
  {
    key: "hknContents",
    label: "保険証の内容",
    option: ["高齢受給者", "生活保護", "非課税世帯", "自己負担免除"],
    optionFontClass: "text-xl font-semibold",
  },
  { key: "hknCopy", label: "保険証のコピー", option: ["コピー済", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "hknId", label: "保険証のID", option: ["確認済", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "hknReturn", label: "保険証の返却", option: ["返却済", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "lemon", label: "レモン", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "breastCoupon", label: "乳クーポン", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "uterusCoupon", label: "子宮クーポン", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "ticket", label: "受診券", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "company", label: "会社", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "home", label: "自宅", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "counter", label: "窓口", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "tel", label: "TEL", option: ["有", "無"], optionFontClass: "text-xl font-semibold" },
  { key: "address", label: "住所", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "meal", label: "食事", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
  { key: "fill", label: "記入用紙", option: ["あり", "なし"], optionFontClass: "text-xl font-semibold" },
  { key: "corona", label: "コロナ問診", option: ["確認", "対象外"], optionFontClass: "text-xl font-semibold" },
];

// reactiveデータ
const result = ref<Jimu>();
// props
const props = defineProps<{
  data: Jimu;
}>();
// emits
const emit = defineEmits<{
  (e: "update:data", value: Jimu): void;
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
