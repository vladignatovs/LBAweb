<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import fancyInput from "./fancy-input.vue";
import { useUserActions } from "@/composables/useUserActions";
import messengerSidebar from "./messenger-sidebar.vue";

const { hasFriends } = useUserActions();

const router = useRouter();
const searchQuery = ref("");
// Called when the form is submitted
function onSubmit() {
  // Only navigate if the query has at least 2 chars
  if (searchQuery.value.trim().length >= 2) {
    router.push({ name: "Browse", query: { q: searchQuery.value.trim() } });
  }
}

const sidebarOpen = ref(false);
</script>

<template>
  <header class="sticky top-0 z-50 h-18 items-center text-xl text-white">
    <!-- bg filler -->
    <div class="fixed z-[-10] h-18 w-full bg-black/60 backdrop-blur-3xl"></div>

    <!-- NAVBAR LINKS FLOATING LEFT  -->
    <ul class="inline-flex h-full list-none items-center justify-start p-0">
      <!-- Logo -->
      <li class="inline-block">
        <RouterLink
          to="/"
          class="mx-5 flex items-center justify-center text-xl">
          <img
            src="../assets/LBA_invert_logo_prot1.webp"
            alt="Home"
            class="h-10 w-24 duration-200 hover:brightness-70" />
        </RouterLink>
      </li>

      <!-- News dropdown -->
      <li class="group relative mx-5">
        <RouterLink
          to="/news"
          class="group-hover:text-selected flex cursor-pointer items-center duration-300">
          News
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="ml-1 inline-block size-6 transition-transform duration-300 ease-in-out group-hover:rotate-180">
            <path d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z" />
          </svg>
        </RouterLink>

        <!-- Invisible hover bridge to keep the dropdown open -->
        <div
          class="pointer-events-none absolute top-full left-0 h-6 w-full group-hover:pointer-events-auto"></div>

        <!-- dropdown panel -->
        <div
          class="pointer-events-none absolute top-full left-0 mt-2 w-40 rounded-2xl border border-white/20 bg-black/30 opacity-0 shadow-lg backdrop-blur-3xl transition-all duration-200 ease-in-out group-hover:pointer-events-auto group-hover:opacity-100">
          <ul class="py-2">
            <li>
              <RouterLink
                to="/news"
                class="hover:text-selected block px-4 py-2 text-base">
                All
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="{ path: '/news', query: { category: 'update' } }"
                class="hover:text-selected block px-4 py-2 text-base">
                Update
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="{ path: '/news', query: { category: 'announcement' } }"
                class="hover:text-selected block px-4 py-2 text-base">
                Announcement
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="{ path: '/news', query: { category: 'other' } }"
                class="hover:text-selected block px-4 py-2 text-base">
                Other
              </RouterLink>
            </li>
          </ul>
        </div>
      </li>

      <!-- Development -->
      <li class="mx-5 inline-block">
        <RouterLink
          to="/#development"
          class="hover:text-selected flex items-center justify-center text-center text-base duration-300">
          Development
        </RouterLink>
      </li>

      <!-- Steam Wishlist -->
      <li class="mx-5 inline-block">
        <RouterLink
          to="#"
          class="hover:text-selected flex items-center justify-center text-center text-base duration-300">
          Steam Wishlist
        </RouterLink>
      </li>

      <!-- Search form -->
      <li class="relative inline-block">
        <form class="flex h-full items-center px-5" @submit.prevent="onSubmit">
          <fancy-input v-model="searchQuery" label="Browse Levels / Users">
          </fancy-input>
          <button
            type="submit"
            class="ml-2 rounded-full p-2 transition hover:bg-white/10"
            aria-label="Search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
            </svg>
          </button>
        </form>
      </li>
    </ul>

    <!-- NAVBAR LINKS FLOATING RIGHT  (unchanged) -->
    <ul
      class="float-right inline-flex h-full list-none items-center justify-start p-0">
      <li
        v-if="hasFriends()"
        @click="sidebarOpen = true"
        class="cursor-pointer">
        <img
          class="size-10 duration-200 hover:brightness-70"
          src="../assets/message_icon_inv.webp"
          alt="Messages" />
      </li>
      <li>
        <RouterLink
          to="/account"
          class="hover:text-selected mx-5 flex items-center justify-center text-center text-xl no-underline duration-200">
          <img
            class="size-10 duration-200 hover:brightness-70"
            src="../assets/account_icon_inv.webp"
            alt="Account" />
        </RouterLink>
      </li>
    </ul>
  </header>
  <messenger-sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
</template>
