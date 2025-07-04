<template>
  <input type="checkbox" id="img-modal" class="modal-toggle" />
  <div class="modal">
    <div
      class="modal-box p-0 m-0 relative w-screen h-screen max-w-none max-h-none"
      style="background-color: rgba(0, 0, 0, 0.8)"
    >
      <label
        for="img-modal"
        class="btn btn-sm btn-circle absolute right-4 top-4 z-50 text-white bg-gray-700 hover:bg-gray-900"
        >✕</label
      >

      <swiper
        :modules="modules"
        :slides-per-view="1"
        navigation
        pagination
        scrollbar
        :zoom="{ maxRatio: 3 }"
        @swiper="onSwiper"
        class="w-full h-screen image-swiper"
      >
        <swiper-slide v-for="(img, i) in images" :key="i" class="image-slide">
          <div class="swiper-zoom-container">
            <img :src="img" class="slide-image" />
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Scrollbar, Zoom } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const props = defineProps<{ images: string[] }>();
const swiperInstance = ref<SwiperClass | null>(null);
const modules = [Navigation, Pagination, Scrollbar, Zoom];

const images = ref<string[]>([...props.images]);

watch(
  () => props.images,
  (newImages) => {
    images.value = [...newImages];
    if (swiperInstance.value) {
      swiperInstance.value.update();
      swiperInstance.value.slideTo(0);
    }
  }
);

const onSwiper = (swiper: SwiperClass) => {
  swiperInstance.value = swiper;
};
</script>

<style scoped>
.image-swiper {
  display: flex;
  align-items: center;
}

.image-slide {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
  height: 100% !important;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  pointer-events: none; /* 拡大縮小だけに制限 */
}

.swiper-zoom-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Swiperのデフォルトスタイルを上書き */
.image-swiper .swiper-wrapper {
  align-items: center;
}

.image-swiper .swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
