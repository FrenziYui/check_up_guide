interface Detail {
  comment: string;
  date: string;
  no: string;
  title: string;
}
export interface SearchInfo {
  startDate: string | null;
  endDate: string | null;
}
export interface DataListMethods {
  dataSearch: () => viod;
}

// Login系統の型定義start
export interface InputFlag {
  [key: string]: any;
}
// Login系統の型定義end
// 汎用返り値
export interface returnData {
  status: number;
  message: string;
  cnt: number;
  results: any[];
}

export interface InputData {
  [key: string]: any;
}
export type ClearableFields = "startDate" | "endDate";
