<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex"
    @click="close"
  >
    <div
      class="relative p-8 bg-neutral-content w-full max-w-md m-auto flex-col flex rounded-lg"
      @click.stop
    >
      <div class="flex justify-between items-center pb-3">
        <p class="text-3xl font-bold">{{ title }}</p>
        <img
          src="@/assets/icon/close.svg"
          @click="close"
          class="cursor-pointer z-50 opacity-70 hover:opacity-100 hover:bg-accent hover:rounded-full"
        />
      </div>
      <div class="mb-5">
        <slot>
          <p class="text-2xl font-bold">{{ message }}</p>
        </slot>
      </div>
      <div class="flex justify-end pt-2">
        <slot name="actions">
          <button
            @click="close"
            class="text-xl font-medium px-4 py-2 bg-green-400 text-black rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            ＯＫ
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "モーダルタイトル",
  },
  message: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:isOpen"]);

const close = () => {
  emit("update:isOpen", false);
};
</script>
