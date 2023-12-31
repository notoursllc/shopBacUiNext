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

        // DONE
        {
            path: '/reports/orders',
            name: 'reports-orders',
            meta: { layout: DefaultLayout },
            component: () => import('../views/reports/orders/OrdersList.vue')
        },

        {
            path: '/reports/orders/:id',
            name: 'reports-orders-id',
            meta: { layout: DefaultLayout },
            component: () => import('../views/reports/orders/OrderDetail.vue')
        },

        // DONE
        {
            path: '/product-artists',
            name: 'product-artists',
            meta: { layout: DefaultLayout },
            component: () => import('../views/ProductArtists.vue')
        },


        {
            path: '/hero-slides',
            name: 'hero-slides',
            meta: { layout: DefaultLayout },
            component: () => import('../views/HeroSlides.vue')
        },

        // DONE
        {
            path: '/global/:type',
            name: 'global',
            meta: { layout: DefaultLayout },
            component: () => import('../views/global/MasterTypeList.vue')
        },

        // DONE
        {
            path: '/global/accent-messages',
            name: 'global-accent-messages',
            meta: { layout: DefaultLayout },
            component: () => import('../views/global/AccentMessages.vue')
        },

        // DONE
        {
            path: '/global/collections',
            name: 'global-collections',
            meta: { layout: DefaultLayout },
            component: () => import('../views/global/Collections.vue')
        },

        // DONE
        {
            path: '/global/color-swatch-types',
            name: 'global-color-swatch-types',
            meta: { layout: DefaultLayout },
            component: () => import('../views/global/ColorSwatches.vue')
        },

        // DONE
        {
            path: '/global/package-types',
            name: 'global-package-types',
            meta: { layout: DefaultLayout },
            component: () => import('../views/global/PackageTypes.vue')
        },


        // DONE
        {
            path: '/exchange-rates',
            name: 'exchange-rates',
            meta: { layout: DefaultLayout },
            component: () => import('../views/ExchangeRates.vue')
        },

        // DONE
        {
            path: '/account',
            name: 'account',
            meta: { layout: DefaultLayout },
            component: () => import('../views/Account.vue')
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
