import { defineStore } from "pinia";
import { ref } from "vue";

export const useMessengerStore = defineStore("messenger", () => {
  const isOpen = ref(false);
  const activeFriendId = ref(null);

  const openMessenger = () => {
    isOpen.value = true;
  };

  const closeMessenger = () => {
    isOpen.value = false;
  };

  const openChat = (id) => {
    activeFriendId.value = id;
  };

  const closeChat = () => {
    activeFriendId.value = null;
  };

  return {
    isOpen,
    activeFriendId,
    openMessenger,
    closeMessenger,
    openChat,
    closeChat,
  };
});
