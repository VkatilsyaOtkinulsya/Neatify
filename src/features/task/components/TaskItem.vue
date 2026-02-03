<script setup lang="ts">
import Badge from '@/components/ui/badge/Badge.vue';
import { ref } from 'vue';
import TaskActionsMenu from './TaskActionsMenu.vue';
import { useDeleteTask } from '@/api/queries/useTasks';
import type { ChecklistItem } from '../types/task.types';

const props = defineProps<{
  id: string;
  boardId: string;
  tags: {
    title: string;
    color: string;
  }[];
  priority: string;
  checklist: ChecklistItem[];
}>();

const emit = defineEmits<{
  'drag-start': [taskId: string];
  'drag-end': [];
}>();

const isDragging = ref(false);
const isLoading = ref(false);
const taskRef = ref();

const handleClick = () => {
  console.log('clkc');
};

const { mutate } = useDeleteTask(props.boardId);

const handleDelete = () => {
  isLoading.value = true;
  mutate(props.id, {
    onSuccess: () => {
      alert('Task deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete task:', error);
    },
    onSettled: () => {
      isLoading.value = false;
    },
  });
};

const handleDragStart = (e: DragEvent) => {
  isDragging.value = true;

  // Передаем данные о задаче
  e.dataTransfer!.effectAllowed = 'move';
  e.dataTransfer!.setData('task-id', props.id);
  e.dataTransfer!.setData('task-type', 'task');

  // Визуальная обратная связь
  (e.target as HTMLElement).style.opacity = '0.5';

  emit('drag-start', props.id);
};

const handleDragEnd = (e: DragEvent) => {
  isDragging.value = false;
  (e.target as HTMLElement).style.opacity = '1';

  emit('drag-end');
};
</script>

<template>
  <div
    class="pl-3 py-2 border-1 rounded-ls border-gray-200 relative cusor-grab transition duration-200 ease-in-out active:cursor-grabbing"
    :class="{ 'opacity-50 pointer-events-none': isLoading, 'is-dragging': isDragging }"
    @click="handleClick"
    :ref="taskRef"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <
    <div class="w-full flex justify-between mb-2.5 cursor-pointer" @click="handleClick">
      <div class="flex items-start justify-between">
        <span class="flex text-sm text-shadow-sm">
          <slot name="editable_title"></slot>
        </span>
        <div class="absolute top-0 right-0 cursor-pointer rounded-full">
          <span aria-label="Изменить карточку">
            <TaskActionsMenu @delete="handleDelete" @complete="" @edit="" />
          </span>
        </div>
      </div>
    </div>

    <div class="flex w-full flex-wrap gap-2">
      <Badge v-for="b in tags" :key="b.title" :color="b.color">{{ b.title }}</Badge>
      <p class="text-muted-foreground text-sm">{{ priority }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
