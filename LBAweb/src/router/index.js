import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import AccountView from "@/views/AccountView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/account",
      name: "Account",
      component: AccountView,
    },
    {
      path: "/authentication",
      name: "Authentication",
      component: () => import("@/views/AuthenticationView.vue"),
    },
    {
      path: "/hello",
      name: "Hello",
      component: () => import("@/views/HelloRequest.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("@/views/RegisterView.vue"),
    },
  ],
});

export default router;

// route level code-splitting
// this generates a separate chunk (About.[hash].js) for this route
// which is lazy-loaded when the route is visited.
//   component: () => import('../views/AboutView.vue'),
