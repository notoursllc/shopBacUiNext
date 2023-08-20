// import '@notoursllc/figleaf/src/assets/css/tailwind.css';
// import 'nprogress/nprogress.css';
// import './assets/base.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@unhead/vue';

import App from './App.vue';
import router from './router';
import i18n from './plugins/i18n.js';
import nprogress from './plugins/nprogress.js';

const app = createApp(App)

app.use(createPinia());
app.use(createHead())
app.use(router);
app.use(i18n);
app.use(nprogress, { router });
app.mount('#app')
