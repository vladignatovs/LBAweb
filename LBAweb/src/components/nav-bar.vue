<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
  <header
    class="sticky top-0 z-50 h-18 items-center scroll-smooth bg-black/60 text-xl text-[var(--text)] backdrop-blur-3xl">
    <!-- NAVBAR LINKS FLOATING LEFT  -->
    <ul class="inline-flex h-full list-none justify-start p-0">
      <li class="relative inline-block">
        <RouterLink
          to="/"
          class="flex h-full items-center justify-center px-5 text-center text-xl text-white duration-200 hover:text-[var(--text)]">
          <img
            src="../assets/LBA_invert_logo_prot1.webp"
            alt="HOME"
            class="h-10 w-24 duration-200 hover:brightness-70" />
        </RouterLink>
      </li>
      <!-- main dropdown -->
      <li class="group relative inline-block hover:text-[var(--text)]">
        <RouterLink
          to="#"
          class="group flex h-full items-center justify-center px-5 text-center text-xl text-white duration-300 hover:text-[var(--text)]">
          LEARN MORE
        </RouterLink>

        <!-- dropdown menu -->
        <ul
          class="absolute top-full left-0 h-0 w-full overflow-hidden bg-black/60 opacity-0 backdrop-blur-3xl duration-200 ease-in-out group-hover:h-[300%] group-hover:opacity-100">
          <!-- dropdown item -->
          <li class="relative block h-[33.3%]">
            <RouterLink
              to=""
              class="flex h-full items-center justify-center px-5 text-center text-base text-white duration-300 hover:text-[var(--text)]">
              NEWS
            </RouterLink>
          </li>

          <!-- dropdown item -->
          <li class="relative block h-[33.3%]">
            <RouterLink
              to="#"
              class="flex h-full items-center justify-center px-5 text-center text-base text-white no-underline duration-300 hover:text-[var(--text)]">
              DEVELOPMENT
            </RouterLink>
          </li>

          <!-- dropdown item -->
          <li class="relative block h-[33.3%]">
            <RouterLink
              to="#"
              class="flex h-full items-center justify-center px-5 text-center text-base text-white no-underline duration-300 hover:text-[var(--text)]">
              LIGHTS BEATS ACTION
            </RouterLink>
          </li>
        </ul>
      </li>
      <li class="relative inline-block">
        <form
          action=""
          class="flex h-full items-center justify-center px-5 text-center text-xl text-white no-underline duration-200 hover:text-[var(--text)]">
          <input
            type="text"
            class="w-56"
            placeholder="Browse levels / accounts ..." />
        </form>
        <!-- <RouterLink
          to="/account"
          class="flex h-full items-center justify-center px-5 text-center text-xl text-white no-underline duration-200 hover:text-[var(--text)]">
          <input type="text" placeholder="Browse levels / accounts ..." />
        </RouterLink> -->
      </li>
    </ul>

    <!-- NAVBAR LINKS FLOATING RIGHT  -->
    <ul class="float-right inline-flex h-full list-none justify-start p-0">
      <li>
        <!-- <p>MESSAGER</p> -->
      </li>
      <li>
        <RouterLink
          to="/account"
          class="flex h-full items-center justify-center px-5 text-center text-xl text-white no-underline duration-200 hover:text-[var(--text)]">
          <img
            class="size-10 duration-200 hover:brightness-70"
            src="../assets/account_icon_inv.webp"
            alt="" />
          <!-- <p> ACCOUNT</p> -->
        </RouterLink>
      </li>
    </ul>
  </header>
</template>
