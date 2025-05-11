import { computed } from "vue";
import axios from "axios";
import { useUserActions } from "@/composables/useUserActions";
import { useToast } from "vue-toastification";

export function useAdminActions() {
  // utilites
  const { user, fetchUser } = useUserActions();
  const toast = useToast();
  function authHeaders() {
    return { Authorization: `Bearer ${localStorage.getItem("auth_token")}` };
  }

  // |---------------------------------------------------------------------------------------------------
  // | ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS  ACTIONS
  // |---------------------------------------------------------------------------------------------------

  // formData: instance of FormData with title, content, category and maybe thumbnail
  async function createNews(formData) {
    try {
      const { data } = await axios.post("/news", formData, {
        headers: authHeaders(),
      });
      toast.success("News created!");
      return data;
    } catch (e) {
      toast.error(e.response?.data?.message ?? "Failed to create news!");
    }
  }

  // id and FormData with title, content, category and maybe thumbnail
  async function updateNews(id, formData) {
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
    if (!confirm("Really delete this news?")) return;
    try {
      await axios.delete(`/news/${id}`, authHeaders());
      toast.success("News deleted!");
      return true;
    } catch (e) {
      toast.error(e.response?.data?.message ?? "Failed to delete news!");
    }
  }

  // helpers
  // NOTE: BEFORE USING MUST FETCH USER
  const isAdmin = computed(() => user.value?.rights === "admin");

  return {
    // state
    isAdmin,
    // fetchers
    fetchUser,
    // actions
    createNews,
    updateNews,
    deleteNews,
  };
}
