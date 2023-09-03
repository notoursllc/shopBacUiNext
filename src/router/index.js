import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import EmptyLayout from '../layouts/EmptyLayout.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            meta: { layout: DefaultLayout },
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/HomeView.vue')
        },
        {
            path: '/about',
            name: 'about',
            meta: { layout: DefaultLayout },
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/global/:type',
            name: 'global',
            meta: { layout: DefaultLayout },
            component: () => import('../views/global/MasterTypeList.vue')
        },
        {
            path: '/global/accent-messages',
            name: 'global-accent-messages',
            meta: { layout: DefaultLayout },
            component: () => import('../views/global/AccentMessages.vue')
        },
        {
            path: '/global/collections',
            name: 'global-collections',
            meta: { layout: DefaultLayout },
            component: () => import('../views/global/Collections.vue')
        },
        {
            path: '/global/color-swatch-types',
            name: 'global-color-swatch-types',
            meta: { layout: DefaultLayout },
            component: () => import('../views/global/ColorSwatches.vue')
        },
        {
            path: '/global/package-types',
            name: 'global-package-types',
            meta: { layout: DefaultLayout },
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/tenantmember/login',
            name: 'tenantmember-login',
            meta: { layout: EmptyLayout },
            component: () => import('../views/tenantmember/Login.vue')
        }
    ]
});

export default router;
