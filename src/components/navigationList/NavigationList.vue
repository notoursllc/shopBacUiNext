<script>
export default {
    name: 'NavigationList'
}
</script> 

<script setup>
const props = defineProps({
    textColor: {
        type: String,
        default: '#fff'
    },

    activeTextColor: {
        type: String,
        default: null
    },

    activeBackgroundColor: {
        type: String,
        default: null
    },

    hoverBackgroundColor: {
        type: String,
        default: null
    },

    defaultActive: {
        type: String,
        default: ''
    }
});

    provide() {
        return {
            menuListState: this.sharedState
        };
    },

    data() {
        return {
            sharedState: {
                activeItem: this.defaultActive,
                activeTextColor: this.activeTextColor,
                hoverBackgroundColor: this.hoverBackgroundColor,
                activeBackgroundColor: this.activeBackgroundColor,
                textColor: this.textColor
            }
        };
    },

    watch: {
        defaultActive(value) {
            this.activeIndex = value;
        },

        $route(to, from) {
            this.updateActiveItem(to.name);
        }
    },

    created() {
        this.updateActiveItem(this.$route.name);
    },

    methods: {
        updateActiveItem(val) {
            this.$set(this.sharedState, 'activeItem', val);
        }
    }
};
</script>


<template>
    <ul class="navigation-list navigation-list-container" :style="{color: textColor || 'inherit'}">
        <slot></slot>
    </ul>
</template>


<style>
.navigation-list {
    @apply m-0 p-0 block relative border-0 list-none;
}

.navigation-item {
    @apply rounded m-0 p-0 list-none;
}

.navigation-item > label {
    @apply relative block whitespace-nowrap cursor-pointer box-border px-2;
    height: 34px;
    line-height: 34px;
    transition: border-color .3s, background-color .3s, color .3s;
}

.navigation-item-arrow {
    @apply absolute inline-block;
    top: 50%;
    right: 10px;
    margin-top: -7px;
    transition: transform .3s;
}

.navigation-list label.not-collapsed .navigation-item-arrow {
    transform: rotateZ(90deg);
}

.navigation-list .not-collapsed:focus,
.navigation-list .collapsed:focus {
    outline: none;
}

.navigation-item > .navigation-list {
    @apply ml-1;
}

.navigation-item.nuxt-link-active,
.navigation-item.nuxt-link-exact-active {
    @apply bg-gray-400 bg-transparent bg-opacity-20;
}
</style>
