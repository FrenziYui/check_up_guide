import { doc, onSnapshot } from "firebase/firestore";
import type { UnwrapRef } from "vue";

const { MSG } = useConstants();
const { getErrorMessage } = useCommon();

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
        error.value = getErrorMessage(MSG.E005, `Collection:${collectionName} document:${documentId}`);
      }
    },
    (err) => {
      error.value = getErrorMessage(MSG.E001, err.message);
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
