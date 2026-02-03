import { AuthService } from '@/api/services/auth.service';
import { type LoginRequest, type RegisterRequest } from '@/api/types/api.types';
import { ref } from 'vue';

export const useAuth = () => {
  const error = ref<string>('');
  const isLoading = ref<boolean>(false);

  const signUp = async (payload: RegisterRequest) => {
    error.value = '';
    isLoading.value = true;

    try {
      const authResponse = await AuthService.signUp(payload);
      console.log(authResponse);
      return authResponse;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const signIn = async (payload: LoginRequest) => {
    error.value = '';
    isLoading.value = true;

    try {
      return await AuthService.signIn(payload);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    error,
    isLoading,
    signUp,
    signIn,
  };
};
