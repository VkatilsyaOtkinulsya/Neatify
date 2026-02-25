<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  TaskPriority,
  TaskStatusEnum,
  type ChecklistItem,
  type Tag,
  type Task,
  type TaskStatus,
} from '@/features/task/types/task.types';
import { useAuthStore } from '@/shared/stores/auth.store';
import TaskForm from './TaskForm.vue';

const priorityLabels = ['Низкий', 'Средний', 'Критичный', 'Блокер'] as const;
type PriorityLabel = (typeof priorityLabels)[number];

const priorityMap: Record<PriorityLabel, TaskPriority> = {
  Низкий: TaskPriority.LOW,
  Средний: TaskPriority.MEDIUM,
  Критичный: TaskPriority.HIGH,
  Блокер: TaskPriority.URGENT,
};

interface Props {
  isVisible: boolean;
  columnId: string;
  taskData?: Task;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (
    e: 'create',
    payload: {
      title: string;
      description?: string;
      priority: TaskPriority;
      status: TaskStatus;
      creator: string;
      columnId: string;
      tags: Tag[];
    }
  ): void;
}>();

interface FormData {
  title: string;
  description: string;
  priorityLabel: PriorityLabel;
  status: TaskStatus;
  assignees: string[];
  tags: Tag[];
  checklist: Array<{ text: string; isCompleted: boolean; position: number }>;
  startDate?: Date;
  dueDate?: Date;
}

const userStore = useAuthStore();
const userId = userStore.userInfo.id;

const form = ref<FormData>({
  title: '',
  description: '',
  priorityLabel: 'Средний',
  status: TaskStatusEnum.ACTIVE,
  assignees: [],
  tags: [],
  checklist: [],
  startDate: undefined,
  dueDate: undefined,
});

watch(
  () => props.isVisible,
  (visible) => {
    if (visible) {
      form.value = {
        title: '',
        description: '',
        priorityLabel: 'Средний',
        status: TaskStatusEnum.ACTIVE,
        assignees: [],
        tags: [],
        checklist: [],
        startDate: undefined,
        dueDate: undefined,
      };
    }
  }
);

const handleSubmit = () => {
  if (!form.value.title.trim()) return;

  const payload = {
    title: form.value.title.trim(),
    description: form.value.description.trim() || undefined,
    priority: priorityMap[form.value.priorityLabel],
    status: form.value.status,
    creator: userId,
    columnId: props.columnId,
    tags: form.value.tags,
  };

  emit('create', payload);
};

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) emit('close');
};
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isVisible"
      class="modal-mask"
      @click.self="emit('close')"
      @click="handleBackdropClick"
    >
      <div class="modal-container">
        <div class="modal-header">
          <p class="header-title">Создать задачу</p>
          <button class="modal-close-button" @click="emit('close')">&times;</button>
        </div>

        <div class="modal-body">
          <TaskForm v-model="form" :priority-labels="priorityLabels" />
        </div>

        <div class="modal-footer">
          <button class="submit-button" :disabled="!form.title.trim()" @click="handleSubmit">
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
