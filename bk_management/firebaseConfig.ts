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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
