<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, defineAsyncComponent, ref } from 'vue';

import Column from './Column.vue';
import ColumnsList from './ColumnsList.vue';
import AddColumnButton from './AddColumnButton.vue';
import Loader from '@/components/ui/loader/Loader.vue';

import { useBoard } from '../composables/useBoard';
import { useCreateTask } from '@/api/queries/useTasks';
import { useUpdateColumn } from '@/api/queries/useBoard';
import type { Task } from '@/features/task/types/task.types';
import { showNotification } from '@/shared/lib/utils/error-handler';

const TaskFormModal = defineAsyncComponent(() => import('@/features/task/components/TaskModal/TaskFormModal.vue'));

const route = useRoute();
const boardId = route.params.projectId as string;
const workspaceId = route.params.workspaceId as string;

const showModal = ref(false);
const currentColumnId = ref<string>('');
const currentTaskId = ref<string>('');

const {
  project: board,
  tasksData,
  isLoadingBoard,
  isLoadingTasks,
  isError,
  createBoardColumn,
  moveTask,
  moveColumn,
} = useBoard(workspaceId, boardId);

const editTask = computed(() => tasksData.value?.tasks.find((task) => task.id = currentTaskId.value))
const tasksByColumn = computed(() => tasksData.value?.tasksByColumn ?? {});

const { mutate: createTask, isPending } = useCreateTask(boardId);
const { mutate: updateColumnMutation } = useUpdateColumn(boardId);


// ---------- UI actions ----------

const openTaskModal = (columnId: string) => {
  currentColumnId.value = columnId;
  showModal.value = true;
};

const handleCreateTask = (data: Partial<Task>) => {
  createTask(
    { ...data, boardId },
    {
      onSettled: () => {
        showModal.value = false;
      },
      onError: () => {
        showNotification('Ошибка создания задачи', 'error');
      }
    }
  );
};

const handleCreateColumn = (title: string) => {
  const nextPosition = board.value?.columns.length ?? 0;

  createBoardColumn({
    title,
    position: nextPosition,
    color: '#c7c7c7',
    taskLimit: null,
  });
};

const handleUpdateColumn = (payload: { columnId: string; data: Partial<Task> }) => {
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

    <div v-else-if="board && tasksData" class="h-full" >

      <ColumnsList :columns="board.columns" :board-id="boardId" @column-drop="handleColumnDrop">
        <template #column="{ column }">
          <Column
            :column="column"
            :color="column.color"
            :tasks="tasksByColumn[column._id] || []"
            @task-drop="handleTaskDrop"
            @add-task="openTaskModal"
            @update-column="handleUpdateColumn"
            @edit-task="openTaskModal"
          >
            <template #add-task-button>
            <button
              v-if="column.taskLimit != (tasksByColumn[column._id]?.length ?? 0)""
              id="add-task-button"
              @click="openTaskModal(column._id)"
              class="add-task__button"
            >
              <div class="add-icon"></div>
              <p>{{ isPending ? 'Создается...' : 'Добавить задачу' }} </p>
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
          :column-id="currentColumnId"
          :task-data="editTask"
          @create="handleCreateTask"
          @close="showModal = false"
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
