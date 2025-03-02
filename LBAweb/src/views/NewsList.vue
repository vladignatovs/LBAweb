<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import axios from "axios";
import fancyInput from "@/components/fancy-input.vue";

const newsList = ref([]);
const timelineInstance = ref(null);
const user = ref(null);

onMounted(async () => {
  try {
    // fetch for news data, then,
    // if timeline and newslist already exist, reinitialize timeline and cancel the wait else wait
    const response = await axios.get("http://127.0.0.1:8000/api/news");
    newsList.value = response.data;

    const checkTL = setInterval(() => {
      // will be a double if statement because i need to run clearInterval as well if true
      if (window.TL && newsList.value.length) {
        initializeTimeline();
        clearInterval(checkTL);
      }
    }, 100);

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

// since im not using json, i need to set events manually, and im putting newsList mapping, where start_date (event value)
// is taken from news.created_at and text is taken from news.title and news.content (surprisingly markup works just fine)

const transformToTimelineFormat = (newsItems) => {
  return {
    events: newsItems.map((news) => ({
      start_date: {
        year: new Date(news.created_at).getFullYear(),
        month: new Date(news.created_at).getMonth() + 1,
        day: new Date(news.created_at).getDate(), // new Date(news.created_at).getDate()
      },
      text: {
        headline: news.title,
        text: news.content,
      },
    })),
  };
};

// creating new timeline instance with newsList mapping
const initializeTimeline = () => {
  if (window.TL && newsList.value.length) {
    timelineInstance.value = new window.TL.Timeline(
      "timeline-embed",
      transformToTimelineFormat(newsList.value),
      {
        start_at_end: true,
        default_bg_color: (255, 255, 0),
        timenav_position: "top",
        base_class: "",
        scale_factor: 0.6,
        zoom_sequence: [], //[0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
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
</script>
<template>
  <main
    class="relative flex w-full bg-linear-to-b from-[var(--background-primary)] to-[var(--background-secondary)]">
    <!-- ADMIN PANEL -->
    <div v-if="user && user.rights === 'admin'">
      <aside
        :class="adminPanelOpen ? 'translate-x-0' : '-translate-x-full'"
        class="fixed top-0 left-0 z-40 flex h-screen w-1/3 flex-col items-center justify-center gap-5 bg-black/70 px-5 pt-18 text-white shadow-lg transition-transform duration-300">
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
        class="fixed z-50 m-5 w-fit cursor-pointer rounded-2xl border border-white/10 bg-white/10 p-1 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95">
        <svg
          :class="adminPanelOpen ? 'rotate-180' : 'rotate-0'"
          xmlns="http://www.w3.org/2000/svg"
          class="size-6 transition-all duration-200">
          <path
            fill="currentColor"
            d="M16 21.308L6.692 12L16 2.692l1.064 1.064L8.819 12l8.244 8.244z" />
        </svg>
      </button>
    </div>
    <!-- literally the whole page lol -->
    <section id="timeline-embed"></section>
  </main>
</template>
<style scoped>
/* TAILWIND DOESNT WORK FOR THESE VALUES */
#timeline-embed {
  height: 600px;
  width: 100%;
}

:deep(.tl-timeaxis-background) {
  background-color: black;
  border-top-color: rgba(255, 255, 255, 0.2);
}
/* ------------------------------------------ */
/* TODO: FIGURE OUT WHAT BUTTONS TO PUT, FIX ADMIN PANEL BUTTON OVERLAP ISSUES, FIX ZOOMING IN ISSUES WITH TIMENAV */
:deep(.tl-menubar-button) {
  padding: 5px !important;
}
:deep(.tl-menubar button:has(span.tl-icon-zoom-in)),
:deep(.tl-menubar button:has(span.tl-icon-zoom-out)) {
  display: none !important;
}
/* ------------------------------------------ */
:deep(.tl-icon-goend) {
  background-image: url("https://api.iconify.design/material-symbols-light:double-arrow-rounded.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  width: 24px;
  height: 24px;

  /* hiding original icon */
  color: transparent;
}

:deep(.tl-icon-goback) {
  background-image: url("https://api.iconify.design/material-symbols-light:double-arrow-rounded.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transform: scaleX(-1);
  display: inline-block;
  width: 24px;
  height: 24px;

  /* hiding original icon */
  color: transparent;
}

:deep(.tl-slidenav-icon::before) {
  content: none;
}
:deep(.tl-slidenav-next .tl-slidenav-content-container .tl-slidenav-icon) {
  background-image: url("https://api.iconify.design/material-symbols-light:arrow-back-ios-new-rounded.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transform: scaleX(-1);
  display: inline-block;
  width: 24px;
  height: 24px;
}

:deep(.tl-slidenav-previous .tl-slidenav-content-container .tl-slidenav-icon) {
  background-image: url("https://api.iconify.design/material-symbols-light:arrow-back-ios-new-rounded.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  width: 24px;
  height: 24px;
}
:deep(.tl-slidenav-title),
:deep(.tl-slidenav-description) {
  color: black !important;
}

:deep(.tl-headline-date) {
  font-family: inherit !important;
  font-size: inherit !important;
  color: inherit !important;
}

:deep(.tl-timenav) {
  background: rgba(0, 0, 0, 0.5);
  border-top: inherit;
}

/* ------------------------------------------ */

:deep(.tl-timenav-marker-time) {
  display: none !important;
}

:deep(.tl-timenav-marker-content .tl-timenav-marker-text) {
  font-size: 0 !important;
}

:deep(.tl-timenav-marker-content .tl-timenav-marker-text::before) {
  content: attr(data-full-date) !important;
  font-size: 12px !important;
  white-space: nowrap;
}

:deep(.tl-timenav-marker-minor) {
  display: none !important;
}

:deep(.tl-menubar-button-zoom),
:deep(.tl-slidenav) {
  display: none !important;
}

:deep(.tl-headline-date) {
  font-size: 14px !important;
}
</style>
