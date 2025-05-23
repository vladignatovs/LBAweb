<script setup>
import { ref, watch } from "vue";
import { useUserActions } from "@/composables/useUserActions";
import { useAuthStore } from "@/stores/useAuthStore";
import { storeToRefs } from "pinia";
import axios from "axios";
import { useMessengerStore } from "@/stores/useMessengerStore";

const props = defineProps({ open: Boolean });
const emit = defineEmits(["close"]);

const {
  friends,
  hasFriends,
  fetchMessages,
  messages,
  sendMessage,
  editMessage,
  deleteMessage,
} = useUserActions();
const messenger = useMessengerStore();

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const newMessageText = ref("");

// reset when closed
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      messenger.closeChat();
      messages.value = [];
      newMessageText.value = "";
    }
  },
);

watch(
  () => auth.token,
  (newToken) => {
    if (newToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
    }
  },
);

watch(
  () => messenger.activeFriendId,
  async (newId) => {
    if (newId !== null) {
      await fetchMessages(newId);
    } else {
      messages.value = [];
    }
  },
);

async function selectFriend(friend) {
  messenger.openChat();
  await fetchMessages(friend.id);
}

async function handleSend() {
  const text = newMessageText.value.trim();
  if (!text || !messenger.activeFriendId.value) return;
  const msg = await sendMessage(messenger.activeFriendId.value, text);
  // ensure it’s in our list
  if (!messages.value.find((m) => m.id === msg.id)) {
    messages.value.push(msg);
  }
  newMessageText.value = "";
}

async function handleEdit(msg) {
  const updated = prompt("Edit your message:", msg.message_text);
  if (!updated || updated === msg.message_text) return;
  const newMsg = await editMessage(msg.id, updated.trim());
  const idx = messages.value.findIndex((m) => m.id === msg.id);
  if (idx !== -1) messages.value[idx] = newMsg;
}

async function handleDelete(msg) {
  if (!confirm("Delete this message?")) return;
  await deleteMessage(msg.id);
  // composable already removed it
}

function formatTimestamp(ts) {
  return new Date(ts).toLocaleString();
}
</script>
<template>
  <div
    v-if="hasFriends()"
    class="bg-background-2 text-selected fixed inset-y-0 right-0 z-50 flex w-80 transform flex-col transition-transform"
    :class="{ 'translate-x-0': open, 'translate-x-full': !open }">
    <!-- header (does not grow) -->
    <header class="flex flex-none items-center justify-between border-b p-4">
      <h2 class="text-lg font-semibold">Messenger</h2>
      <button @click="emit('close')" aria-label="Close">✕</button>
    </header>

    <!-- friends list (fixed height) -->
    <ul class="flex-none overflow-y-auto border-b" style="height: 20%">
      <li
        v-for="friend in friends"
        :key="friend.id"
        :class="{ 'bg-background/30': friend.id === messenger.activeFriendId }">
        <button
          v-loading
          @click="selectFriend(friend)"
          class="w-full cursor-pointer p-2 text-left hover:bg-gray-50/10">
          {{ friend.name }}
        </button>
      </li>
    </ul>

    <!-- chat area + form -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- messages (scrolls) -->
      <div class="flex-1 space-y-2 overflow-y-auto border-b p-4">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex flex-col text-black"
          :class="{
            'items-end': msg.sender_id === user.id,
            'items-start': msg.sender_id !== user.id,
          }">
          <div
            class="max-w-xs rounded p-2 break-words"
            :class="msg.sender_id === user.id ? 'bg-blue-200' : 'bg-gray-200'">
            {{ msg.message_text }}
          </div>
          <div class="flex items-center text-xs text-gray-500">
            <span>{{ formatTimestamp(msg.created_at) }}</span>
            <template v-if="msg.sender_id === user.id">
              <button @click="handleEdit(msg)" class="ml-2 underline">
                Edit
              </button>
              <button @click="handleDelete(msg)" class="ml-1 underline">
                Delete
              </button>
            </template>
          </div>
        </div>
      </div>
      <fieldset v-loading>
        <form @submit.prevent="handleSend" class="flex flex-none p-4">
          <input
            v-model="newMessageText"
            type="text"
            placeholder="Type a message..."
            class="flex-1 rounded-l border px-3 py-2 focus:outline-none" />
          <button type="submit" class="bg-primary rounded-r px-4 text-black">
            Send
          </button>
        </form>
      </fieldset>
    </div>
  </div>
</template>
<style scoped>
/* ensure the drawer is off-screen when closed */
.translate-x-full {
  transform: translateX(100%);
}
.translate-x-0 {
  transform: translateX(0);
}
</style>
