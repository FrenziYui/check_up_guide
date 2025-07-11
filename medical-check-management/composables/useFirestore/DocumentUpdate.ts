import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { WithFieldValue, DocumentReference } from "firebase/firestore";

const { MSG } = useConstants();
const { getErrorMessage } = useCommon();

export const useFirestoreDocumentUpdate = <T>() => {
  const { $firebaseDb } = useNuxtApp();

  const error = ref<string | null>(null);

  //  ドキュメントを上書きまたはマージ更新
  const setDocument = async (
    collectionName: string,
    documentId: string,
    data: Partial<WithFieldValue<T>>,
    merge: boolean = false
  ): Promise<boolean> => {
    error.value = null;
    try {
      const documentRef = doc($firebaseDb, collectionName, documentId) as DocumentReference<T>;
      const docSnap = await getDoc(documentRef);
      if (!docSnap.exists()) {
        error.value = getErrorMessage(MSG.E005, `Collection:${collectionName} document:${documentId}`);
        return false;
      }

      await setDoc(documentRef, data as WithFieldValue<T>, { merge });
      return true;
    } catch (err) {
      error.value = getErrorMessage(MSG.E001, (err as Error).message);
      return false;
    }
  };

  // ドキュメントの一部更新
  const updateDocument = async (collectionName: string, documentId: string, data: Partial<T>): Promise<boolean> => {
    error.value = null;
    try {
      const documentRef = doc($firebaseDb, collectionName, documentId);
      await updateDoc(documentRef, data);
      return true;
    } catch (err) {
      error.value = getErrorMessage(MSG.E001, (err as Error).message);
      return false;
    }
  };

  return {
    error,
    setDocument,
    updateDocument,
  };
};
