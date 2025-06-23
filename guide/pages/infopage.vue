<template>
  <Header :title="headtitle" :showLangChange="false" />

  <div class="flex flex-col items-center justify-start min-h-screen pt-5">
    <!-- 上部中央のボタン -->
    <div class="flex justify-center gap-4 mb-3">
      <button
        v-for="(label, index) in tabs"
        :key="index"
        @click="selectedTab = index"
        :class="[
          'px-4 py-2 rounded-lg border transition text-xl',
          selectedTab === index
            ? 'bg-secondary text-secondary-foreground border-gray-500'
            : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-100',
        ]"
      >
        {{ label }}
      </button>
    </div>

    <!-- 下部の表示内容 -->
    <div class="w-full px-4">
      <div class="w-full p-4 border border-gray-400 rounded-lg bg-base shadow">
        <div v-if="selectedTab === 0"><TabStoolUrine /></div>
        <div v-else-if="selectedTab === 1"><TabChkJimu /></div>
        <div v-else-if="selectedTab === 2"><TabChkMonshin /></div>
        <div v-else-if="selectedTab === 3"><TabChkHoken /></div>
        <div v-else-if="selectedTab === 4"><TabChkIshi /></div>
        <div v-else-if="selectedTab === 5"><TabPersonalInfo /></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const headtitle = ref("");
// state
const headTitle = useState<string>("headTitle");

onMounted(async () => {
  if (!headTitle.value) {
    navigateTo("/");
  }
  headtitle.value = headTitle.value;
});

const tabs = ["便/尿検査", "事務", "問診票", "保健師", "医師", "その他"];
const selectedTab = ref(0);
</script>
