export interface MemoData {
  memo: string;
}
export interface DispCdItem {
  active: boolean;
  status: string;
  inpCd: string;
}
export interface RefDispData {
  patientId: string;
  patientName: string;
  patientKana: string;
  birthDate: string;
  courseNm: string;
  memo: string;
  info: string[];
  suspend: string;
  next: string;
  dispCd: DispCdItem[];
}
export interface InvestigationData {
  Status: string;
  InpCd: string;
  Active: boolean;
  DispName: string;
}
export interface MenuData {
  Status: string;
  MenuCd: string;
  DispName: string;
}
