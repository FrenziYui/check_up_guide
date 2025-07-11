import { collection, query, where, getDocs } from "firebase/firestore";
import type { CollectionReference, WhereFilterOp } from "firebase/firestore";

const { MSG } = useConstants();
const { getErrorMessage } = useCommon();

export const useFirestoreQueryByFields = async <T>(
  collectionName: string,
  conditions: Array<{ field: string; op: WhereFilterOp; value: any }>
): Promise<{
  dataList: Ref<T[]>;
  docIds: Ref<string[]>;
  error: Ref<string | null>;
}> => {
  const { $firebaseDb } = useNuxtApp();
  const dataList = ref<any[]>([]);

  const docIds = ref<string[]>([]);
  const error = ref<string | null>(null);

  try {
    const colRef = collection($firebaseDb, collectionName) as CollectionReference<T>;

    // 複数の where を追加する
    const q = query(colRef, ...conditions.map((cond) => where(cond.field, cond.op, cond.value)));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      dataList.value.push(doc.data() as unknown as T);
      docIds.value.push(doc.id);
    });
  } catch (err) {
    error.value = getErrorMessage(MSG.E001, (err as Error).message);
  }

  return { dataList, docIds, error };
};
