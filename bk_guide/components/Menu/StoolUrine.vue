<template>
  <div class="bg-base-100 w-full max-w-3xl mx-4 p-8 rounded-lg shadow-lg">
    <div class="text-3xl font-bold text-blue-500">便・尿検査</div>
    <div class="divider divider-neutral"></div>
    <!-- 入力フォーム -->
    <form @submit.prevent="submitForm">
      <div class="form-control">
        <div v-for="(item, index) in results" :key="index">
          <MenuCheckComp :label="item.dspNm" v-model="item.val" />
        </div>
      </div>

      <label class="label">
        <span class="text-3xl">便検査１回目</span>
      </label>
      <div class="form-control border border-accent p-4 rounded-lg">
        <label class="label cursor-pointer flex justify-start items-center space-x-2">
          <input
            type="radio"
            name="stoolFirstChk"
            class="radio radio-secondary mr-5"
            v-model="StoolFirstChk"
            value="day"
          />
          <flat-pickr
            v-model="stoolFirstDay"
            class="input input-bordered text-2xl"
            :disabled="test"
          />
        </label>
        <label class="label cursor-pointer w-full">
          <!-- ラジオボタンとテキストの左寄せ -->
          <div class="flex flex-col items-start gap-4 w-full">
            <!-- ラジオボタン全体の横並び -->
            <div class="flex items-center gap-4 w-full">
              <input
                type="radio"
                name="stoolFirstChk"
                class="radio radio-secondary mr-5"
                v-model="StoolFirstChk"
                value="etc"
              />
              <input
                type="radio"
                name="StoolFirstLater"
                value="高齢者"
                v-model="StoolFirstLater"
                class="checkbox checkbox-secondary"
                :disabled="StoolFirstChk !== 'etc'"
              />
              <span class="text-3xl">後日郵送</span>
              <input
                type="radio"
                name="StoolFirstLater"
                value="高齢者"
                v-model="StoolFirstLater"
                class="checkbox checkbox-secondary"
                :disabled="StoolFirstChk !== 'etc'"
              />
              <span class="text-3xl">後日持参</span>
            </div>
          </div>
        </label>
      </div>
      <label class="label">
        <span class="text-3xl">便検査２回目</span>
      </label>
      <div class="form-control border border-accent p-4 rounded-lg">
        <label class="label cursor-pointer flex justify-start items-center space-x-2">
          <input
            type="radio"
            name="stoolSecondChk"
            class="radio radio-secondary mr-5"
            v-model="StoolSecondChk"
            value="day"
          />
          <flat-pickr
            v-model="stoolSecondDay"
            class="input input-bordered text-2xl"
            :disabled="test"
          />
        </label>
        <label class="label cursor-pointer w-full">
          <!-- ラジオボタンとテキストの左寄せ -->
          <div class="flex flex-col items-start gap-4 w-full">
            <!-- ラジオボタン全体の横並び -->
            <div class="flex items-center gap-4 w-full">
              <input
                type="radio"
                name="stoolSecondChk"
                class="radio radio-secondary mr-5"
                v-model="StoolSecondChk"
                value="etc"
              />
              <input
                type="radio"
                name="StoolSecondLater"
                value="高齢者"
                v-model="StoolSecondLater"
                class="checkbox checkbox-secondary"
                :disabled="StoolSecondChk !== 'etc'"
              />
              <span class="text-3xl">後日郵送</span>
              <input
                type="radio"
                name="StoolSecondLater"
                value="高齢者"
                v-model="StoolSecondLater"
                class="checkbox checkbox-secondary"
                :disabled="StoolSecondChk !== 'etc'"
              />
              <span class="text-3xl">後日持参</span>
            </div>
          </div>
        </label>
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
import FlatPickr from "vue-flatpickr-component";

const stoolFirstDay = ref(null);
const StoolFirstChk = ref("day");
const StoolFirstLater = ref(null);
const stoolSecondDay = ref(null);
const StoolSecondChk = ref("day");
const StoolSecondLater = ref(null);

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
const results = ref([{ dspNm: "尿検査", val: false }]);

const emit = defineEmits(["update:isMenu"]);

onMounted(async () => {
  const docRef = doc(db, useAppConfig().collectionId, props.devId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    if (docSnap.data().Urine != undefined) {
      results.value = docSnap.data().Urine;
    }
  }
});

watch(StoolFirstChk, (newValue, oldValue) => {
  test.value = false;
  console.log(`StoolFirstChkが変更されました: ${oldValue} → ${newValue}`);
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
      Urine: results.value,
    },
    { merge: true }
  );
};
</script>
