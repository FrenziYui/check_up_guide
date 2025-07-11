<template>
  <div>
    <Loading :isLoading="isLoading" />
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
</template>

<script setup lang="ts">
import { TabulatorFull as Tabulator } from "tabulator-tables";
import type { ToastProps } from "../types/toastType";
import type { DataValues, BaseRowValues } from "../types/firestoreType";
const { DATA_INDEX, NOT_INSPECTED, STATUS_ICONS, COL_INFO } = useConstants();

const props = defineProps<{
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

const iconSet = (val: DataValues) => {
  const icon = STATUS_ICONS[val.status] || "";
  if (val.knstm && NOT_INSPECTED == val.status) {
    return `${icon} (${val.knstm})`;
  } else {
    return icon;
  }
};

const formatfnc = (cell: any) => {
  const rowData: BaseRowValues = cell.getRow().getData();
  const dataItem: DataValues = rowData.dispCd[cell.getColumn().getDefinition().dataIndex];
  return iconSet(dataItem);
};

const createColumn = (indexKey: keyof typeof DATA_INDEX) => {
  const index = DATA_INDEX[indexKey];
  return {
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
    paginationSize: 200,
    paginationSizeSelector: [20, 50, 100, 250, 500, 1000],
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
      createColumn("身体計測"),
      createColumn("医師診察"),
      createColumn("視力検査"),
      createColumn("心電図"),
      createColumn("超音波検査"),
      createColumn("MRI"),
      createColumn("CT検査"),
      createColumn("X線検査"),
      createColumn("内視鏡検査"),
      createColumn("婦人科"),
      createColumn("胃透視"),
      createColumn("採血"),
      createColumn("PETCT"),
      createColumn("肺機能"),
    ],
  });
});

// snapshot初期化
const initSnapshot = (collectionName: string) => {
  // 既存の監視を停止
  if (stopSnapshot.value) stopSnapshot.value();

  const { data, error: snapError, stop } = useFirestoreCollectionSnapshot<any>(collectionName);
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
</script>
<style>
@import "../assets/css/style.css";
#table-container {
  height: 85vh; /* 画面の85% */
}
</style>
