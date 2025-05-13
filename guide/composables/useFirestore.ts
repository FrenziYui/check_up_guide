import { doc, getDoc } from "firebase/firestore";
const { MSG } = useConstants();
const { getErrorMessage } = useCommon();

export const useFirestoreDocument = async <T>(collectionName: string, documentId: string) => {
  const { $firebaseDb } = useNuxtApp();
  const documentRef = doc($firebaseDb, collectionName, documentId);

  const data = ref<T | null>(null);
  const error = ref<string | null>(null);

  try {
    const docSnap = await getDoc(documentRef);
    if (docSnap.exists()) {
      data.value = docSnap.data() as T;
    } else {
      error.value = MSG.EA00;
    }
  } catch (err) {
    error.value = getErrorMessage(MSG.E000, (err as Error).message);
  } finally {
  }

  return {
    data,
    error,
  };
};
