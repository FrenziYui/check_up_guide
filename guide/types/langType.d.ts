// 言語情報
export interface LangStr {
  [key: string]: string;
}

export interface AllLanguage {
  en: LangStr;
  ja: LangStr;
  zh: LangStr;
}

export type LangKey = keyof AllLanguage;
