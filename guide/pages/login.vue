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
        <h2 class="card-title text-4xl mb-4">入院時確認チェック管理ログイン</h2>
        <form @submit.prevent="handleLogin" class="mt-4">
          <!-- ユーザID -->
          <label class="input input-bordered flex items-center justify-between gap-2 mb-5 w-full">
            <input v-model="inputData.userId" type="text" placeholder="ID" @input="onInputChange('userId')" />
            <CommonClearIcon :isVisible="inputFlag.userId" clickEvent="userId" @click="onClickClear" />
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
              <CommonClearIcon :isVisible="inputFlag.password" clickEvent="password" @click="onClickClear" />
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
import type { LoginData, LoginFlag } from "../types/loginType";
import type { ToastProps } from "../types/toastType";
const { COOKIE_SETTING } = useConstants();

// pluginの読込
const { $firebaseAuth } = useNuxtApp();

// 表示制御
const isPassVisible = ref(false);
const isLoading = ref(false);

// Toast表示用
const toastVisible = ref(false);
const toastPops = ref<ToastProps>({ message: "" });

const inputData = reactive<LoginData>({
  userId: "",
  password: "",
});
const inputFlag = reactive<LoginFlag>({
  userId: false,
  password: false,
});

const addMailAddress = "@holonicsystem.com";

const cookieUserId = useCookie<string>("userId", COOKIE_SETTING);
const { MSG } = useConstants();

const handleLogin = async () => {
  try {
    isLoading.value = true;
    cookieUserId.value = inputData.userId;

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

// 入力系method start
const onInputChange = (field: keyof LoginData) => {
  inputFlag[field] = inputData[field] !== "";
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
