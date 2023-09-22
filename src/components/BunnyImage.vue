<script>
export default {
    name: 'BunnyImage',
    inheritAttrs: false
}
</script>

<script setup>
import { computed } from 'vue';
import { useImage } from '@vueuse/core'; // https://vueuse.org/core/useImage/#useimage

const props = defineProps({
    basePath: {
        type: String,
        default: 'https://bv-pullzone-1.b-cdn.net/images/?class=w150'
    },

    src: {
        type: String
    },

    preset: {
        type: String,
        default: 'w150'
    },

    loading: {
        type: String,
        default: 'lazy' // eager, lazy
    }
});


const imageUrl = computed(() => {
    const cleanSrc = props.src?.replace(/^\/+/g, '');  // replace all leading slashes
    const bunnyUrl = new URL(cleanSrc, props.basePath);

    if (props.preset) {
        bunnyUrl.searchParams.set('class', props.preset);
    }

    return bunnyUrl.href;
})

const { isLoading } = useImage(imageUrl.value, {
    crossOrigin: 'anonymous'
});
</script>

<template>
    <span v-if="isLoading"><slot name="loading" /></span>
    <img
        v-else
        :src="imageUrl"
        :loading="loading"
        v-bind="$attrs" />
</template>
