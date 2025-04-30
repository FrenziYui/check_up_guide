import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUSYshSB4zFaWbQuQoCkiT47H4IHy2Wno",
  authDomain: "medical-check-up-guide.firebaseapp.com",
  projectId: "medical-check-up-guide",
  storageBucket: "medical-check-up-guide.firebasestorage.app",
  messagingSenderId: "89056146929",
  appId: "1:89056146929:web:ce725adf6298f2c8018050",
};

export default defineNuxtPlugin(() => {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    return {
      provide: {
        auth,
        db,
      },
    };
  } catch (error) {
    console.error("Firebase 初期化エラー:", error);
  }
});
