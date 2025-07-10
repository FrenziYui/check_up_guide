<template>
  <div>
    <Loading :isLoading="isLoading" />
    <InputModal v-model:isOpen="showInputModal" :inputData="inputData" @submit="inputSubmit" />
    <EntryModal v-model:isOpen="showEntryModal" @submit="dataSearch" />
    <ToastMessage
      v-model="toastVisible"
      :message="toastPops.message"
      :type="toastPops.type"
      :vPos="toastPops.vPos"
      :hPos="toastPops.hPos"
    />
    <div id="table-container">
      <div id="data-table"></div>
    </div>
  </div>
  <!-- モーダル -->
  <div v-if="isModalOpen">
    <!-- モーダルを全画面表示 -->
    <div class="modal modal-open">
      <div class="modal-box relative w-full h-full max-w-full max-h-full flex flex-col">
        <!-- 閉じるボタン -->
        <button class="btn btn-sm btn-circle absolute right-2 top-2" @click="closeModal">✕</button>

        <!-- PDFを表示するためのiframe、全画面表示 -->
        <div class="iframe-container w-full flex-1 rounded-lg overflow-hidden">
          <iframe :src="pdfUrl" download="fileName.pdf" class="w-full h-full" frameborder="0"></iframe>
        </div>

        <!-- モーダル下部に「内容を確認しました」と「閉じる」ボタンを追加 -->
        <div class="modal-footer flex justify-center items-center p-4 bg-base-200 text-white">
          <button class="btn btn-primary mx-2" @click="closeModal">閉じる</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TabulatorFull as Tabulator } from "tabulator-tables";
import type { CellComponent, FormatterParams } from "tabulator-tables";
import type { ToastProps } from "../types/toastType";
import type { SearchInfo, DataKannyu, IPdfTypeValue, InputData } from "../types/baseType";
import type { ReturnInfo } from "../types/excelType";

import { ExcelIO } from "../services/ExcelIO";
import { TOAST_TYPES, TOAST_V_POS, TOAST_H_POS } from "../types/toastType";

import { useDateFormat, useNow } from "@vueuse/core";
const { MSG, PDF_TYPE, STATUS_COMPLETE } = useConstants();

const { $axios } = useNuxtApp();
const table = ref<Tabulator>(null);
const data = ref<any[]>([]);
const pdfUrl = ref<string>("");
const isModalOpen = ref(false);
const isLoading = ref(true);
const showInputModal = ref(false);
const showEntryModal = ref(false);
const props = defineProps<{
  action: string;
  searchInfo: SearchInfo;
}>();
const inputData = ref({} as InputData);
const emit = defineEmits(["update:action"]);

// Toast表示用
const toastVisible = ref(false);
const toastPops = ref<ToastProps>({ message: "" });

// Tabulatorの初期化
onMounted(async () => {
  await dataUpdate();
  isLoading.value = false;
  table.value = new Tabulator("#data-table", {
    locale: true,
    height: "100%",
    langs: {
      ja: {
        pagination: {
          first: "最初",
          prev: "前へ",
          next: "次へ",
          last: "最後",
          page_size: "表示件数",
          counter: {
            showing: "表示中",
            of: "/",
            rows: "件",
            pages: "ページ",
          },
        },
      },
    },
    pagination: "local",
    paginationSize: 500,
    paginationSizeSelector: [10, 50, 100, 250, 500, 1000],
    rowHeader: {
      formatter: "rownum",
      headerSort: false,
      hozAlign: "center",
      resizable: false,
      frozen: true,
      width: 48,
    },
    columnDefaults: {
      vertAlign: "middle", // 垂直方向の配置
    },
    paginationCounter: "rows",
    rowHeight: 45,
    data: data.value, // 初期データ
    layout: "fitColumns",
    initialHeaderFilter: [{ field: "deactive_flg", value: "false" }],
    columns: [
      {
        formatter: "rowSelection",
        titleFormatter: "rowSelection",
        hozAlign: "center",
        headerSort: false,
        width: 40,
        cssClass: "checkbox-cell", // Tailwind適用用クラス
        titleFormatterParams: {
          rowRange: "active", // アクティブなフィルターされた行の値のみを切り替えます}
        },
      },
      {
        title: "ステータス",
        field: "status_name",
        hozAlign: "center",
        width: 95,
        headerSortTristate: true,
        headerFilter: "list",
        headerFilterParams: {
          values: {
            要入力: "要入力",
            入力済: "入力済",
          },
          clearable: true,
        },
        headerFilterFunc: (headerValue: string, rowValue: any) => {
          if (headerValue === "要入力") {
            return rowValue == "要入力";
          } else if (headerValue === "入力済") {
            return rowValue == "入力済";
          }
          return true;
        },
        formatter: (_cell: CellComponent) => {
          if (_cell.getValue() === "要入力") {
            return `<span class="text-base font-bold text-red-500">${_cell.getValue()}</span>`;
          } else if (_cell.getValue() === "入力済") {
            return `<span class="text-base font-bold text-blue-500">${_cell.getValue()}</span>`;
          } else {
            return `<span class="text-base ">${_cell.getValue()}</span>`;
          }
        },
      },
      {
        title: "登録年月日",
        field: "ent_ymd",
        hozAlign: "center",
        headerFilter: "input",
        width: 110,
      },
      {
        title: "入院日",
        field: "nyuday",
        hozAlign: "center",
        headerFilter: "input",
        width: 110,
      },
      {
        title: "整理番号",
        field: "seirino",
        hozAlign: "center",
        headerFilter: "input",
        width: 90,
      },
      {
        title: "入力患者様氏名",
        field: "inpkanname",
        hozAlign: "left",
        headerFilter: "input",
        width: 130,
      },
      {
        title: "手続者様氏名",
        field: "tetname",
        hozAlign: "left",
        headerFilter: "input",
        width: 130,
      },
      {
        field: "entdata",
        headerSort: false,
        width: 100,
        formatter: (_cell: CellComponent, _formatterParams: FormatterParams) => {
          const disabledClass = "bg-red-500 hover:bg-red-700 text-white";

          return `<button class="btn btn-xs  ${disabledClass}">
             情報入力
              </button>`;
        },
        hozAlign: "center",
        cellClick: (_e: MouseEvent, cell: CellComponent) => {
          const rowData = cell.getRow().getData();
          detailInput(rowData);
        },
      },
      {
        title: "患者ID",
        field: "kancd",
        hozAlign: "center",
        headerFilter: "input",
        width: 90,
        headerSortTristate: true,
      },
      {
        title: "カナ氏名",
        field: "knnam",
        hozAlign: "left",
        headerFilter: "input",
        width: 170,
      },
      {
        title: "ダウンロード日時",
        field: "download_ymd_hs",
        hozAlign: "center",
        width: 170,
        headerFilter: "list",
        headerFilterParams: {
          values: {
            hasData: "ダウンロード済",
            noData: "未ダウンロード",
          },
          clearable: true,
        },
        headerFilterFunc: (headerValue: string, rowValue: any) => {
          if (headerValue === "hasData") {
            return rowValue != null;
          } else if (headerValue === "noData") {
            return rowValue == null;
          }
          return true;
        },
      },
      {
        field: "upddata",
        headerSort: false,
        width: 90,
        formatter: (_cell: CellComponent, _formatterParams: FormatterParams) => {
          const rowData = _cell.getRow().getData();
          const isDisabled = rowData.status_name === "要入力";
          const disabledClass = isDisabled ? "btn-disabled" : "btn-info";

          return `<button class="btn btn-xs  ${disabledClass}">
             チェック表
              </button>`;
        },
        hozAlign: "center",
        cellClick: (_e: MouseEvent, cell: CellComponent) => {
          const rowData = cell.getRow().getData();
          const isEnable = rowData.status_name == "入力済";
          if (isEnable) {
            pdfGet(rowData, PDF_TYPE.ANSWER);
          }
        },
      },
      {
        title: "表示対象",
        field: "deactive_flg",
        hozAlign: "center",
        width: 70,
        headerSort: false,
        headerFilter: "list",
        headerFilterParams: {
          values: {
            false: "有効",
            true: "無効",
          },
        },
        formatter: function (cell: CellComponent): string {
          const value = cell.getValue();
          return value == true ? `<span class="text-red-600 font-bold">無効</span>` : ``;
        },
        // 初期データをフィルタリング
        headerFilterFunc: function (headerValue: string, rowValue: boolean | number) {
          if (headerValue === "true") return rowValue == true;
          if (headerValue === "false") return rowValue != true;
          return true;
        },
      },
      {
        title: "備考",
        field: "biko",
        hozAlign: "left",
        headerFilter: "input",
      },
      {
        title: "患者氏名",
        field: "kjnam",
        visible: false,
      },
      {
        title: "続柄",
        field: "zokugara",
        visible: false,
      },
      {
        title: "メール",
        field: "mailAddress",
        visible: false,
      },
      {
        title: "支払方法",
        field: "pay",
        visible: false,
      },
      {
        title: "個室希望",
        field: "room",
        visible: false,
      },
      {
        title: "回答",
        field: "answer_result",
        visible: false,
      },
      {
        title: "質問",
        field: "question_result",
        visible: false,
      },
      {
        title: "言語",
        field: "lang",
        visible: false,
      },
    ],
  });
});

watch(
  () => props.action,
  (newAction) => {
    if (newAction === "チェック表") {
      dowkloadCheckList();
      // downloadZip();
    } else if (newAction === "エクセルダウンロード") {
      downloadExcel();
    }
    if (newAction) {
      emit("update:action", ""); // または null にリセット
    }
  },
  { immediate: true } // 初期値にも実行されるように
);

const detailInput = (rowData: InputData) => {
  inputData.value = rowData;
  showInputModal.value = true;
};

// pdfをzip化してダウンロードする
const dowkloadCheckList = async () => {
  try {
    const target = table.value.getSelectedData();
    console.log(target);
    const targetArray = target
      .filter((row: DataKannyu) => row.status === STATUS_COMPLETE)
      .map((row: DataKannyu) => ({
        id: row.id,
        kancd: row.kancd,
        nyuday: row.nyuday,
      }));

    if (targetArray.length == 0) {
      toastPops.value = {
        message: MSG.E004,
        type: TOAST_TYPES.ERROR,
        hPos: TOAST_H_POS.CENTER,
      };
      toastVisible.value = true;
    } else {
      isLoading.value = true;

      const formData = new FormData();
      const timestamp = useNow();
      formData.append("data", JSON.stringify(targetArray));
      formData.append("timestamp", timestamp.value.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
      const response = await $axios.post("/download-zip", formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const filename = useDateFormat(timestamp, "YYYYMMDD_HHmmss").value;
      a.download = `チェックリスト_${filename}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      await dataUpdate();
      if (table.value) {
        table.value.replaceData(data.value, true);
      }

      isLoading.value = false;
    }
  } catch (error) {
    toastPops.value = {
      message: MSG.E001,
      type: TOAST_TYPES.ERROR,
      hPos: TOAST_H_POS.CENTER,
      vPos: TOAST_V_POS.MIDDLE,
    };
    isLoading.value = false;
    toastVisible.value = true;
  }
};

// 検索条件でデータを取得する
const dataUpdate = async () => {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(props.searchInfo));
    const response = await $axios.post("/get-nyudata", formData);
    if (response.data.status != 0) {
      throw useCustomError(MSG.E000, "想定外エラー");
    }
    data.value = response.data.result;
  } catch (error) {
    data.value = [];
    toastPops.value = {
      message: MSG.E000,
      type: TOAST_TYPES.ERROR,
      hPos: TOAST_H_POS.CENTER,
      vPos: TOAST_V_POS.MIDDLE,
    };
    toastVisible.value = true;
  } finally {
  }
};

// PDFをダウンロードしモーダルで開く
const pdfGet = async (data: any, pdf_type: IPdfTypeValue) => {
  try {
    isLoading.value = true;
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        kancd: data.kancd,
        nyuday: data.nyuday,
        filenm: pdf_type.filenm,
      })
    );
    const response = await $axios.post("/get-pdf", formData, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const reader = new FileReader();

    reader.onloadend = function () {
      const base64data = reader.result as string;
      pdfUrl.value = base64data; // base64 データを保存する
      isLoading.value = false;

      isModalOpen.value = true; // モーダルを開く
    };

    reader.readAsDataURL(blob); // Blob を base64 に変換
  } catch (error) {
    toastPops.value = {
      message: MSG.E001,
      type: TOAST_TYPES.ERROR,
      hPos: TOAST_H_POS.CENTER,
      vPos: TOAST_V_POS.MIDDLE,
    };
    isLoading.value = false;
    toastVisible.value = true;
  } finally {
  }
};

// モーダルを閉じる関数
const closeModal = () => {
  isModalOpen.value = false;
  // モーダルが閉じられたらURLを解放
  URL.revokeObjectURL(pdfUrl.value);
};
// 画面のデータ更新
const dataSearch = async () => {
  await dataUpdate();
  if (table.value) {
    table.value.replaceData(data.value, true);
  }
};
const inputSubmit = async () => {
  await dataUpdate();
  if (table.value) {
    table.value.replaceData(data.value, true);
  }
};

const downloadExcel = async () => {
  isLoading.value = true;
  const obj = new ExcelIO();
  try {
    obj.init();
    const target = table.value.getSelectedData().length > 0 ? table.value.getSelectedData() : table.value.getData();
    const result: ReturnInfo = await obj.excelExport(target);
    toastPops.value = {
      message: result.message,
      type: result.status,
      hPos: TOAST_H_POS.CENTER,
      vPos: TOAST_V_POS.MIDDLE,
    };
  } catch (error) {
    toastPops.value = {
      message: MSG.E000,
      type: TOAST_TYPES.ERROR,
      hPos: TOAST_H_POS.CENTER,
      vPos: TOAST_V_POS.MIDDLE,
    };
  } finally {
    if (obj) {
      obj.destructor();
      isLoading.value = false;
      toastVisible.value = true;
    }
  }
};

defineExpose({
  dataSearch,
});
</script>
<style>
@import "../assets/css/style.css";
.tabulator .tabulator-col:nth-child(4) .tabulator-col-title,
.tabulator .tabulator-col:nth-child(10) .tabulator-col-title,
.tabulator .tabulator-col:nth-child(12) .tabulator-col-title,
.tabulator .tabulator-col:nth-child(22) .tabulator-col-title {
  font-size: 12px !important;
}
#table-container {
  height: 80vh; /* 画面の80% */
}
</style>
