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
    <Personal :data="refPersonalData" />
    <Examination :items="refDispData" :langDt="langDt" />
    <NextExam />
    <div class="pl-5 pt-2 pr-5">
      <StatusGrid />
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
import { signOut } from "firebase/auth";

// composable
const { setDataField, formatDateToJapanese, getGenderLabel } = useCommon();

// 型
import type { PatientData, HeadItem, PersonalItem, DispCdItem } from "../types/baseType";
import type { AllLanguage, LangStr, LangKey } from "../types/langType";
import type { ToastProps } from "../types/toastType";

// plugin
const { $firebaseAuth } = useNuxtApp();

// 定数
const { MSG, COOKIE_SETTING } = useConstants();

// cookie
const cookiePatient = useCookie<string>("patientNo", COOKIE_SETTING);
const cookieToday = useCookie<string>("today", COOKIE_SETTING);
const cookielang = useCookie<LangKey>("lang", COOKIE_SETTING);

// state

if (!cookiePatient.value || !cookieToday.value) {
  await signOut($firebaseAuth);
  navigateTo("/login");
}

// 表示制御
const isLoading = ref(true);

// Toast表示用
const toastVisible = ref(false);
const toastPops = ref<ToastProps>({ message: "" });

// reactiveデータ
const refDispData = ref<DispCdItem[]>([
  {
    dspOrder: 0,
    inpCd: "",
    name: "",
    status: "",
    type: "",
  },
]);
const refHeadData = ref<HeadItem>({ courseNm: "" });
const refPersonalData = ref<PersonalItem>({
  birthDate: "",
  kana: "",
  name: "",
  patientId: "",
  sex: "",
});
const langDt = ref<LangStr>();
// その他変数
let langData: AllLanguage;

// firestoreデータ
const { data, error, stop } = useFirestoreSnapshot<PatientData>(
  cookieToday.value.toString(),
  "00" + cookiePatient.value
);

onMounted(async () => {
  await langGet();
  let langage: LangKey = "ja";
  if (cookielang.value) {
    langage = cookielang.value;
  }
  langageValueSent(langage);
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
const langageValueSent = (val: LangKey) => {
  langDt.value = langData[val];
  cookielang.value = val;
};
const dataset = (newData: PatientData) => {
  refHeadData.value.courseNm = setDataField(newData, "courseNm", "コース取得エラー");
  refPersonalData.value.name = setDataField(newData, "name", "氏名取得エラー");
  refPersonalData.value.kana = setDataField(newData, "kana", "カナシュトクエラー");
  refPersonalData.value.patientId = setDataField(newData, "patientId", "99999999");
  refPersonalData.value.birthDate = formatDateToJapanese(newData.birthDate);
  refPersonalData.value.sex = getGenderLabel(newData.sex);
  refDispData.value = newData.dispCd;
};
const langGet = async () => {
  try {
    const { data, error } = await useFirestoreDocument<AllLanguage>("setting", "lang");
    if (error.value != null || data.value == null) {
      throw useCustomError(MSG.EA02, "ERROR");
    }
    langData = data.value;
  } catch (error) {
    const e = error as CustomError;
    toastPops.value = {
      message: e.message,
      type: "error",
      vPos: "middle",
      hPos: "center",
    };
    toastVisible.value = true;
  }
};
</script>
