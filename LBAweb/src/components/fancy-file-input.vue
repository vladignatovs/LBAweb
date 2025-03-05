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
      class="w-full rounded-2xl border border-white/20 bg-black/10 px-3 pt-6 pb-2 text-base text-white shadow-md backdrop-blur-3xl group-hover:bg-black/20 hover:bg-black/20 hover:shadow-lg">
      <span class="text-white/80">
        {{ modelValue?.name || "defaultThumbnail.webp" }}
      </span>
    </div>
    <button
      v-if="modelValue"
      @click.stop="clearFile"
      class="absolute top-0 right-0 z-50 h-full cursor-pointer p-1 text-red-400 transition-all duration-200 hover:text-red-200">
      <!-- Added fixed size and padding -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="size-4/5">
        <!-- Make SVG fill button space -->
        <path
          fill="currentColor"
          d="M14 8h4l-4-4zm1.9 12.866l-.688-.689l2.1-2.1l-2.1-2.1l.688-.689l2.1 2.1l2.1-2.1l.689.689l-2.075 2.1l2.075 2.1l-.689.689L18 18.79zM6.616 21q-.691 0-1.153-.462T5 19.385V4.615q0-.69.463-1.152T6.616 3H14.5L19 7.5v4.812q-.263-.06-.507-.09q-.243-.03-.518-.03q-2.442 0-4.151 1.709t-1.708 4.151q0 .74.207 1.528q.208.787.63 1.42z" />
      </svg>
    </button>
    <label
      :for="label.toLowerCase().replace(/\s/g, '-')"
      class="pointer-events-none absolute top-2 left-3 text-sm text-white transition-all">
      {{ label }}
    </label>
  </div>
</template>
