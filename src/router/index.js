import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '../layouts/default.vue';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'default',
            component: DefaultLayout,
            redirect: '/',
            children: [
                {
                  path: '/',
                  name: 'home',
                  component: HomeView
                },
                {
                  path: '/about',
                  name: 'about',
                  // route level code-splitting
                  // this generates a separate chunk (About.[hash].js) for this route
                  // which is lazy-loaded when the route is visited.
                  component: () => import('../views/AboutView.vue')
              }
            ]
        }
    ]
});

export default router;
