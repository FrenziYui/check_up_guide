<template>
  <div ref="table"></div>
  <Loading :isLoading="isLoading" />
  <div>
    <div
      v-if="showMenu"
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
    >
      <DetailData
        v-model:isMenu="showMenu"
        :currentData="currentData"
        :currentDate="props.currentDate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const showMenu = ref(false);
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import type { TabulatorFull, RowComponent } from "tabulator-tables";
import type { DataValues, RowValues } from "../types/basetype";

const { DATA_INDEX, NOT_INSPECTED, STATUS_ICONS, COL_INFO } = useConstants();
const { minMaxFilterEditor, minMaxFilterFunction } = useTabulatorFnc();
const tabulator = ref<TabulatorFull | null>(null);
const table = ref(null);
const tableData = reactive<RowValues[]>([]);
const props = defineProps({
  showOrder: Boolean,
  currentDate: String,
});
const currentData = ref<RowValues>();
const currentIndx = ref<number>();
const isLoading = ref(true);

// watch(
//   tableData,
//   (newData) => {
//     if (tabulator.value) {
//       tabulator.value.setData(newData);
//     }
//   },
//   { deep: true }
// );
watch(
  () => props.showOrder,
  () => {
    if (tabulator.value) {
      const scrollPosition = tabulator.value.getScrollPosition(); // 現在のスクロール位置を保存
      console.log(scrollPosition);
      tabulator.value.redraw(true);
    }
  }
);

const iconSet = (val: DataValues) => {
  const icon = STATUS_ICONS[val.status] || "";
  if (val.time && NOT_INSPECTED == val.status) {
    return `${icon} (${val.time})`;
  } else {
    return icon;
  }
};

const formatfnc = (cell: any) => {
  const rowData = cell.getRow().getData();
  const dataItem: DataValues =
    rowData.data[cell.getColumn().getDefinition().dataIndex];
  if (props.showOrder && NOT_INSPECTED == dataItem.status) {
    return dataItem.order !== null ? dataItem.order : "0";
  } else {
    return iconSet(dataItem);
  }
};

const fndKancd = (kancd: string): number => {
  return tableData.findIndex((row) => row.kancd === kancd);
};

onMounted(() => {
  if (props.currentDate) {
    currentdataSet(props.currentDate);
  }
  tabulator.value = new Tabulator(table.value, {
    locale: true,
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
    reactiveData: true,
    // height: "650px",
    height: calculateHeight(), // 初期高さ設定
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 10,
    paginationSizeSelector: [10, 50, 100, 200],
    rowHeader: {
      formatter: "rownum",
      headerSort: false,
      hozAlign: "center",
      resizable: false,
      frozen: true,
      width: 65,
    },
    paginationCounter: "rows",

    columns: [
      { title: "ID", field: "id", visible: false },
      {
        title: "受信日",
        field: "date",
        visible: false,
      },
      {
        title: "患者ID",
        field: "kancd",
        width: 115,
        hozAlign: "center",
        headerFilter: "input",
      },
      {
        title: "氏名",
        field: "name",
        width: 150,
        hozAlign: "left",
        headerFilter: "input",
      },
      {
        title: "性別",
        field: "sex",
        width: 90,
        hozAlign: "center",
        headerFilter: "list",
        headerFilterParams: {
          values: { 男性: "男性", 女性: "女性", "": "" },
          clearable: true,
        },
      },
      {
        title: "年齢",
        field: "age",
        hozAlign: "right",
        headerFilter: minMaxFilterEditor,
        headerFilterFunc: minMaxFilterFunction,
        headerFilterLiveFilter: false,
        width: 135,
      },
      {
        title: COL_INFO[DATA_INDEX.身体計測]["title"],
        field: COL_INFO[DATA_INDEX.身体計測]["name"],
        width: 115,
        hozAlign: "center",
        headerSort: false,
        dataIndex: 0,
        formatter: formatfnc,
        headerFilterFunc: (
          headerValue: string,
          rowValue: any,
          rowData: RowValues
        ) => {
          return rowData.data[DATA_INDEX.身体計測].status === headerValue;
        },
        headerFilter: "list",
        headerFilterParams: {
          values: STATUS_ICONS,
        },
      },
      {
        title: COL_INFO[DATA_INDEX.医師診察]["title"],
        field: COL_INFO[DATA_INDEX.医師診察]["name"],
        width: 115,
        hozAlign: "center",
        headerSort: false,
        dataIndex: 1,
        formatter: formatfnc,
        headerFilterFunc: (
          headerValue: string,
          rowValue: any,
          rowData: RowValues
        ) => {
          return rowData.data[DATA_INDEX.医師診察].status === headerValue;
        },
        headerFilter: "list",
        headerFilterParams: {
          values: STATUS_ICONS,
        },
      },
      {
        title: COL_INFO[DATA_INDEX.視力検査]["title"],
        field: COL_INFO[DATA_INDEX.視力検査]["name"],
        width: 115,
        headerSort: false,
        dataIndex: 2,
        hozAlign: "center",
        formatter: formatfnc,
        headerFilterFunc: (
          headerValue: string,
          rowValue: any,
          rowData: RowValues
        ) => {
          return rowData.data[DATA_INDEX.視力検査].status === headerValue;
        },
        headerFilter: "list",
        headerFilterParams: {
          values: STATUS_ICONS,
        },
      },
      {
        title: COL_INFO[DATA_INDEX.心電図]["title"],
        field: COL_INFO[DATA_INDEX.心電図]["name"],
        width: 115,
        headerSort: false,
        dataIndex: 3,
        hozAlign: "center",
        formatter: formatfnc,
        headerFilterFunc: (
          headerValue: string,
          rowValue: any,
          rowData: RowValues
        ) => {
          return rowData.data[DATA_INDEX.心電図].status === headerValue;
        },
        headerFilter: "list",
        headerFilterParams: {
          values: STATUS_ICONS,
        },
      },
      {
        title: COL_INFO[DATA_INDEX.超音波検査]["title"],
        field: COL_INFO[DATA_INDEX.超音波検査]["name"],
        width: 115,
        headerSort: false,
        dataIndex: 4,
        hozAlign: "center",
        formatter: formatfnc,
        headerFilterFunc: (
          headerValue: string,
          rowValue: any,
          rowData: RowValues
        ) => {
          return rowData.data[DATA_INDEX.超音波検査].status === headerValue;
        },
        headerFilter: "list",
        headerFilterParams: {
          values: STATUS_ICONS,
        },
      },
      {
        title: COL_INFO[DATA_INDEX.MRI]["title"],
        field: COL_INFO[DATA_INDEX.MRI]["name"],
        width: 115,
        headerSort: false,
        dataIndex: 5,
        hozAlign: "center",
        formatter: formatfnc,
        headerFilterFunc: (
          headerValue: string,
          rowValue: any,
          rowData: RowValues
        ) => {
          return rowData.data[DATA_INDEX.MRI].status === headerValue;
        },
        headerFilter: "list",
        headerFilterParams: {
          values: STATUS_ICONS,
        },
      },
      {
        title: COL_INFO[DATA_INDEX.CT検査]["title"],
        field: COL_INFO[DATA_INDEX.CT検査]["name"],
        width: 115,
        headerSort: false,
        dataIndex: 6,
        hozAlign: "center",
        formatter: formatfnc,
        headerFilterFunc: (
          headerValue: string,
          rowValue: any,
          rowData: RowValues
        ) => {
          return rowData.data[DATA_INDEX.CT検査].status === headerValue;
        },
        headerFilter: "list",
        headerFilterParams: {
          values: STATUS_ICONS,
        },
      },
      {
        title: COL_INFO[DATA_INDEX.X線検査]["title"],
        field: COL_INFO[DATA_INDEX.X線検査]["name"],
        width: 115,
        headerSort: false,
        dataIndex: 7,
        hozAlign: "center",
        formatter: formatfnc,
        headerFilterFunc: (
          headerValue: string,
          rowValue: any,
          rowData: RowValues
        ) => {
          return rowData.data[DATA_INDEX.X線検査].status === headerValue;
        },
        headerFilter: "list",
        headerFilterParams: {
          values: STATUS_ICONS,
        },
      },
      {
        title: COL_INFO[DATA_INDEX.内視鏡検査]["title"],
        field: COL_INFO[DATA_INDEX.内視鏡検査]["name"],
        width: 115,
        headerSort: false,
        dataIndex: 8,
        hozAlign: "center",
        formatter: formatfnc,
        headerFilterFunc: (
          headerValue: string,
          rowValue: any,
          rowData: RowValues
        ) => {
          return rowData.data[DATA_INDEX.内視鏡検査].status === headerValue;
        },
        headerFilter: "list",
        headerFilterParams: {
          values: STATUS_ICONS,
        },
      },
      {
        title: COL_INFO[DATA_INDEX.採血]["title"],
        field: COL_INFO[DATA_INDEX.採血]["name"],
        width: 115,
        headerSort: false,
        dataIndex: 9,
        hozAlign: "center",
        formatter: formatfnc,
        headerFilterFunc: (
          headerValue: string,
          rowValue: any,
          rowData: RowValues
        ) => {
          return rowData.data[DATA_INDEX.採血].status === headerValue;
        },
        headerFilter: "list",
        headerFilterParams: {
          values: STATUS_ICONS,
        },
      },
      {
        title: COL_INFO[DATA_INDEX.肺機能]["title"],
        field: COL_INFO[DATA_INDEX.肺機能]["name"],
        width: 115,
        headerSort: false,
        dataIndex: 10,
        hozAlign: "center",
        formatter: formatfnc,
        headerFilterFunc: (
          headerValue: string,
          rowValue: any,
          rowData: RowValues
        ) => {
          return rowData.data[DATA_INDEX.肺機能].status === headerValue;
        },
        headerFilter: "list",
        headerFilterParams: {
          values: STATUS_ICONS,
        },
      },
    ],
  });
  if (tabulator.value) {
    tabulator.value.on("rowClick", (e: MouseEvent, row: RowComponent) => {
      currentData.value = row.getData();
      currentIndx.value = row.getIndex();
      showMenu.value = true;
    });
  }
});

const currentdataSet = async (date: string) => {
  isLoading.value = true;
  const collectionRef = collection(db, date);

  try {
    const docdata = await getDocs(collectionRef);

    docdata.forEach((doc) => {
      const newRow: RowValues = {
        id: doc.data()["id"],
        kancd: doc.data()["kancd"],
        name: doc.data()["name"],
        date: doc.data()["date"],
        sex: doc.data()["sex"],
        age: doc.data()["age"],
        data: doc.data()["data"],
      };
      COL_INFO.forEach((colInfo, index) => {
        const key = colInfo["name"];
        newRow[key] = doc.data()["data"][index];
      });
      tableData.push(newRow);
    });
    tabulator.value.setData(tableData);
  } catch (error) {
    console.error("Error fetching data: ", error);
  } finally {
    isLoading.value = false;
  }
};

window.addEventListener("resize", function () {
  tabulator.value.setHeight(calculateHeight());
});
function calculateHeight() {
  return window.innerHeight - 100; // 100はヘッダーやその他の余白
}
</script>
<style>
@import "../assets/css/style.css";
</style>
