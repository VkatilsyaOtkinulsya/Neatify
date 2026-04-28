import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';

import './style.css';
import App from './App.vue';
import router from './router';
import './api/api';
import { vClickOutside } from '@/shared/directives/clickOutside';
import { vPermission } from './shared/directives/vPermission.directive';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
  }
}

// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

const app = createApp(App);
app.directive('click-outside', vClickOutside);
app.use(pinia);
app.use(VueQueryPlugin, { queryClient });
app.use(router);

app.directive('permission', vPermission);

app.mount('#app');
