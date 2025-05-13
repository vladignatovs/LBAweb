<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import userCard from "@/components/user-card.vue";
import levelCard from "@/components/level-card.vue";
import { useUserActions } from "@/composables/useUserActions";

const {
  allLevels,
  allUsers,
  fetchBrowse,
  sendRequest,
  removeFriend,
  blockUser,
  unblockUser,
  isCurrentUser,
  isFriend,
  hasSent,
  // hasIncoming,
  isBlocked,
} = useUserActions();

// — ROUTE & SEARCH STATE —
const route = useRoute();
const rawQuery = ref(route.query.q || "");
watch(
  () => route.query.q,
  (q) => {
    rawQuery.value = q || "";
    currentPage.value = 1;
  },
);

// — FILTER & PAGINATION STATE —
const optionFilter = ref("all"); // 'all' | 'levels' | 'users'
const currentPage = ref(1);
const itemsPerPage = 9;
const options = [
  { value: "all", label: "All" },
  { value: "levels", label: "Levels" },
  { value: "users", label: "Users" },
];

// — LIFECYCLE: get logged-in user + friend state + browse data —
onMounted(async () => {
  await fetchBrowse(rawQuery.value);
});

watch(rawQuery, async () => {
  currentPage.value = 1;
  await fetchBrowse(rawQuery.value);
});

// — COMPUTED FILTERED LISTS & PAGINATION —
const filteredLevels = computed(() =>
  rawQuery.value
    ? allLevels.value.filter((l) =>
        l.name.toLowerCase().includes(rawQuery.value.toLowerCase()),
      )
    : allLevels.value,
);
const filteredUsers = computed(() =>
  rawQuery.value
    ? allUsers.value.filter((u) =>
        u.name.toLowerCase().includes(rawQuery.value.toLowerCase()),
      )
    : allUsers.value,
);

const combined = computed(() => {
  if (optionFilter.value === "levels") {
    return filteredLevels.value.map((l) => ({ ...l, __type: "level" }));
  }
  if (optionFilter.value === "users") {
    return filteredUsers.value.map((u) => ({ ...u, __type: "user" }));
  }
  return [
    ...filteredLevels.value.map((l) => ({ ...l, __type: "level" })),
    ...filteredUsers.value.map((u) => ({ ...u, __type: "user" })),
  ];
});

const totalPages = computed(() =>
  Math.ceil(combined.value.length / itemsPerPage),
);
const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return combined.value.slice(start, start + itemsPerPage);
});
function setPage(n) {
  if (n >= 1 && n <= totalPages.value) currentPage.value = n;
}
</script>

<template>
  <main
    class="from-primary-2/10 to-background relative min-h-screen bg-linear-120 px-8 py-6 pb-24 text-white">
    <h1 class="mb-4 text-2xl">Browse Results for “{{ rawQuery }}”</h1>

    <!-- Filter Buttons -->
    <div class="mb-6 flex flex-wrap justify-center gap-2">
      <button
        v-for="option in options"
        :key="option.value"
        @click="
          optionFilter = option.value;
          setPage(1);
        "
        :class="[
          'rounded-full px-4 py-2 transition',
          optionFilter === option.value
            ? 'bg-primary text-black'
            : 'bg-white/5 hover:bg-white/10',
        ]">
        {{ option.label }}
      </button>
    </div>

    <!-- Results Grid -->
    <div v-if="pagedItems.length" class="grid grid-cols-3 gap-6">
      <div
        v-for="item in pagedItems"
        :key="`${item.__type}-${item.id}`"
        class="bg-background-2 rounded p-4 shadow transition hover:shadow-lg">
        <level-card v-if="item.__type === 'level'" :level="item" />

        <user-card
          v-else
          :user="item"
          :is-current-user="isCurrentUser(item.id)"
          :is-friend="isFriend(item.id)"
          :is-blocked="isBlocked(item.id)"
          :is-pending="hasSent(item.id)"
          @add-friend="sendRequest"
          @remove-friend="removeFriend"
          @block="blockUser"
          @unblock="unblockUser" />
      </div>
    </div>

    <div v-else class="py-20 text-center">No results found.</div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center gap-2">
      <button
        v-for="n in totalPages"
        :key="n"
        @click="setPage(n)"
        :class="[
          'rounded px-3 py-1 transition',
          currentPage === n
            ? 'bg-primary text-black'
            : 'bg-white/10 hover:bg-white/20',
        ]">
        {{ n }}
      </button>
    </div>
  </main>
</template>
