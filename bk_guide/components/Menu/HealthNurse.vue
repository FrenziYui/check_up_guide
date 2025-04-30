<template>
  <div class="bg-base-100 w-full max-w-3xl mx-4 p-8 rounded-lg shadow-lg">
    <div class="text-3xl font-bold text-blue-500">保健師チェック</div>
    <div class="divider divider-neutral"></div>
    <!-- 入力フォーム -->
    <form @submit.prevent="submitForm">
      <div class="form-control">
        <div v-for="(item, index) in results" :key="index">
          <MenuCheckComp :label="item.dspNm" v-model="item.val" />
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
  { dspNm: "問診", val: false },
  { dspNm: "食事", val: false },
  { dspNm: "水分", val: false },
  { dspNm: "内服薬", val: false },
  { dspNm: "局麻(胃のみ)", val: false },
  { dspNm: "鎮痛(大のみ)", val: false },
  { dspNm: "鎮座", val: false },
  { dspNm: "生検", val: false },
  { dspNm: "拮抗", val: false },
  { dspNm: "学会", val: false },
  { dspNm: "車", val: false },
]);

const emit = defineEmits(["update:isMenu"]);

onMounted(async () => {
  const docRef = doc(db, useAppConfig().collectionId, props.devId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    if (docSnap.data().HealthNurse != undefined) {
      results.value = docSnap.data().HealthNurse;
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
      HealthNurse: results.value,
    },
    { merge: true }
  );
};
</script>
