import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
  if (user && to.path === "/login") {
    return navigateTo("/");
  } else if (!user && to.path !== "/login") {
    return navigateTo("/login");
  }
});
