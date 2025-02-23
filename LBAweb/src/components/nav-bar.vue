<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
  <header
    class="sticky top-0 z-50 h-18 items-center scroll-smooth text-xl text-white">
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
            alt="HOME"
            class="h-10 w-24 duration-200 hover:brightness-70" />
        </RouterLink>
      </li>
      <!-- main dropdown -->
      <li class="group relative mx-5">
        <button
          type="button"
          class="cursor-pointer text-xl duration-300 hover:text-[var(--text)]">
          LEARN MORE
        </button>
        <!-- <RouterLink
          to="#"
          class="text-xl duration-300 hover:text-[var(--text)]">
          LEARN MORE
        </RouterLink> -->
        <!-- dropdown menu -->
        <!-- TODO THIS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
        <div
          class="absolute top-6 h-0 w-fit rounded-2xl border-1 border-[var(--text)]/25 bg-black/60 opacity-0 backdrop-blur-3xl duration-200 ease-in-out group-hover:h-[600%] group-hover:opacity-100">
          <ul class="h-full">
            <!-- dropdown item -->
            <li class="relative block h-[33.3%]">
              <RouterLink
                to=""
                class="flex h-full items-center justify-center px-5 text-center text-base duration-300 hover:text-[var(--text)]">
                NEWS
              </RouterLink>
            </li>

            <!-- dropdown item -->
            <li class="relative block h-[33.3%]">
              <RouterLink
                to="#"
                class="flex h-full items-center justify-center px-5 text-center text-base no-underline duration-300 hover:text-[var(--text)]">
                DEVELOPMENT
              </RouterLink>
            </li>

            <!-- dropdown item -->
            <li class="relative block h-[33.3%]">
              <RouterLink
                to="#"
                class="flex h-full items-center justify-center px-5 text-center text-base no-underline duration-300 hover:text-[var(--text)]">
                STEAM WISHLIST
              </RouterLink>
            </li>
          </ul>
        </div>
      </li>
      <li class="relative inline-block">
        <form
          action=""
          class="flex h-full items-center justify-center px-5 text-center text-xl no-underline duration-200 hover:text-[var(--text)]">
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
          class="flex h-full items-center justify-center px-5 text-center text-xl no-underline duration-200 hover:text-[var(--text)]">
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
