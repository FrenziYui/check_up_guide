<template>
  <details ref="showMenu" class="dropdown dropdown-end">
    <summary class="btn m-1 bg-transparent border-none p-0 cursor-pointer flex items-center min-w-[2rem]">
      <img src="/icon/language.svg" alt="lang" class="w-8 h-8 cursor-pointer" />
    </summary>
    <ul class="menu dropdown-content bg-blue-500 rounded-box z-[1] w-52 p-2 shadow">
      <li><a @click="toggleLanguage('ja')">日本語</a></li>
      <li><a @click="toggleLanguage('zh')">中文</a></li>
      <li><a @click="toggleLanguage('en')">English</a></li>
    </ul>
  </details>
</template>
<script setup lang="ts">
import type { LangKey } from "../types/langType";

const emit = defineEmits<{ (event: "langage-sent", langage: LangKey): void }>();
// emit定義 end
const showMenu = ref<HTMLDetailsElement | null>(null);
const toggleLanguage = (val: LangKey) => {
  emit("langage-sent", val);
  if (showMenu.value) {
    showMenu.value.removeAttribute("open");
  }
};
</script>
