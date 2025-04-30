import ExcelJS from "exceljs";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { saveAs } from "file-saver";
import { useDateFormat, useSorted } from "@vueuse/core";
import { COLUMN_INFO, DATA_INDEX, INPUT_INDEX } from "../types/excelType";

import type { Worksheet, Column } from "exceljs";
import type { RowValues } from "../types/excelType";
import type { DialogInfo } from "../types/baseType";
import type { CollectionReference, Firestore } from "firebase/firestore";
export class ExcelIO {
  // プロパティ
  public targetCollection!: string;
  private collectionRef!: CollectionReference;
  private status: any;
  public exeResults: string[] = [];
  public nomalCount: number = 0;
  public errorCount: number = 0;
  constructor() {}

  init(): void {
    const { STATUS } = useConstants();
    this.status = STATUS;
    this.exeResults = [];
    this.nomalCount = 0;
    this.errorCount = 0;
  }

  destructor(): void {
    // 終了処理(javascriptは呼ばないとダメ)
    this.collectionRef = null!;
  }

  setCollection(_collection: string): boolean {
    let result = false;
    try {
      const { $db } = useNuxtApp();
      this.targetCollection = useDateFormat(_collection, "YYYYMMDD").value;
      this.collectionRef = collection($db, this.targetCollection);
      result = true;
    } catch (error) {
      console.error(`コレクションが存在しません (${_collection}):`, error);
    } finally {
      return result;
    }
  }

  async excelExport(): Promise<DialogInfo> {
    let dialogData: DialogInfo = { title: "", message: "", status: false };
    try {
      const docdata = await getDocs(this.collectionRef);
      const tableData: RowValues[] = [];
      for (const doc of docdata.docs) {
        const newRow: RowValues = {
          date: this.targetCollection,
          kancd: doc.data().kancd,
          name: doc.data().name,
          sex: doc.data().sex,
          age: doc.data().age,
          physical: this.statusset(doc.data().data[DATA_INDEX.身体計測]),
          medical: this.statusset(doc.data().data[DATA_INDEX.医師診察]),
          eye: this.statusset(doc.data().data[DATA_INDEX.視力検査]),
          ecg: this.statusset(doc.data().data[DATA_INDEX.心電図]),
          ultrasound: this.statusset(doc.data().data[DATA_INDEX.超音波検査]),
          mri: this.statusset(doc.data().data[DATA_INDEX.MRI]),
          ct: this.statusset(doc.data().data[DATA_INDEX.CT検査]),
          xray: this.statusset(doc.data().data[DATA_INDEX.X線検査]),
          endoscopy: this.statusset(doc.data().data[DATA_INDEX.内視鏡検査]),
          blood: this.statusset(doc.data().data[DATA_INDEX.採血]),
          pulmonary: this.statusset(doc.data().data[DATA_INDEX.肺機能]),
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
          "人間ドッグ案内システム_" + this.targetCollection + ".xlsx"
        );
        dialogData = {
          status: true,
          title: `出力件数`,
          message: `出力件数は${endRow - 1}件です。`,
        };
      } else {
        dialogData = {
          status: false,
          title: `処理結果`,
          message: `対象データが0件の為ファイルを出力出来ません。`,
        };
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      dialogData = {
        status: false,
        title: `エラー`,
        message: `想定外のエラーが発生したため、データ出力を中断しました。`,
      };
    } finally {
      return dialogData;
    }
  }
  private statusset(val: any): number | string | null {
    switch (val["status"]) {
      case this.status.UNINSPECTED:
        return val["order"];
      case this.status.INSPECTED:
        return "検査済";
      case this.status.INSPECTING:
        return "検査中";
      default:
        return "-";
    }
  }
  async excelImport(fileData: File): Promise<DialogInfo> {
    let dialogData: DialogInfo = { title: "", message: "", status: true };
    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const buffer = e.target?.result;
        if (buffer) {
          // ExcelJSでバッファを読み込む
          const { $db } = useNuxtApp();
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(buffer as ArrayBuffer);

          const worksheet = workbook.getWorksheet("data");

          // シートが存在するか確認
          if (!worksheet) {
            console.log("ax");
            dialogData = {
              status: false,
              title: `エラー`,
              message: `シート[data]が存在しない為、データの取込を行いませんでした。`,
            };
            return;
          }

          // シートの各行を処理
          worksheet.eachRow((row, rowNumber) => {
            if (!row.values || !Array.isArray(row.values)) {
              dialogData = {
                status: false,
                title: `エラー`,
                message: `データが存在したいため、データの取込を行いませんでした。`,
              };
              return;
            }

            // ヘッダーのフォーマットチェック
            const rowValues = row.values.slice(1);
            if (rowNumber === 1) {
              const headers = [];
              headers.push(...rowValues);
              headers.forEach((header, index) => {
                if (header !== COLUMN_INFO[index].BASE.header) {
                  dialogData = {
                    status: false,
                    title: `エラー`,
                    message: `データのフォーマットが異なるため、データの取込を行いませんでした。(ヘッダー)`,
                  };
                  return;
                }
              });
            } else {
              if (
                typeof rowValues[INPUT_INDEX.受診日] === "string" &&
                typeof rowValues[INPUT_INDEX.患者ID] === "string"
              ) {
                this.updateDocument(
                  $db,
                  rowValues[INPUT_INDEX.受診日],
                  rowValues[INPUT_INDEX.患者ID],
                  rowNumber
                );
              } else {
                this.exeResults.push(
                  ` ${rowNumber}行目：受信日(${
                    rowValues[INPUT_INDEX.受診日]
                  })又は患者ID${
                    rowValues[INPUT_INDEX.患者ID]
                  }、が正しくありません。`
                );
                this.errorCount += 1;
              }
            }
          });
        }
      };
      reader.readAsArrayBuffer(fileData);
      if (dialogData.status) {
        dialogData = {
          status: true,
          title: `処理件数`,
          message: `正常件数：${this.nomalCount}件、エラー件数：${this.errorCount}件`,
        };
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      return dialogData;
    }
  }

  private async updateDocument(
    db: Firestore,
    collectionName: string,
    documentId: string,
    rowNumber: number
  ): Promise<void> {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      this.exeResults.push(
        ` ${rowNumber}行目：患者ID(${documentId})が正しくありません。`
      );
      this.errorCount += 1;
    } else {
      const data = docSnap.data().data;
      data[0].order = 15;
      await updateDoc(docRef, { data });
      this.nomalCount += 1;
      console.log(this.nomalCount);
    }
  }
}
