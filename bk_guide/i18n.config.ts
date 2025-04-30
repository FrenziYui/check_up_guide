// これは日本人向けのメッセージなのでjaの検査項目(先頭i)の値をコピーして先頭をzにする
const commonMessages = {
  z: "",
  i: "",
  z0101: "身体計測", //身体計測
  z0111: "医師診察", //医師診察
  z0121: "視力検査", //視力検査
  z0131: "心電図", //心電図
  z0141: "超音波検査", //超音波検査
  z0151: "MRI/MRA検査", //MRI/MRA検査
  z0161: "CT検査", //CT検査
  z0171: "X線検査", //X線検査
  z0181: "内視鏡検査", //内視鏡検査
  z0191: "採血", //採血
  z0201: "肺機能", //肺機能
};

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "ja",
  messages: {
    en: {
      i0101: "physical examination", //身体計測
      i0111: "medical examination", //医師診察
      i0121: "eye test", //視力検査
      i0131: "ECG", //心電図
      i0141: "ultrasound examination", //超音波検査
      i0151: "MRI/MRA Examination", //MRI/MRA検査
      i0161: "CT scan", //CT検査
      i0171: "X-ray examination", //X線検査
      i0181: "endoscopy", //内視鏡検査
      i0191: "blood collection", //採血
      i0201: "pulmonary function", //肺機能
      t0000: "Basic Human Health Checkup Course (Gastroscopy Course)", //コース名仮
      t0100: "Next, ", //次は
      t0101: "Blood pressure test results are above threshold..", //血圧の検査結果が閾値を超えています。
      t0102: "Please contact your local staff.", //お近くの職員にご連絡ください。
      ...commonMessages,
    },
    ja: {
      i0101: "身体計測", //身体計測
      i0111: "医師診察", //医師診察
      i0121: "視力検査", //視力検査
      i0131: "心電図", //心電図
      i0141: "超音波検査", //超音波検査
      i0151: "MRI/MRA検査", //MRI/MRA検査
      i0161: "CT検査", //CT検査
      i0171: "X線検査", //X線検査
      i0181: "内視鏡検査", //内視鏡検査
      i0191: "採血", //採血
      i0201: "肺機能", //肺機能
      t0000: "1日ドック（被扶養配偶者・法人A）", //コース名仮
      t0100: "次は", //次は
      t0101: "血圧の検査結果が閾値を超えています。", //血圧の検査結果が閾値を超えています。
      t0102: "お近くの職員にご連絡ください。", //お近くの職員にご連絡ください。
      ...commonMessages,
    },
    zh: {
      i0101: "体格检查", //身体計測
      i0111: "体检", //医師診察
      i0121: "验光", //視力検査
      i0131: "心电图", //心電図
      i0141: "超声波检查", //超音波検査
      i0151: "MRI/MRA 检查", //MRI/MRA検査
      i0161: "CT 扫描", //CT検査
      i0171: "X 射线检查", //X線検査
      i0181: "内窥镜检查", //内視鏡検査
      i0191: "抽血", //採血
      i0201: "肺功能", //肺機能
      t0000: "基本人体健康检查课程（胃镜检查课程）", //コース名仮
      t0100: "下一步是", //次は
      t0101: "血压检测结果高于临界值。", //血圧の検査結果が閾値を超えています。
      t0102: "请联系您当地的官员。", //お近くの職員にご連絡ください。
      ...commonMessages,
    },
  },
}));
