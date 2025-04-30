<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-base-200 rounded-lg p-6 shadow-lg">
      <div class="flex flex-col items-center">
        <span class="loading loading-spinner loading-lg text-secondary"></span>
        <p class="mt-4 text-info text-3xl">読み込み中...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(["isLoading"]);
</script>
