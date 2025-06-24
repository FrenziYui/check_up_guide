<template>
  <CommonToastMessage
    v-model="toastVisible"
    :message="toastPops.message"
    :type="toastPops.type"
    :vPos="toastPops.vPos"
    :hPos="toastPops.hPos"
  />
  <Header :title="firedata?.courseNm" :showLangChange="false" />
  <div class="flex flex-col items-center justify-start pt-5 h-[calc(100vh-70px)]">
    <!-- 上部中央のボタン -->
    <div class="flex justify-center gap-4 mb-3">
      <button
        v-for="(label, index) in tabs"
        :key="index"
        @click="selectedTab = index"
        :class="[
          'px-4 py-2 rounded-lg border transition text-xl',
          selectedTab === index
            ? 'bg-secondary text-secondary-foreground border-gray-500'
            : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-100',
        ]"
      >
        {{ label }}
      </button>
    </div>

    <!-- 下部の表示内容 -->
    <div class="w-full px-4">
      <div class="w-full p-4 border border-gray-400 rounded-lg bg-base shadow">
        <div v-if="selectedTab === 0"><TabStoolUrine v-model:data="dataStoolUrine" @update:data="updStoolUrine" /></div>
        <div v-else-if="selectedTab === 1">
          <TabChkJimu v-model:data="dataStoolUrine" @update:data="updStoolUrine" />
        </div>
        <div v-else-if="selectedTab === 2"><TabChkMonshin /></div>
        <div v-else-if="selectedTab === 3"><TabChkHoken /></div>
        <div v-else-if="selectedTab === 4"><TabChkIshi /></div>
        <div v-else-if="selectedTab === 5"><TabPersonalInfo /></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 型
import type { ToastProps } from "~/types/toastType";
import type { PatientData, StoolUrine } from "~/types/baseType";

// 定数
const { MSG, COOKIE_SETTING } = useConstants();
const tabs = ["便/尿検査", "事務", "問診票", "保健師", "医師", "その他"];

// cookie
const cookiePatient = useCookie<string>("patientNo", COOKIE_SETTING);
const cookieToday = useCookie<string>("today", COOKIE_SETTING);

// Toast表示用
const toastVisible = ref(false);
const toastPops = ref<ToastProps>({ message: "" });

// reactiveデータ
const selectedTab = ref(0);
const dataStoolUrine = ref<StoolUrine>({
  StoolVisible: false,
  Stool1: "",
  Stool2: "",
  UrineVisible: false,
  Urine1: "",
  Biko: "",
});

// Firestoreデータ取得
const { data: firedata, error: fireerror } = await useFirestoreDocument<PatientData>(
  cookieToday.value.toString(),
  "00" + cookiePatient.value
);

onMounted(async () => {
  if (fireerror.value) {
    toastPops.value = {
      message: MSG.EA01,
      type: "error",
      vPos: "middle",
      hPos: "center",
    };
    toastVisible.value = true;
    setTimeout(() => {
      navigateTo("/");
    }, 3000);
  }
  if (firedata.value) {
    setStoolUrine(firedata.value);
  }
});
// 便尿の値設定
const setStoolUrine = (data: PatientData) => {
  // Firestoreのデータ設定
  if (data.urine) {
    dataStoolUrine.value = data.urine;
  }
  // 尿の表示設定
  const urineItem = data.dispCd.find((item) => item.inpCd === "i9101");
  if (urineItem) {
    dataStoolUrine.value.UrineVisible = urineItem.status === "X" ? false : true;
  }
  // 便の表示設定
  const StoolItem = data.dispCd.find((item) => item.inpCd === "i9102");
  if (StoolItem) {
    dataStoolUrine.value.StoolVisible = StoolItem.status === "X" ? false : true;
  }
};
// 便尿の値更新
const updStoolUrine = async () => {
  const { error, setDocument } = useFirestoreDocumentUpdate<PatientData>();
  const success = await setDocument(
    cookieToday.value.toString(),
    "00" + cookiePatient.value,
    { urine: dataStoolUrine.value },
    true
  );
  if (!success) {
    toastPops.value = {
      message: error.value ?? MSG.E000,
      type: "error",
      vPos: "middle",
      hPos: "center",
    };
    toastVisible.value = true;
  } else {
    navigateTo("/");
  }
};
</script>
