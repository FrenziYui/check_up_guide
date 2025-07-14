// 定数定義
export const TOAST_TYPES = {
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  SUCCESS: "success",
} as const;

export const TOAST_V_POS = {
  TOP: "top",
  MIDDLE: "middle",
  BOTTOM: "bottom",
} as const;

export const TOAST_H_POS = {
  START: "start",
  CENTER: "center",
  END: "end",
} as const;

// 型定義
export interface ToastProps {
  message: string;
  modelValue?: boolean;
  type?: (typeof TOAST_TYPES)[keyof typeof TOAST_TYPES];
  duration?: number;
  vPos?: (typeof TOAST_V_POS)[keyof typeof TOAST_V_POS];
  hPos?: (typeof TOAST_H_POS)[keyof typeof TOAST_H_POS];
}
