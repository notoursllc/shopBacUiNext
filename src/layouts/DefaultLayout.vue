<script>
export default {
    name: 'DefalutLayout'
}
</script>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/app';
import {
    FigSidebarLayout
} from '@notoursllc/figleaf';

const appStore = useAppStore();
const { t } = useI18n();

const globalSettingsChildren = computed(() => {
    const sortOrder = {
        'product_type': null,
        'product_sub_type': null,
        'collections': null,
        'accent-messages': null
    };

    for(let type in appStore.masterTypes) {
        sortOrder[type] = {
            label: t(`master_type_nav_labels.${type}`),
            href: { name: 'global', params: { type: type }},
            active: false,
            children: [],
            icon: null
        }
    }

    sortOrder['collections'] = {
        label: t('Product collections'),
        href: { name: 'global-collections'},
        active: false,
        children: [],
        icon: null
    }

    sortOrder['accent-messages'] = {
        label: t('Accent messages'),
        href: { name: 'global-accent-messages'},
        active: false,
        children: [],
        icon: null
    }

    sortOrder['color-swatch-types'] = {
        label: t('Color swatches'),
        href: { name: 'global-color-swatch-types'},
        active: false,
        children: [],
        icon: null
    }

    sortOrder['package-types'] = {
        label: t('Package types'),
        href: { name: 'global-package-types'},
        active: false,
        children: [],
        icon: null
    }


    return Object.values(sortOrder).filter(item => item !== null);
});

const navData = computed(() => {
    return [
        {
            label: 'Home',
            href: '#',
            active: false,
            children: [],
            icon: null
        },
        {
            label: t('Product artists'),
            href: { name: 'product-artists'},
            active: false,
            children: [],
            icon: null
        },
        {
            label: t('Hero slides'),
            href: { name: 'hero-slides'},
            active: false,
            children: [],
            icon: null
        },
        {
            label: t('Global settings'),
            href: '#',
            active: false,
            children: [
                ...globalSettingsChildren.value
            ],
            icon: null
        },
        {
            label: t('Exchange rates'),
            href: { name: 'exchange-rates'},
            active: false,
            children: [],
            icon: null
        },
        {
            label: t('Account'),
            href: { name: 'account'},
            active: false,
            children: [],
            icon: null
        },
    ]
});
</script>


<template>
    <fig-sidebar-layout :nav-items="navData">

        <RouterView />
        <!-- globalSettingsChildren {{  appStore.masterTypes }} -->
    </fig-sidebar-layout>
</template>
