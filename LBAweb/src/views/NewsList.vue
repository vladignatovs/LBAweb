<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import fancyInput from "@/components/fancy-input.vue";
import fancyFileInput from "@/components/fancy-file-input.vue";

const newsList = ref([]);
const user = ref(null);

onMounted(async () => {
  try {
    // fetch for news data, then,
    // if timeline and newslist already exist, reinitialize timeline and cancel the wait else wait
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
const thumbnail = ref(null);
const category = ref("");
const message = ref("");

async function storeNews() {
  try {
    console.log(title.value);
    console.log(thumbnail.value);
    // const response
    await axios.post(
      "http://127.0.0.1:8000/api/news",
      {
        title: title.value,
        content: content.value,
        thumbnail: thumbnail.value,
        category: category.value,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    message.value = "News created successfully!";
    // resetting input field values to be able to create new news
    title.value = "";
    content.value = "";
    thumbnail.value = null;
    category.value = "";
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
    class="relative flex w-full bg-linear-to-b from-[var(--background-primary)] to-[var(--background-secondary)] pb-18">
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
            <option value="" disabled selected>Select a category</option>
            <option value="other">Other</option>
            <option value="update">Update</option>
            <option value="announcement">Announcement</option>
          </select>
          <label
            for="category"
            class="pointer-events-none absolute top-2 left-3 text-sm text-white transition-all peer-focus:text-[var(--selected-text)]">
            Category
          </label>
        </div>
        <textarea
          v-model="content"
          placeholder="Content"
          class="h-1/2 max-h-[90%] min-h-20 w-full overflow-auto rounded-2xl border border-white/20 bg-black/10 p-2 pb-18 text-base text-white shadow-md backdrop-blur-3xl hover:bg-black/20 hover:shadow-lg focus:bg-black/20 focus:ring-2 focus:ring-white/50 focus:outline-none">
        </textarea>
        <!-- TODO: THE WAY FILES ARE INPUTTED IN HERE, I ALSO WANT TO USE A DEFAULT VALUE IN HERE!!! -->
        <button
          @click="storeNews"
          class="w-1/2 cursor-pointer rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95">
          Submit
        </button>
        <p>{{ message }}</p>
      </aside>
      <button
        @click="adminPanel"
        class="fixed z-50 m-5 w-fit cursor-pointer rounded-2xl border border-white/10 bg-white/10 p-1 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95">
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
    <section class="min-h-screen w-full">
      <!-- news page header -->
      <div
        class="relative flex h-40 justify-center bg-[var(--background-secondary)]">
        <h2 class="text-2xl font-bold">News</h2>
      </div>
      <div
        v-if="newsList.length"
        class="mx-auto grid min-h-screen w-4/5 grid-cols-3 gap-10">
        <div
          v-for="news in newsList"
          :key="news.id"
          class="flex items-center justify-center">
          <a href="" class="hover:brightness-70">
            <h3
              class="color-[var(--text-primary)] mx-auto w-fit text-3xl font-semibold">
              {{ news.title }}
            </h3>
            <!-- <div v-html="news.content"></div> -->
            <img
              :src="'http://127.0.0.1:8000/storage/' + news.thumbnail"
              alt="Default Thumbnail"
              class="relative h-1/2 w-full rounded-lg" />
            <!-- <p class="bg-black/90 text-red-500">{{ news.category }}</p> -->
          </a>
        </div>
      </div>
      <div v-else>News unavailable</div>
    </section>
  </main>
</template>
<style scoped>
:deep(input[type="file"]::file-selector-button),
:deep(input[type="file"]::-webkit-file-upload-button) {
  display: none;
}
</style>
