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
      {{ item.label }}
      <span class="absolute bottom-1 right-1">
        <img src="/icon/info.png" v-if="item.info == '1'" class="w-7 h-7" />
      </span>
    </button>

    <PasscodeModal v-if="showModal" @submit="handlePasswordSubmit" @cancel="showModal = false" />
  </div>
</template>

<script setup lang="ts">
import type { ToastProps } from "~/types/toastType";
import type { DispItem } from "~/types/baseType";

// 定数
const { MSG } = useConstants();

// state
const selectTab = useState("selectTab");
// Toast表示用
const toastVisible = ref(false);
const toastPops = ref<ToastProps>({ message: "" });

const props = defineProps<{
  item: DispItem;
}>();

const showModal = ref(false);
const router = useRouter();

const handleClick = () => {
  showModal.value = true;
};
const handlePasswordSubmit = async (pass: string) => {
  const { password } = await usePassword();
  if (pass == password.value) {
    selectTab.value = props.item.param;
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
  switch (props.item.status) {
    case 9:
      return "bg-gray-400 text-secondary-foreground ";
    case 8:
      return "bg-red-500 text-white";
    default:
      return "bg-secondary text-secondary-foreground";
  }
});
</script>
