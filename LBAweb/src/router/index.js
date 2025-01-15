import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/views/HomePage.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
        }, {
            path: '/test',
            name: 'test',
            component: { template: '<div>Test Page</div>' },
        }
    ]
});

export default router;