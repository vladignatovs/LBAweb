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
  if (!confirm("Are you sure you want to delete these news?")) return;

  emit("delete", props.news.id);
  await deleteNews(props.news.id);
};
</script>
<template>
  <div class="absolute right-2 bottom-2 z-10 flex space-x-2">
    <!-- Edit button -->
    <button @click="onEdit" aria-label="Edit" class="size-6 hover:opacity-75">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE -->
        <path
          fill="currentColor"
          d="m14.06 9l.94.94L5.92 19H5v-.92zm3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z" />
      </svg>
    </button>

    <!-- Delete button -->
    <button
      @click="onDelete"
      aria-label="Delete"
      class="size-6 hover:opacity-75">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE -->
        <path
          fill="currentColor"
          d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
      </svg>
    </button>
  </div>
</template>
