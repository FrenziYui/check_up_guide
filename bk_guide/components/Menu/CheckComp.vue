<template>
  <label class="cursor-pointer flex items-center mb-5">
    <input type="checkbox" v-model="isChecked" class="checkbox checkbox-secondary" />
    <span class="text-3xl ml-5">{{ label }}</span>
  </label>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isChecked: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>
