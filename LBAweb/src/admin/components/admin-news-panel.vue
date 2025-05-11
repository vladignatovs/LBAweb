<script setup>
import { ref, watch } from "vue";
import fancyInput from "@/components/fancy-input.vue";
import fancyFileInput from "@/components/fancy-file-input.vue";
import { useAdminActions } from "../composables/useAdminActions";

const props = defineProps({
  open: Boolean,
  newsToEdit: Object,
});

const emit = defineEmits([
  "update:open", // for v-model:open
  "create",
  "update",
]);

const { createNews, updateNews } = useAdminActions();

const title = ref("");
const content = ref("");
const thumbnail = ref(null);
const category = ref("");

watch(
  () => props.newsToEdit,
  (n) => {
    if (n) {
      title.value = n.title;
      content.value = n.content;
      category.value = n.category;
      // you could also show a preview of existing thumbnail if you like
    } else {
      title.value = "";
      content.value = "";
      category.value = "";
      thumbnail.value = null;
    }
  },
  { immediate: true },
);

async function handleSubmit() {
  const form = new FormData();
  form.append("title", title.value);
  form.append("content", content.value);
  form.append("category", category.value);
  if (thumbnail.value) form.append("thumbnail", thumbnail.value);

  if (props.newsToEdit) {
    // --- EDIT FLOW ---
    await updateNews(props.newsToEdit.id, form);
    emit("update", {
      ...props.newsToEdit,
      title: title.value,
      content: content.value,
      category: category.value,
      // note: thumbnail ref may not reflect new URL
    });
  } else {
    // --- CREATE FLOW ---
    const created = await createNews(form);
    emit("create", created);
    // Optionally you could also clear form here, but watch() on newsToEdit=null already resets
  }

  // close panel
  emit("update:open", false);
}
</script>

<template>
  <div>
    <!-- TOGGLE BUTTON -->
    <button
      @click="emit('update:open', !open)"
      class="fixed z-50 m-5 rounded-2xl border border-white/10 bg-white/10 p-1 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 focus:ring-2 focus:ring-white/50 active:scale-95">
      <svg
        :class="open ? 'rotate-180' : 'rotate-0'"
        xmlns="http://www.w3.org/2000/svg"
        class="size-6 transition-all duration-200">
        <path
          fill="currentColor"
          d="M16 21.308L6.692 12L16 2.692l1.064 1.064L8.819 12l8.244 8.244z" />
      </svg>
    </button>

    <!-- SLIDING PANEL -->
    <aside
      :class="open ? 'translate-x-0' : '-translate-x-full'"
      class="fixed top-0 left-0 z-40 flex h-screen w-1/3 flex-col items-center justify-center gap-5 bg-black/70 px-5 pt-18 text-white shadow-lg transition-transform duration-300">
      <!-- Panel Title -->
      <h2 class="text-3xl font-bold">
        {{ props.newsToEdit ? "Edit News" : "Create News" }}
      </h2>

      <!-- Title Input -->
      <fancy-input v-model="title" label="Title" />

      <!-- Thumbnail Input -->
      <fancy-file-input
        v-model="thumbnail"
        label="Thumbnail"
        accept=".webp,.jpg,.jpeg"
        class="file-input" />

      <!-- Category Select -->
      <div class="relative w-full">
        <select
          v-model="category"
          id="category"
          class="peer w-full rounded-2xl border border-white/20 bg-black/10 px-3 pt-6 pb-2 text-base text-white shadow-md backdrop-blur-3xl hover:bg-black/20 focus:bg-black/20 focus:ring-2 focus:ring-white/50 focus:outline-none">
          <option value="" disabled>Select a category</option>
          <option value="update">Update</option>
          <option value="announcement">Announcement</option>
          <option value="other">Other</option>
        </select>
        <label
          for="category"
          class="peer-focus:text-selected pointer-events-none absolute top-2 left-3 text-sm text-white transition-all">
          Category
        </label>
      </div>

      <!-- Content Textarea -->
      <textarea
        v-model="content"
        placeholder="Content"
        class="h-1/2 max-h-[90%] min-h-20 w-full overflow-auto rounded-2xl border border-white/20 bg-black/10 p-2 pb-18 text-base text-white shadow-md backdrop-blur-3xl hover:bg-black/20 focus:bg-black/20 focus:ring-2 focus:ring-white/50 focus:outline-none">
      </textarea>

      <!-- Submit Button -->
      <button
        @click="handleSubmit"
        class="w-1/2 rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 focus:ring-2 focus:ring-white/50 active:scale-95">
        {{ props.newsToEdit ? "Update" : "Submit" }}
      </button>
    </aside>
  </div>
</template>

<style scoped>
:deep(input[type="file"]::file-selector-button),
:deep(input[type="file"]::-webkit-file-upload-button) {
  display: none;
}
</style>
