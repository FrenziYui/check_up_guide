<template>
  <!-- 名前等エリア -->
  <div class="h-44 m-2 mt-3 border rounded-xl border-gray-400 flex overflow-hidden">
    <!-- 左側のコンテンツ -->
    <div class="w-[69%] flex flex-col justify-center">
      <div class="ml-3 mb-2 text-3xl flex items-center">
        <span>ID:{{ data.patientId }}</span>
        <span class="ml-5">性別:{{ data.sex }}</span>
      </div>
      <div class="ml-3 mb-2 text-3xl flex items-center">
        <span>生年月日: {{ data.birthDate }}</span>
      </div>
      <div class="ml-3 overflow-hidden whitespace-nowrap text-ellipsis">
        <ruby class="text-5xl">
          {{ data.name }} 様
          <rt> {{ data.kana }} サマ </rt>
        </ruby>
      </div>
    </div>

    <!-- 右側のコンテンツ -->
    <div class="w-[31%] flex mr-3 flex-col justify-center overflow-hidden">
      <div class="ml-1 flex justify-center items-center h-full">
        <vue-barcode
          v-if="data?.patientId"
          :value="data.patientId"
          format="codabar"
          :options="{
            displayValue: false,
            height: 90,
            width: 3,
            margin: 0,
          }"
          class="max-w-full"
          >読み込みに失敗しました</vue-barcode
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VueBarcode from "@chenfengyuan/vue-barcode";
import type { PersonalItem } from "../types/baseType";

// props
defineProps<{
  data: PersonalItem;
}>();
</script>
