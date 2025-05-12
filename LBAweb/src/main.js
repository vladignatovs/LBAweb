import "./assets/style.css";
import { createApp } from "vue";
import { createPinia, storeToRefs } from "pinia";
import App from "./App.vue";
import router from "./router";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import axios from "axios";
import { useAuthStore } from "./stores/useAuthStore";

// DEFAULT PATH
axios.defaults.baseURL = "http://127.0.0.1:8000/api";

// APP CREATION
const app = createApp(App);
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

axios.interceptors.request.use(
  (config) => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
