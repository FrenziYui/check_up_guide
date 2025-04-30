import type { PatientChk, DocumentDetail } from "@/types/apitype.ts";

// 患者IDの存在チェック
export const useCheck = async (
  val: string
): Promise<{ data: Ref<PatientChk | null>; error: Ref<string | null> }> => {
  const data = ref<PatientChk | null>(null);
  const error = ref<string | null>(null);

  try {
    data.value = await $fetch("/check", {
      baseURL: useRuntimeConfig().public.apiBaseUrl,
      method: "POST",
      body: { patientNo: val },
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = "An unknown error occurred";
    }
  }

  return { data, error };
};

// documentを作成する
export const useDocumentAdd = async (
  val: string,
  patientNo: string
): Promise<{ data: Ref<DocumentDetail | null>; error: Ref<string | null> }> => {
  const data = ref<DocumentDetail | null>(null);
  const error = ref<string | null>(null);

  try {
    data.value = await $fetch("/document", {
      baseURL: useRuntimeConfig().public.apiBaseUrl,
      method: "POST",
      body: { patientNo: patientNo, email: val },
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = "An unknown error occurred";
    }
  }

  return { data, error };
};
