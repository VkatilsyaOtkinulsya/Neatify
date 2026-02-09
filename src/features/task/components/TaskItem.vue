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
  'drag-start': [];
  'drag-end': [];
}>();

const isDragging = ref(false);
const isLoading = ref(false);

const { mutate } = useDeleteTask(props.boardId);

const handleDelete = () => {
  mutate(props.id, {
    onSuccess: () => {
      alert('Task deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete task:', error);
    },
  });
};
</script>

<template>
  <div
    class="pl-3 py-2 rounded-lg bg-[#ffffff] border-gray-200 relative cusor-grab transition duration-200 ease-in-out cursor-pointer active:cursor-grabbing"
    :class="{
      'opacity-50 pointer-events-none': isLoading,
      'is-dragging': isDragging,
    }"
    draggable="true"
    @pointerdown.stop
    @mousedown.stop
    @dragstart="emit('drag-start')"
    @dragend="emit('drag-end')"
  >
    <div class="w-full flex justify-between mb-2.5">
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
