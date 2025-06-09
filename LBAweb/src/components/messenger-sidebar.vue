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
  messenger.openChat(friend.id);
}

async function handleSend() {
  const text = newMessageText.value.trim();
  if (!text || !messenger.activeFriendId) return;
  const msg = await sendMessage(messenger.activeFriendId, text);
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
    class="bg-background-2 text-selected fixed inset-y-0 right-0 z-50 flex w-80 transform flex-col shadow-2xl transition-transform duration-300 ease-in-out"
    :class="{ 'translate-x-0': open, 'translate-x-full': !open }">
    <!-- header -->
    <header
      class="bg-background flex items-center justify-between border-b border-white/10 p-4 shadow-sm">
      <h2 class="text-lg font-semibold tracking-wide">Messenger</h2>
      <button
        @click="emit('close')"
        aria-label="Close"
        class="hover:text-primary-200 text-white transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-6"
          viewBox="0 0 24 24">
          <!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE -->
          <path
            fill="currentColor"
            d="M13.46 12L19 17.54V19h-1.46L12 13.46L6.46 19H5v-1.46L10.54 12L5 6.46V5h1.46L12 10.54L17.54 5H19v1.46z" />
        </svg>
      </button>
    </header>

    <!-- friends list -->
    <ul
      class="flex-none overflow-y-auto border-b border-white/10"
      style="height: 20%">
      <li
        v-for="friend in friends"
        :key="friend.id"
        :class="{
          'bg-white/5': friend.id === messenger.activeFriendId,
        }">
        <button
          v-loading
          @click="selectFriend(friend)"
          class="w-full px-4 py-2 text-left transition hover:bg-white/10">
          {{ friend.name }}
        </button>
      </li>
    </ul>

    <!-- chat area + form -->
    <div class="bg-background/70 flex flex-1 flex-col overflow-hidden">
      <!-- messages -->
      <div class="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex flex-col"
          :class="{
            'items-end': msg.sender_id === user.id,
            'items-start': msg.sender_id !== user.id,
          }">
          <div
            class="max-w-xs rounded-lg px-4 py-2 text-sm break-words shadow"
            :class="
              msg.sender_id === user.id
                ? 'bg-primary/80 text-black'
                : 'bg-white/10 text-white'
            ">
            {{ msg.message_text }}
          </div>
          <div class="mt-1 flex items-center space-x-2 text-xs text-white/60">
            <span>{{ formatTimestamp(msg.created_at) }}</span>
            <template v-if="msg.sender_id === user.id">
              <button
                @click="handleEdit(msg)"
                class="underline transition hover:text-white">
                Edit
              </button>
              <button
                @click="handleDelete(msg)"
                class="underline transition hover:text-white">
                Delete
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- input form -->
      <fieldset v-loading class="border-t border-white/10">
        <form
          @submit.prevent="handleSend"
          class="flex items-center gap-2 px-4 py-3">
          <input
            v-model="newMessageText"
            type="text"
            placeholder="Type a message..."
            class="bg-background-2/80 focus:ring-primary flex-1 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:ring-2 focus:outline-none" />
          <button
            type="submit"
            class="bg-primary hover:bg-primary/90 h-9 rounded-lg px-4 py-2 text-sm font-semibold text-black transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4"
              viewBox="0 0 24 24">
              <!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE -->
              <path fill="currentColor" d="m2 21l21-9L2 3v7l15 2l-15 2z" />
            </svg>
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
