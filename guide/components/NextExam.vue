<template>
  <div
    class="h-20 mt-5 m-1 p-3 border rounded-xl text-5xl text-blue-600 border-gray-400 flex justify-between items-center"
  >
    <div>aaaaa</div>
    <button
      class="text-xl font-medium px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out"
      :class="[
        isDisabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
          : 'bg-accent text-black hover:bg-accent hover:bg-opacity-50',
      ]"
      @click="openModal"
      :disabled="isDisabled"
      :aria-disabled="isDisabled"
    >
      MAP
    </button>
  </div>
</template>

<script setup lang="ts">
const isDisabled = ref(false);
const openModal = () => {
  console.log("aaa");
};
</script>
