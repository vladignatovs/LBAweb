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
      class="peer w-full rounded-lg border border-black bg-black/30 px-3 pt-6 pb-2 text-base shadow-md backdrop-blur-3xl hover:bg-black/20 hover:shadow-lg focus:bg-black/20 focus:ring-2 focus:ring-white/50 focus:outline-none"
      placeholder=""
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      required />
    <label
      :for="label.toLowerCase().replace(/\s/g, '-')"
      class="absolute top-2 left-3 text-sm text-white transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-[var(--text)]">
      {{ label }}
    </label>
  </div>
</template>
