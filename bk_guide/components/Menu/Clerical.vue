<template>
  <div class="bg-base-100 w-full max-w-3xl mx-4 p-8 rounded-lg shadow-lg">
    <div class="text-3xl font-bold text-blue-500">事務チェック</div>
    <div class="divider divider-neutral"></div>
    <!-- 入力フォーム -->
    <form @submit.prevent="submitForm">
      <div class="form-control max-h-[80vh] overflow-y-auto">
        <div>
          <!-- 保険証種類 -->
          <label class="label">
            <span class="text-3xl">保険証種類</span>
          </label>

          <!-- チェックボックス風のラジオボタン -->
          <div class="flex items-center gap-4 mb-5">
            <label class="cursor-pointer flex items-center">
              <input
                type="radio"
                name="HelthInsuranceType"
                value="後期高齢者"
                v-model="HelthInsuranceType"
                class="checkbox checkbox-secondary"
              />
              <span class="ml-2 text-3xl">後期高齢者</span>
            </label>
            <label class="cursor-pointer flex items-center">
              <input
                type="radio"
                name="HelthInsuranceType"
                value="健保組合"
                v-model="HelthInsuranceType"
                class="checkbox checkbox-secondary"
              />
              <span class="mx-5 text-3xl">健保組合</span>
            </label>

            <label class="cursor-pointer flex items-center">
              <input
                type="radio"
                name="HelthInsuranceType"
                value="大阪"
                v-model="HelthInsuranceType"
                class="checkbox checkbox-secondary"
              />
              <span class="mx-5 text-3xl">大阪</span>
            </label>
            <label class="cursor-pointer flex items-center">
              <input
                type="radio"
                name="HelthInsuranceType"
                value="他"
                v-model="HelthInsuranceType"
                class="checkbox checkbox-secondary"
              />
              <span class="mx-5 text-3xl">他</span>
            </label>
          </div>
          <!-- 保険証種類 -->
          <label class="label">
            <span class="text-3xl">保険証内容</span>
          </label>

          <!-- チェックボックス風のラジオボタン -->
          <div class="flex items-center gap-4 mb-8">
            <label class="cursor-pointer flex items-center">
              <input
                type="radio"
                name="HelthInsuranceContents"
                value="高齢者"
                v-model="HelthInsuranceContents"
                class="checkbox checkbox-secondary"
              />
              <span class="mx-5 text-3xl">高齢者</span>
              <input
                type="radio"
                name="HelthInsuranceContents"
                value="生活保護"
                v-model="HelthInsuranceContents"
                class="checkbox checkbox-secondary"
              />
              <span class="mx-5 text-3xl">生活保護</span>
              <input
                type="radio"
                name="HelthInsuranceContents"
                value="非保護"
                v-model="HelthInsuranceContents"
                class="checkbox checkbox-secondary"
              />
              <span class="mx-5 text-3xl">非保護</span>
              <input
                type="radio"
                name="HelthInsuranceContents"
                value="免除"
                v-model="HelthInsuranceContents"
                class="checkbox checkbox-secondary"
              />
              <span class="mx-5 text-3xl">免除</span>
            </label>
          </div>

          <div v-for="(item, index) in results" :key="index">
            <MenuCheckComp :label="item.dspNm" v-model="item.val" />
          </div>
        </div>

        <!-- TEL -->
        <label class="label">
          <span class="text-3xl">TEL</span>
        </label>

        <!-- チェックボックス風のラジオボタン -->
        <div class="flex items-center gap-4 mb-5">
          <label class="cursor-pointer flex items-center">
            <input
              type="radio"
              name="TelNo"
              value="yes"
              v-model="TelNo"
              class="checkbox checkbox-secondary"
            />
            <span class="ml-2 text-3xl">有</span>
          </label>
          <label class="cursor-pointer flex items-center">
            <input
              type="radio"
              name="TelNo"
              value="no"
              v-model="TelNo"
              class="checkbox checkbox-secondary"
            />
            <span class="ml-2 text-3xl">無</span>
          </label>
        </div>
        <!-- 記入用紙 -->
        <label class="label">
          <span class="text-3xl">記入用紙</span>
        </label>

        <!-- チェックボックス風のラジオボタン -->
        <div class="flex items-center gap-4 mb-5">
          <label class="cursor-pointer flex items-center">
            <input
              type="radio"
              name="EntryForm"
              value="yes"
              v-model="EntryForm"
              class="checkbox checkbox-secondary"
            />
            <span class="ml-2 text-3xl">有</span>
          </label>
          <label class="cursor-pointer flex items-center">
            <input
              type="radio"
              name="EntryForm"
              value="no"
              v-model="EntryForm"
              class="checkbox checkbox-secondary"
            />
            <span class="ml-2 text-3xl">無</span>
          </label>
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
  { dspNm: "保険証コピー", val: false },
  { dspNm: "保険証ID", val: false },
  { dspNm: "保険証返却", val: false },
  { dspNm: "レモン", val: false },
  { dspNm: "クーポン(乳)", val: false },
  { dspNm: "クーポン(子宮)", val: false },
  { dspNm: "受診券", val: false },
  { dspNm: "会社", val: false },
  { dspNm: "自宅", val: false },
  { dspNm: "窓口", val: false },
  { dspNm: "住所", val: false },
  { dspNm: "食事", val: false },
  { dspNm: "コロ問", val: false },
]);
const HelthInsuranceType = ref(null);
const HelthInsuranceContents = ref(null);
const TelNo = ref(null);
const EntryForm = ref(null);

const emit = defineEmits(["update:isMenu"]);

onMounted(async () => {
  const docRef = doc(db, useAppConfig().collectionId, props.devId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    if (docSnap.data().Clerical != undefined) {
      results.value = docSnap.data().Clerical;
    }
    if (docSnap.data().HelthInsuranceType != undefined) {
      HelthInsuranceType.value = docSnap.data().HelthInsuranceType;
    }
    if (docSnap.data().HelthInsuranceContents != undefined) {
      HelthInsuranceContents.value = docSnap.data().HelthInsuranceContents;
    }
    if (docSnap.data().TelNo != undefined) {
      TelNo.value = docSnap.data().TelNo;
    }
    if (docSnap.data().EntryForm != undefined) {
      EntryForm.value = docSnap.data().EntryForm;
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
      Clerical: results.value,
      HelthInsuranceType: HelthInsuranceType.value,
      HelthInsuranceContents: HelthInsuranceContents.value,
      TelNo: TelNo.value,
      EntryForm: EntryForm.value,
    },
    { merge: true }
  );
};
</script>
