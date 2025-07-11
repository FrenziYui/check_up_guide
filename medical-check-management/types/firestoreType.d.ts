export interface DataValues {
  dspOrder: number;
  inpCd: string;
  knsnm: string;
  knstm: string;
  name: string;
  idx: number;
  status: string;
  type: string;
}
export interface BaseRowValues {
  id: number;
  patientId: string;
  kana: string;
  sex: string;
  age: string;
  dispCd: DataValues[];
}
export interface RowValues extends BaseRowValues {
  [key: string]: any;
}
