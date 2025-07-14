<template>
  <Header v-model:modelValue="currentDate" @Clicked="changeDisplay" />
  <DataList v-if="currentDate" :currentDate="currentDate" :showOrder="showOrder" />
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});
import type { CookieData } from "~/types/cookieType";
// 定数読込
const { COOKIE_SETTING } = useConstants();

// cookie
const cookieCurrentDate = useCookie<CookieData["currentDate"]>("currentDate", COOKIE_SETTING);

const currentDate = ref("");
const showOrder = ref(false);

onMounted(async () => {
  currentDate.value = String(cookieCurrentDate.value);
});
const changeDisplay = () => {
  showOrder.value = !showOrder.value;
};
</script>
