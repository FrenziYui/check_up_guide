<template>
  <CommonToastMessage
    v-model="toastVisible"
    :message="toastPops.message"
    :type="toastPops.type"
    :vPos="toastPops.vPos"
    :hPos="toastPops.hPos"
  />
  <form @submit.prevent="submitForm">
    <!-- 入力フォーム -->
    <div class="form-control border border-accent p-4 rounded-lg">
      <QuestionRadio label="便検査１回目" :options="['受領済', '後日郵送', '後日持参']" v-model="検査結果便1" />
    </div>
    <div class="form-control border border-accent p-4 rounded-lg mt-5">
      <QuestionRadio label="便検査２回目" :options="['受領済', '後日郵送', '後日持参']" v-model="検査結果便2" />
    </div>
    <div class="form-control border border-accent p-4 rounded-lg mt-5">
      <QuestionRadio label="尿検査" :options="['受領済', '後日郵送', '後日持参']" v-model="検査結果尿" />
    </div>
    <!-- ボタン -->
    <div class="modal-action mt-6 flex justify-end space-x-2">
      <button type="submit" class="btn btn-info">更新</button>
      <button @click="close" type="button" class="btn btn-primary">キャンセル</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { ToastProps } from "~/types/toastType";
import type { PatientData, StoolUrine } from "~/types/baseType";
// Toast表示用
const toastVisible = ref(false);
const toastPops = ref<ToastProps>({ message: "" });
const results = ref<StoolUrine>();

const 検査結果便1 = ref("");
const 検査結果便2 = ref("");
const 検査結果尿 = ref("");

// 定数
const { MSG, COOKIE_SETTING } = useConstants();

const cookiePatient = useCookie<string>("patientNo", COOKIE_SETTING);
const cookieToday = useCookie<string>("today", COOKIE_SETTING);

onMounted(async () => {
  const { data, error } = await useFirestoreDocument<PatientData>(
    cookieToday.value.toString(),
    "00" + cookiePatient.value
  );
  if (error.value) {
    toastPops.value = {
      message: MSG.EA01,
      type: "error",
      vPos: "middle",
      hPos: "center",
    };
    toastVisible.value = true;
    setTimeout(() => {
      navigateTo("/");
    }, 3000);
  }
  if (data.value?.urine != null) {
    results.value = data.value.urine;
  }
});
const close = () => {
  navigateTo("/");
};
</script>
