<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import axios from "axios";
import fancyInput from "@/components/fancy-input.vue";
import fancyFileInput from "@/components/fancy-file-input.vue";

const title = ref("");
const content = ref("");
const thumbnail = ref(null);
const category = ref("");
const adminPanelOpen = ref(false);
const isAdmin = ref(false);

const toast = useToast();

onMounted(async () => {
  const token = localStorage.getItem("auth_token");
  if (!token) return;

  try {
    const { data: user } = await axios.get("/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (user.rights === "admin") {
      isAdmin.value = true;
    }
  } catch (e) {
    console.warn("No valid user session:", e);
  }
});

async function storeNews() {
  try {
    const form = new FormData();
    form.append("title", title.value);
    form.append("content", content.value);
    if (thumbnail.value) form.append("thumbnail", thumbnail.value);
    form.append("category", category.value);

    await axios.post("/news", form);
    toast.success("News created successfully!");
    title.value = "";
    content.value = "";
    thumbnail.value = null;
    category.value = "";
  } catch (e) {
    toast.error(`Failed to create news!: ${e}`);
  }
}
</script>
<template>
  <div>
    <aside
      :class="adminPanelOpen ? 'translate-x-0' : '-translate-x-full'"
      class="fixed top-0 left-0 z-40 flex h-screen w-1/3 flex-col items-center justify-center gap-5 bg-black/70 px-5 pt-18 text-white shadow-lg transition-transform duration-300">
      <h2 class="text-3xl font-bold">Create news</h2>
      <fancy-input v-model="title" label="Title" />
      <fancy-file-input
        v-model="thumbnail"
        label="Thumbnail"
        accept=".webp,.jpg,.jpeg"
        class="file-input" />
      <div class="relative w-full">
        <select
          v-model="category"
          id="category"
          class="peer w-full rounded-2xl border border-white/20 bg-black/10 px-3 pt-6 pb-2 text-base text-white shadow-md backdrop-blur-3xl hover:bg-black/20 hover:shadow-lg focus:bg-black/20 focus:ring-2 focus:ring-white/50 focus:outline-none">
          <option value="" disabled>Select a category</option>
          <option value="update">Update</option>
          <option value="announcement">Announcement</option>
          <option value="other">Other</option>
        </select>
        <label
          for="category"
          class="peer-focus:text-selected pointer-events-none absolute top-2 left-3 text-sm text-white transition-all"
          >Category</label
        >
      </div>
      <textarea
        v-model="content"
        placeholder="Content"
        class="h-1/2 max-h-[90%] min-h-20 w-full overflow-auto rounded-2xl border border-white/20 bg-black/10 p-2 pb-18 text-base text-white shadow-md backdrop-blur-3xl hover:bg-black/20 hover:shadow-lg focus:bg-black/20 focus:ring-2 focus:ring-white/50 focus:outline-none"></textarea>
      <button
        @click="storeNews"
        class="w-1/2 rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95">
        Submit
      </button>
    </aside>

    <!-- TOGGLE BUTTON -->
    <button
      @click="adminPanelOpen = !adminPanelOpen"
      class="fixed z-50 m-5 w-fit rounded-2xl border border-white/10 bg-white/10 p-1 text-white shadow-md backdrop-blur-xl transition-all hover:cursor-pointer hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95">
      <svg
        :class="adminPanelOpen ? 'rotate-180' : 'rotate-0'"
        xmlns="http://www.w3.org/2000/svg"
        class="size-6 transition-all duration-200">
        <path
          fill="currentColor"
          d="M16 21.308L6.692 12L16 2.692l1.064 1.064L8.819 12l8.244 8.244z" />
      </svg>
    </button>
  </div>
</template>
<style scoped>
:deep(input[type="file"]::file-selector-button),
:deep(input[type="file"]::-webkit-file-upload-button) {
  display: none;
}
</style>
