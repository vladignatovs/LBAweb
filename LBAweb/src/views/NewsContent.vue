<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const news = ref({});

onMounted(async () => {
  try {
    // fetch for news data, then,
    // if timeline and newslist already exist, reinitialize timeline and cancel the wait else wait
    const response = await axios.get(
      `http://localhost:8000/api/news/${route.params.id}`,
    );
    news.value = response.data;
  } catch (e) {
    console.error(e);
  }
});
</script>
<template>
  <main
    class="from-bg-primary to-bg-secondary relative flex h-full w-full bg-linear-to-b pb-18">
    <div class="m-auto my-6 min-h-screen w-3/4">
      <h3
        class="color-[var(--text-primary)] mx-auto w-fit text-3xl font-semibold">
        {{ news.title }}
      </h3>
      <!-- <span class="mx-auto w-fit text-sm font-semibold text-gray-300">
        {{ new Date(news.created_at).toLocaleDateString() }}
      </span> -->
      <div v-html="news.content"></div>
    </div>
  </main>
</template>
