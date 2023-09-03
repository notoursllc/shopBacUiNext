<script>
export default {
    name: 'BooleanTag'
}
</script>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    FigTag
} from '@notoursllc/figleaf';

const props = defineProps({
    value: {
        type: Boolean
    },

    pill: {
        type: Boolean,
        default: false
    },

    size: {
        type: String,
        default: 'lg'
    }
});

const { t } = useI18n();

const label = computed(() => {
    return props.value ? t('Yes') : t('No');
});

const tagType = computed(() => {
    return props.value ? 'success' : 'error';
});
</script>

<template>
    <fig-tag
        :variant="tagType"
        :pill="pill"
        :size="size">{{ label }}</fig-tag>
</template>
