import type { Ishi } from "~/types/tabType";
import type { PatientData, DispItem } from "~/types/baseType";

export const useTabIshi = () => {
  const dataIshi = ref<Ishi>({
    auscultation: "",
    intermediate: "",
    general: "",
    dJudgment: "",
    biko: "",
  });

  const setIshi = (data: PatientData) => {
    if (data.ishi) dataIshi.value = data.ishi;
  };

  const updIshi = async (
    today: string,
    docId: string,
    dispBtn: DispItem[],
    onError: (msg: string) => void,
    onSuccess?: () => void
  ) => {
    const updStatus = getStatus(dataIshi.value);
    const updInfo = getInfo(dataIshi.value);

    const updatedDispBtn = dispBtn.map((item) =>
      item.param === "checkish" ? { ...item, status: updStatus, info: updInfo } : item
    );

    const { error, setDocument } = useFirestoreDocumentUpdate<PatientData>();
    const success = await setDocument(
      today,
      docId,
      {
        ishi: dataIshi.value,
        dispBtn: updatedDispBtn,
      },
      true
    );

    if (!success) onError(error.value ?? "更新に失敗しました");
    else onSuccess?.();
  };

  const getStatus = (data: Ishi): number => {
    const { biko, ...others } = data;
    const allFilled = Object.values(others).every((value) => value !== "");
    return allFilled ? 9 : 0;
  };
  const getInfo = (data: Ishi): string => {
    return data.biko == "" ? "0" : "1";
  };

  return {
    dataIshi,
    setIshi,
    updIshi,
  };
};
