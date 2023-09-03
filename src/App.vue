<script setup>
import { onBeforeMount } from 'vue';
import { RouterView } from 'vue-router';
import { useHead } from '@unhead/vue';
import '@notoursllc/figleaf/src/assets/css/tailwind.css';
import 'nprogress/nprogress.css';
import '@/assets/base.css';
import useApi from '@/composables/useApi.js';
import { useAppStore } from '@/stores/app';
import { FigAppWrapper } from '@notoursllc/figleaf';

useHead({
    title: 'ShopBacUI',
    meta: [
        {
            name: 'description', content: 'Opinionated Vite Starter Template'
        }
    ],
    link: [
        {
            rel: 'icon',
            type: 'image/svg+xml',
            href: () => '/favicon.svg',
        }
    ]
});

const $api = useApi();
const appStore = useAppStore();

async function getStripeTaxCodes() {
    const results = await $api.product.getStipeTaxCodes();

    const taxCodes = results.data;
    appStore.taxCodes.value = Array.isArray(taxCodes) ? taxCodes : [];
}

async function getMasterTypes() {
    const results = await $api.masterType.list({
        _sort: 'ordinal:asc'
    });

    appStore.addMasterTypes(results.data)
}

onBeforeMount(() => {
    getStripeTaxCodes();
    getMasterTypes();
});
</script>


<template>
    <fig-app-wrapper>
        <component :is="$route.meta.layout || 'div'">
            <RouterView />
        </component>
    </fig-app-wrapper>
</template>


<style>
body {
    @apply min-h-screen flex flex-col h-screen text-gray-700;
}
</style>
