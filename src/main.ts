import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';

import './style.css';
import App from './App.vue';
import router from './router';
import './api/api';
import { vClickOutside } from './directives/clickOutside';

const pinia = createPinia();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 минут
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

app.mount('#app');
