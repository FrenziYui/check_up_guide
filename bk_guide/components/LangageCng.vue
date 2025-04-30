<template>
  <details ref="showMenu" class="dropdown dropdown-end">
    <summary
      class="btn m-1 bg-transparent border-none p-0 cursor-pointer flex items-center min-w-[2rem]"
    >
      <img
        src="@/assets/icon/language.svg"
        alt="lang"
        class="w-8 h-8 cursor-pointer"
      />
    </summary>
    <ul
      class="menu dropdown-content bg-blue-500 rounded-box z-[1] w-52 p-2 shadow"
    >
      <li><a @click="toggleLanguage('ja')">日本語</a></li>
      <li><a @click="toggleLanguage('zh')">中文</a></li>
      <li><a @click="toggleLanguage('en')">English</a></li>
    </ul>
  </details>
</template>
<script setup lang="ts">
// emit定義 start
interface Emits {
  (event: "langage-sent", langage: string): void;
}
const emit = defineEmits<Emits>();
// emit定義 end
const showMenu = ref<HTMLDetailsElement | null>(null);
const toggleLanguage = (val: string) => {
  emit("langage-sent", val);
  if (showMenu.value) {
    showMenu.value.removeAttribute("open");
  }
};
</script>
