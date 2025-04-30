<template>
  <div>
    <div class="flex flex-wrap justify-start gap-4">
      <!-- 画像を8個横並びに表示 -->
      <div v-for="(item, index) in refDispImg" :key="item.alt" class="w-1/8">
        <img :src="item.imgDt" :alt="item.alt" class="w-full h-20 object-cover" />
      </div>
    </div>
  </div>
</template>

<script setup>
// reactive
const refDispImg = ref([]);
const tstdt = [
  { alt: "war", img: "img071.png", img2: "", dsp: false },
  { alt: "hkn", img: "img011.png", img2: "img012.png", dsp: true },
  { alt: "isi", img: "img021.png", img2: "img022.png", dsp: true },
  { alt: "nyo", img: "img031.png", img2: "img032.png", img3: "img030.png", dsp: true },
  { alt: "mon", img: "img041.png", img2: "img042.png", dsp: true },
  { alt: "jim", img: "img051.png", img2: "img052.png", dsp: true },
  { alt: "etc", img: "img061.png", img2: "img062.png", dsp: true },
];

// トグル用の状態
const isImg1 = ref(true);

// mount
onMounted(() => {
  dispUpdate();
});

const dispUpdate = () => {
  refDispImg.value.splice(0);
  tstdt.forEach((item) => {
    if (item.dsp) {
      const imgToDisplay = isImg1.value ? item.img : item.img2; // isImg1がtrueならimg、falseならimg2を使用
      item.imgDt = new URL(`../assets/image/${imgToDisplay}`, import.meta.url).href;
      refDispImg.value.push(item);
    }
  });
};
</script>
