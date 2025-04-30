<template>
  <div class="bg-base-100 w-full max-w-3xl mx-4 p-8 rounded-lg shadow-lg">
    <div class="text-3xl font-bold text-blue-500">検査順変更</div>
    <div class="divider divider-neutral"></div>
    <!-- 入力フォーム -->
    <form @submit.prevent="submitForm">
      <div class="form-control">
        <div class="hello">
          <Draggable
            v-model="activeData"
            group="people"
            item-key="id"
            handle=".handle"
          >
            <template #item="{ element, index }">
              <span class="handle">
                <SwapBtn
                  :inData="{
                    val: element.name,
                    index: (index + 1).toString() + '.',
                  }"
                />
              </span>
            </template>
          </Draggable>
          <div v-for="(item, index) in deactiveData" :key="item.idx">
            <SwapBtn :inData="{ val: item.name, index: '' }" />
          </div>
        </div>

        <!-- ボタン -->
        <div class="modal-action mt-6 flex justify-end space-x-2">
          <button type="submit" :disabled="isDisabled" class="btn btn-success">
            ＯＫ
          </button>
          <button @click="close" type="button" class="btn btn-primary">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import Draggable from "vuedraggable";
import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import type { DataValues, RowValues } from "../types/basetype";

const props = defineProps<{
  currentData: RowValues | undefined;
  currentDate: string | undefined;
}>();

const targetData = ref<DataValues[]>([]);
const activeData = ref<DataValues[]>([]);
const deactiveData = ref<DataValues[]>([]);
const isDisabled = ref(false);

const emit = defineEmits(["update:isMenu"]);
const close = () => {
  emit("update:isMenu", false);
};

onMounted(() => {
  if (props.currentData) {
    targetData.value = JSON.parse(JSON.stringify(props.currentData.data));
    sortData(targetData.value);
  }
});

const statusPriority: Record<string, number> = {
  "1": 1,
  "2": 2,
  "8": 3,
  "9": 4, // 最も低い優先順位
};

const submitForm = () => {
  if (props.currentData) {
    for (const index in activeData.value) {
      props.currentData.data[activeData.value[index].idx].order =
        parseInt(index, 10) + 1;
    }
    if (props.currentDate) {
      updateDocument(
        props.currentDate,
        props.currentData.kancd,
        props.currentData.data
      );
    }
  }
  close();
};

const updateDocument = async (
  collectionName: string,
  documentId: string,
  val: DataValues[]
): Promise<void> => {
  const docRef = doc(db, collectionName, documentId);
  try {
    await updateDoc(docRef, { data: val });
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

const sortData = (currentData: DataValues[]) => {
  if (currentData) {
    currentData.sort((a, b) => {
      const statusA = statusPriority[a.status] || Number.MAX_SAFE_INTEGER;
      const statusB = statusPriority[b.status] || Number.MAX_SAFE_INTEGER;

      if (statusA === statusB) {
        // statusが同じ場合、orderで比較
        return (a.order ?? 0) - (b.order ?? 0);
      }
      return statusA - statusB; //
    });
    for (const val of currentData) {
      if (val.status === "1") {
        activeData.value.push(val);
      } else {
        deactiveData.value.push(val);
      }
    }
    if (activeData.value.length == 0) {
      isDisabled.value = true;
    }
  }
};
</script>
