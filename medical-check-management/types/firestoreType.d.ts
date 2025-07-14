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
export interface OrderValues {
  inpCd: string;
  name: string;
  order: number;
}
export interface BaseRowValues {
  id: number;
  patientId: string;
  kana: string;
  sex: string;
  age: string;
  dispCd: DataValues[];
  dispOrder: OrderValues[];
}
export interface RowValues extends BaseRowValues {
  [key: string]: any;
}
