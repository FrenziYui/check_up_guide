<template>
  <CommonLoading :isLoading="isLoading" />
  <CommonToastMessage
    v-model="toastVisible"
    :message="toastPops.message"
    :type="toastPops.type"
    :vPos="toastPops.vPos"
    :hPos="toastPops.hPos"
  />

  <div class="flex flex-col h-screen">
    <Header :title="refHeadData.courseNm" @langage-sent="langageValueSent" />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
// 型
import type { PatientData } from "../types/baseType";
import type { ToastProps } from "../types/toastType";

// 定数
const { MSG, COOKIE_SETTING } = useConstants();

// cookie
const cookiePatient = useCookie<string>("patientNo", COOKIE_SETTING);
const cookieToday = useCookie<string>("today", COOKIE_SETTING);

// 表示制御
const isLoading = ref(true);

// Toast表示用
const toastVisible = ref(false);
const toastPops = ref<ToastProps>({ message: "" });

// reactiveデータ
const refDispData = ref("");
const refHeadData = ref({ courseNm: "" });

// firestoreデータ
const { data, error, stop } = useFirestoreSnapshot<PatientData>(
  cookieToday.value.toString(),
  "00" + cookiePatient.value
);

onMounted(async () => {
  console.log("開始");
});

onBeforeUnmount(() => {
  stop();
});

watch([data, error], ([newData, newError]) => {
  if (newError) {
    toastPops.value = {
      message: MSG.EA01,
      type: "error",
      vPos: "middle",
      hPos: "center",
    };
    toastVisible.value = true;
    isLoading.value = false;
  } else if (newData) {
    dataset(newData);
    isLoading.value = false;
  }
});
const langageValueSent = (val: string) => {
  console.log(val);
};
const dataset = (newData) => {
  refHeadData.value.courseNm = newData.courseNm;
};
</script>
