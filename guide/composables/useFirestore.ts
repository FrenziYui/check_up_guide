import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import type { WithFieldValue, DocumentReference } from "firebase/firestore";
import type { UnwrapRef } from "vue";

const { MSG } = useConstants();
const { getErrorMessage } = useCommon();

export const useFirestoreDocument = async <T>(
  collectionName: string,
  documentId: string
): Promise<{
  data: Ref<UnwrapRef<T> | null>;
  error: Ref<string | null>;
}> => {
  const { $firebaseDb } = useNuxtApp();
  const documentRef = doc($firebaseDb, collectionName, documentId) as DocumentReference<T>;

  const data: Ref<UnwrapRef<T> | null> = ref(null);
  const error = ref<string | null>(null);

  try {
    const docSnap = await getDoc(documentRef);
    if (docSnap.exists()) {
      data.value = docSnap.data() as UnwrapRef<T>;
    } else {
      error.value = MSG.EA00;
    }
  } catch (err) {
    error.value = getErrorMessage(MSG.E000, (err as Error).message);
  }

  return {
    data,
    error,
  };
};

export const useFirestoreSnapshot = <T>(
  collectionName: string,
  documentId: string,
  autoUnmount: boolean = true
): {
  data: Ref<UnwrapRef<T> | null>;
  error: Ref<string | null>;
  stop: () => void;
} => {
  const { $firebaseDb } = useNuxtApp();

  const data: Ref<UnwrapRef<T> | null> = ref(null);
  const error: Ref<string | null> = ref(null);

  const documentRef = doc($firebaseDb, collectionName, documentId);
  const unsubscribe = onSnapshot(
    documentRef,
    (docSnap) => {
      if (docSnap.exists()) {
        data.value = docSnap.data() as UnwrapRef<T>;
      } else {
        data.value = null;
        error.value = MSG.E002;
      }
    },
    (err) => {
      error.value = getErrorMessage(MSG.E000, err.message);
    }
  );

  if (autoUnmount) {
    onBeforeUnmount(() => {
      unsubscribe();
    });
  }

  return {
    data,
    error,
    stop: unsubscribe,
  };
};

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
        error.value = MSG.EA03;
        return false;
      }

      await setDoc(documentRef, data as WithFieldValue<T>, { merge });
      return true;
    } catch (err) {
      error.value = getErrorMessage(MSG.E000, (err as Error).message);
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
      error.value = getErrorMessage(MSG.E000, (err as Error).message);
      return false;
    }
  };

  return {
    error,
    setDocument,
    updateDocument,
  };
};
