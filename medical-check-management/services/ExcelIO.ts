import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useSorted } from "@vueuse/core";

import type { Worksheet, Column } from "exceljs";
import type { RowValues, ReturnInfo } from "../types/excelType";
import { COLUMN_INFO } from "../types/excelType";
import { TOAST_TYPES } from "../types/toastType";
const { formatDateTimeToString } = useCommon();

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
        const newRow: RowValues = {
          ent_ymd: item.ent_ymd,
          nyuday: item.nyuday,
          seirino: item.seirino,
          inpkanname: item.inpkanname,
          tetname: item.tetname,
          kancd: item.kancd,
          status_name: item.status_name,
          knnam: item.knnam,
          download_ymd_hs: item.download_ymd_hs,
          deactive_flg: item.deactive_flg == 1 ? "無効" : "有効",
          biko: item.biko,
          kjnam: item.kjnam,
          zokugara: item.zokugara,
          mailAddress: item.mailAddress,
          pay: item.pay,
          room: item.room,
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

      // ソート患者ID,入院年月日(降順)
      const sortedTableData = useSorted(tableData, {
        compareFn: (a, b) => {
          const kancdCompare = a.kancd.localeCompare(b.kancd);
          if (kancdCompare !== 0) return kancdCompare;
          return b.nyuday.localeCompare(a.nyuday);
        },
      }).value;
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
        saveAs(new Blob([buffer]), `入院時確認チェックシステム_${formatDateTimeToString(new Date())}.xlsx`);
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
