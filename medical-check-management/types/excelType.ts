import type { Column, FillPattern } from "exceljs";
import { TOAST_TYPES } from "~/types/toastType";
const { COL_INFO } = useConstants();

type CheckItemName = (typeof COL_INFO)[number]["name"];

export interface ReturnInfo {
  message: string;
  status: (typeof TOAST_TYPES)[keyof typeof TOAST_TYPES];
}

export type RowValues = {
  patientId: string;
  kana: string;
  courseNm: string;
  sex: string;
} & {
  [key in CheckItemName]: string | null;
};

export interface ClumnArea {
  BASE: Partial<Column>;
  HEAD: Partial<Column>;
}
// 塗りつぶしの設定
const BGCOLOR: FillPattern = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "40e0d0" },
};

export const BASE_COLUMN_INFO: ClumnArea[] = [
  {
    BASE: {
      header: "患者ID",
      key: "patientId",
      width: 10,
      style: {
        alignment: {
          horizontal: "center",
          vertical: "middle",
          wrapText: false,
        },
      },
    },
    HEAD: {
      alignment: { horizontal: "center", vertical: "middle" },
      fill: BGCOLOR,
    },
  },
  {
    BASE: {
      header: "予約番号",
      key: "yy_no",
      width: 10,
      style: {
        alignment: {
          horizontal: "right",
          vertical: "middle",
          wrapText: false,
          shrinkToFit: true,
        },
      },
    },
    HEAD: {
      alignment: { horizontal: "center", vertical: "middle" },
      fill: BGCOLOR,
    },
  },
  {
    BASE: {
      header: "カナ氏名",
      key: "kana",
      width: 16,
      style: {
        alignment: {
          horizontal: "left",
          vertical: "middle",
          wrapText: false,
          shrinkToFit: true,
        },
      },
    },
    HEAD: {
      alignment: { horizontal: "center", vertical: "middle" },
      fill: BGCOLOR,
    },
  },
  {
    BASE: {
      header: "性別",
      key: "sex",
      width: 5,
      style: {
        alignment: {
          horizontal: "center",
          vertical: "middle",
          wrapText: false,
        },
      },
    },
    HEAD: {
      alignment: { horizontal: "center", vertical: "middle" },
      fill: BGCOLOR,
    },
  },
  {
    BASE: {
      header: "コース名",
      key: "courseNm",
      width: 30,
      style: {
        alignment: {
          horizontal: "left",
          vertical: "middle",
          wrapText: false,
          shrinkToFit: true,
        },
      },
    },
    HEAD: {
      alignment: { horizontal: "center", vertical: "middle" },
      fill: BGCOLOR,
    },
  },
];
export const CHECK_ITEM_COLUMN_INFO: ClumnArea[] = COL_INFO.map((col) => ({
  BASE: {
    header: col.title,
    key: col.name,
    width: 12,

    style: { alignment: { horizontal: "center", vertical: "middle", wrapText: false, shrinkToFit: true } },
  },
  HEAD: {
    alignment: { horizontal: "center", vertical: "middle" },
    fill: BGCOLOR,
  },
}));

export const COLUMN_INFO: ClumnArea[] = [...BASE_COLUMN_INFO, ...CHECK_ITEM_COLUMN_INFO];
