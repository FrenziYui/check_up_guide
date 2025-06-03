import { doc, getDoc, onSnapshot } from "firebase/firestore";
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
  const documentRef = doc($firebaseDb, collectionName, documentId);

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
