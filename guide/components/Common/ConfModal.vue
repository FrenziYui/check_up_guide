<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-auto bg-black/50 flex" @click="close">
    <div class="relative p-8 bg-amber-100 w-full max-w-md m-auto flex-col flex rounded-lg" @click.stop>
      <div class="flex justify-between items-center pb-3">
        <p class="text-3xl font-bold">{{ title }}</p>
        <img
          src="/icon/close.svg"
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
          <button @click="close" class="btn btn-primary">キャンセル</button>
          <button @click="confirm" class="btn btn-info ml-5">ＯＫ</button>
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

const emit = defineEmits(["update:isOpen", "confirm"]);

const close = () => {
  emit("update:isOpen", false);
};

const confirm = () => {
  emit("confirm");
  close();
};
</script>
