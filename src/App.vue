<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import NotificationModal from '@/components/ui/modal/NotificationModal.vue';
import { registerNotificationComponent } from '@/shared/lib/utils/error-handler';
import { useCheckAuth } from './features/auth/composables/useCheckAuth';
import type { NotificationComponent } from './shared/types/notification';
import { useWorkspaceStore } from './shared/stores/spaces.store';

const notificationRef = ref<NotificationComponent | null>(null);

const { accessToken } = useCheckAuth();

onMounted(() => {
  if (notificationRef.value) {
    registerNotificationComponent(notificationRef.value);
  }
});

const spacesStore = useWorkspaceStore();
watch(
  accessToken,
  (newToken) => {
    if (newToken) {
      spacesStore.loadSpaces();
    }
  },
  { immediate: true }
);
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
