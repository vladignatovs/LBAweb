<script setup>
import { ref } from "vue";

defineProps({
  modelValue: File,
  label: String,
  accept: String,
});

const emit = defineEmits(["update:modelValue"]);
const inputRef = ref(null);

const handleChange = (event) => {
  const file = event.target.files?.[0] || null;
  emit("update:modelValue", file);
};

const clearFile = () => {
  if (inputRef.value) {
    inputRef.value.value = "";
    emit("update:modelValue", null);
  }
};
</script>
<template>
  <div class="group relative w-full">
    <input
      type="file"
      :id="label.toLowerCase().replace(/\s/g, '-')"
      ref="inputRef"
      :accept="accept"
      @change="handleChange"
      class="peer absolute inset-0 z-10 w-full cursor-pointer opacity-0" />
    <div
      class="w-full rounded border border-white/20 bg-black/10 px-3 pt-6 pb-2 text-base text-white shadow-md backdrop-blur-3xl group-hover:bg-black/20 hover:bg-black/20 hover:shadow-lg">
      <span class="text-white/80">
        {{ modelValue?.name || "defaultThumbnail.webp" }}
      </span>
    </div>
    <button
      v-if="modelValue"
      @click.stop="clearFile"
      class="text-danger hover:text-danger/60 absolute top-0 right-0 z-50 h-full cursor-pointer p-1 transition-all duration-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24">
        <!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE -->
        <path
          fill="currentColor"
          d="m7 19l5-5l1.88 1.88c-.55.91-.88 1.98-.88 3.12zm3-8.5C10 9.67 9.33 9 8.5 9S7 9.67 7 10.5S7.67 12 8.5 12s1.5-.67 1.5-1.5m3.09 9.5H6V4h7v5h5v4.09c.33-.05.66-.09 1-.09s.67.04 1 .09V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h7.81c-.35-.61-.6-1.28-.72-2m8.03-4.54L19 17.59l-2.12-2.12l-1.41 1.41L17.59 19l-2.12 2.12l1.41 1.42L19 20.41l2.12 2.13l1.42-1.42L20.41 19l2.13-2.12z" />
      </svg>
    </button>
    <label
      :for="label.toLowerCase().replace(/\s/g, '-')"
      class="pointer-events-none absolute top-2 left-3 text-sm text-white transition-all">
      {{ label }}
    </label>
  </div>
</template>
