<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <header
    class="flex items-center h-18 text-xl text-[var(--text)] bg-black scroll-smooth border-b-2 border-b-[var(--primary)]"
  >
    <ul class="p-0 h-full inline-flex justify-start list-none">
      <li class="inline-block relative">
        <RouterLink
          to="/"
          class="px-5 h-full flex justify-center items-center text-white duration-500 no-underline text-xl text-center hover:bg-[var(--accent)]/50"
          >HOME</RouterLink
        >
      </li>
      <!-- main dropdown -->
      <li class="inline-block relative group hover:bg-[var(--accent)]/20">
        <RouterLink
          to="#"
          class="px-5 h-full flex justify-center items-center text-white no-underline text-xl text-center duration-300 hover:bg-[var(--accent)]/30"
        >
          LEARN MORE
        </RouterLink>

        <!-- dropdown menu -->
          <ul
          class="absolute top-full left-0 w-full h-0 overflow-hidden bg-black opacity-0 duration-500 ease-in-out group-hover:h-[300%] group-hover:opacity-100"
        >
          <!-- dropdown item -->
          <li class="block relative h-[33.3%]">
            <RouterLink
              to="/#about"
              class="px-5 h-full flex justify-center items-center text-white no-underline text-base text-center duration-300 hover:bg-[var(--accent)]/30"
            >
              ABOUT US
            </RouterLink>
          </li>

          <!-- dropdown item -->
          <li class="block relative h-[33.3%]">
            <RouterLink
              to="#"
              class="px-5 h-full flex justify-center items-center text-white no-underline text-base text-center duration-300 hover:bg-[var(--accent)]/30"
            >
              PATCH NOTES
            </RouterLink>
          </li>

          <!-- dropdown item -->
          <li class="block relative h-[33.3%]">
            <RouterLink
              to="#"
              class="px-5 h-full flex justify-center items-center text-white no-underline text-base text-center duration-300 hover:bg-[var(--accent)]/30"
            >
              FORUM
            </RouterLink>
          </li>
        </ul>
      </li>
      <li class="inline-block relative">
        <RouterLink
          to="/account"
          class="px-5 h-full flex justify-center items-center text-white duration-500 no-underline text-xl text-center hover:bg-[var(--accent)]/50"
          >ACCOUNT</RouterLink
        >
      </li>
    </ul>
  </header>
</template>
