import type { Monshin } from "~/types/tabType";
import type { PatientData, DispItem } from "~/types/baseType";

export const useTabMonshin = () => {
  const dataMonshin = ref<Monshin>({
    base: "",
    gastroscope: "",
    fluoroscopy: "",
    mri: "",
    ladies: "",
    petct: "",
    colon: "",
    biko: "",
  });

  const setMonshin = (data: PatientData) => {
    if (data.monshin) dataMonshin.value = data.monshin;
  };

  const updMonshin = async (
    today: string,
    docId: string,
    dispBtn: DispItem[],
    onError: (msg: string) => void,
    onSuccess?: () => void
  ) => {
    const updStatus = getStatus(dataMonshin.value);
    const updInfo = getInfo(dataMonshin.value);

    const updatedDispBtn = dispBtn.map((item) =>
      item.param === "checkmon" ? { ...item, status: updStatus, info: updInfo } : item
    );

    const { error, setDocument } = useFirestoreDocumentUpdate<PatientData>();
    const success = await setDocument(
      today,
      docId,
      {
        monshin: dataMonshin.value,
        dispBtn: updatedDispBtn,
      },
      true
    );

    if (!success) onError(error.value ?? "更新に失敗しました");
    else onSuccess?.();
  };

  const getStatus = (data: Monshin): number => {
    const { biko, ...others } = data;
    const allFilled = Object.values(others).every((value) => value !== "");
    return allFilled ? 9 : 0;
  };
  const getInfo = (data: Monshin): string => {
    return data.biko == "" ? "0" : "1";
  };

  return {
    dataMonshin,
    setMonshin,
    updMonshin,
  };
};
