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
      <li class="inline-block">
        <RouterLink
          to="/"
          class="mx-5 flex items-center justify-center text-center text-xl">
          <img
            src="../assets/LBA_invert_logo_prot1.webp"
            alt="Home"
            class="h-10 w-24 duration-200 hover:brightness-70" />
        </RouterLink>
      </li>
      <!-- main dropdown -->
      <li class="group relative mx-5">
        <button
          type="button"
          class="group-hover:text-selected flex cursor-pointer items-center text-xl duration-300">
          Learn More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="inline-block size-6 transition-transform duration-300 ease-in-out group-hover:rotate-180">
            <path d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z" />
          </svg>
        </button>

        <!-- Invisible hover bridge to keep the dropdown open -->
        <div
          class="pointer-events-none absolute top-full left-0 h-6 w-full group-hover:pointer-events-auto"></div>

        <!-- Dropdown Menu -->
        <div
          class="pointer-events-none absolute top-10 left-0 h-0 w-fit rounded-2xl border border-white/20 bg-black/30 opacity-0 shadow-lg backdrop-blur-3xl duration-200 ease-in-out group-hover:pointer-events-auto group-hover:h-[600%] group-hover:opacity-100">
          <ul class="h-full">
            <!-- Dropdown Item -->
            <li class="relative block h-[33.3%]">
              <RouterLink
                to="/news"
                class="hover:text-selected flex h-full items-center justify-center px-5 text-center text-base duration-300">
                News
              </RouterLink>
            </li>

            <!-- Dropdown Item -->
            <li class="relative block h-[33.3%]">
              <RouterLink
                to="/#development"
                class="hover:text-selected flex h-full items-center justify-center px-5 text-center text-base no-underline duration-300">
                Development
              </RouterLink>
            </li>

            <!-- Dropdown Item -->
            <li class="relative block h-[33.3%]">
              <RouterLink
                to="#"
                class="hover:text-selected flex h-full items-center justify-center px-5 text-center text-base no-underline duration-300">
                Steam Wishlist
              </RouterLink>
            </li>
          </ul>
        </div>
      </li>
      <li class="relative inline-block">
        <form
          action=""
          class="flex h-full w-64 items-center justify-center px-5 text-center text-xl no-underline duration-200">
          <fancy-input label="Browse Levels / Accounts" />
        </form>
      </li>
    </ul>
    <!-- NAVBAR LINKS FLOATING RIGHT  -->
    <ul
      class="float-right inline-flex h-full list-none items-center justify-start p-0">
      <!-- MESSAGE -->
      <li>
        <img
          class="size-10 duration-200 hover:brightness-70"
          src="../assets/message_icon_inv.webp"
          alt="Message" />
      </li>
      <!-- ACCOUNT -->
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
