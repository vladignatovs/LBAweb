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
      meta: { requiresAuth: true }, // !!!!!
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
      path: "/news",
      name: "News",
      component: () => import("@/views/NewsList.vue"),
    },
    {
      path: "/news/:id",
      name: "NewsContent",
      component: () => import("@/views/NewsContent.vue"),
    },
    {
      path: "/browse",
      name: "Browse",
      meta: { requiresAuth: true }, // !!!!!
      component: () => import("@/views/BrowseView.vue"),
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    } else if (to.path == "/") {
      return {
        top: 0,
        behavior: "smooth",
      };
    }
  },
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("auth_token");

  if (to.meta.requiresAuth && !token) {
    next("/authentication");
  } else {
    next();
  }
});

export default router;

// route level code-splitting
// this generates a separate chunk (About.[hash].js) for this route
// which is lazy-loaded when the route is visited.
//   component: () => import('../views/AboutView.vue'),
