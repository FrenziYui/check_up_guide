<template>
  <div class="fixed inset-0 bg-gray-800/80 flex items-center justify-center z-50">
    <div class="bg-white p-4 rounded-xl shadow-md w-64 text-center">
      <h2 class="text-lg font-bold mb-2">パスワードを入力してください</h2>
      <div class="grid grid-cols-3 gap-2 mb-4">
        <button v-for="n in 9" :key="n" class="btn" @click="append(n.toString())">{{ n }}</button>
        <button class="btn" @click="clear">C</button>
        <button class="btn" @click="append('0')">0</button>
        <button class="btn" @click="back">←</button>
      </div>
      <div class="mb-2">入力中: {{ masked }}</div>
      <div class="flex justify-between">
        <button class="btn btn-error" @click="$emit('cancel')">キャンセル</button>
        <button class="btn btn-primary" @click="submit">OK</button>
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
