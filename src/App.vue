<script setup lang="ts">
import { onMounted, ref } from 'vue';
import NotificationModal from '@/components/ui/modal/NotificationModal.vue';
import { registerNotificationComponent } from '@/shared/lib/utils/error-handler';
import type { NotificationComponent } from '@/shared/types/notification';
import { useAuthStore } from './stores/auth.store';

const notificationRef = ref<NotificationComponent | null>(null);

onMounted(() => {
  const authStore = useAuthStore();
  authStore.initAuth();

  if (notificationRef.value) {
    registerNotificationComponent(notificationRef.value);
  }
});
</script>

<template>
  <div id="app-wrapper">
    <router-view />
    <NotificationModal ref="notificationRef" />
  </div>
</template>

<style scoped>
#app-wrapper {
  display: inline-flex;
  height: 100vh;
  width: 100%;
}
</style>
