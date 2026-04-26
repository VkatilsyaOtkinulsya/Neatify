<script setup lang="ts">
import Input from '@/components/ui/selfmade-input/Input.vue';
import Button from '@/components/ui/custom-button/Button.vue';
import Loader from '@/components/ui/loader/Loader.vue';
import { reactive } from 'vue';

interface FormData {
  email: string;
  password: string;
}

interface Props {
  isLoading: boolean;
}

interface Emits {
  (e: 'submit', data: FormData): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const formData = reactive<FormData>({
  email: '',
  password: '',
});

const handleSubmit = () => {
  emit('submit', { ...formData });
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="signin-form">
    <Input
      v-model="formData.email"
      name="email"
      type="email"
      autocomplete="email"
      placeholder="Your Email"
      class="signin-form__input"
      required
    />
    <Input
      v-model="formData.password"
      name="password"
      type="password"
      placeholder="Password"
      class="signin-form__input"
      suggested="current-password"
      required
    />
    <Loader v-if="isLoading" color="#000" />
    <Button v-else type="submit" class="signin-form__button">Войти</Button>
  </form>
</template>

<style scoped lang="scss">
.signin-form {
  width: 100%;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  transition: all 0.5s ease-in-out;
  overflow: hidden;
  padding: 0 40px;
  box-sizing: border-box;

  &__input {
    width: 300px;
    padding: 11px 14px;
    border: 1px solid rgb(213, 215, 219);
    border-radius: 6px;
    box-sizing: border-box;

    &:active {
      background-color: rgb(240, 240, 240);
      border: 1px solid rgb(37, 99, 235);
    }
    &:hover {
      opacity: 0.8;
      border: 1px solid rgb(196, 196, 196);
    }
  }

  &__button {
    min-width: 120px;
    font-size: 14px;
    padding: 11px 14px;
    border: none;
    border-radius: 57.5px;
    background-color: #1867c0;
    color: #fff;

    &:hover {
      opacity: 0.8;
    }
  }
}

@media (max-width: 768px) {
  .signin-form {
    padding: 0 20px 20px;
  }
}

@media (max-width: 576px) {
  .signin-form {
    gap: 15px;

    &__input {
      width: 100%;
      max-width: 300px;
      padding: 10px 12px;
    }
  }
}
</style>