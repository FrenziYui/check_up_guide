import type { Column, FillPattern } from "exceljs";
import { TOAST_TYPES } from "./toastType";

export interface ReturnInfo {
  message: string;
  status: (typeof TOAST_TYPES)[keyof typeof TOAST_TYPES];
}

export interface RowValues {
  ent_ymd: string;
  nyuday: string;
  seirino: string;
  inpkanname: string;
  tetname: string;
  kancd: string;
  status_name: string;
  knnam: string;
  download_ymd_hs: string;
  deactive_flg: string;
  biko: string;
  kjnam: string;
  zokugara: string;
  mailAddress: string;
  pay: string;
  room: string;
}
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

export const COLUMN_INFO: ClumnArea[] = [
  {
    BASE: {
      header: "ステータス",
      key: "status_name",
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
      header: "登録年月日",
      key: "ent_ymd",
      width: 12,
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
      header: "整理番号",
      key: "seirino",
      width: 10,
      style: {
        alignment: {
          horizontal: "right",
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
      header: "入力患者氏名",
      key: "inpkanname",
      width: 25,
      style: {
        alignment: {
          horizontal: "left",
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
      header: "手続者氏名",
      key: "tetname",
      width: 25,
      style: {
        alignment: {
          horizontal: "left",
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
      header: "続柄",
      key: "zokugara",
      width: 25,
      style: {
        alignment: {
          horizontal: "left",
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
      header: "メールアドレス",
      key: "mailAddress",
      width: 25,
      style: {
        alignment: {
          horizontal: "left",
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
      header: "入院年月日",
      key: "nyuday",
      width: 12,
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
      header: "患者ID",
      key: "kancd",
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
      header: "漢字氏名",
      key: "kjnam",
      width: 25,
      style: {
        alignment: {
          horizontal: "left",
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
      header: "カナ氏名",
      key: "knnam",
      width: 40,
      style: {
        alignment: {
          horizontal: "left",
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
      header: "支払方法",
      key: "pay",
      width: 40,
      style: {
        alignment: {
          horizontal: "left",
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
      header: "個室希望",
      key: "room",
      width: 40,
      style: {
        alignment: {
          horizontal: "left",
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
      header: "チェック表ダウンロード日時",
      key: "download_ymd_hs",
      width: 25,
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
      header: "表示対象",
      key: "deactive_flg",
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
      header: "コメント",
      key: "biko",
      width: 20,
      style: {
        alignment: {
          horizontal: "left",
          vertical: "middle",
          wrapText: true,
        },
      },
    },
    HEAD: {
      alignment: { horizontal: "center", vertical: "middle" },
      fill: BGCOLOR,
    },
  },
];
