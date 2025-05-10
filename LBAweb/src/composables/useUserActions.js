import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

/**
 * Encapsulates user info, levels/completions, friendships,
 * friend-requests, and blocks in one composable.
 * Named exports let you pick only what you need :contentReference[oaicite:4]{index=4}.
 */
export function useUserActions() {
  const user = ref(null);
  const levels = ref([]);
  const completions = ref([]);
  const friends = ref([]);
  const pending = ref([]);
  const sent = ref([]);
  const blocked = ref([]);

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
  function authHeaders() {
    return { Authorization: `Bearer ${localStorage.getItem("auth_token")}` };
  }
  function logoutCleanup() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    user.value = null;
  }

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

  const fetchUser = async () => {
    // check if user is already logged in by using authentication token (could use "user" as well)
    try {
      const resp = await axios.get("/user", { headers: authHeaders() });
      user.value = resp.data;
    } catch (e) {
      console.error(e);
      logoutCleanup();
    }
  };

  const fetchLevels = async () => {
    if (!user.value) return;
    try {
      loaded.levels = true;
      const resp = await axios.get("/levels", { headers: authHeaders() });
      levels.value = resp.data;
    } catch (e) {
      console.error("Could not load levels", e);
    }
  };

  const fetchCompletions = async () => {
    if (!user.value) return;
    try {
      loaded.completions = true;
      const resp = await axios.get("/completions", { headers: authHeaders() });
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
      const { data } = await axios.get("/friendships", {
        headers: authHeaders(),
      });
      friends.value = data;
    } catch (e) {
      console.error("Could not load friends", e);
    }
  };

  const fetchPending = async () => {
    if (loaded.pending) return;
    try {
      loaded.pending = true;
      const { data } = await axios.get("/friend-requests/pending", {
        headers: authHeaders(),
      });
      pending.value = data;
    } catch (e) {
      console.error("Could not load completions", e);
    }
  };

  const fetchSent = async () => {
    if (loaded.sent) return;
    try {
      loaded.sent = true;
      const { data } = await axios.get("/friend-requests/sent", {
        headers: authHeaders(),
      });
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
      const { data } = await axios.get("/blocks", { headers: authHeaders() });
      blocked.value = data;
    } catch (e) {
      console.error("Could not load completions", e);
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
      const { data: newReq } = await axios.post(
        "/friend-requests",
        { receiver_id: id },
        { headers: authHeaders() },
      );

      const userToSendTo =
        blocked.value.find((b) => b.id === id) ||
        allUsers.value.find((u) => u.id === id);

      if (userToSendTo) {
        sent.value.push({ ...newReq, receiver: userToSendTo });
      }

      console.log(`Friend request sent to user ${id}`);
      // TODO: update UI state or show a toast
    } catch (e) {
      console.error("Failed to send friend request:", e);
      // TODO: show error feedback
    }
  };

  const acceptRequest = async (id) => {
    await axios.patch(
      `/friend-requests/${id}`,
      { status: true },
      { headers: authHeaders() },
    );
    pending.value = pending.value.filter((r) => r.id !== id);
  };

  const denyRequest = async (id) => {
    await axios.patch(
      `/friend-requests/${id}`,
      { status: false },
      { headers: authHeaders() },
    );
    pending.value = pending.value.filter((r) => r.id !== id);
  };

  const cancelRequest = async (id) => {
    try {
      await axios.delete(`/friend-requests/${id}`, { headers: authHeaders() });
      sent.value = sent.value.filter((r) => r.id !== id);
    } catch (e) {
      console.error("Failed to cancel friend request", e);
    }
  };

  const removeFriend = async (id) => {
    try {
      await axios.delete(`/friendships/${id}`, { headers: authHeaders() });
      friends.value = friends.value.filter((f) => f.id !== id);
    } catch (e) {
      console.error("Failed to remove friend", e);
      throw e;
    }
  };

  const blockUser = async (id) => {
    try {
      await axios.post(
        "/blocks",
        { blocked_id: id },
        { headers: authHeaders() },
      );

      const userToBlock =
        friends.value.find((f) => f.id === id) ||
        allUsers.value.find((u) => u.id === id);

      if (userToBlock) {
        blocked.value.push(userToBlock);
      }
    } catch (e) {
      console.error("Failed to block user", e);
    }
  };

  const unblockUser = async (id) => {
    await axios.delete(`/blocks/${id}`, { headers: authHeaders() });
    blocked.value = blocked.value.filter((b) => b.id !== id);
  };

  const logout = async () => {
    try {
      await axios.post("/logout", {}, { headers: authHeaders() });
    } catch (e) {
      console.error(e);
    } finally {
      logoutCleanup();
      router.push("/");
    }
  };

  // helpers
  // NOTE: BEFORE USING MUST LOAD IN ACCORDING LIST/OBJECT
  const isCurrentUser = (id) => user.value?.id === id;
  const isFriend = (id) => friends.value.some((f) => f.id === id);
  const hasSent = (id) => sent.value.some((r) => r.receiver_id === id);
  const hasIncoming = (id) => pending.value.some((r) => r.sender.id === id);
  const isBlocked = (id) => blocked.value.some((b) => b.id === id);

  return {
    // state
    user,
    levels,
    completions,
    friends,
    pending,
    sent,
    blocked,
    allLevels,
    allUsers,
    // fetchers
    fetchBrowse,
    fetchUser,
    fetchLevels,
    fetchCompletions,
    fetchFriends,
    fetchPendingRequests: fetchPending,
    fetchSentRequests: fetchSent,
    fetchBlockedUsers,
    // actions
    sendRequest,
    acceptRequest,
    denyRequest,
    cancelRequest,
    removeFriend,
    blockUser,
    unblockUser,
    logout,
    // helpers
    isCurrentUser,
    isFriend,
    hasSent,
    hasIncoming,
    isBlocked,
  };
}
