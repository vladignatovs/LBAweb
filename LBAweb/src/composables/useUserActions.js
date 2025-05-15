import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/useAuthStore";
import { storeToRefs } from "pinia";

export function useUserActions() {
  const auth = useAuthStore();
  const { user, friends, pending, sent, blocked } = storeToRefs(auth);

  const createdLevels = ref([]);
  const completions = ref([]);
  const messages = ref([]);
  let currentChannel = null;

  const allLevels = ref([]);
  const allUsers = ref([]);

  const loaded = {
    levels: false,
    completions: false,
  };

  // utilities
  const router = useRouter();
  const toast = useToast();

  function toBroadcastFormat(userId, friendId) {
    return [userId, friendId].sort().join("-");
  }

  // |---------------------------------------------------------------------------------------------------
  // | FETCHES
  // |---------------------------------------------------------------------------------------------------

  const fetchBrowse = async (query) => {
    try {
      const { data } = await axios.get("/browse", {
        params: { q: query },
      });
      allLevels.value = data.levels;
      allUsers.value = data.users;
    } catch (e) {
      console.error("Browse fetch error:", e);
    }
  };

  const fetchCreatedLevels = async () => {
    if (loaded.levels) return;
    try {
      loaded.levels = true;
      const { data } = await axios.get("user/created-levels");
      createdLevels.value = data;
    } catch (e) {
      console.error("Could not load levels", e);
    }
  };

  const fetchCompletions = async () => {
    if (loaded.completions) return;
    try {
      loaded.completions = true;
      const resp = await axios.get("/completions");
      completions.value = resp.data;
    } catch (e) {
      console.error("Could not load completions", e);
    }
  };

  async function fetchMessages(friendId) {
    const history = await axios.get(`/messages?with=${friendId}`);
    messages.value = history.data;

    // unsubs from any previous broadcasting channel
    if (currentChannel) {
      window.Echo.leave(`chat.${currentChannel}`);
    }

    currentChannel = toBroadcastFormat(auth.user.id, friendId);
    console.log(currentChannel);
    // subs to a new broadcasting channel,
    // also listens to 3 message events to broadcast
    window.Echo.private(`chat.${currentChannel}`)
      .subscribed(() => {
        console.log("Subscribed to chat." + currentChannel);
      })
      .listen("MessageSent", (e) => {
        console.log("Got MessageSent:", e);
        messages.value.push(e);
      })
      .listen("MessageEdited", (e) => {
        console.log("Got MessageEdited:", e);
        const updatedMessageId = messages.value.findIndex((m) => m.id === e.id);
        if (updatedMessageId !== -1) {
          messages.value[updatedMessageId].message_text = e.new_text;
          messages.value[updatedMessageId].updated_at = e.edited_at;
        }
      })
      .listen("MessageDeleted", (e) => {
        console.log("Got MessageDeleted:", e);
        messages.value = messages.value.filter((m) => m.id !== e.id);
      });
  }

  // |---------------------------------------------------------------------------------------------------
  // | ACTIONS
  // |---------------------------------------------------------------------------------------------------

  const updateName = async (name) => {
    try {
      const { data } = await axios.patch("/user/name", { name });
      user.value.name = data.name;
      toast.success("Name updated!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update name.");
    }
  };

  const updateEmail = async (email, currentPassword) => {
    try {
      const { data } = await axios.patch("/user/email", {
        email,
        current_password: currentPassword,
      });
      // reflect it locally
      user.value.email = data.email;
      toast.success("Email updated successfully!");
    } catch (e) {
      toast.error(e.response?.data?.message ?? "Failed to update email!");
    }
  };

  const changePassword = async (currentPwd, newPwd, confirmPwd) => {
    try {
      await axios.patch("/user/password", {
        current_password: currentPwd,
        new_password: newPwd,
        new_password_confirmation: confirmPwd,
      });
      toast.success("Password changed successfully!");
    } catch (e) {
      toast.error(e.response?.data?.message ?? "Failed to change password!");
    }
  };

  const deleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This cannot be undone.",
      )
    )
      return;
    try {
      await axios.delete("/user");
      toast.success("Account deleted successfully!");
      await logout(); // will throw 401 but will logout as expected
    } catch (e) {
      toast.error(e.response?.data?.message ?? "Failed to delete account!");
    }
  };

  const sendRequest = async (id) => {
    try {
      const { data: newReq } = await axios.post("/friend-requests", {
        receiver_id: id,
      });

      const userToSendTo =
        blocked.value.find((b) => b.id === id) ||
        allUsers.value.find((u) => u.id === id);

      if (userToSendTo) {
        sent.value.push({ ...newReq, receiver: userToSendTo });
      }

      toast.success("Friend request sent!");
    } catch (e) {
      toast.error(
        e.response?.data?.message ?? "Failed to send friend request!",
      );
    }
  };

  const acceptRequest = async (id) => {
    try {
      const { data } = await axios.patch(`/friend-requests/${id}`, {
        status: true,
      });
      pending.value = pending.value.filter((r) => r.id !== id);
      if (data.newFriend) {
        friends.value.push(data.newFriend);
      }
      toast.success("Friend request accepted!");
    } catch {
      toast.error("Failed to accept friend request!");
    }
  };

  const denyRequest = async (id) => {
    try {
      await axios.patch(`/friend-requests/${id}`, { status: false });
      pending.value = pending.value.filter((r) => r.id !== id);
      toast.success("Friend request denied!");
    } catch {
      toast.error("Failed to deny friend request!");
    }
  };

  const cancelRequest = async (id) => {
    try {
      await axios.delete(`/friend-requests/${id}`);
      sent.value = sent.value.filter((r) => r.id !== id);
      toast.success("Friend request cancelled!");
    } catch {
      toast.error("Failed to cancel friend request!");
    }
  };

  const removeFriend = async (id) => {
    try {
      await axios.delete(`/friendships/${id}`);
      friends.value = friends.value.filter((f) => f.id !== id);
      toast.success("Friend removed!");
    } catch {
      toast.error("Failed to remove friend!");
    }
  };

  const blockUser = async (id) => {
    try {
      await axios.post("/blocks", { blocked_id: id });

      const userToBlock =
        friends.value.find((f) => f.id === id) ||
        allUsers.value.find((u) => u.id === id);

      if (userToBlock) {
        blocked.value.push(userToBlock);
      }
      toast.success("Blocked user!");
    } catch {
      toast.error("Failed to block user!");
    }
  };

  const unblockUser = async (id) => {
    try {
      await axios.delete(`/blocks/${id}`);
      blocked.value = blocked.value.filter((b) => b.id !== id);
      toast.success("Unblocked user!");
    } catch {
      toast.error("Failed to unblock user!");
    }
  };

  const logout = async () => {
    await auth.logout();
    router.push({ name: "Home" });
  };

  const sendMessage = async (receiver_id, message_text) => {
    try {
      const { data } = await axios.post("/messages", {
        receiver_id,
        message_text,
      });
      return data;
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to send message");
      throw e;
    }
  };

  const editMessage = async (id, message_text) => {
    try {
      const { data } = await axios.patch(`/messages/${id}`, { message_text });
      return data;
    } catch (e) {
      toast.error("Failed to edit message");
      throw e;
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`/messages/${id}`);
      messages.value = messages.value.filter((m) => m.id !== id);
      return true;
    } catch (e) {
      toast.error("Failed to delete message");
      throw e;
    }
  };

  // helpers
  const isCurrentUser = (id) => user.value?.id === id;
  const isFriend = (id) => friends.value.some((f) => f.id === id);
  const hasSent = (id) => sent.value.some((r) => r.receiver_id === id);
  const hasIncoming = (id) => pending.value.some((r) => r.sender.id === id);
  const isBlocked = (id) => blocked.value.some((b) => b.id === id);
  const hasFriends = () => friends.value.length > 0;

  return {
    // state
    user,
    levels: createdLevels,
    completions,
    friends,
    pending,
    sent,
    blocked,
    messages,
    allLevels,
    allUsers,
    // fetchers
    fetchBrowse,
    fetchCreatedLevels,
    fetchCompletions,
    fetchMessages,
    // actions
    updateName,
    updateEmail,
    changePassword,
    deleteAccount,
    sendRequest,
    acceptRequest,
    denyRequest,
    cancelRequest,
    removeFriend,
    blockUser,
    unblockUser,
    logout,
    sendMessage,
    editMessage,
    deleteMessage,
    // helpers
    isCurrentUser,
    isFriend,
    hasSent,
    hasIncoming,
    isBlocked,
    hasFriends,
  };
}
