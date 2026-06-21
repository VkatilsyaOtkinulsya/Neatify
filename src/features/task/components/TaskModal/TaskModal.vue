<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import {
  type CreateTaskPayload,
  type Task,
  type TaskFormData,
  type TaskPayloadBase,
} from '@/features/task/types/task.types';
import { useAuthStore } from '@/stores/auth.store';
import TaskForm from './TaskForm.vue';
import { formToPayload, taskToForm } from '../../utils/task-form.utils';

interface Props {
  isVisible: boolean;
  columnId: string;
  taskData: Task | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'create', payload: CreateTaskPayload): void;
  (e: 'update', payload: { id: string; data: TaskPayloadBase }): void;
}>();

const { userInfo } = useAuthStore();
const userId = userInfo.id;

const isEditMode = computed(() => props.taskData !== null);

const defaultForm = (): TaskFormData => ({
  title: '',
  description: '',
  priorityLabel: 'Средний',
  statusLabel: 'Активная',
  assignees: [userInfo.id],
  tags: [],
  checklist: [],
  startDate: undefined,
  dueDate: undefined,
  estimate: undefined,
});

const form = ref<TaskFormData>(defaultForm());

// Заполняем форму при открытии модала
watch(
  () => props.isVisible,
  (visible) => {
    if (!visible) return;
    form.value = props.taskData ? taskToForm(props.taskData) : defaultForm();
  }
);

const handleSubmit = () => {
  if (!form.value.title.trim()) return;

  const base = formToPayload(form.value);

  if (isEditMode.value && props.taskData) {
    emit('update', { id: props.taskData.id, data: base });
  } else {
    emit('create', { creator: userId, columnId: props.columnId, ...base });
  }
};
</script>

<template>
  <Transition name="modal">
    <div v-if="isVisible" class="modal-mask" @click.self="emit('close')">
      <div class="modal-container">
        <div class="modal-header">
          <p class="header-title">{{ isEditMode ? 'Редактировать задачу' : 'Создать задачу' }}</p>
          <button class="modal-close-button" @click="emit('close')">&times;</button>
        </div>

        <div class="modal-body">
          <TaskForm v-model="form" />
        </div>

        <div class="modal-footer">
          <button class="submit-button" :disabled="!form.title.trim()" @click="handleSubmit">
            {{ isEditMode ? 'Сохранить' : 'Создать' }}
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
    width: 60%;
    height: 80%;
    display: flex;
    flex-direction: column;
    margin: auto;
    padding: 1rem 2rem 0.75rem;
    background-color: #fff;
    border-radius: 0.5rem;
    border: 1px solid #212022;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.2s ease;
    box-sizing: content-box;
    overflow-y: auto;

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;

      .modal-close-button {
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
      margin-bottom: 1.5rem;

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
      justify-content: end;
      align-items: end;
      width: 100%;
      box-sizing: border-box;

      .submit-button {
        display: block;
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

  .modal-body {
    overflow-y: auto;

    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 transparent;
  }

  .modal-body::-webkit-scrollbar {
    width: 6px;
  }

  .modal-body::-webkit-scrollbar-track {
    background: transparent;
  }

  .modal-body::-webkit-scrollbar-thumb {
    background-color: #d1d5db; // мягкий серый
    border-radius: 999px;
  }

  .modal-body::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
  }
}
</style>
