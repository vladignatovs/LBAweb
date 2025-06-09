<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserActions } from "@/composables/useUserActions";
import { useMessengerStore } from "@/stores/useMessengerStore";
import messengerSidebar from "./messenger-sidebar.vue";
import fancyInputWithSubmit from "./fancy-input-with-submit.vue";

const { hasFriends } = useUserActions();
const messenger = useMessengerStore();

const router = useRouter();
const searchQuery = ref("");

// track mobile menu state
const isMobileMenuOpen = ref(false);

// Called when the form is submitted
function onSubmit() {
  if (searchQuery.value.trim().length >= 2) {
    router.push({ name: "Browse", query: { q: searchQuery.value.trim() } });
    isMobileMenuOpen.value = false; // close menu on navigate
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-50 flex h-18 flex-nowrap items-center justify-between text-xl text-white">
    <!-- bg filler -->
    <div class="fixed z-[-10] h-18 w-full bg-black/60 backdrop-blur-3xl"></div>

    <!-- LEFT SIDE -->
    <ul class="inline-flex h-full list-none items-center justify-start p-0">
      <!-- Logo -->
      <li class="inline-block flex-shrink-0">
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
      <li class="group relative mx-5 hidden md:inline-block">
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
        <div
          class="pointer-events-none absolute top-full left-0 h-6 w-full group-hover:pointer-events-auto"></div>
        <div
          class="pointer-events-none absolute top-full left-0 mt-2 w-40 rounded border border-white/20 bg-black/30 opacity-0 shadow-lg backdrop-blur-3xl transition-all duration-200 ease-in-out group-hover:pointer-events-auto group-hover:opacity-100">
          <ul class="py-2">
            <li>
              <RouterLink
                to="/news"
                class="hover:text-selected block px-4 py-2 text-base"
                >All</RouterLink
              >
            </li>
            <li>
              <RouterLink
                :to="{ path: '/news', query: { category: 'update' } }"
                class="hover:text-selected block px-4 py-2 text-base"
                >Update</RouterLink
              >
            </li>
            <li>
              <RouterLink
                :to="{ path: '/news', query: { category: 'announcement' } }"
                class="hover:text-selected block px-4 py-2 text-base"
                >Announcement</RouterLink
              >
            </li>
            <li>
              <RouterLink
                :to="{ path: '/news', query: { category: 'other' } }"
                class="hover:text-selected block px-4 py-2 text-base"
                >Other</RouterLink
              >
            </li>
          </ul>
        </div>
      </li>

      <!-- Development -->
      <li class="mx-5 hidden md:inline-block">
        <RouterLink
          to="/#development"
          class="hover:text-selected flex items-center justify-center text-center text-base duration-300"
          >Development</RouterLink
        >
      </li>

      <!-- Steam Wishlist -->
      <li class="mx-5 hidden md:inline-block">
        <RouterLink
          to="#"
          class="hover:text-selected flex items-center justify-center text-center text-base duration-300"
          >Steam Wishlist</RouterLink
        >
      </li>

      <!-- Search form -->
      <li class="relative hidden md:inline-block">
        <fancy-input-with-submit
          v-model="searchQuery"
          label="Browse Levels / Users"
          autocomplete="off"
          @submit="onSubmit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-8"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path
              d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.52 6.52 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5" />
          </svg>
        </fancy-input-with-submit>
      </li>
    </ul>

    <!-- RIGHT SIDE -->
    <ul class="flex h-full list-none flex-nowrap items-center p-0">
      <!-- Messenger -->
      <li
        v-if="hasFriends()"
        @click="messenger.openMessenger()"
        class="hidden flex-shrink-0 cursor-pointer md:inline-block">
        <img
          class="size-10 duration-200 hover:brightness-70"
          src="../assets/message_icon_inv.webp"
          alt="Messages" />
      </li>
      <!-- Account -->
      <li class="hidden flex-shrink-0 md:inline-block">
        <RouterLink
          to="/account"
          class="hover:text-selected mx-5 flex items-center justify-center text-center text-xl no-underline duration-200">
          <img
            class="size-10 duration-200 hover:brightness-70"
            src="../assets/account_icon_inv.webp"
            alt="Account" />
        </RouterLink>
      </li>
      <!-- Hamburger toggle -->
      <li class="mx-5 block flex-shrink-0 md:hidden">
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          aria-label="Toggle menu"
          class="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24">
            <!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE -->
            <path
              fill="currentColor"
              d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
          </svg>
        </button>
      </li>
    </ul>

    <!-- MOBILE MENU PANEL -->
    <div
      v-if="isMobileMenuOpen"
      class="absolute top-full left-0 z-40 w-full bg-black/60 backdrop-blur-3xl md:hidden">
      <ul class="flex flex-col space-y-4 p-4">
        <li>
          <RouterLink
            to="/news"
            @click="isMobileMenuOpen = false"
            class="block text-base"
            >News</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/#development"
            @click="isMobileMenuOpen = false"
            class="block text-base"
            >Development</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="#"
            @click="isMobileMenuOpen = false"
            class="block text-base"
            >Steam Wishlist</RouterLink
          >
        </li>
        <li>
          <fancy-input-with-submit
            v-model="searchQuery"
            label="Browse Levels / Users"
            autocomplete="off"
            @submit="onSubmit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-8"
              viewBox="0 0 24 24"
              fill="currentColor">
              <path
                d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.52 6.52 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5" />
            </svg>
          </fancy-input-with-submit>
        </li>
        <li v-if="hasFriends()">
          <button
            @click="
              messenger.openMessenger();
              isMobileMenuOpen = false;
            "
            class="flex items-center space-x-2">
            <img
              src="../assets/message_icon_inv.webp"
              alt="Messages"
              class="size-10 duration-200 hover:brightness-70" />
            <span>Messages</span>
          </button>
        </li>
        <li>
          <RouterLink
            to="/account"
            @click="isMobileMenuOpen = false"
            class="flex items-center space-x-2">
            <img
              src="../assets/account_icon_inv.webp"
              alt="Account"
              class="size-10 duration-200 hover:brightness-70" />
            <span>Account</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </header>

  <messenger-sidebar
    :open="messenger.isOpen"
    @close="messenger.closeMessenger" />
</template>
