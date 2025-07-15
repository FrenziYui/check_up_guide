<template>
  <div>
    <CommonLoading :isLoading="isLoading" />
    <CommonToastMessage
      v-model="toastVisible"
      :message="toastPops.message"
      :type="toastPops.type"
      :vPos="toastPops.vPos"
      :hPos="toastPops.hPos"
    />
    <div class="px-4 flex space-x-4">
      <button class="btn btn-primary" @click="downloadExcel">Excelファイル出力</button>
      <button class="btn btn-secondary" @click="triggerFileSelect">Excelファイル取込</button>
      <input type="file" ref="fileInput" @change="onFileChange" class="hidden" />
    </div>
    <div id="table-container">
      <div id="data-table"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TabulatorFull as Tabulator } from "tabulator-tables";
// 型
import type { ToastProps } from "~/types/toastType";
import type { ReturnInfo } from "~/types/excelType";
import type { DataValues, BaseRowValues, OrderValues } from "~/types/firestoreType";

// 定数
import { TOAST_H_POS, TOAST_V_POS, TOAST_TYPES } from "~/types/toastType";
const { DATA_INDEX, NOT_INSPECTED, STATUS_ICONS, COL_INFO, MSG } = useConstants();

// excel入出力モジュール
import { ExcelIO } from "~/services/ExcelIO";

// Inputファイル
const fileData = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// firestoreの条件用
import { where } from "firebase/firestore";

// 共通関数
const { formatDateTimeToString } = useCommon();

const props = defineProps<{
  showOrder: Boolean;
  currentDate: string;
}>();
const table = ref<Tabulator>(null);
const snapData = ref<any[]>([]);
const error = ref<string | null>(null);
const stopSnapshot = ref<() => void>();
const isLoading = ref(true);

// Toast表示用
const toastVisible = ref(false);
const toastPops = ref<ToastProps>({ message: "" });

const iconSet = (val: DataValues, order?: number | undefined) => {
  const icon = STATUS_ICONS[val.status] || "";

  if (NOT_INSPECTED == val.status) {
    const dspicon = order != null ? `<span class="text-red-500 font-bold text-xl">${order}</span>` : icon;
    return val.knstm ? `${dspicon} (${val.knstm})` : dspicon;
  }
  return icon;
};

const formatfnc = (cell: any) => {
  const rowData: BaseRowValues = cell.getRow().getData();
  const index = cell.getColumn().getDefinition().dataIndex;
  const dataItem: DataValues = rowData.dispCd[index];
  const dataorder: OrderValues = rowData.dispOrder[index];
  return iconSet(dataItem, props.showOrder ? dataorder.order : undefined);
};

const createColumn = (indexKey: keyof typeof DATA_INDEX) => {
  const index = DATA_INDEX[indexKey];
  const mainColumn = {
    title: COL_INFO[index]["title"],
    field: COL_INFO[index]["name"],
    width: COL_INFO[index]["width"],
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    dataIndex: index,
    formatter: formatfnc,
    headerFilterFunc: (headerValue: string, rowValue: any, rowData: BaseRowValues) => {
      return rowData.dispCd[index].status === headerValue;
    },
    headerFilter: "list",
    headerFilterParams: {
      values: STATUS_ICONS,
    },
  };
  return [mainColumn];
};

// Tabulatorの初期化
onMounted(async () => {
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
    paginationSize: 100,
    paginationSizeSelector: [50, 100, 200, 300],
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
    data: snapData.value,
    layout: "fitColumns",
    initialHeaderFilter: [{ field: "deactive_flg", value: "false" }],
    columns: [
      {
        formatter: "rowSelection",
        titleFormatter: "rowSelection",
        hozAlign: "center",
        headerSort: false,
        width: 40,
        cssClass: "checkbox-cell",
        titleFormatterParams: {
          rowRange: "active",
        },
      },
      {
        title: "患者ID",
        field: "patientId",
        hozAlign: "center",
        headerFilter: "input",
        width: 90,
        headerSortTristate: true,
      },
      {
        title: "カナ氏名",
        field: "kana",
        hozAlign: "left",
        headerFilter: "input",
        width: 150,
        headerSortTristate: true,
      },
      {
        title: "性別",
        field: "sex",
        width: 70,
        hozAlign: "center",
        headerFilter: "list",
        headerFilterParams: {
          values: { 男性: "男性", 女性: "女性", "": "" },
          clearable: true,
        },
      },
      ...createColumn("身体計測"),
      ...createColumn("医師診察"),
      ...createColumn("視力検査"),
      ...createColumn("心電図"),
      ...createColumn("超音波検査"),
      ...createColumn("MRI"),
      ...createColumn("CT検査"),
      ...createColumn("X線検査"),
      ...createColumn("内視鏡検査"),
      ...createColumn("婦人科"),
      ...createColumn("胃透視"),
      ...createColumn("採血"),
      ...createColumn("PETCT"),
      ...createColumn("肺機能"),
    ],
  });
});

const downloadExcel = async () => {
  isLoading.value = true;
  const obj = new ExcelIO();
  try {
    obj.init();
    const target = table.value.getSelectedData().length > 0 ? table.value.getSelectedData() : table.value.getData();
    const filename = `人間ドッグ経路案内システム_${props.currentDate}_${formatDateTimeToString(new Date())}.xlsx`;
    const result: ReturnInfo = await obj.excelExport(target, filename);
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

const triggerFileSelect = () => {
  fileInput.value?.click();
};

const onFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    fileData.value = input.files[0];
    await importExcel();
  }
};

const importExcel = async () => {
  isLoading.value = true;
  const obj = new ExcelIO();

  try {
    if (fileData.value) {
      obj.init();
      const { data: result, error: errorlog } = await obj.excelImport(fileData.value, props.currentDate);
      toastPops.value = {
        message: result.message,
        type: result.status,
        hPos: TOAST_H_POS.CENTER,
        vPos: TOAST_V_POS.MIDDLE,
      };
    } else {
      toastPops.value = {
        message: MSG.E006,
        type: TOAST_TYPES.ERROR,
        hPos: TOAST_H_POS.CENTER,
        vPos: TOAST_V_POS.MIDDLE,
      };
    }
  } catch (error) {
    toastPops.value = {
      message: MSG.E000,
      type: TOAST_TYPES.ERROR,
      hPos: TOAST_H_POS.CENTER,
      vPos: TOAST_V_POS.MIDDLE,
    };
  } finally {
    if (fileInput.value) {
      fileInput.value.value = "";
    }
    if (obj) {
      obj.destructor();
      isLoading.value = false;
      toastVisible.value = true;
    }
  }
};

// snapshot初期化
const initSnapshot = (collectionName: string) => {
  // 既存の監視を停止
  if (stopSnapshot.value) stopSnapshot.value();

  const {
    data,
    error: snapError,
    stop,
  } = useFirestoreCollectionSnapshot<any>(collectionName, [where("cancel", "==", false)]);
  stopSnapshot.value = stop;

  watch(data, (newVal) => {
    snapData.value = newVal || [];
  });

  error.value = snapError.value;
};

onUnmounted(() => {
  stopSnapshot.value?.();
});

// 日付変更によるデータ切替
watch(
  () => props.currentDate,
  (newVal) => {
    initSnapshot(newVal);
  },
  { immediate: true }
);
// データ更新
watch(snapData, (newVal) => {
  if (table.value && newVal) {
    // 更新前のスクロール位置を記録
    const tableWrapper = document.querySelector("#data-table .tabulator-tableholder");
    if (!tableWrapper) return;
    const scrollTop = tableWrapper.scrollTop;

    table.value.setData(newVal).then(() => {
      // データ更新後、スクロール位置を戻す
      tableWrapper.scrollTop = scrollTop;
    });
  }
});
watch(
  () => props.showOrder,
  () => {
    if (table.value) {
      const tableWrapper = document.querySelector("#data-table .tabulator-tableholder") as HTMLElement;
      if (!tableWrapper) return;

      table.value.redraw(false);

      requestAnimationFrame(() => {
        tableWrapper.scrollTop = 0;
      });
    }
  }
);
</script>
<style>
@import "../assets/css/style.css";
#table-container {
  height: 85vh; /* 画面の85% */
}
</style>
