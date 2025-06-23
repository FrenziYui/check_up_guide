<template>
  <div>
    <p class="font-semibold mb-2">患者ID</p>
    <input type="text" class="input input-bordered w-full" v-model="localValue" @blur="lostFocus" />
    <p v-if="responseMessage" class="text-green-600 mt-1">{{ responseMessage }}</p>
    <ToastMessage v-model="toastVisible" :message="toastMessage" type="error" vPos="middle" hPos="center" />
  </div>
</template>

<script setup lang="ts">
const { $axios2 } = useNuxtApp();

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const localValue = ref(props.modelValue);

// トースト状態
const toastVisible = ref(false);
const toastMessage = ref("");

const responseMessage = ref("");
// トースト表示
const showToast = (message: string) => {
  toastMessage.value = message;
  toastVisible.value = true;
};

const lostFocus = async () => {
  responseMessage.value = "";

  const raw = localValue.value.trim();

  if (raw.length > 8) {
    showToast(`8桁以内で入力してください。`);
    return;
  }

  // ゼロ埋め
  const padded = raw.padStart(8, "0");
  localValue.value = padded;

  try {
    const formData = new FormData();
    formData.append("kancd", JSON.stringify(localValue.value));
    const response = await $axios2.post("/get-pdfs", formData);
  } catch (error) {
    showToast(`患者が存在しません`);
  }
};
</script>
