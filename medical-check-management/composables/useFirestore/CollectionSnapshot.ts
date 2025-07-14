import { onSnapshot, collection, query, where, orderBy, type QueryConstraint } from "firebase/firestore";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import type { UnwrapRef } from "vue";

const { MSG } = useConstants();
const { getErrorMessage } = useCommon();

/**
 * FirestoreコレクションにonSnapshotで監視し、条件付きでデータを取得するcomposable
 * @param collectionName Firestoreのコレクション名
 * @param queryConstraints Firestoreのクエリ制約（where, orderByなど）
 * @param autoUnmount コンポーネントアンマウント時に自動で監視解除するか
 */

export const useFirestoreCollectionSnapshot = <T extends DocumentData>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = [],
  autoUnmount: boolean = true
): {
  data: Ref<UnwrapRef<T[]> | []>;
  error: Ref<string | null>;
  stop: () => void;
} => {
  const { $firebaseDb } = useNuxtApp();

  const data: Ref<UnwrapRef<T[]> | []> = ref([]);
  const error: Ref<string | null> = ref(null);

  const baseRef = collection($firebaseDb, collectionName);
  const q = query(baseRef, ...queryConstraints); // クエリ条件を適用

  const unsubscribe = onSnapshot(
    q,
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
