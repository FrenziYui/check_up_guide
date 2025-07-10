export const useConstants = () => {
  const TEST_MODE = false;

  const APP_TITLE = "人間ドッグ経路案内システム";
  const BASE_URL = TEST_MODE ? "http://localhost:8080/" : "https://chklist-server-672872025209.asia-northeast2.run.app";
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
  } as const;
  // このシステム独自メッセージ
  const EXTMSG = {} as const;
  const MSG = {
    ...BASEMSG,
    ...EXTMSG,
  } as const;

  return {
    TEST_MODE,
    BASE_URL,
    MSG,
    COOKIE_SETTING,
    APP_TITLE,
    ADD_MAIL_ADDRESS,
  };
};
