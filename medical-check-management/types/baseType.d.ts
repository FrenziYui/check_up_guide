interface Detail {
  comment: string;
  date: string;
  no: string;
  title: string;
}

export interface ResponseData {
  detail: Detail[];
  doc_title: string;
  position: number;
  shinsei_bi: string;
  shinsei_sha: string;
  tanto: string;
}

export interface DspInfo {
  clientName: string;
  appDate: string;
  tantoName: string;
  title: string;
  currentStep: number;
  data: Detail[];
}

export interface SearchInfo {
  startDate: string | null;
  endDate: string | null;
}
export interface DataListMethods {
  dataSearch: () => viod;
}
export interface DataKannyu {
  id: number;
  kancd: string;
  nyuday: string;
  status: string;
}

// PDF系統の型定義start
export interface IPdfTypeValue {
  confirm: boolean;
  filenm: string;
}
export interface IPdfType {
  TETSUZUKI: IPdfTypeValue;
  ANSWER: IPdfTypeValue;
  END: IPdfTypeValue;
}
// PDF系統の型定義end
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
