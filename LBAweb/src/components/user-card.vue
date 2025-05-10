<script setup>
const props = defineProps({
  user: { type: Object, required: true },
  isCurrentUser: Boolean,
  isFriend: Boolean,
  isBlocked: Boolean,
  isPending: Boolean,
});

// defineProps({
//   user:       { type: Object, required: true },
//   currentId:  { type: Number, required: true },
//   friendIds:  { type: Array,   default: () => [] },
//   blockedIds: { type: Array,   default: () => [] },
// })

const emit = defineEmits([
  "add-friend",
  "remove-friend",
  "block",
  "unblock",
  "message",
]);

// util functions which emit and use this cards users id
function onAddFriend() {
  emit("add-friend", props.user.id);
}
function onRemoveFriend() {
  emit("remove-friend", props.user.id);
}
function onBlock() {
  emit("block", props.user.id);
}
function onUnblock() {
  emit("unblock", props.user.id);
}
function onMessage() {
  emit("message", props.user.id);
}
</script>
<template>
  <div>
    <h3 class="font-semibold">{{ user.name }}</h3>
    <p class="text-sm text-gray-400">{{ user.email }}</p>

    <div v-if="!isCurrentUser" class="mt-4 flex space-x-2">
      <!-- if we're already friends, show Message + Remove; otherwise Add Friend -->
      <template v-if="isFriend">
        <button
          @click="onMessage"
          class="flex-1 rounded bg-blue-200 px-3 py-1 text-sm font-medium text-black transition hover:bg-blue-300">
          Message
        </button>
        <button
          @click="onRemoveFriend"
          class="flex-1 rounded bg-yellow-400 px-3 py-1 text-sm font-medium text-black transition hover:bg-yellow-500">
          Remove Friend
        </button>
      </template>
      <template v-else-if="isPending">
        <button
          disabled
          class="bg-primary hover:bg-primary-2 flex-1 rounded px-3 py-1 text-sm font-medium text-black transition">
          Request Pending
        </button>
      </template>
      <template v-else>
        <button
          @click="onAddFriend"
          class="bg-primary hover:bg-primary-2 flex-1 rounded px-3 py-1 text-sm font-medium text-black transition">
          Add Friend
        </button>
      </template>

      <template v-if="isBlocked">
        <button
          @click="onUnblock"
          class="flex-1 rounded bg-red-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700">
          Unblock
        </button>
      </template>
      <template v-else>
        <button
          @click="onBlock"
          class="flex-1 rounded bg-red-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700">
          Block
        </button>
      </template>
    </div>
  </div>
</template>
