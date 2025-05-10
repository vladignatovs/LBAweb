<script setup>
defineProps({
  user: { type: Object, required: true },
  received: Boolean,
});

const emit = defineEmits(["accept", "deny", "cancel"]);

function onAccept() {
  emit("accept");
}
function onDeny() {
  emit("deny");
}
function onCancel() {
  emit("cancel");
}
</script>
<template>
  <div>
    <div>
      <p class="font-semibold">{{ user.name }}</p>
      <p class="text-sm text-gray-400">{{ user.email }}</p>
    </div>
    <div class="mt-4 space-x-2">
      <template v-if="received">
        <button
          @click="onAccept"
          class="bg-primary rounded px-3 py-1 text-black">
          Accept
        </button>
        <button @click="onDeny" class="rounded bg-red-600 px-3 py-1 text-white">
          Deny
        </button>
      </template>
      <template v-else>
        <button
          @click="onCancel"
          class="rounded bg-red-600 px-3 py-1 text-white">
          Cancel
        </button>
      </template>
    </div>
  </div>
</template>
