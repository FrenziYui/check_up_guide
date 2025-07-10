import { onAuthStateChanged } from "firebase/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $firebaseAuth } = useNuxtApp();

  const user = await new Promise((resolve) => {
    onAuthStateChanged($firebaseAuth, (user: any) => {
      resolve(user);
    });
  });
  if (user && to.path === "/login") {
    return navigateTo("/");
  } else if (!user && to.path !== "/login") {
    return navigateTo("/login");
  }
});
