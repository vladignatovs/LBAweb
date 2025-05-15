import "./assets/style.css";
import { createApp, ref, watch } from "vue";
import { createPinia, storeToRefs } from "pinia";
import App from "./App.vue";
import router from "./router";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import axios from "axios";
import { useAuthStore } from "./stores/useAuthStore";
import { useLoadingStore } from "./stores/useLoadingStore";
import Pusher from "pusher-js";
import Echo from "laravel-echo";

// APP CREATION
const app = createApp(App);
app.directive("loading", {
  mounted(el) {
    const loading = useLoadingStore();
    watch(
      () => loading.isLoading,
      (is) => {
        if (is) el.setAttribute("disabled", "");
        else el.removeAttribute("disabled");
      },
      { immediate: true },
    );
  },
});
app.use(createPinia());
app.use(router);
app.use(Toast, {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
});
app.mount("#app");

const auth = useAuthStore();
const { token } = storeToRefs(auth);

export const loadingQueue = ref(0);
const loading = useLoadingStore();

axios.defaults.baseURL = "http://127.0.0.1:8000/api";
axios.interceptors.request.use(
  (config) => {
    loading.add();
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }
    return config;
  },
  (error) => {
    loading.remove();
    Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    loading.remove();
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) auth.logoutFrontend();
    loading.remove();
    return Promise.reject(error);
  },
);

window.Pusher = Pusher;
Pusher.logToConsole = true;
window.Echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  // authEndpoint: "http://127.0.0.1:8000/api/broadcasting/auth",
  // enabledTransports: ["ws", "wss"],
  // auth: {
  //   headers: {
  //     Authorization: `Bearer ${token.value}`,
  //   },
  // },
  channelAuthorization: {
    endpoint: "http://127.0.0.1:8000/api/broadcasting/auth",
    headersProvider: () => ({
      Authorization: `Bearer ${auth.token}`,
    }),
  },
});
