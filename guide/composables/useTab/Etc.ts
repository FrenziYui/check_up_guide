import type { PersonalInfo } from "~/types/tabType";
import type { PatientData, DispItem } from "~/types/baseType";

export const useTabEtc = () => {
  const dataEtc = ref<PersonalInfo>({
    biko: "",
  });
  const dispInfo = ref<{ allergy: string; physical: string; pregnancy: string }>({
    allergy: "",
    physical: "",
    pregnancy: "",
  });

  const setEtc = (data: PatientData) => {
    if (data.etc) dataEtc.value = data.etc;
    if (data.physical) dispInfo.value.physical = data.physical;
    if (data.allergy) dispInfo.value.allergy = data.allergy;
    if (data.etcInfo.pregnancy) dispInfo.value.pregnancy = data.etcInfo.pregnancy;
  };

  const updEtc = async (
    today: string,
    docId: string,
    dispBtn: DispItem[],
    onError: (msg: string) => void,
    onSuccess?: () => void
  ) => {
    const updInfo = getInfo(dataEtc.value);

    const updatedDispBtn = dispBtn.map((item) => (item.param === "other" ? { ...item, info: updInfo } : item));

    const { error, setDocument } = useFirestoreDocumentUpdate<PatientData>();
    const success = await setDocument(
      today,
      docId,
      {
        etc: dataEtc.value,
        dispBtn: updatedDispBtn,
      },
      true
    );

    if (!success) onError(error.value ?? "更新に失敗しました");
    else onSuccess?.();
  };

  const getInfo = (data: PersonalInfo): string => {
    if (
      (data.biko?.trim() ?? "") !== "" ||
      (dispInfo.value.pregnancy?.trim() ?? "") !== "" ||
      (dispInfo.value.allergy?.trim() ?? "") !== "" ||
      (dispInfo.value.physical?.trim() ?? "") !== ""
    ) {
      return "1";
    }
    return "0";
  };

  return {
    dataEtc,
    setEtc,
    updEtc,
  };
};
