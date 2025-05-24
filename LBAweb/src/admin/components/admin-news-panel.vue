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
  "update:newsToEdit",
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
      class="fixed z-50 rounded-2xl bg-white/10 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 active:scale-95">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :class="open ? 'rotate-180' : 'rotate-0'"
        class="size-8 p-1 transition-all duration-200"
        viewBox="0 0 24 24">
        <!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE -->
        <path
          fill="currentColor"
          d="M20 11v2H8l5.5 5.5l-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5L8 11z" />
      </svg>
    </button>

    <!-- SLIDING PANEL -->
    <aside
      :class="open ? 'translate-x-0' : '-translate-x-full'"
      class="fixed top-0 left-0 z-40 flex h-screen w-1/3 flex-col items-center justify-center gap-5 bg-black/70 px-5 pt-18 text-white shadow-lg transition-transform duration-300">
      <!-- Panel Title -->
      <h2 class="pt-2 text-3xl font-bold">
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

      <!-- Controls -->
      <div class="flex flex-row gap-2 pb-2">
        <button
          v-if="props.newsToEdit !== null"
          @click="emit('update:newsToEdit', null)"
          class="rounded-2xl border border-white/10 bg-white/10 px-6 py-3 shadow-md backdrop-blur-xl transition-all hover:bg-white/20 focus:ring-2 focus:ring-white/50 active:scale-95">
          Clear
        </button>
        <button
          @click="handleSubmit"
          class="rounded-2xl border border-white/10 bg-white/10 px-6 py-3 shadow-md backdrop-blur-xl transition-all hover:bg-white/20 focus:ring-2 focus:ring-white/50 active:scale-95">
          {{ props.newsToEdit ? "Update" : "Create" }}
        </button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
:deep(input[type="file"]::file-selector-button),
:deep(input[type="file"]::-webkit-file-upload-button) {
  display: none;
}
</style>
