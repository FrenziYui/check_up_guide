import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import type { User } from "firebase/auth";
const { TEST_MODE } = useConstants();

let firebaseConfig = {
  apiKey: "AIzaSyBUSYshSB4zFaWbQuQoCkiT47H4IHy2Wno",
  authDomain: "medical-check-up-guide.firebaseapp.com",
  projectId: "medical-check-up-guide",
  storageBucket: "medical-check-up-guide.firebasestorage.app",
  messagingSenderId: "89056146929",
  appId: "1:89056146929:web:ce725adf6298f2c8018050",
};
// 現在テストモードでの差は無し
if (!TEST_MODE) {
  firebaseConfig = {
    apiKey: "AIzaSyBUSYshSB4zFaWbQuQoCkiT47H4IHy2Wno",
    authDomain: "medical-check-up-guide.firebaseapp.com",
    projectId: "medical-check-up-guide",
    storageBucket: "medical-check-up-guide.firebasestorage.app",
    messagingSenderId: "89056146929",
    appId: "1:89056146929:web:ce725adf6298f2c8018050",
  };
}
export default defineNuxtPlugin(() => {
  try {
    // appの二重起動防止
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
    const currentUser = ref<User | null>(null);

    onAuthStateChanged(auth, (user) => {
      currentUser.value = user;
    });

    return {
      provide: {
        auth,
        db,
        storage,
        user: currentUser,
      },
    };
  } catch (error) {
    console.error("Firebase 初期化エラー:", error);
  }
});
