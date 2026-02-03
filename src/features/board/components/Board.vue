<script setup lang="ts">
import { useRoute } from 'vue-router';
import Column from './Column.vue';
import TaskItem from '@/features/task/components/TaskItem.vue';
import { useBoard } from '../composables/useBoard';
import AddColumnButton from './AddColumnButton.vue';
import { useCreateTask } from '@/api/queries/useTasks';
import { computed, defineAsyncComponent, ref } from 'vue';
import type { Task } from '@/features/task/types/task.types';
import { useBoardScroll } from '../composables/useBoardScroll';
import Loader from '@/components/ui/loader/Loader.vue';
import BoardHeader from './BoardHeader.vue';
import { useVirtualList} from '@vueuse/core';

const AddTaskModal = defineAsyncComponent(() => import('@/features/task/components/AddTask.vue'));

const route = useRoute();
const boardId = route.params.projectId as string;
const workspaceId = route.params.workspaceId as string;
const showModal = ref(false);
const currentColumnId = ref('');

const {
  board,
  title,
  createBoardColumn,
  handleDragStart: dragStart,
  handleDragEnd: dragEnd,
  handleDragOver,
  handleDrop,
  isLoadingBoard,
  isLoadingTasks,
  isError,
  tasksData,
} = useBoard(workspaceId, boardId);

const tasksByColumn = computed(() => tasksData.value?.tasksByColumn ?? {});

const { mutate } = useCreateTask(boardId);

const openTaskModal = (columnId: string) => {
  currentColumnId.value  = columnId;
  showModal.value = true;
}

const handleCreateTask = (data: Partial<Task>): void => {
  mutate(
    { ...data, boardId: boardId },
    {
      onSettled: () => {
        showModal.value = false;
      },
    }
  );
};

const handleCreateColumn = (title: string) => {
  const nextPosition = board.value?.columns.length || 0;

  createBoardColumn({
    title,
    position: nextPosition,
    color: '#c7c7c7',
    taskLimit: null,
  });
};

const { setDraggingTask, handleHorizontalScroll } = useBoardScroll();

const handleDragStart = (taskId: string) => {
  setDraggingTask(true);
  dragStart(taskId, setDraggingTask);
};

const handleDragEnd = () => {
  setDraggingTask(false);
  dragEnd(setDraggingTask);
};
</script>

<template>
  <div class="board-wrapper">
    <div v-if="isLoadingBoard || isLoadingTasks" class="board-loader">
      <Loader color="#4A5568" />
    </div>

    <div v-else-if="isError">Error loading board</div>

    <div v-else-if="board && tasksData" class="h-full">
      <BoardHeader :taskCount="tasksData.totalCount" />

      <div class="columns-container" @wheel="handleHorizontalScroll">
        <Column
          :class="[col.taskLimit ?? 'no-limit']"
          :color="col.color"
          v-for="col in board.columns"
          :key="col._id"
          @dragover="handleDragOver"
          @drop="(event: DragEvent) => handleDrop(col._id, event)"
        >
          <template #header>
            <p>{{ col.title }}</p>
          </template>

          <template #tasks-list>
            <TaskItem
              v-for="task in tasksByColumn[col._id] || []"
              :key="task.id"
              :id="task.id"
              :board-id="boardId"
              :tags="task.tags"
              :priority="task.priority"
              :checklist="task.checklist"
              draggable="true"
              @dragstart="handleDragStart(task.id)"
              @dragend="handleDragEnd"
            >
              <template #editable_title>{{ task.title }}</template>
            </TaskItem>
          </template>

          <template #add-task-button>
            <button
              v-if="col.taskLimit != (tasksByColumn[col._id]?.length ?? 0)""
              id="add-task-button"
              @click="openTaskModal(col._id)"
              class="add-task__button"
            >
              <div class="add-icon"></div>
              <p>Добавить задачу</p>
            </button>

            <p v-else class="align-center text-red-600">лимит задач</p>
          </template>
        </Column>
        <AddColumnButton @create="handleCreateColumn" />
      </div>
      <Teleport to="body">
        <AddTaskModal
          type="create"
          :is-visible="showModal"
          @create="handleCreateTask"
          @close="showModal = false"
          :column-id="currentColumnId"
        />
      </Teleport>
    </div>
  </div>
</template>

<style scoped lang="scss">
.board-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100% - 84px);
  padding-bottom: 26px;
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;
}

.columns-container {
  display: flex;
  flex: 1;
  align-items: flex-start;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.75rem 1.25rem 0 0.375rem;

  &:active {
    cursor: grabbing; // Курсор при зажатии
  }

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

.add-task__button {
  width: 100%;
  min-height: 40px;
  padding: 6px;

  border: 1px solid #ccc;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #dfdfdf;
    transform: scale(1.02);
  }
}

.dragging {
  opacity: 0.7;
  cursor: grabbing;
}

[draggable='true'] {
  cursor: grab;
}

[draggable='true']:active {
  cursor: grabbing;
}
</style>
