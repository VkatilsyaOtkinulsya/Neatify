<script setup lang="ts">
import { ref } from 'vue';
import Input from '@/components/ui/selfmade-input/Input.vue';

interface Props {
  isVisible: boolean;
  value?: string;
}
defineProps<Props>();

const emit = defineEmits(['close', 'create']);

const title = ref<string>('');
const description = ref<string>('');

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) emit('close');
};

const handleConfirm = () => {
  if (title.value.trim()) {
    emit('create', {
      title: title.value.trim(),
      description: description.value.trim(),
    });
  }
  title.value = '';
  description.value = '';
  emit('close');
};

const handleCancel = () => {
  title.value = '';
  description.value = '';
  emit('close');
};
</script>

<template>
  <Transition name="modal">
    <div v-if="isVisible" class="modal-mask" @click="handleBackdropClick">
      <div class="modal-container">
        <div class="modal-header">
          <p class="header-title">Пространства - это отделы вашей компании</p>
          <button class="modal-close-button" @click="handleCancel">&times;</button>
        </div>
        <div class="modal-body">
          <slot name="body">
            <Input
              v-model="title"
              type="text"
              :placeholder="'Введите название пространства'"
              class="modal-input"
              required
            />
            <Input
              v-model="description"
              type="text"
              :placeholder="'Описание'"
              class="modal-input"
            />
          </slot>
        </div>
        <div class="modal-footer">
          <button class="submit-button" @click="handleConfirm" :disabled="!title.trim()">
            Создать
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.modal-mask {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;

  .modal-container {
    display: flex;
    flex-direction: column;
    gap: 1.3rem;
    margin: auto;
    padding: 32px;
    background-color: #fff;
    border-radius: 0.75rem;
    border: 1px solid #212022;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.2s ease;
    box-sizing: content-box;

    .modal-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .modal-close-button,
      .header-title {
        display: block;
        font-size: 1.3rem;
        font-weight: 500;
      }

      .modal-close-button {
        border: none;
        background-color: #fff;
      }
    }

    .modal-body {
      .modal-input {
        width: 100%;
        padding: 11px 14px;
        border: 1px solid rgb(229, 231, 235);
        border-radius: 6px;
        box-sizing: border-box;

        &:focus {
          border-color: #85deab;
        }
      }

      .modal-input:first-child {
        margin-bottom: 15px;
      }
    }

    .modal-footer {
      display: flex;
      justify-content: center;
      width: 100%;

      .submit-button {
        display: block;
        width: 100%;
        font-size: 13px;
        padding: 12px 20px;
        border-radius: 0.375rem;
        background-color: #111012;
        color: #fff;
        border: none;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
