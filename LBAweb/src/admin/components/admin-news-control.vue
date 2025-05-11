<script setup>
import { defineProps, defineEmits } from "vue";
import { useAdminActions } from "../composables/useAdminActions";

const props = defineProps({
  news: { type: Object, required: true },
});

const emit = defineEmits("edit", "delete");

const { deleteNews } = useAdminActions();

const onEdit = () => {
  emit("edit", props.news);
};

const onDelete = async () => {
  emit("delete", props.news.id);
  await deleteNews(props.news.id);
};
</script>
<template>
  <div class="absolute top-2 right-2 z-10 flex space-x-2 bg-black">
    <!-- Edit button -->
    <button @click="onEdit" aria-label="Edit" class="h-6 w-6 hover:opacity-75">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11.99A2 2 0 006 21h11.99a2 2 0 002-2v-5m-7.5-7.5l7.5 7.5m0 0L13.5 21" />
      </svg>
    </button>

    <!-- Delete button -->
    <button
      @click="onDelete"
      aria-label="Delete"
      class="h-6 w-6 hover:opacity-75">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4 m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
      </svg>
    </button>
  </div>
</template>
