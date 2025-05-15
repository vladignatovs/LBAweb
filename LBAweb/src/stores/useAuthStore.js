// stores/auth.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref(localStorage.getItem("auth_token") || null);
    const user = ref(null);
    const friends = ref([]);
    const blocked = ref([]);
    const sent = ref([]);
    const pending = ref([]);

    // const loadingRelationships = ref(false);

    const isLoggedIn = computed(() => Boolean(token.value));

    async function fetchUserRelationships() {
      if (!token.value) return;
      try {
        const { data } = await axios.get("/user/relationships");
        user.value = data.user;
        friends.value = data.friends;
        blocked.value = data.blocked;
        sent.value = data.sent;
        pending.value = data.pending;
      } catch (e) {
        console.error(e);
      }
    }

    function setToken(newToken) {
      token.value = newToken;
      localStorage.setItem("auth_token", newToken);
      axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
    }

    function logoutFrontend() {
      token.value = null;
      user.value = null;
      friends.value = [];
      blocked.value = [];
      sent.value = [];
      pending.value = [];
      localStorage.removeItem("auth_token");
      delete axios.defaults.headers.common.Authorization;
    }

    async function logout() {
      try {
        await axios.post("/logout");
      } catch (e) {
        if (e.response?.status !== 401) {
          console.error("Backend logout failed", e);
        }
      } finally {
        logoutFrontend();
        console.log("Logged out!");
      }
    }

    async function login(email, password) {
      const { data } = await axios.post("/login", { email, password });
      setToken(data.token);
      await fetchUserRelationships();
      return user.value;
    }

    // Register action
    async function register(name, email, password, password_confirmation) {
      const { data } = await axios.post("/register", {
        name,
        email,
        password,
        password_confirmation,
      });
      setToken(data.token);
      await fetchUserRelationships();
      return user.value;
    }

    return {
      // state
      token,
      user,
      friends,
      blocked,
      sent,
      pending,

      // getters
      isLoggedIn,

      // fetches
      fetchUserRelationships,

      // actions
      setToken,
      login,
      register,
      logout,
      logoutFrontend,
    };
  },
  {
    persist: {
      // only persist the JWT; keep `user` in-memory
      paths: ["token"],
    },
  },
);
