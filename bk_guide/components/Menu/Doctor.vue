<template>
  <div class="bg-base-100 w-full max-w-3xl mx-4 p-8 rounded-lg shadow-lg">
    <div class="text-3xl font-bold text-blue-500">医師チェック</div>
    <div class="divider divider-neutral"></div>
    <!-- 入力フォーム -->
    <form @submit.prevent="submitForm">
      <div class="form-control">
        <div v-for="(item, index) in results" :key="index">
          <MenuCheckComp :label="item.dspNm" v-model="item.val" />
        </div>
        <div>
          <!-- D判定ラベル -->
          <label class="label">
            <span class="text-3xl">D判定</span>
          </label>

          <!-- チェックボックス風のラジオボタン -->
          <div class="flex items-center gap-4">
            <label class="cursor-pointer flex items-center">
              <input
                type="radio"
                name="DGrade"
                value="yes"
                v-model="DGrade"
                class="checkbox checkbox-secondary"
              />
              <span class="ml-2 text-3xl">有</span>
            </label>

            <label class="cursor-pointer flex items-center">
              <input
                type="radio"
                name="DGrade"
                value="no"
                v-model="DGrade"
                class="checkbox checkbox-secondary"
              />
              <span class="ml-2 text-3xl">無</span>
            </label>
          </div>
        </div>
      </div>

      <!-- ボタン -->
      <div class="modal-action mt-6 flex justify-end space-x-2">
        <button
          type="submit"
          class="text-xl font-medium px-4 py-2 bg-green-400 text-black rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          ＯＫ
        </button>
        <button
          @click="close"
          type="button"
          class="text-xl font-medium px-4 py-2 bg-warning text-black rounded ml-6 hover:bg-success focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { db } from "@/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

const props = defineProps({
  isMenu: {
    type: String,
    required: true,
  },
  devId: {
    type: String,
    default: "",
  },
});
const results = ref([
  { dspNm: "聴打診", val: false },
  { dspNm: "途中説明", val: false },
  { dspNm: "総合説明", val: false },
]);
const DGrade = ref(null);

const emit = defineEmits(["update:isMenu"]);

onMounted(async () => {
  const docRef = doc(db, useAppConfig().collectionId, props.devId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    if (docSnap.data().Doctor != undefined) {
      results.value = docSnap.data().Doctor;
    }
    if (docSnap.data().DoctorDGrade != undefined) {
      DGrade.value = docSnap.data().DoctorDGrade;
    }
  }
});

const close = () => {
  emit("update:isMenu", "0");
};

const submitForm = () => {
  firestoreUpdate();
  close();
};

const firestoreUpdate = () => {
  setDoc(
    doc(db, useAppConfig().collectionId, props.devId),
    {
      Doctor: results.value,
      DoctorDGrade: DGrade.value,
    },
    { merge: true }
  );
};
</script>
