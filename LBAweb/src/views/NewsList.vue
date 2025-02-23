<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

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
</script>
<template>
  <div v-if="user && user.rights === 'admin'">
    <h2>Create news</h2>
    <input v-model="title" type="text" placeholder="Title" />
    <textarea v-model="content" placeholder="Content"></textarea>
    <button @click="storeNews">Submit</button>
    <p>{{ message }}</p>
  </div>
  <div class="m-auto max-w-200 p-5">
    <h1 class="text-3xl text-white">News</h1>
    <div v-if="newsList.length">
      <div
        v-for="news in newsList"
        :key="news.id"
        class="border-b-[1px] border-white p-4">
        <h2 class="text-xl text-[var(--text)]">{{ news.title }}</h2>
        <small
          >Published: {{ new Date(news.created_at).toLocaleString() }}</small
        >
        <p v-html="news.content"></p>
      </div>
    </div>
    <p v-else>No news available.</p>
  </div>
</template>
