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
        @change="onFileChange"
        class="file-input file-input-bordered file-input-secondary w-full max-w-xl"
      />
    </div>

    <!-- 処理結果エリア -->
    <div class="p-4 rounded-md">
      <textarea
        class="textarea textarea-bordered w-full mt-2"
        rows="6"
        readonly
        :value="output"
      ></textarea>
    </div>
  </div>
  <ConfModal
    v-model:isOpen="showConf"
    :title="showTitle"
    :message="showMessage"
  />
</template>

<script setup lang="ts">
import ExcelJS from "exceljs";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { saveAs } from "file-saver";
import { useDateFormat, useNow, useSorted } from "@vueuse/core";
import { COLUMN_INFO, DATA_INDEX, INPUT_INDEX } from "../types/excelType";

import type { Worksheet, Column } from "exceljs";
import type { RowValues } from "../types/excelType";

const { $db } = useNuxtApp();
const { STATUS } = useConstants();
const output = ref("");
const dateInput = ref(useDateFormat(useNow(), "YYYY-MM-DD").value);
const isLoading = ref(false);
const showConf = ref(false);
const showMessage = ref("");
const showTitle = ref("");
const fileData = ref<File | null>(null);

const excelExport = async () => {
  isLoading.value = true;
  const collectionRef = collection(
    $db,
    useDateFormat(dateInput.value, "YYYYMMDD").value
  );
  const currentDate = useDateFormat(dateInput.value, "YYYY/MM/DD").value;
  try {
    const docdata = await getDocs(collectionRef);
    const tableData: RowValues[] = [];
    for (const doc of docdata.docs) {
      const newRow: RowValues = {
        date: currentDate,
        kancd: doc.data().kancd,
        name: doc.data().name,
        sex: doc.data().sex,
        age: doc.data().age,
        physical: statusset(doc.data().data[DATA_INDEX.身体計測]),
        medical: statusset(doc.data().data[DATA_INDEX.医師診察]),
        eye: statusset(doc.data().data[DATA_INDEX.視力検査]),
        ecg: statusset(doc.data().data[DATA_INDEX.心電図]),
        ultrasound: statusset(doc.data().data[DATA_INDEX.超音波検査]),
        mri: statusset(doc.data().data[DATA_INDEX.MRI]),
        ct: statusset(doc.data().data[DATA_INDEX.CT検査]),
        xray: statusset(doc.data().data[DATA_INDEX.X線検査]),
        endoscopy: statusset(doc.data().data[DATA_INDEX.内視鏡検査]),
        blood: statusset(doc.data().data[DATA_INDEX.採血]),
        pulmonary: statusset(doc.data().data[DATA_INDEX.肺機能]),
      };
      tableData.push(newRow);
    }
    // エクセル用データの作成
    const workbook = new ExcelJS.Workbook();
    const worksheet: Worksheet = workbook.addWorksheet("data");

    // カラム情報の設定
    const headerdata: Partial<Column>[] = [];
    COLUMN_INFO.forEach((column) => {
      headerdata.push(column.BASE);
    });
    worksheet.columns = headerdata;

    // タイトル行の設定
    const titleRow = worksheet.getRow(1);
    titleRow.eachCell((cell, idx) => {
      cell.style = COLUMN_INFO[idx - 1].HEAD;
    });

    // データの流し込み
    const sortedTableData = useSorted(tableData, {
      compareFn: (a, b) => a.kancd.localeCompare(b.kancd),
    }).value;
    worksheet.addRows(sortedTableData);

    // データの範囲に線を引く
    const startRow = 1; // データ開始行
    const endRow = worksheet.lastRow?.number || 1; // データの最終行

    const startCol = 1; // データ開始列
    const endCol = worksheet.columns.length; // データの最終列

    for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
      const row = worksheet.getRow(rowIndex);

      for (let colIndex = startCol; colIndex <= endCol; colIndex++) {
        const cell = row.getCell(colIndex);
        cell.style.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
      }
    }

    // フィルターの設定
    worksheet.autoFilter = {
      from: "A1",
      to: "P1",
    };

    // 表示の固定
    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1, // 1行の下で固定
        xSplit: 3, // C列の右で固定
      },
    ];

    if (endRow > 1) {
      // 書き出し
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer]),
        "人間ドッグ案内システム_" + dateInput.value + ".xlsx"
      );
      showTitle.value = "出力件数";
      showMessage.value = `出力件数は${endRow - 1}件です。`;
    } else {
      showTitle.value = "処理結果";
      showMessage.value = `対象データが0件の為ファイルを出力出来ません。`;
    }
    showConf.value = true;
  } catch (error) {
    console.error("Error fetching data: ", error);
  } finally {
    isLoading.value = false;
  }
};

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    fileData.value = input.files[0];
  }
};

const excelImport = async () => {
  try {
    if (fileData.value) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const buffer = e.target?.result;
        if (buffer) {
          // ExcelJSでバッファを読み込む
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(buffer as ArrayBuffer);

          const worksheet = workbook.getWorksheet("data");

          // シートが存在するか確認
          if (!worksheet) {
            showTitle.value = "エラー";
            showMessage.value = `取込ファイルが正しくありません。`;
            return;
          }

          //日付確認用変数
          let targetDate = "";
          let currentDate = "";

          // シートの各行を処理
          worksheet.eachRow((row, rowNumber) => {
            if (!row.values || !Array.isArray(row.values)) {
              showTitle.value = "エラー";
              showMessage.value = `取込ファイルが正しくありません。`;
              return;
            }

            // ヘッダーのフォーマットチェック
            const rowValues = row.values.slice(1);
            if (rowNumber === 1) {
              const headers = [];
              headers.push(...rowValues);
              headers.forEach((header, index) => {
                if (header !== COLUMN_INFO[index].BASE.header) {
                  showTitle.value = "エラー";
                  showMessage.value = `取込ファイルのフォーマットが正しくありません。`;
                  return;
                }
              });
            } else {
              if (typeof rowValues[INPUT_INDEX.受診日] === "string") {
                currentDate = rowValues[INPUT_INDEX.受診日];
                if (targetDate === "") {
                  targetDate = currentDate;
                } else if (targetDate !== currentDate) {
                  showTitle.value = "エラー";
                  showMessage.value = `日付が一致しません。`;
                } else {
                  updateDocument("20250110", rowValues[INPUT_INDEX.患者ID]);
                  console.log("a");
                }
              } else {
                showTitle.value = "エラー";
                showMessage.value = `日付が正しくありません。`;
              }
            }
          });
        }
      };
      reader.readAsArrayBuffer(fileData.value);
      showTitle.value = "取込完了";
      showMessage.value = `取込件数を出力する。`;
    } else {
      showTitle.value = "エラー";
      showMessage.value = `取込ファイルが選択されていません。`;
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
  } finally {
    isLoading.value = false;
    showConf.value = true;
  }
};

const updateDocument = async (
  collectionName: string,
  documentId: string
): Promise<void> => {
  const docRef = doc($db, collectionName, documentId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data().data;
  data[0].order = 789;
  await updateDoc(docRef, { data });
};

const statusset = (val: any): number | string => {
  switch (val["status"]) {
    case STATUS.INSPECTED:
      return 3;
    case STATUS.INSPECTED:
      return "検査済";
    case STATUS.INSPECTING:
      return "検査中";
    default:
      return "-";
  }
};
</script>
