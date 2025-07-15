<template>
  <CommonLoading :isLoading="isLoading" />
  <CommonToastMessage
    v-model="toastVisible"
    :message="toastPops.message"
    :type="toastPops.type"
    :vPos="toastPops.vPos"
    :hPos="toastPops.hPos"
  />

  <div class="flex justify-center items-center h-screen bg-slate-200">
    <div class="card w-[35rem] bg-base-100 shadow-xl">
      <div class="card-body text-2xl">
        <h2 class="card-title text-4xl mb-4">患者情報登録</h2>
        <!-- 患者ID -->
        <div class="flex items-center mb-5 text-2xl">
          <span class="mr-2 whitespace-nowrap">患者ID　：</span>
          <div class="input input-bordered flex items-center gap-2 w-full">
            <input
              v-model="inputData.patientNo"
              type="text"
              :maxlength="PATIENT_LENGTH"
              placeholder="患者ID"
              @input="onInputChange('patientNo')"
              class="grow bg-transparent focus:outline-none text-2xl"
            />
            <CommonClearIcon :isVisible="inputFlag.patientNo" @click="onClickClear('patientNo')" />
          </div>
        </div>
        <!-- 予約番号 -->
        <div v-if="isyynoInput" class="flex items-center mb-5 text-2xl">
          <span class="mr-2 whitespace-nowrap">予約番号：</span>
          <div class="input input-bordered flex items-center gap-2 w-full">
            <input
              v-model="inputData.yyno"
              type="text"
              :maxlength="PATIENT_LENGTH"
              placeholder="予約番号"
              @input="onInputChange('yyno')"
              @blur="onLostYYNO"
              class="grow bg-transparent focus:outline-none text-2xl"
            />
            <CommonClearIcon :isVisible="inputFlag.yyno" @click="onClickClear('yyno')" />
          </div>
        </div>
        <div class="mb-2 overflow-wrap max-w-[30rem]">患者氏名： {{ name }}</div>
        <div class="overflow-wrap max-w-[30rem]">コース名： {{ course }}</div>
        <form @submit.prevent="handleLogin" class="mt-4">
          <!-- ユーザID -->
          <label class="input input-bordered flex items-center justify-between gap-2 mb-5 w-full text-2xl">
            <input v-model="inputData.userId" type="text" placeholder="ID" @input="onInputChange('userId')" />
            <CommonClearIcon :isVisible="inputFlag.userId" @click="onClickClear('userId')" />
          </label>
          <!-- パスワード -->
          <label class="input input-bordered flex items-center justify-between mb-5 w-full text-2xl">
            <input
              v-model="inputData.password"
              :type="isPassVisible ? 'text' : 'password'"
              placeholder="Password"
              @input="onInputChange('password')"
            />
            <div class="flex items-center ml-auto">
              <CommonClearIcon :isVisible="inputFlag.password" @click="onClickClear('password')" />
              <CommonPassVisible v-model="isPassVisible" />
            </div>
          </label>
          <button :disabled="!isFormValid || isLoading" type="submit" class="btn btn-primary w-full">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
// import
import { signInWithEmailAndPassword } from "firebase/auth";

// 型定義
import type { ExLoginData, ExLoginFlag, PatientData, CookieData } from "~/types/baseType";
import type { ToastProps } from "~/types/toastType";
import type { WhereFilterOp } from "firebase/firestore";

// 定数読込
const { MSG, COOKIE_SETTING, PATIENT_LENGTH } = useConstants();
const addMailAddress = "@holonicsystem.com";

// composable
const { formatDateToString } = useCommon();

// cookie
const cookieUserId = useCookie<CookieData["userId"]>("userId", COOKIE_SETTING);
const cookiePatient = useCookie<CookieData["patientNo"]>("patientNo", COOKIE_SETTING);
const cookieToday = useCookie<CookieData["today"]>("today", COOKIE_SETTING);
const cookieLang = useCookie<CookieData["lang"]>("lang", COOKIE_SETTING);
const cookieYYNO = useCookie<CookieData["yyno"]>("yyno", COOKIE_SETTING);
const cookieDocId = useCookie<CookieData["docid"]>("docid", COOKIE_SETTING);

// plugin
const { $firebaseAuth } = useNuxtApp();

// 表示制御
const isPassVisible = ref(false);
const isLoading = ref(false);
const isyynoInput = ref(false);

// Toast表示用
const toastVisible = ref(false);
const toastPops = ref<ToastProps>({ message: "" });

// 入力データ
// test start
const inputData = reactive<ExLoginData>({
  userId: "test",
  yyno: "",
  password: "test01",
  patientNo: "",
  // patientNo: "00020473",
});
// const inputData = reactive<ExLoginData>({
//   userId: "",
//   password: "",
//   patientNo: "",
// });
// test end
const inputFlag = reactive<ExLoginFlag>({
  userId: false,
  password: false,
  patientNo: false,
  yyno: false,
});
// reactive変数
const name = ref<string>("");
const course = ref<string>("");

onMounted(async () => {
  // test start
  // cookieToday.value = "20250708";
  cookieToday.value = formatDateToString(new Date());
  // test end
  cookieLang.value = "ja";
});

const handleLogin = async () => {
  try {
    isLoading.value = true;
    cookieUserId.value = inputData.userId;
    cookiePatient.value = inputData.patientNo;

    const email = inputData.userId + addMailAddress;
    await signInWithEmailAndPassword($firebaseAuth, email, inputData.password);
    isLoading.value = false;
    navigateTo("/");
  } catch (error) {
    isLoading.value = false;
    toastPops.value = {
      message: MSG.E001,
      type: "error",
      vPos: "middle",
      hPos: "center",
    };
    toastVisible.value = true;
  }
};

const checkInput = async () => {
  if (inputData.patientNo.length === PATIENT_LENGTH) {
    isLoading.value = true;
    const result = await getFirestoreDocument();
    if (result.count == 1) {
      setKanName(result.data);
    } else {
      toastPops.value = {
        message: result.data,
        type: "error",
        vPos: "middle",
        hPos: "center",
      };
      toastVisible.value = true;
    }
    isLoading.value = false;
  } else {
    name.value = "";
    course.value = "";
  }
};
const onLostYYNO = async () => {
  setKanName(`00${inputData.patientNo}_${inputData.yyno}`);
};

const setKanName = async (docid: string) => {
  const { data, error } = await useFirestoreDocument<PatientData>(String(cookieToday.value), docid);
  if (error.value != null || data.value == null) {
    toastPops.value = {
      message: MSG.EA00,
      type: "error",
      vPos: "middle",
      hPos: "center",
    };
    toastVisible.value = true;
  } else {
    name.value = data.value.name;
    course.value = data.value.courseNm;
    cookieYYNO.value = String(data.value.yy_no);
    cookieDocId.value = docid;
  }
};

const getFirestoreDocument = async (): Promise<{ count: number; data: string }> => {
  isyynoInput.value = false;
  const retDt = { count: 0, data: "" };
  const collectionName = String(cookieToday.value);
  const para: { field: string; op: WhereFilterOp; value: any }[] = [
    { field: "patientId", op: "==", value: inputData.patientNo },
    { field: "cancel", op: "==", value: false },
  ];
  const { dataList, docIds, error } = await useFirestoreQueryByFields(collectionName, para);
  if (error.value) {
    retDt.data = MSG.E004;
    return retDt;
  }
  retDt.count = dataList.value.length;
  switch (true) {
    case retDt.count === 0:
      retDt.data = MSG.EA00;
      return retDt;
    case retDt.count === 1:
      retDt.data = docIds.value[0];
      return retDt;
    case retDt.count > 1:
      inputData.yyno = "";
      isyynoInput.value = true;
      retDt.data = MSG.EA04;
      return retDt;
    default:
      retDt.count = 0;
      retDt.data = MSG.E004;
      return retDt;
  }
};

const isFormValid = computed(() => !!name.value && !!course.value && !inputFlag.userId && !inputFlag.password);

// 入力系method start
const onInputChange = (field: keyof ExLoginData) => {
  inputFlag[field] = inputData[field] !== "";
  if (field == "patientNo") {
    checkInput();
  }
};
const onClickClear = (field: keyof ExLoginData) => {
  inputData[field] = "";
  onInputChange(field);
};
// 入力系method end
</script>
<style>
input:-webkit-autofill {
  transition: background-color 9999s ease-in-out 0s;
  -webkit-text-fill-color: #000 !important;
}
</style>
