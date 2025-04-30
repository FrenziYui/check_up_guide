<template>
  <div class="flex justify-center items-center h-screen bg-slate-200">
    <div class="card w-[35rem] bg-base-100 shadow-xl">
      <div class="card-body text-2xl">
        <h2 class="card-title text-4xl mb-4">患者情報登録</h2>
        <input
          v-model="patientNo"
          placeholder="患者ID"
          type="text"
          class="input input-bordered w-full mb-4 text-2xl"
          @input="checkInput"
          maxlength="8"
        />
        <div v-if="errDsp" class="mb-2 text-red-600 font-semibold">{{ message }}</div>
        <div class="mb-2 overflow-wrap max-w-[30rem]">患者氏名： {{ name }}</div>
        <div class="overflow-wrap max-w-[30rem]">コース名： {{ course }}</div>
        <form @submit.prevent="handleLogin" class="mt-4">
          <input
            v-model="email"
            type="Email"
            placeholder="Email"
            class="input input-bordered w-full mb-4"
            :disabled="dspFlg"
          />
          <input
            v-model="password"
            type="Password"
            placeholder="Password"
            class="input input-bordered w-full mb-4"
            :disabled="dspFlg"
          />
          <button type="submit" class="btn btn-primary w-full" :disabled="dspFlg">Login</button>
          <div v-if="errDspSub" class="mt-4 text-red-600 font-semibold">
            メールアドレス又はパスワードが異なります
          </div>
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
import { auth } from "@/firebaseConfig";

const email = ref("");
const password = ref("");
const patientNo = ref("");
const dspFlg = ref(true);
const name = ref("");
const course = ref("");
const message = ref("");
const errDsp = ref(false);
const errDspSub = ref(false);
const router = useRouter();
const cookiePatient = useCookie<string>("patientNo", { maxAge: 60 * 60 * 24 * 7 });
const cookieToday = useCookie<string>("today", { maxAge: 60 * 60 * 24 * 7 });

const handleLogin = async () => {
  errDspSub.value = false;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    // const { data, error } = await useDocumentAdd(email.value, patientNo.value);
    // if (!error.value && data.value) {
    //   if (data.value) {
    //cookieに書き込み
    console.log(patientNo.value);
    console.log("00" + patientNo.value);
    cookiePatient.value = "00" + patientNo.value;

    cookieToday.value = formatDateToString(new Date());
    // } else {
    // }
    // } else {
    // }
    router.push("/");
  } catch (error) {
    errDspSub.value = true;
  }
};

const initField = () => {
  name.value = "";
  course.value = "";
  dspFlg.value = true;
  errDsp.value = false;
};

const checkInputErrDsp = (val: string) => {
  initField();
  message.value = val;
  errDsp.value = true;
};

const checkInput = async () => {
  if (patientNo.value.length === 8) {
    name.value = "aaa";
    course.value = "bbb";
    dspFlg.value = false;
    // const { data, error } = await useCheck(patientNo.value);
    // if (!error.value && data.value) {
    //   if (data.value.status == 0) {
    //     name.value = data.value.name;
    //     course.value = data.value.course;
    //     dspFlg.value = false;
    //   } else {
    //     // ステータスエラーの場合初期化
    //     checkInputErrDsp(data.value.message);
    //   }
    // } else {
    //   // エラーの場合初期化
    //   checkInputErrDsp("通信エラーが発生しました。");
    // }
  } else {
    // 患者IDが8桁未満の場合初期化
    initField();
  }
};
</script>
