<script>
import { v4 as uuidv4 } from 'uuid';
import { FigIconLabel } from '@notoursllc/figleaf';

export default {
    inject: ['menuListState'],

    components: {
        FigIconLabel
    },

    props: {

        /*
        * @example ['products-'] - beginning of route name must match
        * @example ['*products-'] - any part of the route name must match
        */
        fuzzyRouteMatch: {
            type: Array,
            default: () => {
                return [];
            }
        },

        disabled: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            targetId: uuidv4(),
            toggleIsOpen: false
        };
    },

    watch: {
        '$route': {
            handler: function(to, from) {
                const matches = this.fuzzyRouteMatch.filter(id => {
                    const isFuzzy = id.indexOf('*') === 0;

                    // remove the "*" if it's a fuzzy search
                    const matcher = isFuzzy ? id.substring(1) : id;
                    const idx = to.name.indexOf(matcher);
                    return isFuzzy ? idx > -1 : idx === 0;
                });

                this.toggleIsOpen = matches.length ? true : false;
            },
            immediate: true
        }
    },

    methods: {
        toggle() {
            this.toggleIsOpen = !this.toggleIsOpen;
        },

        onChildMenuItemActive() {
            this.toggleIsOpen = true;
        }
    }
};
</script>


<template>
    <li class="navigation-item">
        <label
            @click="toggle"
            :class="{'collapsed': !toggleIsOpen, 'not-collapsed': toggleIsOpen}">
            <fig-icon-label>
                <template v-slot:left v-if="$slots.icon"><slot name="icon" /></template>
                <slot name="label"></slot>
            </fig-icon-label>
            <i class="navigation-item-arrow">
                <fig-icon
                    icon="chevron-right"
                    :width="16"
                    :height="16"
                    :stroke-width="1.5" />
            </i>
        </label>

        <transition name="p-toggleable-content">
            <ul
                v-show="toggleIsOpen"
                class="navigation-list p-toggleable-content"
                v-on:menuItemActive="onChildMenuItemActive">
                <slot></slot>
            </ul>
        </transition>
    </li>
</template>


<style>
.p-toggleable-content-enter-from,
.p-toggleable-content-leave-to {
    max-height: 0;
}

.p-toggleable-content-enter-to,
.p-toggleable-content-leave-from {
    max-height: 1000px;
}

.p-toggleable-content-leave-active {
    overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0, 1, 0, 1);
}

.p-toggleable-content-enter-active {
    overflow: hidden;
    transition: max-height 1s ease-in-out;
}
</style>
