<template>
  <form @submit.prevent="submitForm" v-if="result">
    <!-- 入力フォーム -->
    <div class="max-h-[80vh] overflow-y-auto p-4">
      <div v-if="result.StoolVisible" class="form-control border border-accent p-4 rounded-lg">
        <QuestionRadio label="便検査１回目" :options="['受領済', '後日郵送', '後日持参']" v-model="result.Stool1" />
      </div>
      <div v-if="result.StoolVisible" class="form-control border border-accent p-4 rounded-lg mt-5">
        <QuestionRadio label="便検査２回目" :options="['受領済', '後日郵送', '後日持参']" v-model="result.Stool2" />
      </div>
      <div v-if="result.UrineVisible" class="form-control border border-accent p-4 rounded-lg mt-5">
        <QuestionRadio label="尿検査" :options="['受領済', '後日郵送', '後日持参']" v-model="result.Urine1" />
      </div>
      <div class="form-control border border-accent p-4 rounded-lg mt-5">
        <QuestionTextarea label="備考" v-model="result.Biko" :maxLength="100" />
      </div>
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
import type { StoolUrine } from "~/types/tabType";
// reactiveデータ
const result = ref<StoolUrine>();
// props
const props = defineProps<{
  data: StoolUrine;
}>();
// emits
const emit = defineEmits<{
  (e: "update:data", value: StoolUrine): void;
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
