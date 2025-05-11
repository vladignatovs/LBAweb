<script setup>
import { defineProps, defineEmits, computed } from "vue";
import adminNewsControl from "@/admin/components/admin-news-control.vue";

const props = defineProps({
  news: { type: Object, required: true },
  isAdmin: { type: Boolean, required: true },
});
const emit = defineEmits(["edit", "delete"]);

function onEdit(news) {
  emit("edit", news);
}
function onDelete(id) {
  emit("delete", id);
}

const formattedDate = computed(() =>
  new Date(props.news.created_at).toLocaleDateString(),
);

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
</script>

<template>
  <div class="relative h-full">
    <router-link :to="`/news/${news.id}`">
      <!-- Thumbnail -->
      <div class="h-40 w-full overflow-hidden">
        <img
          :src="`http://127.0.0.1:8000/storage/${news.thumbnail}`"
          alt="Thumbnail"
          class="h-full w-full object-cover" />
      </div>

      <!-- Date & Category -->
      <div class="flex items-center justify-between p-4">
        <span class="text-sm text-gray-300">{{ formattedDate }}</span>
        <span
          class="rounded px-2 py-1 text-xs font-medium text-black"
          :class="categoryColor(news.category)">
          {{ news.category }}
        </span>
      </div>

      <!-- Title -->
      <div class="px-4">
        <h3 class="truncate-4 text-lg font-semibold">
          {{ news.title }}
        </h3>
      </div>
      <!-- <p
        v-html="news.content"
        class="truncate px-4 text-xs font-thin text-white/40"></p> -->
    </router-link>

    <!-- Admin buttons overlay -->
    <admin-news-control
      v-if="isAdmin"
      :news="news"
      @edit="onEdit"
      @delete="onDelete" />
  </div>
</template>
<style scoped>
.truncate-4 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
.content {
  font-size: 12px !important;
}
</style>
