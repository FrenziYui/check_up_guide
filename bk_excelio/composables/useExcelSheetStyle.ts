import type { Worksheet } from "exceljs";

export const useExcelSheetStyle = (worksheet: Worksheet) => {
  //   ヘッダーのスタイル設定
  const setHeaderStyle = () => {
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell) => {
          cell.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } }; // 太字で白色
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF4F81BD" }, // 青系の背景
          };
          cell.alignment = { horizontal: "center", vertical: "middle" }; // 中央揃え
        });
      }
    });
  };

  /**
   * 行ごとのスタイルを設定
   * @param startRow 設定を開始する行番号
   * @param style スタイルオブジェクト
   */
  const setRowStyles = (startRow: number, style: Partial<ExcelJS.Style>) => {
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber >= startRow) {
        row.eachCell((cell) => {
          cell.style = {
            ...cell.style,
            ...style,
          };
        });
      }
    });
  };

  return {
    setHeaderStyle,
    setRowStyles,
  };
};
