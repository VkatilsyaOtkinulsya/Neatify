<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';
import SignInForm from '@/components/ui/forms/SignInForm.vue';

const router = useRouter();
const authStore = useAuthStore();

const handleSubmit = async (data: { email: string; password: string }) => {
  try {
    await authStore.login(data);
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
      <SignInForm :is-loading="authStore.isLoading" @submit="handleSubmit" />
      <span class="ans-text"
        >Вы еще не зарегистрированы? <router-link to="/signup">Регистрация</router-link></span
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  background-color: rgb(241, 255, 239);
}

.auth__banner {
  width: 38%;
  max-width: 460px;
  height: 100%;
  background-color: #111012;
  box-sizing: border-box;

  .banner__content {
    margin: 150px 10px 0 80px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .banner-logo {
      display: flex;
      align-items: center;
      gap: 10px;

      .logo-text {
        font-size: 1.3125rem;
        color: #ffffffe6;
        font-weight: 500;
      }
    }
    .banner-title {
      font-family: 'Roboto', sans-serif;
      color: #fff;
      font-size: 2.5rem;
    }
  }
}

.form-wrapper {
  display: flex;
  max-width: 50%;
  min-height: 410px;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  gap: 30px;
  margin: 0 auto;
  padding: 30px 10px;

  box-sizing: border-box;
  box-shadow: rgba(49, 94, 251, 0.4) 0px 10px 10px -10px;
  border-radius: 15px;
  background-color: #fff;

  .form-wrapper__title {
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    font-size: 1.5rem;
    pointer-events: none;
  }

  .ans-text {
    width: 100%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;

    a {
      text-decoration: underline;
    }

    @media screen and (max-width: 768px) {
      font-size: 14px;
    }
  }
}

.warn-message {
  display: block;
  height: auto;
  text-align: center;
  font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
  background-color: rgb(255, 244, 144);
  border-left: 5px solid rgb(255, 155, 5);
  color: rgb(255, 155, 5);
  padding: 10px 5px;
  border-radius: 4px;
  text-wrap: wrap;
  box-sizing: content-box;

  animation: hideWarnMessage 1s ease-in-out;
  animation-fill-mode: forwards;
  animation-delay: 10s;
}

@keyframes hideWarnMessage {
  0% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(0);
    display: none;
  }
}

@media screen and (max-width: 1200px) {
  .form-wrapper {
    max-width: 80%;
  }
}

@media screen and (max-width: 960px) {
  .auth__banner {
    display: flex;
  }
  .form-wrapper {
    max-width: 62%;

    .warn-message {
      font-size: 14px;
    }
  }
}

@media screen and (max-width: 768px) {
  .auth__banner {
    justify-content: center;
    .banner__content {
      margin: 150px 0 0 0;
      display: flex;
      flex-direction: column;
      align-items: center;

      .banner-title {
        font-size: 1.9rem;
      }
    }
  }
  .form-wrapper {
    max-width: 85%;
    min-height: 380px;
  }
}

@media screen and (max-width: 640px) {
  .auth__banner {
    display: none;
  }
}

@media (max-width: 576px) {
  .form-wrapper {
    max-width: 95%;
    gap: 20px;

    .form-wrapper__title {
      font-size: 1.3rem;
    }
  }
}
</style>
