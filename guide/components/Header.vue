<template>
  <!-- ログアウト確認ボタン -->
  <CommonConfModal
    v-model:isOpen="showModalLogout"
    title="ログアウト"
    message="ログアウトしログイン画面に移動しますがよろしいですか？"
    @confirm="handleConfirmLogout"
  />
  <header class="iseikai-color text-white px-6 flex items-center">
    <!-- 左側 -->
    <div class="w-2/12 flex items-center"></div>

    <!-- 中央 -->
    <div class="w-8/12 flex-1 flex justify-center">
      <h1 class="text-3xl font-bold text-center">
        {{ title }}
      </h1>
    </div>

    <!-- 右側 -->
    <div class="w-2/12 flex items-center gap-6 justify-end">
      <LangageCng @langage-sent="langageValueSent" />
      <img src="/icon/logout.svg" alt="logout" class="w-8 h-8" @click="handleLogout" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { signOut } from "firebase/auth";
const { COOKIE_SETTING } = useConstants();
const { $firebaseAuth } = useNuxtApp();
// 型
interface Emits {
  (event: "langage-sent", langage: string): void;
}
// cookie
const cookieUserId = useCookie<string>("userId", COOKIE_SETTING);
// props
defineProps<{
  title: string;
}>();
// emit
const emit = defineEmits<Emits>();

// 表示切替用
const showModalLogout = ref(false);

onMounted(() => {
  if (!cookieUserId.value) {
    handleConfirmLogout();
  }
});

// ログアウトボタンが押下された場合ダイアログを開く
const handleLogout = () => {
  showModalLogout.value = true;
};

// ログアウトOKの場合
const handleConfirmLogout = async () => {
  await signOut($firebaseAuth);
  cookieUserId.value = "";
  navigateTo("/login");
};

const langageValueSent = (val: string) => {
  emit("langage-sent", val);
};
</script>
<style>
.iseikai-color {
  background-color: #00a1e5;
}
</style>
