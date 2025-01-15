import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AccountView from '@/views/AccountView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomeView,
        }, {
            path: '/account',
            name: 'Account',
            component: AccountView,
        }
    ]
});

export default router;