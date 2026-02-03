<script setup lang="ts">
import Select from '@/components/ui/select/Select.vue';
import Input from '@/components/ui/selfmade-input/Input.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import { ref } from 'vue';
import TagInput, { type Tag } from '@/components/ui/TagInput/TagInput.vue';

interface Props {
  isVisible: boolean;
  value?: string;
  columnId: string;
}
const props = defineProps<Props>();

const emit = defineEmits(['close', 'create']);

const title = ref<string>('');
const description = ref<string>('');
const priority = ref<string>('');
const tags = ref<Tag[]>([]);

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) emit('close');
};

const handleConfirm = () => {
  if (title.value.trim()) {
    emit('create', {
      title: title.value.trim(),
      description: description.value.trim(),
      priority: priority.value.trim(),
      tags: tags.value,
      columnId: props.columnId,
    });
  }
  title.value = '';
  description.value = '';
  emit('close');
};

const handleCancel = () => {
  title.value = '';
  description.value = '';
  priority.value = '';
  tags.value = [];
  emit('close');
};

const options = ['сложно', 'средне', 'легко', 'критично'];
</script>

<template>
  <Transition name="modal">
    <div v-if="isVisible" class="modal-mask" @click="handleBackdropClick">
      <div class="modal-container">
        <div class="modal-header">
          <p class="header-title">Создать задачу</p>
          <button class="modal-close-button" @click="handleCancel">&times;</button>
        </div>
        <div class="modal-body">
          <slot name="body">
            <Input
              v-model="title"
              type="text"
              :placeholder="'Название'"
              class="modal-input focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <Textarea
              v-model="description"
              type="text"
              :placeholder="'Описание'"
              class="modal-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div class="mt-4 space-y-1">
              <p class="text-sm text-muted-foreground">Priority</p>
              <Select
                v-model="priority"
                :items="options"
                class="w-50"
                placeholder="Выберите важность..."
              />
            </div>
            <div class="mt-4 space-y-1">
              <p class="text-sm text-muted-foreground">Теги</p>
              <TagInput v-model="tags" />
            </div>
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
    width: 40%;
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
      justify-content: space-between;
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
      margin-bottom: 25px;
      .modal-input {
        width: 40%;
        padding: 11px 14px;
        border: 1px solid rgb(229, 231, 235);
        border-radius: 6px;
        box-sizing: border-box;
      }

      .modal-input {
        margin-bottom: 15px;
      }
    }

    .modal-footer {
      display: flex;
      position: relative;
      justify-content: center;
      width: 100%;
      box-sizing: border-box;

      .submit-button {
        display: block;
        position: absolute;
        right: 0;
        bottom: 0;
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
