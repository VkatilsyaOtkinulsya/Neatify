<script setup lang="ts">
import Badge from '@/components/ui/badge/Badge.vue';
import { computed, ref } from 'vue';
import TaskActionsMenu from './TaskActionsMenu.vue';
import { useCompleteTask, useDeleteTask } from '@/api/queries/useTasks';
import { showNotification } from '@/shared/lib/utils/error-handler';
import { TaskPriorityMap } from '../types/priority.config';
import Tooltip from '@/components/ui/tooltip/Tooltip.vue';
import { CircleUser, Clock, Paperclip, SquareCheckBig } from 'lucide-vue-next';
import type { TaskCardData } from '../types/task.types';
import { df, formatDueDate } from '@/shared/lib/utils/formatDate';

const props = defineProps<{
  task: TaskCardData;
}>();
const { task } = props;

const emit = defineEmits<{
  'drag-start': [];
  'drag-end': [];
}>();

const isDragging = ref(false);
const isLoading = ref(false);
const elRef = ref<HTMLElement | null>(null);

const deleteTask = useDeleteTask(task.boardId);
const completeTask = useCompleteTask(task.boardId);

const handleDelete = () => {
  deleteTask.mutate(task.id, {
    onSuccess: () => {
      alert('Task deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete task:', error);
    },
  });
};

const handleComplete = () => {
  completeTask.mutate(task.id, {
    onSuccess: () => {
      showNotification('Task complete successfully', 'success');
    },
    onError: (error) => {
      console.error('Failed to complete task:', error);
    },
  });
};

const priorityComponent = computed(() => {
  return TaskPriorityMap[task.priority] ?? null;
});
</script>

<template>
  <div
    class="pl-3 py-2 rounded-md bg-[#ffffff] border-gray-200 relative cusor-grab transition duration-200 ease-in-out cursor-pointer active:cursor-grabbing"
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
    <div class="flex w-full gap-1 opacity-90 mb-2 pr-8">
      <Badge
        v-for="b in task.tags"
        :key="b.title"
        :color="b.color"
        class="rounded-xs text-xs leading-3 px-1"
        >{{ b.title }}</Badge
      >
    </div>
    <div class="w-full flex justify-between mb-1">
      <div class="flex relative items-start justify-between">
        <div
          ref="elRef"
          class="absolute top-0 -left-1 flex items-center gap-1 text-muted-foreground text-sm"
          tabindex="0"
        >
          <component
            v-if="priorityComponent"
            :is="priorityComponent"
            class="w-4 h-4"
            :class="{
              'text-red-500': task.priority === 'urgent',
            }"
          />
        </div>
        <Tooltip :target="elRef" :text="task.priority" position="top"></Tooltip>
        <div class="flex pl-4 pr-2 text-sm text-shadow-sm">
          <slot name="editable_title"></slot>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 h-6 items-center relative">
      <div v-if="task.assignees" class="absolute top-0 -left-1 opacity-90"><CircleUser /></div>
      <div v-if="task.dueDate" class="flex items-center ml-7 p-0.75 rounded-xs bg-amber-400">
        <Clock class="w-4 h-4 mr-0.5" />
        <p class="text-xs">{{ df.format(new Date(task.dueDate)) }}</p>
      </div>
      <div v-if="task.checklist" class="flex">
        <SquareCheckBig class="w-4 h-4" />
        <p class="text-xs">{{ task.checklist.completed }} / {{ task.checklist.total }}</p>
      </div>
      <div v-if="task.attachment" class="flex">
        <Paperclip class="w-4 h-4" />
        <p class="text-xs">{{ task.attachment }}</p>
      </div>
    </div>

    <!-- Actinos -->
    <div class="absolute top-0 right-0 cursor-pointer rounded-full">
      <span aria-label="Изменить карточку">
        <TaskActionsMenu @delete="handleDelete" @complete="handleComplete" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
