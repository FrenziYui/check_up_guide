<template>
  <CommonToastMessage
    v-model="toastVisible"
    :message="toastPops.message"
    :type="toastPops.type"
    :vPos="toastPops.vPos"
    :hPos="toastPops.hPos"
  />
  <button :class="computedClass" id="double-tap-target" @touchend="handleDoubleTap">
    <span class="flex-1 text-left">
      {{ props.investigationData.DispName }}
    </span>
    <img src="/icon/check.svg" alt="check" class="w-8 h-8 ml-auto" v-if="props.investigationData.Status === '1'" />
    <img
      src="/icon/task.svg"
      alt="check"
      class="w-8 h-8 ml-auto"
      v-if="props.investigationData.Active == props.investigationData.InpCd"
    />
  </button>
  <PasscodeModal v-if="showPasscode" @submit="handlePasswordSubmit" @cancel="showPasscode = false" />
  <CommonMultiModal
    v-model:isOpen="showModal"
    title="状態変更"
    :message="`${investigationData.DispJpn}の状態を変更します`"
    :buttons="modalBtn"
    @button-click="handleCustomAction"
    @cancel="showModal = false"
  />
</template>
<script setup lang="ts">
import type { InvestigationData, PatientData } from "~/types/baseType";
import type { ToastProps } from "~/types/toastType";

// 定数
const { MSG, COOKIE_SETTING, AQXIOS_TIMEOUT } = useConstants();

// cookie
const cookiePatient = useCookie<string>("patientNo", COOKIE_SETTING);
const cookieToday = useCookie<string>("today", COOKIE_SETTING);

// Toast表示用
const toastVisible = ref(false);
const toastPops = ref<ToastProps>({ message: "" });

// ダブルタップ検知用
const lastTap = ref(0);
const doubleTapThreshold = 300; // ダブルタップと認識する時間の間隔（ミリ秒）

// モーダル表示用
const showModal = ref(false);
const showPasscode = ref(false);

// plugin
const { $axios2 } = useNuxtApp();

// モーダルのボタン設定
const modalBtn = ref([
  { label: "次の検査に指定する", class: "btn btn-info ", action: "next" },
  { label: "検査済に変更する", class: "btn btn-secondary", action: "zumi" },
  { label: "未検査に変更する", class: "btn btn-success", action: "no" },
  { label: "キャンセル", class: "btn btn-primary", action: "cancel" },
]);
// Props
const props = defineProps<{ investigationData: InvestigationData }>();

// 表示用クラス
const baseClass = "w-full btn text-2xl font-medium";
const status0Class = "bg-secondary text-secondary-foreground ";
const active = "bg-green-400 text-secondary-foreground ";
const status9Class = "bg-gray-400 text-secondary-foreground ";
const computedClass = computed(() => {
  switch (true) {
    case props.investigationData.Active == props.investigationData.InpCd:
      return `${baseClass} ${active}`;
    case props.investigationData.Status == "1":
      return `${baseClass} ${status9Class}`;
    default:
      return `${baseClass} ${status0Class}`;
  }
});

// ダブルタップ時の処理
const handleDoubleTap = (event: TouchEvent) => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap.value;

  if (tapLength < doubleTapThreshold && tapLength > 0) {
    showPasscode.value = true;
  }

  lastTap.value = currentTime;
};

// パスワードチェック&モーダル表示
const handlePasswordSubmit = (pass: string) => {
  if (pass === "1") {
    showPasscode.value = false;
    showModal.value = true;
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

// モーダルで指定されたデータの更新を行う
const handleCustomAction = async (action: string) => {
  const collection = cookieToday.value.toString();
  const document = "00" + cookiePatient.value;
  switch (action) {
    case "next":
      const { error, setDocument } = useFirestoreDocumentUpdate();
      const success = await setDocument(collection, document, { force: props.investigationData.InpCd }, true);
      if (!success) {
        toastPops.value = {
          message: error.value ?? MSG.E000,
          type: "error",
          vPos: "middle",
          hPos: "center",
        };
      } else {
        firestoreUpdate(collection,document);
      }
      break;
    case "zumi":
      const { data: firedata, error: fireerror } = await useFirestoreDocument<PatientData>(collection, document);
      console.log(firedata.value?.completed);
      break;
    case "no":
      console.log("ステータスCです");
      break;
    default:
      break;
  }
};
const firestoreUpdate = async (collection:string,document:string) => {
  try {
    const requestdata = {
      lang: collection,
      answer: document,
    };
    const response = await $axios2.post("/post-answer", requestdata, {
      timeout: AQXIOS_TIMEOUT,
    });
    if (response.data.status < 0) {
      throw new Error("update 失敗");
    }
  } catch (error) {
    toastPops.value = {
      message: MSG.E001,
      type: "error",
      vPos: "middle",
      hPos: "center",
    };
    toastVisible.value = true;
  }
};
</script>
<style scoped>
#double-tap-target {
  touch-action: manipulation; /* ダブルタップのズームを無効化 */
}
</style>
