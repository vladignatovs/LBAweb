<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import AdminNewsPanel from "@/components/admin-news-panel.vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";

const route = useRoute();

const newsList = ref([]);

// --- MOUNT ---
// gets news
onMounted(async () => {
  try {
    const newsResp = await axios.get("http://127.0.0.1:8000/api/news");
    newsList.value = newsResp.data;
  } catch (e) {
    console.error("Failed to load news:", e);
  }
});

// --- FILTERING & PAGINATION ---
const categoryFilter = ref(route.query.category || "all");
const currentPage = ref(1);
const itemsPerPage = 9; // TODO: MAKE THIS CUSTOMIZABLE

// hardcoded categories list
const categories = [
  { value: "all", label: "All" },
  { value: "update", label: "Update" },
  { value: "announcement", label: "Announcement" },
  { value: "other", label: "Other" },
];

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
      return "bg-primary-2";
    case "announcement":
      return "bg-secondary-2";
    default:
      return "bg-gray-300";
  }
}

onBeforeRouteUpdate((to) => {
  categoryFilter.value = to.query.category || "all";
  currentPage.value = 1;
});
</script>

<template>
  <main
    class="from-primary-2/10 to-background relative min-h-screen bg-linear-120 px-8 py-6 pb-24 text-white">
    <admin-news-panel />

    <!-- CATEGORY FILTERS -->
    <div class="mb-6 flex flex-wrap justify-center gap-2">
      <button
        v-for="category in categories"
        :key="category.value"
        @click="
          categoryFilter = category.value;
          setPage(1);
        "
        :class="[
          'rounded-full px-4 py-2 transition hover:cursor-pointer',
          categoryFilter === category.value
            ? 'bg-primary text-black'
            : 'bg-white/5 hover:bg-white/10',
        ]">
        {{ category.label }}
      </button>
    </div>

    <!-- NEWS GRID -->
    <div
      v-if="pagedNews.length"
      class="mx-auto grid w-fit grid-cols-3 justify-items-center gap-6">
      <div v-for="news in pagedNews" :key="news.id" class="h-96 w-80">
        <router-link
          :to="`/news/${news.id}`"
          class="bg-background-2/30 hover:shadow-primary-2/20 block h-full overflow-hidden rounded-lg shadow-lg transition hover:shadow-2xl">
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
              class="rounded px-2 py-1 text-xs font-medium text-black"
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
          'rounded px-3 py-1 transition hover:cursor-pointer',
          currentPage === n
            ? 'bg-primary text-black'
            : 'bg-white/5 hover:bg-white/10',
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
