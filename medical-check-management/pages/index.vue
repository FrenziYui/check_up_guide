<template>
  <Header v-model:modelValue="currentDate" />
  <DataList v-if="currentDate" :currentDate="currentDate" />
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

onMounted(async () => {
  currentDate.value = String(cookieCurrentDate.value);
});
</script>
