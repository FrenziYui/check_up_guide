export interface ToastProps {
  message: string;
  modelValue?: boolean;
  type?: "error" | "warning" | "info" | "success";
  duration?: number;
  vPos?: "top" | "middle" | "bottom";
  hPos?: "start" | "center" | "end";
}
