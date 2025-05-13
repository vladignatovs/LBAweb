import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/useAuthStore";
import { storeToRefs } from "pinia";

/**
 * Encapsulates user info, levels/completions, friendships,
 * friend-requests, and blocks in one composable.
 * Named exports let you pick only what you need :contentReference[oaicite:4]{index=4}.
 */
export function useUserActions() {
  const auth = useAuthStore();
  const { user, friends, pending, sent, blocked } = storeToRefs(auth);

  const levels = ref([]);
  const completions = ref([]);
  const messages = ref([]);

  const allLevels = ref([]);
  const allUsers = ref([]);

  const loaded = {
    levels: false,
    completions: false,
  };

  // utilities
  const router = useRouter();
  const toast = useToast();

  // |---------------------------------------------------------------------------------------------------
  // | FETCHES
  // |---------------------------------------------------------------------------------------------------

  const fetchBrowse = async (query) => {
    try {
      const [lvRes, usRes] = await Promise.all([
        axios.get("/levels"),
        axios.get("/users", { params: { q: query } }),
      ]);
      allLevels.value = lvRes.data;
      allUsers.value = usRes.data;
    } catch (e) {
      console.error("Browse fetch error:", e);
    }
  };

  const fetchLevels = async () => {
    if (!user.value) return;
    if (loaded.levels) return;
    try {
      loaded.levels = true;
      const resp = await axios.get("/levels");
      levels.value = resp.data;
    } catch (e) {
      console.error("Could not load levels", e);
    }
  };

  const fetchCompletions = async () => {
    if (!user.value) return;
    if (loaded.completions) return;
    try {
      loaded.completions = true;
      const resp = await axios.get("/completions");
      completions.value = resp.data;
    } catch (e) {
      console.error("Could not load completions", e);
    }
  };

  const fetchMessages = async (friendId) => {
    try {
      const { data } = await axios.get("/messages", {
        params: { with: friendId },
      });
      messages.value = data;
    } catch (e) {
      toast.error("Could not load messages.");
      console.error(e);
    }
  };

  // |---------------------------------------------------------------------------------------------------
  // | ACTIONS
  // |---------------------------------------------------------------------------------------------------

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
      await axios.patch(`/friend-requests/${id}`, { status: true });
      pending.value = pending.value.filter((r) => r.id !== id);
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

  const sendMessage = async ({ receiver_id, message_text }) => {
    try {
      const { data } = await axios.post("/messages", {
        receiver_id,
        message_text,
      });
      messages.value.push(data);
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

  // const getMessagesFor = (friendId) => {
  //   const me = user.value?.id;
  //   return messages.value.filter(
  //     (m) =>
  //       (m.sender_id === friendId && m.receiver_id === me) ||
  //       (m.sender_id === me && m.receiver_id === friendId),
  //   );
  // };

  // helpers
  // NOTE: BEFORE USING MUST LOAD IN ACCORDING LIST/OBJECT
  const isCurrentUser = (id) => user.value?.id === id;
  const isFriend = (id) => friends.value.some((f) => f.id === id);
  const hasSent = (id) => sent.value.some((r) => r.receiver_id === id);
  const hasIncoming = (id) => pending.value.some((r) => r.sender.id === id);
  const isBlocked = (id) => blocked.value.some((b) => b.id === id);
  const hasFriends = () => friends.value.length > 0;

  return {
    // state
    user,
    levels,
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
    fetchLevels,
    fetchCompletions,
    fetchMessages,
    // actions
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
