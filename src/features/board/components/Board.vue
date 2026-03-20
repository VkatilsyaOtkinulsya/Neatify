<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, defineAsyncComponent } from 'vue';

import Column from './Column.vue';
import ColumnsList from './ColumnsList.vue';
import AddColumnButton from './AddColumnButton.vue';
import Loader from '@/components/ui/loader/Loader.vue';

import { useBoardActions, useBoardData } from '../composables/useBoard';
import type { BoardColumn } from '../types/project.types';
import { useBoardTasks } from '../composables/useBoardTasks';
import { useTaskModal } from '../composables/useTaskModal';
import { useUpdateColumn } from '@/api/queries/useBoard';

const TaskFormModal = defineAsyncComponent(
  () => import('@/features/task/components/TaskModal/TaskModal.vue')
);

const route = useRoute();
const boardId = route.params.projectId as string;
const workspaceId = route.params.workspaceId as string;

const {
  project: board,
  tasksData,
  isLoadingBoard,
  isLoadingTasks,
  isError,
} = useBoardData(workspaceId, boardId);
const { createBoardColumn, moveTask, moveColumn } = useBoardActions(boardId);
const { create, update, isPending } = useBoardTasks(boardId);
const { mutate: updateColumnMutation } = useUpdateColumn(boardId);

const { showModal, currentColumnId, editingTask, openCreate, openEdit, close } = useTaskModal();

const tasksByColumn = computed(() => tasksData.value?.tasksByColumn ?? {});

const canAddTask = (column: BoardColumn) =>
  column.taskLimit === null || (tasksByColumn.value[column._id]?.length ?? 0) < column.taskLimit;

// ---------- UI actions ----------

const handleCreateColumn = (title: string) => {
  const nextPosition = board.value?.columns.length ?? 0;

  createBoardColumn({
    title,
    position: nextPosition,
    color: '#c7c7c7',
    taskLimit: null,
  });
};

const handleUpdateColumn = (payload: { columnId: string; data: Partial<BoardColumn> }) => {
  updateColumnMutation({ columnId: payload.columnId, data: payload.data });
};

// ---------- DnD intentions ----------

const handleTaskDrop = (payload: {
  taskId: string;
  fromColumnId: string;
  toColumnId: string;
  beforeTaskId?: string;
  afterTaskId?: string;
}) => {
  moveTask(payload);
};

const handleColumnDrop = (columnId: string, toIndex: number) => {
  moveColumn({ columnId, position: toIndex });
};
</script>

<template>
  <div class="board-wrapper">
    <div v-if="isLoadingBoard || isLoadingTasks" class="board-loader">
      <Loader color="#4A5568" />
    </div>

    <div v-else-if="isError">Error loading board</div>

    <div v-else-if="board && tasksData" class="h-full">
      <ColumnsList :columns="board.columns" :board-id="boardId" @column-drop="handleColumnDrop">
        <template #column="{ column }">
          <Column
            :column="column"
            :color="column.color"
            :tasks="tasksByColumn[column._id] || []"
            @task-drop="handleTaskDrop"
            @update-column="handleUpdateColumn"
            @edit-task="openEdit"
          >
            <template #add-task-button>
              <button
                v-if="canAddTask(column)"
                id="add-task-button"
                @click="openCreate(column._id)"
                class="add-task__button"
              >
                <div class="add-icon"></div>
                <p>{{ isPending ? 'Создается...' : 'Добавить задачу' }}</p>
              </button>

              <p v-else class="align-center text-red-600">лимит задач</p>
            </template>
          </Column>
        </template>

        <template #add-column>
          <AddColumnButton @create="handleCreateColumn" />
        </template>
      </ColumnsList>

      <Teleport to="body">
        <TaskFormModal
          :is-visible="showModal"
          :column-id="editingTask ? editingTask.columnId : currentColumnId"
          :task-data="editingTask"
          @create="(data) => create(data, close)"
          @update="({ id, data }) => update(id, data, close)"
          @close="close"
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
