import { doc, getDoc } from "firebase/firestore";
import type { DocumentReference } from "firebase/firestore";
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
      error.value = getErrorMessage(MSG.E005, `Collection:${collectionName} document:${documentId}`);
    }
  } catch (err) {
    error.value = getErrorMessage(MSG.E001, (err as Error).message);
  }

  return {
    data,
    error,
  };
};
