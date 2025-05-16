import { computed, ref } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/useAuthStore";
import { storeToRefs } from "pinia";
export function useAdminActions() {
  // utilites
  const auth = useAuthStore();
  const { user } = storeToRefs(auth);

  const users = ref([]);
  const changeLogs = ref([]);

  const toast = useToast();

  function confirmAdmin() {
    if (!isAdmin.value) {
      toast.error("You do not have admin rights.");
      throw new Error("Forbidden");
    }
  }

  // |---------------------------------------------------------------------------------------------------
  // | ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS
  // |---------------------------------------------------------------------------------------------------

  // formData: instance of FormData with title, content, category and maybe thumbnail
  async function createNews(formData) {
    confirmAdmin();
    try {
      const { data } = await axios.post("/news", formData);
      toast.success("News created!");
      return data;
    } catch (e) {
      toast.error(e.response?.data?.message ?? "Failed to create news!");
    }
  }

  // id and FormData with title, content, category and maybe thumbnail
  async function updateNews(id, formData) {
    confirmAdmin();
    try {
      formData.append("_method", "PATCH");
      const { data } = await axios.post(`/news/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("News updated!");
      return data;
    } catch (e) {
      toast.error(e.response?.data?.message ?? "Failed to update news!");
    }
  }

  async function deleteNews(id) {
    confirmAdmin();
    try {
      await axios.delete(`/news/${id}`);
      toast.success("News deleted!");
      return true;
    } catch (e) {
      toast.error(e.response?.data?.message ?? "Failed to delete news!");
    }
  }

  async function fetchUsers() {
    confirmAdmin();
    try {
      const { data } = await axios.get("/admin/users");
      users.value = data; // data is grouped by rights
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to fetch users");
    }
  }

  async function updateUser(id, payload) {
    confirmAdmin();
    try {
      const { data } = await axios.patch(`/admin/users/${id}`, payload);
      toast.success("User updated");
      await fetchUsers();
      return data;
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update user");
    }
  }

  async function deleteUser(id) {
    confirmAdmin();
    try {
      await axios.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      await fetchUsers();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete user");
    }
  }

  async function terminateAllSessions() {
    confirmAdmin();
    try {
      await axios.post("/admin/terminate-sessions");
      toast.success("All sessions terminated");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to terminate sessions");
    }
  }

  async function fetchChangeLogs() {
    confirmAdmin();
    try {
      const { data } = await axios.get("/admin/change-logs");
      changeLogs.value = data;
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to fetch change logs");
    }
  }

  // helpers
  const isAdmin = computed(() => user.value?.rights === "admin");

  return {
    // state
    users,
    changeLogs,
    // fetches
    fetchUsers,
    fetchChangeLogs,
    // actions
    updateUser,
    deleteUser,
    terminateAllSessions,
    // actions
    createNews,
    updateNews,
    deleteNews,
    //helpers
    isAdmin,
  };
}
