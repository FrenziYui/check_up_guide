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
        v-for="(val, index) in tabs"
        :key="index"
        @click="selectedTab = index"
        :class="[
          'px-4 py-2 rounded-lg border transition text-xl',
          selectedTab === index
            ? 'bg-secondary text-secondary-foreground border-gray-500'
            : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-100',
        ]"
      >
        {{ val.label }}
      </button>
    </div>

    <!-- 下部の表示内容 -->
    <div class="w-full px-4">
      <div class="w-full p-4 border border-gray-400 rounded-lg bg-base shadow">
        <div v-if="selectedTab === 0">
          <TabStoolUrine v-model:data="dataStoolUrine" @update:data="updateStoolUrine" />
        </div>
        <div v-if="selectedTab === 1">
          <TabChkJimu v-model:data="dataJimu" @update:data="updateJimu" />
        </div>
        <div v-if="selectedTab === 2">
          <TabChkMonshin v-model:data="dataMonshin" @update:data="updateMonshin" />
        </div>
        <div v-if="selectedTab === 3">
          <TabChkHoken v-model:data="dataHoken" @update:data="updateHoken" />
        </div>
        <div v-if="selectedTab === 4">
          <TabChkIshi v-model:data="dataIshi" @update:data="updateIshi" />
        </div>
        <div v-else-if="selectedTab === 5"><TabPersonalInfo /></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 型
import type { ToastProps } from "~/types/toastType";
import type { PatientData, CookieData } from "~/types/baseType";

// 定数
const { MSG, COOKIE_SETTING } = useConstants();
const tabs = [
  { label: "便/尿検査", param: "urine" },
  { label: "事務", param: "checkjim" },
  { label: "問診票", param: "checkmon" },
  { label: "保健師", param: "checkhkn" },
  { label: "医師", param: "checkish" },
  { label: "その他", param: "other" },
] as const;

// cookie
const cookieToday = useCookie<CookieData["today"]>("today", COOKIE_SETTING);
const cookieDocId = useCookie<CookieData["docid"]>("docid", COOKIE_SETTING);

// Toast表示用
const toastVisible = ref(false);
const toastPops = ref<ToastProps>({ message: "" });

// reactiveデータ
const selectedTab = ref(0);

// 各タブのデータセット&更新
const { dataStoolUrine, setStoolUrine, updStoolUrine } = useTabStoolUrine();
const { dataHoken, setHoken, updHoken } = useTabHoken();
const { dataIshi, setIshi, updIshi } = useTabIshi();
const { dataMonshin, setMonshin, updMonshin } = useTabMonshin();
const { dataJimu, setJimu, updJimu } = useTabJimu();

// Firestoreデータ取得
const { data: firedata, error: fireerror } = await useFirestoreDocument<PatientData>(
  cookieToday.value.toString(),
  cookieDocId.value
);

// state
const selectTab = useState<string>("selectTab");

onMounted(async () => {
  const param = selectTab.value;

  // "panic" の場合は "その他" にマッピング
  const actualParam = param === "panic" ? "other" : param;

  const index = tabs.findIndex((tab) => tab.param === actualParam);
  if (index !== -1) {
    selectedTab.value = index;
  } else {
    selectedTab.value = 0;
  }

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
    setHoken(firedata.value);
    setIshi(firedata.value);
    setMonshin(firedata.value);
    setJimu(firedata.value);
  }
});

// 便尿の値更新
const updateStoolUrine = async () => {
  if (firedata.value?.dispBtn) {
    await updStoolUrine(
      cookieToday.value.toString(),
      cookieDocId.value,
      firedata.value.dispBtn,
      (err) => {
        toastPops.value = { message: err, type: "error", vPos: "middle", hPos: "center" };
        toastVisible.value = true;
      },
      () => navigateTo("/")
    );
  }
};
// 保健師チェックの値更新
const updateHoken = async () => {
  if (firedata.value?.dispBtn) {
    await updHoken(
      cookieToday.value.toString(),
      cookieDocId.value,
      firedata.value.dispBtn,
      (err) => {
        toastPops.value = { message: err, type: "error", vPos: "middle", hPos: "center" };
        toastVisible.value = true;
      },
      () => navigateTo("/")
    );
  }
};
// 医師チェックの値更新
const updateIshi = async () => {
  if (firedata.value?.dispBtn) {
    await updIshi(
      cookieToday.value.toString(),
      cookieDocId.value,
      firedata.value.dispBtn,
      (err) => {
        toastPops.value = { message: err, type: "error", vPos: "middle", hPos: "center" };
        toastVisible.value = true;
      },
      () => navigateTo("/")
    );
  }
};
// 問診チェックの値更新
const updateMonshin = async () => {
  if (firedata.value?.dispBtn) {
    await updMonshin(
      cookieToday.value.toString(),
      cookieDocId.value,
      firedata.value.dispBtn,
      (err) => {
        toastPops.value = { message: err, type: "error", vPos: "middle", hPos: "center" };
        toastVisible.value = true;
      },
      () => navigateTo("/")
    );
  }
};
// 事務チェックの値更新
const updateJimu = async () => {
  if (firedata.value?.dispBtn) {
    await updJimu(
      cookieToday.value.toString(),
      cookieDocId.value,
      firedata.value.dispBtn,
      (err) => {
        toastPops.value = { message: err, type: "error", vPos: "middle", hPos: "center" };
        toastVisible.value = true;
      },
      () => navigateTo("/")
    );
  }
};
</script>
