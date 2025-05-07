<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

// Reactive state
const route = useRoute();
const rawQuery = ref(route.query.q || "");
const optionFilter = ref("all"); // 'all' | 'levels' | 'users'
const allLevels = ref([]);
const allUsers = ref([]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 9;

const options = [
  { value: "all", label: "All" },
  { value: "levels", label: "Levels" },
  { value: "users", label: "Users" },
];

// Update rawQuery when URL changes
watch(
  () => route.query.q,
  (q) => {
    rawQuery.value = q || "";
    currentPage.value = 1;
  },
);

// Fetch data on mount or when query changes
const fetchData = async () => {
  try {
    const [lvRes, usRes] = await Promise.all([
      axios.get("/levels"),
      axios.get("/users", {
        params: { q: rawQuery.value },
      }),
    ]);
    allLevels.value = lvRes.data;
    allUsers.value = usRes.data;
  } catch (e) {
    console.error("Browse fetch error:", e);
  }
};

onMounted(fetchData);
watch(rawQuery, fetchData);

async function sendFriendRequest(userId) {
  try {
    const token = localStorage.getItem("auth_token");
    await axios.post(
      "/friend-requests",
      { receiver_id: userId },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    console.log(`Friend request sent to user ${userId}`);
    // TODO: update UI state or show a toast
  } catch (e) {
    console.error("Failed to send friend request:", e);
    // TODO: show error feedback
  }
}

async function blockUser(userId) {
  try {
    const token = localStorage.getItem("auth_token");
    await axios.post(
      "/blocks",
      { blocked_id: userId },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    console.log(`Blocked user ${userId}`);
    // TODO: remove from list or show a toast
  } catch (e) {
    console.error("Failed to block user:", e);
    // TODO: show error feedback
  }
}

// Combined & filtered list
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
    return filteredLevels.value.map((l) => ({
      ...l,
      __type: "level",
    }));
  }
  if (optionFilter.value === "users") {
    return filteredUsers.value.map((u) => ({
      ...u,
      __type: "user",
    }));
  }
  // "all" mode: mix both types
  return [
    ...filteredLevels.value.map((l) => ({ ...l, __type: "level" })),
    ...filteredUsers.value.map((u) => ({ ...u, __type: "user" })),
  ];
});

// Pagination logic
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
          'rounded-full px-4 py-2 transition hover:cursor-pointer',
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
        :key="`${item.__type || item.id}-${item.id}`"
        class="bg-background-2 rounded p-4 shadow transition hover:shadow-lg">
        <div v-if="item.__type === 'level'">
          <h3 class="font-semibold">{{ item.name }}</h3>
          <p class="text-sm text-gray-400">
            Created: {{ new Date(item.created_at).toLocaleDateString() }}
          </p>
        </div>
        <div v-else-if="item.__type === 'user'">
          <h3 class="font-semibold">{{ item.name }}</h3>
          <p class="text-sm text-gray-400">{{ item.email }}</p>
          <div class="mt-4 flex space-x-2">
            <button
              @click="sendFriendRequest(item.id)"
              class="bg-primary hover:bg-primary-2 flex-1 rounded px-3 py-1 text-sm font-medium text-black transition">
              Add Friend
            </button>
            <button
              @click="blockUser(item.id)"
              class="flex-1 rounded bg-red-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700">
              Block
            </button>
          </div>
        </div>
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
