<template>
  <header
    class="bg-secondary text-white p-3 flex items-center justify-between relative"
  >
    <div class="flex items-center space-x-3">
      <DatePick v-model="currentDate" />
      <button class="btn btn-sm btn-info text-white" @click="handleClick">
        表示切替
      </button>
    </div>

    <!-- absoluteで中央に配置 -->
    <div
      class="absolute left-1/2 transform -translate-x-1/2 text-center text-2xl font-semibold whitespace-nowrap"
    >
      <span>人間ドッグ案内システム</span>
    </div>

    <!-- 右に配置 -->
    <div
      class="flex items-center space-x-2 group relative cursor-pointer tooltip tooltip-info tooltip-bottom"
      data-tip="ログアウト"
    >
      <span class="font-semibold whitespace-nowrap">テストタロウ</span>

      <img
        src="@/assets/icon/logout.svg"
        alt="logout"
        class="w-8 h-8"
        @click="logout"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: String,
});
const currentDate = ref(props.modelValue);
const emit = defineEmits(["update:modelValue", "Clicked"]);

watch(currentDate, (newValue) => {
  emit("update:modelValue", newValue);
});

function handleClick() {
  emit("Clicked");
}

const logout = () => {
  console.log("ログアウト処理");
};
</script>
