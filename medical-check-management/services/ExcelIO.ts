import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useSorted } from "@vueuse/core";

import type { Worksheet, Column } from "exceljs";
import type { RowValues, ReturnInfo } from "~/types/excelType";
import type { BaseRowValues, OrderValues } from "~/types/firestoreType";
import { COLUMN_INFO, CHECK_ITEM_COLUMN_INFO, BASE_COLUMN_INFO } from "~/types/excelType";
import { TOAST_TYPES } from "~/types/toastType";
// この処理独自(配列を自動展開する) Start
const { COL_INFO, NOT_INSPECTED } = useConstants();
// この処理独自 End

export class ExcelIO {
  // プロパティ
  public targetCollection!: string;
  public exeResults: string[] = [];
  public normalCount: number = 0;
  public errorCount: number = 0;
  constructor() {}

  init(): void {
    this.exeResults = [];
    this.normalCount = 0;
    this.errorCount = 0;
  }

  destructor(): void {
    // 終了処理(javascriptは呼ばないとダメ)
  }

  // ExcelExport
  async excelExport(target: any, filename: string): Promise<ReturnInfo> {
    let returnData: ReturnInfo = { message: "", status: TOAST_TYPES.INFO };
    try {
      const tableData: RowValues[] = [];
      for (const item of target) {
        // 変更箇所 データの定義　Start
        // 基本の項目設定。
        const baseRow = {
          kana: item.kana,
          patientId: item.patientId,
          courseNm: item.courseNm,
          sex: item.sex,
          yy_no: item.yy_no,
        };

        // 配列をCOL_INFOのnameリストを使って検査項目を設定
        const checkItems = COL_INFO.reduce<Record<string, any>>((acc, col, idx) => {
          const val = item.dispCd[idx];
          const disp = item.dispOrder[idx];
          if (disp && val.status === NOT_INSPECTED) {
            acc[col.name] = val.knstm !== "" ? `${disp.order}(${val.knstm})` : disp.order;
          } else {
            acc[col.name] = null;
          }
          return acc;
        }, {});
        // それらをマージ
        const newRow: RowValues = {
          ...baseRow,
          ...checkItems,
        };
        // 変更箇所 データの定義　End

        // 出来たデータを流し込み
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

      // 変更箇所 SORT　Start
      // 患者ID,患者ID
      const sortedTableData = useSorted(tableData, {
        compareFn: (a, b) => {
          const kancdCompare = a.patientId.localeCompare(b.patientId);
          if (kancdCompare !== 0) return kancdCompare;
          return b.patientId.localeCompare(a.patientId);
        },
      }).value;
      // 変更箇所 SORT　End
      // 結果の流し込み
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

          // 変更箇所条件によりスタイルを変更 Start
          // ヘッダー行（1行目）はスタイル変更しない
          if (rowIndex > startRow) {
            if (cell.value === null || cell.value === undefined) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFD3D3D3" }, // 薄い灰色
              };
            } else {
              cell.fill = {
                type: "pattern",
                pattern: "none",
              };
            }
          }
          // 変更箇所条件によりスタイルを変更 End

          // すべてのセルに罫線を設定（ヘッダー含む）
          cell.style.border = {
            top: { style: "thin", color: { argb: "000000" } },
            left: { style: "thin", color: { argb: "000000" } },
            bottom: { style: "thin", color: { argb: "000000" } },
            right: { style: "thin", color: { argb: "000000" } },
          };
        }
      }

      // 変更箇所 フィルタの設定
      worksheet.autoFilter = {
        from: "A1",
        to: "S1",
      };

      // 変更箇所 表示の固定
      worksheet.views = [
        {
          state: "frozen",
          ySplit: 1, // 1行の下で固定
          xSplit: 5, // E列の右で固定
        },
      ];

      if (endRow > 1) {
        // 書き出し
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), filename);
        returnData = {
          status: TOAST_TYPES.SUCCESS,
          message: `ファイルを出力しました。出力件数は${endRow - 1}件です。`,
        };
      } else {
        returnData = {
          status: TOAST_TYPES.WARNING,
          message: `対象データが0件の為ファイルを出力出来ません。`,
        };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "不明なエラー";
      returnData = {
        status: TOAST_TYPES.ERROR,
        message: `想定外のエラーが発生したため、データ出力を中断しました。(${errorMessage})`,
      };
    } finally {
      return returnData;
    }
  }

  // ExcelImport
  readBuffer(fileData: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target?.result;
        resolve(buffer);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(fileData);
    });
  }

  async excelImport(fileData: File, currentDate: string): Promise<{ data: ReturnInfo; error: string[] }> {
    let returnData: ReturnInfo = { message: "", status: TOAST_TYPES.INFO };
    const allErrorLogs: string[] = [];
    try {
      const buffer = await this.readBuffer(fileData);

      if (buffer) {
        // ExcelJSでバッファを読み込む
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer as ArrayBuffer);

        const worksheet = workbook.getWorksheet("data");

        // シートが存在するか確認
        if (!worksheet) {
          returnData = {
            status: TOAST_TYPES.ERROR,
            message: `シート[data]が存在しない為、データの取込を行いませんでした。`,
          };
          return { data: returnData, error: [] };
        }

        const rows: any = [];
        worksheet.eachRow((row) => rows.push(row));

        // シートの各行を処理
        for (const row of rows) {
          const rowNumber = row.number;
          if (!Array.isArray(row.values)) {
            returnData = {
              status: TOAST_TYPES.ERROR,
              message: `データが存在しないため、データの取込を行いませんでした。`,
            };
            return { data: returnData, error: [] };
          }
          const rowValue = row.values.slice(1);

          // ヘッダーのフォーマットチェック
          if (rowNumber === 1) {
            const headers = [];
            headers.push(...rowValue);
            headers.forEach((header, index) => {
              if (header !== COLUMN_INFO[index].BASE.header) {
                throw useCustomError(
                  `データのフォーマットが異なるため、データの取込を行いませんでした。(ヘッダー)`,
                  "INVALID_HEADER",
                  `想定：${COLUMN_INFO[index].BASE.header} Excel：${header} `
                );
              }
            });
          } else {
            const errLogs: string[] = await this.updateData(rowValue, currentDate);
            if (errLogs.length == 0) {
              this.normalCount += 1;
            } else {
              this.errorCount += 1;
              allErrorLogs.push(...errLogs);
            }
          }
        }
      }
      returnData = {
        status: this.errorCount ? TOAST_TYPES.ERROR : TOAST_TYPES.INFO,
        message: `正常件数：${this.normalCount}件、エラー件数：${this.errorCount}件`,
      };
      return { data: returnData, error: allErrorLogs };
    } catch (error) {
      if (error instanceof CustomError) {
        returnData = {
          status: TOAST_TYPES.ERROR,
          message: `${error.message}(${error.details})`,
        };
      } else {
        returnData = {
          status: TOAST_TYPES.ERROR,
          message: `想定外のエラーが発生しました。再度実行しエラーが発生する場合、アプリチームに連絡ください。`,
        };
      }
      return { data: returnData, error: [] };
    }
  }

  private async updateData(rowValue: any, currentDate: string): Promise<string[]> {
    const jsCd = String(rowValue[0]).padStart(10, "0");
    const { data, error } = await useFirestoreDocument<BaseRowValues>(currentDate, `${jsCd}_${rowValue[1]}`);
    const errLog = [];
    try {
      if (error.value != null || data.value == null) {
        errLog.push(`患者ID:${rowValue[0]}のデータが(${currentDate})見つかりませんでした`);
        return errLog;
      }
      let updData: OrderValues[] = data.value.dispOrder;
      for (let i = 0; i < CHECK_ITEM_COLUMN_INFO.length; i++) {
        // 対象文字を抜き出し
        const rawVal = rowValue[i + BASE_COLUMN_INFO.length];
        // 1. undefinedなら"99"をセット、それ以外は文字列化
        const strVal = rawVal === undefined || rawVal === null ? "99" : String(rawVal);
        // 2. 丸括弧内の文字を除去（"3(9:00)" -> "3"）
        const removedParens = strVal.replace(/\(.*?\)/g, "").trim();
        // 3. 数値かチェック
        const numVal = Number(removedParens);
        if (isNaN(numVal)) {
          errLog.push(`患者ID:${rowValue[0]}の(${COL_INFO[i].title})が数値ではありません`);
        } else {
          updData[i].order = numVal;
        }
      }
      if (errLog.length == 0) {
        const { error, updateDocument } = useFirestoreDocumentUpdate<BaseRowValues>();
        const result = await updateDocument(currentDate, `${jsCd}_${rowValue[1]}`, { dispOrder: updData });
        if (result == false) {
          errLog.push(`患者ID:${rowValue[0]}のデータ更新で想定外のエラーが発生しました`);
        }
      }
      return errLog;
    } catch (error) {
      errLog.push(`患者ID:${rowValue[0]}で想定外のエラーが発生しました`);
      return errLog;
    }
  }
}
