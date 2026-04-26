<script setup lang="ts">
import Input from '@/components/ui/selfmade-input/Input.vue';
import Button from '@/components/ui/custom-button/Button.vue';
import Loader from '@/components/ui/loader/Loader.vue';
import { Eye, EyeOff } from 'lucide-vue-next';
import { computed, reactive, ref } from 'vue';

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface Props {
  isLoading: boolean;
  serverError?: string;
}

interface Emits {
  (e: 'submit', data: FormData): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const formData = reactive<FormData>({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
});

const submitAttempted = ref(false);
const isPasswordVisible = ref(false);

const passwordRequirements = {
  minLength: computed(() => formData.password.length >= 8),
  hasLowercase: computed(() => /[a-z]/.test(formData.password)),
  hasUppercase: computed(() => /[A-Z]/.test(formData.password)),
  hasNumber: computed(() => /\d/.test(formData.password)),
  hasSpecial: computed(() => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)),
};

const missingRequirements = computed(() => {
  const missing: string[] = [];
  if (!passwordRequirements.minLength.value) missing.push('Минимум 8 символов');
  if (!passwordRequirements.hasLowercase.value) missing.push('Строчная латинская буква (a-z)');
  if (!passwordRequirements.hasUppercase.value) missing.push('Заглавная латинская буква (A-Z)');
  if (!passwordRequirements.hasNumber.value) missing.push('Цифра (0-9)');
  if (!passwordRequirements.hasSpecial.value) missing.push('Специальный символ (!@#$%^&* и т.д.)');
  return missing;
});

const isPasswordValid = computed(
  () =>
    passwordRequirements.minLength.value &&
    passwordRequirements.hasLowercase.value &&
    passwordRequirements.hasUppercase.value &&
    passwordRequirements.hasNumber.value &&
    passwordRequirements.hasSpecial.value
);

const showPasswordError = computed(() => submitAttempted.value && !isPasswordValid.value);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const handleSubmit = () => {
  submitAttempted.value = true;

  if (!isPasswordValid.value) {
    return;
  }

  emit('submit', { ...formData });
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="signup-form">
    <Input
      v-model="formData.firstName"
      name="firstName"
      type="text"
      placeholder="Имя"
      class="signup-form__input"
      required
    />
    <Input
      v-model="formData.lastName"
      name="lastName"
      type="text"
      placeholder="Фамилия"
      class="signup-form__input"
      required
    />
    <Input
      v-model="formData.email"
      name="email"
      type="email"
      autocomplete="nope"
      placeholder="Your Email"
      class="signup-form__input"
      required
      readonly
      @focus="$event.target.removeAttribute('readonly')"
    />
    <div class="password-input-wrapper">
      <Input
        v-model="formData.password"
        name="password"
        :type="isPasswordVisible ? 'text' : 'password'"
        placeholder="Password"
        autocomplete="off"
        class="signup-form__input"
        required
        readonly
        @focus="$event.target.removeAttribute('readonly')"
      />
      <button
        type="button"
        class="password-toggle"
        @click="togglePasswordVisibility"
        aria-label="Показать/скрыть пароль"
      >
        <Eye v-if="!isPasswordVisible" class="toggle-icon" />
        <EyeOff v-else class="toggle-icon" />
      </button>
    </div>
    <div v-if="showPasswordError && missingRequirements.length > 0" class="password-error">
      <p class="password-error__title">Пароль не соответствует требованиям:</p>
      <ul class="password-error__list">
        <li v-for="(req, index) in missingRequirements" :key="index">
          <span class="error-icon">X</span>
          {{ req }}
        </li>
      </ul>
    </div>
    <div v-if="isPasswordValid && formData.password" class="password-success">
      <span class="success-icon">✓</span>
      Надежный пароль
    </div>
    <Loader v-if="isLoading" color="#000" />
    <Button v-else type="submit" class="signup-form__button">Зарегистрироваться</Button>
  </form>
</template>

<style scoped lang="scss">
.signup-form {
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

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  .signup-form__input {
    padding-right: 48px;
  }

  .password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    &:active {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .toggle-icon {
      width: 20px;
      height: 20px;
      color: #666;
      transition: color 0.2s ease;
    }

    &:hover .toggle-icon {
      color: #111012;
    }
  }
}

.password-error {
  margin-top: 12px;
  padding: 12px;
  background-color: rgba(220, 38, 38, 0.05);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 8px;
  font-size: 0.8rem;
  font-family: 'Roboto', sans-serif;

  &__title {
    font-weight: 500;
    margin-bottom: 8px;
    color: #dc2626;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;

    li {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #dc2626;
    }
  }

  .error-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    font-size: 0.75rem;
    font-weight: 600;
  }
}

.password-success {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-family: 'Roboto', sans-serif;
  color: #85deab;
  font-weight: 500;

  .success-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    font-size: 1rem;
    font-weight: 600;
  }
}

@media (max-width: 768px) {
  .signup-form {
    padding: 0 20px 20px;
  }
}

@media (max-width: 576px) {
  .signup-form {
    gap: 15px;

    &__input {
      width: 100%;
      max-width: 300px;
      padding: 10px 12px;
    }
  }
}
</style>
