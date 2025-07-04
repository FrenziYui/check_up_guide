<template>
  <div class="fixed inset-0 bg-gray-800/80 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
      <h2 class="text-xl font-bold mb-6">パスワードを入力してください</h2>

      <div class="grid grid-cols-3 gap-4 mb-6">
        <button
          v-for="n in 9"
          :key="n"
          class="bg-secondary text-2xl py-3 rounded-md hover:bg-secondary-content"
          @click="append(n.toString())"
        >
          {{ n }}
        </button>
        <button class="bg-yellow-100 text-xl py-3 rounded-md hover:bg-yellow-200" @click="clear">C</button>
        <button class="bg-secondary text-2xl py-3 rounded-md hover:bg-secondary-content" @click="append('0')">0</button>
        <button class="bg-yellow-100 text-xl py-3 rounded-md hover:bg-yellow-200" @click="back">←</button>
      </div>

      <div class="text-lg mb-4">入力中: {{ masked }}</div>

      <div class="flex justify-between gap-4">
        <button class="btn btn-primary flex-1 py-3 text-lg" @click="$emit('cancel')">キャンセル</button>
        <button class="btn btn-info flex-1 py-3 text-lg" @click="submit">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["submit", "cancel"]);

const code = ref("");
const masked = computed(() => "*".repeat(code.value.length));

const append = (val: string) => {
  if (code.value.length < 6) code.value += val;
};
const back = () => (code.value = code.value.slice(0, -1));
const clear = () => (code.value = "");
const submit = () => emit("submit", code.value);
</script>
