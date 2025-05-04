<script setup>
import { RouterLink } from "vue-router";
import fancyInput from "./fancy-input.vue";
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
        <form
          class="flex h-full w-64 items-center justify-center px-5 text-center text-xl duration-200">
          <fancyInput label="Browse Levels / Accounts" />
        </form>
      </li>
    </ul>

    <!-- NAVBAR LINKS FLOATING RIGHT  (unchanged) -->
    <ul
      class="float-right inline-flex h-full list-none items-center justify-start p-0">
      <li>
        <img
          class="size-10 duration-200 hover:brightness-70"
          src="../assets/message_icon_inv.webp"
          alt="Message" />
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
</template>
