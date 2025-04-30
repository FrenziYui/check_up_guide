export interface PatientData {
  name?: string;
  kana?: string;
  birthDate?: string;
  patientId?: string;
  courseNm?: string;
  memo?: string;
  info?: Array<string>;
  suspend?: string;
  dispCd: Array<{
    inpCd: string;
    status: string;
  }>;
}
