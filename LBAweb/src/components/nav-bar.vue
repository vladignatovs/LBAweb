<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
  <header
    class="sticky top-0 z-50 h-18 items-center scroll-smooth bg-black/60 text-xl text-[var(--text)] backdrop-blur-3xl">
    <ul class="inline-flex h-full list-none justify-start p-0">
      <li class="relative inline-block">
        <RouterLink
          to="/"
          class="flex h-full items-center justify-center px-5 text-center text-xl text-white duration-500 hover:text-2xl hover:text-[var(--text)]">
          HOME
        </RouterLink>
      </li>
      <!-- main dropdown -->
      <li
        class="group relative inline-block hover:text-2xl hover:text-[var(--text)]">
        <RouterLink
          to="#"
          class="flex h-full items-center justify-center px-5 text-center text-xl text-white duration-300 group-hover:text-2xl hover:text-[var(--text)]">
          LEARN MORE
        </RouterLink>

        <!-- dropdown menu -->
        <ul
          class="absolute top-full left-0 h-0 w-full overflow-hidden bg-black/60 opacity-0 backdrop-blur-3xl duration-500 ease-in-out group-hover:h-[300%] group-hover:opacity-100">
          <!-- dropdown item -->
          <li class="relative block h-[33.3%]">
            <RouterLink
              to="/#about"
              class="flex h-full items-center justify-center px-5 text-center text-base text-white duration-300 hover:text-xl hover:text-[var(--text)]">
              ABOUT US
            </RouterLink>
          </li>

          <!-- dropdown item -->
          <li class="relative block h-[33.3%]">
            <RouterLink
              to="#"
              class="flex h-full items-center justify-center px-5 text-center text-base text-white no-underline duration-300 hover:text-xl hover:text-[var(--text)]">
              PATCH NOTES
            </RouterLink>
          </li>

          <!-- dropdown item -->
          <li class="relative block h-[33.3%]">
            <RouterLink
              to="#"
              class="flex h-full items-center justify-center px-5 text-center text-base text-white no-underline duration-300 hover:text-xl hover:text-[var(--text)]">
              FORUM
            </RouterLink>
          </li>
        </ul>
      </li>
      <li class="relative inline-block">
        <RouterLink
          to="/account"
          class="flex h-full items-center justify-center px-5 text-center text-xl text-white no-underline duration-500 hover:text-2xl hover:text-[var(--text)]">
          ACCOUNT
        </RouterLink>
      </li>
    </ul>
  </header>
</template>
