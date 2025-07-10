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
    <div class="card w-[35rem] bg-base-100 shadow-xl p-2">
      <div class="card-body text-2xl">
        <h2 class="card-title text-4xl mb-4">{{ APP_TITLE }}<br />管理者ログイン</h2>
        <form @submit.prevent="handleLogin" class="mt-4">
          <!-- ユーザID -->
          <label class="input input-bordered flex items-center justify-between gap-2 mb-5 w-full text-2xl">
            <input v-model="inputData.userId" type="text" placeholder="ID" @input="onInputChange('userId')" />
            <CommonClearIcon :isVisible="inputFlag.userId" clickEvent="userId" @click="handleClear" />
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
              <CommonClearIcon :isVisible="inputFlag.password" clickEvent="password" @click="handleClear" />
              <CommonPassVisible v-model="isPassVisible" />
            </div>
          </label>
          <button :disabled="isLoading" type="submit" class="btn btn-primary w-full">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

// 型定義
import type { LoginData, LoginFlag } from "~/types/loginType";
import type { CookieData } from "~/types/cookieType";
import type { ToastProps } from "~/types/toastType";

// 定数読込
const { MSG, COOKIE_SETTING, APP_TITLE, ADD_MAIL_ADDRESS } = useConstants();

// cookie
const cookieUserId = useCookie<CookieData["userId"]>("userId", COOKIE_SETTING);
const cookieCurrentDate = useCookie<CookieData["currentDate"]>("currentDate", COOKIE_SETTING);

// composable
const { login, error } = useFirebaseAuth();
const { formatDateToString } = useCommon();

// 表示制御
const isPassVisible = ref(false);
const isLoading = ref(false);

// Toast表示用
const toastVisible = ref(false);
const toastPops = ref<ToastProps>({ message: "" });

// 入力データ
const inputData = reactive<LoginData>({
  userId: "",
  password: "",
});
const inputFlag = reactive<LoginFlag>({
  userId: false,
  password: false,
});

onMounted(async () => {
  cookieCurrentDate.value = String(formatDateToString(new Date()));
});

const handleLogin = async () => {
  let errMSG: string = MSG.E000;
  try {
    isLoading.value = true;
    cookieUserId.value = inputData.userId;

    const email = inputData.userId + ADD_MAIL_ADDRESS;
    const success = await login(email, inputData.password);
    if (success) {
      navigateTo("/");
    } else {
      errMSG = MSG.E003;
      throw new Error("login failed");
    }
  } catch (error) {
    isLoading.value = false;
    toastPops.value = {
      message: errMSG,
      type: "error",
      vPos: "middle",
      hPos: "center",
    };
    toastVisible.value = true;
  }
};

// 入力系method start
const onInputChange = (field: keyof LoginData) => {
  inputFlag[field] = inputData[field] !== "";
};

// 汎用の型を呼び出し元の型に合わせる
const handleClear = (field: string) => {
  onClickClear(field as keyof LoginData);
};
const onClickClear = (field: keyof LoginData) => {
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
