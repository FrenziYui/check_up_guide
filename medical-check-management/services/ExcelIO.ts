import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useSorted } from "@vueuse/core";

import type { Worksheet, Column } from "exceljs";
import type { RowValues, ReturnInfo } from "~/types/excelType";
import { COLUMN_INFO } from "~/types/excelType";
import { TOAST_TYPES } from "~/types/toastType";
const { formatDateTimeToString } = useCommon();
// この処理独自(配列を自動展開する) Start
const { COL_INFO, NOT_INSPECTED } = useConstants();
// この処理独自 End

export class ExcelIO {
  // プロパティ
  public targetCollection!: string;
  public exeResults: string[] = [];
  public nomalCount: number = 0;
  public errorCount: number = 0;
  constructor() {}

  init(): void {
    this.exeResults = [];
    this.nomalCount = 0;
    this.errorCount = 0;
  }

  destructor(): void {
    // 終了処理(javascriptは呼ばないとダメ)
  }

  async excelExport(target: any): Promise<ReturnInfo> {
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
        to: "R1",
      };

      // 変更箇所 表示の固定
      worksheet.views = [
        {
          state: "frozen",
          ySplit: 1, // 1行の下で固定
          xSplit: 4, // C列の右で固定
        },
      ];

      if (endRow > 1) {
        // 書き出し
        const buffer = await workbook.xlsx.writeBuffer();
        // 変更箇所 ファイル名
        saveAs(new Blob([buffer]), `人間ドッグ経路案内システム_${formatDateTimeToString(new Date())}.xlsx`);
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
}
