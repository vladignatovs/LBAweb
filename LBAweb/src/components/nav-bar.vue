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
              <!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE -->
              <path
                fill="currentColor"
                d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.52 6.52 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5" />
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
