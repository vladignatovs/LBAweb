<script setup>
defineProps({
  level: { type: Object, required: true },
});
</script>

<template>
  <div>
    <h3 class="font-semibold">{{ level.name }}</h3>
    <h4>Created by: {{ level.creator_name }}</h4>
    <p class="text-sm text-gray-400">
      Created at: {{ new Date(level.created_at).toLocaleDateString() }}
    </p>
  </div>
</template>
