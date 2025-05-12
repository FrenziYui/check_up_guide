export const useConstants = () => {
  const TEST_MODE = true;
  const COOKIE_SETTING = { maxAge: 60 * 60 }; //cookieの寿命は一時間
  const MSG = {
    E000: "想定外のエラーが発生しました、再度実行し同様のエラーが出る場合、アプリチームへ連絡してください。",
    E001: "ID又はパスワードが異なります。",
  };

  return {
    TEST_MODE,
    COOKIE_SETTING,
    MSG,
  };
};
