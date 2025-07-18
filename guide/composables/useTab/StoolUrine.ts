import type { StoolUrine } from "~/types/tabType";
import type { PatientData, DispItem } from "~/types/baseType";

export const useTabStoolUrine = () => {
  const dataStoolUrine = ref<StoolUrine>({
    stoolVisible: false,
    stool1: "",
    stool2: "",
    urineVisible: false,
    urine1: "",
    biko: "",
  });

  const setStoolUrine = (data: PatientData) => {
    if (data.urine) dataStoolUrine.value = data.urine;
    const urineItem = data.dispCd.find((item) => item.inpCd === "i9101");
    const stoolItem = data.dispCd.find((item) => item.inpCd === "i9102");

    if (urineItem) dataStoolUrine.value.urineVisible = urineItem.status !== "X";
    if (stoolItem) dataStoolUrine.value.stoolVisible = stoolItem.status !== "X";
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
    const stoolValid = !data.stoolVisible || (data.stool1 !== "" && data.stool2 !== "");
    const urineValid = !data.urineVisible || data.urine1 !== "";

    return stoolValid && urineValid ? 9 : 0;
  };
  const getInfo = (data: StoolUrine): string => {
    return data.biko == "" ? "0" : "1";
  };

  return {
    dataStoolUrine,
    setStoolUrine,
    updStoolUrine,
  };
};
