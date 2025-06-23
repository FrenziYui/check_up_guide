<template>
  <CommonToastMessage
    v-model="toastVisible"
    :message="toastPops.message"
    :type="toastPops.type"
    :vPos="toastPops.vPos"
    :hPos="toastPops.hPos"
  />

  <div class="relative w-full pt-[100%]">
    <button
      class="absolute top-0 left-0 w-full h-full btn rounded-2xl text-xl text-center break-words whitespace-normal flex items-center justify-center p-2"
      :class="buttonClass"
      @click="handleClick"
    >
      {{ label }}
      <span v-if="status === 1 || status === 8 || status === 9" class="absolute bottom-1 right-1">
        <img src="/icon/info.png" v-if="status === 1 || status === 9" class="w-8 h-8" />
        <img src="/icon/check.svg" v-else-if="status === 8" class="w-8 h-8" />
      </span>
    </button>

    <PasscodeModal v-if="showModal" @submit="handlePasswordSubmit" @cancel="showModal = false" />
  </div>
</template>

<script setup lang="ts">
import type { ToastProps } from "../types/toastType";
// 定数
const { MSG } = useConstants();

// state
const selectTab = useState("selectTab");
// Toast表示用
const toastVisible = ref(false);
const toastPops = ref<ToastProps>({ message: "" });

const props = defineProps<{
  label: string;
  status: number;
  param: string;
}>();

const showModal = ref(false);
const router = useRouter();

const handleClick = () => {
  showModal.value = true;
};
const handlePasswordSubmit = (pass: string) => {
  if (pass === "1") {
    selectTab.value = props.param;
    router.push({ path: "/infopage" });
  } else {
    toastPops.value = {
      message: MSG.E003,
      type: "error",
      vPos: "middle",
      hPos: "center",
    };
    toastVisible.value = true;
  }
};
const buttonClass = computed(() => {
  switch (props.status) {
    case 8:
      return "bg-gray-400 text-secondary-foreground ";
    case 9:
      return "bg-red-500 text-white";
    default:
      return "bg-secondary text-secondary-foreground";
  }
});
</script>
