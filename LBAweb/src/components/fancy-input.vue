<script setup>
defineProps({
  modelValue: String, // Accepting the v-model value
  type: {
    type: String,
    default: "text",
  },
  label: {
    type: String,
    default: "Enter text",
  },
});

defineEmits(["update:modelValue"]);
</script>
<template>
  <div class="relative w-full">
    <input
      :type="type"
      :id="label.toLowerCase().replace(/\s/g, '-')"
      class="peer w-full rounded-2xl border border-white/20 bg-black/10 px-3 pt-6 pb-2 text-base text-white shadow-md backdrop-blur-3xl hover:bg-black/20 hover:shadow-lg focus:bg-black/20 focus:ring-2 focus:ring-white/50 focus:outline-none"
      placeholder=""
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      required />
    <label
      :for="label.toLowerCase().replace(/\s/g, '-')"
      class="peer-focus:text-selected pointer-events-none absolute top-2 left-3 -translate-y-0 text-sm text-white transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-sm">
      {{ label }}
    </label>
  </div>
</template>
