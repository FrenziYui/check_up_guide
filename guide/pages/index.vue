<template>
  <div class="flex flex-col h-screen">
    <Header />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>
