import { inject } from 'vue';
import { useAppStore } from '@/stores/app';

export default {

    install(Vue, options) {
        const $api = inject('$api');

        console.log("GLOBAL PLUGIN INSTALLED", $api)
    }

}
