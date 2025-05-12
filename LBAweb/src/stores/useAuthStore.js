// stores/auth.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref(localStorage.getItem("auth_token") || null);
    const user = ref(null);

    const isLoggedIn = computed(() => Boolean(token.value));

    /**
     * Call your `/user` (or `/auth/me`) endpoint **once**
     * and populate `user.value`. If already loaded or no token, does nothing.
     */
    async function fetchUser() {
      if (user.value || !token.value) return;
      try {
        const { data } = await axios.get("/user");
        user.value = data;
      } catch (e) {
        console.error(e);
      }
    }

    /**
     * Store a new JWT (after login/register),
     * set the Axios default header, and then fetch the user.
     */
    function setToken(newToken) {
      token.value = newToken;
      localStorage.setItem("auth_token", newToken);
      axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
    }

    /** Logout action (could also redirect to `/login`) */
    async function logout() {
      try {
        // ① tell your backend to revoke the token / end the session
        await axios.post("/api/logout");
      } catch (e) {
        // maybe log it, but we’ll clear client state regardless
        console.error("Backend logout failed", e);
      } finally {
        // ② clear local token, user, and header
        token.value = null;
        user.value = null;
        localStorage.removeItem("auth_token");
        delete axios.defaults.headers.common.Authorization;
      }
    }

    async function login(email, password) {
      const { data } = await axios.post("/login", { email, password });
      setToken(data.token);
      await fetchUser();
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
      await fetchUser();
      return user.value;
    }

    return {
      // state
      token,
      user,

      // getters
      isLoggedIn,

      // actions
      fetchUser,
      setToken,
      login,
      register,
      logout,
    };
  },
  // ———————————————————————————————
  //  Pinia “options” for plugins
  // ———————————————————————————————
  {
    persist: {
      // only persist the JWT; keep `user` in-memory
      paths: ["token"],
    },
  },
);
