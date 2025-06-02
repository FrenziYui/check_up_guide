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
        <label class="input input-bordered flex items-center justify-between gap-2 mb-5 w-full">
          <input
            v-model="inputData.patientNo"
            type="text"
            :maxlength="PATIENT_LENGTH"
            placeholder="患者ID"
            @input="onInputChange('patientNo')"
          />
          <CommonClearIcon :isVisible="inputFlag.patientNo" @click="onClickClear('patientNo')" />
        </label>
        <div class="mb-2 overflow-wrap max-w-[30rem]">患者氏名： {{ name }}</div>
        <div class="overflow-wrap max-w-[30rem]">コース名： {{ course }}</div>
        <form @submit.prevent="handleLogin" class="mt-4">
          <!-- ユーザID -->
          <label class="input input-bordered flex items-center justify-between gap-2 mb-5 w-full">
            <input v-model="inputData.userId" type="text" placeholder="ID" @input="onInputChange('userId')" />
            <CommonClearIcon :isVisible="inputFlag.userId" @click="onClickClear('userId')" />
          </label>
          <!-- パスワード -->
          <label class="input input-bordered flex items-center justify-between mb-5 w-full">
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
          <button type="submit" class="btn btn-primary w-full">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
import { signInWithEmailAndPassword } from "firebase/auth";
// 型定義
import type { ExLoginData, ExLoginFlag, PatientData } from "../types/baseType";
import type { ToastProps } from "../types/toastType";
// 定数読込
const { MSG, COOKIE_SETTING, PATIENT_LENGTH } = useConstants();
const addMailAddress = "@holonicsystem.com";

// composable
const { formatDateToString } = useCommon();

// cookie
const cookiePatient = useCookie<string>("patientNo", COOKIE_SETTING);
const cookieToday = useCookie<string>("today", COOKIE_SETTING);
const cookieUserId = useCookie<string>("userId", COOKIE_SETTING);

// pluginの読込
const { $firebaseAuth } = useNuxtApp();

// 表示制御
const isPassVisible = ref(false);
const isLoading = ref(false);

// Toast表示用
const toastVisible = ref(false);
const toastPops = ref<ToastProps>({ message: "" });

// 入力データ
const inputData = reactive<ExLoginData>({
  userId: "",
  password: "",
  patientNo: "",
});
const inputFlag = reactive<ExLoginFlag>({
  userId: false,
  password: false,
  patientNo: false,
});
// reactive変数
const name = ref<string>("");
const course = ref<string>("");

// 初期データ取得
cookieToday.value = formatDateToString(new Date());

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
    const { data, error } = await useFirestoreDocument<PatientData>(
      String(cookieToday.value),
      "00" + inputData.patientNo
    );
    if (error.value != null || data.value == null) {
      toastPops.value = {
        message: error.value ?? "データがありません",
        type: "error",
        vPos: "middle",
        hPos: "center",
      };
      toastVisible.value = true;
    } else {
      name.value = data.value.name;
      course.value = data.value.courseNm;
    }
    isLoading.value = false;
  } else {
    name.value = "";
    course.value = "";
  }
};

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
