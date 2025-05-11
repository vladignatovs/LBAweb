<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import AdminNewsPanel from "@/admin/components/admin-news-panel.vue";
import newsCard from "@/components/news-card.vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { useAdminActions } from "@/admin/composables/useAdminActions";

// utils
const route = useRoute();
const selectedNews = ref(null);
const adminPanelOpen = ref(false);
const newsList = ref([]);
const { fetchUser, isAdmin } = useAdminActions();

// --- MOUNT ---
// gets news
onMounted(async () => {
  try {
    await fetchUser();
    const newsResp = await axios.get("/news");
    newsList.value = newsResp.data;
  } catch (e) {
    console.error("Failed to load news:", e);
  }
});

// --- CONNECTING METHODS ---
function addToList(newItem) {
  newsList.value.unshift(newItem);
}

function openCreatePanel() {
  selectedNews.value = null; // ensure we’re in “create” mode
  adminPanelOpen.value = true;
}

function openEditPanel(news) {
  selectedNews.value = news;
  adminPanelOpen.value = true;
}

// function onPanelToggle(isOpen) {
//   adminPanelOpen.value = isOpen;
//   if (!isOpen) selectedNews.value = null;
// }

function removeFromList(id) {
  newsList.value = newsList.value.filter((n) => n.id !== id);
}

function patchInList(updated) {
  const idx = newsList.value.findIndex((n) => n.id === updated.id);
  if (idx !== -1) newsList.value[idx] = updated;
}

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

onBeforeRouteUpdate((to) => {
  categoryFilter.value = to.query.category || "all";
  currentPage.value = 1;
});
</script>

<template>
  <main
    class="from-primary-2/10 to-background relative min-h-screen bg-linear-120 px-8 py-6 pb-24 text-white">
    <button @click="openCreatePanel">Create News</button>
    <admin-news-panel
      v-if="isAdmin"
      v-model:open="adminPanelOpen"
      :news-to-edit="selectedNews"
      @create="addToList"
      @update="patchInList" />
    <!-- @update:open="onPanelToggle" -->

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
          'rounded-full px-4 py-2 transition',
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
      <div
        v-for="news in pagedNews"
        :key="news.id"
        class="bg-background-2/30 block h-76 w-80 overflow-hidden rounded-lg shadow-lg transition hover:shadow-2xl">
        <news-card
          :isAdmin="isAdmin"
          :news="news"
          @edit="openEditPanel"
          @delete="removeFromList" />
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
