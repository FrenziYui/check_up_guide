<template>
  <header class="bg-secondary text-white p-1 flex justify-between items-center">
    <!-- 左側 -->
    <div class="flex items-center space-x-3">
      <div class="drawer-content">
        <label @click="searchtoggle" for="my-drawer" class="cursor-pointer">
          <img src="/icon/burger.svg" alt="menu" class="w-8 h-8" />
        </label>
      </div>
    </div>
    <!-- 中央 -->
    <div class="flex-1 text-center text-2xl font-semibold whitespace-nowrap truncate max-w-xs">
      <span>入院時確認チェック管理画面aaaa</span>
    </div>
    <!-- 右側 -->
    <button class="btn btn-ghost flex items-center space-x-2" @click="handleLogout">
      <img src="/icon/logout.svg" alt="logout" class="w-6 h-6" />
    </button>
  </header>
  <!-- ログアウト確認ボタン -->
  <CommonConfModal
    v-model:isOpen="showModalLogout"
    title="ログアウト"
    message="ログアウトしログイン画面に移動しますがよろしいですか？"
    @confirm="handleConfirmLogout"
  />
</template>

<script setup lang="ts">
import { signOut } from "firebase/auth";
const { COOKIE_SETTING } = useConstants();
const { $firebaseAuth } = useNuxtApp();
const cookieUserId = useCookie<string>("userId", COOKIE_SETTING);
const emit = defineEmits(["searchtoggle", "searchClicked"]);
const showModalLogout = ref(false);

onMounted(() => {
  if (!cookieUserId.value) {
    handleConfirmLogout();
  }
});

const searchtoggle = () => {
  emit("searchtoggle");
};

// ログアウトボタンが押下された場合ダイアログを開く
const handleLogout = () => {
  showModalLogout.value = true;
  console.log("aaaa");
};

// ログアウトOKの場合
const handleConfirmLogout = async () => {
  await signOut($firebaseAuth);
  cookieUserId.value = "";
  navigateTo("/login");
};

const handleSearch = () => {
  emit("searchClicked");
};
</script>
