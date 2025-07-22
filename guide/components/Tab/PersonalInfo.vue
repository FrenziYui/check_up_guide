<template>
  <form @submit.prevent="submitForm" v-if="result">
    <!-- 血圧情報 -->
    <div class="p-4">
      <div class="label text-2xl mb-2">血圧情報</div>
      <div class="space-y-3 text-2xl">
        <div class="flex items-center space-x-6">
          <div class="w-32">初回血圧</div>
          <div class="flex space-x-4">
            <span>最高:</span>
            <span class="font-bold">{{ etcInfo?.highPressure1 }}</span>
          </div>
          <div class="flex space-x-4">
            <span>最低:</span>
            <span class="font-bold">{{ etcInfo?.lowPressure1 }}</span>
          </div>
        </div>
        <div class="flex items-center space-x-6">
          <div class="w-32">2回目血圧</div>
          <div class="flex space-x-4">
            <span>最高:</span>
            <span class="font-bold">{{ etcInfo?.highPressure2 }}</span>
          </div>
          <div class="flex space-x-4">
            <span>最低:</span>
            <span class="font-bold">{{ etcInfo?.lowPressure2 }}</span>
          </div>
        </div>
        <div class="flex items-center space-x-6">
          <div class="w-32">平均血圧</div>
          <div class="flex space-x-4">
            <span>最高:</span>
            <span class="font-bold">{{ etcInfo?.highPressureE }}</span>
          </div>
          <div class="flex space-x-4">
            <span>最低:</span>
            <span class="font-bold">{{ etcInfo?.lowPressureE }}</span>
          </div>
        </div>
      </div>
      <div v-if="etcInfo?.flg_pregnancy">
        <div class="label text-2xl mb-2 mt-5">妊娠情報</div>
        <div class="text-2xl text-red-500 font-bold">{{ etcInfo.pregnancy }}</div>
      </div>
    </div>

    <div class="max-h-[75vh] overflow-y-auto p-4 space-y-2">
      <QuestionTextarea
        label="身体情報"
        v-model="props.physical"
        :maxLength="100"
        heightClass="h-30"
        :readonly="true"
      />
      <QuestionTextarea
        label="アレルギー情報"
        v-model="props.allergy"
        :maxLength="100"
        heightClass="h-30"
        :readonly="true"
      />
      <QuestionTextarea label="備考" v-model="result.biko" :maxLength="100" heightClass="h-30" clearClass="pt-11" />
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
import type { PersonalInfo } from "~/types/tabType";
import type { EtcItem } from "~/types/baseType";

// reactiveデータ
const result = ref<PersonalInfo>({ biko: "" });
// props
const props = defineProps<{
  data: PersonalInfo;
  physical: string | null;
  allergy: string | null;
  etcInfo: EtcItem | undefined;
}>();

// emits
const emit = defineEmits<{
  (e: "update:data", value: PersonalInfo): void;
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
