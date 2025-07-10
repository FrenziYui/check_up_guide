<template>
  <CommonConfModal
    v-model:isOpen="showModalLogout"
    title="ログアウト"
    message="ログアウトしログイン画面に移動しますがよろしいですか？"
    @confirm="handleConfirmLogout"
  />
  <header class="bg-secondary text-white p-3 flex items-center justify-between relative">
    <div class="flex items-center space-x-3">
      <CommonDatePick v-if="showCalendar" v-model="currentDate" />
      <button class="btn btn-sm btn-info text-white" @click="handleClick">表示切替</button>
    </div>

    <!-- absoluteで中央に配置 -->
    <div class="absolute left-1/2 transform -translate-x-1/2 text-center text-2xl font-semibold whitespace-nowrap">
      <span>{{ APP_TITLE }}</span>
    </div>

    <!-- 右に配置 -->
    <div
      @click="handleLogout"
      class="flex items-center space-x-2 group relative cursor-pointer tooltip tooltip-info tooltip-bottom pr-4"
      data-tip="ログアウト"
    >
      <img src="/icon/logout.svg" alt="logout" class="w-8 h-8" />
    </div>
  </header>
</template>

<script setup lang="ts">
import type { CookieData } from "~/types/cookieType";
// 定数
const { COOKIE_SETTING, APP_TITLE } = useConstants();

// cookie
const cookieUserId = useCookie<CookieData["userId"]>("userId", COOKIE_SETTING);

// composable
const { logout, error } = useFirebaseAuth();

// 表示切替用
const showModalLogout = ref(false);
const showCalendar = ref(false);

// props
const props = defineProps({
  modelValue: String,
});

// emit
const emit = defineEmits(["update:modelValue", "Clicked"]);

// リアクティブ変数
const currentDate = ref(props.modelValue);

// 表示切替を通知
const handleClick = () => {
  emit("Clicked");
};

// ログアウトボタンが押下された場合ダイアログを開く
const handleLogout = () => {
  showModalLogout.value = true;
};

// ログアウトOKの場合
const handleConfirmLogout = async () => {
  await logout();
  cookieUserId.value = "";
  navigateTo("/login");
};

// 日付が変わったらデータ更新
watch(currentDate, (newValue) => {
  emit("update:modelValue", newValue);
});
// 親の変更を検知
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      currentDate.value = newValue;
      showCalendar.value = true;
    }
  },
  { immediate: true }
);
</script>
