import { useAuth } from '@/features/auth/composables/useAuth';
import { type LoginRequest, type RegisterRequest } from '@/api/types/api.types';
import type { UserInfo } from '@/features/auth/types/auth.types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const userInfo = ref<UserInfo>({
    id: '',
    displayName: '',
    firstName: '',
    lastName: '',
    avatar: '',
    accessToken: '',
    refreshToken: '',
    expiresIn: '',
  });
  const { error, isLoading, signUp, signIn } = useAuth();

  const register = async (payload: RegisterRequest) => {
    try {
      const { user, accessToken, refreshToken, expiresIn } = await signUp(payload);
      const { displayName, firstName, lastName, avatar } = user.profile;

      userInfo.value = {
        id: user._id,
        displayName: displayName,
        firstName: firstName,
        lastName: lastName,
        avatar: avatar ?? '',
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresIn: expiresIn,
      };

      localStorage.setItem(
        'userData',
        JSON.stringify({
          id: user._id,
          displayName: user.profile.displayName,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        })
      );
    } catch (err) {
      throw err;
    }
  };

  const login = async (payload: LoginRequest) => {
    try {
      const { user, accessToken, refreshToken, expiresIn } = await signIn(payload);
      const { displayName, firstName, lastName, avatar } = user.profile;

      localStorage.setItem('userTokens', JSON.stringify({ accessToken, refreshToken, expiresIn }));

      userInfo.value = {
        id: user._id,
        displayName: displayName,
        firstName: firstName,
        lastName: lastName,
        avatar: avatar ?? '',
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresIn: expiresIn,
      };

      localStorage.setItem('userData', JSON.stringify(user));
    } catch (err) {
      throw err;
    }
  };

  const initAuth = () => {
    const tokens = localStorage.getItem('userTokens');
    const userData = localStorage.getItem('userData');

    if (tokens && userData) {
      const parsedTokens = JSON.parse(tokens);
      const parsedUserData = JSON.parse(userData);

      userInfo.value = {
        id: parsedUserData._id || parsedUserData.id,
        displayName: parsedUserData.profile?.displayName || parsedUserData.displayName,
        firstName: parsedUserData.profile?.firstName || parsedUserData.firstName,
        lastName: parsedUserData.profile?.lastName || parsedUserData.lastName,
        avatar: parsedUserData.profile?.avatar || parsedUserData.avatar,
        ...parsedTokens,
      };
    }
  };

  const logout = () => {
    userInfo.value = {
      id: '',
      displayName: '',
      firstName: '',
      lastName: '',
      avatar: '',
      accessToken: '',
      refreshToken: '',
      expiresIn: '',
    };

    localStorage.removeItem('userTokens');
    localStorage.removeItem('userData');

    window.location.href = '/signin';
  };

  return {
    userInfo,
    error,
    isLoading,
    register,
    login,
    logout,
    initAuth,
    clearError: () => (error.value = ''),
  };
});
