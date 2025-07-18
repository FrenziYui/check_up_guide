import type { LoginData, LoginFlag } from "~/types/loginType";
import type { LangKey } from "~/types/langType";
import type { StoolUrine, Hoken, Ishi, Monshin, Jimu } from "~/types/tabType";

// ログイン情報(基本に患者ID・予約番号を追加)
export interface ExLoginData extends LoginData {
  patientNo: string;
  yyno: string;
}

export interface ExLoginFlag extends LoginFlag {
  patientNo: boolean;
  yyno: boolean;
}

// Firestoreの基本型
export interface HeadItem {
  courseNm: string;
}
export interface PersonalItem {
  birthDate: string;
  kana: string;
  name: string;
  patientId: string;
  sex: string;
  age: number;
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
export interface DispItem {
  info: string;
  label: string;
  status: number;
  param: string;
  visible: boolean;
}
export interface PatientData extends HeadItem, PersonalItem {
  dispCd: DispCdItem[];
  dispBtn: DispItem[];
  physical: string | null;
  pregnant: string | null;
  urine: StoolUrine | null;
  hoken: Hoken | null;
  ishi: Ishi | null;
  jimu: Jimu | null;
  monshin: Monshin | null;
  upd_ymd_hms: string;
  yy_no: number;
  js_cd: string;
  active: string;
  force: string;
  completed: string[] | null;
}

// 画面の検査ボタン型
export interface InvestigationData {
  Status: string;
  InpCd: string;
  Active: string;
  DispName: string;
  DispJpn: string;
}

// 画面の次の検査型
export interface NextItem {
  next: string;
  active: string;
}

// cookieの型
export interface CookieData {
  userId: string;
  patientNo: string;
  today: string;
  lang: LangKey;
  yyno: string;
  docid: string;
}

// これはいらない
export interface ChkJimu {
  StoolVisible: boolean;
  Stool1: string;
  Stool2: string;
  UrineVisible: boolean;
  Urine1: string;
  Biko: string;
}
