export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $user } = useNuxtApp();
  if ($user.value === null) {
    return;
  }
  const user = $user.value;
  // ログイン状態の確認
  if (user && to.path === "/login") {
    return navigateTo("/");
  } else if (!user && to.path !== "/login") {
    return navigateTo("/login");
  }
});
