<template>
  <div class="flex items-center justify-center min-h-screen bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl p-4">
      <div class="text-right text-3xl font-mono mb-4 min-h-[3rem]">{{ display }}</div>
      <div class="grid grid-cols-4 gap-2">
        <button v-for="btn in buttons" :key="btn" @click="press(btn)" class="btn btn-outline">
          {{ btn }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const display = ref("");

const buttons = ["7", "8", "9", "DEL", "4", "5", "6", "/", "1", "2", "3", "*", "0", ".", "=", "+", "-", "C"];

const press = (btn: string) => {
  if (btn === "C") {
    display.value = "";
  } else if (btn === "DEL") {
    display.value = display.value.slice(0, -1);
  } else if (btn === "=") {
    try {
      display.value = eval(display.value).toString();
    } catch (e) {
      display.value = "Error";
    }
  } else {
    display.value += btn;
  }
};
</script>
