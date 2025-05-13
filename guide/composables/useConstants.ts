export const useConstants = () => {
  const TEST_MODE = true;
  const COOKIE_SETTING = { maxAge: 60 * 60 }; //cookieの寿命は一時間
  //E0xx ・・・標準エラーメッセージ
  const MSG = {
    E000: "想定外のエラーが発生しました、再度実行し同様のエラーが出る場合、アプリチームへ連絡してください。{{DETAILS}}",
    E001: "ID又はパスワードが異なります。",
    EA00: "該当患者IDで本日予約はありません。",
  };

  return {
    TEST_MODE,
    COOKIE_SETTING,
    MSG,
  };
};
