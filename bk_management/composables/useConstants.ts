export const useConstants = () => {
  const DATA_INDEX = {
    身体計測: 0,
    医師診察: 1,
    視力検査: 2,
    心電図: 3,
    超音波検査: 4,
    MRI: 5,
    CT検査: 6,
    X線検査: 7,
    内視鏡検査: 8,
    採血: 9,
    肺機能: 10,
  };
  const COL_INFO = [
    { name: "physical", title: "身体計測" },
    { name: "medical", title: "医師診察" },
    { name: "eye", title: "視力検査" },
    { name: "ecg", title: "心電図" },
    { name: "ultrasound", title: "超音波" },
    { name: "mri", title: "MRI/MRA" },
    { name: "ct", title: "CT" },
    { name: "xray", title: "X線" },
    { name: "endoscopy", title: "内視鏡" },
    { name: "blood", title: "採血" },
    { name: "pulmonary", title: "肺機能" },
  ];
  const NOT_INSPECTED = "1";
  const STATUS_ICONS: { [key: string]: string } = {
    "1": "未",
    "2": "✅",
    "8": "✔",
    "9": "➖",
  };

  return {
    DATA_INDEX,
    NOT_INSPECTED,
    STATUS_ICONS,
    COL_INFO,
  };
};
