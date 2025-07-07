<template>
  <div>
    <!-- モーダルを開くボタン -->
    <button class="btn btn-primary btn-xl" @click="showModal = true" v-if="!showModal">
      開けゴマ
    </button>

    <!-- モーダル本体 -->
    <div v-if="showModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-3xl mb-4">Password</h3>

        <!-- テンキーパッド -->
        <div class="grid grid-cols-3 gap-4">
          <button
            v-for="key in keys"
            :key="key"
            class="btn btn-outline btn-xl text-3xl border-2 border-gray-500 rounded-lg transition transform active:scale-95 active:bg-gray-300"
            @click="inputKey(key)"
          >
            {{ key }}
          </button>
        </div>

        <!-- 入力値表示 -->
        <div class="mt-4">
          <input
            type="text"
            class="input input-bordered input-lg w-full text-center text-4xl"
            :value="maskedPin"
            readonly
          />
        </div>

        <!-- モーダルのフッター -->
        <div class="modal-action">
          <button class="btn btn-error btn-xl" @click="clearInput">クリア</button>
          <button class="btn btn-xl" @click="submitPin">登録</button>
          <button class="btn btn-secondary btn-xl" @click="showModal = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const showModal = ref(false);
const pin = ref("");
const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Clear", "Enter"];

const maskedPin = computed(() => {
  console.log("aa");
  let abcd;
  abcd = "*".repeat(pin.value.length);
  return abcd; // アスタリスクでマスク
});

// テンキーパッドのキーを入力
const inputKey = (key) => {
  if (key === "Clear") {
    pin.value = "";
  } else if (key === "Enter") {
    submitPin();
  } else {
    pin.value += key;
  }
};

// PINの入力をクリア
const clearInput = () => {
  pin.value = "";
};

// PINを送信
const submitPin = () => {
  console.log("PIN submitted:", pin.value);
  showModal.value = false;
};
</script>
