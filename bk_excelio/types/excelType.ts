import type { Column, FillPattern } from "exceljs";

export interface RowValues {
  date: string;
  kancd: string;
  name: string;
  sex: string;
  age: number;
  physical: number | string | null;
  medical: number | string | null;
  eye: number | string | null;
  ecg: number | string | null;
  ultrasound: number | string | null;
  mri: number | string | null;
  ct: number | string | null;
  xray: number | string | null;
  endoscopy: number | string | null;
  blood: number | string | null;
  pulmonary: number | string | null;
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
      header: "検査日",
      key: "date",
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
      header: "氏名",
      key: "name",
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
      header: "年齢",
      key: "age",
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
      header: "身体計測",
      key: "physical",
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
      header: "医師診察",
      key: "medical",
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
      header: "視力検査",
      key: "eye",
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
      header: "心電図",
      key: "ecg",
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
      header: "超音波検査",
      key: "ultrasound",
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
      header: "MRI/MRA",
      key: "mri",
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
      header: "CT",
      key: "ct",
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
      header: "X線",
      key: "xray",
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
      header: "内視鏡",
      key: "endoscopy",
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
      header: "採血",
      key: "blood",
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
      header: "肺機能",
      key: "pulmonary",
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
];

export enum DATA_INDEX {
  身体計測 = 0,
  医師診察,
  視力検査,
  心電図,
  超音波検査,
  MRI,
  CT検査,
  X線検査,
  内視鏡検査,
  採血,
  肺機能,
}
// 取込エクセルの設定
export enum INPUT_INDEX {
  受診日 = 0,
  患者ID,
  氏名,
  性別,
  年齢,
  身体計測,
  医師診察,
  視力検査,
  心電図,
  超音波検査,
  MRI,
  CT検査,
  X線検査,
  内視鏡検査,
  採血,
  肺機能,
}
