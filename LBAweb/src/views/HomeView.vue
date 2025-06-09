<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import NewsCard from "@/components/news-card.vue";

// ------------------------
//  NEWS FETCHING
// ------------------------
const newsList = ref([]);
const latestNews = computed(() => newsList.value[0] || null);
const smallNews = computed(() => newsList.value.slice(1, 4));

// ------------------------
//  DEVELOPMENT TIMELINE DATA
// ------------------------
const devChapters = [
  {
    title: "Initial Concept",
    date: "February 2023",
    text: "The core idea emerged during a local rhythm-game jam. A tiny prototype mixing dynamic lighting with beat-matching mechanics wowed the judges and earned us the motivation to continue.",
    image: new URL("../assets/dev/initial.webp", import.meta.url),
  },
  {
    title: "Prototype Build",
    date: "May 2023",
    text: "Over three intense months we transformed the jam prototype into a playable slice showcasing our unique level editor and reactive LEDs.",
    image: new URL("../assets/dev/prototype.webp", import.meta.url),
  },
  {
    title: "Community Play-test",
    date: "October 2023",
    text: "An early Discord play-test gathered the first 1 000 players, whose feedback shaped our combo system and accessibility modes.",
    image: new URL("../assets/dev/playtest.webp", import.meta.url),
  },
  {
    title: "Steam Next Fest Demo",
    date: "February 2024",
    text: "Our polished demo hit Steam Next Fest and collected 50 000 wish-lists in a week, confirming the market fit.",
    image: new URL("../assets/dev/nextfest.webp", import.meta.url),
  },
  {
    title: "Early Access",
    date: "August 2024",
    text: "Early Access opened with six story chapters, co-op support, and the first modding tools.",
    image: new URL("../assets/dev/earlyaccess.webp", import.meta.url),
  },
  {
    title: "Full Release",
    date: "June 2025",
    text: "Version 1.0 launched with a cinematic campaign, advanced lighting engine, and full cross-platform multiplayer.",
    image: new URL("../assets/dev/release.webp", import.meta.url),
  },
];

const sectionRef = ref(null);
const trackRef = ref(null);
const totalSlides = devChapters.length;
const rawIndex = ref(0);
const slideProgresses = ref([]);
const progress = ref(0);
const hasScrolledToEnd = computed(() => progress.value >= 1);

function handleScroll() {
  const section = sectionRef.value;
  const track = trackRef.value;
  if (!section || !track) return;

  // how far we've scrolled inside the whole timeline
  const maxScroll = section.offsetHeight - window.innerHeight;
  const scrollY = Math.min(
    Math.max(-section.getBoundingClientRect().top, 0),
    maxScroll,
  );

  const slideHeight = section.offsetHeight / totalSlides;
  rawIndex.value = scrollY / slideHeight;

  const THRESHOLD = 0.3;
  // for each slide, p = 1 when rawIndex≈i, down to 0 as you move away
  slideProgresses.value = devChapters.map((_, i) => {
    const raw = 1 - Math.abs(rawIndex.value - i);
    const clamped = Math.max(0, Math.min(raw, 1));
    // map [THRESHOLD…1] → [0…1]
    const p =
      clamped <= THRESHOLD ? 0 : (clamped - THRESHOLD) / (1 - THRESHOLD);
    return p;
  });
  const index = Math.floor(rawIndex.value);
  const intra = rawIndex.value - index;
  const moveProgress = Math.max(0, (intra - 0.35) / 0.65);
  const translateX = -(index + moveProgress) * 100;
  track.style.transform = `translateX(${translateX}vw)`;

  progress.value = maxScroll > 0 ? scrollY / maxScroll : 0;
}

onMounted(async () => {
  window.addEventListener("scroll", handleScroll, { passive: true });

  try {
    const { data } = await axios.get("/news");
    newsList.value = data;
  } catch (e) {
    console.error("Failed loading news", e);
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <main class="text-white">
    <!-- TRAILER -->
    <section
      class="relative flex min-h-screen w-full flex-col items-center justify-center bg-black/60">
      <h1
        class="mb-8 text-center text-4xl font-extrabold drop-shadow-xl md:text-6xl lg:text-7xl">
        Lights, Beats, Action!
      </h1>

      <!-- Trailer card -->
      <div
        class="group relative w-[80vw] max-w-[900px] rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-105">
        <!-- Glow underneath -->
        <div
          class="bg-primary/50 group-hover:bg-secondary/60 absolute inset-x-8 -bottom-6 h-8 rounded-full opacity-70 blur-2xl"></div>

        <!-- Poster / placeholder image -->
        <img
          src="../assets/trailer_test.webp"
          alt="Gameplay trailer placeholder"
          class="h-full w-full rounded-lg object-cover" />

        <!-- Play button overlay -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="flex size-24 items-center justify-center rounded-full bg-white/30 backdrop-blur-md transition duration-300 group-hover:bg-white/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-12 text-white drop-shadow"
              viewBox="0 0 24 24">
              <!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE -->
              <path fill="currentColor" d="M8 5.14v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- NEWS -->
    <section class="from-primary-2/10 to-background mx-0 bg-linear-120 py-12">
      <div class="mx-4 flex flex-col gap-12 lg:flex-row">
        <div class="flex w-full flex-col justify-center px-4 lg:w-1/4">
          <h2 class="mb-4 text-3xl font-bold">NEWS</h2>
          <p class="text-lg font-light">
            Follow our latest exciting events regarding
            <span class="font-semibold">Lights, Beats, Action!</span> and be
            part of our community!
          </p>
        </div>

        <div class="w-full space-y-12 lg:w-3/4">
          <div
            v-if="latestNews"
            class="bg-background-2/30 block h-116 overflow-hidden rounded-lg shadow-lg transition hover:shadow-2xl">
            <NewsCard :news="latestNews" :big="true" :isAdmin="false" />
          </div>

          <div
            class="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="item in smallNews"
              :key="item.id"
              class="grid h-76 w-full max-w-xs overflow-hidden rounded-lg shadow-lg transition hover:shadow-2xl">
              <NewsCard :news="item" :isAdmin="false" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- COMMUNITY CARDS -->
    <section
      class="bg-background mx-0 flex h-full flex-wrap items-center justify-around gap-12 p-12 text-center text-xl">
      <!-- DISCORD CARD -->
      <a
        href="https://discord.com"
        class="group h-full w-[30%] min-w-[260px] no-underline">
        <div
          class="bg-primary-2/60 hover:bg-primary-2 text-selected flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl transition duration-500 hover:z-10 hover:scale-105 hover:bg-linear-to-t hover:text-black">
          <img
            src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6918e57475a843f59f_icon_clyde_black_RGB.svg"
            alt="Discord logo"
            class="size-19 invert transition duration-500 group-hover:invert-0" />
          <p class="px-8 pt-4">
            Join our official Discord—your feedback powers our rhythm!
          </p>
        </div>
      </a>

      <!-- STEAM CARD -->
      <a
        href="https://store.steampowered.com"
        class="group h-full w-[30%] min-w-[260px] no-underline">
        <div
          class="bg-primary-2/60 hover:bg-primary-2 text-selected flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl transition duration-500 hover:z-10 hover:scale-105 hover:bg-linear-to-t hover:text-black">
          <img
            src="../assets/steam_logo_icon.webp"
            alt="Steam logo"
            class="size-19 invert transition duration-500 group-hover:invert-0" />
          <p class="px-8 pt-4">
            Wishlist on Steam now and join our launch-day party!
          </p>
        </div>
      </a>

      <!-- ACCOUNT CARD -->
      <router-link
        to="/account"
        class="group h-full w-[30%] min-w-[260px] no-underline">
        <div
          class="bg-primary-2/60 hover:bg-primary-2 text-selected flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl transition duration-500 hover:z-10 hover:scale-105 hover:bg-linear-to-t hover:text-black">
          <img
            src="../assets/account_icon.webp"
            alt="Account icon"
            class="size-19 invert transition duration-500 group-hover:invert-0" />
          <p class="px-8 pt-4">
            Create an account for exclusive perks in both game and web!
          </p>
        </div>
      </router-link>
    </section>

    <!-- DEVELOPMENT TIMELINE -->
    <section
      id="development"
      ref="sectionRef"
      class="relative"
      :style="{ height: `${totalSlides * 200}vh` }">
      <div
        class="from-background via-primary/20 to-background sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-gradient-to-b transition-opacity duration-300 ease-in-out"
        :class="{ 'pointer-events-none opacity-0': hasScrolledToEnd }">
        <!-- Horizontal track holding all slides -->
        <div
          ref="trackRef"
          class="flex h-full transition-transform duration-[0ms]"
          :style="{ width: `calc(100vw * ${totalSlides})` }">
          <div
            v-for="(chapter, i) in devChapters"
            :key="`chapter-${i}`"
            class="flex h-full w-screen flex-col items-center justify-center gap-6 px-8 transition-opacity duration-500 ease-in-out md:flex-row md:px-24"
            :style="{
              opacity: slideProgresses[i],
            }"
            :class="i % 2 === 1 ? 'md:flex-row-reverse' : ''">
            <img
              :src="chapter.image"
              :alt="chapter.title"
              class="w-full max-w-[380px] rounded-lg shadow-lg md:w-1/2" />
            <div class="md:w-1/2">
              <h3 class="mb-2 text-4xl font-bold">{{ chapter.title }}</h3>
              <span class="text-primary-200 mb-4 block">{{
                chapter.date
              }}</span>
              <p class="max-w-xl text-lg leading-relaxed">{{ chapter.text }}</p>
            </div>
          </div>
        </div>

        <!-- Timeline bar -->
        <div class="absolute bottom-8 left-0 w-full px-12">
          <div class="relative h-1 w-full rounded bg-white/40">
            <div
              class="bg-primary absolute top-0 left-0 h-full rounded"
              :style="{ width: `${progress * 100}%` }"></div>
          </div>
        </div>
      </div>
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
