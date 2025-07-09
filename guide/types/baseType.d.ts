import type { LoginData, LoginFlag } from "~/types/loginType";
import type { LangKey } from "~/types/langType";

// ログイン情報(基本に患者IDを追加)
export interface ExLoginData extends LoginData {
  patientNo: string;
  yyno: string;
}

export interface ExLoginFlag extends LoginFlag {
  patientNo: boolean;
  yyno: boolean;
}

export interface DispCdItem {
  dspOrder: number;
  inpCd: string;
  name: string;
  status: string;
  knstm: string;
  knsnm: string;
  type: string;
}

export interface HeadItem {
  courseNm: string;
}

export interface PersonalItem {
  birthDate: string;
  kana: string;
  name: string;
  patientId: string;
  sex: string;
}

export interface StoolUrine {
  StoolVisible: boolean;
  Stool1: string;
  Stool2: string;
  UrineVisible: boolean;
  Urine1: string;
  Biko: string;
}
export interface ChkJimu {
  StoolVisible: boolean;
  Stool1: string;
  Stool2: string;
  UrineVisible: boolean;
  Urine1: string;
  Biko: string;
}

export interface PatientData extends HeadItem, PersonalItem {
  dispCd: DispCdItem[];
  dispBtn: DispItem[];
  physical: string | null;
  pregnant: string | null;
  urine: StoolUrine | null;
  upd_ymd_hms: string;
  yy_no: number;
  js_cd: string;
  active: string;
  force: string;
  completed: string[] | null;
}

export interface InvestigationData {
  Status: string;
  InpCd: string;
  Active: string;
  DispName: string;
  DispJpn: string;
}
export interface NextItem {
  next: string;
  active: string;
}

export interface DispItem {
  info: number;
  label: string;
  status: number;
  param: string;
  visible: boolean;
}

export interface CookieData {
  userId: string;
  patientNo: string;
  today: string;
  lang: LangKey;
  yyno: string;
  docid: string;
}

// interface Detail {
//   comment: string;
//   date: string;
//   no: string;
//   title: string;
// }

// export interface ResponseData {
//   detail: Detail[];
//   doc_title: string;
//   position: number;
//   shinsei_bi: string;
//   shinsei_sha: string;
//   tanto: string;
// }

// export interface DspInfo {
//   clientName: string;
//   appDate: string;
//   tantoName: string;
//   title: string;
//   currentStep: number;
//   data: Detail[];
// }

// export interface SearchInfo {
//   isHospitalized: boolean;
//   startDate: string | null;
//   endDate: string | null;
// }
// export interface DataListMethods {
//   dataSearch: () => viod;
// }
// export interface DataKannyu {
//   kancd: string;
//   nyuday: string;
//   status: string;
// }

// // PDF系統の型定義start
// export interface IPdfTypeValue {
//   confirm: boolean;
//   filenm: string;
// }
// export interface IPdfType {
//   TETSUZUKI: IPdfTypeValue;
//   ANSWER: IPdfTypeValue;
//   END: IPdfTypeValue;
// }
// // PDF系統の型定義end
// // Login系統の型定義start
// export interface InputData {
//   userId: string;
//   password: string;
// }
// export interface InputFlag {
//   userId: boolean;
//   password: boolean;
// }
// // Login系統の型定義end
// // 汎用返り値
// export interface returnData {
//   status: number;
//   message: string;
//   cnt: number;
//   results: any[];
// }
