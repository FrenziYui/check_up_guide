<template>
  <Header @Clicked="changeDisplay" v-model="currentDate" />
  <div
    class="m-5 px-5 bg-orange-100 rounded-lg border border-slate-500"
    style="height: 100%"
  >
    <GridT
      :showOrder="showOrder"
      :key="currentDate"
      :currentDate="currentDate"
    />
  </div>
</template>
<script setup lang="ts">
const showOrder = ref(false);
const currentDate = ref<string>(formatDateToString(new Date()));

const changeDisplay = () => {
  showOrder.value = !showOrder.value;
};
</script>
