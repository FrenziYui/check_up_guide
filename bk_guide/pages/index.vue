<template>
  <div class="flex flex-col h-screen font-ja">
    <header class="iseikai-color text-white px-6 flex items-center justify-between">
      <div class="flex items-center gap-4 max-w-xl">
        <h1 class="text-3xl font-bold">
          {{ refDispData.courseNm }}
        </h1>
      </div>
      <div class="flex items-center gap-6">
        <!-- 左メニュー -->
        <div class="drawer">
          <input id="my-drawer" type="checkbox" class="drawer-toggle" />
          <div class="drawer-content">
            <label for="my-drawer" class="cursor-pointer">
              <img src="@/assets/icon/burger.svg" alt="menu" class="w-8 h-8" />
            </label>
          </div>
          <div class="drawer-side">
            <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
            <ul class="menu bg-base-200 text-base-content text-3xl min-h-full w-80 pl4 pt-10">
              <div v-for="(item, index) in checkMenu" :key="item.val">
                <CheckMenuBtn
                  :menuData="{
                    DispName: item.title,
                    Status: '0',
                    MenuCd: item.val,
                  }"
                  @menuClick="onMenuClick"
                />
              </div>
            </ul>
          </div>
        </div>
        <LangageCng @langage-sent="langageValueSent" />
        <img src="@/assets/icon/logout.svg" alt="logout" class="w-8 h-8" @click="handleLogout" />
      </div>
    </header>
    <!-- 名前等エリア -->
    <div class="h-36 m-1 border rounded-xl border-gray-600 flex overflow-hidden">
      <!-- 左側のコンテンツ -->
      <div class="w-[69%] flex flex-col justify-center">
        <div class="ml-3 mb-2 text-3xl flex items-center">
          <span>ID:{{ refDispData.patientId }}</span>
          <span class="ml-5">生年月日: {{ refDispData.birthDate }}</span>
        </div>
        <div class="ml-3 overflow-hidden whitespace-nowrap text-ellipsis">
          <ruby class="text-5xl">
            {{ refDispData.patientName }} 様
            <rt> {{ refDispData.patientKana }} サマ </rt>
          </ruby>
        </div>
      </div>

      <!-- 右側のコンテンツ -->
      <div class="w-[31%] flex mr-1 flex-col justify-center overflow-hidden">
        <div class="ml-1 flex justify-center items-center h-full">
          <vue-barcode
            :value="refDispData.patientId"
            format="codabar"
            :options="{
              displayValue: false,
              height: 90,
              width: 3,
              margin: 0,
            }"
            class="max-w-full"
            >読み込みに失敗しました</vue-barcode
          >
        </div>
      </div>
    </div>

    <!-- 診察中止 -->
    <div v-if="refDispData.suspend" class="flex flex-wrap gap-1 px-6 pt-3 text-4xl text-red-500">
      <div>{{ t("t0101") }}</div>
      <div>{{ t("t0102") }}</div>
    </div>

    <!-- 診察ボタン -->
    <div
      :class="['flex-none p-6 overflow-y-auto', refDispData.suspend ? 'h-[16rem]' : 'h-[22rem]']"
    >
      <div class="flex flex-wrap gap-4">
        <div
          v-for="(item, index) in refDispData.dispCd"
          :key="item.inpCd"
          class="w-[calc(50%-0.5rem)]"
        >
          <InvestigationBtn
            :investigationData="{
              InpCd: item.inpCd,
              DispName: t(item.inpCd),
              Status: item.status,
              Active: item.active,
            }"
            @doubletap="onDoubleTap"
          />
        </div>
      </div>
    </div>

    <!-- 次の診察 -->
    <div
      class="h-20 m-1 p-3 border rounded-xl text-5xl text-blue-600 border-gray-600 flex justify-between items-center"
    >
      <div>{{ t("t0100") }}{{ t(refDispData.next) }}</div>
      <button
        class="text-xl font-medium px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out"
        :class="[
          isDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
            : 'bg-accent text-black hover:bg-accent hover:bg-opacity-50',
        ]"
        @click="openModal"
        :disabled="isDisabled"
        :aria-disabled="isDisabled"
      >
        MAP
      </button>
    </div>

    <!-- 次の診察確認ボタン -->
    <ConfModal
      v-model:isOpen="showModal"
      title="次の検査変更"
      :message="`次の検査を「${t('z' + activeCd.slice(1))}」に変更します。`"
      @confirm="handleConfirm"
    />
    <!-- ログアウト確認ボタン -->
    <ConfModal
      v-model:isOpen="showModalLogout"
      title="ログアウト"
      message="ログアウトしログイン画面に移動しますがよろしいですか？"
      @confirm="handleConfirmLogout"
    />
    <!-- 地図の画像 -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="relative bg-white p-4 rounded shadow-lg z-50">
        <img
          :src="imageUrl"
          alt="Sample Image"
          class="max-w-full max-h-full transform transition-transform duration-200"
          ref="modalImage"
        />
        <button
          @click="closeModal"
          class="mt-4 mx-auto block px-4 py-2 bg-accent text-black rounded hover:bg-accent hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Close
        </button>
      </div>
    </div>

    <!-- 身体情報・アレルギー表示 -->
    <checkItem class="py-4 px-6" />
    <!-- メモ表示 -->
    <div class="badge mt-1 ml-3 badge-info badge-lg text-xl">メモ</div>
    <div
      class="h-48 m-1 px-2 border rounded-xl border-gray-600 overflow-y-auto"
      @click="openModalMemo"
    >
      <div class="text-3xl">
        <div class="mt-1 whitespace-pre-line">
          {{ refDispData.memo }}
        </div>
      </div>
    </div>
    <!-- メモ入力欄 -->
    <div
      v-if="showModalMemo"
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
    >
      <MemoModal
        v-model:isOpen="showModalMemo"
        :message="refDispData.memo"
        :devId="cookiePatient"
      />
    </div>
    <!-- メニュー -->
    <!-- 保健師チェック -->
    <div
      v-if="showMenu == '1'"
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
    >
      <MenuHealthNurse v-model:isMenu="showMenu" :devId="cookiePatient" />
    </div>
    <!-- 医師チェック -->
    <div
      v-if="showMenu == '2'"
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
    >
      <MenuDoctor v-model:isMenu="showMenu" :devId="cookiePatient" />
    </div>
    <!-- 便・尿検査 -->
    <div
      v-if="showMenu == '3'"
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
    >
      <MenuStoolUrine v-model:isMenu="showMenu" :devId="cookiePatient" />
    </div>
    <!-- 問診票 -->
    <div
      v-if="showMenu == '4'"
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
    >
      <MenuQuestionnaire v-model:isMenu="showMenu" :devId="cookiePatient" />
    </div>
    <!-- 事務 -->
    <div
      v-if="showMenu == '5'"
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
    >
      <MenuClerical v-model:isMenu="showMenu" :devId="cookiePatient" />
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
import VueBarcode from "@chenfengyuan/vue-barcode";
import { useI18n } from "vue-i18n";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import { doc, onSnapshot, deleteDoc } from "firebase/firestore";
import type { DocumentSnapshot, DocumentData } from "firebase/firestore";

// 型指定
import type { InvestigationData, DispCdItem, RefDispData, MenuData } from "../types/basetype";
import type { PatientData } from "../types/patienttype";

// その他定数
const NEXTID = "z"; // 次はに表示されるデフォルト値、

// reactive変数
const showModal = ref(false);
const showModalLogout = ref(false);
const showModalMemo = ref(false);
const showMenu = ref("0");
const activeCd = ref(NEXTID);
const isDisabled = ref(true);
const imageUrl = ref("");
const refDispData = ref<RefDispData>({
  patientId: "99999999",
  patientName: "",
  patientKana: "",
  birthDate: "",
  courseNm: "",
  memo: "",
  info: [],
  suspend: "",
  next: NEXTID,
  dispCd: [],
});
const checkMenu = ref([
  { title: "保険師チェック", val: "1" },
  { title: "医師チェック", val: "2" },
  { title: "便・尿検査", val: "3" },
  { title: "問診票チェック", val: "4" },
  { title: "事務チェック", val: "5" },
]);

// 多言語化対応用
const { t, locale } = useI18n();

// その他変数
const router = useRouter();
const cookiePatient = useCookie<string>("patientNo");
const cookieToday = useCookie<string>("today");
const cookieNextInp = useCookie<string>("nextInp", { maxAge: 60 * 60 * 24 * 7 });

// 言語設定
const langageValueSent = (val: string) => {
  locale.value = val;
};
// unmount用
let unsubscribe: () => void;

onMounted(async () => {
  if (!cookiePatient.value) {
    await signOut(auth);
    router.push("/login");
  }
  const docRef = doc(db, cookieToday.value.toString(), cookiePatient.value);
  unsubscribe = onSnapshot(
    docRef,
    (doc: DocumentSnapshot<DocumentData>) => {
      const data = doc.data() as PatientData;
      refDispData.value.patientName = setDataField(data, "name", "氏名取得エラー");
      refDispData.value.patientKana = setDataField(data, "kana", "カナシュトクエラー");
      refDispData.value.birthDate = setDataField(data, "birthDate", "9999/99/99");
      refDispData.value.patientId = setDataField(data, "patientId", "99999999");
      refDispData.value.courseNm = setDataField(data, "courseNm", "コース取得エラー");
      refDispData.value.memo = setDataField(data, "memo", "");
      refDispData.value.suspend = setDataField(data, "suspend", "");
      if (data["info"]) {
        refDispData.value.info = data["info"];
      }

      if (cookieNextInp.value) {
        refDispData.value.next = cookieNextInp.value;
      } else {
        refDispData.value.next = NEXTID;
      }

      refDispData.value.dispCd = [];
      data.dispCd.forEach((item) => {
        let wkActive: boolean = false;

        if (refDispData.value.next == item.inpCd) {
          if (item.status != "9") {
            wkActive = true;
          } else {
            refDispData.value.next = NEXTID;
          }
        }
        refDispData.value.dispCd.push({
          inpCd: item.inpCd,
          status: item.status,
          active: wkActive,
        });
      });
    },
    (error) => {
      refDispData.value.patientName = "ログイン情報不一致";
      refDispData.value.patientKana = "ログインジョウホウフイッチ";
      console.error("Error listening to document:", error);
    }
  );
});

onBeforeUnmount(() => {
  unsubscribe();
});

//
watch(
  () => refDispData.value.next,
  (newValue, oldValue) => {
    if (newValue == NEXTID) {
      isDisabled.value = true;
    } else {
      isDisabled.value = false;
    }
  }
);

// methods
// メニューをタップした時の処理
const onMenuClick = (val: MenuData) => {
  showMenu.value = val.MenuCd;
};

// 検査をダブルタップした時の処理
const onDoubleTap = (val: InvestigationData) => {
  if (val.Status != "9" && activeCd.value != val.InpCd) {
    activeCd.value = val.InpCd;
    showModal.value = true;
    cookieNextInp.value = val.InpCd;
  }
};

// 検査をダブルタップした画面でOKを押した時
const handleConfirm = () => {
  refDispData.value.dispCd.forEach((item: DispCdItem) => {
    item.active = item.inpCd === activeCd.value;
  });
  refDispData.value.next = activeCd.value;
  showModal.value = false;
};

// ログアウトボタンが押下された場合ダイアログを開く
const handleLogout = () => {
  console.log("logout3");
  showModalLogout.value = true;
};

// ログアウトOKの場合
const handleConfirmLogout = async () => {
  console.log("logout");
  if (unsubscribe) {
    unsubscribe();
  }
  console.log("logout2");
  // const docRef = doc(db, cookieToday.value, cookiePatient.value);
  // try {
  //   await deleteDoc(docRef);
  // } catch (error) {
  //   console.error("Error removing document: ");
  // }
  await signOut(auth);
  cookiePatient.value = "";
  cookieNextInp.value = NEXTID;
  router.push("/login");
};
// モーダルの表示・非表示を管理する状態
const isModalOpen = ref(false);

// モーダルを開く関数
function openModal() {
  imageUrl.value = useRuntimeConfig().public.imageBaseUrl + refDispData.value.next + ".png";
  isModalOpen.value = true;
}
// モーダルを開く関数
function openModalMemo() {
  showModalMemo.value = true;
}

// モーダルを閉じる関数
function closeModal() {
  isModalOpen.value = false;
}
</script>
<style>
.iseikai-color {
  background-color: #00a1e5;
}
</style>
