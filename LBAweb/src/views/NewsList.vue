<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import axios from "axios";
import fancyInput from "@/components/fancy-input.vue";

const newsList = ref([]);
const user = ref(null);

// const months = ref([("Jan", 0*30), ("Feb", 1*30), ("Mar", 2*30), ("Apr", 3*30), ("May]);
onMounted(async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/news");
    newsList.value = response.data;
    fetchUserData();
  } catch (e) {
    console.error(e);
  }
});

const fetchUserData = async () => {
  // check if user is already logged in by using authentication token (could use "user" as well)
  const token = localStorage.getItem("auth_token");
  try {
    // makes request to a page that simply checks authentication token and returns user (safer than getting user straight up)
    const response = await axios.get("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    user.value = response.data;
  } catch (e) {
    console.error(e);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }
};

// ADMIN PAGE
const title = ref("");
const content = ref("");
const message = ref("");

async function storeNews() {
  try {
    // const response
    await axios.post("http://127.0.0.1:8000/api/news", {
      title: title.value,
      content: content.value,
    });
    message.value = "News created successfully!";
    // resetting input field values to be able to create new news
    title.value = "";
    content.value = "";
  } catch (e) {
    console.error(e);
  }
}

const adminPanelOpen = ref(false);
async function adminPanel() {
  adminPanelOpen.value = !adminPanelOpen.value;
}

// // NEWS PAGE SCROLLABLE SECTION (TIMELINE)
// const scrollContainer = ref(null);
// const isDragging = ref(false);
// const startX = ref(0);
// const scrollLeft = ref(0);

// const startDrag = (e) => {
//   isDragging.value = true;
//   startX.value = e.pageX - scrollContainer.value.offsetLeft;
//   scrollLeft.value = scrollContainer.value.scrollLeft;
// };

// const stopDrag = () => {
//   isDragging.value = false;
// };

// const doDrag = (e) => {
//   if (!isDragging.value) return;

//   e.preventDefault();
//   const x = e.pageX - scrollContainer.value.offsetLeft;
//   const drag = x - startX.value;
//   scrollContainer.value.scrollLeft = scrollLeft.value - drag;
// };

const timelineInstance = ref(null);

// Modified data transformation
const transformToTimelineFormat = (newsItems) => {
  return {
    events: newsItems.map((news) => ({
      start_date: {
        year: new Date(news.created_at).getFullYear(),
        month: new Date(news.created_at).getMonth() + 1,
        day: new Date(news.created_at).getDate(),
      },
      text: {
        headline: news.title,
        text: news.content,
      },
    })),
  };
};

// Wait for DOM and script to be ready
const initializeTimeline = () => {
  if (window.TL && newsList.value.length) {
    timelineInstance.value = new window.TL.Timeline(
      "timeline-embed",
      transformToTimelineFormat(newsList.value),
      {
        scale: "human",
        start_at_end: true,
        zoom_sequence: [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89],
      },
    );
  }
};

// Initialize when both script and data are ready
watch(newsList, async (newVal) => {
  if (newVal.length) {
    await nextTick();
    initializeTimeline();
  }
});

// Fallback check in case script loads after data
onMounted(() => {
  const checkTL = setInterval(() => {
    if (window.TL && newsList.value.length) {
      initializeTimeline();
      clearInterval(checkTL);
    }
  }, 100);
});

// // TIMELINE SETUP
// const dateWidth = ref(0); // needed to set width for the scrollable element
// const monthList = ref([]);
// const yearList = ref([]);
// const monthNames = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// const setDateWidth = () => {
//   const lowestDate = ref(null);
//   const highestDate = ref(null);
//   const BORDERDAYS = 360;

//   newsList.value.forEach((news) => {
//     const created_at = new Date(news.created_at);

//     if (!lowestDate.value || created_at < lowestDate.value) {
//       lowestDate.value = created_at;
//     }

//     if (!highestDate.value || created_at > highestDate.value) {
//       highestDate.value = created_at;
//     }
//   });

//   /* date difference is given in milliseconds, thus the need to divide:
//     - 1000 : milliseconds -> seconds
//     - 60 : seconds -> minutes
//     - 60 : minutes -> hours
//     - 24 : hours -> days
//   + BORDERDAYS(360) to the result of the division to ensure ~ half a year before and after the main dates
//   1 day = 1 rem
//   math round to ensure the result isnt ambiguous
//     */
//   dateWidth.value = Math.round(
//     (highestDate.value - lowestDate.value) / (1000 * 60 * 60 * 24) + BORDERDAYS,
//   );

//   const lowestMonth = lowestDate.value.getMonth();

//   for (var i = 0; i < dateWidth.value; i += 30) {
//     let monthName = "";
//     if (i < BORDERDAYS / 2) {
//       monthName =
//         monthNames[(lowestMonth + 12 - (BORDERDAYS / 2 - i) / 30) % 12];
//     } else {
//       monthName = monthNames[(lowestMonth + (i - BORDERDAYS / 2) / 30) % 12];
//     }

//     monthList.value.push({
//       name: monthName,
//       position: i,
//     });
//   }

//   console.log(monthList.value.find((month) => month.name === "Jan"));
// };
</script>
<template>
  <main
    class="relative flex min-h-screen w-full bg-linear-to-b from-[var(--background-primary)] to-[var(--background-secondary)] pb-18">
    <!-- ADMIN PANEL -->
    <div v-if="user && user.rights === 'admin'">
      <aside
        :class="adminPanelOpen ? 'translate-x-0' : '-translate-x-full'"
        class="fixed top-0 left-0 flex h-screen w-1/3 flex-col items-center justify-center gap-5 bg-black/70 px-5 pt-18 text-white shadow-lg transition-transform duration-300">
        <h2 class="text-3xl font-bold">Create news</h2>
        <fancy-input v-model="title" label="Title" class="w-2" />
        <textarea
          v-model="content"
          placeholder="Content"
          class="h-1/2 max-h-[90%] min-h-25 w-full resize-y overflow-auto rounded-2xl border border-white/20 bg-black/10 p-2 pb-18 text-base text-white shadow-md backdrop-blur-3xl hover:bg-black/20 hover:shadow-lg focus:bg-black/20 focus:ring-2 focus:ring-white/50 focus:outline-none">
        </textarea>
        <button
          @click="storeNews"
          class="w-1/2 cursor-pointer rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95">
          Submit
        </button>
        <p>{{ message }}</p>
      </aside>
      <button
        @click="adminPanel"
        class="fixed m-5 w-fit cursor-pointer rounded-2xl border border-white/10 bg-white/10 p-1 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95">
        <svg
          :class="adminPanelOpen ? 'rotate-180' : 'rotate-0'"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="size-6 transition-all duration-200">
          <path
            fill="currentColor"
            d="M16 21.308L6.692 12L16 2.692l1.064 1.064L8.819 12l8.244 8.244z" />
        </svg>
      </button>
    </div>
    <section
      id="timeline-embed"
      class="h-[600px] w-full bg-transparent"></section>
    <!-- NEWS LIST -->
    <!-- scrollable div  -->
    <!-- <section
      class="h-75 w-full cursor-move overflow-x-scroll overflow-y-hidden bg-black/60"
      ref="scrollContainer"
      @mousedown="startDrag"
      @mouseleave="stopDrag"
      @mouseup="stopDrag"
      @mousemove="doDrag"> -->
    <!-- div template created multiple times according to each news. -->
    <!-- <div
        :style="{ width: `${dateWidth}rem` }"
        v-if="newsList.length"
        class="relative flex h-full flex-row gap-10 bg-gradient-to-l from-red-300 via-purple-300 to-blue-300"> -->
    <!-- MONTHS -->
    <!-- <div
          :style="{ left: `${month.position}rem` }"
          v-for="month in monthList"
          :key="month.name"
          class="absolute bottom-5 w-120">
          <p class="sticky left-0 w-fit">{{ month.name }}</p>
        </div> -->
    <!-- YEARS -->
    <!-- <div
          v-for="year in yearList"
          :key="year.year"
          class="absolute bottom-0 w-1460">
          <p class="sticky left-0 w-fit">{{ year.year }}</p>
        </div> -->
    <!-- <div
          v-for="news in newsList"
          :key="news.id"
          class="h-75 w-250 bg-white/50">
          <div>
            <div class="h-full w-1 bg-white"></div>
            <h2>{{ news.title }}</h2>
            <small
              >Published:
              {{ new Date(news.created_at).toLocaleDateString() }}</small
            >
          </div>
        </div> -->
    <!-- </div> -->
    <!-- </section> -->
    <!-- <section class="m-auto max-w-200 flex-1 p-5">
      <h1 class="text-3xl">News</h1>
      <div v-if="newsList.length">
        <div
          v-for="news in newsList"
          :key="news.id"
          class="border-b-[1px] border-black p-4">
          <h2 class="text-xl">{{ news.title }}</h2>
          <small
            >Published: {{ new Date(news.created_at).toLocaleString() }}</small
          >
          <p v-html="news.content"></p>
        </div>
      </div>
      <p v-else>No news available.</p>
    </section> -->
  </main>
</template>
<style scoped>
/* Ensure proper dimensions */
#timeline-embed {
  height: 600px;
  width: 100%;
}

/* Override timeline styles */
:deep(.tl-timeline) {
  font-family: inherit;
  background: rgba(255, 255, 255, 0.1);
}

:deep(.tl-timeline h1),
:deep(.tl-timeline h2) {
  color: white !important;
}

:deep(.tl-timenav) {
  background: rgba(0, 0, 0, 0.5);
}
</style>
