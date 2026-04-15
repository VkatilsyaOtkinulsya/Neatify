<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';
import Input from '@/components/ui/selfmade-input/Input.vue';
import Button from '@/components/ui/custom-button/Button.vue';
import { reactive } from 'vue';
import Loader from '@/components/ui/loader/Loader.vue';

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  email: '',
  password: '',
});

const handleSubmit = async () => {
  try {
    await authStore.login({
      email: formData.email,
      password: formData.password,
    });
    router.push('/main');
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error:', err.message);
    }
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth__banner">
      <div class="banner__content">
        <div class="banner-logo">
          <img src="@/assets/images/logo.jpg" alt="Logo" class="logo" />
          <div class="logo-text">Neatify</div>
        </div>
        <h2 class="banner-title">Войти в Neatify</h2>
      </div>
    </div>
    <div class="form-wrapper">
      <h2 class="form-wrapper__title">Вход</h2>
      <p v-if="authStore.error" class="warn-message">{{ authStore.error }}</p>
      <form @submit.prevent="handleSubmit" class="auth-form">
        <Input
          v-model="formData.email"
          name="email"
          type="email"
          autocomplete="email"
          placeholder="Your Email"
          class="auth-form__input"
          required
        />
        <Input
          v-model="formData.password"
          name="password"
          type="password"
          placeholder="Password"
          class="auth-form__input"
          suggested="current-password"
          required
        />
        <Loader v-if="authStore.isLoading" color="#000" />
        <Button v-else type="submit" class="auth-form__button">Войти</Button>
      </form>
      <span class="ans-text"
        >Вы еще не зарегистрированы? <router-link to="/signup">Регистрация</router-link></span
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './Auth.module';
</style>
