<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const news = ref({});

onMounted(async () => {
  try {
    const response = await axios.get(`/news/${route.params.id}`);
    news.value = response.data;
  } catch (e) {
    console.error(e);
  }
});
</script>
<template>
  <main
    class="from-primary to-secondary relative flex h-full w-full bg-linear-to-b pb-18">
    <div class="m-auto my-6 min-h-screen w-3/4">
      <h3 class="color-selected mx-auto w-fit text-3xl font-semibold">
        {{ news.title }}
      </h3>
      <!-- <span class="mx-auto w-fit text-sm font-semibold text-gray-300">
        {{ new Date(news.created_at).toLocaleDateString() }}
      </span> -->
      <div v-html="news.content"></div>
    </div>
  </main>
</template>
