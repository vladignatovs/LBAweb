<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: String,
  type: { type: String, default: "text" },
  label: { type: String, default: "Enter text" },
  id: { type: String, default: null },
  autocomplete: { type: String, default: null },
});

const emit = defineEmits(["update:modelValue", "blur", "submit"]);

// generate an id from label if none provided
const labelId = computed(
  () => props.id ?? props.label.toLowerCase().replace(/\s+/g, "-"),
);

function handleSubmit() {
  emit("submit");
}
</script>
<template>
  <form @submit.prevent="handleSubmit" class="relative w-full">
    <input
      :type="type"
      :id="id ?? labelId"
      :autocomplete="autocomplete"
      class="peer w-full rounded border border-white/20 bg-black/10 px-3 pt-6 pr-12 pb-2 text-base text-white shadow-md backdrop-blur-3xl hover:bg-black/20 hover:shadow-lg focus:bg-black/20 focus:ring-2 focus:ring-white/50 focus:outline-none"
      placeholder=""
      :value="modelValue"
      @input="(e) => $emit('update:modelValue', e.target.value)"
      @blur="$emit('blur', $event)"
      required />
    <label
      :for="labelId"
      class="pointer-events-none absolute top-2 left-3 -translate-y-0 text-sm text-white transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-sm">
      {{ label }}
    </label>

    <button
      type="submit"
      class="absolute top-0 right-0 mr-1 flex h-full items-center justify-center rounded-full p-2 transition hover:text-white/60"
      aria-label="Submit">
      <slot>
        <!-- <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 24 24">
          <path
            d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.52 6.52 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5" />
        </svg> -->
      </slot>
    </button>
  </form>
</template>
