export interface DataValues {
  dspOrder: number;
  idx: number;
  inpCd: string;
  name: string;
  status: string;
  order: number | null;
  time: string | undefined | null;
}
export interface BaseRowValues {
  id: number;
  kancd: string;
  name: string;
  date: string;
  sex: string;
  age: string;
  data: DataValues[];
}
export interface RowValues extends BaseRowValues {
  [key: string]: any;
}
