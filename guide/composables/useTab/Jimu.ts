import type { Jimu } from "~/types/tabType";
import type { PatientData, DispItem } from "~/types/baseType";

export const useTabJimu = () => {
  const dataJimu = ref<Jimu>({
    hknType: "",
    hknContents: "",
    hknCopy: "",
    hknId: "",
    hknReturn: "",
    lemon: "",
    breastCoupon: "",
    uterusCoupon: "",
    ticket: "",
    company: "",
    home: "",
    counter: "",
    tel: "",
    address: "",
    meal: "",
    fill: "",
    corona: "",
    biko: "",
  });

  const setJimu = (data: PatientData) => {
    if (data.jimu) dataJimu.value = data.jimu;
  };

  const updJimu = async (
    today: string,
    docId: string,
    dispBtn: DispItem[],
    onError: (msg: string) => void,
    onSuccess?: () => void
  ) => {
    const updStatus = getStatus(dataJimu.value);
    const updInfo = getInfo(dataJimu.value);

    const updatedDispBtn = dispBtn.map((item) =>
      item.param === "checkjim" ? { ...item, status: updStatus, info: updInfo } : item
    );

    const { error, setDocument } = useFirestoreDocumentUpdate<PatientData>();
    const success = await setDocument(
      today,
      docId,
      {
        jimu: dataJimu.value,
        dispBtn: updatedDispBtn,
      },
      true
    );

    if (!success) onError(error.value ?? "更新に失敗しました");
    else onSuccess?.();
  };

  const getStatus = (data: Jimu): number => {
    const { biko, ...others } = data;
    const allFilled = Object.values(others).every((value) => value !== "");
    return allFilled ? 9 : 0;
  };
  const getInfo = (data: Jimu): string => {
    return data.biko == "" ? "0" : "1";
  };

  return {
    dataJimu,
    setJimu,
    updJimu,
  };
};
