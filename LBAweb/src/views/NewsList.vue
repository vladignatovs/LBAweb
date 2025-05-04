<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import fancyInput from "@/components/fancy-input.vue";
import fancyFileInput from "@/components/fancy-file-input.vue";

const newsList = ref([]);
const user = ref(null);

// --- MOUNT ---
// gets news, also tries to fetchUserData to later check for admin rights
onMounted(async () => {
  try {
    const newsResp = await axios.get("http://127.0.0.1:8000/api/news");
    newsList.value = newsResp.data;
  } catch (e) {
    console.error("Failed to load news:", e);
  } finally {
    await fetchUserData();
  }
});

// fetches for user data
async function fetchUserData() {
  const token = localStorage.getItem("auth_token");
  if (!token) return; // not logged in
  try {
    const resp = await axios.get("http://127.0.0.1:8000/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    user.value = resp.data;
  } catch (e) {
    // silently fail: leave user as null
    console.warn("No valid user session:", e);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }
}

// --- ADMIN ---
const title = ref("");
const content = ref("");
const thumbnail = ref(null);
const category = ref("");
const message = ref("");
const adminPanelOpen = ref(false);

// sends request to store news
async function storeNews() {
  try {
    console.log(category.value);
    await axios.post(
      "http://127.0.0.1:8000/api/news",
      {
        title: title.value,
        content: content.value,
        thumbnail: thumbnail.value,
        category: category.value,
      },
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    message.value = "News created successfully!";
    title.value = "";
    content.value = "";
    thumbnail.value = null;
    category.value = "";
  } catch (e) {
    console.error(e);
    message.value = "Failed to create news.";
  }
}

// toggles adminPanelOpen state
function adminPanel() {
  adminPanelOpen.value = !adminPanelOpen.value;
}

// --- FILTERING & PAGINATION ---
const categoryFilter = ref("all");
const currentPage = ref(1);
const itemsPerPage = 9; // TODO: MAKE THIS CUSTOMIZABLE

// gets the categories from the existing list of news (safe and dynamic, however might be unoptimized and overkill)
const categories = computed(() => {
  const cats = Array.from(new Set(newsList.value.map((n) => n.category)));
  return ["all", ...cats];
});

// filters news, if all, show whole newsList, else show each news where category = filter
const filteredNews = computed(() =>
  categoryFilter.value === "all"
    ? newsList.value
    : newsList.value.filter((n) => n.category === categoryFilter.value),
);

// gets the amount of pages
const totalPages = computed(() =>
  Math.ceil(filteredNews.value.length / itemsPerPage),
);

// (currentPage = 1, 1-1 = 0 * itemsPerPage (9) = 0, so starts from 0)
// gets slice of news by slicing from start to end
// (start (0), start + itemsPerPage (0 + 9 = 9))
const pagedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredNews.value.slice(start, start + itemsPerPage);
});

// sets currentPage to the one pressed
function setPage(n) {
  if (n >= 1 && n <= totalPages.value) {
    currentPage.value = n;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// sets color of category bg
function categoryColor(cat) {
  switch (cat) {
    case "update":
      return "bg-blue-500";
    case "announcement":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}
</script>

<template>
  <main class="bg-bg-primary relative min-h-screen px-8 py-6 pb-24 text-white">
    <!-- ADMIN PANEL -->
    <div v-if="user && user.rights === 'admin'">
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
            <option value="other">Other</option>
            <option value="update">Update</option>
            <option value="announcement">Announcement</option>
          </select>
          <label
            for="category"
            class="peer-focus:text-selected pointer-events-none absolute top-2 left-3 text-sm text-white transition-all">
            Category
          </label>
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
        <p>{{ message }}</p>
      </aside>
      <button
        @click="adminPanel"
        class="fixed z-50 m-5 w-fit rounded-2xl border border-white/10 bg-white/10 p-1 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95">
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

    <!-- CATEGORY FILTERS -->
    <div class="mb-6 flex flex-wrap justify-center gap-2">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="
          categoryFilter = cat;
          setPage(1);
        "
        :class="[
          'rounded-full px-4 py-2 transition',
          categoryFilter === cat
            ? 'bg-blue-600 text-white'
            : 'bg-white/20 hover:bg-white/30',
        ]">
        {{ cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1) }}
      </button>
    </div>

    <!-- NEWS GRID -->
    <div
      v-if="pagedNews.length"
      class="mx-auto grid grid-cols-3 justify-items-center gap-6">
      <div v-for="news in pagedNews" :key="news.id" class="h-96 w-80">
        <router-link
          :to="`/news/${news.id}`"
          class="bg-bg-secondary block h-full overflow-hidden rounded-lg shadow-lg transition hover:shadow-2xl">
          <!-- Thumbnail -->
          <div class="h-40 w-full overflow-hidden">
            <img
              :src="`http://127.0.0.1:8000/storage/${news.thumbnail}`"
              alt="Thumbnail"
              class="h-full w-full object-cover object-center" />
          </div>

          <!-- Date & Category Badge -->
          <div class="mb-2 flex items-center justify-between p-4">
            <span class="text-sm text-gray-300">
              {{ new Date(news.created_at).toLocaleDateString() }}
            </span>
            <span
              class="rounded px-2 py-1 text-xs font-medium text-white"
              :class="categoryColor(news.category)">
              {{ news.category }}
            </span>
          </div>

          <!-- Title -->
          <div class="px-4">
            <h3 class="text-lg leading-snug font-semibold text-white">
              {{ news.title }}
            </h3>
          </div>
        </router-link>
      </div>
    </div>
    <div v-else class="py-20 text-center">No news available.</div>

    <!-- PAGINATION -->
    <div v-if="totalPages > 1" class="mt-8 flex flex-wrap justify-center gap-2">
      <button
        v-for="n in totalPages"
        :key="n"
        @click="setPage(n)"
        :class="[
          'rounded px-3 py-1 transition',
          currentPage === n
            ? 'bg-blue-600 text-white'
            : 'bg-white/20 hover:bg-white/30',
        ]">
        {{ n }}
      </button>
    </div>
  </main>
</template>

<style scoped>
:deep(input[type="file"]::file-selector-button),
:deep(input[type="file"]::-webkit-file-upload-button) {
  display: none;
}
</style>
