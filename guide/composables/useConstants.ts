export const useConstants = () => {
  const TEST_MODE = false;
  const COOKIE_SETTING = { maxAge: 60 * 60 }; //cookieの寿命は一時間

  return {
    TEST_MODE,
    COOKIE_SETTING,
  };
};
