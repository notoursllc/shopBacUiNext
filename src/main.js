import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createHead } from '@unhead/vue';

import App from './App.vue';
import router from './router';
import i18n from './plugins/i18n.js';
import nprogress from './plugins/nprogress.js';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App)
app.use(pinia);
app.use(createHead())
app.use(router);
app.use(i18n);
app.use(nprogress, { router });
app.mount('#app')
