<script setup lang="ts">
import { computed, ref } from 'vue';
import { useBoardDragStore } from '../boardDrag.store';
import TaskItem from '@/features/task/components/TaskItem.vue';
import type { Task } from '@/features/task/types/task.types';
import type { BoardColumn } from '../types/project.types';

const props = defineProps<{
  column: BoardColumn;
  color: string;
  tasks: Task[];
}>();

const emits = defineEmits<{
  'task-drop': [
    payload: {
      taskId: string;
      fromColumnId: string;
      toColumnId: string;
      beforeTaskId?: string;
      afterTaskId?: string;
    },
  ];
  'column-drag-start': [payload: { columnId: string }];
  'column-drag-end': [];
}>();

const dragStore = useBoardDragStore();
const hoverIndex = ref<number | null>(null);

const orderedTasks = computed(() => [...props.tasks].sort((a, b) => a.position - b.position));
const isEmpty = computed(() => orderedTasks.value.length === 0);

const getTaskNeighbors = (index: number) => {
  const tasks = orderedTasks.value;

  return {
    afterTaskId: tasks[index - 1]?.id,
    beforeTaskId: tasks[index]?.id,
  };
};

const handleDragOverZone = (event: DragEvent, index: number) => {
  if (!dragStore.isTaskDragging) return;
  event.preventDefault();
  hoverIndex.value = index;
};

const handleDragLeaveZone = () => {
  hoverIndex.value = null;
};

const handleDrop = (index: number) => {
  const drag = dragStore.dragState;
  if (!drag || drag.type !== 'task') return;

  const { beforeTaskId, afterTaskId } = getTaskNeighbors(index);
  emits('task-drop', {
    taskId: drag.taskId,
    fromColumnId: drag.fromColumnId,
    toColumnId: props.column._id,
    beforeTaskId,
    afterTaskId,
  });

  hoverIndex.value = null;
  dragStore.clear();
};

// ---------- column DnD ----------

const handleColumnDragStart = () => {
  emits('column-drag-start', { columnId: props.column._id });
};

const handleColumnDragEnd = () => {
  emits('column-drag-end');
};
</script>

<template>
  <div class="column-container">
    <div class="column" :style="{ backgroundColor: color }">
      <div
        class="column-header cursor-grab active:cursor-grabbing"
        draggable="true"
        @dragstart="handleColumnDragStart"
        @dragend="handleColumnDragEnd"
      >
        <slot name="header" />
      </div>
      <div class="column-content">
        <div class="tasks-list" ref="listRef">
          <div
            class="drop-zone"
            :class="{ active: hoverIndex === 0, 'is-empty': isEmpty }"
            @dragover="(e: DragEvent) => handleDragOverZone(e, 0)"
            @dragleave="handleDragLeaveZone"
            @drop="() => handleDrop(0)"
          />

          <template v-for="(task, index) in orderedTasks" :key="task.id">
            <TaskItem
              data-task-item
              :id="task.id"
              :board-id="task.boardId"
              :tags="task.tags"
              :priority="task.priority"
              :checklist="task.checklist"
              @drag-start="dragStore.startTaskDrag(task.id, props.column._id)"
              @drag-end="dragStore.clear"
            >
              <template #editable_title>
                {{ task.title }}
              </template>
            </TaskItem>

            <div
              class="drop-zone"
              :class="{ active: hoverIndex === index + 1 }"
              @dragover="(e) => handleDragOverZone(e, index + 1)"
              @dragleave="handleDragLeaveZone"
              @drop="() => handleDrop(index + 1)"
            />
          </template>
        </div>
      </div>
      <div class="add-task">
        <slot name="add-task-button"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.column-container {
  min-height: 100%;
  padding: 0 6px;
}

.column {
  display: flex;
  flex-direction: column;
  min-width: 17rem;
  height: 100%;
  max-height: 100%;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid #333333;
  border-radius: 0.75rem;
  box-shadow: 0px 0px 12px 3px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  .column-header {
    height: 40px;
    padding-top: 8px;
    padding-left: 12px;
  }

  .column-content {
    flex: 1 1 auto;
    margin-top: -8px;
    padding: 0.5rem 0.25rem 0;

    .tasks-list {
      display: flex;
      flex-direction: column;
      padding: 0 0.25rem;
      overflow-y: auto;
    }

    .drop-zone {
      height: 8px;
      transition:
        height 0.3s ease,
        background-color 0.15s ease;
      pointer-events: auto;
    }

    .drop-zone.active {
      height: 40px;
      background-color: rgba(59, 130, 246, 0.15);
      border-radius: 4px;
    }

    .drop-zone.is-empty {
      flex-grow: 1;
      min-height: 5rem;
    }
  }

  .add-task {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px 10px;
  }
}
</style>
