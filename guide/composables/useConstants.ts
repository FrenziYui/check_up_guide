export const useConstants = () => {
  const TEST_MODE = true;
  const COOKIE_SETTING = { maxAge: 60 * 60 }; //cookieの寿命は一時間
  const PATIENT_LENGTH = 8; //患者IDの桁数
  //E0xx ・・・標準エラーメッセージ
  const BASE_URL = "https://storage.googleapis.com/storage/v1/b/";
  const BASE_URL2 = TEST_MODE
    ? "http://localhost:8080/"
    : "https://medical-check-server-89056146929.asia-northeast2.run.app";
  const AQXIOS_TIMEOUT = 5000;

  const MSG = {
    E000: "想定外のエラーが発生しました、再度実行し同様のエラーが出る場合、アプリチームへ連絡してください。{{DETAILS}}",
    E001: "ID又はパスワードが異なります。",
    E002: "データベースよりデータが取得できませんでした、再度実行し同様のエラーが出る場合、アプリチームへ連絡してください。",
    E003: "パスワードが異なります。",
    EA00: "該当患者IDで本日予約はありません。",
    EA01: "患者データが取得出来ませんでした。再度実行し同様のエラーが出る場合、アプリチームへ連絡してください。",
    EA02: "言語ファイルの取得が出来ませんでした。",
    EA03: "指定されたドキュメントは存在しません。",
    EA04: "同一患者IDで複数件の予約があります。予約番号を入力してください。",
  };

  return {
    BASE_URL,
    BASE_URL2,
    TEST_MODE,
    COOKIE_SETTING,
    PATIENT_LENGTH,
    MSG,
    AQXIOS_TIMEOUT,
  };
};
