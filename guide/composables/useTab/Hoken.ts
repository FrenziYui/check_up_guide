import type { Hoken } from "~/types/tabType";
import type { PatientData, DispItem } from "~/types/baseType";

export const useTabHoken = () => {
  const dataStoolUrine = ref<Hoken>({
    question: false,
    meal: false,
    Biko: "",
  });

  const setStoolUrine = (data: PatientData) => {
    if (data.hoken) dataStoolUrine.value = data.urine;
    const urineItem = data.dispCd.find((item) => item.inpCd === "i9101");
    const stoolItem = data.dispCd.find((item) => item.inpCd === "i9102");

    if (urineItem) dataStoolUrine.value.UrineVisible = urineItem.status !== "X";
    if (stoolItem) dataStoolUrine.value.StoolVisible = stoolItem.status !== "X";
  };

  const updStoolUrine = async (
    today: string,
    docId: string,
    dispBtn: DispItem[],
    onError: (msg: string) => void,
    onSuccess?: () => void
  ) => {
    const updStatus = getStatus(dataStoolUrine.value);
    const updInfo = getInfo(dataStoolUrine.value);
    const updatedDispBtn = dispBtn.map((item) =>
      item.param === "urine" ? { ...item, status: updStatus, info: updInfo } : item
    );

    const { error, setDocument } = useFirestoreDocumentUpdate<PatientData>();
    const success = await setDocument(
      today,
      docId,
      {
        urine: dataStoolUrine.value,
        dispBtn: updatedDispBtn,
      },
      true
    );

    if (!success) onError(error.value ?? "更新に失敗しました");
    else onSuccess?.();
  };

  const getStatus = (data: StoolUrine): number => {
    const stoolValid = !data.StoolVisible || (data.Stool1 !== "" && data.Stool2 !== "");
    const urineValid = !data.UrineVisible || data.Urine1 !== "";

    return stoolValid && urineValid ? 9 : 0;
  };
  const getInfo = (data: StoolUrine): string => {
    return data.Biko == "" ? "0" : "1";
  };

  return {
    dataStoolUrine,
    setStoolUrine,
    updStoolUrine,
  };
};
