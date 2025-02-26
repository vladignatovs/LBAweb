<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import fancyInput from "@/components/fancy-input.vue";

const newsList = ref([]);
const user = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/news");
    newsList.value = response.data;
    fetchUserData();
  } catch (e) {
    console.error(e);
  }
});

const fetchUserData = async () => {
  // check if user is already logged in by using authentication token (could use "user" as well)
  const token = localStorage.getItem("auth_token");
  try {
    // makes request to a page that simply checks authentication token and returns user (safer than getting user straight up)
    const response = await axios.get("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    user.value = response.data;
  } catch (e) {
    console.error(e);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }
};

// ADMIN PAGE
const title = ref("");
const content = ref("");
const message = ref("");

async function storeNews() {
  try {
    // const response
    await axios.post("http://127.0.0.1:8000/api/news", {
      title: title.value,
      content: content.value,
    });
    message.value = "News created successfully!";
    // resetting input field values to be able to create new news
    title.value = "";
    content.value = "";
  } catch (e) {
    console.error(e);
  }
}

const adminPanelOpen = ref(false);
async function adminPanel() {
  adminPanelOpen.value = !adminPanelOpen.value;
}
</script>
<template>
  <main
    class="relative flex min-h-screen w-full bg-linear-to-b from-[var(--background-primary)] to-[var(--background-secondary)] pb-18">
    <!-- ADMIN PANEL -->
    <div v-if="user && user.rights === 'admin'">
      <aside
        :class="adminPanelOpen ? 'translate-x-0' : '-translate-x-full'"
        class="fixed top-0 left-0 flex h-screen w-1/3 flex-col items-center justify-center gap-5 bg-black/70 px-5 pt-18 text-white shadow-lg transition-transform duration-300">
        <h2 class="text-3xl font-bold">Create news</h2>
        <fancy-input v-model="title" label="Title" class="w-2" />
        <textarea
          v-model="content"
          placeholder="Content"
          class="h-1/2 max-h-[90%] min-h-25 w-full resize-y overflow-auto rounded-2xl border border-white/20 bg-black/10 p-2 pb-18 text-base text-white shadow-md backdrop-blur-3xl hover:bg-black/20 hover:shadow-lg focus:bg-black/20 focus:ring-2 focus:ring-white/50 focus:outline-none">
        </textarea>
        <button
          @click="storeNews"
          class="w-1/2 cursor-pointer rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95">
          Submit
        </button>
        <p>{{ message }}</p>
      </aside>
      <button
        @click="adminPanel"
        class="fixed m-5 w-fit cursor-pointer rounded-2xl border border-white/10 bg-white/10 p-1 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95">
        <svg
          :class="adminPanelOpen ? 'rotate-180' : 'rotate-0'"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="size-6 transition-all duration-200">
          <path
            fill="currentColor"
            d="M16 21.308L6.692 12L16 2.692l1.064 1.064L8.819 12l8.244 8.244z" />
        </svg>
      </button>
    </div>

    <!-- NEWS LIST -->
    <section class="m-auto max-w-200 flex-1 p-5">
      <h1 class="text-3xl">News</h1>
      <div v-if="newsList.length">
        <div
          v-for="news in newsList"
          :key="news.id"
          class="border-b-[1px] border-black p-4">
          <h2 class="text-xl">{{ news.title }}</h2>
          <small
            >Published: {{ new Date(news.created_at).toLocaleString() }}</small
          >
          <p v-html="news.content"></p>
        </div>
      </div>
      <p v-else>No news available.</p>
    </section>
  </main>
</template>
