<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import NewsCard from "@/components/news-card.vue";

const newsList = ref([]);
const latestNews = computed(() => newsList.value[0] || null);
const smallNews = computed(() => newsList.value.slice(1, 4));

onMounted(async () => {
  try {
    const { data } = await axios.get("/news");
    newsList.value = data;
  } catch (e) {
    console.error("Failed loading news", e);
  }
});
</script>

<template>
  <main>
    <!-- TITLE -->
    <section class="bg-primary mx-0 grid gap-12 py-12 text-center text-xl">
      <p class="px-12">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quis urna
        ante. Nullam tempus, nisl eget elementum tempus, quam orci volutpat
        lorem, sed hendrerit turpis tellus id lorem. Aenean dapibus, ligula
        imperdiet ultrices hendrerit, mauris neque fermentum dolor, non iaculis
        leo nisl non arcu. Donec elit tellus, finibus a ante non, gravida
        porttitor mi. Sed ipsum arcu, efficitur eu dignissim id, cursus sit amet
        felis. Curabitur convallis enim lacus, a egestas mi ultrices vel.
        Curabitur vitae euismod est. Nullam convallis feugiat mi, at venenatis
        dolor interdum sit amet. Ut vitae mauris quis nibh ornare condimentum.
        Sed fermentum lorem sed erat malesuada scelerisque. Sed nec laoreet
        lacus.
      </p>
    </section>
    <!-- NEWS -->
    <!-- NEWS PANEL -->
    <section
      class="from-primary-2/10 to-background mx-0 bg-linear-120 py-12 text-white">
      <div class="mx-4 flex flex-col gap-12 lg:flex-row">
        <!-- LEFT: 1/3 width -->
        <div class="flex w-full flex-col justify-center px-4 lg:w-1/4">
          <h2 class="mb-4 text-3xl font-bold">NEWS</h2>
          <p class="text-lg font-light">
            Follow our latest exciting events regarding the development of
            "Lights, Beats, Action!" and be part of our community!
          </p>
        </div>

        <!-- RIGHT: 2/3 width -->
        <div class="w-full space-y-12 lg:w-3/4">
          <!-- Big + small cards same as above -->
          <div
            v-if="latestNews"
            class="bg-background-2/30 block h-116 overflow-hidden rounded-lg shadow-lg transition hover:shadow-2xl">
            <news-card :news="latestNews" :big="true" />
          </div>
          <div
            class="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="item in smallNews"
              :key="item.id"
              class="grid h-76 w-full max-w-xs overflow-hidden rounded-lg shadow-lg transition hover:shadow-2xl">
              <news-card :news="item" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- CARDS -->
    <section
      class="bg-background mx-0 flex h-full items-center justify-around gap-12 p-12 text-center text-xl text-white">
      <!-- DISCORD CARD -->
      <a href="https://discord.com" class="group h-full w-[30%] no-underline">
        <div
          class="from-primary via-primary to-primary hover:from-secondary hover:via-secondary hover:to-secondary text-selected flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl bg-linear-to-t text-center duration-500 hover:z-10 hover:scale-105 hover:bg-linear-to-t hover:text-black hover:ease-out">
          <img
            src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6918e57475a843f59f_icon_clyde_black_RGB.svg"
            alt=""
            class="size-19 invert duration-500 ease-out group-hover:invert-0" />
          <br />
          <p class="px-8">
            Join our official discord server, as it is our main source of
            recieving feedback from our YOU!
          </p>
        </div>
      </a>
      <!-- STEAM CARD -->
      <a
        href="https://store.steampowered.com"
        class="group h-full w-[30%] no-underline">
        <div
          class="from-primary via-primary to-primary hover:from-secondary hover:via-secondary hover:to-secondary text-selected flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl bg-linear-to-t text-center duration-500 hover:z-10 hover:scale-105 hover:bg-linear-to-t hover:text-black hover:ease-out">
          <img
            src="../assets/steam_logo_icon.webp"
            alt=""
            class="size-19 invert duration-500 ease-in-out group-hover:invert-0" />
          <br />
          <p class="px-8">
            Wishlist our game on steam NOW! Don't forget to let us know about
            your experience!
          </p>
        </div>
      </a>
      <!-- ACCOUNT CARD (MIGHT CHANGE) -->
      <router-link to="/account" class="group h-full w-[30%] no-underline">
        <div
          class="from-primary via-primary to-primary hover:from-secondary hover:via-secondary hover:to-secondary text-selected flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl bg-linear-to-t text-center duration-500 hover:z-10 hover:scale-105 hover:bg-linear-to-t hover:text-black hover:ease-out">
          <img
            src="../assets/account_icon.webp"
            alt=""
            class="size-19 invert duration-500 ease-in-out group-hover:invert-0" />
          <br />
          <p class="px-8">
            Create an account for further usage in both our GAME and WEBSITE!
          </p>
        </div>
      </router-link>
    </section>
    <!-- DEVELOPMENT -->
    <section
      id="development"
      class="from-primary to-secondary h-[5000px] bg-linear-to-b from-0% p-12 font-bold">
      <p>
        Bunch of info about the game, history of development as well as some
        other details, socials (?) and useful links, on scroll moving section
      </p>
    </section>
  </main>
</template>

<style scoped>
@media (max-width: 600px) {
  .cards-page {
    flex-direction: column;
    gap: 30px;
  }

  .cards-page a {
    width: 90%;
  }
}
</style>
