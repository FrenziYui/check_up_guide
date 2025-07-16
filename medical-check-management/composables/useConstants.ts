export const useConstants = () => {
  const TEST_MODE = false;

  const APP_TITLE = "人間ドッグ経路案内システム";
  const BASE_URL = TEST_MODE
    ? "http://localhost:8080/"
    : "https://medical-check-server-89056146929.asia-northeast2.run.app";
  const COOKIE_SETTING = { maxAge: 60 * 60 * 20 }; //cookieの寿命は20時間
  const ADD_MAIL_ADDRESS = "@holonicsystem.com";
  // 基本メッセージ
  const BASEMSG = {
    E000: "想定外のエラーが発生しました、再度実行し同様のエラーが出る場合、アプリチームへ連絡してください。",
    E001: "想定外のエラーが発生しました、再度実行し同様のエラーが出る場合、アプリチームへ連絡してください。{{DETAILS}}",
    E002: "データが選択されていません。データを選択後再実行してください。",
    E003: "ID又はパスワードが異なります。",
    E004: "患者IDが正しくありません。",
    E005: "指定されたドキュメントが存在しません。{{DETAILS}}",
    E006: "ファイルが選択されていません。",
  } as const;
  // このシステム独自メッセージ
  const EXTMSG = {} as const;
  const MSG = {
    ...BASEMSG,
    ...EXTMSG,
  } as const;

  // このindexは画面に表示する順番ではなくfirestoreの配列の順番
  enum DATA_INDEX {
    身体計測 = 0,
    医師診察,
    視力検査,
    心電図,
    超音波検査,
    MRI,
    CT検査,
    X線検査,
    内視鏡検査,
    婦人科,
    胃透視,
    採血,
    PETCT,
    肺機能,
  }
  const COL_INFO = [
    { name: "physical", title: "身体計測", width: 70 },
    { name: "medical", title: "医師診察", width: 70 },
    { name: "eye", title: "視力検査", width: 70 },
    { name: "ecg", title: "心電図", width: 70 },
    { name: "ultrasound", title: "超音波", width: 110 },
    { name: "mri", title: "MRI/MRA", width: 150 },
    { name: "ct", title: "CT", width: 110 },
    { name: "xray", title: "X線", width: 70 },
    { name: "endoscopy", title: "内視鏡", width: 150 },
    { name: "gynecology", title: "婦人科", width: 70 },
    { name: "fluoroscopy", title: "胃透視", width: 110 },
    { name: "blood", title: "採血", width: 70 },
    { name: "petct", title: "PETCT", width: 110 },
    { name: "pulmonary", title: "肺機能", width: 70 },
  ];
  const NOT_INSPECTED = "0";
  const STATUS_ICONS: { [key: string]: string } = {
    0: "⭕" /*検査前 */,
    "3": "検査中" /*検査中 */,
    "1": "✅" /*検査終了 */,
    X: "➖" /*対象外 */,
    "2": "保留" /*保留 */,
    "9": "中止" /*中止 */,
  };
  return {
    TEST_MODE,
    BASE_URL,
    MSG,
    COOKIE_SETTING,
    APP_TITLE,
    ADD_MAIL_ADDRESS,
    DATA_INDEX,
    COL_INFO,
    NOT_INSPECTED,
    STATUS_ICONS,
  };
};
