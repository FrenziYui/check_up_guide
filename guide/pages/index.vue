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
    <Header :title="refHeadData.courseNm" @langage-sent="languageValueSent" />
    <Personal :data="refPersonalData" />
    <Examination :items="refDispData" :langDt="langDt" :active="refnextData" />
    <NextExam :item="refnextData" :langDt="langDt" />
    <div class="pl-5 pt-2 pr-5">
      <StatusGrid :items="refDispBtn" />
    </div>
    <Memo :items="refDispData" />
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
import type { PatientData, HeadItem, PersonalItem, DispCdItem, DispItem } from "~/types/baseType";
import type { AllLanguage, LangStr, LangKey } from "~/types/langType";
import type { ToastProps } from "~/types/toastType";

// plugin
const { $firebaseAuth } = useNuxtApp();

// 定数
const { MSG, COOKIE_SETTING } = useConstants();

// cookie
const cookiePatient = useCookie<string>("patientNo", COOKIE_SETTING);
const cookieToday = useCookie<string>("today", COOKIE_SETTING);
const cookielang = useCookie<LangKey>("lang", COOKIE_SETTING);

// cookieの値がない場合はログイン画面へリダイレクト
if (!cookiePatient.value || !cookieToday.value) {
  await signOut($firebaseAuth);
  navigateTo("/login");
}

// 表示制御
const isLoading = ref(true);

// Toast表示用
const toastVisible = ref(false);
const toastPops = ref<ToastProps>({ message: "" });

// 表示用reactiveデータ
const refDispData = ref<DispCdItem[]>([
  {
    dspOrder: 0,
    inpCd: "",
    name: "",
    status: "",
    knsnm: "",
    knstm: "",
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
const refnextData = ref<string>("");
const refDispBtn = ref<DispItem[]>([{ info: 0, label: "", status: 0, param: "", visible: false }]);

// 現在選択されている言語
const langDt = ref<LangStr>();

// その他変数
let langData: AllLanguage;

// firestoreのスナップショットを取得
const { data, error, stop } = useFirestoreSnapshot<PatientData>(
  cookieToday.value.toString(),
  "00" + cookiePatient.value
);

// ページがマウントされたときに言語データを取得し、初期言語を設定
onMounted(async () => {
  await langGet();
  let langage: LangKey = "ja";
  if (cookielang.value) {
    langage = cookielang.value;
  }
  languageValueSent(langage);
});

onBeforeUnmount(() => {
  stop();
});

// snapshotのデータが更新されたときの処理
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
// 選択された言語データのセット
const languageValueSent = (val: LangKey) => {
  const wklangDt = langData[val];
  langDt.value = {
    ...wklangDt,
    ...Object.fromEntries(Object.entries(langData["ja"]).map(([key, value]) => [`j${key}`, value])),
  };
  cookielang.value = val;
};
// 表示データのセット
const dataset = (newData: PatientData) => {
  refHeadData.value.courseNm = setDataField(newData, "courseNm", "コース取得エラー");
  refPersonalData.value.name = setDataField(newData, "name", "氏名取得エラー");
  refPersonalData.value.kana = setDataField(newData, "kana", "カナシュトクエラー");
  refPersonalData.value.patientId = setDataField(newData, "patientId", "99999999");
  refPersonalData.value.birthDate = formatDateToJapanese(newData.birthDate);
  refPersonalData.value.sex = getGenderLabel(newData.sex);
  refDispData.value = newData.dispCd;
  refnextData.value = newData.active;
  refDispBtn.value = newData.dispBtn;
};
// firestoreから言語データを取得
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
