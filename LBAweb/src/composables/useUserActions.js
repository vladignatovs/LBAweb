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
  const { user } = storeToRefs(auth);

  const levels = ref([]);
  const completions = ref([]);
  const friends = ref([]);
  const pending = ref([]);
  const sent = ref([]);
  const blocked = ref([]);
  const messages = ref([]);

  const allLevels = ref([]);
  const allUsers = ref([]);

  const loaded = {
    user: false,
    levels: false,
    completions: false,
    friends: false,
    pending: false,
    sent: false,
    blocked: false,
  };

  // utilities
  const router = useRouter();
  const toast = useToast();

  // |---------------------------------------------------------------------------------------------------
  // | FETCHES  FETCHES  FETCHES  FETCHES  FETCHES  FETCHES  FETCHES  FETCHES  FETCHES  FETCHES  FETCHES
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

  const fetchFriends = async () => {
    if (loaded.friends) return;
    try {
      loaded.friends = true;
      // forcefully loading blocked to allow blocking/unblocking
      if (!loaded.blocked) await fetchBlockedUsers();
      const { data } = await axios.get("/friendships");
      friends.value = data;
    } catch (e) {
      console.error("Could not load friends", e);
    }
  };

  const fetchPending = async () => {
    if (loaded.pending) return;
    try {
      loaded.pending = true;
      const { data } = await axios.get("/friend-requests/pending");
      pending.value = data;
    } catch (e) {
      console.error("Could not load completions", e);
    }
  };

  const fetchSent = async () => {
    if (loaded.sent) return;
    try {
      loaded.sent = true;
      const { data } = await axios.get("/friend-requests/sent");
      sent.value = data;
    } catch (e) {
      console.error("Could not load sent requests", e);
    }
  };

  const fetchBlockedUsers = async () => {
    if (loaded.blocked) return;
    try {
      loaded.blocked = true;
      // forcefully loading friends to allow adding/removing friends
      if (!loaded.friends) await fetchFriends();
      const { data } = await axios.get("/blocks");
      blocked.value = data;
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
  // | ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS
  // |---------------------------------------------------------------------------------------------------

  // const messageFriend = (id) => {
  //   router.push({ name: "MessageThread", params: { userId: id } });
  // };

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
    fetchFriends,
    fetchPendingRequests: fetchPending,
    fetchSentRequests: fetchSent,
    fetchBlockedUsers,
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
