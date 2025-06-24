export const useConstants = () => {
  const TEST_MODE = true;
  const COOKIE_SETTING = { maxAge: 60 * 60 }; //cookieの寿命は一時間
  const PATIENT_LENGTH = 8; //患者IDの桁数
  //E0xx ・・・標準エラーメッセージ
  const MSG = {
    E000: "想定外のエラーが発生しました、再度実行し同様のエラーが出る場合、アプリチームへ連絡してください。{{DETAILS}}",
    E001: "ID又はパスワードが異なります。",
    E002: "データベースよりデータが取得できませんでした、再度実行し同様のエラーが出る場合、アプリチームへ連絡してください。",
    E003: "パスワードが異なります。",
    EA00: "該当患者IDで本日予約はありません。",
    EA01: "患者データが取得出来ませんでした。再度実行し同様のエラーが出る場合、アプリチームへ連絡してください。",
    EA02: "言語ファイルの取得が出来ませんでした。",
    EA03: "指定されたドキュメントは存在しません。",
  };

  return {
    TEST_MODE,
    COOKIE_SETTING,
    PATIENT_LENGTH,
    MSG,
  };
};
