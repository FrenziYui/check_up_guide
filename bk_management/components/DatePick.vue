<template>
  <div class="form-control w-40 max-w-xs ml-3">
    <input
      ref="datepicker"
      type="text"
      placeholder="日付を選択"
      class="input input-bordered w-40 max-w-xs h-8 bg-info"
    />
  </div>
</template>

<script setup lang="ts">
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Japanese } from "flatpickr/dist/l10n/ja.js";

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const datepicker = ref<HTMLElement | null>(null);

onMounted(() => {
  const defaultDate = props.modelValue
    ? new Date(
        `${props.modelValue.slice(0, 4)}-${props.modelValue.slice(
          4,
          6
        )}-${props.modelValue.slice(6)}`
      )
    : null;

  if (datepicker.value) {
    flatpickr(datepicker.value, {
      locale: Japanese,
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "Y年m月d日",
      defaultDate: defaultDate || "", // modelValueが空の場合、空文字列を渡す
      onChange: (selectedDates) => {
        if (selectedDates[0]) {
          const formattedDate = formatDateToString(selectedDates[0]);
          emit("update:modelValue", formattedDate);
        } else {
          emit("update:modelValue", "");
        }
      },
    });
  }
});
</script>
