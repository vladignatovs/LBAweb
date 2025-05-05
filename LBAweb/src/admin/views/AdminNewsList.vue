<script setup>
import { ref, onMounted, defineAsyncComponent } from "vue";
import NewsList from "@/views/NewsList.vue";
import axios from "axios";

const isAdmin = ref(false);
onMounted(async () => {
  try {
    const token = localStorage.getItem("auth_token");
    const { data: user } = await axios.get("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    isAdmin.value = user.rights === "admin";
  } catch {
    isAdmin.value = false;
  }
});

// lazy‐load admin components
const AdminNewsPanel = defineAsyncComponent(
  () => import("@/admin/components/admin-news-panel.vue"),
);
// const AdminNewsControl = defineAsyncComponent(() => import('@/components/AdminNewsControl.vue'));
</script>

<template>
  <NewsList />

  <!-- Only if admin, mount the panel & controls bundle -->
  <Suspense v-if="isAdmin">
    <template #default>
      <AdminNewsPanel />
      <!-- If you need controls inside each card, you could provide them via provide/inject
           or simply re-render a combined AdminNewsPage here. -->
    </template>
    <template #fallback>
      <div class="py-4 text-center">Loading admin tools…</div>
    </template>
  </Suspense>
</template>
