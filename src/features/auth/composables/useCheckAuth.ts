import { useAuthStore } from '@/shared/stores/auth.store';
import { computed } from 'vue';

export function useCheckAuth() {
  const authStore = useAuthStore();
  authStore.initAuth();

  const accessToken = computed(() => authStore.userInfo.accessToken);

  return { accessToken };
}
