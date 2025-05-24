<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
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
    class="from-primary-2/10 to-background relative flex min-h-[calc(100vh-72px)] bg-linear-120 pb-18 text-white">
    <div class="relative m-auto my-6 w-3/4">
      <button
        @click="router.back()"
        class="absolute top-0 left-4 inline-flex items-center space-x-2 rounded-full bg-white/5 px-4 py-2 text-white transition hover:bg-white/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-4 flex-shrink-0"
          viewBox="0 0 24 24">
          <!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE -->
          <path
            fill="currentColor"
            d="M20 11v2H8l5.5 5.5l-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5L8 11z" />
        </svg>
        <span>Back</span>
      </button>

      <div class="h-full border-r border-l border-white/20 px-8">
        <h3 class="color-selected mx-auto w-fit text-3xl font-semibold">
          {{ news.title }}
        </h3>
        <div v-html="news.content" class="mt-4"></div>
      </div>
    </div>
  </main>
</template>
