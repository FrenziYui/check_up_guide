<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-auto bg-black/50 flex" @click="close">
    <div class="relative p-8 bg-amber-100 w-full max-w-xl m-auto flex-col flex rounded-lg" @click.stop>
      <div class="flex justify-between items-center pb-3">
        <p class="text-3xl font-bold">{{ message }}</p>
        <img
          src="/icon/close.svg"
          @click="close"
          class="cursor-pointer z-50 opacity-70 hover:opacity-100 hover:bg-accent hover:rounded-full"
        />
      </div>
      <div class="mb-5"></div>
      <div class="flex flex-wrap justify-center pt-2 gap-3">
        <button
          v-for="(btn, index) in buttons"
          :key="index"
          :class="[btn.class ?? 'btn btn-primary', 'w-[150px]', 'h-22', 'text-center', 'text-xl']"
          @click="handleClick(btn)"
          v-html="btn.label"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Button {
  label: string;
  class?: string;
  action?: string;
}

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
  buttons: {
    type: Array as () => Button[],
    default: () => [
      { label: "キャンセル", class: "btn btn-primary", action: "cancel" },
      { label: "OK", class: "btn btn-info", action: "confirm" },
    ],
  },
});

const emit = defineEmits(["update:isOpen", "confirm", "cancel", "button-click"]);

const close = () => {
  emit("update:isOpen", false);
};

const handleClick = (btn: Button) => {
  if (btn.action === "confirm") {
    emit("confirm");
    close();
  } else if (btn.action === "cancel") {
    emit("cancel");
    close();
  } else {
    emit("button-click", btn.action);
    close();
  }
};
</script>
