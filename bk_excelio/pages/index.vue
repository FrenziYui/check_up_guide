<template>
  <div
    class="m-5 px-5 bg-orange-100 rounded-lg border border-slate-500"
    style="height: 100%"
  >
    <h1 class="pt-5 text-2xl font-bold">人間ドッグ案内システムデータ更新</h1>

    <!-- 年月日の入力エリア -->
    <div class="p-4 form-control">
      <label class="label">
        <span class="text-lg font-semibold">出力対象検診日</span>
      </label>
      <input
        v-model="dateInput"
        type="date"
        class="input input-bordered w-44"
      />
    </div>

    <!-- インポート・エクスポートボタン -->
    <div class="px-4 flex space-x-4">
      <button class="btn btn-primary" @click="excelExport">ファイル出力</button>
      <button class="btn btn-secondary" @click="excelImport">
        ファイル取込
      </button>
      <input
        type="file"
        ref="fileInput"
        @change="onFileChange"
        class="file-input file-input-bordered file-input-secondary w-full max-w-xl"
      />
    </div>

    <!-- 処理結果エリア -->
    <div
      class="m-5 px-5 bg-orange-100 rounded-lg border border-slate-500 max-h-64 overflow-y-auto h-64"
    >
      <div class="p-2 rounded-md">
        <ul class="list-disc pl-2 leading-relaxed">
          <li v-for="(item, index) in outputArray" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>

  <ConfModal
    v-model:isOpen="showConf"
    :title="showTitle"
    :message="showMessage"
  />
</template>

<script setup lang="ts">
import { useDateFormat, useNow } from "@vueuse/core";

import type { DialogInfo } from "../types/baseType";
import { ExcelIO } from "~/services/ExcelIO";

const outputArray = ref<string[]>([]);
const dateInput = ref(useDateFormat(useNow(), "YYYY-MM-DD").value);
const isLoading = ref(false);
const showConf = ref(false);
const showMessage = ref("");
const showTitle = ref("");
const fileData = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const excelExport = async () => {
  isLoading.value = true;
  const obj = new ExcelIO();
  try {
    obj.init();
    if (!obj.setCollection(dateInput.value)) {
      throw new Error("コレクションが存在しません");
    }
    const result: DialogInfo = await obj.excelExport();
    showTitle.value = result.title;
    showMessage.value = result.message;
  } catch (error) {
    console.error("Error Excel data: ", error);
    showTitle.value = "エラー";
    showMessage.value = "対象日付のデータが存在しません。";
  } finally {
    showConf.value = true;
    isLoading.value = false;
    if (obj) {
      obj.destructor();
    }
  }
};

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    fileData.value = input.files[0];
  }
};

const excelImport = async () => {
  isLoading.value = true;
  const obj = new ExcelIO();
  outputArray.value = [];

  try {
    if (fileData.value) {
      obj.init();
      const result: DialogInfo = await obj.excelImport(fileData.value);
      showTitle.value = result.title;
      showMessage.value = result.message;
      outputArray.value = obj.exeResults;
    } else {
      showTitle.value = "エラー";
      showMessage.value = `取込ファイルが選択されていません。`;
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
  } finally {
    showConf.value = true;
    isLoading.value = false;
    if (fileInput.value) {
      fileInput.value.value = "";
    }
    if (obj) {
      obj.destructor();
    }
  }
};
</script>
