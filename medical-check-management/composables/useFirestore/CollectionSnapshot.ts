import { onSnapshot, collection } from "firebase/firestore";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import type { UnwrapRef } from "vue";

const { MSG } = useConstants();
const { getErrorMessage } = useCommon();

export const useFirestoreCollectionSnapshot = <T extends DocumentData>(
  collectionName: string,
  autoUnmount: boolean = true
): {
  data: Ref<UnwrapRef<T[]> | []>;
  error: Ref<string | null>;
  stop: () => void;
} => {
  const { $firebaseDb } = useNuxtApp();

  const data: Ref<UnwrapRef<T[]> | []> = ref([]);
  const error: Ref<string | null> = ref(null);
  const collectionRef = collection($firebaseDb, collectionName);

  const unsubscribe = onSnapshot(
    collectionRef,
    (querySnapshot) => {
      data.value = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...(doc.data() as T),
      })) as UnwrapRef<T[]>;
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
