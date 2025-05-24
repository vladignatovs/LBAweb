<script setup>
import { useMessengerStore } from "@/stores/useMessengerStore";
const messenger = useMessengerStore();

const props = defineProps({
  user: { type: Object, required: true },
  isCurrentUser: Boolean,
  isFriend: Boolean,
  isBlocked: Boolean,
  isPending: Boolean,
});

const emit = defineEmits(["add-friend", "remove-friend", "block", "unblock"]);

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
  messenger.openMessenger();
  messenger.openChat(props.user.id);
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
          v-loading
          @click="onMessage"
          class="bg-primary hover:bg-primary/60 flex-1 rounded px-3 py-1 text-sm font-medium text-black transition">
          Message
        </button>
        <button
          v-loading
          @click="onRemoveFriend"
          class="bg-secondary-2 hover:bg-secondary-2/60 flex-1 rounded px-3 py-1 text-sm font-medium text-black transition">
          Remove Friend
        </button>
      </template>
      <template v-else-if="isPending">
        <button
          disabled
          class="bg-primary hover:bg-primary/60 flex-1 rounded px-3 py-1 text-sm font-medium text-black transition">
          Request Pending
        </button>
      </template>
      <template v-else>
        <button
          v-loading
          @click="onAddFriend"
          class="bg-primary hover:bg-primary/60 flex-1 rounded px-3 py-1 text-sm font-medium text-black transition">
          Add Friend
        </button>
      </template>

      <template v-if="isBlocked">
        <button
          v-loading
          @click="onUnblock"
          class="bg-danger-2 hover:bg-danger-2/60 flex-1 rounded px-3 py-1 text-sm font-medium text-white transition">
          Unblock
        </button>
      </template>
      <template v-else>
        <button
          v-loading
          @click="onBlock"
          class="bg-danger-2 hover:bg-danger-2/60 flex-1 rounded px-3 py-1 text-sm font-medium text-white transition">
          Block
        </button>
      </template>
    </div>
  </div>
</template>
