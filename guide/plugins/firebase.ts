import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
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
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const firebaseAuth = getAuth(app);
    const firebaseDb = getFirestore(app);
    const firebaseStorage = getStorage(app);

    return {
      provide: {
        firebaseAuth,
        firebaseDb,
        firebaseStorage,
      },
    };
  } catch (error) {
    console.error("Firebase 初期化エラー:", error);
    return;
  }
});
