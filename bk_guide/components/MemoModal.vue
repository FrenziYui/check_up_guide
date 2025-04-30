<template>
  <div class="bg-base-100 w-full max-w-3xl mx-4 p-8 rounded-lg shadow-lg">
    <div class="badge badge-info badge-lg text-xl">メモ</div>

    <!-- 入力フォーム -->
    <form @submit.prevent="submitForm">
      <div class="form-control">
        <div class="relative">
          <textarea
            class="textarea h-96 w-full pr-14 textarea-accent text-3xl"
            placeholder="メモを記載してください"
            v-model="localMessage"
            maxlength="1000"
            type="text"
            @input="onInputChange"
          ></textarea>
          <ClearIcon
            v-if="flgInp"
            :isVisible="flgInp"
            clickEvent="memo"
            @click="onClickClear"
            customClass="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 mr-5 opacity-70 hover:opacity-100 hover:bg-accent hover:rounded-full"
          />
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
import { doc, setDoc } from "firebase/firestore";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  devId: {
    type: String,
    default: "",
  },
});
const localMessage = ref("");
const flgInp = ref(false);

const emit = defineEmits(["update:isOpen"]);

onMounted(() => {
  localMessage.value = props.message;
  onInputChange();
});

const onInputChange = () => {
  flgInp.value = localMessage.value !== "";
};

const onClickClear = () => {
  localMessage.value = "";
  onInputChange();
};

const close = () => {
  emit("update:isOpen", false);
};

const submitForm = () => {
  firestoreUpdate();
  close();
};
const firestoreUpdate = () => {
  setDoc(
    doc(db, useAppConfig().collectionId, props.devId),
    {
      memo: localMessage.value,
    },
    { merge: true }
  );
};
</script>
