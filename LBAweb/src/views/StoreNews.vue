<!-- FOR ADMINS ONLY -->
<script setup>
import { ref } from "vue";
import axios from "axios";

const title = ref("");
const content = ref("");
const message = ref("");
async function storeNews() {
  try {
    // const response
    await axios.post(
      "http://127.0.0.1:8000/api/news",
      {
        title: title.value,
        content: content.value,
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
    );
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
  <div>
    <h2>Create news</h2>
    <input v-model="title" type="text" placeholder="Title" />
    <textarea v-model="content" placeholder="Content"></textarea>
    <button @click="storeNews">Submit</button>
    <p>{{ message }}</p>
  </div>
</template>
